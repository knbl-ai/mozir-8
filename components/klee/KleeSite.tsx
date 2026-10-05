'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MotionConfig } from 'motion/react';
import { ArrowUpRight, ExternalLink, Mail, MessageCircle, Navigation, Phone } from 'lucide-react';
import LanguageSwitch from '@/components/LanguageSwitch';
import { useLang, withLang } from '@/lib/i18n';
import { kleeBuilding, kleeContact, kleeContactHe, kleeHomes, type KleeHome } from '@/content/projects/klee';
import { kleeText } from './strings';
import s from './klee.module.css';

// One home on the deck. The chosen card opens wide and plays its film; the others stand as slim
// panels with their name on the edge. Mouse: hover chooses, click steps inside. Touch: the first tap
// chooses, the second steps inside.
function HomeCard({ home, index, active, onChoose }: { home: KleeHome; index: number; active: boolean; onChoose: () => void }) {
 const lang = useLang();
 const t = kleeText[lang];
 const router = useRouter();
 const video = useRef<HTMLVideoElement>(null);
 const [playing, setPlaying] = useState(false);
 const touch = useRef(false);
 const he = lang === 'he';
 const name = home.shortTitle;
 const href = withLang(`/klee-8/${home.id}`, lang);
 const outdoor = he ? home.he.outdoor : home.outdoor;

 useEffect(() => {
  const v = video.current;
  if (!v) return;
  if (active && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.matchMedia('(min-width: 901px)').matches) {
   v.currentTime = 0; void v.play().catch(() => {});
  } else { v.pause(); setPlaying(false); }
 }, [active]);

 return <article className={s.card} data-active={active || undefined} onPointerEnter={e => { if (e.pointerType === 'mouse') onChoose(); }}>
  <Link href={href} className={s.cardLink} aria-label={t.stepInsideHome(name)}
   onPointerDown={e => { touch.current = e.pointerType !== 'mouse'; }}
   onFocus={onChoose}
   onClick={e => { if (touch.current && !active && window.matchMedia('(min-width: 761px)').matches) { e.preventDefault(); onChoose(); } }}
   onMouseEnter={() => router.prefetch(href)}>
   <img className={s.cardImage} src={home.cover} alt="" draggable={false} />
   <video ref={video} className={s.cardVideo} data-playing={playing || undefined} src={active ? home.media.film.src : undefined} muted playsInline loop preload="none"
    onPlaying={() => setPlaying(true)} aria-hidden tabIndex={-1} />
   <span className={s.cardShade} aria-hidden />
   <span className={s.cardNumber} aria-hidden>{home.number}</span>
   <span className={s.cardEdge} aria-hidden>{name}<small>{t.rooms(home.rooms)} · {home.area} {t.sqm}</small></span>
   <span className={s.cardBody}>
    <span className={s.cardLabel}>{he ? home.he.label : home.label} · {he ? home.floorLabelHe : home.floorLabel}</span>
    <span className={s.cardName}>{name}</span>
    <span className={s.cardTagline}>{he ? home.conceptHe : home.concept}</span>
    <span className={s.cardChips}>
     <span>{t.rooms(home.rooms)}</span><span>{home.area} {t.sqm}</span><span>{t.outdoorArea(outdoor, home.outdoorArea)}</span>
    </span>
    <span className={s.cardCta}>{t.stepInside}<ArrowUpRight size={17} strokeWidth={1.8} aria-hidden /></span>
   </span>
  </Link>
  <span className={s.cardIndex} aria-hidden>{index + 1}/{kleeHomes.length}</span>
 </article>;
}

export default function KleeSite() {
 const lang = useLang();
 const t = kleeText[lang];
 const he = lang === 'he';
 const b = he ? kleeBuilding.he : kleeBuilding.en;
 const contact = he ? { ...kleeContact, ...kleeContactHe } : kleeContact;
 const [chosen, setChosen] = useState(kleeHomes[0].id);
 const query = encodeURIComponent(kleeBuilding.mapQuery);
 const message = t.enquiry();

 useEffect(() => {
  const wanted = `N°8 KLEE · ${contact.agency}`;
  const apply = () => { if (document.title !== wanted) document.title = wanted; };
  apply();
  const observer = new MutationObserver(apply);
  observer.observe(document.head, { subtree: true, childList: true, characterData: true });
  return () => observer.disconnect();
 }, [contact.agency]);

 return <MotionConfig reducedMotion="user"><div className={s.page}>
  <header className={s.header}>
   <Link href={withLang('/', lang)} className={s.brand} title={t.allDemos}>
    <img className={s.remax} src="/remax-logo.png" alt={contact.agency} width={130} height={24} />
   </Link>
   <span className={s.wordmark} aria-label="N°8 KLEE"><span>N°8</span><b>KLEE</b></span>
   <div className={s.headerEnd}>
    <LanguageSwitch id="klee-lang" compact />
    <a className={s.headerCta} href={`https://wa.me/${contact.phoneIntl.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">
     <MessageCircle size={16} strokeWidth={1.8} aria-hidden /><span>{t.talkTo(contact.name)}</span>
    </a>
   </div>
  </header>

  <main className={s.main}>
   <section className={s.homes} aria-label={t.homesLabel}>
    <div className={s.homesHead}>
     <h2 className={s.homesTitle}>{t.homesTitle}</h2>
     <p className={s.homesNote}>{t.homesNote}</p>
    </div>
    <div className={s.deck}>
     {kleeHomes.map((home, i) => <HomeCard key={home.id} home={home} index={i} active={chosen === home.id} onChoose={() => setChosen(home.id)} />)}
    </div>
   </section>

   <aside className={s.building} aria-label={t.buildingLabel}>
    <div className={s.buildingInner}>
     <p className={s.kicker}>{b.kicker}</p>
     <h1 className={s.title}>N°8 <span>KLEE</span></h1>
     <p className={s.lead}>{b.title}</p>
     <p className={s.intro}>{b.intro}</p>
     <dl className={s.facts}>
      {b.facts.map(f => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}
     </dl>

     <h3 className={s.heading}>{t.theLocation}</h3>
     <div className={s.map}>
      <iframe title={t.mapTitle} src={`https://maps.google.com/maps?q=${query}&z=16&hl=${lang}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
     </div>
     <div className={s.mapLinks}>
      <a href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noreferrer"><ExternalLink size={14} strokeWidth={1.8} aria-hidden />{t.openMaps}</a>
      <a href={`https://waze.com/ul?q=${query}&navigate=yes`} target="_blank" rel="noreferrer"><Navigation size={14} strokeWidth={1.8} aria-hidden />{t.openWaze}</a>
     </div>
     {b.location.map(p => <p key={p.slice(0, 24)} className={s.text}>{p}</p>)}

     <h3 className={s.heading}>{t.designedBy}</h3>
     <p className={s.text}>{b.developer}</p>

     <div className={s.agent}>
      <div className={s.agentWho}>
       <span className={s.agentAvatar} aria-hidden>{contact.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
       <span><strong>{contact.name}</strong><small>{t.agent} · {contact.agency}</small></span>
      </div>
      <div className={s.agentActions}>
       <a className={s.agentPrimary} href={`https://wa.me/${contact.phoneIntl.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer"><MessageCircle size={16} strokeWidth={1.8} aria-hidden />{t.whatsapp}</a>
       <a className={s.agentButton} href={`tel:${contact.phoneIntl}`}><Phone size={15} strokeWidth={1.8} aria-hidden /><span dir="ltr">{contact.phone}</span></a>
       {contact.email && <a className={s.agentButton} href={`mailto:${contact.email}?subject=${encodeURIComponent('N°8 KLEE')}&body=${encodeURIComponent(message)}`} title={contact.email}><Mail size={15} strokeWidth={1.8} aria-hidden />{t.email}</a>}
      </div>
     </div>
     <p className={s.disclaimer}>{he ? kleeBuilding.disclaimerHe : kleeBuilding.disclaimer}</p>
    </div>
   </aside>
  </main>
 </div></MotionConfig>;
}
