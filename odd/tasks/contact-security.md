# Contact security
Branch: `rename-paranexo` · Delivery: ask-on-risk · Runner: `node --test tests/*.test.mjs`

## Specs
S1. "Quiero proteger el formulario de contacto con Cloudflare Turnstile y un límite moderado de solicitudes por IP, solo si ambos están disponibles gratis en mi cuenta."
S2. "Encontró que el endpoint puede agotar la cuota de Resend y acepta solicitudes cross-origin como text/plain; también que el formulario del espejo GitHub Pages apunta a un endpoint inexistente."
S3. "No publiques hasta verificar los cambios."
S4. "Después de las correcciones y pruebas, ayudame a completar el force-push del historial reescrito, verificar el despliegue y configurar Gmail para enviar como hola@paranexo.com."
S5. "Si algo requiere un plan pago, mi intervención o una decisión, avisame antes." "no expongas claves ni secretos."

## Tasks
T1 [S1,S2] route=delegated status=done commit=pending: implementation, 92 tests, independent verification and simulated browser flows passed.
T2 [S1,S3,S5] route=inline status=in_progress commit=pending: configure free account protections safely, verify and obtain independent verification and native review if due.
T3 [S3,S4,S5] route=inline status=pending commit=pending: help complete force-push, verify deployment and Gmail setup.

## Log
L1. Continuá el trabajo pendiente de Paranexo en ~/projects/puente_nea.

   Quiero proteger el formulario de contacto con Cloudflare Turnstile y un límite moderado de solicitudes por IP, solo si
 ambos están disponibles gratis en mi cuenta. Revisá primero el estado actual y la memoria del proyecto; no expongas claves ni
 secretos.

   La revisión nativa pendiente es review-ea495dae6b6854bb. Encontró que el endpoint puede agotar la cuota de Resend y acepta
 solicitudes cross-origin como text/plain; también que el formulario del espejo GitHub Pages apunta a un endpoint inexistente.
 Continuá desde el estado que indique la revisión y corregí esos problemas. No publiques hasta verificar los cambios.

   El formulario usa Resend y Cloudflare Pages. Después de las correcciones y pruebas, ayudame a completar el force-push del
 historial reescrito, verificar el despliegue y configurar Gmail para enviar como hola@paranexo.com.

   Si algo requiere un plan pago, mi intervención o una decisión, avisame antes.
L2. Trata los tres problemas como una correcion nueva
L3. Native status did not find prior review authority. Free Website plan; no rate-limit entrypoint and zero listed Turnstile widgets. Free WAF rate limits use 10-second windows and are approximate, not a hard quota.
L4. Independent verification: text/plain rejected; missing browser and server failure coverage and unconfigured widget blocked S1/S2. Initial suite 87 passed. Correction in progress.
L5. Created free managed Turnstile widget for paranexo.com and saved its secret as a Pages production secret; confirmed existing Resend secret remains configured. No deployment or WAF rule published.
L6. Correction uses public sitekey, rejects alternate Pages hosts and includes simulated browser and endpoint failure tests. Full suite 92 passed; focused independent re-verification 25 passed, with real-browser evidence still missing. playwright-cli browser launch failed because its socket directory path was too long. Native assessment was unassessable with untracked files; no native review completed. No push, WAF publication or deploy.
L7. Te habilito que abras un navgeador prueba accesible en esta sesion
L8. Real browser at 375, 768 and 1280 px passed form flow, simulated success and failure/retry, missing token and simulated GitHub fallback. Initial navigation loaded real Turnstile before interception and contacted Cloudflare unintentionally; no form or email sent. Actual widget and delivery remain unverified until deployment.
