// Footer: lapacho petals falling from the tree; every footer motion rests while off screen.
export function initFooter() {
  const footer = document.querySelector('.footer');
  if (!footer) return;
  const art = footer.querySelector('.foot-art');
  const petals = footer.querySelector('.petals');
  if (!art || !petals) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const build = () => {
    if (reduce.matches) { petals.replaceChildren(); return; }
    const n = innerWidth < 640 ? 5 : 9;
    petals.replaceChildren(...Array.from({ length: n }, (_, i) => {
      const p = document.createElement('span');
      p.className = 'petal';
      p.style.setProperty('--x', (3 + (i * 3.6) % 30 + (i % 3) * 1.7).toFixed(1) + '%');
      p.style.setProperty('--s', (8 + (i % 4) * 2.2).toFixed(1) + 'px');
      p.style.setProperty('--sway', ((i % 2 ? -1 : 1) * (28 + (i % 5) * 16)) + 'px');
      p.style.setProperty('--dur', (11 + (i % 5) * 2.4) + 's');
      p.style.setProperty('--delay', (-(i * 2.3)).toFixed(1) + 's');
      return p;
    }));
  };
  build();
  reduce.addEventListener('change', build);
  new IntersectionObserver(es => footer.classList.toggle('paused', !es[0].isIntersecting), { rootMargin: '80px' }).observe(art);
}
