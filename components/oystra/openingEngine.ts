// @ts-nocheck
// The scroll opening's engine, ported from the approved prototype (pipeline/signature/scrollproto/page.html):
// a canvas draws the frame sequence by eased scroll time, and every title has its own scroll-tied reveal.
// Plain DOM code on purpose: it is the prototype's script, scoped to one root element, with a clean-up.
// Timings are in seconds of scroll time (one second of scroll time = one second of film).
const BASE = '/projects/oystra/opening';
const FRAMES = 344;

export function mountOpening(root: HTMLElement, gsap: any, go: (id: string) => void): () => void {
  const $ = (s: string, r: ParentNode = root) => r.querySelector(s) as any;
  const $$ = (s: string, r: ParentNode = root) => [...r.querySelectorAll(s)] as any[];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (t: number) => t * t * (3 - 2 * t);
  let dead = false;

  // ── picture ────────────────────────────────────────────────────────────────
  const cv = $('#cv'), cx = cv.getContext('2d'), track = $('.track');
  const W = cv.width, H = cv.height, dot = $('#dot'), hint = $('#hint'), hero = $('.oyhero'), stage = $('.stage');
  const load = (src: string) => { const i = new Image(); i.decoding = 'async'; i.src = src; return i; };
  const fr = Array.from({ length: FRAMES }, (_, i) => load(`${BASE}/fr/${String(i + 1).padStart(4, '0')}.webp`));
  const st: Record<string, HTMLImageElement> = Object.fromEntries(['day', 'golden', 'blue', 'night'].map(k => [`hd-front-${k}`, load(`${BASE}/hd-front-${k}.webp`)]));
  // frames play, then four aligned stills cross-fade from day to night, then the night view holds and drifts closer
  const SEG = [{ t: 'frames', a: 0, b: 151, w: 19 }, { t: 'frames', a: 151, b: FRAMES - 1, w: 24 },
    { t: 'fade', im: ['hd-front-day', 'hd-front-golden', 'hd-front-blue', 'hd-front-night'], w: 8 }, { t: 'hold', im: 'hd-front-night', w: 5 }];
  const TOTAL = SEG.reduce((s, x) => s + x.w, 0);
  const ok = (i: any) => i && i.complete && i.naturalWidth;
  function put(i: any, alpha = 1, zoom = 1, dy = 0) { if (!ok(i)) return; cx.globalAlpha = alpha; const w = W * zoom, h = H * zoom; cx.drawImage(i, (W - w) / 2, (H - h) / 2 + dy * H, w, h); cx.globalAlpha = 1; }
  const near = (k: number) => { for (let d = 0; d < 60; d++) { if (ok(fr[k - d])) return fr[k - d]; if (ok(fr[k + d])) return fr[k + d]; } return null; };
  let beatsFn: ((sec: number) => void) | null = null;
  function draw(sec: number) {
    let s = sec, g: any = SEG[SEG.length - 1], u = 1;
    for (const x of SEG) { if (s <= x.w) { g = x; u = x.w ? s / x.w : 0; break; } s -= x.w; }
    if (g.t === 'frames') { const f = g.a + u * (g.b - g.a), a = Math.floor(f), b = Math.min(g.b, a + 1); put(near(a)); if (f - a > .01 && ok(fr[b])) put(fr[b], f - a); }
    else if (g.t === 'fade') { const f = u * (g.im.length - 1), a = Math.floor(f), b = Math.min(g.im.length - 1, a + 1); put(st[g.im[a]]); if (f - a > .001) put(st[g.im[b]], smooth(f - a)); }
    else if (g.t === 'hold') { put(st[g.im], 1, 1 + .08 * u, .035 * u); }
    dot.style.top = (sec / TOTAL * 113) + 'px'; hint.style.opacity = sec > .3 ? 0 : 1;
    hero.classList.toggle('on', sec >= +hero.dataset.s && sec < +hero.dataset.e);
    if (beatsFn) beatsFn(sec);
  }
  let target = 0, cur = 0, raf = 0;
  function progress() { const r = track.getBoundingClientRect(), span = r.height - innerHeight; return Math.min(1, Math.max(0, -r.top / span)) * TOTAL; }
  function tick() { if (dead) return; cur += (target - cur) * (reduce ? 1 : .12); if (Math.abs(target - cur) < .002) cur = target; draw(cur); raf = cur === target ? 0 : requestAnimationFrame(tick); }
  function onScroll() { target = progress(); if (!raf) raf = requestAnimationFrame(tick); }
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll);
  [...fr, ...Object.values(st)].forEach(i => i.addEventListener('load', () => { if (!raf && !dead) draw(cur); }, { once: true }));

  // ── titles ─────────────────────────────────────────────────────────────────
  // split a headline into characters or words, keeping <br>
  function split(el: any) {
    const mode = el.dataset.split, out: any[] = [];
    const walk = (n: any) => { [...n.childNodes].forEach((c: any) => {
      if (c.nodeType === 3) { const f = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach((w: string) => { if (!w) return; if (/^\s+$/.test(w)) { f.append(' '); return; }
          if (mode === 'words') { const m = document.createElement('span'); m.className = 'wdm'; const s = document.createElement('span'); s.className = 'wd'; s.textContent = w; m.append(s); f.append(m); out.push(s); }
          else { const m = document.createElement('span'); m.style.display = 'inline-block'; m.style.whiteSpace = 'nowrap';
            [...w].forEach(ch => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = ch; m.append(s); out.push(s); }); f.append(m); } });
        c.replaceWith(f); }
      else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c); }); };
    walk(el); return out;
  }
  const beats: any[] = [], scrubs: ((sec: number) => void)[] = [];
  let fgT: any = 0;
  const ctx = gsap.context(() => {
    // a timeline that plays when its scroll window is entered and runs back when it is left
    function beat(el: any, s: number, e: number, build: (tl: any, el: any) => void) { const tl = gsap.timeline({ paused: true }); build(tl, el); beats.push({ el, s, e, tl, on: false }); gsap.set(el, { visibility: 'hidden' }); }
    // motion tied to the scroll: p runs 0..1 between a and b, out runs 0..1 between oa and ob
    const tie = (a: number, b: number, oa: number, ob: number, fn: (p: number, out: number, sec: number) => void) => scrubs.push(sec => fn(smooth(clamp((sec - a) / (b - a))), clamp((sec - oa) / (ob - oa)), sec));
    const show = (el: any, p: number, out: number) => { el.style.visibility = p <= 0 || out >= 1 ? 'hidden' : 'visible'; el.style.opacity = 1 - out; };
    const pl = $('#pl');
    // the Line: a path that draws itself with p; optionally a pearl rides its tip
    function line(el: any, pearl: boolean) { const L = el.getTotalLength(); el.style.strokeDasharray = L;
      return (p: number, out: number) => { el.style.strokeDashoffset = L * (1 - p); el.style.opacity = p <= 0 ? 0 : 1 - out;
        if (pearl && p > 0 && p < 1) { const pt = el.getPointAtLength(L * p); pl.setAttribute('cx', pt.x); pl.setAttribute('cy', pt.y); pl.style.opacity = 1; pl._by = el; }
        else if (pearl && pl._by === el) { pl.style.opacity = 0; pl._by = null; } }; }
    const icons = (el: any, s: number, e: number) => beat(el, s, e, tl => {
      tl.fromTo($$('path', el), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut', stagger: .06 }, 0)
        .fromTo($$('span', el), { opacity: 0 }, { opacity: 1, duration: .8, stagger: .16 }, .2); });

    // 1 · surfacing, fast: the emblem clears, the letters rise out of blur and depth, then drift. It leaves before the opening shell reaches it.
    beat($('.b1'), 0, 2.55, (tl, el) => { const ch = split($('.ti', el));
      tl.fromTo($('.emb', el), { clipPath: 'inset(0 100% 0 0)', filter: 'blur(8px)', opacity: 0 }, { clipPath: 'inset(0 0% 0 0)', filter: 'blur(0px)', opacity: 1, duration: .9, ease: 'power2.inOut' }, .05)
        .fromTo($('.eb', el), { opacity: 0, letterSpacing: '.6em' }, { opacity: 1, letterSpacing: '.3em', duration: .8, ease: 'power2.out' }, .2)
        .fromTo(ch, { opacity: 0, y: 26, filter: 'blur(14px)', scale: 1.2 }, { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, duration: .95, ease: 'power3.out', stagger: { each: .011, from: 'center' } }, .3);
      if (!reduce) gsap.to(el, { y: 7, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1 }); });

    // 2 · the pearl: the words open like an iris from the pearl's side; the Line runs under the shell
    const b2 = $('.b2'), in2 = $('.in', b2);
    tie(6.5, 7.8, 9.2, 9.8, (p, out) => { show(b2, p, out); b2.style.setProperty('--np', p); in2.style.clipPath = `circle(${p * 160}% at 0% 50%)`; });
    tie(7.8, 9.0, 9.3, 9.9, line($('#ln2'), true));

    // 3 · the sun in the arch: the words are lit from below as the light spreads; the Line runs above the building, along its roof
    const b3 = $('.b3'), in3 = $('.in', b3);
    tie(13.2, 14.2, 15.3, 15.9, (p, out) => { show(b3, p, out); in3.style.clipPath = `circle(${p * 170}% at 50% 220%)`; });
    tie(13.2, 14.3, 14.5, 15, line($('#ln3'), true));

    // 4 · the Line draws along the shore, a pearl riding its tip; the words settle onto its underline; the figures come up quietly, one after another
    tie(16.9, 18.8, 20.3, 21.1, line($('#ln4'), true));
    beat($('.b4'), 17.4, 20.5, (tl, el) => { const wd = split($('.ti', el));
      tl.fromTo($('.ul', el), { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: 'power3.inOut' }, 0)
        .fromTo(wd, { yPercent: 115 }, { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: .08 }, .3)
        .fromTo($$('.figs div', el), { opacity: 0, y: 16, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out', stagger: .22 }, .55)
        .fromTo($('.eb', el), { opacity: 0 }, { opacity: 1, duration: 1 }, 1.2); });

    // 5 · the sky pool: wiped in from the left behind a fine upright line, the way the camera is flying; then its three icons draw
    const b5 = $('.b5'), in5 = $('.in', b5), vl5 = $('.vl', b5);
    tie(20.8, 21.9, 23.5, 24.1, (p, out) => { show(b5, p, out); in5.style.clipPath = `inset(-10% ${(1 - p) * 100}% -10% 0)`;
      vl5.style.left = (p * 100) + '%'; vl5.style.opacity = p > 0 && p < 1 ? 1 : 0; });
    icons($('.ics', b5), 21.7, 23.7);

    // 7 · the waterline drops down the title as the camera surfaces; the words shed their blur; the icons draw; the Line runs along the outer rim of the pool
    const b7 = $('.b7'), in7 = $('.in', b7), wl7 = $('.wl', b7), wp7 = $('path', wl7);
    tie(32.3, 33.8, 36.5, 37.2, (_p, out, sec) => { const p = clamp((sec - 32.3) / 1.5), h = b7.offsetHeight; show(b7, sec > 32.2 ? 1 : 0, out);
      in7.style.clipPath = `inset(0 0 ${(1 - p) * 100}% 0)`; in7.style.filter = `blur(${(1 - smooth(p)) * 7}px)`;
      wl7.style.transform = `translateY(${p * h - 12}px)`; wl7.style.opacity = p <= 0 || p >= 1 ? 0 : 1;
      if (!reduce) wp7.setAttribute('transform', `translate(${-((sec * 60) % 200)} 0) scale(1.18 1)`); });
    icons($('.ics', b7), 33.5, 37);
    tie(33.6, 35, 36.2, 36.9, line($('#ln7'), true));

    // 8 · the pull-back: the Line runs under the buildings along the shore and the words are written in with it; it stays into the dusk
    const b8 = $('.b8'), in8 = $('.in', b8);
    tie(41.4, 43.1, 44.5, 45.1, (p, out) => { show(b8, p, out); b8.style.setProperty('--np', p); in8.style.clipPath = `inset(-60% ${(1 - p) * 100}% -60% -30%)`; });
    tie(41.4, 43.1, 47.4, 48.6, line($('#ln8'), true));

    // 9 · dusk: the letters come on one by one, like lamps
    const b9 = $('.b9'), ch9 = split($('.ti', b9)), eb9 = $('.eb', b9);
    tie(45.5, 47.3, 48.2, 48.8, (_p, out, sec) => { const p = clamp((sec - 45.5) / 1.8); show(b9, p, out); eb9.style.opacity = clamp(p * 4);
      ch9.forEach((c, i) => { c.style.opacity = clamp(p * (ch9.length + 4) - i); }); });
  }, root);

  // hero · the lit buildings are drawn again above the wordmark, so it rises from behind the roofline; then the cut-out fades away
  const fg = $('#fg'), fx = fg.getContext('2d'), fim = load(fg.dataset.src);
  function drawFg(sec: number) { const a = sec < 48.33 ? 0 : sec >= 51 ? 1 : smooth((sec - 48.33) / 2.67); fx.clearRect(0, 0, 1280, 720);
    if (a <= 0 || !ok(fim)) return; const u = clamp((sec - 51) / 5), z = 1 + .08 * u, w = 1280 * z, h = 720 * z;
    fx.globalAlpha = a; fx.drawImage(fim, (1280 - w) / 2, (720 - h) / 2 + .035 * u * 720, w, h); fx.globalAlpha = 1; }
  const mo = new MutationObserver(() => { clearTimeout(fgT); fg.style.transition = 'none'; fg.style.opacity = 1; stage.classList.toggle('end', hero.classList.contains('on'));
    if (hero.classList.contains('on')) fgT = setTimeout(() => { fg.style.transition = 'opacity 1s ease'; fg.style.opacity = 0; }, 1700); });
  mo.observe(hero, { attributes: true, attributeFilter: ['class'] });

  let last = -1;
  beatsFn = sec => { if (sec === last) return; last = sec;
    beats.forEach(b => { const on = sec >= b.s && sec < b.e; if (on === b.on) return; b.on = on;
      if (on) { gsap.set(b.el, { visibility: 'visible' }); b.tl.timeScale(1).play(); }
      else b.tl.timeScale(2.6).reverse().eventCallback('onReverseComplete', () => { if (!b.on) gsap.set(b.el, { visibility: 'hidden' }); }); });
    scrubs.forEach(f => f(sec)); drawFg(sec); };
  fim.addEventListener('load', () => { last = -1; onScroll(); }, { once: true });

  // the two actions on the final screen lead into the page below
  const onGo = (e: Event) => { const b = (e.target as HTMLElement).closest('[data-go]') as HTMLElement | null; if (b) go(b.dataset.go!); };
  root.addEventListener('click', onGo);
  onScroll();

  return () => { dead = true; cancelAnimationFrame(raf); clearTimeout(fgT); mo.disconnect(); ctx.revert();
    removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); root.removeEventListener('click', onGo);
    fr.forEach(i => { i.src = ''; }); };
}
