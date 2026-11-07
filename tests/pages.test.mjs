// The site is multi-page now: these pin what a link between pages must guarantee.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES } from '../scripts/build-pages.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(join(root, path), 'utf8');
const SITE = 'https://paranexo.com/';
const published = PAGES.map(page => page.out);

test('every page ships one h1, the shared nav and its own canonical url', () => {
  for (const page of PAGES) {
    const html = read(page.out);
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, `${page.out} must have exactly one h1`);
    assert.match(html, /<nav class="nav" aria-label="Principal">/, `${page.out} must carry the shared nav`);
    assert.match(html, /<footer/, `${page.out} must carry the shared footer`);
    if (page.index === false) continue;
    const url = SITE + (page.out === 'index.html' ? '' : page.out.replace(/index\.html$/, ''));
    assert.ok(html.includes(`<link rel="canonical" href="${url}">`), `${page.out} must point canonical at ${url}`);
    assert.ok(html.includes(`<meta property="og:url" content="${url}">`), `${page.out} must point og:url at ${url}`);
  }
});

test('the footer links the pages that exist, from any depth', () => {
  for (const { out, depth, base: fixed } of PAGES) {
    const base = fixed ?? ('../'.repeat(depth) || './');
    const html = read(out);
    const footer = html.slice(html.indexOf('<footer'));
    for (const page of ['servicios/', 'como-trabajamos/', 'servicios/#software', 'servicios/#automatizaciones', 'servicios/#ia']) {
      assert.ok(footer.includes(`href="${base}${page}"`), `${out} footer must link ${base}${page}`);
    }
    assert.doesNotMatch(footer, /index\.html#que-hacemos|index\.html#como-trabajamos/, out);
  }
});

test('no internal link, stylesheet or script points at a file or section that does not exist', () => {
  const missing = [];
  const ids = file => new Set([...readFileSync(file, 'utf8').matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
  for (const page of PAGES) {
    // comments hold authoring hints such as the future team photos, not live references
    const html = read(page.out).replace(/<!--[\s\S]*?-->/g, '');
    const dir = dirname(join(root, page.out));
    for (const [, ref] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|tel:|data:)/.test(ref)) continue;
      const [path, hash] = ref.split('#');
      let file = join(root, page.out);
      if (path) {
        // root-absolute links (the 404 page) resolve from the site root
        const target = path.startsWith('/') ? join(root, path) : join(dir, path);
        file = existsSync(join(target, 'index.html')) ? join(target, 'index.html') : target;
        if (!existsSync(file)) { missing.push(`${page.out} -> ${ref}`); continue; }
      }
      // a link to a section must land on an element with that id
      if (hash && file.endsWith('.html') && !ids(file).has(hash)) missing.push(`${page.out} -> ${ref} (no #${hash})`);
    }
  }
  assert.deepEqual(missing, []);
});

test('unknown URLs get a real 404 page that is never indexed and works from any depth', () => {
  const page = PAGES.find(p => p.out === '404.html');
  assert.ok(page, 'src/pages must define 404.html');
  assert.equal(page.sitemap, false);
  const html = read('404.html');
  assert.match(html, /<meta name="robots" content="noindex">/);
  assert.doesNotMatch(html, /rel="canonical"/);
  assert.doesNotMatch(read('sitemap.xml'), /404/);
  // served at any path, so every internal reference is root-absolute
  for (const [, ref] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|#)/.test(ref)) continue;
    assert.match(ref, /^\//, `404.html must use root-absolute paths, found ${ref}`);
  }
  assert.match(html, /<h1>Esta página no existe<\/h1>/);
  assert.match(html, /href="\/">Ir al inicio/);
});

test('the sitemap lists every published page and leaves the hablemos.html redirect out', () => {
  const sitemap = read('sitemap.xml');
  for (const page of PAGES) {
    if (page.sitemap === false) continue;
    const url = SITE + (page.out === 'index.html' ? '' : page.out.replace(/index\.html$/, ''));
    assert.ok(sitemap.includes(`<loc>${url}</loc>`), `sitemap must list ${url}`);
  }
  assert.doesNotMatch(sitemap, /hablemos\.html/);
  assert.match(read('hablemos.html'), /http-equiv="refresh" content="0; url=\.\/contacto\/"/);
});

test('the old service pages are gone and their URLs redirect to their Services section', () => {
  const redirects = { 'software-a-medida': 'software', automatizaciones: 'automatizaciones', 'inteligencia-artificial': 'ia' };
  assert.ok(!PAGES.some(page => /^servicios\/.+\/index\.html$/.test(page.out)), 'no generated service subpage');
  for (const id of ['software', 'automatizaciones', 'ia']) assert.ok(!existsSync(join(root, `src/pages/servicio-${id}.html`)), `servicio-${id}.html`);
  for (const [slug, id] of Object.entries(redirects)) {
    const html = read(`servicios/${slug}/index.html`);
    assert.match(html, /<meta name="robots" content="noindex">/);
    assert.match(html, new RegExp(`http-equiv="refresh" content="0; url=\\.\\./#${id}"`));
    assert.match(html, new RegExp(`<link rel="canonical" href="https://paranexo\\.com/servicios/">`));
    assert.doesNotMatch(read('sitemap.xml'), new RegExp(`servicios/${slug}/`));
  }
  // nothing on the site links the removed pages any more
  for (const page of PAGES) assert.doesNotMatch(read(page.out), /servicios\/(software-a-medida|automatizaciones|inteligencia-artificial)\//, page.out);
});

test('the process page keeps the five steps in order', () => {
  const process = read('como-trabajamos/index.html');
  const steps = ['Nos contás tu problema o idea', 'Analizamos tus necesidades', 'Diseñamos una solución', 'Desarrollamos y validamos', 'Implementamos y acompañamos'];
  assert.equal((process.match(/<li class="pier">/g) ?? []).length, 5);
  // each step says what the client does, what the team does and what the client keeps
  assert.equal((process.match(/class="you"/g) ?? []).length, 5);
  assert.equal((process.match(/class="us"/g) ?? []).length, 5);
  assert.equal((process.match(/class="takeaway"/g) ?? []).length, 5);
  steps.forEach((step, i) => assert.ok(process.indexOf(step) > 0, `process page must keep the step "${step}"`));
  steps.slice(1).forEach((step, i) => assert.ok(process.indexOf(step) > process.indexOf(steps[i]), `step "${step}" must come after "${steps[i]}"`));
});

test('the nav points at the hub pages from every depth', () => {
  for (const page of PAGES) {
    const base = page.base ?? ('../'.repeat(page.depth ?? 0) || './');
    const html = read(page.out);
    assert.ok(html.includes(`<a href="${base}servicios/">Servicios</a>`), `${page.out} nav must resolve to ${base}servicios/`);
    assert.ok(html.includes(`<a href="${base}como-trabajamos/">Cómo trabajamos</a>`), `${page.out} nav must resolve to ${base}como-trabajamos/`);
    assert.ok(html.includes(`<a class="btn btn-primary" href="${base}contacto/">Hablemos</a>`), `${page.out} CTA must resolve to ${base}contacto/`);
  }
});

test('every page loads the shared page module, which runs its own reveal and demo', () => {
  const js = read('src/page.mjs');
  assert.match(js, /^initPage\(\);$/m);
  for (const page of PAGES) {
    const html = read(page.out);
    const base = page.base ?? ('../'.repeat(page.depth ?? 0) || './');
    assert.ok(html.includes(`src="${base}src/page.mjs"`), `${page.out} must load ${base}src/page.mjs`);
  }
});

test('the home keeps one diagnosis and no stale form copy', () => {
  const home = read('index.html');
  // neither the pains marquee nor the numbered process rail lives on the home
  assert.doesNotMatch(home, /class="pains-band"|class="pains-track"|src="\.\/src\/pains\.mjs"/);
  assert.doesNotMatch(home, /class="rail[ "]/);
  assert.doesNotMatch(home, /Ver cómo trabajamos, paso por paso/);
  assert.doesNotMatch(home, /class="steps"/);
  // nothing on the home claims the form does not send
  assert.doesNotMatch(home, /todavía no envía|no está habilitado/);
  // one label for the main call to action inside the page (the nav keeps its short "Hablemos")
  const main = home.slice(home.indexOf('<main'), home.indexOf('</main>'));
  const ctas = main.match(/class="btn btn-primary"[^>]*>([^<]+)/g) ?? [];
  assert.ok(ctas.length >= 2);
  for (const cta of ctas) assert.match(cta, />Hablemos de tu proyecto/);
});

test('the process and team pages share the Services hero', () => {
  for (const page of ['servicios/', 'como-trabajamos/', 'quienes-somos/']) {
    const html = read(`${page}index.html`);
    assert.match(html, /<header class="hero page-hero" id="top">\s*<span class="blobs" aria-hidden="true">/, page);
    assert.match(html, /<div class="wrap hero-copy">/, page);
    assert.match(html, /class="hero-ctas cluster glass"/, page);
  }
  assert.match(readFileSync(new URL('../styles/pages.css', import.meta.url), 'utf8'), /\.hero\.page-hero \.hero-copy::before/);
});
