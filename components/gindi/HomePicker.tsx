'use client';
import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ChevronDown } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { TYPES, type Unit } from '@/content/projects/gindi';
import FloorMatrix, { type Filter } from './FloorMatrix';
import { gindiText } from './strings';
import s from './gindi.module.css';

// The header's home picker (the template's ApartmentPicker): the tower floor by floor, opening under the header.
export default function HomePicker({ units, selected, filter, onFilter, onlyAvailable, onOnlyAvailable, hovered, onHover, onSelect }: {
 units: Unit[]; selected: Unit | null; filter: Filter; onFilter: (f: Filter) => void; onlyAvailable: boolean; onOnlyAvailable: (v: boolean) => void;
 hovered: string | null; onHover: (id: string | null) => void; onSelect: (id: string) => void;
}) {
 const lang = useLang(); const t = gindiText[lang];
 const [open, setOpen] = useState(false);
 const available = units.filter(u => u.status === 'available').length;
 const summary = selected ? `${t.floorN(selected.floor)} · ${lang === 'he' ? TYPES[selected.type].nameHe : TYPES[selected.type].name}` : t.chooseHome;
 return <Popover.Root open={open} onOpenChange={o => { setOpen(o); if (!o) onHover(null); }}>
  <Popover.Trigger className={s.pickTrigger} aria-label={`${t.chooseHome}: ${summary}`}>
   <span className={s.pickCaption}>{t.availableN(available)}</span>
   <span className={s.pickValue}>{summary}</span>
   <ChevronDown className={s.pickChevron} size={16} strokeWidth={1.5} aria-hidden />
  </Popover.Trigger>
  <Popover.Portal>
   <Popover.Content className={s.pop} align="end" sideOffset={12} collisionPadding={16}>
    <FloorMatrix units={units} filter={filter} onFilter={onFilter} onlyAvailable={onlyAvailable} onOnlyAvailable={onOnlyAvailable}
     hovered={hovered ?? selected?.id ?? null} onHover={onHover} onSelect={id => { onSelect(id); setOpen(false); onHover(null); }} />
   </Popover.Content>
  </Popover.Portal>
 </Popover.Root>;
}
