// residence.tech: the courtyard mark (traced from video/brand-logo-options/05-courtyard-light-tech.png) and the wordmark.
export const MARK_PATH = 'M0 26H46V108H32V127H71V166H0Z M55 0H168V67H122V46H55Z M122 76H168V185H97V127H122Z';

export function Mark({ className, style }: { className?: string; style?: React.CSSProperties }) {
 return <svg className={className} style={style} viewBox="0 0 168 185" aria-hidden="true"><path d={MARK_PATH} fill="currentColor" /></svg>;
}

export default function Logo({ className }: { className?: string }) {
 return <span className={className} dir="ltr" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.42em', color: '#173F32', lineHeight: 1, fontFamily: "'Residence Sans', system-ui, sans-serif", fontStretch: 'normal' }}>
  <Mark style={{ height: '1.12em', width: 'auto', flex: 'none' }} />
  <span style={{ fontWeight: 500, letterSpacing: '-0.03em' }}>residence<span style={{ color: '#90958F', fontWeight: 400, fontSize: '0.66em', letterSpacing: '-0.01em' }}>.tech</span></span>
 </span>;
}
