// Servicios page: the declarative examples inside the detail sections.
// Markup says what happens and when: data-t adds .on, data-off removes it, data-count ticks a number,
// data-swap slides a sub-status, data-type types a line.

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const ease = p => 1 - (1 - p) ** 3;
const steps = v => v.split(';').map(s => { const [t, rest, ms] = s.split(':'); const [a, b] = rest.split('>'); return { t: +t, a: +a, b: +b, ms: +ms }; });

const slide = (el, text) => {
  const old = el.lastElementChild, n = document.createElement('span');
  n.textContent = text; n.className = 'in-new'; el.append(n);
  requestAnimationFrame(() => requestAnimationFrame(() => { n.classList.remove('in-new'); old?.classList.add('out'); }));
  setTimeout(() => old?.remove(), 650);
};

export function initServiceDemos() {
  const demos = $$('.ex-card .demo');
  if (!demos.length) return;
  const state = new Map();
  demos.forEach(dem => {
    const info = {
      timers: [], raf: new Set(), busy: false, last: 0,
      on: [...dem.querySelectorAll('[data-t]')],
      counts: [...dem.querySelectorAll('[data-count]')],
      swaps: [...dem.querySelectorAll('[data-swap]')],
      types: [...dem.querySelectorAll('[data-type]')],
    };
    info.swaps.forEach(el => { el.dataset.init = el.firstElementChild?.textContent ?? ''; });
    info.types.forEach(el => { el.dataset.full = el.textContent; });
    info.len = Math.max(0, ...info.on.map(e => +e.dataset.t), ...info.on.map(e => +(e.dataset.off || 0))) + 1200;
    state.set(dem, info);
  });
  const clear = info => { info.timers.forEach(clearTimeout); info.timers = []; info.raf.forEach(cancelAnimationFrame); info.raf.clear(); info.busy = false; };
  const tick = (info, el, a, b, ms) => {
    let t0 = null;
    const f = t => { t0 ??= t; const p = Math.min((t - t0) / ms, 1); el.textContent = Math.round(a + (b - a) * ease(p)); if (p < 1) info.raf.add(requestAnimationFrame(f)); };
    info.raf.add(requestAnimationFrame(f));
  };
  const typeIn = (info, el, text) => {
    let i = 0;
    const step = () => { el.textContent = text.slice(0, ++i); if (i < text.length) info.timers.push(setTimeout(step, 26)); };
    step();
  };
  const reset = info => {
    clear(info);
    info.on.forEach(e => e.classList.remove('on'));
    info.counts.forEach(e => { e.textContent = steps(e.dataset.count)[0].a; });
    info.swaps.forEach(e => e.replaceChildren(Object.assign(document.createElement('span'), { textContent: e.dataset.init })));
    info.types.forEach(e => { e.textContent = ''; });
  };
  const final = info => {
    clear(info);
    info.on.forEach(e => e.classList.toggle('on', !e.hasAttribute('data-off')));
    info.counts.forEach(e => { const s = steps(e.dataset.count); e.textContent = s[s.length - 1].b; });
    info.swaps.forEach(e => e.replaceChildren(Object.assign(document.createElement('span'), { textContent: e.dataset.swap.split(':').slice(1).join(':') })));
    info.types.forEach(e => { e.textContent = e.dataset.full; });
  };
  const play = (dem, delay = 0) => {
    const info = state.get(dem);
    reset(info);
    if (reduce) { final(info); return; }
    info.busy = true; info.last = Date.now();
    const at = (ms, fn) => info.timers.push(setTimeout(fn, delay + ms));
    info.on.forEach(e => { at(+e.dataset.t, () => e.classList.add('on')); if (e.dataset.off) at(+e.dataset.off, () => e.classList.remove('on')); });
    info.counts.forEach(e => steps(e.dataset.count).forEach(s => at(s.t, () => tick(info, e, s.a, s.b, s.ms))));
    info.swaps.forEach(e => { const [t, ...txt] = e.dataset.swap.split(':'); at(+t, () => slide(e, txt.join(':'))); });
    info.types.forEach(e => { const [t, ...txt] = e.dataset.type.split(':'); at(+t, () => typeIn(info, e, txt.join(':'))); });
    at(info.len, () => { info.busy = false; });
  };

  if (reduce) { demos.forEach(d => { final(state.get(d)); d.closest('.ex-card')?.classList.remove('off'); }); return; }
  demos.forEach(d => reset(state.get(d)));
  let order = 0;
  const io = new IntersectionObserver(es => es.forEach(e => {
    const card = e.target.closest('.ex-card');
    card?.classList.toggle('off', !e.isIntersecting);
    if (e.isIntersecting) play(e.target, (order++ % 4) * 160);
    else clear(state.get(e.target));
  }), { threshold: .35 });
  demos.forEach(d => io.observe(d));
  // replay buttons live in the detail cards, next to the demo
  $$('.ex-replay').forEach(btn => btn.addEventListener('click', () => {
    const dem = btn.closest('.ex-card')?.querySelector('.demo');
    if (dem) play(dem);
  }));
}

initServiceDemos();
