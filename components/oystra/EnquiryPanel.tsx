'use client';
// "Arrange a private presentation": the enquiry text and form, as a pane of dark glass inside the balcony window of the
// furnishing film (BuildScroll). It is placed on the window's glass by the picture's own geometry and clipped by it
// (enquire.module.css), so it sits in the window frame on any screen. It slides in from behind the right-hand frame once
// half of the film has played (the film's section carries data-end), so the first half of the film plays uncovered.
import { useEffect, useId, useRef, useState } from 'react';
import s from './oystra.module.css';
import e from './enquire.module.css';

// "Why own here": the developer's case for Ras Al Khaimah (OYSTRA_FACTSHEET.pdf, "oystra's advantage" and the payment
// plans in the broker toolkit: 50/50, 60/40, 70/30). Written on the window: while the room is furnished (the first part
// of the film) the glass frosts over and the lines appear on it; the glass clears before the enquiry pane arrives (admin 2026-11-26).
const WHY: [string, string, string][] = [
 ['M24 6a18 18 0 1 0 0 36 18 18 0 1 0 0-36zM30 17c-1-3-4-4-6-4-4 0-7 2-7 5 0 7 13 4 13 11 0 3-3 5-7 5-3 0-6-1-7-4M24 9v4M24 34v5', 'Tax-free', 'No income, capital gains or property tax'],
 ['M17 13a9 9 0 1 0 0 18 9 9 0 1 0 0-18zM26 22h18M38 22v7M44 22v5', 'Freehold', 'Full ownership of your home'],
 ['M8 12h32v28H8zM8 20h32M16 6v10M32 6v10M15 28h6M27 28h6M15 34h6', '50/50 · 60/40 · 70/30', 'Payment plans'],
 ['M24 6l5 12 13 1-10 8 3 13-11-7-11 7 3-13-10-8 13-1z', 'Vision 2030', 'Part of Ras Al Khaimah’s masterplan'],
];
export function WhyPanel() {
 return <div className={e.bay}><div className={e.frost} aria-label="Why Ras Al Khaimah"><div className={e.whyText}>
  <p className={e.whyEye}>Why Ras Al Khaimah</p>
  <ul className={e.whyList}>
   {WHY.map(([d, k, c], i) => <li key={k} style={{ '--i': i } as React.CSSProperties}><svg viewBox="0 0 48 48" aria-hidden="true"><path d={d} pathLength={1} /></svg>
    <span><b className={e.whyKey}>{k}</b><i className={e.whyCap}>{c}</i></span></li>)}
  </ul>
 </div></div></div>;
}

const HOMES = ['C-905 · two bedrooms', 'One bedroom', 'Two bedrooms', 'Three bedrooms', 'Penthouse'];

// The "Interested in" choice, drawn by the page (the browser's own menu belongs to the operating system, not to this
// design). A button that shows the choice; its list opens upward over the fields above, because the pane is clipped by
// the window frame below. Arrow keys move, Enter or Space choose, Escape closes; the value goes out in a hidden input.
function Choice({ name, label, options }: { name: string; label: string; options: string[] }) {
 const [value, setValue] = useState(options[0]);
 const [open, setOpen] = useState(false);
 const [hot, setHot] = useState(0);
 const box = useRef<HTMLDivElement>(null);
 const id = useId();
 useEffect(() => {
  if (!open) return;
  const out = (ev: PointerEvent) => { if (!box.current?.contains(ev.target as Node)) setOpen(false); };
  addEventListener('pointerdown', out);
  return () => removeEventListener('pointerdown', out);
 }, [open]);
 const pick = (i: number) => { setValue(options[i]); setOpen(false); };
 const key = (ev: React.KeyboardEvent) => {
  if (ev.key === 'Escape') { if (open) { ev.preventDefault(); setOpen(false); } return; }
  if (ev.key === 'Tab') { setOpen(false); return; }
  if (!['ArrowDown', 'ArrowUp', 'Enter', ' ', 'Home', 'End'].includes(ev.key)) return;
  ev.preventDefault();
  if (!open) { setHot(options.indexOf(value)); setOpen(true); return; }
  if (ev.key === 'Enter' || ev.key === ' ') pick(hot);
  else setHot(h => ev.key === 'Home' ? 0 : ev.key === 'End' ? options.length - 1 : Math.min(options.length - 1, Math.max(0, h + (ev.key === 'ArrowDown' ? 1 : -1))));
 };
 return <div className={e.choice} ref={box} data-open={open || undefined}>
  <span id={`${id}l`}>{label}</span>
  <input type="hidden" name={name} value={value} />
  <button type="button" className={e.choiceBtn} role="combobox" aria-haspopup="listbox" aria-expanded={open} aria-controls={`${id}m`} aria-labelledby={`${id}l ${id}v`}
   aria-activedescendant={open ? `${id}o${hot}` : undefined} onClick={() => { setHot(options.indexOf(value)); setOpen(o => !o); }} onKeyDown={key}>
   <span id={`${id}v`}>{value}</span>
   <svg viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.5 6 6.5 11 1.5" /></svg>
  </button>
  <ul className={e.menu} id={`${id}m`} role="listbox" aria-labelledby={`${id}l`}>
   {options.map((o, i) => <li key={o} id={`${id}o${i}`} role="option" aria-selected={o === value} data-hot={i === hot || undefined}
    onPointerEnter={() => setHot(i)} onClick={() => pick(i)}>{o}</li>)}
  </ul>
 </div>;
}

export default function EnquiryPanel() {
 const [sent, setSent] = useState(false);
 const [bad, setBad] = useState<{ name?: string; email?: string }>({});
 // the page says what is missing in its own words, on the field, in place of the browser's bubble
 const send = (ev: React.FormEvent<HTMLFormElement>) => {
  ev.preventDefault();
  const f = new FormData(ev.currentTarget), name = String(f.get('name') || '').trim(), email = String(f.get('email') || '').trim();
  const b = { name: name ? undefined : 'Your name, please', email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? undefined : email ? 'This address looks incomplete' : 'Your email, please' };
  setBad(b);
  if (b.name || b.email) { (ev.currentTarget.elements.namedItem(b.name ? 'name' : 'email') as HTMLElement).focus(); return; }
  setSent(true);
 };
 const clear = (k: 'name' | 'email') => () => setBad(b => b[k] ? { ...b, [k]: undefined } : b);
 return <div className={e.bay}><div className={e.opening}><aside id="enquire" className={e.panel} aria-label="Enquire">
  <div className={e.in}>
   <p className={e.eyebrow}>Enquire</p>
   <h2 className={e.title}>Arrange a private presentation.</h2>
   <p className={e.lede}>Tell us which residence interests you. The sales team will come back with availability, plans and the payment schedule.</p>
   {sent
    ? <div className={e.sent} role="status"><p className={e.title}>Thank you.</p><p className={e.lede}>This is a demonstration page: the enquiry was not sent anywhere yet.</p></div>
    : <form className={`${s.form} ${e.form}`} onSubmit={send} noValidate>
     <label data-bad={bad.name ? '' : undefined}><span>Name{bad.name && <em role="alert">{bad.name}</em>}</span><input name="name" autoComplete="name" aria-invalid={!!bad.name} onInput={clear('name')} /></label>
     <label data-bad={bad.email ? '' : undefined}><span>Email{bad.email && <em role="alert">{bad.email}</em>}</span><input name="email" type="email" autoComplete="email" aria-invalid={!!bad.email} onInput={clear('email')} /></label>
     <label><span>Phone</span><input name="phone" type="tel" autoComplete="tel" /></label>
     <Choice name="home" label="Interested in" options={HOMES} />
     <button type="submit" className={s.send}>Send enquiry</button>
    </form>}
  </div>
 </aside></div></div>;
}
