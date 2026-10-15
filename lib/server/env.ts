import 'server-only';

// Server-side settings for the landing form (lead capture). Read lazily so a build without them still works.
function need(name: string): string {
 const value = process.env[name];
 if (!value) throw new Error(`Missing env ${name}`);
 return value;
}

export const env = {
 mongoUri: () => need('MONGODB_URI'),
 mongoDb: () => process.env.MONGODB_DB || 'apt3d',
 bucket: () => process.env.GCS_BUCKET || 'knbl-sma',
 leadsPrefix: () => (process.env.LEADS_PREFIX || 'apt3d/leads').replace(/\/+$/, ''),
 leadsFrom: () => process.env.LEADS_FROM || 'info@residence.tech',
 leadsNotify: () => (process.env.LEADS_NOTIFY || 'ravit@kanibal.co.il,vladi@kanibal.co.il,raz@kanibal.co.il').split(',').map(s => s.trim()).filter(Boolean),
 google: () => ({
  projectId: need('GCLOUD_PROJECT_ID'),
  clientEmail: need('GCLOUD_CLIENT_EMAIL'),
  privateKey: need('GCLOUD_PRIVATE_KEY').replace(/\\n/g, '\n'),
 }),
};
