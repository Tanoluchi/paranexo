import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { CONTACT, messageOf, mailtoHref, payloadOf } from '../src/contact-message.mjs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const sample = { name: ' Laura Gómez ', business: '', channel: 'whatsapp', contact: '379 412-3456', topics: ['Planillas y stock'], problem: 'Llevamos el stock en tres planillas.', website: '' };

test('contact destinations: confirmed email and Pages Function endpoint', () => {
  assert.equal(CONTACT.email, 'hola@paranexo.com');
  assert.equal(CONTACT.whatsapp, undefined);
  assert.equal(CONTACT.endpoint, '/api/contact');
});

test('the message names the person when the business is left empty', () => {
  const { subject, body } = messageOf(sample);
  assert.equal(subject, 'Consulta de Laura Gómez');
  assert.match(body, /^Nombre: Laura Gómez$/m);
  assert.match(body, /^Negocio: Sin indicar$/m);
  assert.match(body, /^Responder por WhatsApp: 379 412-3456$/m);
  assert.match(body, /^Temas: Planillas y stock$/m);
  assert.match(body, /Llevamos el stock en tres planillas\.$/);
  assert.equal(messageOf({ ...sample, business: 'Ferretería del Centro', topics: [] }).subject, 'Consulta de Ferretería del Centro');
  assert.match(messageOf({ ...sample, topics: [] }).body, /^Temas: Sin marcar$/m);
});

test('mailto opens a prefilled email to the team address', () => {
  const href = mailtoHref(sample);
  assert.ok(href.startsWith('mailto:hola@paranexo.com?subject='));
  const params = new URLSearchParams(href.split('?')[1]);
  assert.deepEqual({ subject: params.get('subject'), body: params.get('body') }, messageOf(sample));
});

test('the backend payload is trimmed and keeps the honeypot for the server to check', () => {
  assert.deepEqual(payloadOf(sample), { name: 'Laura Gómez', business: '', channel: 'whatsapp', contact: '379 412-3456', topics: ['Planillas y stock'], problem: 'Llevamos el stock en tres planillas.', website: '' });
});

test('the contact page offers real destinations, a honeypot and the privacy policy', () => {
  const page = read('contacto/index.html');
  assert.doesNotMatch(page, /envío todavía no está habilitado|todavía no se envían ni se guardan/i);
  assert.match(page, new RegExp(`href="mailto:${CONTACT.email}"`));
  assert.doesNotMatch(page, /https:\/\/(?:wa\.me|api\.whatsapp\.com)\//i);
  assert.match(page, /name="channel" value="whatsapp"/);
  assert.match(page, /<input[^>]*name="website"[^>]*tabindex="-1"/);
  assert.match(page, /href="\.\.\/privacidad\.html"/);
  for (const id of ['notice-mail', 'notice-sent', 'notice-error']) assert.match(page, new RegExp(`id="${id}"[^>]*hidden`));
});

test('the privacy policy exists and names the law, the data and how to reach us', () => {
  assert.ok(existsSync(new URL('../privacidad.html', import.meta.url)));
  const page = read('privacidad.html');
  assert.match(page, /Ley 25\.326/);
  assert.match(page, new RegExp(CONTACT.email.replace('.', '\\.')));
  assert.match(page, /<h1[^>]*>Política de privacidad<\/h1>/);
  assert.match(page, /href="\.\/styles\/landing\.css"/);
});
