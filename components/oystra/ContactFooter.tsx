'use client';
// The page's close: the project's facts and credits. The enquiry text and form stand over the furnishing film (EnquiryPanel.tsx).
import { CREDITS } from './content';
import s from './oystra.module.css';
import e from './enquire.module.css';

export default function ContactFooter() {
 return <footer className={`${s.night} ${s.foot}`}>
  <div className={s.wrap}>
   <dl className={`${s.footFacts} ${e.facts}`} data-reveal>
    <div><dt>Developer</dt><dd>Richmind</dd></div>
    <div><dt>Address</dt><dd>Al Marjan Island, Ras Al Khaimah, UAE</dd></div>
    <div><dt>Handover</dt><dd>From Q2 2029</dd></div>
    <div><dt>Web</dt><dd><a href="https://richmind.com" target="_blank" rel="noreferrer">richmind.com</a></dd></div>
   </dl>
  </div>
  <div className={`${s.wrap} ${s.footEnd}`} data-reveal>
   <span className={s.wordmark}>Oystra</span>
   <ul>{CREDITS.map(([role, name]) => <li key={role}><i>{role}</i>{name}</li>)}</ul>
   <p className={s.small}>Interior pictures are our visualisations of Residence C-905. Exterior pictures follow the developer&apos;s renders. Sizes follow the developer&apos;s plans and may change. Travel times as given by the developer. Map data © OpenStreetMap contributors.</p>
  </div>
 </footer>;
}
