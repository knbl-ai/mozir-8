'use client';
import { useState, type KeyboardEvent } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Check, ChevronDown } from 'lucide-react';
import type { Residence } from '@/content/projects';
import { useLang } from '@/lib/i18n';
import { type Apartment } from './inventory';
import { explorerText } from './strings';
import SwapValue from './SwapValue';
import s from './explorer.module.css';

// The building, read top to bottom: one row per floor, its homes side by side.
export default function ApartmentPicker({ inventory, residences, selected, onSelect }: {
 inventory: Apartment[]; residences: Residence[]; selected?: Apartment; onSelect: (apartment: Apartment) => void;
}) {
 const [open, setOpen] = useState(false);
 const t = explorerText[useLang()];
 const floorName = (a: Apartment) => a.level === 0 ? t.groundFloor : t.floorN(a.level);
 const available = inventory.filter(a => a.status === 'for-sale').length;
 const floors = [...new Set(inventory.map(a => a.level))].sort((a, b) => b - a);
 const residence = (a: Apartment) => residences.find(r => r.id === a.unit);
 const summary = selected ? `${floorName(selected)} · ${residence(selected)?.shortTitle ?? ''}` : t.chooseHome;

 const onListKey = (event: KeyboardEvent<HTMLDivElement>) => {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
  event.preventDefault();
  const rows = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')];
  const at = rows.indexOf(document.activeElement as HTMLButtonElement);
  rows[(at + (event.key === 'ArrowDown' ? 1 : -1) + rows.length) % rows.length]?.focus();
 };

 return <Popover.Root open={open} onOpenChange={setOpen}>
  <Popover.Trigger className={s.pickerTrigger} aria-label={t.pickerLabel(summary)}>
   <span className={s.pickerCaption}>{t.availableHomes(available)}</span>
   <span className={s.pickerValue}><SwapValue value={summary} order={selected ? inventory.indexOf(selected) : 0} /></span>
   <ChevronDown className={s.pickerChevron} size={16} strokeWidth={1.6} aria-hidden />
  </Popover.Trigger>
  <Popover.Portal>
   <Popover.Content className={s.pickerContent} align="end" sideOffset={10} collisionPadding={16}
    onOpenAutoFocus={event => { event.preventDefault(); (document.querySelector('[data-picker-selected="true"]') as HTMLElement | null)?.focus(); }}>
    <div className={s.pickerHead}><strong>{t.chooseHome}</strong><span>{t.availableOf(available, inventory.length)}</span></div>
    <div className={s.pickerList} role="listbox" aria-label={t.byFloor} onKeyDown={onListKey}>
     {floors.map(level => <div key={level} className={s.pickerFloor}>
      <span className={s.pickerLevel} aria-hidden>{level === 0 ? t.groundShort : level}</span>
      <div className={s.pickerRow}>
       {inventory.filter(a => a.level === level).map(a => {
        const sold = a.status === 'sold', isSelected = a.apartment === selected?.apartment, r = residence(a);
        return <button key={a.apartment} type="button" role="option" aria-selected={isSelected} disabled={sold} data-picker-selected={isSelected || undefined}
         className={s.pickerOption} data-status={a.status} onClick={() => { onSelect(a); setOpen(false); }}
         aria-label={`${floorName(a)}, ${r?.shortTitle}, ${t.roomsCount(r?.rooms ?? 0)}, ${sold ? t.sold : t.available}`}>
         <span className={s.pickerOptionText}><strong>{r?.shortTitle}</strong><small>{t.roomsCount(r?.rooms ?? 0)} · {r?.outdoor}</small></span>
         {isSelected ? <Check className={s.pickerCheck} size={16} strokeWidth={2} aria-hidden /> : <span className={s.toneTag} data-tone={sold ? 'sold' : 'available'}>{sold ? t.sold : t.available}</span>}
        </button>;
       })}
      </div>
     </div>)}
    </div>
   </Popover.Content>
  </Popover.Portal>
 </Popover.Root>;
}
