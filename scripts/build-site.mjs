// Assembles only the public site for GitHub Pages: pages, assets, styles and browser modules.
// Usage: node scripts/build-site.mjs [outDir]   (default: _site)
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve } from 'node:path';
import { unsafeOut } from './safe-out.mjs';
import { build } from './build-pages.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, process.argv[2] ?? '_site');

// The folder is wiped before copying: never the repository itself or anything that contains it.
if (unsafeOut(out, root)) throw new Error(`Refusing to build into ${out}: it is or contains the repository`);

const pages = build();

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
// redirects kept for links shared before a page moved: hablemos.html to /contacto/, the old service pages to their Services section
const redirects = ['hablemos.html', ...['software-a-medida', 'automatizaciones', 'inteligencia-artificial'].map(slug => `servicios/${slug}/index.html`)];
for (const file of [...pages, 'sitemap.xml', ...redirects]) {
  mkdirSync(dirname(join(out, file)), { recursive: true });
  cpSync(join(root, file), join(out, file));
}
for (const dir of ['assets', 'styles']) cpSync(join(root, dir), join(out, dir), { recursive: true });
// GitHub Pages serves this artifact on the custom domain only while the artifact declares it
writeFileSync(join(out, 'CNAME'), 'paranexo.com\n');
// browser modules only: the HTML templates are build inputs
cpSync(join(root, 'src'), join(out, 'src'), { recursive: true, filter: path => !path.endsWith('.html') });
console.log(`Site built in ${relative(root, out) || out}`);
