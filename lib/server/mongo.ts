import 'server-only';
import { MongoClient, type Db } from 'mongodb';
import { env } from './env';

// One client per warm serverless instance.
const g = globalThis as typeof globalThis & { __leadsMongo?: Promise<MongoClient> };

export async function db(): Promise<Db> {
 g.__leadsMongo ??= new MongoClient(env.mongoUri(), { maxPoolSize: 5 }).connect().catch(err => { g.__leadsMongo = undefined; throw err; });
 return (await g.__leadsMongo).db(env.mongoDb());
}

let indexed = false;
export async function leads() {
 const col = (await db()).collection<Lead>('leads');
 if (!indexed) {
  await Promise.all([col.createIndex({ createdAt: -1 }), col.createIndex({ email: 1 }), col.createIndex({ ip: 1, createdAt: -1 })]);
  indexed = true;
 }
 return col;
}

export type Lead = {
 schemaVersion: 1;
 name: string;
 email: string;
 phone: string;
 description: string;
 plan: { path: string; filename: string; contentType: string; size: number } | null;
 lang: 'en' | 'he';
 source: 'landing';
 status: 'new';
 ip: string;
 userAgent: string;
 createdAt: Date;
 emails?: { user: 'sent' | 'failed'; team: 'sent' | 'failed'; error?: string; at: Date };
};
