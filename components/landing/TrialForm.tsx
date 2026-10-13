'use client';
import { useRef, useState } from 'react';
import { Check, FileUp, X } from 'lucide-react';
import Button from './Button';
import DimensionLine from './DimensionLine';
import type { LandingCopy } from './copy';
import s from './landing.module.css';

const TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 25 * 1024 * 1024;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
type ErrorKey = keyof LandingCopy['form']['errors'];
type State = { step: 'idle' } | { step: 'uploading'; progress: number } | { step: 'sending' } | { step: 'done'; email: string };

const mb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

// PUT with progress (fetch can't report upload progress).
function put(url: string, file: File, onProgress: (share: number) => void) {
 return new Promise<boolean>(resolve => {
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', url);
  xhr.setRequestHeader('content-type', file.type);
  xhr.upload.onprogress = e => e.lengthComputable && onProgress(e.loaded / e.total);
  xhr.onload = () => resolve(xhr.status >= 200 && xhr.status < 300);
  xhr.onerror = () => resolve(false);
  xhr.send(file);
 });
}

// The demo request: the plan goes straight from the browser to storage on a signed URL, then the lead is posted.
export default function TrialForm({ t, lang }: { t: LandingCopy['form']; lang: 'en' | 'he' }) {
 const [file, setFile] = useState<File | null>(null);
 const [state, setState] = useState<State>({ step: 'idle' });
 const [error, setError] = useState<ErrorKey | null>(null);
 const [emailError, setEmailError] = useState(false);
 const [dragging, setDragging] = useState(false);
 const input = useRef<HTMLInputElement>(null);
 const busy = state.step === 'uploading' || state.step === 'sending';

 const pick = (f: File | undefined | null) => {
  if (!f) return;
  if (!TYPES.includes(f.type)) { setError('type'); return; }
  if (f.size > MAX_BYTES) { setError('size'); return; }
  setError(null);
  setFile(f);
 };

 async function submit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const email = String(data.get('email') || '').trim();
  if (!EMAIL.test(email)) { setEmailError(true); return; }
  setEmailError(false);
  setError(null);
  try {
   let planPath = '';
   if (file) {
    setState({ step: 'uploading', progress: 0 });
    const r = await fetch('/api/leads/upload-url', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size }) });
    if (!r.ok) throw (await r.json().catch(() => ({}))).error ?? 'server';
    const { url, path } = await r.json();
    if (!await put(url, file, progress => setState({ step: 'uploading', progress }))) throw 'upload';
    planPath = path;
   }
   setState({ step: 'sending' });
   const r = await fetch('/api/leads', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({
    name: data.get('name'), email, phone: data.get('phone'), description: data.get('description'), website: data.get('website'),
    planPath, planName: file?.name ?? '', lang,
   }) });
   if (!r.ok) throw (await r.json().catch(() => ({}))).error ?? 'server';
   setState({ step: 'done', email });
  } catch (err) {
   setState({ step: 'idle' });
   setError(typeof err === 'string' && err in t.errors ? err as ErrorKey : err === 'email' ? 'email' : 'server');
  }
 }

 return <section id="try" className={s.trial} aria-labelledby="try-title">
  <div className={s.trialIntro}>
   <h2 id="try-title" className={s.sectionTitle}>{t.title}</h2>
   <DimensionLine className={s.trialDim} tone="dark" />
   <p className={s.trialLede}>{t.lede}</p>
   <ul className={s.points}>{t.points.map(p => <li key={p}><Check size={16} strokeWidth={2} aria-hidden />{p}</li>)}</ul>
  </div>

  {state.step === 'done'
   ? <div className={s.formPanel} role="status">
     <svg className={s.doneIcon} viewBox="0 0 52 52" aria-hidden><circle cx="26" cy="26" r="24" /><path d="M15 27l7 7 15-16" /></svg>
     <h3 className={s.stepTitle}>{t.doneTitle}</h3>
     <p className={s.stepBody}>{t.done(state.email)}</p>
     <button type="button" className={s.linkButton} onClick={() => { setFile(null); setState({ step: 'idle' }); }}>{t.again}</button>
    </div>
   : <form className={s.formPanel} onSubmit={submit} noValidate>
     <div className={s.row}>
      <label className={s.field}><span>{t.name}</span><input name="name" autoComplete="name" maxLength={120} /></label>
      <label className={s.field}><span>{t.phone}</span><input name="phone" type="tel" autoComplete="tel" maxLength={40} dir="ltr" /></label>
     </div>
     <label className={s.field} data-invalid={emailError || undefined}>
      <span>{t.email}<b className={s.star} aria-hidden>*</b><span className={s.srOnly}> ({t.required})</span></span>
      <input name="email" type="email" autoComplete="email" required maxLength={200} dir="ltr" aria-invalid={emailError || undefined} aria-describedby={emailError ? 'email-error' : undefined} onInput={() => emailError && setEmailError(false)} />
      {emailError && <small id="email-error" className={s.fieldError}>{t.errors.email}</small>}
     </label>
     <label className={s.field}><span>{t.description}</span><textarea name="description" rows={3} maxLength={4000} placeholder={t.descriptionHint} /></label>
     <div className={s.field}>
      <span id="plan-label">{t.plan}</span>
      {file
       ? <div className={s.fileChosen}>
         <FileUp size={20} strokeWidth={1.6} aria-hidden />
         <span className={s.fileName}>{file.name}<small>{mb(file.size)}</small></span>
         <button type="button" onClick={() => input.current?.click()} className={s.linkButton}>{t.planReplace}</button>
         <button type="button" onClick={() => { setFile(null); if (input.current) input.current.value = ''; }} className={s.iconButton} aria-label={t.planRemove}><X size={16} aria-hidden /></button>
        </div>
       : <button type="button" className={s.drop} data-dragging={dragging || undefined} aria-labelledby="plan-label plan-hint"
         onClick={() => input.current?.click()}
         onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
         onDrop={e => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files[0]); }}>
         <FileUp size={22} strokeWidth={1.6} aria-hidden />
         <span>{t.planChoose}</span>
         <small id="plan-hint">{t.planHint}</small>
        </button>}
      <input ref={input} type="file" accept={TYPES.join(',')} hidden onChange={e => pick(e.target.files?.[0])} />
     </div>
     {/* Spam trap: hidden from people, filled in by bots. */}
     <input name="website" tabIndex={-1} autoComplete="off" className={s.trap} aria-hidden />
     {error && <p className={s.formError} role="alert">{t.errors[error]}</p>}
     {state.step === 'uploading' && <div className={s.uploadBar} role="progressbar" aria-label={t.uploading} aria-valuenow={Math.round(state.progress * 100)} aria-valuemin={0} aria-valuemax={100}>
      <i style={{ transform: `scaleX(${state.progress})` }} /><span>{t.uploading} · {Math.round(state.progress * 100)}%</span>
     </div>}
     <Button type="submit" tone="dark" disabled={busy} className={s.submit}>{state.step === 'uploading' ? t.uploading : state.step === 'sending' ? t.sending : t.submit}</Button>
     <p className={s.privacy}>{t.privacy}</p>
    </form>}
 </section>;
}
