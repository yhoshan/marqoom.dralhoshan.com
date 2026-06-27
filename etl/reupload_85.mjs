/**
 * إعادة رفع view_cache للكشاف 85 (البيان والتبيين)
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
dotenv.config();

const FORGE_URL = process.env.BUILT_IN_FORGE_API_URL?.replace(/\/+$/, '');
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;

// قراءة view_cache
const vcPath = '/home/ubuntu/marqoom/etl/output/marqoom85_bayan_tabyin/view_cache.json';
const vcContent = readFileSync(vcPath, 'utf8');
const vc = JSON.parse(vcContent);

console.log('مفاتيح view_cache:', Object.keys(vc));
console.log('views.units:', vc.views?.units?.length || 0);
console.log('views.resources:', vc.views?.resources?.length || 0);
console.log('facets.domains:', vc.facets?.domains?.length || 0);

// رفع الملف على S3
const storageKey = 'marqoom/viewcache/marqoom85_bayan_tabyin_viewcache.json';

const presignUrl = new URL('v1/storage/presign/put', FORGE_URL + '/');
presignUrl.searchParams.set('path', storageKey);
presignUrl.searchParams.set('content_type', 'application/json');

const presignResp = await fetch(presignUrl, {
  headers: { Authorization: `Bearer ${FORGE_KEY}` }
});

if (!presignResp.ok) {
  console.error('فشل الحصول على presigned URL:', await presignResp.text());
  process.exit(1);
}

const { url: uploadUrl } = await presignResp.json();
console.log('\nرفع الملف...');

const uploadResp = await fetch(uploadUrl, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: vcContent,
});

if (!uploadResp.ok) {
  console.error('فشل الرفع:', uploadResp.status, await uploadResp.text());
  process.exit(1);
}

console.log('تم الرفع بنجاح!');
console.log('storageKey:', storageKey);

// تحديث قاعدة البيانات
const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [existing] = await conn.execute(
  'SELECT id FROM kashaf_viewcache WHERE kashafId = ?',
  ['marqoom85_bayan_tabyin']
);

if (existing.length > 0) {
  await conn.execute(
    'UPDATE kashaf_viewcache SET storageKey = ?, schemaVersion = ?, updatedAt = NOW() WHERE kashafId = ?',
    [storageKey, '2.1', 'marqoom85_bayan_tabyin']
  );
  console.log('تم تحديث قاعدة البيانات');
} else {
  await conn.execute(
    'INSERT INTO kashaf_viewcache (kashafId, storageKey, schemaVersion, bookTitle, bookAuthor) VALUES (?, ?, ?, ?, ?)',
    ['marqoom85_bayan_tabyin', storageKey, '2.1', 'البيان والتبيين', 'الجاحظ']
  );
  console.log('تم إدراج سجل جديد');
}

conn.end();
console.log('\nانتهى!');
