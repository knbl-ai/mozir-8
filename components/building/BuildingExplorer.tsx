'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ApartmentViewer from '@/components/ApartmentViewer';
import type { ApartmentZone, BuildingFrame, Development } from '@/content/projects';
import styles from './building.module.css';
// Map a flat label onto a projected facade quad, including perspective foreshortening.
function facadeTransform(p: [number,number][]) {
 const [[x0,y0],[x1,y1],[x2,y2],[x3,y3]]=p;
 const dx1=x1-x2,dx2=x3-x2,dx3=x0-x1+x2-x3;
 const dy1=y1-y2,dy2=y3-y2,dy3=y0-y1+y2-y3;
 const denominator=dx1*dy2-dx2*dy1;
 const g=Math.abs(denominator)>1e-8?(dx3*dy2-dx2*dy3)/denominator:0;
 const h=Math.abs(denominator)>1e-8?(dx1*dy3-dx3*dy1)/denominator:0;
 return `matrix3d(${[(x1-x0+g*x1)/160,(y1-y0+g*y1)/160,0,g/160,(x3-x0+h*x3)/28,(y3-y0+h*y3)/28,0,h/28,0,0,1,0,x0,y0,0,1].join(',')})`;
}
export default function BuildingExplorer({project, frames}:{project:Development;frames:BuildingFrame[]}) {
 const [index,setIndex]=useState(0); const [selected,setSelected]=useState(frames[0]?.hotspots[0]?.unit??project.residences[0].id);
 const [mode,setMode]=useState<'rotation'|'reference'>(frames.length?'rotation':'reference');
 const [detailTab,setDetailTab]=useState<'plan'|'film'|'images'|'model'|'about'>('plan');
 const [imageIndex,setImageIndex]=useState(0);
 const gallery=[{src:"01_living",label:"Living & dining"},{src:"02_main_bedroom",label:"Main bedroom"},{src:"03_ensuite",label:"En-suite bathroom"},{src:"04_small_bedroom",label:"Second bedroom"},{src:"05_large_bathroom",label:"Main bathroom"},{src:"06_kitchen",label:"Kitchen"},{src:"07_overhead",label:"Apartment overview"},{src:"08_terrace_end",label:"Terrace"}];
 const [mobilePanel,setMobilePanel]=useState<'building'|'details'>('building');
 const [reference,setReference]=useState(0); const [displayed,setDisplayed]=useState(0); const [loaded,setLoaded]=useState(true); const [failed,setFailed]=useState(false);
 const drag=useRef<{x:number;index:number;moved:boolean}|null>(null);
 const stageRef=useRef<HTMLDivElement>(null);
 const pointer=useRef<{x:number;y:number}|null>(null);
 const [showSold,setShowSold]=useState(true);
 const [showForSale,setShowForSale]=useState(false);
 const [hoveredApartment,setHoveredApartment]=useState<string|null>(null);
 const [selectedApartment,setSelectedApartment]=useState(frames[0]?.hotspots.find(h=>h.status==='for-sale')?.apartment??'');
 const inventory=Array.from(new Map(frames.flatMap(f=>f.hotspots).map(h=>[h.apartment,h])).values());
 const apartment=inventory.find(h=>h.apartment===selectedApartment);
 const selectApartment=(h:ApartmentZone)=>{if(h.status==='sold')return;setSelected(h.unit);setSelectedApartment(h.apartment);};
 const unit=project.residences.find(u=>u.id===selected)!;
 const frame=frames[displayed]; const src=mode==='rotation'&&frame?frame.src:project.references[reference];
 const updateHover=(x:number,y:number)=>{
  const element=document.elementFromPoint(x,y)?.closest('[data-apartment]');
  const id=element&&stageRef.current?.contains(element)?element.getAttribute('data-apartment'):null;
  const h=frame?.hotspots.find(h=>h.apartment===id);
  setHoveredApartment(h?.apartment??null);
  if(h)selectApartment(h);
 };
 // Rotation replaces polygons under a stationary pointer without a pointer-enter event.
 useEffect(()=>{
  if(mode!=='rotation'||drag.current||!pointer.current)return;
  const request=requestAnimationFrame(()=>{if(pointer.current&&!drag.current)updateHover(pointer.current.x,pointer.current.y);});
  return()=>cancelAnimationFrame(request);
 },[displayed,loaded,mode]);
 const move=(delta:number)=>setIndex(i=>(i+delta+frames.length)%frames.length);
 // Native non-passive listener can consume horizontal gestures without blocking page scroll.
 useEffect(()=>{
  const stage=stageRef.current;
  if(!stage||mode!=='rotation'||!frames.length)return;
  let remainder=0;
  const wheel=(event:WheelEvent)=>{
   if(event.ctrlKey||drag.current||Math.abs(event.deltaX)<=Math.abs(event.deltaY))return;
   event.preventDefault();
   const pixels=event.deltaX*(event.deltaMode===1?16:event.deltaMode===2?stage.clientWidth:1);
   // Wheel deltas describe scrolling, opposite to the content's movement.
   remainder+=pixels;
   const steps=Math.trunc(remainder/12);
   if(steps){remainder-=steps*12;setIndex(i=>((i+steps)%frames.length+frames.length)%frames.length);}
  };
  stage.addEventListener('wheel',wheel,{passive:false});
  return()=>stage.removeEventListener('wheel',wheel);
 },[mode,frames.length]);
 // Keep image and hit regions on the same decoded frame, including slow connections.
 useEffect(()=>{
  if(mode!=='rotation'||!frames.length)return;
  let active=true;setLoaded(false);setFailed(false);setHoveredApartment(null);
  const img=new Image();img.src=frames[index].src;
  img.decode().then(()=>{if(active){setDisplayed(index);setLoaded(true);}}).catch(()=>{if(active){setFailed(true);setLoaded(true);}});
  return ()=>{active=false;};
 },[index,frames,mode]);
 useEffect(()=>{
  if(mode!=='rotation'||!frames.length)return;
  // A small sequential background queue avoids a burst of 72 requests.
  let cancelled=false;
  const preload=async()=>{for(let offset=1;offset<frames.length&&!cancelled;offset++){const img=new Image();img.src=frames[(index+offset)%frames.length].src;try{await img.decode();}catch{}}};
  void preload();return()=>{cancelled=true;};
 },[frames,mode]);
 const choose=(id:string)=>{
  setMode('rotation');
  const available=inventory.find(h=>h.unit===id&&h.status==='for-sale');
  if(available)selectApartment(available);
  // Always face the chosen elevation, even when a side return is already visible.
  setIndex(id==='five-room'?0:Math.floor(frames.length/2));
 };
 return <><header className={styles.appHeader}><Link href="/projects" className={styles.brand}><svg className={styles.brandMark} viewBox="0 0 32 40" aria-hidden="true"><path d="M3 37V16a13 13 0 0 1 26 0v21M10 37V17a6 6 0 0 1 12 0v20M3 27h26" fill="none" stroke="currentColor" strokeWidth="1.4"/></svg><span>Residences<small>The next address</small></span></Link><div className={`${styles.unitList} ${styles.headerLayouts}`} aria-label="Residence layouts">{[...project.residences].sort((a,b)=>['five-room','four-room','garden'].indexOf(a.id)-['five-room','four-room','garden'].indexOf(b.id)).map(u=><button key={u.id} aria-label={u.title} aria-pressed={selected===u.id} onClick={()=>{choose(u.id);}}>{u.id==='garden'?'Garden':u.id==='five-room'?'Front view':'Rear view'}</button>)}</div><div className={`${styles.switcher} ${styles.navPicker}`}><label htmlFor="apartment-picker">{inventory.filter(h=>h.status==='for-sale').length} available homes</label><select id="apartment-picker" aria-label="Available apartments" value={selectedApartment} onChange={e=>{const h=inventory.find(h=>h.apartment===e.target.value);if(h){selectApartment(h);setMode('rotation');setIndex(h.unit==='five-room'?0:Math.floor(frames.length/2));}}}>{inventory.map(h=><option key={h.apartment} value={h.apartment} disabled={h.status==='sold'}>{h.floor} · {project.residences.find(u=>u.id===h.unit)?.title.replace(' Residence','').replace('The ','')} · {h.status==='sold'?'Sold':'Available'}</option>)}</select></div></header><main><section className={styles.explorer} id="explore" aria-label="Explore the building">
  <div className={styles.mobileTabs}><button aria-pressed={mobilePanel==='building'} onClick={()=>setMobilePanel('building')}>Explore building</button><button aria-pressed={mobilePanel==='details'} onClick={()=>setMobilePanel('details')}>Apartment details</button></div>
  <div className={styles.explorerGrid} data-mobile-panel={mobilePanel}>
   <div className={styles.stageColumn}>
    <div className={styles.modeBar}><div role="group" aria-label="Building presentation"><button aria-pressed={mode==='rotation'} disabled={!frames.length} onClick={()=>setMode('rotation')} aria-label="360° building" title="360° building">360°</button><button aria-pressed={mode==='reference'} onClick={()=>setMode('reference')} aria-label="Architect’s vision" title="Architect’s vision"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="1"/><path d="m3 16 6-6 5 5 3-3 4 4"/><circle cx="16" cy="8" r="1"/></svg></button></div><span>Drag to rotate · hover to discover</span></div>
    {mode==='rotation'&&<div className={styles.visibilityControls} role="group" aria-label="Availability overlays"><button role="switch" aria-checked={showSold} aria-label="Show sold" title="Show sold" className={styles.soldToggle} onClick={()=>setShowSold(v=>!v)}><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg></button><button role="switch" aria-checked={showForSale} aria-label="Show for sale" title="Show for sale" className={styles.saleToggle} onClick={()=>setShowForSale(v=>!v)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 9-8 9 8M5 10v11h14V10M10 21v-7h4v7"/></svg></button></div>}
    <div ref={stageRef} className={styles.stage} tabIndex={mode==='rotation'?0:-1} role="group" aria-label={mode==='rotation'?'Building rotation. Use left and right arrow keys.':'Architectural reference'}
     onKeyDown={e=>{if(mode==='rotation'&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();move(e.key==='ArrowRight'?-1:1);}}}
     onPointerDown={e=>{if(mode!=='rotation')return;drag.current={x:e.clientX,index,moved:false};e.currentTarget.setPointerCapture(e.pointerId);}}
     onPointerLeave={()=>{pointer.current=null;setHoveredApartment(null);}}
     onPointerMove={e=>{pointer.current={x:e.clientX,y:e.clientY};if(!drag.current){updateHover(e.clientX,e.clientY);return;} const dx=e.clientX-drag.current.x;if(Math.abs(dx)>6)drag.current.moved=true;setIndex(((drag.current.index-Math.round(dx/12))%frames.length+frames.length)%frames.length);}}
     onPointerUp={e=>{const moved=drag.current?.moved;drag.current=null;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);if(!moved){const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-apartment]');const id=target?.getAttribute('data-apartment');const h=inventory.find(h=>h.apartment===id);if(h)selectApartment(h);}updateHover(e.clientX,e.clientY);}} onPointerCancel={()=>{drag.current=null;}}>
     <div className={`${styles.orbitCanvas} ${mode==='reference'?styles.referenceCanvas:''}`}>
     <img className={mode==='rotation'?styles.closeView:undefined} src={src} alt={mode==='rotation'?`Building architectural study, angle ${displayed+1} of ${frames.length}`:'Supplied architectural visualization of the building'} draggable={false} onLoad={()=>setLoaded(true)} onError={()=>{setLoaded(true);setFailed(true);}}/>
     {!loaded&&<span className={styles.viewStatus} role="status">Loading angle…</span>}
     {failed&&<div className={styles.loading}>This view couldn’t load. <button onClick={()=>setMode('reference')}>Open architectural reference</button></div>}
     {mode==='rotation'&&frame&&!failed&&<svg viewBox="0 0 800 900" className={`${styles.hotspots} ${styles.closeView}`} aria-label="Apartment availability — demo inventory">
      {frame.hotspots.map((h,i)=><polygon key={`${h.apartment}-${i}`} data-unit={h.unit} data-apartment={h.apartment} data-status={h.status} points={h.points} onPointerEnter={()=>{if(!drag.current){setHoveredApartment(h.apartment);selectApartment(h);}}} onPointerLeave={()=>setHoveredApartment(null)} className={hoveredApartment===h.apartment?(h.status==='sold'?styles.soldSelected:styles.availableSelected):h.status==='sold'?(showSold?styles.soldZone:styles.hiddenSoldZone):(showForSale?styles.availableIdle:styles.availableZone)}><title>{`${h.floor} · ${project.residences.find(u=>u.id===h.unit)?.title} · ${h.status==='sold'?'Sold':'For sale'}`}</title></polygon>)}
      {Array.from(new Set(frame.hotspots.map(h=>h.apartment))).map(id=>{
       const area=(h:ApartmentZone)=>{const p=h.points.split(' ').map(v=>v.split(',').map(Number));return Math.abs(p.reduce((sum,a,i)=>{const b=p[(i+1)%p.length];return sum+a[0]*b[1]-b[0]*a[1];},0));};
       const h=frame.hotspots.filter(h=>h.apartment===id).sort((a,b)=>area(b)-area(a))[0];
       if(!h.labelPoints||(h.apartment!==hoveredApartment&&!(h.status==='sold'?showSold:showForSale)))return null;
       return <foreignObject key={id} x="0" y="0" width="800" height="900" className={styles.facadeLabelLayer}><div className={`${h.status==='sold'?styles.facadeSoldLabel:styles.facadeSaleLabel} ${h.apartment!==hoveredApartment?styles.idleStatusLabel:''}`} style={{transform:facadeTransform(h.labelPoints)}}>{h.status==='sold'?'SOLD':'FOR SALE'}</div></foreignObject>;

      })}
     </svg>}

     </div>
     <div className={styles.imageBadge}>{mode==='rotation'?'DRAG / TWO-FINGER SWIPE · HOVER TO EXPLORE':'ARCHITECTURAL REFERENCE'}</div>
    </div>
    {mode==='reference'&&<div className={styles.controls}><button onClick={()=>setReference(0)} aria-pressed={reference===0}>Street view</button><button onClick={()=>setReference(1)} aria-pressed={reference===1}>Reverse view</button></div>}
   </div>
   <aside className={styles.sidebar} aria-label="Apartment selection">
    <div className={styles.residenceHeading}><div className={styles.residenceTitleRow}><h2>{unit.id==='five-room'?'Front view residence':unit.id==='four-room'?'Rear view residence':'Garden residence'}</h2><span className={styles.statusPill}>● For sale</span></div></div>
    <dl className={styles.apartmentFacts}><div><dt>Rooms</dt><dd>{unit.rooms}</dd></div><div><dt>Level</dt><dd>{apartment?.floor.replace('Floor ','')??'—'}</dd></div><div><dt>Interior · m²</dt><dd className={styles.pendingFact}>To confirm</dd></div><div><dt>Outdoor space</dt><dd className={styles.outdoorFact}>{unit.id==='garden'?'Garden':unit.id==='five-room'?'Terrace':'Balcony'}</dd></div></dl>
    <div className={styles.detailTabs} role="tablist" aria-label="Apartment preview">{([{id:'plan',label:'Floor plan'},{id:'film',label:'Video'},{id:'images',label:'Images'},{id:'model',label:'3D'},{id:'about',label:'About'}] as const).map(tab=><button key={tab.id} role="tab" id={`${tab.id}-tab`} aria-selected={detailTab===tab.id} aria-controls="apartment-preview" onClick={()=>setDetailTab(tab.id)}>{tab.label}</button>)}</div>
    <div className={styles.previewPanel} id="apartment-preview" role="tabpanel" aria-labelledby={`${detailTab}-tab`}>
     {detailTab==='plan'&&<img src={unit.plan} alt={`${unit.title} floor plan`}/>}
     {detailTab==='film'&&<div className={styles.filmPanel}><video src="/media/residence-film.mp4" poster="/media/01_living.webp" controls playsInline muted preload="metadata"/><span>Placeholder · Mozir 8 apartment film</span></div>}
     {detailTab==='images'&&<div className={styles.galleryPanel}><div className={styles.galleryMain}><img src={`/media/${gallery[imageIndex].src}.webp`} alt={gallery[imageIndex].label}/><button className={styles.galleryPrevious} aria-label="Previous image" onClick={()=>setImageIndex(i=>(i+gallery.length-1)%gallery.length)}>‹</button><button className={styles.galleryNext} aria-label="Next image" onClick={()=>setImageIndex(i=>(i+1)%gallery.length)}>›</button></div><div className={styles.galleryCaption}><span>{gallery[imageIndex].label}</span><span>{imageIndex+1} / {gallery.length}</span></div><div className={styles.thumbnails}>{gallery.map((img,i)=><button key={img.src} aria-label={`Show ${img.label}`} aria-pressed={imageIndex===i} onClick={()=>setImageIndex(i)}><img src={`/media/${img.src}.webp`} alt="" loading="lazy"/></button>)}</div><span className={styles.mediaPlaceholder}>Placeholder · images from the Mozir 8 apartment</span></div>}
     {detailTab==='about'&&<article className={styles.aboutPanel}><h3>About this layout</h3>{unit.id==='five-room'?<><p>This five-room layout has four bedrooms and a shared living, dining and kitchen area. The long terrace runs alongside the main living space. With two bathrooms, the layout provides separate facilities for a household using several bedrooms.</p><p>One bedroom could serve as a home office or guest room, depending on your needs. When reviewing the plan, check furniture clearances, access to the terrace and the position of each bathroom relative to the bedrooms. Interior and terrace areas, parking and storage allocations still need confirmation for the selected apartment.</p></>:unit.id==='four-room'?<><p>This four-room layout includes three bedrooms, a living area with a balcony, and a separate storage room. Living, dining and kitchen functions share the main communal space; the supplied plan shows the bedroom arrangement and circulation around it.</p><p>Use the plan to check bed and wardrobe placement and whether the storage room meets your needs. Confirm the balcony dimensions and access, bathroom arrangement and any parking allocation for the selected unit. Floor level is shown separately; the current images, video and 3D model are examples from another property.</p></>:<><p>This ground-floor, four-room layout opens onto a private garden, with the living and dining areas at the centre of the home. The outdoor space is the main difference from the upper-floor layouts and is worth reviewing alongside the indoor furniture arrangement.</p><p>Check the route between the living area and garden, the boundary and privacy arrangements, and how the outdoor space can be accessed and maintained. Confirm the garden area, drainage, step-free access and any parking or storage allocation with the project team. The current images, video and 3D model are examples from another property.</p></>}</article>}
     {detailTab==='model'&&<div className={styles.modelPanel}><ApartmentViewer compact/><span className={styles.mediaPlaceholder}>Placeholder · interactive model of the Mozir 8 apartment</span></div>}
    </div>
   </aside>
  </div>
 </section></main></>;
}
