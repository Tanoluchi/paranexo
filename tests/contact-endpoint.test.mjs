import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sendContact, RESEND_URL } from '../src/contact-endpoint.mjs';

const valid = {
  name: 'Laura Gómez',
  business: 'Ferretería del Centro',
  channel: 'email',
  contact: 'laura@ferreteria.com',
  topics: ['Stock y pedidos', 'Web y catálogo'],
  problem: 'Cargo el mismo pedido dos veces, en el papel y en la planilla.',
  website: '', // honeypot
};

function spy(result = { ok: true, status: 200 }) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    return result;
  };
  return { calls, fetchImpl };
}

const run = (data, options = {}) => {
  const { calls, fetchImpl } = spy(options.result);
  return sendContact(data, { apiKey: 're_test', fetchImpl, ...options }).then(res => ({ res, calls }));
};

test('a valid request sends one email through Resend from the domain address', async () => {
  const { res, calls } = await run(valid);
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { ok: true });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, RESEND_URL);
  assert.equal(calls[0].init.method, 'POST');
  assert.equal(calls[0].init.headers.Authorization, 'Bearer re_test');
  const sent = JSON.parse(calls[0].init.body);
  assert.equal(sent.from, 'Paranexo <hola@paranexo.com>');
  assert.deepEqual(sent.to, ['hola@paranexo.com']);
  assert.equal(sent.reply_to, 'laura@ferreteria.com');
  assert.equal(sent.subject, 'Consulta de Ferretería del Centro');
  assert.match(sent.text, /Nombre: Laura Gómez/);
  assert.match(sent.text, /Responder por email: laura@ferreteria\.com/);
  assert.match(sent.text, /Temas: Stock y pedidos, Web y catálogo/);
});

test('a WhatsApp contact is answered by WhatsApp, so the email carries no reply_to', async () => {
  const { res, calls } = await run({ ...valid, channel: 'whatsapp', contact: '379 412-3456' });
  assert.equal(res.status, 200);
  const sent = JSON.parse(calls[0].init.body);
  assert.equal(sent.reply_to, undefined);
  assert.match(sent.text, /Responder por WhatsApp: 379 412-3456/);
});

test('a filled honeypot is dropped without sending and still answers ok', async () => {
  const { res, calls } = await run({ ...valid, website: 'http://spam.example' });
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { ok: true });
  assert.equal(calls.length, 0);
});

test('server-side validation rejects an invalid email without calling Resend', async () => {
  const { res, calls } = await run({ ...valid, contact: 'no-es-un-email' });
  assert.equal(res.status, 400);
  assert.match(res.body.error, /email/i);
  assert.equal(calls.length, 0);
});

test('server-side validation rejects a too-short problem and a too-short name', async () => {
  const short = await run({ ...valid, problem: 'ayuda' });
  assert.equal(short.res.status, 400);
  assert.equal(short.calls.length, 0);
  const nameless = await run({ ...valid, name: 'L' });
  assert.equal(nameless.res.status, 400);
  assert.equal(nameless.calls.length, 0);
});

test('oversized fields are rejected so the endpoint cannot be used as a bulk relay', async () => {
  const { res, calls } = await run({ ...valid, problem: 'x'.repeat(4001) });
  assert.equal(res.status, 400);
  assert.equal(calls.length, 0);
});

test('a Resend rejection is reported as an upstream failure, not a success', async () => {
  const { res, calls } = await run(valid, { result: { ok: false, status: 422 } });
  assert.equal(res.status, 502);
  assert.match(res.body.error, /422/);
  assert.equal(calls.length, 1);
});

test('a network failure is reported as an upstream failure', async () => {
  const res = await sendContact(valid, {
    apiKey: 're_test',
    fetchImpl: async () => { throw new Error('boom'); },
  });
  assert.equal(res.status, 502);
  assert.match(res.body.error, /boom/);
});

test('without an API key nothing is attempted and the caller is told it is not configured', async () => {
  const { res, calls } = await run(valid, { apiKey: '' });
  assert.equal(res.status, 503);
  assert.match(res.body.error, /not configured/i);
  assert.equal(calls.length, 0);
});

test('the published form posts to the Pages Function that reads the secret from the environment', async () => {
  const { readFileSync } = await import('node:fs');
  const { CONTACT } = await import('../src/contact-message.mjs');
  assert.equal(CONTACT.endpoint, '/api/contact');
  const fn = readFileSync(new URL('../functions/api/contact.js', import.meta.url), 'utf8');
  assert.match(fn, /onRequestPost/);
  assert.match(fn, /sendContact/);
  assert.match(fn, /env\.RESEND_API_KEY/);
  assert.doesNotMatch(fn, /re_[A-Za-z0-9]{8,}/); // no key in the repository
});

test('unverified requests and simple cross-origin requests cannot send mail', async () => {
  const { onRequestPost } = await import('../functions/api/contact.js');
  const plain = new Request('https://paranexo.com/api/contact', { method: 'POST', headers: { 'Content-Type': 'text/plain', Origin: 'https://evil.example' }, body: JSON.stringify(valid) });
  assert.equal((await onRequestPost({ request: plain, env: {} })).status, 415);
  const json = new Request('https://paranexo.com/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(valid) });
  assert.equal((await onRequestPost({ request: json, env: {} })).status, 503);
});

test('Turnstile verifies the token and hostname before sending', async () => {
  const { onRequestPost } = await import('../functions/api/contact.js');
  const original = globalThis.fetch; const calls = [];
  try {
    globalThis.fetch = async (url) => { calls.push(url); return url.includes('siteverify') ? { ok: true, json: async () => ({ success: true, hostname: 'evil.example' }) } : { ok: true }; };
    const request = new Request('https://paranexo.com/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...valid, turnstileToken: 'test-token' }) });
    const result = await onRequestPost({ request, env: { TURNSTILE_SECRET_KEY: 'test-secret', RESEND_API_KEY: 'test-key' } });
    assert.equal(result.status, 403); assert.equal(calls.length, 1);
  } finally { globalThis.fetch = original; }
});

test('only a successful verification for paranexo.com reaches Resend', async () => {
  const { onRequestPost } = await import('../functions/api/contact.js');
  const original = globalThis.fetch;
  try {
    for (const [verification, expected, count] of [[{ success: true, hostname: 'paranexo.com' }, 200, 2], [{ success: false, hostname: 'paranexo.com' }, 403, 1]]) {
      const calls = []; globalThis.fetch = async url => { calls.push(url); return calls.length === 1 ? { ok: true, json: async () => verification } : { ok: true }; };
      const request = new Request('https://paranexo.com/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...valid, turnstileToken: 'token' }) });
      assert.equal((await onRequestPost({ request, env: { TURNSTILE_SECRET_KEY: 'test', RESEND_API_KEY: 'test' } })).status, expected); assert.equal(calls.length, count);
    }
  } finally { globalThis.fetch = original; }
});

test('alternate Pages host cannot reach verification or email', async () => {
  const { onRequestPost } = await import('../functions/api/contact.js'); const original = globalThis.fetch; let calls = 0;
  try { globalThis.fetch = async () => { calls++; throw new Error('unexpected fetch'); };
    const request = new Request('https://paranexo.pages.dev/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...valid, turnstileToken: 'token' }) });
    assert.equal((await onRequestPost({ request, env: { TURNSTILE_SECRET_KEY: 'test', RESEND_API_KEY: 'test' } })).status, 403); assert.equal(calls, 0);
  } finally { globalThis.fetch = original; }
});

test('verification errors, missing, oversized and reused tokens never reach Resend', async () => {
  const { onRequestPost } = await import('../functions/api/contact.js'); const original = globalThis.fetch;
  try {
    for (const [token, mode, expected, count] of [['', 'success', 403, 0], ['x'.repeat(2049), 'success', 403, 0], ['token', 'network', 503, 1], ['token', 'http', 403, 1], ['token', 'reused', 403, 1]]) {
      const calls = []; globalThis.fetch = async url => { calls.push(url); if (mode === 'network') throw new Error('offline'); return { ok: mode !== 'http', json: async () => ({ success: mode === 'success', hostname: 'paranexo.com', 'error-codes': ['timeout-or-duplicate'] }) }; };
      const request = new Request('https://paranexo.com/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...valid, turnstileToken: token }) });
      assert.equal((await onRequestPost({ request, env: { TURNSTILE_SECRET_KEY: 'test', RESEND_API_KEY: 'test' } })).status, expected); assert.equal(calls.length, count);
    }
  } finally { globalThis.fetch = original; }
});
