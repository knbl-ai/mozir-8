// @ts-nocheck
// The location section's engine: one paused GSAP timeline, told as a story and moved by scroll.
//   0 · close on the four residences, drawn as in the home selector above, standing on their island (the map is turned
//       so the plan reads as it does there, the sea side up)
//   1 · every scroll draws the view back: the shore, then the island; the map turns to north-up; the project in
//       figures, what lies around it, what the building has
//   2 · Al Marjan whole: sea rings, coast and roads; Oystra becomes a pearl on it (the island is named in the heading
//       of the first list of places, not in a caption of its own)
//   3 · journeys in two scrolls: the three places near the island together, then the map draws back once and the
//       three far ones appear together. Each is a row (icon, minutes, name); its line bows its own way so no two run together
// Data: public/projects/oystra/map/geo.json, traced from OpenStreetMap (pipeline repo: pipeline/signature/locmap).
// The building's plan comes from map/selector2.json and is placed by geo.building (pipeline: locmap/place.py).
// Everything is in one flat "world"; the camera is the SVG viewBox (its width moves evenly in scale, not in distance). --u = world units per screen pixel, so line weights
// and letters keep their size on screen at every scale.
const NS = 'http://www.w3.org/2000/svg', ASPECT = 1.6;
// camera stops [width of world shown, where Oystra sits on the screen x, y]: the islands, then the whole coast to Dubai
// (Oystra in the upper right, so the long coast has the screen and the list of far places has the left side).
// The far stop keeps every place in the upper two thirds of the screen: the next section's curved edge rises over the
// foot of the map as it leaves, and must not cover a place.
const CLOSE = 9.5, NEAR = [215, .54, .44], FAR = [2600, .78, .1];
// how each journey's line bows, as a share of its length to one side (+) or the other (-): near ones fan apart above and
// below; of the two that run to Dubai, one bows inland and one out over the sea
const BOW = [-.3, -.36, .42, -.22, .16, -.2];
// on the map a place carries a short name and its minutes (the list beside the map has the full name), set to the side
// of its dot that its line does not come from, so no name lies on a line or on another name
const SHORT = ['Wynn', 'Al Hamra Mall', 'Golf Club', 'RAK Airport', 'Dubai Airport', 'Dubai Mall'], SIDE = [1, 1, 1, -1, 1, -1], RISE = [-.9, 1.1, -.9, .35, .35, .35];   // the name's baseline, in its own letter heights from the dot
const GEM = 'M24 6l13 13-13 23L11 19zM11 19h26M18 19l6 23 6-23', BAG = 'M10 17h28l-2 25H12zM18 17v-3a6 6 0 0 1 12 0v3', FLAG = 'M17 42V6l17 7-17 7M9 42h18',
  PLANE = 'M24 5c2 0 3 2 3 5v9l15 9v4l-15-4v8l5 4v3l-8-2-8 2v-3l5-4v-8l-15 4v-4l15-9v-9c0-3 1-5 3-5z', CITY = 'M24 4v38M20 42V18l4-14 4 14v24M10 42V28h6v14M32 42V24h6v18M6 42h36';
const TRIP_ICON = [GEM, BAG, FLAG, PLANE, PLANE, CITY];
const esc = (t: string) => t.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]!));

export type Story = {
  first: { eyebrow: string; big: string; lines: string[]; note: string }; around: { eyebrow: string; lines: string[] };
  has: { eyebrow: string; items: [string, string][] };   // [icon path, name]
  island: { eyebrow: string; big: string; line: string };
};

export function mountLocation(root: HTMLElement, gsap: any, geo: any, story: Story, still: boolean, plan?: any): () => void {
  const q = (k: string) => root.querySelector(`[data-g="${k}"]`) as any;
  const el = (g: any, tag: string, at: any = {}, txt?: string) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); if (txt) e.textContent = txt; (typeof g === 'string' ? q(g) : g).appendChild(e); return e; };
  const map = q('map'), left = q('story'), right = q('storyR');
  ['far', 'ct', 'rd', 'coast', 'isl', 'bld', 'tripsG', 'places', 'oy'].forEach(k => { q(k).replaceChildren(); }); left.replaceChildren(); right.replaceChildren();
  // a caption: the outer box is the one the timeline moves; the inner one centres the text on the stage's middle line (CSS)
  const slide = (box: any, html: string) => { const d = document.createElement('div'); d.innerHTML = `<div data-s="in">${html}</div>`; box.appendChild(d); return d; };
  const block = (b: any) => `<p data-s="eb">${esc(b.eyebrow)}</p>${b.big ? `<p data-s="big">${esc(b.big)}</p>` : ''}${(b.lines || []).map((l: string) => `<p data-s="line">${esc(l)}</p>`).join('')}${b.note ? `<p data-s="note">${esc(b.note)}</p>` : ''}`;

  const O = geo.oystra;
  // the map
  const isl = geo.islands.map((t: any) => el('isl', 'path', { 'data-k': 'isl', d: t.d, pathLength: 1 }));
  const far = el('far', 'path', { 'data-k': 'coast', d: geo.coast.far, pathLength: 1 });
  const rdFar = geo.roads.far.map((d: string) => el('far', 'path', { 'data-k': 'rd', d }));
  const cts = geo.contours.map((d: string) => el('ct', 'path', { 'data-k': 'ct', d, pathLength: 1 }));
  const rds = geo.roads.near.map((d: string) => el('rd', 'path', { 'data-k': 'rd', d, pathLength: 1 }));
  const coast = el('coast', 'path', { 'data-k': 'coast', d: geo.coast.near, pathLength: 1 });
  const trips = geo.places.map((pl: any, i: number) => {
    const [x, y] = pl.at, dx = x - O[0], dy = y - O[1], k = BOW[i];
    const cx = (O[0] + x) / 2 + dy * k, cy = (O[1] + y) / 2 - dx * k, d = `M${O[0]} ${O[1]}Q${cx} ${cy} ${x} ${y}`;
    const id = 'lu-tm' + i, m = el('tripsG', 'mask', { id, maskUnits: 'userSpaceOnUse', x: -600, y: 0, width: 2400, height: 1400 });
    const mp = el(m, 'path', { 'data-k': 'tripMask', d, pathLength: 1 });
    const line = el('tripsG', 'path', { 'data-k': 'trip', d, mask: `url(#${id})` }), light = el('tripsG', 'circle', { 'data-k': 'light' });
    const dot = el('places', 'circle', { 'data-k': 'dot', cx: x, cy: y });
    const end = SIDE[i] < 0, at = { x, y, dx: end ? '-1em' : '1em', 'text-anchor': end ? 'end' : 'start' };
    // the minutes sit one line under the name (names are 11 px on screen, minutes 9.5 px: see the stylesheet)
    const lab = el('places', 'text', { 'data-k': 'lab', ...at, dy: `${RISE[i]}em` }, SHORT[i]), tag = el('places', 'text', { 'data-k': 'min', ...at, dy: `${((RISE[i] * 11 + 15) / 9.5).toFixed(2)}em` }, `${pl.min} min`);
    return { pl, mp, line, light, dot, lab, tag, q: [O[0], O[1], cx, cy, x, y] };
  });
  const ring = el('oy', 'circle', { 'data-k': 'ring', cx: O[0], cy: O[1], r: .6 }), pearl = el('oy', 'circle', { 'data-k': 'pearl', cx: O[0], cy: O[1] });
  const word = el('oy', 'text', { 'data-k': 'word', x: O[0], y: O[1], dx: '-.9em', dy: '-.5em', 'text-anchor': 'end' }, 'OYSTRA');
  // the four residences as in the selector: the common outline, floor 9 as the plate, its homes, the four letters (in metres, placed on the island)
  const B = plan && geo.building, bg = q('bld'), world = q('world'); let bbase: any = null, bplate: any = null, bsmall: any[] = [];
  if (B) {
    bg.setAttribute('transform', `translate(${B.at[0]} ${B.at[1]}) rotate(${B.turn}) scale(${1 / B.k}) translate(${-B.c[0]} ${-B.c[1]})`);
    bbase = el(bg, 'path', { 'data-k': 'bbase', d: plan.base, pathLength: 1 }); bplate = el(bg, 'path', { 'data-k': 'bplate', d: plan.plates['9'] });
    bsmall = [...(plan.homes['9'] || []).map((h: any) => el(bg, 'path', { 'data-k': 'bcell', d: h.d })), ...plan.residences.map((r: any) => el(bg, 'text', { 'data-k': 'bletter', x: r.at, y: plan.h + 16, 'text-anchor': 'middle' }, r.id))];
  }
  const TURN = B ? -B.turn : 0;      // how far the map is turned at the start, so the plan stands as it does in the selector
  // the captions
  const L1 = slide(left, block(story.first)), R1 = slide(right, block(story.around));
  // what the building has: the list alone, on the left, under its small heading
  const R3 = slide(left, `<p data-s="eb">${esc(story.has.eyebrow)}</p><ul data-s="has">${story.has.items.map(([ic, n]) => `<li><svg viewBox="0 0 48 48" aria-hidden="true"><path pathLength="1" d="${ic}"/></svg><span>${esc(n)}</span></li>`).join('')}</ul>`);
  [L1, R3].forEach(d => d.setAttribute('data-s', 'narrow'));   // beside the plan, not over it
  // the journeys as two lists: the near places, then the far ones. The number stands in a window and rises into it
  const rows = (from: number, eyebrow: string) => { const d = slide(left, `<p data-s="eb">${esc(eyebrow)}</p><ul data-s="trips">${trips.slice(from, from + 3).map((t: any, j: number) => `<li><svg viewBox="0 0 48 48" aria-hidden="true"><path pathLength="1" d="${TRIP_ICON[from + j]}"/></svg><p data-s="tnum"><span><b>${t.pl.min}</b></span><i>min</i></p><p data-s="tname">${esc(t.pl.name)}</p></li>`).join('')}</ul>`); d.setAttribute('data-s', 'narrow'); return d; };
  const SA = rows(0, story.island.big + ' · minutes from home'), SB = rows(3, 'Along the coast');
  SB.style.top = '-9vh';   // the last list sits a little high, clear of the next section's curved edge as it rises

  // the camera: lw = log of the world width shown (so a steady scroll is a steady zoom), where Oystra sits on screen, and the map's turn
  const P = { lw: Math.log(B ? CLOSE : NEAR[0]), fx: B ? .5 : NEAR[1], fy: B ? .3 : NEAR[2], rot: TURN };
  const setCam = () => {
    const w = Math.exp(P.lw), h = w / ASPECT; map.setAttribute('viewBox', `${O[0] - P.fx * w} ${O[1] - P.fy * h} ${w} ${h}`);
    world.setAttribute('transform', `rotate(${P.rot} ${O[0]} ${O[1]})`);
    const b = map.getBoundingClientRect(); if (b.width) map.style.setProperty('--u', String(Math.max(w / b.width, h / b.height)));
  };
  let raf = 0;
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });
    const draw = (els: any, at: number, dur: number, o: any = {}) => tl.fromTo(els, { strokeDashoffset: 1, strokeDasharray: 1 }, { strokeDashoffset: 0, duration: dur, ease: 'power2.inOut', ...o }, at);
    // a caption arrives, holds, and gives way to the next; from: -1 comes in from the left side, 1 from the right
    const say = (sl: any, tin: number, tout: number) => { tl.fromTo(sl, { opacity: 0, y: 26, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .55 }, tin); tl.to(sl, { opacity: 0, y: -16, filter: 'blur(8px)', duration: .35, ease: 'power2.in' }, tout); };
    gsap.set([...cts, ...rds], { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set([far, ...rdFar, cts, rds, word, pearl, ...isl, coast, ...left.children, ...right.children, ...trips.flatMap((t: any) => [t.dot, t.lab, t.tag, t.light])], { opacity: 0 }); gsap.set(ring, { opacity: 0 });
    const zoom = (w: number, at: number, dur: number, o: any = {}) => tl.to(P, { lw: Math.log(w), duration: dur, ease: 'sine.inOut', ...o }, at);
    const has = () => { tl.fromTo(R3.querySelectorAll('li'), { opacity: 0, x: -18 }, { opacity: 1, x: 0, duration: .45, stagger: .11 }, 3.6); tl.fromTo(R3.querySelectorAll('li path'), { strokeDashoffset: 1, strokeDasharray: 1 }, { strokeDashoffset: 0, duration: .8, stagger: .11, ease: 'power2.inOut' }, 3.6); };

    // 0 · close on the four residences on their island; they come down from the top of the stage and settle
    tl.to([...isl, coast], { opacity: 1, duration: .5 }, 0);
    if (B) {
      gsap.set([bbase, bplate, ...bsmall], { opacity: 0 });
      tl.to(bbase, { opacity: 1, duration: .3 }, 0); draw(bbase, 0, 1.1);
      tl.to([bplate, ...bsmall], { opacity: 1, duration: .5, stagger: .004 }, .35);
      tl.to(P, { fy: .5, duration: 1.3, ease: 'power2.out' }, 0);
    }
    say(L1, 1.5, 3.1); say(R1, 1.8, 3.1);   // the figures arrive once the view has begun to draw back and there is room beside the plan
    // 1 · each scroll draws the view back: the shore and the island take shape, the map turns to north-up
    zoom(26, 1.0, 2.2, { rot: TURN * .45 });
    if (B) tl.to(bsmall, { opacity: 0, duration: .6 }, 2.0);
    say(R3, 3.3, 6.2); has();
    zoom(72, 3.2, 3.0, { rot: 0 });
    // 2 · Al Marjan whole; the building becomes a pearl on it
    tl.fromTo(pearl, { opacity: 0, scale: 0, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: .5, ease: 'back.out(2.4)' }, 5.7);
    tl.fromTo(ring, { attr: { r: .6 }, opacity: .9 }, { attr: { r: 4.2 }, opacity: 0, duration: 1.1, ease: 'power1.out', immediateRender: false }, 5.8);
    if (B) tl.to([bbase, bplate], { opacity: 0, duration: .8 }, 5.7);
    zoom(NEAR[0], 6.2, 2.6, { fx: NEAR[1], fy: NEAR[2] });
    tl.to(cts, { opacity: 1, duration: .4, stagger: .08 }, 7.0); draw(cts, 7.0, 1.5, { stagger: .08 });
    tl.to(rds, { opacity: 1, duration: .3 }, 7.5); draw(rds, 7.5, 1.2, { stagger: { amount: .7 } });
    tl.fromTo(word, { opacity: 0 }, { opacity: 1, duration: .6 }, 7.8);
    // 3 · journeys, in two scrolls. A place: its line draws while a light travels it, its dot and name arrive on the map,
    // and its row arrives in the list: the icon draws and the number rises into its window (no counting)
    const go = (t: any, row: any, at: number) => {
      const dur = .7; draw(t.mp, at, dur);
      const s = { k: 0 }, [x0, y0, cx, cy, x1, y1] = t.q;
      tl.fromTo(s, { k: 0 }, { k: 1, duration: dur, ease: 'power2.inOut', onUpdate: () => { const k = s.k, a = (1 - k) * (1 - k), b = 2 * k * (1 - k), c = k * k; t.light.setAttribute('cx', a * x0 + b * cx + c * x1); t.light.setAttribute('cy', a * y0 + b * cy + c * y1); } }, at);
      tl.fromTo(t.light, { opacity: 0 }, { opacity: 1, duration: .08 }, at).to(t.light, { opacity: 0, duration: .25 }, at + dur);
      tl.fromTo([t.dot, t.lab, t.tag], { opacity: 0 }, { opacity: 1, duration: .35, stagger: .06 }, at + dur - .2);
      tl.fromTo(row, { opacity: 0, x: -18 }, { opacity: 1, x: 0, duration: .45 }, at);
      tl.fromTo(row.querySelector('path'), { strokeDashoffset: 1, strokeDasharray: 1 }, { strokeDashoffset: 0, duration: .7, ease: 'power2.inOut' }, at);
      tl.fromTo(row.querySelector('b'), { yPercent: 115 }, { yPercent: 0, duration: .7, ease: 'power4.out' }, at + .1);
      tl.fromTo(row.querySelectorAll('i,[data-s="tname"]'), { opacity: 0 }, { opacity: 1, duration: .5 }, at + .35);
    };
    const A = 8.4, B2 = A + 2.45, near = trips.slice(0, 3), ra = SA.querySelectorAll('li'), rb = SB.querySelectorAll('li');
    // first scroll: the three places near the island, together
    say(SA, A - .2, A + 1.9); near.forEach((t: any, j: number) => go(t, ra[j], A + j * .28));
    // the map draws back once, to the whole coast, and the far places begin while it is still moving: no empty screen between
    tl.to([...near.flatMap((t: any) => [t.lab, t.tag, t.dot, t.line]), cts, rds], { opacity: 0, duration: .4 }, A + 1.8);
    tl.to(P, { lw: Math.log(FAR[0]), fx: FAR[1], fy: FAR[2], duration: 1.0, ease: 'power2.inOut' }, A + 1.8);
    tl.to([far, ...rdFar], { opacity: 1, duration: .7 }, A + 1.9); tl.to(coast, { opacity: 0, duration: .5 }, A + 2.2);
    // second scroll: the three far places, together; they stay to the end
    tl.fromTo(SB, { opacity: 0, y: 26, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .55 }, B2 - .1);
    trips.slice(3).forEach((t: any, j: number) => go(t, rb[j], B2 + j * .28));
    tl.to({}, { duration: 1.1 });

    // scroll → the timeline, with a short glide behind the scroll. The story begins as the section comes up the screen, before it pins
    let cur = still ? 1 : 0, target = cur, shown = -1;
    const read = () => { const r = root.getBoundingClientRect(), lead = innerHeight * .35; target = still ? 1 : Math.min(1, Math.max(0, (lead - r.top) / Math.max(1, r.height - innerHeight + lead))); };
    const tick = () => { cur += (target - cur) * .12; if (Math.abs(target - cur) < .0004) cur = target; if (cur !== shown) { tl.progress(cur); setCam(); shown = cur; root.toggleAttribute('data-end', cur > .9); } raf = requestAnimationFrame(tick); };
    read(); addEventListener('scroll', read, { passive: true }); addEventListener('resize', read); addEventListener('resize', setCam); raf = requestAnimationFrame(tick);
    (ctx as any).off = () => { removeEventListener('scroll', read); removeEventListener('resize', read); removeEventListener('resize', setCam); };
  }, root);
  return () => { cancelAnimationFrame(raf); (ctx as any).off?.(); ctx.revert(); };
}
