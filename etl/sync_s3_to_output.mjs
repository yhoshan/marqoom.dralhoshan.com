/**
 * sync_s3_to_output.mjs
 * يجلب جميع ملفات view_cache v2.x من S3 ويحفظها في etl/output/{kashafId}/
 * يعتمد على storageKey المسجّل في قاعدة البيانات كمصدر حقيقي
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, 'output');
const FORGE_URL = (process.env.BUILT_IN_FORGE_API_URL || '').replace(/\/+$/, '');
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;

async function presignGet(key) {
  const url = `${FORGE_URL}/v1/storage/presign/get?path=${encodeURIComponent(key)}`;
  const r = await fetch(url, { headers: { Authorization: `Bearer ${FORGE_KEY}` } });
  if (!r.ok) throw new Error(`presign failed for ${key}: ${r.status}`);
  const j = await r.json();
  return j.url;
}

async function downloadJSON(storageKey) {
  const signedUrl = await presignGet(storageKey);
  const r = await fetch(signedUrl);
  if (!r.ok) throw new Error(`download failed for ${storageKey}: ${r.status}`);
  return await r.json();
}

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);

  // جلب جميع الكشافات v2.x
  const [rows] = await conn.execute(
    `SELECT kashafId, storageKey, schemaVersion FROM kashaf_viewcache
     WHERE schemaVersion LIKE '2%' OR schemaVersion LIKE 'v2%'
     ORDER BY kashafId`
  );
  conn.end();

  console.log(`وُجد ${rows.length} كشافاً بإصدار v2.x في قاعدة البيانات\n`);

  const report = {
    total: rows.length,
    downloaded: 0,
    skipped: 0,
    errors: [],
    files: []
  };

  for (const row of rows) {
    const { kashafId, storageKey, schemaVersion } = row;
    const outDir = path.join(OUTPUT_DIR, kashafId);
    const outFile = path.join(outDir, 'view_cache.json');

    process.stdout.write(`  [${kashafId}] (${schemaVersion}) ${storageKey} ... `);

    try {
      const data = await downloadJSON(storageKey);

      // التحقق من أن الملف فعلاً v2.x
      const pv = data.protocol_version || data._meta?.protocol_version || data._meta?.schema_version || 'unknown';
      if (!pv.toString().includes('2')) {
        console.log(`⚠ تجاهل — protocol_version في الملف: ${pv}`);
        report.skipped++;
        continue;
      }

      // إنشاء المجلد إن لم يكن موجوداً
      fs.mkdirSync(outDir, { recursive: true });

      // حفظ view_cache.json
      fs.writeFileSync(outFile, JSON.stringify(data, null, 2), 'utf8');
      console.log(`✓ (protocol_version: ${pv})`);

      report.downloaded++;
      report.files.push({ kashafId, storageKey, schemaVersion, protocol_version: pv, path: outFile });

    } catch (err) {
      console.log(`✗ خطأ: ${err.message}`);
      report.errors.push({ kashafId, storageKey, error: err.message });
    }
  }

  console.log('\n=== ملخص المزامنة ===');
  console.log(`  إجمالي v2.x في DB: ${report.total}`);
  console.log(`  نُزّل بنجاح:        ${report.downloaded}`);
  console.log(`  تجاهل (مشكلة):     ${report.skipped}`);
  console.log(`  أخطاء:              ${report.errors.length}`);
  if (report.errors.length > 0) {
    console.log('\n  الأخطاء:');
    report.errors.forEach(e => console.log(`    - ${e.kashafId}: ${e.error}`));
  }

  // حفظ تقرير المزامنة
  const reportPath = path.join(OUTPUT_DIR, 'sync_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`\nتقرير المزامنة: ${reportPath}`);
}

main().catch(console.error);
