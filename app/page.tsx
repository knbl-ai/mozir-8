'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
const ApartmentViewer = dynamic(() => import('@/components/ApartmentViewer'), { ssr: false });
const images = [
 {src:'01_living', title:'Room to come together', room:'Living & dining', description:'An open living space, framed by warm materials and a generous connection to the outdoors.'},
 {src:'02_main_bedroom', title:'A slower start', room:'Principal bedroom', description:'A private retreat with a calm palette and its own adjoining bathroom.'},
 {src:'03_ensuite', title:'Everyday rituals', room:'En suite', description:'Natural tones and pared-back detailing in the proposed private bathroom.'},
 {src:'04_small_bedroom', title:'Space for possibility', room:'Second bedroom', description:'A flexible second bedroom, imagined with the same quiet attention to detail.'},
 {src:'05_large_bathroom', title:'Quietly considered', room:'Main bathroom', description:'An airy, carefully composed interpretation of the main bathroom.'},
 {src:'06_kitchen', title:'The heart of the home', room:'Kitchen', description:'Soft cabinetry, tactile surfaces and an easy connection to the living and dining spaces.'},
 {src:'07_overhead', title:'See the whole picture', room:'The complete residence', description:'An illustrative overview of the apartment and its wraparound outdoor space.'},
 {src:'08_terrace_end', title:'Life, a little more open', room:'Garden terrace', description:'An outdoor room for long lunches, slow mornings and a little space to yourself.'},
];
const Arrow = () => <span aria-hidden="true">↗</span>;
export default function Home() {
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
 return <>
  <a className="skip-link" href="#residence">Skip to residence</a>
  <header className="header"><a href="#" className="wordmark" aria-label="Mozir 8 home">MOZIR<span>8</span><small>TEL AVIV RESIDENCES</small></a>
   <nav className={menu?'nav expanded':'nav'} aria-label="Main navigation">{[['The residence','#residence'],['The spaces','#spaces'],['Explore in 3D','#explore'],['The address','#address']].map(([t,h])=><a key={h} href={h} onClick={()=>setMenu(false)}>{t}</a>)}</nav>
   <a className="header-cta" href="#film">Watch the film <span>↗</span></a><button className="menu-button" aria-label="Toggle navigation" aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?'Close':'Menu'} <span>{menu?'−':'+'}</span></button>
  </header>
  <main>
   <section className="hero" aria-labelledby="hero-title">
    <img src="/media/01_living.webp" alt="Sunlit proposed living room opening onto the garden terrace" fetchPriority="high" className="hero-image"/>
    <div className="hero-shade"/>
    <div className="hero-top"><span>8 YAAKOV MOZIR · TEL AVIV</span><span>THE GARDEN RESIDENCE / 02</span></div>
    <div className="hero-copy"><p className="eyebrow light">A QUIETER KIND OF CITY LIVING</p><h1 id="hero-title">A little more<br/>room to <em>live.</em></h1><p>Open space. Soft light. Your own corner of Tel Aviv.</p><a className="hero-link" href="#residence">Discover the residence <span>↓</span></a></div>
    <button className="hero-play" onClick={()=>setFilm(true)}><span className="play-circle">▷</span><span>Step inside<small>THE RESIDENCE FILM · 20 SEC</small></span></button>
    <span className="hero-disclaimer">Illustrative interior concept</span>
   </section>
   <section id="residence" className="intro section-pad">
    <div className="section-kicker"><span className="eyebrow">01 / THE RESIDENCE</span><span className="small-label">GROUND FLOOR · APARTMENT 02</span></div>
    <div className="intro-grid"><h2>City on the outside.<br/><em>Sanctuary within.</em></h2><div className="intro-text"><p>A home with space to breathe, at 8 Yaakov Mozir. Two bedrooms, open living and dining, and a wraparound garden terrace bring a different rhythm to life in Tel Aviv.</p><p>Our interior concept pairs natural textures and warm neutrals with the easy openness of contemporary Israeli living.</p><a className="text-link" href="/media/apartment-plan.pdf" target="_blank" rel="noreferrer">View the original floor plan <Arrow/></a></div></div>
    <div className="specs">{[['85.5','M² · APPROX. INTERIOR'],['02','BEDROOMS'],['02','BATHROOMS'],['Garden','WRAPAROUND OUTDOOR SPACE']].map(([n,t])=><div key={t}><strong>{n}</strong><span>{t}</span></div>)}</div>
   </section>
   <section id="film" className="film-section"><img src="/media/08_terrace_end.webp" alt="Proposed terrace design with outdoor seating and an illustrative Israeli neighborhood outlook" loading="lazy"/><div className="film-overlay"/><div className="film-heading"><p className="eyebrow light">20 SECONDS. A DIFFERENT PACE.</p><h2>Feel what it’s like<br/>to <em>come home.</em></h2></div><button className="film-play" onClick={()=>setFilm(true)} aria-label="Play the residence film with jazz-fusion soundtrack"><span>▷</span></button><div className="film-bottom"><span>THE RESIDENCE FILM</span><span>WITH SOUND · 00:20</span></div></section>
   <section id="spaces" className="spaces section-pad">
    <div className="section-kicker"><span className="eyebrow">02 / THE SPACES</span><span className="small-label">AN INTERIOR VISION</span></div>
    <div className="spaces-heading"><h2>Considered details.<br/><em>Unhurried living.</em></h2><p>Explore the residence, room by room.<br/>A warm, tactile vision of home.</p></div>
    <div className="gallery-grid">{[images[0],images[1],images[5],images[7]].map((item,i)=><button className={'gallery-card gallery-card-'+i} key={item.src} onClick={()=>setGallery(images.indexOf(item))}><div className="image-wrap"><img src={'/media/'+item.src+'.webp'} alt={item.room+' — proposed interior design'} loading="lazy"/><span className="expand-icon">↗</span></div><div className="gallery-caption"><span>{item.room}</span><span>0{images.indexOf(item)+1} / 08</span></div></button>)}</div>
    <div className="gallery-bottom"><p>From intimate corners to open-air moments.</p><button className="text-link" onClick={()=>setGallery(0)}>Explore all 8 images <Arrow/></button></div>
   </section>
   <section id="explore" className="explore section-pad">
    <div className="section-kicker"><span className="eyebrow">03 / A NEW PERSPECTIVE</span><span className="small-label">YOUR PRIVATE 3D VIEWING</span></div>
    <div className="explore-heading"><h2>Make yourself<br/><em>at home.</em></h2><div><p>Turn the apartment. Explore the layout.<br/>See how each space connects to the next.</p><a className="text-link" href="/media/apartment-plan.pdf" target="_blank" rel="noreferrer">Open floor plan <Arrow/></a></div></div>
    {explore?<ApartmentViewer/>:<button className="viewer-preview" onClick={()=>setExplore(true)}><img src="/media/07_overhead.webp" alt="Illustrative overhead view of the apartment and terrace" loading="lazy"/><span className="viewer-start"><span className="orbit-icon">◎</span>Explore the apartment in 3D <Arrow/><small>ROTATE · ZOOM · DISCOVER</small></span></button>}
    <div className="model-note"><span>THE FULL APARTMENT. INCLUDING THE TERRACE.</span><p>Plan-based 3D layout with illustrative furniture and simplified finishes. Images show the proposed interior styling.</p></div>
   </section>
   <section className="terrace-story"><div className="terrace-photo"><img src="/media/08_terrace_end.webp" alt="Full terrace concept with a dining table, lounge seating and planting" loading="lazy"/></div><div className="terrace-copy"><p className="eyebrow">THE OUTDOOR ROOM</p><h2>A table for friends.<br/>A moment<br/><em>for yourself.</em></h2><p>Doors slide open. The living space flows out. The wraparound terrace becomes another room—one with a little more sky.</p><button className="text-link" onClick={()=>setGallery(7)}>Take a closer look <Arrow/></button><small>Outdoor design and neighborhood view are illustrative.</small></div></section>
   <section id="address" className="address section-pad"><div className="address-copy"><p className="eyebrow">04 / THE ADDRESS</p><h2>Tel Aviv,<br/><em>at your pace.</em></h2><p className="address-line">8 Yaakov Mozir<br/><span lang="he" dir="rtl">יעקב מוזיר 8, תל אביב</span></p><p>In Tel Aviv’s New North, in the Kikar HaMedina area. A residential setting with the city as your backdrop.</p><a className="text-link" href="https://www.google.com/maps/search/?api=1&query=8+Yaakov+Mozir+Tel+Aviv+Israel" target="_blank" rel="noreferrer">Explore the neighborhood <Arrow/></a><div className="developer"><span className="eyebrow">THE PROJECT</span><h3>Urban Real Estate</h3><p>Urban Real Estate works in residential development and urban renewal. The company is listed as the developer of the Yaakov Mozir 8 project.</p><a className="text-link" href="https://www.yad2.co.il/yad1/project/6731" target="_blank" rel="noreferrer">Project & enquiry details <Arrow/></a></div></div><figure className="building-photo"><img src="/media/building.jpg" alt="Supplied architectural marketing image of the building at Mozir 8" loading="lazy"/><figcaption>MOZIR 8 · BUILDING VISUALIZATION</figcaption></figure></section>
   <section className="closing"><p className="eyebrow light">THE GARDEN RESIDENCE · MOZIR 8</p><h2>More space.<br/><em>More possibility.</em></h2><a href="https://www.yad2.co.il/yad1/project/6731" target="_blank" rel="noreferrer" className="closing-cta">Enquire about the project <Arrow/></a><span>Apartment 02 · 8 Yaakov Mozir, Tel Aviv</span></section>
  </main>
  <footer><div className="footer-top"><a href="#" className="wordmark">MOZIR<span>8</span><small>TEL AVIV RESIDENCES</small></a><a href="/media/apartment-plan.pdf" target="_blank" rel="noreferrer">Floor plan ↗</a><button onClick={()=>setFilm(true)}>Watch the film ↗</button><a href="#">Back to top ↑</a></div><div className="footer-bottom"><p>A visual introduction to Apartment 02. AI-generated images and film illustrate a proposed interior; furniture, finishes, landscaping and exterior views are not a specification or a verified view. Approximate area is taken from the supplied sales plan. Confirm all property details and availability with the project representative.</p><details><summary>Project information & sources</summary><a href="/media/apartment-plan.pdf" target="_blank" rel="noreferrer">Supplied apartment sales plan (Mozir 8 Tel Aviv Ltd.)</a><a href="https://www.yad2.co.il/yad1/project/6731" target="_blank" rel="noreferrer">Yad2 project listing — developer and location</a><a href="https://urbanrealestateisr.wixsite.com/urbannadlan" target="_blank" rel="noreferrer">Urban Real Estate — company information</a><span>Presentation concept · September 2026</span></details></div></footer>
  <dialog ref={dialog} className={film?'media-dialog film-dialog':'media-dialog'} onCancel={close} onClick={e=>{if(e.target===dialog.current)close();}} onKeyDown={e=>{if(gallery!==null&&e.key==='ArrowRight')move(1);if(gallery!==null&&e.key==='ArrowLeft')move(-1);}} aria-label={film?'The residence film':'Residence image gallery'}><button className="dialog-close" autoFocus onClick={close} aria-label="Close viewer">✕</button>{film?<><video src="/media/residence-film.mp4" controls autoPlay playsInline preload="metadata"/><div className="dialog-caption"><span>The residence film</span><span>20 SEC · JAZZ FUSION</span></div></>:gallery!==null?<><img className="lightbox-image" src={'/media/'+images[gallery].src+'.webp'} alt={images[gallery].room+' — illustrative design'}/><div className="dialog-caption"><div><span className="eyebrow">{images[gallery].room}</span><h3>{images[gallery].title}</h3><p>{images[gallery].description}</p></div><div className="lightbox-controls"><button onClick={()=>move(-1)} aria-label="Previous image">←</button><span>{String(gallery+1).padStart(2,'0')} / 08</span><button onClick={()=>move(1)} aria-label="Next image">→</button></div></div></>:null}</dialog>
 </>;
}
