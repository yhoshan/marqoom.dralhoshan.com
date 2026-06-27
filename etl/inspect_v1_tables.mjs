import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const FORGE_URL = process.env.BUILT_IN_FORGE_API_URL?.replace(/\/+$/, '');
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute("SELECT kashafId, storageKey FROM kashaf_viewcache WHERE kashafId = 'fathalbaari' LIMIT 1");
conn.end();

const row = rows[0];
const url = new URL('v1/storage/presign/get', FORGE_URL + '/');
url.searchParams.set('path', row.storageKey);
const presignResp = await fetch(url, { headers: { Authorization: `Bearer ${FORGE_KEY}` } });
const { url: signed } = await presignResp.json();
const resp = await fetch(signed);
const vc = await resp.json();

console.log('المفاتيح الرئيسية:', Object.keys(vc));
console.log('\n=== highlights (المفاتيح) ===');
console.log(Object.keys(vc.highlights || {}));

console.log('\n=== distributions (المفاتيح) ===');
console.log(Object.keys(vc.distributions || {}));

console.log('\n=== limits (المفاتيح) ===');
console.log(Object.keys(vc.limits || {}));

// فحص بنية أول جدول في highlights
const hKeys = Object.keys(vc.highlights || {});
if (hKeys.length > 0) {
  const first = vc.highlights[hKeys[0]];
  console.log(`\n=== highlights.${hKeys[0]} ===`);
  console.log('النوع:', typeof first);
  if (first && first._columns) {
    console.log('_columns:', first._columns);
    console.log('أول صف:', first.rows?.[0]);
  } else {
    console.log('البنية:', JSON.stringify(first, null, 2).slice(0, 500));
  }
}

// فحص بنية أول جدول في distributions
const dKeys = Object.keys(vc.distributions || {});
if (dKeys.length > 0) {
  const first = vc.distributions[dKeys[0]];
  console.log(`\n=== distributions.${dKeys[0]} ===`);
  console.log('النوع:', typeof first);
  if (first && first._columns) {
    console.log('_columns:', first._columns);
    console.log('أول صف:', first.rows?.[0]);
  } else {
    console.log('البنية:', JSON.stringify(first, null, 2).slice(0, 500));
  }
}
