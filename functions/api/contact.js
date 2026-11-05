// Cloudflare Pages Function: POST /api/contact
// The logic lives in src/contact-endpoint.mjs so `node --test` can cover it.
import { sendContact } from '../../src/contact-endpoint.mjs';

const json = (body, status) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

export async function onRequestPost({ request, env }) {
  if (new URL(request.url).hostname !== 'paranexo.com') return json({ error: 'invalid host' }, 403);
  if (!/^application\/json(?:\s*;|\s*$)/i.test(request.headers.get('Content-Type') || '')) {
    return json({ error: 'JSON content type required' }, 415);
  }
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'invalid JSON body' }, 400);
  }
  if (!env.TURNSTILE_SECRET_KEY) return json({ error: 'verification is not configured' }, 503);
  if (typeof payload?.turnstileToken !== 'string' || !payload.turnstileToken || payload.turnstileToken.length > 2048) {
    return json({ error: 'verification required' }, 403);
  }
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: payload.turnstileToken }),
    });
    const result = await response.json();
    if (!response.ok || result.success !== true || result.hostname !== 'paranexo.com') {
      return json({ error: 'verification failed' }, 403);
    }
  } catch {
    return json({ error: 'verification unavailable' }, 503);
  }
  const { status, body } = await sendContact(payload, { apiKey: env.RESEND_API_KEY });
  return json(body, status);
}

export const onRequest = () => json({ error: 'use POST' }, 405);
