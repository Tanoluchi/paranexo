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
