import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const FORGE_URL = process.env.BUILT_IN_FORGE_API_URL?.replace(/\/+$/, '');
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;

const conn = await mysql.createConnection(process.env.DATABASE_URL);
// جلب أول 3 كشافات قديمة
const [rows] = await conn.execute("SELECT kashafId, storageKey FROM kashaf_viewcache WHERE kashafId IN ('fathalbaari', 'ibnabdulbar', 'marqoom71_jamia_ulum_ahmad') LIMIT 3");
conn.end();

for (const row of rows) {
  const url = new URL('v1/storage/presign/get', FORGE_URL + '/');
  url.searchParams.set('path', row.storageKey);
  const presignResp = await fetch(url, { headers: { Authorization: `Bearer ${FORGE_KEY}` } });
  const { url: signed } = await presignResp.json();
  const resp = await fetch(signed);
  const vc = await resp.json();
  
  console.log(`\n=== ${row.kashafId} ===`);
  console.log('المفاتيح الرئيسية:', Object.keys(vc));
  
  if (vc._meta) {
    console.log('_meta:', JSON.stringify(vc._meta, null, 2));
  }
  if (vc.book_metadata) {
    console.log('book_metadata:', JSON.stringify(vc.book_metadata, null, 2));
  }
  if (vc.stats) {
    console.log('stats:', JSON.stringify(vc.stats, null, 2));
  }
  if (vc.highlights) {
    console.log('highlights (أول 3):', JSON.stringify(vc.highlights?.slice?.(0,3) || vc.highlights, null, 2));
  }
  if (vc.metadata) {
    console.log('metadata:', JSON.stringify(vc.metadata, null, 2));
  }
}
