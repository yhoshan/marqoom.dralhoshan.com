import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const FORGE_URL = process.env.BUILT_IN_FORGE_API_URL?.replace(/\/+$/, '');
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;

const conn = await mysql.createConnection(process.env.DATABASE_URL);
// جلب أول 15 كشاف (القديمة)
const [rows] = await conn.execute('SELECT kashafId, storageKey FROM kashaf_viewcache ORDER BY id ASC LIMIT 15');
conn.end();

console.log('=== فحص storageKeys للكشافات القديمة ===\n');
for (const row of rows) {
  const url = new URL('v1/storage/presign/get', FORGE_URL + '/');
  url.searchParams.set('path', row.storageKey);
  try {
    const resp = await fetch(url, { headers: { Authorization: `Bearer ${FORGE_KEY}` } });
    const body = await resp.json();
    if (resp.ok && body.url) {
      // جلب أول 200 حرف من الملف
      const fileResp = await fetch(body.url);
      if (fileResp.ok) {
        const text = await fileResp.text();
        const preview = text.slice(0, 200).replace(/\n/g, ' ');
        console.log(`✅ ${row.kashafId}: ${preview}...`);
      } else {
        console.log(`❌ ${row.kashafId}: ملف غير موجود (${fileResp.status})`);
      }
    } else {
      console.log(`❌ ${row.kashafId}: فشل presign (${resp.status}) - ${JSON.stringify(body).slice(0,100)}`);
    }
  } catch (e) {
    console.log(`❌ ${row.kashafId}: خطأ - ${e.message}`);
  }
}
