// @ts-nocheck
// The location section's engine: one paused GSAP timeline, told as a story and moved by scroll. It is drawn in the
// style of the film's map chapter (pipeline: pipeline/signature/film/build_map.py), on the page's night ground: the sea
// deep blue, the land a step lighter, the shore and every street as thin blue lines, and only what belongs to the
// project in rose gold (the residences, the drives, the marks of the places, the Oystra mark).
//   0 · close on the four residences, drawn as in the home selector, standing on their island (the map is turned
//       so the plan reads as it does there, the sea side up)
//   1 · every scroll draws the view back: the shore, then the island; the map turns to north-up; the project in
//       figures, what lies around it, what the building has
//   2 · Al Marjan whole: the residences are marked by the Oystra emblem; the place's detail arrives as one wave from
//       it (beaches, greens, the islands' streets), the sea line draws along the shore
//   3 · journeys in two scrolls. The three places near the island are reached along the real roads: one gold line
//       leaves the mark, parts where the roads part, a circle rides its head; each place gets its mark and plate as
//       the line arrives. Then the map draws back once and the three far ones appear, each on its own bowed line
// Data: public/projects/oystra/map/geo.json (pipeline repo, pipeline/signature/locmap: trace.py for the far view,
// vector.py for the near land, shore, sea line and drives, detail.py for the detail). The building's plan comes from
// map/selector2.json and is placed by geo.building (locmap/place.py).
// Everything is in one flat "world"; the camera is the SVG viewBox (its width moves evenly in scale, not in distance).
// --u = world units per screen pixel, so line weights and letters keep their size on screen at every scale.
import { EMBLEM, EMBLEM_W, EMBLEM_H } from './emblem';

const NS = 'http://www.w3.org/2000/svg', ASPECT = 1.6;
// camera stops [width of world shown, where Oystra sits on the screen x, y]: the islands, then the whole coast to Dubai
// (Oystra in the upper right, so the long coast has the screen and the list of far places has the left side).
// The far stop keeps every place in the upper two thirds of the screen: the next section's curved edge rises over the
// foot of the map as it leaves, and must not cover a place.
const CLOSE = 9.5, NEAR = [215, .54, .44], FAR = [2600, .78, .1];
// how each far journey's line bows, as a share of its length to one side (+) or the other (-): of the two that run to
// Dubai, one bows inland and one out over the sea
const BOW = [0, 0, 0, -.22, .16, -.2];
// on the map a place carries a short name and its minutes on a small plate (the list beside the map has the full name).
// PLATE: where the plate stands from the place's mark, [dx, dy] in px of the corner named after it
// (t/b = top/bottom, l/r = left/right), chosen so no plate lies on a line or on another plate
const SHORT = ['Wynn', 'Al Hamra Mall', 'Golf Club', 'RAK Airport', 'Dubai Airport', 'Dubai Mall'];
const PLATE = [[-36, -30, 'br'], [26, 2, 'tl'], [26, -4, 'bl'], [-26, -10, 'tr'], [26, -10, 'tl'], [-26, -10, 'tr']];
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
  const map = q('map'), stage = q('stage'), left = q('story'), right = q('storyR'), pinsBox = q('pins');
  ['far', 'wl', 'land', 'rd', 'dt', 'bld', 'drv', 'tripsG', 'oy'].forEach(k => { q(k).replaceChildren(); }); left.replaceChildren(); right.replaceChildren(); pinsBox.replaceChildren();
  // a caption: the outer box is the one the timeline moves; the inner one centres the text on the stage's middle line (CSS)
  const slide = (box: any, html: string) => { const d = document.createElement('div'); d.innerHTML = `<div data-s="in">${html}</div>`; box.appendChild(d); return d; };
  const block = (b: any) => `<p data-s="eb">${esc(b.eyebrow)}</p>${b.big ? `<p data-s="big">${esc(b.big)}</p>` : ''}${(b.lines || []).map((l: string) => `<p data-s="line">${esc(l)}</p>`).join('')}${b.note ? `<p data-s="note">${esc(b.note)}</p>` : ''}`;

  const O = geo.oystra;
  // ---- the far view: the land beyond the near picture (the far shore closed inland), its shore line and main roads
  const farLand = geo.farClose ? el('far', 'path', { 'data-k': 'landfar', d: geo.coast.far + 'L' + geo.farClose.map((c: number[]) => c.join(' ')).join(' ') + 'Z' }) : null;
  const farCoast = el('far', 'path', { 'data-k': 'coastfar', d: geo.coast.far });
  const rdFar = geo.roads.far.map((d: string) => el('far', 'path', { 'data-k': 'rd', d }));
  // ---- the near view: the sea line along the open shore, the land (its edge is the shore), the project's own islands a touch heavier, the main roads
  const wls = (geo.water || []).map((w: any) => el('wl', 'path', { 'data-k': 'wl', d: w.d, pathLength: 1 }));
  const land = el('land', 'path', { 'data-k': 'land', d: geo.land, 'fill-rule': 'evenodd' });
  const marjan = geo.shore.marjan.map((d: string) => el('land', 'path', { 'data-k': 'marjan', d }));
  const rds = geo.roads.near.map((d: string) => el('rd', 'path', { 'data-k': 'rd', d }));
  // the detail of the place (geo.detail): beaches, greens and lakes in rings of distance from Oystra, the islands' streets
  // as lines that run outward from it, and the ring of light they follow
  const DT = geo.detail, dbands: any[] = [], dlines: any[] = []; let sweep: any = null;
  if (DT) {
    DT.bands.forEach((b: any) => { const g = el('dt', 'g'); (g as any).r = b.r; dbands.push(g); (['sand', 'green', 'pool'] as const).forEach(k => { if (b[k]) el(g, 'path', { 'data-k': 'd' + k, d: b[k] }); }); });
    DT.roads.forEach((o: any) => { const l = el('dt', 'path', { 'data-k': 'droad', d: o.d, pathLength: 1 }); (l as any).r = o.r; dlines.push(l); });
    sweep = el('dt', 'circle', { 'data-k': 'sweep', cx: O[0], cy: O[1], r: 0 });
  }
  // ---- the four residences as built form (admin 2026-11-26, as in the film's map): the common outline, then every floor's
  // outline from the ground to the roof laid one on the next, each a shade lighter than the one below, so the towers read as
  // stepped, layered volumes; then the four letters (in metres, placed on the island)
  const B = plan && geo.building, bg = q('bld'), world = q('world'); let bbase: any = null, bsmall: any[] = [];
  if (B) {
    bg.setAttribute('transform', `translate(${B.at[0]} ${B.at[1]}) rotate(${B.turn}) scale(${1 / B.k}) translate(${-B.c[0]} ${-B.c[1]})`);
    bbase = el(bg, 'path', { 'data-k': 'bbase', d: plan.base, pathLength: 1 });
    const top = Math.max(...Object.keys(plan.plates).map(Number)), mix = (t: number) => '#' + [[0x13, 0x33], [0x30, 0x5E], [0x42, 0x74]].map(([a, b]) => Math.round(a + (b - a) * t).toString(16).padStart(2, '0')).join('');
    bsmall = [...Array.from({ length: top }, (_, i) => i + 1).filter(n => plan.plates[String(n)]).map(n => el(bg, 'path', { 'data-k': 'blayer', d: plan.plates[String(n)] + 'Z',
      style: `fill:${mix(((n - 1) / Math.max(1, top - 1)) ** 1.4)};stroke-opacity:${(.35 + .65 * (n / top) ** 2).toFixed(2)}` })), ...plan.residences.map((r: any) => el(bg, 'text', { 'data-k': 'bletter', x: r.at, y: plan.h + 16, 'text-anchor': 'middle' }, r.id))];
  }
  const TURN = B ? -B.turn : 0;      // how far the map is turned at the start, so the plan stands as it does in the selector
  // ---- the drives to the near places along the real roads (geo.drives): a tree of pieces, each with a paper casing, the gold line and the circle on its head
  const pieces = (geo.drives || []).map((pc: any) => {
    const cs = el('drv', 'path', { 'data-k': 'drvcase', d: pc.d }), ln = el('drv', 'path', { 'data-k': 'drv', d: pc.d });
    let L = pc.len; try { L = ln.getTotalLength() || pc.len; } catch { /* not laid out yet: the length the data gives */ }
    return { ...pc, cs, ln, L, s: 0, head: null as any };
  });
  pieces.forEach((pc: any) => { pc.s = pc.from < 0 ? 0 : pieces[pc.from].s + pieces[pc.from].L; });
  pieces.forEach((pc: any) => { pc.head = el('drv', 'circle', { 'data-k': 'head', r: 0 }); });
  const REACH = Math.max(1, ...pieces.map((pc: any) => pc.s + pc.L));
  const endOf = (i: number) => { const pc = pieces.find((p: any) => p.to === i); if (!pc) return null; try { const p = pc.ln.getPointAtLength(pc.L); return { at: [p.x, p.y], dist: pc.s + pc.L }; } catch { return null; } };
  // ---- the places: where each mark stands (a near place at the end of its drive), its far line if it has one, its mark and plate (HTML over the map, placed by the camera)
  const trips = geo.places.map((pl: any, i: number) => {
    const near = i < 3, end = near ? endOf(i) : null, [x, y] = end ? end.at : pl.at;
    let mp: any = null, line: any = null, light: any = null, qd: number[] = [];
    if (!near || !end) {      // a bowed line from Oystra (the far places; a near place only if the data has no drive for it)
      const dx = x - O[0], dy = y - O[1], k = BOW[i] || -.3, cx = (O[0] + x) / 2 + dy * k, cy = (O[1] + y) / 2 - dx * k, d = `M${O[0]} ${O[1]}Q${cx} ${cy} ${x} ${y}`;
      const id = 'lu-tm' + i, m = el('tripsG', 'mask', { id, maskUnits: 'userSpaceOnUse', x: -600, y: 0, width: 2400, height: 1400 });
      mp = el(m, 'path', { 'data-k': 'tripMask', d, pathLength: 1 }); line = el('tripsG', 'path', { 'data-k': 'trip', d, mask: `url(#${id})` }); light = el('tripsG', 'circle', { 'data-k': 'head', r: 0 });
      qd = [O[0], O[1], cx, cy, x, y];
    }
    const pin = document.createElement('div'); pin.setAttribute('data-p', 'pin'); pin.innerHTML = `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="${TRIP_ICON[i]}"/></svg>`;
    const plate = document.createElement('div'); plate.setAttribute('data-p', 'plate'); plate.setAttribute('data-c', PLATE[i][2] as string);
    plate.innerHTML = `<p data-p="name">${esc(SHORT[i])}</p><p data-p="min"><b>${pl.min}</b> min</p>`;
    pinsBox.append(pin, plate);
    return { pl, i, at: [x, y], dist: end ? end.dist : 0, mp, line, light, q: qd, pin, plate, k: { v: 0 } };
  });
  // ---- Oystra: the emblem on a pearl-gold disc, the ring it sends out, its name
  const ring = el('oy', 'circle', { 'data-k': 'ring', cx: O[0], cy: O[1], r: .6 });
  const mkPaper = el('oy', 'circle', { 'data-k': 'mkpaper', cx: O[0], cy: O[1], r: 0 }), mkDisc = el('oy', 'circle', { 'data-k': 'mkdisc', cx: O[0], cy: O[1], r: 0 }),
    mkRim = el('oy', 'circle', { 'data-k': 'mkrim', cx: O[0], cy: O[1], r: 0 }), mkEm = el('oy', 'path', { 'data-k': 'mkem', d: EMBLEM, 'fill-rule': 'evenodd' });
  const word = el('oy', 'text', { 'data-k': 'word', x: O[0], y: O[1], dx: '-1.9em', dy: '.36em', 'text-anchor': 'end' }, 'OYSTRA');
  // ---- the captions
  const L1 = slide(left, block(story.first)), R1 = slide(right, block(story.around));
  // what the building has: the list alone, on the left, under its small heading
  const R3 = slide(left, `<p data-s="eb">${esc(story.has.eyebrow)}</p><ul data-s="has">${story.has.items.map(([ic, n]) => `<li><svg viewBox="0 0 48 48" aria-hidden="true"><path pathLength="1" d="${ic}"/></svg><span>${esc(n)}</span></li>`).join('')}</ul>`);
  [L1, R3].forEach(d => d.setAttribute('data-s', 'narrow'));   // beside the plan, not over it
  // the journeys as two lists: the near places, then the far ones. The number stands in a window and rises into it
  const rows = (from: number, eyebrow: string) => { const d = slide(left, `<p data-s="eb">${esc(eyebrow)}</p><ul data-s="trips">${trips.slice(from, from + 3).map((t: any, j: number) => `<li><svg viewBox="0 0 48 48" aria-hidden="true"><path pathLength="1" d="${TRIP_ICON[from + j]}"/></svg><p data-s="tnum"><span><b>${t.pl.min}</b></span><i>min</i></p><p data-s="tname">${esc(t.pl.name)}</p></li>`).join('')}</ul>`); d.setAttribute('data-s', 'narrow'); return d; };
  const SA = rows(0, story.island.big + ' · minutes from home'), SB = rows(3, 'Along the coast');
  SB.style.top = '-9vh';   // the last list sits a little high, clear of the next section's curved edge as it rises

  // the camera: lw = log of the world width shown (so a steady scroll is a steady zoom), where Oystra sits on screen, and the map's turn.
  // mk = the Oystra mark's size (0..1); go = how far the drive has run (0..1)
  const P = { lw: Math.log(B ? CLOSE : NEAR[0]), fx: B ? .5 : NEAR[1], fy: B ? .3 : NEAR[2], rot: TURN, mk: 0, go: 0 };
  const setCam = () => {
    const w = Math.exp(P.lw), h = w / ASPECT; map.setAttribute('viewBox', `${O[0] - P.fx * w} ${O[1] - P.fy * h} ${w} ${h}`);
    world.setAttribute('transform', `rotate(${P.rot} ${O[0]} ${O[1]})`);
    const b = map.getBoundingClientRect(); if (!b.width) return;
    const u = Math.max(w / b.width, h / b.height), m = P.mk; map.style.setProperty('--u', String(u));
    // the Oystra mark keeps its size on screen
    mkPaper.setAttribute('r', String(u * 26 * m)); mkDisc.setAttribute('r', String(u * 22 * m)); mkRim.setAttribute('r', String(u * 18.5 * m)); mkRim.setAttribute('stroke-width', String(u * 1 * m));
    const sc = u * 29 / EMBLEM_W * m; mkEm.setAttribute('transform', `translate(${O[0]} ${O[1] - u * m}) scale(${sc}) translate(${-EMBLEM_W / 2} ${-EMBLEM_H / 2})`);
    // the drive: each piece is drawn up to the point the journey has reached on it; the circle sits on that point, ahead of the line
    const gone = P.go * REACH;
    pieces.forEach((pc: any) => {
      const k = Math.max(0, Math.min(1, (gone - pc.s) / pc.L)), on = k > 0 && k < 1 && pc.L > 2, dash = `${k * pc.L} ${pc.L * 3 + 10}`;
      pc.ln.style.strokeDasharray = dash; pc.cs.style.strokeDasharray = dash; pc.ln.style.visibility = pc.cs.style.visibility = k > 0 ? 'visible' : 'hidden';
      pc.head.setAttribute('r', String(on ? u * 5 * Math.min(1, k * pc.L / 1.2, (1 - k) * pc.L / 1.2 + .35) : 0));
      if (on) { const p = pc.ln.getPointAtLength(k * pc.L); pc.head.setAttribute('cx', p.x); pc.head.setAttribute('cy', p.y); }
    });
    // the far lines' lights
    trips.forEach((t: any) => {
      if (!t.light) return; const k = t.k.v, on = k > 0 && k < 1; t.light.setAttribute('r', String(on ? u * 4.2 : 0));
      if (on) { const [x0, y0, cx, cy, x1, y1] = t.q, a = (1 - k) * (1 - k), bb = 2 * k * (1 - k), c = k * k; t.light.setAttribute('cx', a * x0 + bb * cx + c * x1); t.light.setAttribute('cy', a * y0 + bb * cy + c * y1); }
    });
    // the places' marks and plates stand over the map, where the camera now shows their places
    const ctm = world.getScreenCTM(), sb = stage.getBoundingClientRect(); if (!ctm) return;
    trips.forEach((t: any) => {
      const p = new DOMPoint(t.at[0], t.at[1]).matrixTransform(ctm), x = p.x - sb.left, y = p.y - sb.top, [dx, dy] = PLATE[t.i] as any;
      t.pin.style.left = `${x}px`; t.pin.style.top = `${y}px`; t.plate.style.left = `${x + dx}px`; t.plate.style.top = `${y + dy}px`;
    });
  };
  let raf = 0;
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });
    const draw = (els: any, at: number, dur: number, o: any = {}) => tl.fromTo(els, { strokeDashoffset: 1, strokeDasharray: 1 }, { strokeDashoffset: 0, duration: dur, ease: 'power2.inOut', ...o }, at);
    // a caption arrives, holds, and gives way to the next
    const say = (sl: any, tin: number, tout: number) => { tl.fromTo(sl, { opacity: 0, y: 26, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .55 }, tin); tl.to(sl, { opacity: 0, y: -16, filter: 'blur(8px)', duration: .35, ease: 'power2.in' }, tout); };
    gsap.set(wls, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set([farLand, farCoast, ...rdFar, ...rds, word, ...left.children, ...right.children, ...trips.flatMap((t: any) => [t.pin, t.plate])].filter(Boolean), { opacity: 0 }); gsap.set(ring, { opacity: 0 });
    gsap.set(trips.map((t: any) => t.pin), { xPercent: -50, yPercent: -50 });
    const zoom = (w: number, at: number, dur: number, o: any = {}) => tl.to(P, { lw: Math.log(w), duration: dur, ease: 'sine.inOut', ...o }, at);
    const has = () => { tl.fromTo(R3.querySelectorAll('li'), { opacity: 0, x: -18 }, { opacity: 1, x: 0, duration: .45, stagger: .11 }, 3.6); tl.fromTo(R3.querySelectorAll('li path'), { strokeDashoffset: 1, strokeDasharray: 1 }, { strokeDashoffset: 0, duration: .8, stagger: .11, ease: 'power2.inOut' }, 3.6); };

    // 0 · close on the four residences on their island; they come down from the top of the stage and settle
    if (B) {
      gsap.set([bbase, ...bsmall], { opacity: 0 });
      tl.to(bbase, { opacity: 1, duration: .3 }, 0); draw(bbase, 0, 1.1);
      tl.to(bsmall, { opacity: 1, duration: .3, stagger: { amount: .7 } }, .35);      // ground first, floor on floor
      tl.to(P, { fy: .5, duration: 1.3, ease: 'power2.out' }, 0);
    }
    say(L1, 1.5, 3.1); say(R1, 1.8, 3.1);   // the figures arrive once the view has begun to draw back and there is room beside the plan
    // 1 · each scroll draws the view back: the shore and the island take shape, the map turns to north-up. The residences stay as they are
    zoom(26, 1.0, 2.2, { rot: TURN * .45 });
    say(R3, 3.3, 6.2); has();
    zoom(72, 3.2, 3.0, { rot: 0 });
    // 2 · Al Marjan whole; the Oystra mark settles over the residences and sends out one ring
    tl.to(P, { mk: 1, duration: .6, ease: 'back.out(1.7)' }, 5.7);
    tl.fromTo(ring, { attr: { r: .6 }, opacity: .6 }, { attr: { r: 4.2 }, opacity: 0, duration: 1.1, ease: 'power1.out', immediateRender: false }, 5.9);
    zoom(NEAR[0], 6.2, 2.6, { fx: NEAR[1], fy: NEAR[2] });
    draw(wls, 6.6, 1.6, { stagger: .08 });
    tl.to(rds, { opacity: 1, duration: .4 }, 7.2);
    tl.fromTo(word, { opacity: 0 }, { opacity: 1, duration: .6 }, 7.6);
    // the place's detail arrives as one wave from the mark: a ring of light, the streets drawing outward behind it, the rest ring by ring
    if (DT) {
      const W0 = 6.9, WD = 1.5, when = (e: any) => W0 + e.r / DT.reach * WD;
      gsap.set([...dbands, sweep], { opacity: 0 }); gsap.set(dlines, { strokeDasharray: 1, strokeDashoffset: 1 });
      tl.fromTo(sweep, { attr: { r: 0 } }, { attr: { r: DT.reach }, duration: WD, ease: 'none' }, W0);
      tl.to(sweep, { opacity: .55, duration: .12 }, W0).to(sweep, { opacity: 0, duration: WD * .6, ease: 'power1.in' }, W0 + WD * .25);
      dbands.forEach(g => tl.to(g, { opacity: 1, duration: .45 }, when(g)));
      dlines.forEach(l => tl.to(l, { strokeDashoffset: 0, duration: .6 }, when(l)));
    }
    // 3 · journeys, in two scrolls. A place arrives: its mark opens, its plate stands beside it, and its row arrives in the
    // list (the icon draws, the number rises into its window)
    const arrive = (t: any, row: any, at: number) => {
      tl.fromTo(t.pin, { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, duration: .4, ease: 'back.out(2)' }, at - .06);
      tl.fromTo(t.plate, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .4 }, at + .06);
      const r = at - .45;
      tl.fromTo(row, { opacity: 0, x: -18 }, { opacity: 1, x: 0, duration: .45 }, r);
      tl.fromTo(row.querySelector('path'), { strokeDashoffset: 1, strokeDasharray: 1 }, { strokeDashoffset: 0, duration: .7, ease: 'power2.inOut' }, r);
      tl.fromTo(row.querySelector('b'), { yPercent: 115 }, { yPercent: 0, duration: .7, ease: 'power4.out' }, r + .1);
      tl.fromTo(row.querySelectorAll('i,[data-s="tname"]'), { opacity: 0 }, { opacity: 1, duration: .5 }, r + .35);
    };
    // a far place: its bowed line draws while a light travels it
    const fly = (t: any, row: any, at: number) => { const dur = .7; draw(t.mp, at, dur); tl.fromTo(t.k, { v: 0 }, { v: 1, duration: dur, ease: 'power2.inOut' }, at); arrive(t, row, at + dur - .1); };
    const A = 8.4, DRIVE = 1.5, B2 = A + 2.45, near = trips.slice(0, 3), ra = SA.querySelectorAll('li'), rb = SB.querySelectorAll('li');
    // first scroll: one journey along the real roads, at one speed (eased in at the start, out at the last arrival); each
    // near place arrives when the line reaches it
    say(SA, A - .2, A + 1.9);
    tl.to(P, { go: 1, duration: DRIVE, ease: 'sine.inOut' }, A);
    near.forEach((t: any, j: number) => { if (t.mp) fly(t, ra[j], A + j * .28); else arrive(t, ra[j], A + DRIVE * Math.acos(1 - 2 * Math.min(1, t.dist / REACH)) / Math.PI); });
    // the map draws back once, to the whole coast, and the far places begin while it is still moving: no empty screen between.
    // The near picture (its land is cut at the edge of the near view) gives way to the far land under it
    tl.to([...near.flatMap((t: any) => [t.pin, t.plate, t.line].filter(Boolean)), q('drv'), q('wl'), q('rd'), q('dt'), ...marjan], { opacity: 0, duration: .35 }, A + 1.8);
    tl.to([farLand, farCoast, ...rdFar].filter(Boolean), { opacity: 1, duration: .3 }, A + 1.8); tl.to(land, { opacity: 0, duration: .35 }, A + 1.95);
    tl.to(P, { lw: Math.log(FAR[0]), fx: FAR[1], fy: FAR[2], duration: 1.0, ease: 'power2.inOut' }, A + 1.8);
    // second scroll: the three far places, together; they stay to the end
    tl.fromTo(SB, { opacity: 0, y: 26, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .55 }, B2 - .1);
    trips.slice(3).forEach((t: any, j: number) => fly(t, rb[j], B2 + j * .28));
    tl.to({}, { duration: 1.1 });

    // scroll → the timeline, with a short glide behind the scroll. The story begins as the section comes up the screen, before it pins
    let cur = still ? 1 : 0, target = cur, shown = -1;
    const read = () => { const r = root.getBoundingClientRect(), lead = innerHeight * .35; target = still ? 1 : Math.min(1, Math.max(0, (lead - r.top) / Math.max(1, r.height - innerHeight + lead))); };
    const tick = () => { cur += (target - cur) * .12; if (Math.abs(target - cur) < .0004) cur = target; if (cur !== shown) { tl.progress(cur); setCam(); shown = cur; root.toggleAttribute('data-end', cur > .9); } raf = requestAnimationFrame(tick); };
    const again = () => { shown = -1; };      // the marks stand in screen pixels: place them again when the window changes
    read(); addEventListener('scroll', read, { passive: true }); addEventListener('resize', read); addEventListener('resize', again); raf = requestAnimationFrame(tick);
    (ctx as any).off = () => { removeEventListener('scroll', read); removeEventListener('resize', read); removeEventListener('resize', again); };
  }, root);
  return () => { cancelAnimationFrame(raf); (ctx as any).off?.(); ctx.revert(); };
}
