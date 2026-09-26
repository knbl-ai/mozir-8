'use client';
import { Fragment, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import LanguageSwitch from '@/components/LanguageSwitch';
import { useLang, withLang } from '@/lib/i18n';
import { mozirText } from './strings';
const ApartmentViewer = dynamic(() => import('@/components/ApartmentViewer'), { ssr: false });
const images = ['01_living', '02_main_bedroom', '03_ensuite', '04_small_bedroom', '05_large_bathroom', '06_kitchen', '07_overhead', '08_terrace_end'];
const Arrow = () => <span aria-hidden="true" className="dir-arrow">↗</span>;
// "\n" breaks a heading, *…* is its italic accent.
const rich = (text: string) => text.split('\n').map((line, i, lines) => <Fragment key={i}>
 {line.split(/(\*[^*]+\*)/).map((part, j) => part.startsWith('*') ? <em key={j}>{part.slice(1, -1)}</em> : part)}{i < lines.length - 1 && <br/>}
</Fragment>);
export default function MozirSite() {
 const lang = useLang(); const t = mozirText[lang];
 const [menu, setMenu]=useState(false); const [gallery, setGallery]=useState<number|null>(null);
 const [film,setFilm]=useState(false); const [explore,setExplore]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null); const lastFocus=useRef<HTMLElement|null>(null);
 const open=film || gallery!==null;
 useEffect(()=>{
  if(open){ lastFocus.current=document.activeElement as HTMLElement; dialog.current?.showModal(); document.body.style.overflow='hidden'; }
  else { dialog.current?.close(); document.body.style.overflow=''; lastFocus.current?.focus(); }
  return ()=>{document.body.style.overflow='';};
 },[open]);
 const close=()=>{setFilm(false);setGallery(null);};
 const move=(dir:number)=>setGallery(i=>i===null?null:(i+dir+images.length)%images.length);
 const room=(i:number)=>t.rooms[i];
 return <>
  <a className="skip-link" href="#residence">{t.skip}</a>
  <header className="header"><a href="#" className="wordmark" aria-label={t.home}>MOZIR<span>8</span><small>{t.wordmarkNote}</small></a>
   <nav className={menu?'nav expanded':'nav'} aria-label={t.navLabel}>{t.nav.map(([label,h])=><a key={h} href={h} onClick={()=>setMenu(false)}>{label}</a>)}</nav>
   <div className="header-actions"><LanguageSwitch id="mozir-lang" compact /><a className="header-cta" href="#film">{t.watchFilm} <span className="dir-arrow">↗</span></a></div><button className="menu-button" aria-label={t.toggleNav} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?t.close:t.menu} <span>{menu?'−':'+'}</span></button>
  </header>
  <main>
   <section className="hero" aria-labelledby="hero-title">
    <img src="/media/01_living.webp" alt={t.heroAlt} fetchPriority="high" className="hero-image"/>
    <div className="hero-shade"/>
    <div className="hero-top"><span>{t.heroTop[0]}</span><span>{t.heroTop[1]}</span></div>
    <div className="hero-copy"><p className="eyebrow light">{t.heroEyebrow}</p><h1 id="hero-title">{rich(t.heroTitle)}</h1><p>{t.heroText}</p><a className="hero-link" href="#residence">{t.heroLink} <span>↓</span></a></div>
    <button className="hero-play" onClick={()=>setFilm(true)}><span className="play-circle">▷</span><span>{t.heroPlay}<small>{t.heroPlayNote}</small></span></button>
    <span className="hero-disclaimer">{t.heroDisclaimer}</span>
   </section>
   <section id="residence" className="intro section-pad">
    <div className="section-kicker"><span className="eyebrow">{t.residenceEyebrow}</span><span className="small-label">{t.residenceLabel}</span></div>
    <div className="intro-grid"><h2>{rich(t.residenceTitle)}</h2><div className="intro-text">{t.residenceText.map(p=><p key={p.slice(0,20)}>{p}</p>)}<a className="text-link" href="/media/apartment-plan.pdf" target="_blank" rel="noreferrer">{t.originalPlan} <Arrow/></a></div></div>
    <div className="specs">{t.specs.map(([n,label])=><div key={label}><strong>{n}</strong><span>{label}</span></div>)}</div>
   </section>
   <section id="film" className="film-section"><img src="/media/08_terrace_end.webp" alt={t.filmAlt} loading="lazy"/><div className="film-overlay"/><div className="film-heading"><p className="eyebrow light">{t.filmEyebrow}</p><h2>{rich(t.filmTitle)}</h2></div><button className="film-play" onClick={()=>setFilm(true)} aria-label={t.filmPlay}><span>▷</span></button><div className="film-bottom"><span>{t.filmBottom[0]}</span><span>{t.filmBottom[1]}</span></div></section>
   <section id="spaces" className="spaces section-pad">
    <div className="section-kicker"><span className="eyebrow">{t.spacesEyebrow}</span><span className="small-label">{t.spacesLabel}</span></div>
    <div className="spaces-heading"><h2>{rich(t.spacesTitle)}</h2><p>{rich(t.spacesText)}</p></div>
    <div className="gallery-grid">{[0,1,5,7].map((index,i)=><button className={'gallery-card gallery-card-'+i} key={images[index]} onClick={()=>setGallery(index)}><div className="image-wrap"><img src={'/media/'+images[index]+'.webp'} alt={t.imageAlt(room(index).room)} loading="lazy"/><span className="expand-icon">↗</span></div><div className="gallery-caption"><span>{room(index).room}</span><span>0{index+1} / 08</span></div></button>)}</div>
    <div className="gallery-bottom"><p>{t.galleryBottom}</p><button className="text-link" onClick={()=>setGallery(0)}>{t.allImages} <Arrow/></button></div>
   </section>
   <section id="explore" className="explore section-pad">
    <div className="section-kicker"><span className="eyebrow">{t.exploreEyebrow}</span><span className="small-label">{t.exploreLabel}</span></div>
    <div className="explore-heading"><h2>{rich(t.exploreTitle)}</h2><div><p>{rich(t.exploreText)}</p><a className="text-link" href="/media/apartment-plan.pdf" target="_blank" rel="noreferrer">{t.openPlan} <Arrow/></a></div></div>
    {explore?<ApartmentViewer/>:<button className="viewer-preview" onClick={()=>setExplore(true)}><img src="/media/07_overhead.webp" alt={t.previewAlt} loading="lazy"/><span className="viewer-start"><span className="orbit-icon">◎</span>{t.exploreStart} <Arrow/><small>{t.exploreStartNote}</small></span></button>}
    <div className="model-note"><span>{t.modelNoteTag}</span><p>{t.modelNote}</p></div>
   </section>
   <section className="terrace-story"><div className="terrace-photo"><img src="/media/08_terrace_end.webp" alt={t.terraceAlt} loading="lazy"/></div><div className="terrace-copy"><p className="eyebrow">{t.terraceEyebrow}</p><h2>{rich(t.terraceTitle)}</h2><p>{t.terraceText}</p><button className="text-link" onClick={()=>setGallery(7)}>{t.closerLook} <Arrow/></button><small>{t.terraceNote}</small></div></section>
   <section id="address" className="address section-pad"><div className="address-copy"><p className="eyebrow">{t.addressEyebrow}</p><h2>{rich(t.addressTitle)}</h2><p className="address-line">{t.address}<br/><span lang={t.addressOther.lang} dir={t.addressOther.lang === 'he' ? 'rtl' : 'ltr'}>{t.addressOther.text}</span></p><p>{t.addressText}</p><a className="text-link" href="https://www.google.com/maps/search/?api=1&query=8+Yaakov+Mozir+Tel+Aviv+Israel" target="_blank" rel="noreferrer">{t.neighborhood} <Arrow/></a><div className="developer"><span className="eyebrow">{t.developerEyebrow}</span><h3>{t.developer}</h3><p>{t.developerText}</p><a className="text-link" href="https://www.yad2.co.il/yad1/project/6731" target="_blank" rel="noreferrer">{t.projectLink} <Arrow/></a></div></div><figure className="building-photo"><img src="/media/building.jpg" alt={t.buildingAlt} loading="lazy"/><figcaption>{t.buildingCaption}</figcaption></figure></section>
   <section className="closing"><p className="eyebrow light">{t.closingEyebrow}</p><h2>{rich(t.closingTitle)}</h2><a href="https://www.yad2.co.il/yad1/project/6731" target="_blank" rel="noreferrer" className="closing-cta">{t.closingCta} <Arrow/></a><span>{t.closingLine}</span></section>
  </main>
  <footer><div className="footer-top"><a href="#" className="wordmark">MOZIR<span>8</span><small>{t.wordmarkNote}</small></a><a href="/media/apartment-plan.pdf" target="_blank" rel="noreferrer">{t.floorPlan} <span className="dir-arrow">↗</span></a><button onClick={()=>setFilm(true)}>{t.watchFilm} <span className="dir-arrow">↗</span></button><a href={withLang('/', lang)}>{t.allDemos} <span className="dir-arrow">↗</span></a><a href="#">{t.backToTop} ↑</a></div><div className="footer-bottom"><p>{t.disclaimer}</p><details><summary>{t.sourcesTitle}</summary><a href="/media/apartment-plan.pdf" target="_blank" rel="noreferrer">{t.sources[0]}</a><a href="https://www.yad2.co.il/yad1/project/6731" target="_blank" rel="noreferrer">{t.sources[1]}</a><a href="https://urbanrealestateisr.wixsite.com/urbannadlan" target="_blank" rel="noreferrer">{t.sources[2]}</a><span>{t.concept}</span></details></div></footer>
  <dialog ref={dialog} className={film?'media-dialog film-dialog':'media-dialog'} onCancel={close} onClick={e=>{if(e.target===dialog.current)close();}} onKeyDown={e=>{if(gallery!==null&&e.key==='ArrowRight')move(lang==='he'?-1:1);if(gallery!==null&&e.key==='ArrowLeft')move(lang==='he'?1:-1);}} aria-label={film?t.filmDialog:t.galleryDialog}><button className="dialog-close" autoFocus onClick={close} aria-label={t.closeViewer}>✕</button>{film?<><video src="/media/residence-film.mp4" controls autoPlay playsInline preload="metadata"/><div className="dialog-caption"><span>{t.filmDialog}</span><span>{t.filmMeta}</span></div></>:gallery!==null?<><img className="lightbox-image" src={'/media/'+images[gallery]+'.webp'} alt={t.illustrative(room(gallery).room)}/><div className="dialog-caption"><div><span className="eyebrow">{room(gallery).room}</span><h3>{room(gallery).title}</h3><p>{room(gallery).description}</p></div><div className="lightbox-controls"><button onClick={()=>move(-1)} aria-label={t.previousImage} className="dir-arrow">←</button><span>{String(gallery+1).padStart(2,'0')} / 08</span><button onClick={()=>move(1)} aria-label={t.nextImage} className="dir-arrow">→</button></div></div></>:null}</dialog>
 </>;
}
