import 'server-only';
import { JWT } from 'google-auth-library';
import { env } from './env';

// Sends through the Gmail API as `from`, using the poetic-analog service account's domain-wide delegation
// (same approach as social_media_agent's gmailService.js).
export type Mail = { to: string[]; subject: string; html: string; text: string; replyTo?: string; fromName?: string };

const b64 = (s: string) => Buffer.from(s, 'utf8').toString('base64');
const header = (s: string) => /^[\x20-\x7e]*$/.test(s) ? s : `=?UTF-8?B?${b64(s)}?=`;

function mime(from: string, mail: Mail) {
 const boundary = `b_${crypto.randomUUID()}`;
 const lines = [
  `From: ${mail.fromName ? `${header(mail.fromName)} <${from}>` : from}`,
  `To: ${mail.to.join(', ')}`,
  ...(mail.replyTo ? [`Reply-To: ${mail.replyTo}`] : []),
  `Subject: ${header(mail.subject)}`,
  'MIME-Version: 1.0',
  `Content-Type: multipart/alternative; boundary="${boundary}"`,
  '',
  `--${boundary}`, 'Content-Type: text/plain; charset="UTF-8"', 'Content-Transfer-Encoding: base64', '', b64(mail.text),
  `--${boundary}`, 'Content-Type: text/html; charset="UTF-8"', 'Content-Transfer-Encoding: base64', '', b64(mail.html),
  `--${boundary}--`,
 ];
 return Buffer.from(lines.join('\r\n')).toString('base64url');
}

const clients = new Map<string, JWT>();
export async function sendMail(mail: Mail) {
 const from = env.leadsFrom();
 let client = clients.get(from);
 if (!client) {
  const { clientEmail, privateKey } = env.google();
  client = new JWT({ email: clientEmail, key: privateKey, scopes: ['https://www.googleapis.com/auth/gmail.send'], subject: from });
  clients.set(from, client);
 }
 await client.request({
  url: 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
  method: 'POST',
  data: { raw: mime(from, mail) },
 });
}
