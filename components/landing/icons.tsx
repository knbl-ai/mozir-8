import u from './ui.module.css';

// Six line icons drawn on one 24 px grid, 1.5 stroke, square ends, each with one orange accent stroke.
type IconProps = { className?: string; size?: number };
const Svg = ({ className, size = 24, children }: IconProps & { children: React.ReactNode }) =>
 <svg className={`${u.icon} ${className ?? ''}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="square" strokeLinejoin="miter" aria-hidden>{children}</svg>;
const A = ({ d }: { d: string }) => <path d={d} className={u.iconAccent} />;

export const FilmIcon = (p: IconProps) => <Svg {...p}>
 <rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="M3 9h2M3 15h2M19 9h2M19 15h2" />
 <A d="M8 15.5c2-3.5 5.2-4.6 8.2-3.3M14.6 10.6l1.8 1.6-1.6 1.6" />
</Svg>;

export const ModelIcon = (p: IconProps) => <Svg {...p}>
 <path d="M12 3 20.5 7.6 12 12.2 3.5 7.6Z" /><path d="M3.5 7.6v8.8L12 21l8.5-4.6V7.6M12 12.2V21" />
 <A d="M7.7 5.3 16.2 9.9" />
</Svg>;

export const ImagesIcon = (p: IconProps) => <Svg {...p}>
 <path d="M7 6V3.5h13.5V16H18" /><rect x="3.5" y="7" width="14" height="13.5" rx="1" />
 <A d="M7.5 20.5V13h6v7.5M10.5 13v7.5" />
</Svg>;

export const BuildingIcon = (p: IconProps) => <Svg {...p}>
 <path d="M9 19V4h6v15M3.5 19.5h17" /><path d="M11.2 7h1.6M11.2 10h1.6M11.2 13h1.6" />
 <A d="M6.2 11.6C3.6 12.6 3.2 14.2 6 15.3c3 1.2 9 1.2 12 0 2.2-.9 2.3-2.1.6-3.1M17 11.2l1.8 1-1 1.8" />
</Svg>;

export const SiteIcon = (p: IconProps) => <Svg {...p}>
 <rect x="3" y="4" width="18" height="16" rx="1.5" /><path d="M3 8h18M5.5 6h.01M7.5 6h.01" />
 <A d="M6.5 11h5v6h-5zM11.5 13.5h6V17h-6" />
</Svg>;

export const LanguagesIcon = (p: IconProps) => <Svg {...p}>
 <path d="M3.5 4.5h10v8h-6l-2.5 2.2V12.5H3.5z" />
 <A d="M10.5 10.5h10v8H18v2.2l-2.5-2.2h-5z" />
 <path d="M6.6 10.4 8.5 6.6l1.9 3.8M7.2 9.2h2.6" />
</Svg>;
