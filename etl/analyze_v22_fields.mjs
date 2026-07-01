import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { writeFileSync } from 'fs';
dotenv.config();

const FORGE_URL = process.env.BUILT_IN_FORGE_API_URL?.replace(/\/+$/, '');
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;

async function fetchViewCache(storageKey) {
  try {
    const url = new URL('v1/storage/presign/get', FORGE_URL + '/');
    url.searchParams.set('path', storageKey);
    const presignResp = await fetch(url, { headers: { Authorization: `Bearer ${FORGE_KEY}` } });
    if (!presignResp.ok) return null;
    const { url: signed } = await presignResp.json();
    const resp = await fetch(signed);
    if (!resp.ok) return null;
    return await resp.json();
  } catch (e) {
    return null;
  }
}

function getFields(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  const first = arr[0];
  return typeof first === 'object' ? Object.keys(first) : [];
}

function analyzeVal(val) {
  if (!val) return null;
  if (Array.isArray(val) && val.length > 0) {
    return { type: 'array', count: val.length, fields: getFields(val) };
  }
  if (typeof val === 'object' && !Array.isArray(val)) {
    const result = { type: 'dict', keys: Object.keys(val), sub: {} };
    for (const [k, v] of Object.entries(val)) {
      if (Array.isArray(v) && v.length > 0) {
        result.sub[k] = { count: v.length, fields: getFields(v) };
      } else if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
        result.sub[k] = { type: 'object', keys: Object.keys(v) };
      }
    }
    return result;
  }
  return { type: typeof val };
}

const TARGET_BOOKS = ['alqurtubi', 'alrazi', 'altabari', 'ibnkathir', 'fathalbaari', 'annawawe', 'almughni', 'almuhalla', 'albadaei'];

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute('SELECT kashafId, storageKey, schemaVersion FROM kashaf_viewcache ORDER BY id ASC');
await conn.end();

console.log(`إجمالي السجلات في DB: ${rows.length}`);

const results = {};

for (const row of rows) {
  const bookId = row.kashafId;
  if (!TARGET_BOOKS.some(t => bookId.includes(t))) continue;
  
  console.log(`\nجلب: ${bookId} (${row.storageKey})`);
  const vc = await fetchViewCache(row.storageKey);
  if (!vc) { console.log('  فشل الجلب'); continue; }
  
  const protocol = vc.protocol_version || vc?.schema?.protocol_version || 'v1';
  console.log(`  البروتوكول: ${protocol}`);
  
  if (!protocol || protocol === 'v1' || protocol === '1.0.0') {
    console.log('  تخطي (v1)');
    continue;
  }
  
  const entry = { protocol, resources: {}, sections: null, terms: null, summary: {} };
  
  // تحليل resources
  if (vc.resources && typeof vc.resources === 'object') {
    for (const [k, v] of Object.entries(vc.resources)) {
      entry.resources[k] = analyzeVal(v);
    }
  }
  
  // تحليل sections
  entry.sections = analyzeVal(vc.sections);
  
  // تحليل terms
  entry.terms = analyzeVal(vc.terms);
  
  // تحليل summary
  if (vc.summary && typeof vc.summary === 'object') {
    for (const [k, v] of Object.entries(vc.summary)) {
      entry.summary[k] = analyzeVal(v);
    }
  }
  
  results[bookId] = entry;
  await new Promise(r => setTimeout(r, 100));
}

writeFileSync('/tmp/v22_analysis.json', JSON.stringify(results, null, 2));
console.log(`\n\nتم تحليل ${Object.keys(results).length} كشاف v2.2`);
console.log('الكشافات:', Object.keys(results));
