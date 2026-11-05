// Server side of the contact form. The browser in src/contact.mjs is untrusted:
// everything is revalidated here before one email is handed to Resend.
import { CONTACT, messageOf, payloadOf } from './contact-message.mjs';

export const RESEND_URL = 'https://api.resend.com/emails';

const MAX = { name: 120, business: 120, contact: 180, problem: 4000, topics: 12 };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// JSON from the outside: anything not an array of topics is simply no topics.
const normalize = raw => {
  const data = raw && typeof raw === 'object' ? raw : {};
  return { ...data, topics: Array.isArray(data.topics) ? data.topics : [] };
};

export function problemOf(raw) {
  const d = payloadOf(normalize(raw));
  if (d.name.length < 2) return 'a name of at least 2 characters is required';
  if (d.name.length > MAX.name) return 'name is too long';
  if (d.business.length > MAX.business) return 'business is too long';
  if (d.contact.length > MAX.contact) return 'contact is too long';
  if (d.channel === 'email' && !EMAIL.test(d.contact)) return 'contact email is invalid';
  if (d.channel === 'whatsapp' && d.contact.replace(/\D/g, '').length < 10) return 'contact WhatsApp number is invalid';
  if (d.topics.length > MAX.topics) return 'too many topics';
  if (d.problem.length < 15) return 'problem must be at least 15 characters';
  if (d.problem.length > MAX.problem) return 'problem is too long';
  return '';
}

export function emailOf(raw, to = CONTACT.email) {
  const d = payloadOf(normalize(raw));
  const { subject, body } = messageOf(d);
  const email = { from: `Paranexo <${CONTACT.email}>`, to: [to], subject, text: body };
  if (d.channel === 'email') email.reply_to = d.contact;
  return email;
}

export async function sendContact(raw, { apiKey, to = CONTACT.email, fetchImpl = globalThis.fetch } = {}) {
  const data = payloadOf(normalize(raw));
  // Honeypot: a bot gets the same answer as a person and nothing is sent.
  if (data.website) return { status: 200, body: { ok: true } };
  const problem = problemOf(data);
  if (problem) return { status: 400, body: { error: problem } };
  if (!apiKey) return { status: 503, body: { error: 'email is not configured' } };
  try {
    const response = await fetchImpl(RESEND_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(emailOf(data, to)),
    });
    if (!response.ok) return { status: 502, body: { error: `Resend responded ${response.status}` } };
    return { status: 200, body: { ok: true } };
  } catch (error) {
    return { status: 502, body: { error: `Resend request failed: ${error.message}` } };
  }
}
