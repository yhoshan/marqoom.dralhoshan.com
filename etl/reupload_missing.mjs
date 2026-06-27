/**
 * رفع view_cache للكشافات التي لها ملفات محلية لكن storageKey فارغ
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { readFileSync, existsSync } from 'fs';
dotenv.config();

const FORGE_URL = process.env.BUILT_IN_FORGE_API_URL?.replace(/\/+$/, '');
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;

const KASHAFAT = [
  {
    kashafId: 'marqoom75_majmoo_fatawa',
    vcPath: '/home/ubuntu/marqoom/etl/output/marqoom75_majmoo_fatawa/marqoom75_majmoo_fatawa_view_cache.json',
    storageKey: 'marqoom/viewcache/marqoom75_majmoo_fatawa_viewcache.json',
  },
  {
    kashafId: 'marqoom82_maqalat_ashari',
    vcPath: '/home/ubuntu/marqoom/etl/output/marqoom82_maqalat_ashari/view_cache.json',
    storageKey: 'marqoom/viewcache/marqoom82_maqalat_ashari_viewcache.json',
  },
];

const conn = await mysql.createConnection(process.env.DATABASE_URL);

for (const k of KASHAFAT) {
  console.log(`\n=== ${k.kashafId} ===`);
  
  if (!existsSync(k.vcPath)) {
    console.log(`❌ الملف غير موجود: ${k.vcPath}`);
    continue;
  }
  
  const vcContent = readFileSync(k.vcPath, 'utf8');
  const vc = JSON.parse(vcContent);
  console.log('مفاتيح:', Object.keys(vc));
  
  // رفع الملف
  const presignUrl = new URL('v1/storage/presign/put', FORGE_URL + '/');
  presignUrl.searchParams.set('path', k.storageKey);
  presignUrl.searchParams.set('content_type', 'application/json');
  
  const presignResp = await fetch(presignUrl, {
    headers: { Authorization: `Bearer ${FORGE_KEY}` }
  });
  
  if (!presignResp.ok) {
    console.error('❌ فشل presign:', await presignResp.text());
    continue;
  }
  
  const { url: uploadUrl } = await presignResp.json();
  const uploadResp = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: vcContent,
  });
  
  if (!uploadResp.ok) {
    console.error('❌ فشل الرفع:', uploadResp.status);
    continue;
  }
  
  console.log('✅ تم الرفع');
  
  // تحديث قاعدة البيانات
  const schemaVer = vc.schema?.protocol_version || (vc.views ? '2.1' : '1.0');
  await conn.execute(
    'UPDATE kashaf_viewcache SET storageKey = ?, schemaVersion = ?, updatedAt = NOW() WHERE kashafId = ?',
    [k.storageKey, schemaVer, k.kashafId]
  );
  console.log(`✅ تم تحديث DB (schema: ${schemaVer})`);
}

conn.end();
console.log('\nانتهى!');
