import u from './ui.module.css';

// A measured span: it runs from the start pill to the end pill (the destination, solid orange), the measure in the middle.
// `draw` animates it in once, from the reading side.
type Props = { start?: string; label?: string; end?: string; startIcon?: React.ReactNode; endIcon?: React.ReactNode; draw?: boolean; delay?: number; tone?: 'light' | 'dark'; className?: string };
export default function DimensionLine({ start, label, end, startIcon, endIcon, draw = false, delay = 0, tone = 'light', className }: Props) {
 return <div className={`${u.dim} ${className ?? ''}`} data-draw={draw || undefined} data-tone={tone} style={{ '--dim-delay': `${delay}ms` } as React.CSSProperties} aria-hidden={!label && !start && !end}>
  {start && <span className={u.dimNote} data-end="start">{startIcon}{start}</span>}
  <span className={u.dimSpan}>
   <i className={u.dimLine} />
   {label && <span className={u.dimLabel}>{label}</span>}
   {label && <i className={u.dimLine} />}
  </span>
  {end && <span className={u.dimNote} data-end="end">{endIcon}{end}</span>}
 </div>;
}
