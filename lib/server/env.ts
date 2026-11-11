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
 // clients' files (plans, building sheets, references): a bucket with public access blocked (the media bucket is public)
 privateBucket: () => process.env.GCS_PRIVATE_BUCKET || 'knbl-apt3d-private',
 // signs the intake-form links (/start/<order>.<sig>), same value in the bridge's .env
 orderFormSecret: () => need('ORDER_FORM_SECRET'),
 // signs the team's links to private files (/api/files?p=…&t=…), e.g. the plan cell in the leads sheet
 fileLinkSecret: () => process.env.FILE_LINK_SECRET || need('ORDER_FORM_SECRET'),
 leadsPrefix: () => (process.env.LEADS_PREFIX || 'apt3d/leads').replace(/\/+$/, ''),
 leadsFrom: () => process.env.LEADS_FROM || 'ai@kanibal.co.il',  // info@residence.tech once its mail authentication (DKIM) is set up
 leadsNotify: () => (process.env.LEADS_NOTIFY || 'ravit@kanibal.co.il,vladi@kanibal.co.il,raz@kanibal.co.il').split(',').map(s => s.trim()).filter(Boolean),
 leadsSheet: () => process.env.LEADS_SHEET_ID || '',  // Google Sheet the leads are copied to (shared with the service account); empty = off
 google: () => ({
  projectId: need('GCLOUD_PROJECT_ID'),
  clientEmail: need('GCLOUD_CLIENT_EMAIL'),
  privateKey: need('GCLOUD_PRIVATE_KEY').replace(/\\n/g, '\n'),
 }),
};
