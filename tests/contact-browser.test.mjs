import { test } from 'node:test';
import assert from 'node:assert/strict';
import { messageOf } from '../src/contact-message.mjs';

async function browser(host, tokens = []) {
  const originals = { document: globalThis.document, location: globalThis.location, window: globalThis.window, fetch: globalThis.fetch };
  const listeners = {};
  const node = () => ({ hidden: false, value: '', textContent: '', classList: { toggle() {} }, setAttribute() {}, removeAttribute() {}, focus() {}, addEventListener(type, fn) { this[type] = fn; } });
  const elements = Object.fromEntries(['previous', 'next', 'step-count', 'notice-mail', 'notice-sent', 'notice-error', 'mail-link', 'sent-channel', 'contact-label', 'contact-error', 'name-error', 'problem-error'].map(id => [id, node()]));
  const fields = { name: { ...node(), id: 'name', name: 'name', value: 'Laura' }, business: node(), channel: { value: 'email' }, contact: { ...node(), id: 'contact', name: 'contact', value: 'laura@example.com' }, problem: { ...node(), id: 'problem', name: 'problem', value: 'Necesito ayuda con el stock.' }, website: node() };
  const steps = [fields.name, fields.contact, fields.problem].map(field => ({ hidden: false, querySelectorAll: () => [field], querySelector: () => node() }));
  const progress = [node(), node(), node()];
  const form = { elements: fields, querySelectorAll: selector => selector === '.contact-step' ? steps : [], addEventListener(type, fn) { listeners[type] = fn; } };
  let calls = []; let resets = 0;
  globalThis.location = { hostname: host };
  globalThis.window = { turnstile: { render: () => 'widget', getResponse: () => tokens[0] || '', reset: () => { resets++; tokens.shift(); } } };
  globalThis.document = { querySelector: selector => selector === '#contact-form' ? form : elements[selector.slice(1)], querySelectorAll: () => progress, getElementById: id => elements[id], createElement: () => ({}), head: { append(script) { script.onload(); } } };
  globalThis.fetch = async (url, init) => { calls.push({ url, init }); return { ok: calls.length > 1, status: 503 }; };
  await import(`../src/contact.mjs?test=${Math.random()}`);
  const click = async () => { elements.next.click(); await new Promise(resolve => setImmediate(resolve)); };
  return { elements, fields, calls, click, resets: () => resets, cleanup() { Object.assign(globalThis, originals); } };
}

test('GitHub mirror offers a populated mailto without fetching', async () => {
  const b = await browser('tanoluchi.github.io');
  try {
    await b.click(); await b.click(); await b.click();
    assert.equal(b.calls.length, 0); assert.equal(b.elements['notice-mail'].hidden, false);
    const [address, query] = b.elements['mail-link'].href.split('?');
    assert.equal(address, 'mailto:hola@paranexo.com');
    const params = new URLSearchParams(query);
    assert.deepEqual({ subject: params.get('subject'), body: params.get('body') }, messageOf({ name: 'Laura', business: '', channel: 'email', contact: 'laura@example.com', topics: [], problem: 'Necesito ayuda con el stock.', website: '' }));
  } finally { b.cleanup(); }
});

test('failed send resets the challenge and retry uses a fresh token', async () => {
  const b = await browser('paranexo.com', ['first', 'second']);
  try {
    await b.click(); await b.click(); await b.click();
    assert.equal(b.elements['notice-error'].hidden, false); assert.equal(b.resets(), 1);
    await b.click(); assert.equal(b.resets(), 2); assert.equal(b.elements['notice-sent'].hidden, false);
    assert.deepEqual(b.calls.map(call => JSON.parse(call.init.body).turnstileToken), ['first', 'second']);
  } finally { b.cleanup(); }
});

test('missing or expired challenge token cannot be submitted', async () => {
  const b = await browser('paranexo.com', ['']);
  try { await b.click(); await b.click(); await b.click(); assert.equal(b.calls.length, 0); assert.equal(b.elements['notice-error'].hidden, false); }
  finally { b.cleanup(); }
});
