// Home applications section (S10 + S12): three examples of how the work looks in a business.
// Scene 1 runs in the style of the agents video: a task list checks off, live sub-statuses and a result card.
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

export function initApps() {
  const stage = $('.app-stage');
  if (!stage) return;
  const cap = $('#stage-cap'), replay = $('#replay');
  const tabs = $$('.liquid-tile'), els = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
  let timers = [], active = 0, started = false;
  const at = (ms, fn) => timers.push(setTimeout(fn, ms));
  const stop = () => { timers.forEach(clearTimeout); timers = []; };
  const on = (el, cls = 'on', v = true) => el.classList.toggle(cls, v);

  // a sub-status line changes by sliding the old text out and the new one in
  const setSub = (el, text, instant) => {
    const old = el.lastElementChild, n = document.createElement('span');
    n.textContent = text;
    if (instant) { el.replaceChildren(n); return; }
    n.className = 'in-new';
    el.append(n);
    requestAnimationFrame(() => requestAnimationFrame(() => { n.classList.remove('in-new'); old?.classList.add('out'); }));
    setTimeout(() => old?.remove(), 650);
  };
  const countTo = (el, from, to, ms) => {
    if (reduce) { el.textContent = to; return; }
    let t0 = null;
    const f = t => { t0 ??= t; const p = Math.min((t - t0) / ms, 1); el.textContent = Math.round(from + (to - from) * (1 - (1 - p) ** 3)); if (p < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  };
  const pillSet = (pill, text, done) => { $('.pill-t', pill).textContent = text; on(pill, 'done', done); };

  // -- Scene 1: automatizaciones --
  const A = (() => {
    const el = els[0], pill = $('.pill', el), tasks = $$('.task', el), agents = $('.agents', el), result = $('.result', el);
    const rows = $$('.arow', el), subs = rows.map(r => $('.sub', r)), cnt = $('.cnt', el), done = $('.donegrp', el);
    const COPY = [
      ['Leyendo el pedido de WhatsApp', 'Pedido #1042 cargado'],
      ['Revisando el stock', '3 productos por reponer'],
      ['Armando la factura', 'Factura A 0003-00001042 emitida'],
      ['Buscando la lista de precios', '2 consultas respondidas'],
    ];
    const reset = () => {
      tasks.forEach(t => t.classList.remove('run', 'done', 'gone'));
      rows.forEach(r => r.classList.remove('fin', 'gone'));
      [agents, result, done].forEach(e => e.classList.remove('show'));
      subs.forEach((s, i) => setSub(s, COPY[i][0], true));
      cnt.textContent = '4';
      on(pill, 'on', false); pillSet(pill, 'Paranexo está trabajando', false);
    };
    const final = () => {
      reset();
      tasks.slice(0, 4).forEach(t => t.classList.add('gone'));
      subs.forEach((s, i) => setSub(s, COPY[i][1], true));
      cnt.textContent = '0';
      done.classList.add('show'); result.classList.add('show');
      on(pill, 'on'); pillSet(pill, 'Paranexo terminó', true);
    };
    const play = () => {
      reset();
      at(500, () => on(pill));
      tasks.slice(0, 4).forEach((t, i) => at(1200 + i * 140, () => t.classList.add('run')));
      at(1900, () => agents.classList.add('show'));
      [3300, 4000, 4700, 5400].forEach((ms, i) => at(ms, () => { setSub(subs[i], COPY[i][1]); rows[i].classList.add('fin'); }));
      [0, 1, 2, 3].forEach(i => {
        const t = 6300 + i * 520;
        at(t, () => tasks[i].classList.add('done'));
        at(t + 480, () => { rows[i].classList.add('gone'); tasks[i].classList.add('gone'); cnt.textContent = String(3 - i); });
      });
      at(8900, () => { agents.classList.remove('show'); done.classList.add('show'); });
      at(9300, () => result.classList.add('show'));
      at(9800, () => pillSet(pill, 'Paranexo terminó', true));
    };
    return { reset, final, play, length: 10600 };
  })();

  // -- Scene 2: software a medida --
  const S = (() => {
    const el = els[1], pill = $('.pill', el), kpis = $$('.kpi b', el), rows = $$('.trow:not(.th):not(#new-row)', el);
    const toast = $('#toast'), fresh = $('#new-row'), bK = $('#b-kiosco'), bD = $('#b-despensa'), k1 = $('#k1');
    const badge = (b, text, cls) => { b.textContent = text; b.className = 'badge' + (cls ? ' ' + cls : ''); };
    const reset = () => {
      rows.forEach(r => on(r, 'pre', !reduce));
      fresh.classList.add('gone'); on(toast, 'on', false);
      kpis.forEach(k => { k.textContent = reduce ? k.dataset.to : '0'; });
      badge(bK, 'En camino', 'warn'); badge(bD, 'Preparando');
      on(pill, 'on', false); pillSet(pill, 'Tu panel se actualiza solo', false);
    };
    const final = () => {
      rows.forEach(r => r.classList.remove('pre'));
      kpis.forEach(k => { k.textContent = k.dataset.to; });
      k1.textContent = '19'; fresh.classList.remove('gone'); on(toast, 'on', false);
      badge(bK, 'Entregado', 'ok'); badge(bD, 'En camino', 'warn');
      on(pill, 'on'); pillSet(pill, 'Todo al día', true);
    };
    const play = () => {
      reset();
      at(300, () => on(pill));
      rows.forEach((r, i) => at(500 + i * 160, () => r.classList.remove('pre')));
      kpis.forEach(k => at(600, () => countTo(k, 0, +k.dataset.to, 1000)));
      at(3000, () => on(toast));
      at(3500, () => { fresh.classList.remove('gone'); countTo(k1, 18, 19, 500); });
      at(4900, () => badge(bK, 'Entregado', 'ok'));
      at(5700, () => { badge(bD, 'En camino', 'warn'); on(toast, 'on', false); });
      at(6400, () => pillSet(pill, 'Todo al día', true));
    };
    return { reset, final, play, length: 7000 };
  })();

  // -- Scene 3: asistente con IA --
  const I = (() => {
    const el = els[2], pill = $('.pill', el), bubs = $$('.bub', el), typing = $$('.typing', el), res = $('.result', el);
    const reset = () => {
      bubs.forEach(b => on(b, 'on', false)); typing.forEach(t => on(t, 'on', false)); res.classList.remove('show');
      on(pill, 'on', false); pillSet(pill, 'El asistente está respondiendo', false);
    };
    const final = () => {
      bubs.forEach(b => on(b)); typing.forEach(t => on(t, 'on', false)); res.classList.add('show');
      on(pill, 'on'); pillSet(pill, 'Turno agendado', true);
    };
    const play = () => {
      reset();
      at(400, () => on(pill));
      at(700, () => on(bubs[0]));
      at(1700, () => on(typing[0]));
      at(3000, () => { on(typing[0], 'on', false); on(bubs[1]); });
      at(4300, () => on(bubs[2]));
      at(5000, () => on(typing[1]));
      at(6200, () => { on(typing[1], 'on', false); on(bubs[3]); });
      at(7000, () => res.classList.add('show'));
      at(7500, () => pillSet(pill, 'Turno agendado', true));
    };
    return { reset, final, play, length: 8000 };
  })();

  const scenes = [A, S, I];
  const run = () => {
    stop();
    tabs.forEach((t, i) => on(t, 'running', i === active && !reduce));
    if (reduce) { scenes[active].final(); return; }
    replay.disabled = true;
    scenes[active].play();
    at(scenes[active].length, () => { replay.disabled = false; on(tabs[active], 'running', false); });
  };
  const select = (i, focus) => {
    active = i;
    tabs.forEach((t, k) => { t.setAttribute('aria-selected', String(k === i)); t.tabIndex = k === i ? 0 : -1; on(els[k], 'on', k === i); });
    cap.textContent = els[i].dataset.cap;
    if (focus) tabs[i].focus();
    started = true;
    run();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', e => {
      const n = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? (i + 1) % 3 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? (i + 2) % 3 : e.key === 'Home' ? 0 : e.key === 'End' ? 2 : -1;
      if (n >= 0) { e.preventDefault(); select(n, true); }
    });
  });
  replay.addEventListener('click', run);
  if (reduce) { replay.hidden = true; scenes.forEach(s => s.final()); }
  else {
    scenes.forEach(s => s.reset());
    new IntersectionObserver((es, o) => { if (es[0].isIntersecting && !started) { started = true; run(); o.disconnect(); } }, { threshold: .4 }).observe(stage);
  }
  // opening the invoice is a mock: say so for a moment
  const open = $('#open-file');
  open?.addEventListener('click', () => { open.textContent = 'Ejemplo'; setTimeout(() => { open.textContent = 'Abrir'; }, 1400); });
}
