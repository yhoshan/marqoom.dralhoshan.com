/**
 * تحديث كشاف تفسير الطبري بالملفات الجديدة
 * - رفع view_cache الجديد على S3
 * - تحديث قاعدة البيانات
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
dotenv.config();

const FORGE_URL = process.env.BUILT_IN_FORGE_API_URL?.replace(/\/+$/, '');
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;

const KASHAF_ID = 'altabari';
const VC_PATH = '/home/ubuntu/upload/مرقوم_تحليل_تفسير_الطبري_جامع_البيان_للطبري_view_cache.json';
const STORAGE_KEY = 'marqoom/viewcache/altabari_viewcache.json';

console.log('=== تحديث كشاف تفسير الطبري ===');

// قراءة الملف
const vcContent = readFileSync(VC_PATH, 'utf8');
const vc = JSON.parse(vcContent);
console.log('protocol_version:', vc.protocol_version);
console.log('book.title:', vc.book?.title);
console.log('sections:', vc.sections?.length);

// رفع الملف على S3
const presignUrl = new URL('v1/storage/presign/put', FORGE_URL + '/');
presignUrl.searchParams.set('path', STORAGE_KEY);
presignUrl.searchParams.set('content_type', 'application/json');

const presignResp = await fetch(presignUrl, {
  headers: { Authorization: `Bearer ${FORGE_KEY}` }
});

if (!presignResp.ok) {
  console.error('❌ فشل presign:', await presignResp.text());
  process.exit(1);
}

const { url: uploadUrl } = await presignResp.json();
const uploadResp = await fetch(uploadUrl, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: vcContent,
});

if (!uploadResp.ok) {
  console.error('❌ فشل الرفع:', uploadResp.status);
  process.exit(1);
}
console.log('✅ تم رفع view_cache على S3');

// تحديث قاعدة البيانات
const conn = await mysql.createConnection(process.env.DATABASE_URL);

// التحقق من وجود السجل
const [rows] = await conn.execute(
  'SELECT id, kashafId, storageKey FROM kashaf_viewcache WHERE kashafId = ?',
  [KASHAF_ID]
);

if (rows.length > 0) {
  await conn.execute(
    'UPDATE kashaf_viewcache SET storageKey = ?, schemaVersion = ?, updatedAt = NOW() WHERE kashafId = ?',
    [STORAGE_KEY, vc.protocol_version || '2.2', KASHAF_ID]
  );
  console.log('✅ تم تحديث السجل في قاعدة البيانات');
} else {
  await conn.execute(
    'INSERT INTO kashaf_viewcache (kashafId, storageKey, schemaVersion, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())',
    [KASHAF_ID, STORAGE_KEY, vc.protocol_version || '2.2']
  );
  console.log('✅ تم إنشاء سجل جديد في قاعدة البيانات');
}

conn.end();
console.log('\n✅ اكتمل التحديث!');
