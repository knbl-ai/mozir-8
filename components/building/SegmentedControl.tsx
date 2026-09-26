'use client';
import type { KeyboardEvent, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { SPRING } from './motion';
import s from './explorer.module.css';

export type SegmentOption<T extends string> = { value: T; label: ReactNode; icon?: LucideIcon; title?: string; disabled?: boolean; hideLabel?: boolean };

// One sliding thumb shared by every option (motion layoutId), so a change of selection travels
// rather than blinks. `tablist` wires the tab ARIA, otherwise it behaves as a radio group.
export default function SegmentedControl<T extends string>({ id, options, value, onChange, label, variant = 'track', role = 'radiogroup', fill = false, controls }: {
 id: string; options: SegmentOption<T>[]; value: T; onChange: (value: T) => void; label: string;
 variant?: 'track' | 'glass' | 'header'; role?: 'radiogroup' | 'tablist'; fill?: boolean; controls?: string;
}) {
 const enabled = options.filter(o => !o.disabled);
 const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
  const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
  if (!(event.key in keys)) return;
  event.preventDefault();
  const at = enabled.findIndex(o => o.value === value);
  const next = enabled[(at + keys[event.key] + enabled.length) % enabled.length];
  onChange(next.value);
  (event.currentTarget.querySelector(`[data-value="${next.value}"]`) as HTMLElement | null)?.focus();
 };
 return <div role={role} aria-label={label} className={`${s.segmented} ${s[`segmented_${variant}`]} ${fill ? s.segmentedFill : ''}`} onKeyDown={onKeyDown}>
  {options.map(o => {
   const active = o.value === value, Icon = o.icon;
   const a11y = role === 'tablist'
    ? { role: 'tab', 'aria-selected': active, id: `${id}-${o.value}-tab`, 'aria-controls': controls }
    : { role: 'radio', 'aria-checked': active };
   return <button key={o.value} type="button" data-value={o.value} {...a11y} tabIndex={active ? 0 : -1} disabled={o.disabled}
    title={o.title} aria-label={o.hideLabel && typeof o.label === 'string' ? o.label : o.title} className={s.segment} data-active={active || undefined} onClick={() => onChange(o.value)}>
    {active && <motion.span layoutId={`${id}-thumb`} className={s.segmentThumb} transition={SPRING} />}
    <span className={s.segmentLabel}>{Icon && <Icon size={16} strokeWidth={1.6} aria-hidden />}{!o.hideLabel && o.label}</span>
   </button>;
  })}
 </div>;
}
