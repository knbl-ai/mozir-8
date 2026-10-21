// Copies leads that are not yet in the Google Sheet (new backlog, or ones whose append failed) and marks them.
// Run: npx tsx --conditions=react-server --env-file=.env.local scripts/sync-leads-sheet.ts [--dry]
import { leads } from '../lib/server/mongo';
import { appendLeads } from '../lib/server/sheets';

(async () => {
 const col = await leads();
 const todo = await col.find({ sheet: { $ne: 'ok' } }).sort({ createdAt: 1 }).toArray();
 console.log(`${todo.length} lead(s) not in the sheet`);
 if (process.argv.includes('--dry') || !todo.length) process.exit(0);
 await appendLeads(todo.map(lead => ({ lead, id: lead._id.toString() })));
 await col.updateMany({ _id: { $in: todo.map(l => l._id) } }, { $set: { sheet: 'ok' } });
 console.log('done');
 process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
