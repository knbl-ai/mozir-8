import { JWT } from 'google-auth-library';
import { env } from './env';
import type { Lead } from './mongo';

const API = 'https://sheets.googleapis.com/v4/spreadsheets';
const HEADER = ['Time (Israel)', 'Name', 'Email', 'Phone', 'Description', 'Plan file', 'Lang', 'First source', 'First medium', 'Last source', 'Last medium', 'Referrer', 'Status'];

let client: JWT | null = null;
let headed = false;
const jwt = () => {
 if (!client) {
  const { clientEmail, privateKey } = env.google();
  client = new JWT({ email: clientEmail, key: privateKey, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
 }
 return client;
};

// 12/10/2026 23:57, Israel time
export const when = (d: Date) => new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jerusalem', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(d).replace(',', '');

// With USER_ENTERED a cell starting with = + - @ would run as a formula, and 12/10/2026 would turn into a date; the ' keeps the text as written.
const text = (v: string) => /^[=+\-@]/.test(v) ? `'${v}` : v;
// The plan sits in the public bucket under an unguessable path, so the link never expires.
export const planCell = (plan: Lead['plan']) => plan ? `=HYPERLINK("https://storage.googleapis.com/${env.bucket()}/${encodeURI(plan.path)}","${plan.filename.replace(/"/g, '""')}")` : '';

// Status stays empty: the team fills it in the sheet.
const row = (lead: Lead) => {
 const f = lead.attribution?.first, l = lead.attribution?.last;
 return [`'${when(lead.createdAt)}`, ...[lead.name, lead.email, lead.phone, lead.description].map(text), planCell(lead.plan), lead.lang,
  ...[f?.params.utm_source, f?.params.utm_medium, l?.params.utm_source, l?.params.utm_medium, l?.referrer || f?.referrer].map(v => text(v || '')), ''];
};

async function ensureHeader(id: string) {
 if (headed) return;
 const { data } = await jwt().request<{ values?: string[][] }>({ url: `${API}/${id}/values/A1:A1` });
 if (!data.values?.[0]?.[0]) await jwt().request({ url: `${API}/${id}/values/A1?valueInputOption=RAW`, method: 'PUT', data: { values: [HEADER] } });
 headed = true;
}

/** Appends leads as rows to the sheet in LEADS_SHEET_ID. */
export async function appendLeads(items: { lead: Lead; id: string }[]) {
 const sheet = env.leadsSheet();
 if (!sheet || !items.length) return;
 await ensureHeader(sheet);
 await jwt().request({
  url: `${API}/${sheet}/values/A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
  method: 'POST',
  data: { values: items.map(({ lead }) => row(lead)) },
 });
}
