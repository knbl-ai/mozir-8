import { JWT } from 'google-auth-library';
import { env } from './env';
import type { Lead } from './mongo';

const API = 'https://sheets.googleapis.com/v4/spreadsheets';
const HEADER = ['Time (UTC)', 'Name', 'Email', 'Phone', 'Description', 'Plan file', 'Plan path', 'Lang', 'Source', 'First source', 'First medium', 'First campaign', 'First landing page', 'Last source', 'Last medium', 'Last campaign', 'Last landing page', 'Click id', 'Referrer', 'Lead id'];

let client: JWT | null = null;
let headed = false;
const jwt = () => {
 if (!client) {
  const { clientEmail, privateKey } = env.google();
  client = new JWT({ email: clientEmail, key: privateKey, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
 }
 return client;
};

const row = (lead: Lead, id: string) => {
 const f = lead.attribution?.first, l = lead.attribution?.last;
 const clickId = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid', 'ttclid', 'li_fat_id'].map(k => l?.params[k] || f?.params[k]).find(Boolean) || '';
 return [lead.createdAt.toISOString(), lead.name, lead.email, lead.phone, lead.description, lead.plan?.filename || '', lead.plan?.path || '', lead.lang, lead.source,
  f?.params.utm_source || '', f?.params.utm_medium || '', f?.params.utm_campaign || '', f?.landingPage || '',
  l?.params.utm_source || '', l?.params.utm_medium || '', l?.params.utm_campaign || '', l?.landingPage || '', clickId, l?.referrer || f?.referrer || '', id];
};

// A cell starting with = + - @ would run as a formula in the sheet; keep the text a literal.
const safe = (v: string) => /^[=+\-@]/.test(v) ? `'${v}` : v;

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
  data: { values: items.map(({ lead, id }) => row(lead, id).map(safe)) },
 });
}
