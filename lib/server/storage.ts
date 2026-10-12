import 'server-only';
import { Storage } from '@google-cloud/storage';
import { env } from './env';

let storage: Storage | null = null;
export function bucket() {
 if (!storage) {
  const { projectId, clientEmail, privateKey } = env.google();
  storage = new Storage({ projectId, credentials: { client_email: clientEmail, private_key: privateKey } });
 }
 return storage.bucket(env.bucket());
}

export const PLAN_TYPES: Record<string, string> = {
 'application/pdf': 'pdf', 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp',
};
export const PLAN_MAX_BYTES = 25 * 1024 * 1024;
