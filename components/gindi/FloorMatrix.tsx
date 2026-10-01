'use client';
import { useLang } from '@/lib/i18n';
import { TYPES, type GindiType, type Unit } from '@/content/projects/gindi';
import { gindiText } from './strings';
import s from './gindi.module.css';

export type Filter = 'all' | '3.5' | '5' | 'ph' | 'tbc';
export const matches = (u: Unit, f: Filter, onlyAvailable: boolean) => {
 if (onlyAvailable && u.status !== 'available') return false;
 const info = TYPES[u.type];
 if (f === '3.5') return info.rooms === 3.5;
 if (f === '5') return info.rooms === 5;
 if (f === 'ph') return u.floor === 21;
 if (f === 'tbc') return !info.known;
 return true;
};
const COLS: GindiType[] = ['A', 'B', 'C', 'D'];

// The tower as a table: one row per floor (21 at the top), one tile per home. A tile lights its home on the facade.
export default function FloorMatrix({ units, filter, onFilter, onlyAvailable, onOnlyAvailable, hovered, onHover, onSelect }: {
 units: Unit[]; filter: Filter; onFilter: (f: Filter) => void; onlyAvailable: boolean; onOnlyAvailable: (v: boolean) => void;
 hovered: string | null; onHover: (id: string | null) => void; onSelect: (id: string) => void;
}) {
 const lang = useLang(); const t = gindiText[lang];
 const byFloor = new Map<number, Unit[]>();
 units.forEach(u => (byFloor.get(u.floor) ?? byFloor.set(u.floor, []).get(u.floor)!).push(u));
 const floors = [...byFloor.keys()].sort((a, b) => b - a);
 const count = units.filter(u => matches(u, filter, onlyAvailable)).length;
 const filters: [Filter, string][] = [['all', t.all], ['3.5', t.roomsN(3.5)], ['5', t.roomsN(5)], ['ph', t.penthouse], ['tbc', t.toCome]];

 const tile = (u: Unit, span = 1) => {
  const on = matches(u, filter, onlyAvailable);
  const name = lang === 'he' ? TYPES[u.type].nameHe : TYPES[u.type].name;
  return <button key={u.id} type="button" className={s.tile} data-tile={u.id} style={span > 1 ? { gridColumn: `span ${span}` } : undefined}
   data-status={u.status} data-dim={!on || undefined} data-hover={hovered === u.id || undefined} disabled={u.status === 'sold'}
   aria-label={`${name}, ${t.floorN(u.floor)}, ${t.statusText(u.status)}`}
   onPointerEnter={() => onHover(u.id)} onPointerLeave={() => onHover(null)} onFocus={() => onHover(u.id)} onBlur={() => onHover(null)} onClick={() => onSelect(u.id)}>
   <span>{u.type}</span>
  </button>;
 };

 return <div className={s.matrix}>
  <p className={s.kicker}>{t.residences} · {t.matrix}</p>
  <h3 className={s.panelTitle}>{t.chooseHome}</h3>
  <div className={s.chips} role="group" aria-label={t.rooms}>
   {filters.map(([f, label]) => <button key={f} type="button" className={s.chip} aria-pressed={filter === f} onClick={() => onFilter(f)}>{label}</button>)}
  </div>
  <label className={s.check}><input type="checkbox" checked={onlyAvailable} onChange={e => onOnlyAvailable(e.target.checked)} /><span />{t.onlyAvailable}</label>
  <p className={s.matrixCount}>{t.residencesN(count)}</p>

  <div className={s.grid} role="grid" aria-label={t.matrixNote}>
   <div className={s.gridHead} role="row"><span />{COLS.map(c => <span key={c} role="columnheader">{c}<small>{TYPES[c].rooms ? t.roomsN(TYPES[c].rooms!) : t.toCome}</small></span>)}</div>
   {floors.map(f => {
    const us = byFloor.get(f)!;
    return <div key={f} className={s.gridRow} role="row" data-ph={f === 21 || undefined}>
     <span className={s.floorNo}>{t.floorShort(f)}</span>
     {f === 21
      ? (['PA', 'PB'] as GindiType[]).map(tp => { const u = us.find(x => x.type === tp); return u ? tile(u, 2) : <span key={tp} style={{ gridColumn: 'span 2' }} />; })
      : COLS.map(c => { const u = us.find(x => x.type === c); return u ? tile(u) : <span key={c} className={s.tileEmpty} />; })}
    </div>;
   })}
  </div>
  <div className={s.gridLegend}><span className={s.swatchAvail} />{t.forSale}<span className={s.swatchSold} />{t.sold}</div>
  <p className={s.note}>{t.sampleNote}</p>
 </div>;
}
