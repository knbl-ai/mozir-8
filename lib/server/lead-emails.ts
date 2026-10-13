import 'server-only';
import type { Lead } from './mongo';
import type { Mail } from './gmail';

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const GREEN = '#173F32';

function frame(body: string, dir: 'ltr' | 'rtl') {
 return `<!doctype html><html dir="${dir}"><body style="margin:0;background:#f6f5f1;font-family:Helvetica,Arial,sans-serif;color:#1d211f">
<div style="max-width:560px;margin:0 auto;padding:40px 28px;text-align:${dir === 'rtl' ? 'right' : 'left'}">
<p style="margin:0 0 32px;font-size:22px;font-weight:600;color:${GREEN};letter-spacing:-0.01em" dir="ltr">residence<span style="color:#90958F;font-weight:300">.tech</span></p>
${body}
</div></body></html>`;
}

const userCopy = {
 en: {
  subject: 'We got your floor plan — residence.tech',
  hello: (n: string) => `Hi ${n},`,
  body: ['Thanks for requesting a residence.tech demo. Your request has reached our team.', 'We’ll review your plan and get back to you shortly to set up your demo.'],
  sign: 'The residence.tech team',
 },
 he: {
  subject: 'קיבלנו את התוכנית שלך — residence.tech',
  hello: (n: string) => `שלום ${n},`,
  body: ['תודה שביקשת הדגמה של residence.tech. הבקשה שלך הגיעה לצוות שלנו.', 'נעבור על התוכנית ונחזור אליך בקרוב כדי לתאם את ההדגמה.'],
  sign: 'צוות residence.tech',
 },
};

export function userMail(lead: Lead): Mail {
 const t = userCopy[lead.lang];
 const name = lead.name || (lead.lang === 'he' ? 'שלום' : 'there');
 const paras = [t.hello(name), ...t.body];
 return {
  to: [lead.email],
  fromName: 'residence.tech',
  subject: t.subject,
  text: [...paras, '', t.sign].join('\n\n'),
  html: frame(`${paras.map(p => `<p style="margin:0 0 16px;font-size:16px;line-height:1.6">${esc(p)}</p>`).join('')}
<p style="margin:32px 0 0;font-size:15px;color:#5b615d">${esc(t.sign)}</p>`, lead.lang === 'he' ? 'rtl' : 'ltr'),
 };
}

export function teamMail(lead: Lead, to: string[], planUrl: string | null): Mail {
 const rows: [string, string][] = [
  ['Name', lead.name || '—'], ['Email', lead.email], ['Phone', lead.phone || '—'], ['Language', lead.lang],
  ['Description', lead.description || '—'],
  ['Plan', lead.plan ? `${lead.plan.filename} (${(lead.plan.size / 1024 / 1024).toFixed(1)} MB)` : '—'],
  ['Received', lead.createdAt.toISOString()],
 ];
 const link = planUrl ? `<p style="margin:24px 0 0"><a href="${esc(planUrl)}" style="display:inline-block;background:${GREEN};color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;font-size:14px">Download the plan</a><br><span style="font-size:12px;color:#7a807c">Link valid for 7 days · gs://${esc(lead.plan!.path)}</span></p>` : '';
 return {
  to,
  replyTo: lead.email,
  fromName: 'residence.tech leads',
  subject: `New demo request: ${lead.name || lead.email}`,
  text: [...rows.map(([k, v]) => `${k}: ${v}`), planUrl ? `\nPlan (7 days): ${planUrl}` : ''].join('\n'),
  html: frame(`<p style="margin:0 0 20px;font-size:18px;font-weight:600">New demo request</p>
<table style="border-collapse:collapse;width:100%;font-size:15px">${rows.map(([k, v]) => `<tr><td style="padding:8px 16px 8px 0;color:#7a807c;vertical-align:top;white-space:nowrap">${k}</td><td style="padding:8px 0;white-space:pre-wrap">${esc(v)}</td></tr>`).join('')}</table>${link}`, 'ltr'),
 };
}
