import { initHeroDots } from "./hero-dots.mjs";
import { initApps } from "./apps.mjs";
import "./page.mjs";
(() => {
  // Hero word reveal
  const h1 = document.getElementById('hero-title');
  const walk = (node, i = { n: 0 }) => {
    [...node.childNodes].forEach(c => {
      if (c.nodeType === 3) {
        const frag = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(w => {
          if (!w.trim()) { frag.append(w); return; }
          const s = document.createElement('span'); s.className = 'w'; s.setAttribute('aria-hidden', 'true');
          s.style.animationDelay = (i.n++ * 70) + 'ms'; s.textContent = w; frag.append(s);
        });
        c.replaceWith(frag);
      } else walk(c, i);
    });
  };
  walk(h1);

  // the dotted bridge sits behind the copy; the applications section follows the problems
  initHeroDots();
  initApps();
})();
