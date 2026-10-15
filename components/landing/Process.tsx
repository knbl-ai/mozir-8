'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, type Variants } from 'motion/react';
import { Check, FileText, Link2, RotateCcw } from 'lucide-react';
import Button from './Button';
import { FilmIcon, ImagesIcon, BuildingIcon, LanguagesIcon, ModelIcon, SiteIcon } from './icons';
import type { DeliverableKey, LandingCopy } from './copy';
import s from './landing.module.css';

const ICONS: [DeliverableKey, (p: { size?: number }) => React.ReactNode][] = [
 ['film', FilmIcon], ['model', ModelIcon], ['images', ImagesIcon], ['building', BuildingIcon], ['site', SiteIcon], ['languages', LanguagesIcon],
];
// The courtyard mark, split into its three blocks so it can build itself.
const BLOCKS = ['M0 26H46V108H32V127H71V166H0Z', 'M55 0H168V67H122V46H55Z', 'M122 76H168V185H97V127H122Z'];

const ease = [0.22, 1, 0.36, 1] as const;
const T = { doc: 0, progress: 0.15, wireIn: 0.7, blocks: 0.9, wireOut: 1.15, pkg: 1.2, icons: 1.3 };
const rise: Variants = { hide: { opacity: 0, y: 28 }, show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, ease, delay: d } }) };
const grow: Variants = { hide: { scaleX: 0 }, show: (d = 0) => ({ scaleX: 1, transition: { duration: 0.55, ease, delay: d } }) };
const growY: Variants = { hide: { scaleY: 0 }, show: (d = 0) => ({ scaleY: 1, transition: { duration: 0.55, ease, delay: d } }) };
const pop: Variants = { hide: { opacity: 0, scale: 0.6 }, show: (d = 0) => ({ opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 460, damping: 26, delay: d } }) };

// One plan goes in, the package comes out: plays once when it scrolls into view; Replay plays it again.
function Flow({ t }: { t: LandingCopy['process'] }) {
 const ref = useRef<HTMLDivElement>(null);
 const inView = useInView(ref, { once: true, amount: 0.25 });
 // Reduced motion: the finished diagram at once, no sequence (read after mount, so the static HTML matches).
 const [still, setStill] = useState(false);
 const [uploaded, setUploaded] = useState(false);
 useEffect(() => { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setStill(true); setUploaded(true); } }, []);
 const at = (delay: number) => (still ? 0 : delay);
 const state = inView || still ? 'show' : 'hide';

 return <motion.div ref={ref} className={s.flow} initial="hide" animate={state}>
  <div className={s.flowStep}>
   <span className={s.numeral} aria-hidden>1</span>
   <h3 className={s.stepTitle}>{t.step1.title}</h3>
   {t.step1.body && <p className={s.stepBody}>{t.step1.body}</p>}
   <motion.figure className={s.doc} variants={rise} custom={at(T.doc)}>
    <figcaption className={s.docTab}><FileText size={15} strokeWidth={1.7} aria-hidden /><span dir="ltr">{t.step1.file}</span></figcaption>
    <img src="/landing/plan.webp" alt={t.step1.planAlt} className={s.docPlan} />
    <div className={s.docUpload}>
     <span className={s.docBar}><motion.i variants={grow} custom={at(T.progress)} onAnimationComplete={def => def === 'show' && setUploaded(true)} /></span>
     <span className={s.docStatus} data-done={uploaded || undefined}>
      {uploaded ? <><Check size={13} strokeWidth={2.4} aria-hidden />{t.step1.uploaded}</> : t.step1.uploading}
     </span>
    </div>
   </motion.figure>
  </div>

  <div className={s.engine} aria-hidden>
   <span className={s.wire}><motion.i variants={grow} custom={at(T.wireIn)} /><motion.i className={s.wireY} variants={growY} custom={at(T.wireIn)} /></span>
   <motion.div className={s.node} variants={pop} custom={at(T.blocks - 0.2)}>
    <svg viewBox="-20 -20 208 225" className={s.nodeMark}>
     {BLOCKS.map((d, i) => <motion.path key={d} d={d} variants={pop} custom={at(T.blocks + i * 0.08)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />)}
    </svg>
    {t.engine.note && <motion.span className={s.nodeNote} variants={rise} custom={at(T.blocks + 0.25)}>{t.engine.note}</motion.span>}
   </motion.div>
   <span className={s.wire}><motion.i variants={grow} custom={at(T.wireOut)} /><motion.i className={s.wireY} variants={growY} custom={at(T.wireOut)} /></span>
  </div>

  <div className={s.flowStep}>
   <span className={s.numeral} aria-hidden>2</span>
   <h3 className={s.stepTitle}>{t.step2.title}</h3>
   {t.step2.body && <p className={s.stepBody}>{t.step2.body}</p>}
   <motion.ul className={s.pkg} variants={rise} custom={at(T.pkg)}>
    {ICONS.map(([key, Icon], i) => <motion.li key={key} variants={pop} custom={at(T.icons + i * 0.06)}>
     <span className={s.pkgIcon}><Icon size={44} /></span><strong>{t.icons[key]}</strong><small>{t.details[key]}</small>
    </motion.li>)}
   </motion.ul>
   <motion.div className={s.shareBar} variants={rise} custom={at(T.icons + 0.45)} aria-hidden>
    <Link2 size={16} strokeWidth={1.8} /><span dir="ltr">{t.link}</span><b>{t.share}</b>
   </motion.div>
   {t.step2.note && <motion.p className={s.stepNote} variants={rise} custom={at(T.icons + 0.55)}>{t.step2.note}</motion.p>}
  </div>
 </motion.div>;
}

export default function Process({ t }: { t: LandingCopy['process'] }) {
 const [run, setRun] = useState(0);
 return <section id="how" className={s.process} aria-labelledby="how-title">
  <div className={s.sectionHead}>
   <h2 id="how-title" className={s.sectionTitle}>{t.title}</h2>
   <Button variant="ghost" size="sm" icon={RotateCcw} onClick={() => setRun(r => r + 1)}>{t.replay}</Button>
  </div>
  <Flow key={run} t={t} />
 </section>;
}
