'use client';
import { useEffect, useRef, useState } from 'react';
import { Check, FileUp, Loader2, X } from 'lucide-react';
import type { FormOrder } from '@/lib/server/orders';
import s from './start.module.css';

// The intake form of a client order (app/start/[token]): only the floor plan is required; everything else makes the
// page richer. Files go straight from the browser to the private bucket on signed URLs, then the answers are posted.
type Kind = 'plan' | 'building' | 'reference';
type Up = { id: string; kind: Kind; name: string; size: number; progress: number; path?: string; failed?: boolean };
const TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const MAX = 25 * 1024 * 1024;

const T = {
 en: {
  kicker: 'YOUR APARTMENT PAGE', title: 'Tell us about the apartment',
  lead: 'Only the floor plan is required. Everything else is optional — the more you add, the richer and more accurate your page: films, photoreal images, an interactive plan, a 3D model, the neighbourhood map, and a download of every file.',
  plan: 'Floor plan', planHint: 'PDF or image. Several floors? Add each one.', required: 'required',
  planHave: (n: number) => `${n} plan file${n > 1 ? 's' : ''} already received in WhatsApp — add more only if something is missing.`,
  address: 'Address', addressHint: 'For the map, the neighbourhood and the view from the windows.',
  dev: 'Developer website', devHint: 'We use it for the building’s facts and look.',
  building: 'Building plans, renders or photos', buildingHint: 'Façade, lobby, pool, the building plan — whatever you have.',
  refs: 'Interior design references', refsHint: 'Photos you like, or links (Pinterest, Instagram, a designer’s site).', linkPh: 'https://…', addLink: 'Add link',
  audience: 'Who are the buyers?', audiencePh: 'e.g. young families, investors, retirees',
  langs: 'Languages of the page', other: 'Other (e.g. Portuguese, French)',
  contact: 'Contact shown on the page', contactHint: 'The agent or developer buyers should reach. Leave empty for none.',
  name: 'Name', phone: 'Phone', email: 'Email', company: 'Company',
  notes: 'Anything else', notesPh: 'What makes this apartment special, what to highlight, what to avoid…',
  drop: 'Choose files or drop them here', send: 'Send', sending: 'Sending…', uploading: 'Uploading…',
  needPlan: 'Please add the floor plan.', badType: 'PDF, JPG, PNG or WebP only.', tooBig: 'Up to 25 MB per file.', failed: 'Upload failed — try again.',
  error: 'Something went wrong. Please try again, or send the files in WhatsApp.',
  closed: 'This order is already in production, so its details can’t change here. Write to us in WhatsApp.',
  done: 'Thank you — we have it all.', doneLead: 'We’ll continue in WhatsApp in a moment.', back: 'Back to WhatsApp',
  L: { en: 'English', he: 'Hebrew', ru: 'Russian', fr: 'French', ar: 'Arabic' } as Record<string, string>,
 },
 he: {
  kicker: 'עמוד הדירה שלכם', title: 'ספרו לנו על הדירה',
  lead: 'רק תוכנית הדירה חובה. כל השאר רשות — ככל שתוסיפו יותר, העמוד יהיה עשיר ומדויק יותר: סרטים, תמונות פוטוריאליסטיות, תוכנית אינטראקטיבית, מודל תלת־ממד, מפת שכונה והורדה של כל הקבצים.',
  plan: 'תוכנית הדירה', planHint: 'PDF או תמונה. כמה קומות? צרפו כל אחת.', required: 'חובה',
  planHave: (n: number) => `קיבלנו כבר ${n} קבצי תוכנית בוואטסאפ — הוסיפו רק אם משהו חסר.`,
  address: 'כתובת', addressHint: 'למפה, לשכונה ולנוף מהחלונות.',
  dev: 'אתר היזם', devHint: 'משמש לנתוני הבניין ולמראה שלו.',
  building: 'תוכניות, הדמיות או תמונות של הבניין', buildingHint: 'חזית, לובי, בריכה, תוכנית הבניין — מה שיש.',
  refs: 'השראה לעיצוב פנים', refsHint: 'תמונות שאתם אוהבים, או קישורים (פינטרסט, אינסטגרם, אתר של מעצב).', linkPh: 'https://…', addLink: 'הוספת קישור',
  audience: 'מי הקונים?', audiencePh: 'למשל משפחות צעירות, משקיעים, גמלאים',
  langs: 'שפות העמוד', other: 'אחר (למשל פורטוגזית, צרפתית)',
  contact: 'איש קשר בעמוד', contactHint: 'הסוכן או היזם שהקונים יפנו אליו. השאירו ריק אם אין.',
  name: 'שם', phone: 'טלפון', email: 'אימייל', company: 'חברה',
  notes: 'עוד משהו', notesPh: 'מה מיוחד בדירה, מה להדגיש, ממה להימנע…',
  drop: 'בחרו קבצים או גררו לכאן', send: 'שליחה', sending: 'שולחים…', uploading: 'מעלים…',
  needPlan: 'נא לצרף את תוכנית הדירה.', badType: 'רק PDF, JPG, PNG או WebP.', tooBig: 'עד 25MB לקובץ.', failed: 'ההעלאה נכשלה — נסו שוב.',
  error: 'משהו השתבש. נסו שוב, או שלחו את הקבצים בוואטסאפ.',
  closed: 'ההזמנה כבר בעבודה, ולכן אי אפשר לשנות כאן את הפרטים. כתבו לנו בוואטסאפ.',
  done: 'תודה — קיבלנו הכול.', doneLead: 'נמשיך בוואטסאפ בעוד רגע.', back: 'חזרה לוואטסאפ',
  L: { en: 'אנגלית', he: 'עברית', ru: 'רוסית', fr: 'צרפתית', ar: 'ערבית' } as Record<string, string>,
 },
};

const mb = (b: number) => `${(b / 1048576).toFixed(1)} MB`;
function put(url: string, file: File, on: (p: number) => void) {
 return new Promise<boolean>(resolve => {
  const x = new XMLHttpRequest();
  x.open('PUT', url);
  x.setRequestHeader('content-type', file.type);
  x.setRequestHeader('x-goog-content-length-range', `0,${MAX}`);   // signed into the URL (lib/server/storage.ts SIZE_RANGE)
  x.upload.onprogress = e => e.lengthComputable && on(e.loaded / e.total);
  x.onload = () => resolve(x.status >= 200 && x.status < 300);
  x.onerror = () => resolve(false);
  x.send(file);
 });
}
// Language names for "other" in the order's language list: a few common ones map to codes; the rest are skipped
// (the concierge asks in the chat).
const OTHER: Record<string, string> = { portuguese: 'pt', português: 'pt', פורטוגזית: 'pt', french: 'fr', français: 'fr', צרפתית: 'fr', russian: 'ru', русский: 'ru', רוסית: 'ru',
 arabic: 'ar', ערבית: 'ar', spanish: 'es', español: 'es', ספרדית: 'es', german: 'de', deutsch: 'de', גרמנית: 'de', italian: 'it', איטלקית: 'it', greek: 'el', יוונית: 'el' };

export default function IntakeForm({ token, order, wa }: { token: string; order: Omit<FormOrder, 'id'> & { open: boolean }; wa: string }) {
 const L = order.lang === 'he' ? 'he' : 'en';
 const t = T[L];
 const i = order.intake;
 const [ups, setUps] = useState<Up[]>([]);
 const [links, setLinks] = useState<string[]>(i.referenceLinks?.length ? i.referenceLinks : ['']);
 const [langs, setLangs] = useState<string[]>(order.languages.length ? order.languages : [L]);
 const [other, setOther] = useState('');
 const [err, setErr] = useState<string | null>(null);
 const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
 const files = useRef(new Map<string, File>());
 useEffect(() => { document.documentElement.lang = L; document.documentElement.dir = L === 'he' ? 'rtl' : 'ltr'; }, [L]);

 const uploading = ups.some(u => !u.path && !u.failed);
 async function add(kind: Kind, list: FileList | null) {
  for (const f of Array.from(list ?? [])) {
   if (!TYPES.includes(f.type)) { setErr(t.badType); continue; }
   if (f.size > MAX) { setErr(t.tooBig); continue; }
   setErr(null);
   const id = crypto.randomUUID();
   files.current.set(id, f);
   setUps(u => [...u, { id, kind, name: f.name, size: f.size, progress: 0 }]);
   const set = (p: Partial<Up>) => setUps(u => u.map(x => x.id === id ? { ...x, ...p } : x));
   try {
    const r = await fetch('/api/start/upload-url', { method: 'POST', headers: { 'content-type': 'application/json' },
     body: JSON.stringify({ token, kind, filename: f.name, contentType: f.type, size: f.size }) });
    const j = await r.json();
    if (!r.ok) { set({ failed: true }); setErr(j.error === 'closed' ? t.closed : t.failed); continue; }
    const ok = await put(j.url, f, p => set({ progress: p }));
    set(ok ? { path: j.path, progress: 1 } : { failed: true });
    if (!ok) setErr(t.failed);
   } catch { set({ failed: true }); setErr(t.failed); }
  }
 }

 async function submit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const d = new FormData(e.currentTarget);
  const done = ups.filter(u => u.path);
  if (!i.planCount && !done.some(u => u.kind === 'plan')) { setErr(t.needPlan); return; }
  const extra = other.split(/[,،]/).map(x => OTHER[x.trim().toLowerCase()]).filter(Boolean);
  setState('sending'); setErr(null);
  const body = {
   token, files: done.map(u => ({ kind: u.kind, path: u.path })),
   address: d.get('address'), developerUrl: d.get('developerUrl'), audience: d.get('audience'), notes: d.get('notes'),
   referenceLinks: links.map(x => x.trim()).filter(Boolean), languages: [...new Set([...langs, ...extra])],
   contactOnPage: { name: d.get('cname'), phone: d.get('cphone'), email: d.get('cemail'), company: d.get('ccompany') },
  };
  try {
   const r = await fetch('/api/start/submit', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
   if (r.ok) { setState('done'); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
   const j = await r.json().catch(() => ({}));
   setErr(j.error === 'closed' ? t.closed : j.error === 'plan' ? t.needPlan : t.error);
  } catch { setErr(t.error); }
  setState('idle');
 }

 const back = wa ? <a className={s.primary} href={`https://wa.me/${wa.replace(/\D/g, '')}`}>{t.back}</a> : null;
 if (state === 'done' || !order.open) return (
  <main className={s.page} dir={L === 'he' ? 'rtl' : 'ltr'}>
   <section className={s.card}>
    <p className={s.kicker}>{t.kicker}</p>
    <h1 className={s.title}>{state === 'done' ? t.done : t.title}</h1>
    <p className={s.lead}>{state === 'done' ? t.doneLead : t.closed}</p>
    {back}
   </section>
  </main>
 );

 const zone = (kind: Kind, multiple = true) => (
  <>
   <label className={s.drop} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); void add(kind, e.dataTransfer.files); }}>
    <FileUp size={18} aria-hidden /><span>{t.drop}</span>
    <input type="file" accept={TYPES.join(',')} multiple={multiple} onChange={e => { void add(kind, e.target.files); e.target.value = ''; }} />
   </label>
   {ups.filter(u => u.kind === kind).map(u => (
    <div key={u.id} className={s.file} data-failed={u.failed || undefined}>
     {u.path ? <Check size={14} aria-hidden /> : u.failed ? <X size={14} aria-hidden /> : <Loader2 size={14} className={s.spin} aria-hidden />}
     <span className={s.fileName}>{u.name}</span>
     <span className={s.fileSize}><bdi dir="ltr">{u.path ? mb(u.size) : u.failed ? '' : `${Math.round(u.progress * 100)}%`}</bdi></span>
     <button type="button" aria-label="remove" onClick={() => setUps(x => x.filter(y => y.id !== u.id))}><X size={14} /></button>
    </div>
   ))}
  </>
 );

 return (
  <main className={s.page} dir={L === 'he' ? 'rtl' : 'ltr'}>
   <form className={s.card} onSubmit={submit} noValidate>
    <p className={s.kicker}>{t.kicker}</p>
    <h1 className={s.title}>{t.title}</h1>
    <p className={s.lead}>{t.lead}</p>

    <fieldset className={s.block}>
     <legend>{t.plan} <em>{t.required}</em></legend>
     <p className={s.hint}>{i.planCount ? t.planHave(i.planCount) : t.planHint}</p>
     {zone('plan')}
    </fieldset>

    <fieldset className={s.block}>
     <legend>{t.address}</legend>
     <p className={s.hint}>{t.addressHint}</p>
     <input name="address" defaultValue={i.address} maxLength={300} autoComplete="street-address" />
    </fieldset>

    <fieldset className={s.block}>
     <legend>{t.dev}</legend>
     <p className={s.hint}>{t.devHint}</p>
     <input name="developerUrl" type="url" dir="ltr" placeholder="https://" defaultValue={i.developerUrl} maxLength={500} />
    </fieldset>

    <fieldset className={s.block}>
     <legend>{t.building}</legend>
     <p className={s.hint}>{t.buildingHint}</p>
     {zone('building')}
    </fieldset>

    <fieldset className={s.block}>
     <legend>{t.refs}</legend>
     <p className={s.hint}>{t.refsHint}</p>
     {zone('reference')}
     {links.map((v, n) => <input key={n} type="url" dir="ltr" placeholder={t.linkPh} value={v} maxLength={500}
      onChange={e => setLinks(l => l.map((x, k) => k === n ? e.target.value : x))} />)}
     {links.length < 20 && <button type="button" className={s.ghost} onClick={() => setLinks(l => [...l, ''])}>+ {t.addLink}</button>}
    </fieldset>

    <fieldset className={s.block}>
     <legend>{t.audience}</legend>
     <input name="audience" placeholder={t.audiencePh} defaultValue={i.audience} maxLength={500} />
    </fieldset>

    <fieldset className={s.block}>
     <legend>{t.langs}</legend>
     <div className={s.chips}>
      {[...new Set(['he', 'en', 'ru', 'fr', 'ar', ...order.languages])].map(code => (
       <label key={code} className={s.chip} data-on={langs.includes(code) || undefined}>
        <input type="checkbox" checked={langs.includes(code)} onChange={e => setLangs(l => e.target.checked ? [...l, code] : l.filter(x => x !== code))} />
        {t.L[code] ?? code.toUpperCase()}
       </label>
      ))}
     </div>
     <input placeholder={t.other} value={other} onChange={e => setOther(e.target.value)} maxLength={120} />
    </fieldset>

    <fieldset className={s.block}>
     <legend>{t.contact}</legend>
     <p className={s.hint}>{t.contactHint}</p>
     <div className={s.grid}>
      <input name="cname" placeholder={t.name} defaultValue={i.contactOnPage?.name} maxLength={120} autoComplete="name" />
      <input name="ccompany" placeholder={t.company} defaultValue={i.contactOnPage?.company} maxLength={120} autoComplete="organization" />
      <input name="cphone" type="tel" dir="ltr" placeholder={t.phone} defaultValue={i.contactOnPage?.phone} maxLength={40} autoComplete="tel" />
      <input name="cemail" type="email" dir="ltr" placeholder={t.email} defaultValue={i.contactOnPage?.email} maxLength={200} autoComplete="email" />
     </div>
    </fieldset>

    <fieldset className={s.block}>
     <legend>{t.notes}</legend>
     <textarea name="notes" rows={4} placeholder={t.notesPh} defaultValue={i.notes} maxLength={2000} />
    </fieldset>

    {err && <p className={s.error} role="alert">{err}</p>}
    <button className={s.primary} type="submit" disabled={state === 'sending' || uploading}>
     {uploading ? t.uploading : state === 'sending' ? t.sending : t.send}
    </button>
   </form>
  </main>
 );
}
