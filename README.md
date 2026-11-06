# Paranexo

Landing estática de Paranexo: software a medida, automatización e IA para pymes. Las tres demostraciones son **ilustrativas**; no modifican pedidos ni datos reales.

## Verla en local

```bash
python3 -m http.server 8000
```

Abrí [http://localhost:8000](http://localhost:8000). No necesita instalar dependencias. Para los tests de los ejemplos y la estructura: `node --test tests/*.test.mjs`.

Todas las páginas comparten `styles/landing.css`: tokens, botones, nav y footer. El modo oscuro se activa con el botón del nav y la elección se guarda en el navegador; por defecto se ve en modo claro. Las ilustraciones conservan su paleta clara. Las reglas de UI están en `AGENTS.md`.

La identidad sale del kit **Puente Cauce** (logo, favicon y paleta) en `assets/brand/`. La home muestra los ejemplos animados de las aplicaciones (`src/apps.mjs`); la página de servicios lleva el carrusel con un ejemplo animado por servicio y el detalle de cada uno (`src/servicios.mjs`, `styles/servicios.css`). Los íconos de Instagram y X del footer todavía apuntan a `#` (`data-todo`): reemplazalos por las URLs de los perfiles.

Las páginas se generan desde `src/pages/`, con el encabezado, el nav, los íconos compartidos (`isotipo.html`) y el footer en `src/partials/` y las tres ilustraciones en `src/figures/`. `node scripts/build-pages.mjs` escribe `index.html`, `contacto/index.html`, `privacidad.html` y `sitemap.xml`: editá las fuentes y regenerá; el sitio publicado solo necesita los archivos estáticos, no el directorio `design/`.

Cada archivo de `src/pages/` arranca con un bloque `<!-- page {...} -->` que fija su título, su descripción, su carpeta de salida y, si hace falta, sus estilos y módulos. El armador resuelve las rutas relativas según la profundidad de la página, así que una página nueva en una subcarpeta no necesita `../` a mano.

## Publicación

El sitio vive en **paranexo.com**, servido por Cloudflare Pages, y tiene un espejo en GitHub Pages. Un solo workflow, `.github/workflows/pages.yml`, corre los tests y, si pasan, arma `_site/` con `node scripts/build-site.mjs` y sube ese mismo artefacto a los dos lados: nunca se construye dos veces.

Quedan afuera `design/`, `odd/`, los tests, los scripts, las fuentes de `src/` (solo se publican los módulos del navegador) y los archivos internos.

- Se ejecuta en cada push a `master` o a mano desde la pestaña Actions.
- Cloudflare Pages usa el proyecto `paranexo` (Direct Upload); necesita los secrets `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID`. Sin token, el paso se saltea y el deploy de GitHub Pages sigue publicando.
- Configuración necesaria una sola vez en GitHub: Settings → Pages → Build and deployment → Source: **GitHub Actions**.
- Para ver lo que se publicaría: `node scripts/build-site.mjs` y servir `_site/` (`python3 -m http.server 8000 -d _site`). El script se niega a escribir en el repositorio o en una carpeta que lo contenga, porque borra la carpeta de salida antes de copiar.

## Antes de publicarla

Los `canonical`, `og:url` y `sitemap.xml` usan `https://paranexo.com/` (`SITE` en `scripts/build-pages.mjs`). El espejo de GitHub Pages queda en `tanoluchi.github.io/paranexo/` y redirige al dominio porque el artefacto declara el `CNAME`.

Los enlaces «Hablemos» llevan a `contacto/`, un formulario de tres pasos; `hablemos.html` quedó como redirección para los enlaces ya compartidos. Los destinos de contacto están en `src/contact-message.mjs`:

- `email`: hola@paranexo.com.
- `endpoint`: URL de la función de Cloudflare. En el espejo `tanoluchi.github.io`, el formulario prepara un correo en vez de usar un endpoint inexistente. En Cloudflare requiere Turnstile: la **sitekey pública** del widget para `paranexo.com` está en `TURNSTILE_SITEKEY` de `src/contact.mjs`; configurá la clave secreta correspondiente como `TURNSTILE_SECRET_KEY` en el entorno de Pages, junto con `RESEND_API_KEY`. No guardes secretos en el repositorio. Sin esta configuración el envío queda bloqueado; la función rechaza solicitudes a otros hosts, incluidos `pages.dev` y previews, y la verificación del servidor solo acepta tokens para `paranexo.com`. Configurá además un límite de solicitudes por IP en Cloudflare antes de publicar; Turnstile no reemplaza ese límite.

La política de privacidad está en `privacidad.html`; conviene que la revise alguien con formación legal. Las identidades/fotos del equipo tampoco están confirmadas: las tarjetas de «Quiénes somos» van sin foto; para sumar una, seguí el comentario HTML sobre `.team-wrap` (clase `has-photo` + `<figure class="portrait">`). Las imágenes del puente y el taller están copiadas desde `design/puente-nea-landing/assets/` a `assets/` para que la web no dependa del directorio de diseño.
