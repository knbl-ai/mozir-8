'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { preload } from 'react-dom';
import { ArrowDown, ArrowRight } from 'lucide-react';
import Logo from '@/components/brand/Logo';
import { ALMA_BAY_FILMS, FILM_STYLES, type FilmCut, type FilmStyle } from '@/content/projects/alma-bay-films';
import { useInView } from './useScroll';
import s from './style.module.css';

// One film style as a standalone page, fully set in that style: the highlights film full-screen, then a pinned reveal
// (the style's word, the film showing through its letters, magnifying until the film fills the screen), the three cuts,
// the style sheet, plates and the next style. Each page can be sent on its own.

function useSolo() {
 useEffect(() => {
  const on = (e: Event) => document.querySelectorAll<HTMLVideoElement>('video[data-film]').forEach(v => { if (v !== e.target) v.pause(); });
  document.addEventListener('play', on, true);
  return () => document.removeEventListener('play', on, true);
 }, []);
}

/** muted ambient loop: clean footage of the home (no film titles), graded per style by CSS; the vertical loop on portrait
 *  screens, the 16:9 loop elsewhere; starts once on screen */
const LOOP = { wide: { src: '/projects/shirat-hayam/highlights/hero.mp4', poster: '/projects/shirat-hayam/highlights/hero-poster.jpg' },
 tall: { src: '/projects/shirat-hayam/highlights/hero-916.mp4', poster: '/projects/shirat-hayam/highlights/hero-916-poster.jpg' } };
function Ambient({ className, start = 0, slug }: { className?: string; start?: number; slug?: string }) {
 const ref = useRef<HTMLVideoElement>(null);
 const seen = useInView(ref, '0px');
 const [tall, setTall] = useState(false);
 useEffect(() => {
  const mq = window.matchMedia('(max-aspect-ratio: 4/5)');
  const pick = () => setTall(mq.matches);
  pick(); mq.addEventListener('change', pick); return () => mq.removeEventListener('change', pick);
 }, []);
 const loop = tall ? LOOP.tall : LOOP.wide;
 const at = !tall ? start : TALL_START[start] ?? 0;
 // the server-rendered hero may have its metadata before React attaches handlers: seek once mounted too
 useEffect(() => { const v = ref.current; if (v && at && v.readyState >= 1 && Math.abs(v.currentTime - at) > 0.5) v.currentTime = at % v.duration; }, [at]);
 // the hero (slug given) loads at once and shows its own first frame as the poster, so the opening's letters show the
 // right picture from the first paint; other loops wait until seen
 const poster = slug ? `/projects/shirat-hayam/highlights/hero-${tall ? '916-' : ''}${slug}.jpg` : loop.poster;
 if (slug) preload(poster, { as: 'image', fetchPriority: 'high' });
 const [ready, setReady] = useState(!slug);
 const video = <video ref={ref} className={`${className ?? ''} ${s.graded}`} src={slug || seen ? loop.src : undefined} poster={poster} autoPlay muted loop playsInline aria-hidden
  preload={slug ? 'auto' : 'metadata'} style={slug ? { opacity: ready ? 1 : 0 } : undefined}
  onSeeked={() => setReady(true)} onPlaying={e => { if (!at || Math.abs(e.currentTarget.currentTime - at) < 1) setReady(true); }}
  onLoadedMetadata={e => { const v = e.currentTarget; if (at) v.currentTime = at % v.duration; }} />;
 // the hero: its own still sits under the film until the film is at the right moment (no flash of another room)
 return slug ? <><img src={poster} alt="" className={`${className ?? ''} ${s.graded}`} aria-hidden />{video}</> : video;
}

// where each style's hero loop starts (s into the clean loop): Riviera on the sea, Monograph the kitchen, Sunday the bedroom
const HERO_START: Record<string, number> = { 'riviera-editorial': 12.2, monograph: 5.55, 'sunday-house': 16.2 };  // just after a cut in hero.mp4
// the same moments in the vertical loop (1.5 s per shot: kitchen 0, balcony 7.5, master bed 9.0)
const TALL_START: Record<number, number> = { 12.2: 7.55, 5.55: 0.05, 16.2: 9.05 };

function Film({ cut, name, big }: { cut: FilmCut; name: string; big?: boolean }) {
 return <figure className={s.film} data-phone={cut.aspect === '9:16' || undefined} data-big={big || undefined}>
  <div className={s.frame}><video data-film src={cut.src} poster={cut.poster} controls playsInline preload="none" aria-label={`${name} — ${cut.label}, ${cut.length}`} /></div>
  <figcaption className={s.cap}><span>{cut.label}</span><span>{cut.aspect} · {cut.length}</span></figcaption>
 </figure>;
}

/** The opening: the style's word in huge type over a solid sheet, the page's hero film showing through its letters,
 *  pushing in from the first frame in one continuous move until the film fills the screen and the sheet is gone.
 *  The move is a CSS animation of the whole sheet (scaling the sheet around the word = magnifying the word), so it starts
 *  with the first paint (SVG/SMIL waits for the page's load event) and runs on the compositor; keyframes follow an
 *  exponential scale (constant perceived speed). React removes the layer once it has played.
 *  Hidden with reduced motion (CSS). */
const OPEN_MS = 1600;
function Intro({ st, onDone }: { st: FilmStyle; onDone: () => void }) {
 useEffect(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { onDone(); return; }
  const t = window.setTimeout(onDone, OPEN_MS);
  return () => clearTimeout(t);
 }, [onDone]);
 const id = `m-${st.slug}`;
 return <div className={s.opening} aria-hidden>
  <svg className={s.revealMask} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" style={{ animationDuration: `${OPEN_MS}ms` }}>
   <defs>
    <mask id={id} maskUnits="userSpaceOnUse" x="-1600" y="-900" width="4800" height="2700">
     <rect x="-1600" y="-900" width="4800" height="2700" fill="#fff" />
     <text x="800" y="500" textAnchor="middle" textLength="1360" lengthAdjust="spacingAndGlyphs" className={s.revealWord}>{st.maskWord}</text>
    </mask>
   </defs>
   <rect x="-1600" y="-900" width="4800" height="2700" className={s.revealPaper} mask={`url(#${id})`} />
  </svg>
  <p className={s.revealUnder}>{ALMA_BAY_FILMS.title}</p>
 </div>;
}

export default function StylePage({ slug }: { slug: string }) {
 useSolo();
 const st = FILM_STYLES.find(x => x.slug === slug)!;
 const i = FILM_STYLES.indexOf(st);
 const next = FILM_STYLES[(i + 1) % FILM_STYLES.length];
 const [long, short, phone] = st.cuts;
 const A = ALMA_BAY_FILMS;
 const [scrolled, setScrolled] = useState(false);
 const [opening, setOpening] = useState(true);
 const done = useCallback(() => setOpening(false), []);
 useEffect(() => { const on = () => setScrolled(window.scrollY > 40); on(); window.addEventListener('scroll', on, { passive: true }); return () => window.removeEventListener('scroll', on); }, []);

 return <main className={s.page} data-style={st.slug} data-opening={opening || undefined}>
  {opening && <Intro st={st} onDone={done} />}
  <nav className={s.bar} data-solid={scrolled || undefined}>
   <Link href="/" className={s.logo} aria-label="residence.tech"><Logo /></Link>
   <ul className={s.tabs}>{FILM_STYLES.map(x => <li key={x.slug}><Link href={`/alma-bay/films/${x.slug}`} aria-current={x.slug === slug ? 'page' : undefined}>{x.name}</Link></li>)}</ul>
   <Link href="/alma-bay/films" className={s.all}>All styles</Link>
  </nav>

  <header className={s.hero}>
   <Ambient className={s.heroVideo} start={HERO_START[st.slug]} slug={st.slug} />
   <div className={s.heroShade} />
   <div className={s.heroText}>
    <p className={s.kicker}><span>{st.no}</span>{A.title}</p>
    <h1 className={s.h1}>{st.name}</h1>
    <p className={s.tagline}>{st.tagline}</p>
   </div>
   {st.slug === 'monograph' && <dl className={s.titleBlock}><div><dt>Project</dt><dd>Alma Bay</dd></div><div><dt>Unit</dt><dd>01</dd></div><div><dt>Sheet</dt><dd>A-000</dd></div><div><dt>Scale</dt><dd>1:50</dd></div></dl>}
   <a href="#film" className={s.cue}><ArrowDown size={16} aria-hidden />Scroll</a>
  </header>

  <section className={s.intro}>
   <p className={s.lede}>{st.concept}</p>
   <ul className={s.stats}>{A.stats.map(x => <li key={x.label}><b>{x.value}<small>{x.unit}</small></b><span>{x.label}</span></li>)}</ul>
  </section>

  <section className={s.section} id="film">
   <p className={s.mark}>{st.marks[0]}</p>
   <Film cut={long} name={st.name} big />
  </section>

  <section className={s.section}>
   <p className={s.mark}>{st.marks[1]}</p>
   <div className={s.pair}><Film cut={short} name={st.name} /><Film cut={phone} name={st.name} /></div>
  </section>

  <section className={s.section}>
   <p className={s.mark}>{st.marks[2]}</p>
   <div className={s.sheet}>
    <div className={s.block}><h3>Palette</h3><ul className={s.swatches}>{st.palette.map(c => <li key={c.hex}><i style={{ background: c.hex }} /><span>{c.name}</span><code>{c.hex}</code></li>)}</ul></div>
    <div className={s.block}><h3>Type</h3><p className={s.specD}>Aa</p><p className={s.specName}>{st.type.display}</p><p className={s.specT}>147.3 m² · 5 rooms · floor 25</p><p className={s.specName}>{st.type.text}</p></div>
    <div className={s.block}><h3>Rhythm</h3><dl className={s.facts}>{st.facts.map(f => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}</dl></div>
    <div className={s.block}><h3>Motion</h3><ul className={s.list}>{st.motion.map(m => <li key={m}>{m}</li>)}</ul></div>
    <div className={s.block} data-wide><h3>Music</h3><p>{st.music}</p><h3>Cuts</h3><p>{st.transitions}</p></div>
   </div>
  </section>

  <section className={s.section}>
   <p className={s.mark}>{st.marks[3]}</p>
   <div className={s.plates}>{st.examples.map((e, k) => <figure key={e.src} className={s.plate} data-k={k}><img src={e.src} alt={e.caption} width={960} height={540} loading="lazy" /><figcaption>{e.caption}</figcaption></figure>)}</div>
  </section>

  <Link href={`/alma-bay/films/${next.slug}`} className={s.next} data-next={next.slug}>
   <img src={`/projects/shirat-hayam/highlights/next-${next.slug}.jpg`} alt="" />
   <span className={s.nextLabel}>Next style · {next.no}</span>
   <span className={s.nextName}>{next.name}<ArrowRight size={28} aria-hidden /></span>
  </Link>

  <footer className={s.foot}>
   <Logo />
   <p>Films made with residence.tech from the floor plan and the approved images of Alma Bay · Residence 01. Walking times are routed on OpenStreetMap from the building.</p>
   <Link href="/alma-bay">Alma Bay — all residences</Link>
  </footer>
 </main>;
}
