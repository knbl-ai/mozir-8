'use client';
// Choosing a home, under the photographs of the home on show (same light section, so the two read as one). One drawing:
//   the plan   the four residences from above inside ONE common outline; the floors beneath the chosen one as faint
//              lines, the chosen floor as the plate with its homes (point at a home, click to choose it)
//   the lift   a slender glass shaft beside the plan with a landing per floor; its pearl car stands on the floor on show
//              (drag it to change the floor)
// The first time the drawing comes on screen it builds itself (outline, the floors beneath, the plate, the homes one
// by one, the lift and its car); after that it simply stays, however the page is scrolled (data-reveal="build", CSS).
// Everything is drawn from the developer's floor layouts in metres (public/projects/oystra/map/selector2.json, made by
// pipeline/signature/locmap/selector2.py). Homes are traced for one floor
// so far (floor 9, all four residences); areas are known for Residence C; photographs for one home (C-905).
import { useEffect, useState } from 'react';
import { MEDIA } from './content';
import s from './oystra.module.css';

export type Home = { id: string; rid: string; d: string; at: [number, number]; beds: string; unit?: number; balcony?: number; total?: number };
type Res = { id: string; at: number; top: number; mid: [number, number]; roof: string };
type Data = { w: number; h: number; fh: number; top: number; base: string; plates: Record<string, string>; area: Record<string, number>; side: string; residences: Res[]; homes: Record<string, Home[]> };
// a home as chosen: the home and the floor it is on
export type Picked = Home & { floor: number };
export const FULL = 'C-905';      // the home that has its own photographs above
const UNDER = 8;           // how many floors beneath the chosen one stay as faint lines
const m2 = (n: number) => `${n.toFixed(2)} m²`;

// chosen: the home on show in the section above. onChoose: a home was chosen (from: where on screen, for the page's sign that it opened above). onShow: go up to it.
export default function HomeSelector({ chosen, onChoose, onShow }: { chosen: string; onChoose: (h: Picked, from: { x: number; y: number }) => void; onShow: () => void }) {
 const [data, setData] = useState<Data | null>(null);
 // the floor changes only by dragging along the level rule (or pressing a point on it): the pointer passing over the
 // rule while the page scrolls must not change it
 const [floor, setFloor] = useState(9);
 const [hover, setHover] = useState<string | null>(null);
 useEffect(() => { let gone = false; fetch(`${MEDIA}/map/selector2.json`).then(r => r.json()).then(d => { if (!gone) setData(d); }).catch(() => {}); return () => { gone = true; }; }, []);
 if (!data) return <div id="homes" className={s.sel} aria-busy="true" />;

 const { w: W, h: PH, top: TOP } = data;
 const floors = Array.from({ length: TOP }, (_, i) => i + 1);
 const homes = data.homes[String(floor)] ?? [];
 const home = homes.find(h => h.id === (hover ?? chosen));
 const here = data.residences.filter(r => r.top >= floor);
 // the lift beside the plan: floor 1 at the foot of the plan, the top floor at its head
 const RX = W + 22, RUN = (PH - 10) * .9, ST = RUN / (TOP - 1), Y = (n: number) => PH - 4 - (PH - 10 - RUN) / 2 - (n - 1) * ST;   // nine tenths of the plan's height, centred on it
 const LOW = Math.min(...data.residences.map(r => r.top));        // where the lower residences end
 const MARK = [...new Set([1, 5, 10, LOW, TOP])];
 // the floor under the pointer, from where it is along the rule's height
 const at = (e: React.PointerEvent<SVGRectElement>) => { const r = e.currentTarget.getBoundingClientRect(); return Math.min(TOP, Math.max(1, TOP - Math.floor((e.clientY - r.top) / r.height * TOP))); };
 const pick = (h: Home, el: Element, e?: { clientX: number; clientY: number }) => { const r = el.getBoundingClientRect(); onChoose({ ...h, floor }, e ? { x: e.clientX, y: e.clientY } : { x: r.left + r.width / 2, y: r.top + r.height / 2 }); };

 return <div id="homes" className={s.sel}>
  <div className={s.selWrap}>
   <div className={s.selHead}>
    <div data-reveal>
     <p className={s.eyebrow}>All homes · four residences · {TOP} floors</p>
     <h2 className={s.title}>Choose a home.</h2>
    </div>
    <p className={s.lede} data-reveal style={{ '--i': 1 } as React.CSSProperties}>Drag the lift to a floor and pick a home. It opens above, with its plan and photographs.</p>
   </div>
   <div className={s.selCard} aria-live="polite">
    {home ? <>
     <p className={s.eyebrow}>Residence {home.rid} · floor {floor}</p>
     <p className={s.selId}>{home.id}</p>
     <dl>
      <div><dt>Home</dt><dd>{home.beds}</dd></div>
      {home.total != null && <>
       <div><dt>Interior</dt><dd>{m2(home.unit!)}</dd></div>
       <div><dt>Balcony</dt><dd>{m2(home.balcony!)}</dd></div>
       <div><dt>Total</dt><dd>{m2(home.total)}</dd></div>
      </>}
     </dl>
     {home.id === chosen ? <button type="button" className={s.send} onClick={onShow}>View {home.id} above ↑</button> : <p className={s.small}>Click the home to open it above.</p>}
    </> : <>
     <p className={s.eyebrow}>{here.length === 4 ? 'Residences A to D' : `Residences ${here.map(r => r.id).join(' and ')}`} · floor {floor}</p>
     <p className={s.selId}>{homes.length ? 'Point at a home' : `Floor ${floor}`}</p>
     <dl>{!homes.length && <div><dt>Floor area</dt><dd>{data.area[String(floor)].toLocaleString('en')} m²</dd></div>}</dl>
     <p className={s.small}>{homes.length ? 'Its number and size appear here.' : 'The homes of this floor are in preparation. Floor 9 is drawn in full.'}</p>
    </>}
   </div>

   <svg className={s.selDraw} data-reveal="build" viewBox={`-12 -7 ${W + 63} ${PH + 31}`} role="group" aria-label="The four residences of Oystra: choose a floor with the lift beside the plan, then a home in the plan">
    <defs><filter id="sel-soft" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation=".7" /></filter><linearGradient id="sel-glass" x1="0" x2="1"><stop offset="0" stopColor="#FCFAF6" /><stop offset=".5" stopColor="#F3EBE1" /><stop offset="1" stopColor="#FCFAF6" /></linearGradient><radialGradient id="sel-pearl" cx=".36" cy=".32" r=".8"><stop offset="0" stopColor="#fff" /><stop offset=".45" stopColor="#F6DDC6" /><stop offset="1" stopColor="#C79E7E" /></radialGradient></defs>

    {/* the plan */}
    <text className={s.selCap} x={W / 2} y={-2}>Arabian Gulf</text>
    <path className={s.selBase} d={data.base} pathLength={1} />
    {floors.map(n => <path key={n} className={s.selUnder} d={data.plates[String(n)]} data-on={(n < floor && n >= floor - UNDER) || undefined} style={{ '--i': n } as React.CSSProperties} />)}
    {data.residences.map(r => <g key={r.id} className={s.selRoof} data-on={r.top < floor || undefined}>
     <path d={r.roof} />
     <text className={s.selCap} x={r.mid[0]} y={r.mid[1]}>Roof · {r.top} floors</text>
    </g>)}
    {floors.map(n => <path key={n} className={s.selPlate} d={data.plates[String(n)]} data-on={n === floor || undefined} />)}
    {Object.entries(data.homes).map(([n, list]) => <g key={n} className={s.selHomes} data-on={Number(n) === floor || undefined}>
     {list.map((h, i) => <path key={h.id} className={s.selHome} style={{ '--i': i } as React.CSSProperties} d={h.d} data-on={h.id === chosen || undefined} data-hot={h.id === hover || undefined}
      onPointerEnter={() => setHover(h.id)} onPointerLeave={() => setHover(null)} onClick={e => pick(h, e.currentTarget, e)}
      tabIndex={Number(n) === floor ? 0 : -1} role="button" aria-label={`${h.id}, ${h.beds}${h.total != null ? `, ${m2(h.total)}` : ''}`}
      onFocus={() => setHover(h.id)} onBlur={() => setHover(null)} onKeyDown={e => { if (e.key === 'Enter') pick(h, e.currentTarget); }} />)}
     {list.map(h => <text key={h.id} className={s.selNo} x={h.at[0]} y={h.at[1]} dy=".35em" data-on={h.id === chosen || undefined} data-hot={h.id === hover || undefined}>{h.id.split('-')[1]}</text>)}
    </g>)}

    {/* one row of names between the two views, serving both */}
    {data.residences.map((r, i) => <g key={r.id} className={s.selName} style={{ '--i': i } as React.CSSProperties}>
     <text className={s.selLetter} x={r.at} y={PH + 15}>{r.id}</text>
     <text className={s.selCap} x={r.at} y={PH + 20.5}>{r.top} floors</text>
    </g>)}

    {/* the glass lift: a slender capsule shaft beside the plan, a landing mark per floor, a pearl car on its cable */}
    <g className={s.selLift}>
     <rect className={s.selTube} x={RX - 2.5} width={5} y={Y(TOP) - ST / 2 - 1.6} height={ST * TOP + 3.2} rx={2.5} />
     <line className={s.selCable} x1={RX} x2={RX} y1={Y(TOP) - ST / 2 + .8} y2={Y(floor)} />
     {floors.map(n => <line key={n} className={s.selLand} x1={RX - 4.6} x2={RX - 3.1} y1={Y(n)} y2={Y(n)} />)}
     {MARK.map(n => <text key={n} className={s.selTick} x={RX - 6} y={Y(n)} dy=".32em" data-off={n === floor || undefined}>{n}</text>)}
     {LOW < TOP && <>
      <line className={s.selLead} x1={RX - 4.6} x2={RX + 6.4} y1={Y(LOW) - ST / 2} y2={Y(LOW) - ST / 2} />
      <text className={s.selCapL} x={RX + 7.6} y={Y(LOW) - ST / 2} dy=".32em">Roof {data.residences.filter(r => r.top === LOW).map(r => r.id).join(' · ')}</text>
     </>}
     <g className={s.selMark} style={{ transform: `translateY(${Y(floor)}px)` }}>
      <ellipse className={s.selCarShade} cx={RX + .5} cy={.9} rx={2.3} ry={3} />
      <rect className={s.selPearl} x={RX - 1.95} width={3.9} y={-ST * .52} height={ST * 1.04} rx={1.95} />
      <line className={s.selLead} x1={RX + 3.2} x2={RX + 6.4} y1={0} y2={0} />
      <text className={s.selFloorNo} x={RX + 7.6} y={0} dy=".32em">{floor}</text>
      <text className={s.selCapL} x={RX + (floor > 9 ? 15.6 : 12.4)} y={-.4} dy=".32em">Floor</text>
     </g>
     <rect className={s.selHit} x={RX - 10} width={34} y={Y(TOP) - ST / 2} height={ST * TOP}
      role="slider" tabIndex={0} aria-label="Floor" aria-orientation="vertical" aria-valuemin={1} aria-valuemax={TOP} aria-valuenow={floor}
      onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); setFloor(at(e)); }}
      onPointerMove={e => { if (e.currentTarget.hasPointerCapture(e.pointerId)) setFloor(at(e)); }}
      onKeyDown={e => { const d = e.key === 'ArrowUp' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowDown' || e.key === 'ArrowLeft' ? -1 : 0; if (d) { e.preventDefault(); setFloor(f => Math.min(TOP, Math.max(1, f + d))); } }} />
     <text className={s.selCap} x={RX} y={Y(1) + 10.5}>Drag the lift</text>
    </g>
   </svg>
  </div>
 </div>;
}
