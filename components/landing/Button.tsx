import Link from 'next/link';
import { ArrowUpRight, type LucideIcon } from 'lucide-react';
import u from './ui.module.css';

type Props = {
 children: React.ReactNode;
 variant?: 'primary' | 'ghost';
 tone?: 'light' | 'dark';
 size?: 'md' | 'sm';
 icon?: LucideIcon | null;
 href?: string;
 type?: 'button' | 'submit';
 disabled?: boolean;
 onClick?: () => void;
 className?: string;
};

// The page's one button: a solid block with a shade under it and an orange chip that turns on hover.
// The ghost variant fills from the reading side.
export default function Button({ children, variant = 'primary', tone = 'light', size = 'md', icon = ArrowUpRight, href, type = 'button', disabled, onClick, className }: Props) {
 const Icon = icon;
 const inner = <>
  <span className={u.btnLabel}>{children}</span>
  {Icon && <span className={u.btnChip} aria-hidden><Icon size={size === 'sm' ? 14 : 16} strokeWidth={2} /></span>}
 </>;
 const cls = `${u.btn} ${className ?? ''}`;
 const data = { 'data-variant': variant, 'data-tone': tone, 'data-size': size };
 // Same-page anchors scroll every time: Next's Link does nothing once the address already ends in that hash.
 if (href?.startsWith('#')) return <a href={href} className={cls} {...data} onClick={e => {
  const target = document.getElementById(href.slice(1));
  if (target) {
   e.preventDefault();
   const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
   history.replaceState(history.state, '', href);
  }
  onClick?.();
 }}>{inner}</a>;
 if (href) return <Link href={href} className={cls} {...data} onClick={onClick}>{inner}</Link>;
 return <button type={type} className={cls} {...data} disabled={disabled} onClick={onClick}>{inner}</button>;
}
