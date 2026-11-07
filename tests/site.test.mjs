import { test } from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { PAGES } from '../scripts/build-pages.mjs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('landing keeps every major editorial section and real local artwork', () => {
  for (const id of ['contenido', 'top', 'problemas', 'servicios', 'preguntas', 'hablemos']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /assets\/footer-paseo-parana\.jpg/);
  // the hero bridge is drawn as dots from the original illustration
  assert.match(readFileSync(new URL('../src/hero-dots.mjs', import.meta.url), 'utf8'), /assets\/hero-puente-v2\.jpg/);
  for (const image of ['hero-puente-v2.jpg', 'footer-paseo-parana.jpg']) assert.ok(existsSync(new URL(`../assets/${image}`, import.meta.url)));
  assert.match(html, /Conectamos tus ideas con soluciones reales/);
  assert.match(html, /<script type="module" src="\.\/src\/landing\.mjs"><\/script>/);
});

test('landing exposes the canvas page-one structure', () => {
  for (const pattern of [
    /class="wrap faq-grid/,
  ]) assert.match(html, pattern);
  // the three demos live on their service pages, not on the home
  assert.doesNotMatch(html, /id="fig-(ba|flow|bot)"/);
  assert.doesNotMatch(html, /id="que-hacemos"/);
  for (const name of ['software', 'auto', 'ai']) {
    assert.ok(existsSync(new URL(`../src/figures/${name}.mjs`, import.meta.url)));
    assert.ok(existsSync(new URL(`../styles/figures/${name}.css`, import.meta.url)));
  }
  // every figure shares one kit, so a page that loads a single figure still gets its colours
  assert.ok(existsSync(new URL('../styles/figures/iso.css', import.meta.url)));
});

test('every contact call to action opens a separate, honest three-step form', () => {
  assert.doesNotMatch(html, /04-hablemos\.html|Nombre Apellido|href="#hablemos"/);
  assert.ok((html.match(/href="\.\/contacto\/"/g) || []).length >= 5);
  const form = readFileSync(new URL('../contacto/index.html', import.meta.url), 'utf8');
  for (const name of ['name', 'business', 'channel', 'contact', 'topic', 'problem']) {
    assert.match(form, new RegExp(`name="${name}"`));
  }
  // the public address is the domain one; the mailbox behind it stays private, and no response-time promise
  assert.match(form, /hola@paranexo\.com/);
  assert.doesNotMatch(form, /@gmail\.com|menos de 24 h|tu consulta le llega/);
});

const css = (path) => readFileSync(new URL(`../styles/${path}`, import.meta.url), 'utf8');

test('both pages share one token set and the same button components', () => {
  const form = readFileSync(new URL('../contacto/index.html', import.meta.url), 'utf8');
  for (const page of [html, form]) assert.match(page, /href="[^"]*styles\/landing\.css"/);
  assert.ok(!existsSync(new URL('../styles/site.css', import.meta.url)));
  assert.doesNotMatch(form, /class="button\b/);
  assert.match(form, /class="btn btn-primary"/);
  assert.doesNotMatch(css('contact.css'), /var\(--(paper|ink-soft|river|sun)\)/);
});

test('white text never sits on the light terra (3.93:1); it uses the AA terra ink', () => {
  for (const file of ['landing.css', 'contact.css', 'figures/auto.css', 'figures/ai.css', 'figures/software.css']) {
    for (const rule of css(file).match(/\{[^{}]*\}/g)) {
      assert.ok(!(/background: ?var\(--terra\)[;\s]/.test(rule) && /color: ?#fff\b/.test(rule)), `${file}: ${rule.slice(0, 90)}`);
    }
  }
});

test('dark mode is a toggle that redefines the shared tokens', () => {
  const dark = css('landing.css').match(/:root\[data-theme="dark"\] \{([^}]*)\}/);
  assert.ok(dark, 'landing.css needs a :root[data-theme="dark"] token block');
  assert.doesNotMatch(css('landing.css'), /@media \(prefers-color-scheme: dark\)/);
  for (const token of ['--cream', '--paper', '--line', '--ink', '--ink-2', '--terra-ink', '--surface']) {
    assert.match(dark[1], new RegExp(`${token}:`));
  }
  assert.match(dark[1], /color-scheme: dark;/);
  const form = readFileSync(new URL('../contacto/index.html', import.meta.url), 'utf8');
  for (const page of [html, form]) {
    // light is the default; only a saved dark choice switches the theme, in <head> before paint
    assert.match(page, /<head>[\s\S]*localStorage\.getItem\('theme'\) === 'dark'[\s\S]*<\/head>/);
    assert.doesNotMatch(page, /prefers-color-scheme/);
    assert.match(page, /<button class="theme-toggle" type="button" aria-pressed="false" aria-label="Modo oscuro">/);
    assert.match(page, /<script type="module" src="[^"]*src\/theme\.mjs"><\/script>/);
  }
  assert.doesNotMatch(css('contact.css'), /background:#fff\b|#fff2e9|#fff3e9|#fce5d7/);
  // outside the light-scoped illustrations, text on accent/petrol fills must not be tied to a token that flips in dark mode
  for (const rule of css('landing.css').match(/\{[^{}]*\}/g)) {
    assert.ok(!(/background: var\(--terra-ink\)/.test(rule) && /color: #fff\b/.test(rule)), rule.slice(0, 90));
    assert.ok(!(/background: var\(--petrol\)/.test(rule) && /color: var\(--cream\)/.test(rule)), rule.slice(0, 90));
  }
});

test('scroll reveal plays once, stays visible without JS and honors reduced motion', () => {
  const css = readFileSync(new URL('../styles/landing.css', import.meta.url), 'utf8');
  const js = readFileSync(new URL('../src/page.mjs', import.meta.url), 'utf8');
  // the JS class is set by the inline head script, before first paint
  assert.match(html.split('</head>')[0], /<script>[^<]*classList\.add\('js'\)/);
  // hidden initial state exists only behind .js and only when motion is allowed
  assert.doesNotMatch(css.replace(/@media \(prefers-reduced-motion: no-preference\) \{[\s\S]*?\n  \}\n/, ''), /^\s*\.reveal(-items)?[^{]*\{[^}]*opacity: 0/m);
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\) \{\s*\.js \.reveal \{[^}]*opacity: 0[^}]*translateY\(28px\)/);
  assert.match(css, /\.js \.reveal-items > \* \{[^}]*opacity: 0/);
  // only compositor properties, one easing
  assert.doesNotMatch(css.match(/\.js \.reveal \{[^}]*\}/)[0], /(top|left|height|width|margin)\s*:|transition:[^;]*(height|width|margin)/);
  // observer reveals once, then stops watching
  assert.match(js, /classList\.add\('in'\)[\s\S]{0,40}io\.unobserve\(e\.target\)/);
  // reduced motion shows everything immediately
  assert.match(css, /prefers-reduced-motion: reduce\) \{[\s\S]*\.reveal[\s\S]*\.reveal-items > \*[\s\S]*opacity: 1/);
  // sibling groups opt in to the stagger
  assert.match(html, /class="problems reveal-items"/);
});

test('if the landing module never runs, the reveal gate lifts so content is not left hidden', () => {
  const head = readFileSync(new URL('../src/partials/head.html', import.meta.url), 'utf8');
  assert.match(head, /setTimeout\([\s\S]*?reveal-ready[\s\S]*classList\.remove\('js'\)/);
  const js = readFileSync(new URL('../src/page.mjs', import.meta.url), 'utf8');
  assert.match(js, /classList\.add\('reveal-ready'\)/);
});

test('team cards lead with their role, with no empty photo frames', () => {
  const about = readFileSync(new URL('../quienes-somos/index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(about, /portrait empty/);
  assert.doesNotMatch(about, /Foto 4:5/);
  assert.doesNotMatch(about, /<h3[^>]*>\s*Equipo Paranexo/);
  const members = about.match(/<article class="member[^"]*">[\s\S]*?<\/article>/g) ?? [];
  assert.equal(members.length, 2);
  const roles = ['Ingeniería y producto', 'Automatización e IA'];
  members.forEach((m, i) => assert.match(m, new RegExp(`<h3[^>]*>\\s*${roles[i]}\\s*</h3>`)));
});

test('the home leads with the three illustrative applications before explaining problems', () => {
  const at = id => html.indexOf(`id="${id}"`);
  assert.ok(at('servicios') > -1 && at('problemas') > at('servicios') && at('preguntas') > at('problemas'));
  assert.match(html, /Hablás con quienes construyen/);
  assert.match(html, /Precio y alcance por escrito/);
  assert.match(html, /Capacitación y seguimiento/);
  assert.match(html, /<h2 id="apps-title">Así se ve en tu negocio<\/h2>/);
  assert.match(html, /<div class="app-tabs reveal" role="tablist"/);
  assert.equal((html.match(/role="tab"/g) ?? []).length, 3);
  for (const id of ['scene-auto', 'scene-soft', 'scene-ia']) assert.match(html, new RegExp(`id="${id}"`));
  assert.match(html, /Ejemplo: distribuidora de bebidas/);
  assert.match(html, /href="\.\/servicios\/">Ver todos los servicios/);
  // the carousel moved to the Servicios page; its screenshots are no longer on the home
  assert.doesNotMatch(html, /class="svc-card/);
  assert.match(html, /styles\/apps\.css/);
  const js = readFileSync(new URL('../src/landing.mjs', import.meta.url), 'utf8');
  assert.match(js, /from "\.\/apps\.mjs"/);
  assert.match(js, /initHeroDots/);
});

test('the hero keeps the live dotted bridge and only gains the glass copy treatment', () => {
  const hero = html.match(/<header class="hero"[\s\S]*?<\/header>/)?.[0] ?? '';
  assert.match(hero, /<div class="hero-scene"><canvas class="hero-dots"/);
  assert.doesNotMatch(hero, /<img/);
  assert.match(hero, /class="hero-ctas cluster glass"/);
  assert.match(hero, /<span class="blobs" aria-hidden="true">/);
  // S15: the dots module is untouched, same image and crop
  const dots = readFileSync(new URL('../src/hero-dots.mjs', import.meta.url), 'utf8');
  assert.match(dots, /\{ x: 0, y: 338, w: 1942, h: 424 \}/);
  assert.match(dots, /assets\/hero-puente-v2\.jpg/);
});

test('the carousel module is shared and only the page with a track wires it', () => {
  assert.ok(existsSync(new URL('../src/carousel.mjs', import.meta.url)));
  const js = readFileSync(new URL('../src/carousel.mjs', import.meta.url), 'utf8');
  assert.match(js, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(js, /setInterval/);
  // wherever a track is published, the stylesheet that ships with it owns the scroll-snap
  const tracks = PAGES.filter(page => read(page.out).includes('class="svc-track'));
  for (const page of tracks) {
    const cssFiles = [...read(page.out).matchAll(/href="[^"]*styles\/([^"]+)"/g)].map(m => m[1]);
    assert.ok(cssFiles.some(file => read(`styles/${file}`).includes('.svc-track')), `${page.out} needs the carousel stylesheet`);
  }
});

test('the Services page starts from business problems and demonstrates the result', () => {
  const hub = readFileSync(new URL('../servicios/index.html', import.meta.url), 'utf8');
  const chooser = hub.match(/<nav aria-label="Ir a un problema">[\s\S]*?<\/nav>/)?.[0] ?? '';
  assert.match(chooser, /href="#software">Tengo todo en planillas/);
  assert.match(chooser, /href="#automatizaciones">Cargo el mismo dato varias veces/);
  assert.match(chooser, /href="#ia">No sé si la IA me sirve/);
  assert.ok(hub.indexOf('id="carrusel"') < hub.indexOf('id="tres"'));
  assert.match(hub, /<h3>Mis pedidos y stock están en planillas<\/h3>/);
  assert.match(hub, /<h3>Cargo el mismo dato varias veces<\/h3>/);
});

test('every service card on the hub shows a described example and links to its detail', () => {
  const hub = readFileSync(new URL('../servicios/index.html', import.meta.url), 'utf8');
  const cards = hub.match(/<li class="svc-card[\s\S]*?<\/li>\s*(?=<li class="svc-card|<\/ul>)/g) ?? [];
  assert.equal(cards.length, 7);
  for (const card of cards) {
    assert.match(card, /<h3>[^<]+<\/h3>/);
    assert.match(card, /role="img" aria-label="Ejemplo ilustrativo: [^"]+"/);
    const target = card.match(/class="link" href="#([a-z]+)"/)?.[1];
    assert.ok(target && hub.includes(`id="${target}"`), `card links to a missing #${target}`);
  }
  // service photos, wherever a page still shows one, keep their dimensions and description
  for (const page of PAGES) {
    for (const tag of read(page.out).match(/<img[^>]*assets\/servicios\/[^>]*>/g) ?? []) {
      assert.match(tag, /width="720"/);
      assert.match(tag, /height="1080"/);
      assert.match(tag, /alt="[^"]+"/);
    }
  }
});

test('in the contact form only the person name is required, the business name is optional', () => {
  const form = readFileSync(new URL('../contacto/index.html', import.meta.url), 'utf8');
  assert.match(form, /<input id="name" name="name"[^>]*\brequired\b/);
  const business = form.match(/<input id="business"[^>]*>/)?.[0] ?? '';
  assert.ok(business, 'business input exists');
  assert.doesNotMatch(business, /\brequired\b/);
  assert.match(form, /<label for="business">Nombre del negocio \(opcional\)<\/label>/);
  const js = readFileSync(new URL('../src/contact.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(js, /field\.name === 'business'/);
});

test('below 900px a menu button opens the section links; the dead main.mjs menu is gone', () => {
  const button = html.match(/<button class="menu-toggle"[^>]*>/)?.[0] ?? '';
  assert.ok(button, 'menu button exists');
  assert.match(button, /aria-expanded="false"/);
  assert.match(button, /aria-controls="nav-menu"/);
  assert.match(button, /aria-label="Menú"/);
  assert.match(html, /<ul id="nav-menu">/);
  assert.match(html, /<script type="module" src="\.\/src\/nav\.mjs"><\/script>/);
  const styles = css('landing.css');
  assert.match(styles, /\.menu-toggle \{[^}]*display: none/);
  assert.match(styles, /@media \(max-width: 900px\) \{[\s\S]*?\.menu-toggle \{ display: grid; \}/);
  const nav = readFileSync(new URL('../src/nav.mjs', import.meta.url), 'utf8');
  assert.match(nav, /Escape/);
  assert.ok(!existsSync(new URL('../src/main.mjs', import.meta.url)));
});

test('the home describes itself to search engines and link previews', () => {
  const head = html.match(/<head>([\s\S]*)<\/head>/)[1];
  assert.match(head, /<meta name="description" content="[^"]{70,160}">/);
  for (const p of ['og:title', 'og:description', 'og:type', 'og:locale', 'og:site_name']) {
    assert.match(head, new RegExp(`<meta property="${p}" content="[^"]+">`));
  }
});

test('the contact page never implies the business name is required', () => {
  const form = readFileSync(new URL('../contacto/index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(form, /Nombre, negocio/);
});

test('the hero bridge is a dot matrix behind the copy, without the old panels and hotspots', () => {
  const hero = html.match(/<header class="hero"[\s\S]*?<\/header>/)?.[0] ?? '';
  assert.match(hero, /<canvas class="hero-dots" role="img" aria-label="[^"]*puente[^"]*"/i);
  assert.ok(hero.indexOf('hero-copy') < hero.indexOf('hero-dots') || /hero-scene/.test(hero));
  assert.doesNotMatch(hero, /class="spot"|class="legend"|class="overlay"|<img/);
  const js = readFileSync(new URL('../src/landing.mjs', import.meta.url), 'utf8');
  assert.match(js, /import \{ initHeroDots \} from "\.\/hero-dots\.mjs"/);
  assert.doesNotMatch(js, /\.spot button/);
  const dots = readFileSync(new URL('../src/hero-dots.mjs', import.meta.url), 'utf8');
  assert.match(dots, /prefers-reduced-motion/);
  assert.match(dots, /IntersectionObserver/);
  assert.doesNotMatch(css('landing.css'), /\.spot|\.legend|\.hero-stage/);
});

test('the hero carries the brief copy and its two CTAs', () => {
  const hero = html.match(/<header class="hero"[\s\S]*?<\/header>/)?.[0] ?? '';
  assert.match(hero, /<span class="eyebrow">Tecnología que conecta<\/span>/);
  assert.match(hero, /<h1 id="hero-title" aria-label="Conectamos tus ideas con soluciones reales">Conectamos tus ideas con soluciones reales<\/h1>/);
  assert.match(hero, /Desarrollamos software a medida, automatizaciones e inteligencia artificial para que tu negocio trabaje mejor y siga creciendo\./);
  assert.match(hero, /<a class="btn btn-primary" href="\.\/contacto\/">Hablemos de tu proyecto <span class="arrow" aria-hidden="true">→<\/span><\/a>/);
  assert.match(hero, /<a class="btn btn-ghost" href="\.\/servicios\/">Ver los servicios<\/a>/);
  assert.match(html, /id="servicios"/);
});

test('the hero bridge builds once, pauses when hidden and keeps cursor effects to fine pointers', () => {
  const dots = readFileSync(new URL('../src/hero-dots.mjs', import.meta.url), 'utf8');
  assert.match(dots, /visibilitychange/);
  assert.match(dots, /hover: hover\) and \(pointer: fine/);
  assert.match(css('landing.css'), /\.hero-scene[^}]*mask-image/);
});

test('the shared brand keeps its kit accents and uses Bricolage Grotesque and DM Sans on paper', () => {
  for (const page of [html, readFileSync(new URL('../servicios/index.html', import.meta.url), 'utf8'), readFileSync(new URL('../contacto/index.html', import.meta.url), 'utf8')]) {
    assert.match(page, /assets\/brand\/logo-horizontal-color\.svg/);
    assert.match(page, /assets\/brand\/logo-horizontal-color-dark\.svg/);
    assert.match(page, /<link rel="icon" href="[^"]*assets\/favicon\.svg">/);
    assert.match(page, /styles\/glass\.css/);
  }
  const styles = css('landing.css');
  for (const [token, value] of [['--cream', '#FCFBF8'], ['--marfil', '#FAF4E8'], ['--surface', '#FFFFFF'], ['--ink', '#20211F'], ['--terra', '#EF633C'], ['--terra-ink', '#B5401C'], ['--petrol', '#20211F']]) {
    assert.ok(styles.includes(`${token}: ${value};`), `${token} must come from the kit (${value})`);
  }
  assert.match(styles, /--r-glass: 20px/);
  assert.match(styles, /@font-face \{[\s\S]*?font-family: "Bricolage Grotesque"/);
  assert.match(styles, /@font-face \{[\s\S]*?font-family: "DM Sans"/);
  assert.match(styles, /--serif: "Bricolage Grotesque"/);
  assert.match(styles, /--sans: "DM Sans"/);
  for (const font of ['bricolage-grotesque-latin.woff2', 'dm-sans-latin.woff2']) assert.ok(existsSync(new URL(`../assets/fonts/${font}`, import.meta.url)));
  assert.doesNotMatch(styles, /font-family: "Instrument Serif"|font-family: "Archivo"/);
  const glass = css('glass.css');
  assert.match(glass, /\.glass \{[^}]*backdrop-filter/);
  assert.match(glass, /@keyframes ooze/);
  assert.match(glass, /\.frost::before/);
});

test('the footer is the Paseo del Paraná band with a working mail contact, columns and legal row', () => {
  const footer = html.match(/<footer class="footer">[\s\S]*?<\/footer>/)?.[0] ?? '';
  assert.match(footer, /assets\/footer-paseo-parana\.jpg/);
  assert.match(footer, /alt="[^"]*Paseo del Paraná[^"]*"/);
  assert.match(footer, /class="water" aria-hidden="true"/);
  assert.match(footer, /class="petals" aria-hidden="true"/);
  assert.match(footer, /assets\/brand\/logo-horizontal-color\.svg/);
  assert.match(footer, /assets\/brand\/logo-horizontal-color-dark\.svg/);
  assert.match(footer, /class="foot-mail" href="mailto:hola@paranexo\.com"/);
  assert.match(footer, /href="#i-mail"/);
  assert.doesNotMatch(footer, /href="#"|data-todo=/);
  assert.match(footer, /href="\.\/servicios\/software-a-medida\/"/);
  assert.match(footer, /href="\.\/privacidad\.html"/);
  assert.match(footer, /27\.47°S 58\.83°W/);
  assert.match(footer, /Hecho en el NEA, Argentina/);
  assert.doesNotMatch(html, /id="isotipo"|<svg class="iso"/);
});

test('footer motion rests off screen and is static under reduced motion', () => {
  const js = readFileSync(new URL('../src/footer.mjs', import.meta.url), 'utf8');
  assert.match(js, /prefers-reduced-motion: reduce/);
  assert.match(js, /IntersectionObserver/);
  assert.match(js, /classList\.toggle\('paused'/);
  const page = readFileSync(new URL('../src/page.mjs', import.meta.url), 'utf8');
  assert.match(page, /initFooter\(\)/);
});

test('the Services page links the process page instead of repeating it and keeps its secondary tiles equal', () => {
  const hub = readFileSync(new URL('../servicios/index.html', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../styles/servicios.css', import.meta.url), 'utf8');
  const pages = readFileSync(new URL('../styles/pages.css', import.meta.url), 'utf8');
  assert.doesNotMatch(hub, /class="steps5|href="#como"/);
  assert.match(hub, /class="how-band[\s\S]*?href="\.\.\/como-trabajamos\/"/);
  assert.match(hub, /class="sec-head sec-head-center[^"]*"[\s\S]*?id="tres-title"/);
  assert.doesNotMatch(hub, /class="stile[^"]*\bs[57]\b/);
  // the generic .also list styles must not override the Services tile grid
  assert.doesNotMatch(pages, /\.also ul/);
  assert.match(css, /\.stile \{ grid-column: span 6;/);
});

test('home sections keep one rhythm: a section that follows another drops its top padding', () => {
  const css = readFileSync(new URL('../styles/landing.css', import.meta.url), 'utf8');
  for (const id of ['problemas', 'preguntas', 'hablemos']) assert.match(css, new RegExp(`#${id}[^{]*\\{ padding-top: 0; \\}|#${id},`), id);
});

test('the process bridge stacks before its columns get too narrow for the step titles', () => {
  const css = readFileSync(new URL('../styles/pages.css', import.meta.url), 'utf8');
  assert.match(css, /@media \(max-width: 1100px\) \{\s*\.bridge \{ grid-template-columns: minmax\(0, 1fr\)/);
  // the takeaway sits on the same line in every column, whatever the title length
  assert.match(css, /\.pier \.takeaway \{[^}]*margin-top: auto/);
});

test('every carousel example starts at the same height in its card', () => {
  const css = readFileSync(new URL('../styles/servicios.css', import.meta.url), 'utf8');
  // examples anchor to the top of their area instead of centering by their own height
  assert.match(css, /\n  \.demo \{[^}]*align-content: start;/);
  assert.doesNotMatch(css, /\.d-web \{ align-content: center; \}/);
  // one-line titles reserve two lines so their example does not rise
  assert.match(css, /\.svc-card h3 \{[^}]*min-height: 2\.2em/);
  // diagrams carry inner air around their nodes; the carousel compensates it
  assert.match(css, /\.svc-card \.flow, \.svc-card \.tiles-int \{ margin-top: -27px; \}/);
});
