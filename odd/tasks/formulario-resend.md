# Formulario con Resend (paranexo.com)
Branch: `rename-paranexo` · Runner: `node --test tests/*.test.mjs` · Host de la función: Cloudflare Pages (`functions/`), espejo en GitHub Pages sin endpoint.
Dominio de envío ya creado y verificado en Resend (`315ed2e3-eea5-4591-8472-e11dac27233a`, región `sa-east-1`, DKIM `resend._domainkey` + CNAME `send`/`rsend` publicados, MX de Email Routing intactos en el apex).

## Specs
S1. Alcance: "Las dos cosas" — el correo de respuesta tiene que salir como `hola@paranexo.com` (Gmail «Enviar como») **y** el formulario de contacto tiene que enviarse solo, sin abrir el cliente de correo del visitante.
S2. Dominio: "paranexo.com (raíz)" — el remitente es `hola@paranexo.com`, no un subdominio.
S3. El formulario conserva su experiencia: los mismos tres pasos, los mismos mensajes de error, los mismos tres avisos (`notice-mail`, `notice-sent`, `notice-error`). Cambia el transporte, no la UX. Derivado de S1 por `src/contact.mjs:84-100`, que ya distingue `CONTACT.endpoint` vacío (mailto) de configurado (POST JSON).
S4. El endpoint no puede ser un relé de spam. Derivado de S1: es público, envía correo desde el dominio del negocio y consume la cuota gratuita (100/día). Guardas: honeypot `website` ya presente, validación de servidor independiente del cliente, topes de longitud, `Content-Type: application/json` (obliga preflight y sin cabeceras CORS el navegador de un tercero no puede usarlo).
S5. Configuración fuera del repo: la API key de Resend vive como secreto `RESEND_API_KEY` del proyecto de Pages; nunca en el repositorio ni en el chat.

## Tasks
T1 [S3,S4] route=parent status=done: `src/contact-endpoint.mjs` — validación de servidor, honeypot, topes, llamada a `https://api.resend.com/emails` con `from`/`to`/`reply_to`/`subject`/`text` derivados de `messageOf()`.
T2 [S3,S4] route=parent status=done: tests de `src/contact-endpoint.mjs` con `fetch` inyectado (envío válido, honeypot, email inválido, problema corto, tope excedido, Resend 4xx/5xx, sin key).
T3 [S3] route=parent status=done: `functions/api/contact.js` (adaptador `onRequestPost`) + `CONTACT.endpoint = '/api/contact'`.
T4 [S5] route=parent status=done: crear la API key `sending_access` restringida a `paranexo.com` y pegarla como secreto `RESEND_API_KEY` en Cloudflare Pages.
T5 [S1,S3] route=parent status=pending: desplegar y verificar un envío real de punta a punta (formulario → Resend → Gmail).
T6 [S2] route=user status=pending: Gmail «Enviar como» con `hola@paranexo.com` (SMTP de Resend + código de confirmación).

## Log
L1. Usuario, pedido original: "Listo, ahora quiero configurar que el mail que uso para responder sea con el dominio que compre en cloudflare. Resend.com/setup.md AVERIGUA COMO HACERLO, USA TU MCP QUE TIENES EL CLI DE CLOUDFLARE Y RESEND. PREGUNTAME LO QUE NECESITES EN EL CAMINO"
L2. Respuestas a las tres preguntas de alcance: alcance = "Las dos cosas"; dominio = "paranexo.com (raíz)"; acceso = "MCP de Resend con OAuth"; remitente asumido `hola@paranexo.com`.
L3. Estado encontrado: `paranexo.com` ya estaba creado y verificado en Resend (creado 2026-11-05 18:55, región `sa-east-1`, `sending: enabled`, `receiving: disabled`). DNS verificado con `dig`: TXT `resend._domainkey`, CNAME `send` → `send.forge.rmta.net`, CNAME `rsend` → `rsend-sae1.forge.rmta.net`, MX `send` → `send.forge.rmta.net`; el apex conserva su SPF de Email Routing (`include:_spf.mx.cloudflare.net`) sin conflicto porque el Return-Path de Resend vive en `send.`. No hay `_dmarc`.
L4. `src/contact.mjs` ya soporta el endpoint: con `CONTACT.endpoint` vacío arma un `mailto:`; configurado hace `POST` JSON y expone los avisos de enviado/error. No hace falta tocar el cliente.
L5. Herramientas: el MCP de Resend quedó registrado (`pi mcp add resend --url https://mcp.resend.com/mcp` + `pi mcp login resend`, 139 herramientas) pero una sesión viva de Pi congela su registro de tools, así que se usó un cliente JSON-RPC mínimo (`/tmp/mcpc.py`, streamable HTTP + SSE, token desde `~/.pi/agent/mcp-auth.json`). El MCP de Cloudflare funcionó por el mismo camino para leer y escribir el proyecto de Pages.
L6. Primera key creada con `create-api-key` mal extraída del texto de respuesta (regex sobre `re_...` tomó 45 caracteres en vez de 36) y Resend contestó `401 API key is invalid`. Se creó `paranexo-contact-form-2`, se extrajo con `Token: (\S+)`, y `POST https://api.resend.com/emails` devolvió 200. La key rota (`07e77373`) se revocó con `remove-api-key`. La buena vive en `~/.config/paranexo/resend-endpoint-key.txt` (0600) y como secreto `RESEND_API_KEY` (`secret_text`) del proyecto de Pages.
L7. Verificación local con `npx wrangler@4 pages dev _site` (`.dev.vars` con la key, gitignoreado, borrado después): POST válido → `200 {"ok":true}` y correo entregado; honeypot relleno → `200 {"ok":true}` sin envío; nombre de una letra → `400`; `GET` → `405`; sin key → `503`.
L8. Pendiente del usuario: force-push de la historia reescrita para que el deploy corra (el workflow solo despliega con push a `master`); Gmail «Enviar como» con `hola@paranexo.com`, servidor SMTP `smtp.resend.com`, puerto 465, usuario `resend`, contraseña = una key de Resend; y el código de confirmación que llega a la misma casilla.
