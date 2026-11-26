'use client';
// A test page for the apartment section (/oystra/lab): the two layouts of ResidenceTour one under the other,
// so they can be compared before one goes on the page. Not linked from anywhere.
import { useEffect, useRef } from 'react';
import ResidenceTour from './ResidenceTour';
import s from './oystra.module.css';

const FONTS = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Hanken+Grotesk:wght@300;400;500&family=Cinzel:wght@400;500&display=swap';
const label: React.CSSProperties = { textAlign: 'center', fontSize: 11, letterSpacing: '.3em', textTransform: 'uppercase', color: '#9DB0BC', padding: '22px 0' };

export default function TourLab() {
 // the page's arrive-on-scroll rule, as in OystraSite.tsx
 const page = useRef<HTMLDivElement>(null);
 useEffect(() => {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.setAttribute('data-in', ''); io.unobserve(e.target); } }), { threshold: .18 });
  page.current?.querySelectorAll('[data-reveal]').forEach(e => io.observe(e));
  return () => io.disconnect();
 }, []);
 return <div className={s.page} ref={page}>
  <link rel="stylesheet" href={FONTS} precedence="default" />
  <p style={label}>Option 1 · plan beside the photograph</p>
  <section className={s.pearl} style={{ paddingBlock: 'clamp(36px,5vw,80px)' }}><ResidenceTour layout="beside" /></section>
  <p style={label}>Option 2 · plan over the photograph</p>
  <section className={s.pearl} style={{ paddingBlock: 'clamp(36px,5vw,80px)' }}><ResidenceTour layout="over" /></section>
  <p style={label}>End</p>
 </div>;
}
