// Cloudflare Pages Function: POST /api/contact
// The logic lives in src/contact-endpoint.mjs so `node --test` can cover it.
import { sendContact } from '../../src/contact-endpoint.mjs';

const json = (body, status) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

export async function onRequestPost({ request, env }) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'invalid JSON body' }, 400);
  }
  const { status, body } = await sendContact(payload, { apiKey: env.RESEND_API_KEY });
  return json(body, status);
}

export const onRequest = () => json({ error: 'use POST' }, 405);
