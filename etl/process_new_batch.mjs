/**
 * process_new_batch.mjs
 * رفع جميع الكشافات الجديدة (22 كشافاً) على S3 وتحديث قاعدة البيانات
 * يشمل: 8 تحديثات + 11 جديدة + 3 كتب ابن عبد البر/ابن القيم المنفصلة
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

import { fileURLToPath } from 'url';
const __etlDir = path.dirname(fileURLToPath(import.meta.url));
const __root = path.resolve(__etlDir, '..');
dotenv.config({ path: path.resolve(__root, '.env') });

const FORGE_URL = process.env.BUILT_IN_FORGE_API_URL?.replace(/\/+$/, '');
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;
const BASE_DIR = '/home/ubuntu/upload/new_kashafat';

// خريطة الكشافات: اسم الملف → معرف الكشاف في قاعدة البيانات
const KASHAFAT_MAP = [
  // ── 8 تحديثات (موجودة مسبقاً) ──
  {
    filePrefix: 'مرقوم_تحليل_فتح_الباري_لابن_حجر',
    kashafId: 'fathalbaari',
    storageKey: 'marqoom/viewcache/fathalbaari_viewcache.json',
    isNew: false,
  },
  {
    filePrefix: 'مرقوم_تحليل_مجموع_الفتاوى_والمستدرك_لابن_تيمية',
    kashafId: 'marqoom75_majmoo_fatawa',
    storageKey: 'marqoom/viewcache/marqoom75_majmoo_fatawa_viewcache.json',
    isNew: false,
  },
  {
    filePrefix: 'مرقوم_تحليل_المجموع_شرح_المهذب_للنووي',
    kashafId: 'annawawe',
    storageKey: 'marqoom/viewcache/annawawe_viewcache.json',
    isNew: false,
  },
  {
    filePrefix: 'مرقوم_تحليل_المحلى_بالآثار_لابن_حزم',
    kashafId: 'almuhalla',
    storageKey: 'marqoom/viewcache/almuhalla_viewcache.json',
    isNew: false,
  },
  {
    filePrefix: 'مرقوم_تحليل_المغني_لابن_قدامة',
    kashafId: 'almughni',
    storageKey: 'marqoom/viewcache/almughni_viewcache.json',
    isNew: false,
  },
  {
    filePrefix: 'مرقوم_تحليل_بدائع_الصنائع_للكاساني',
    kashafId: 'albadaei',
    storageKey: 'marqoom/viewcache/albadaei_viewcache.json',
    isNew: false,
  },
  {
    filePrefix: 'مرقوم_تحليل_تفسير_الرازي_مفاتيح_الغيب',
    kashafId: 'alrazi',
    storageKey: 'marqoom/viewcache/alrazi_viewcache.json',
    isNew: false,
  },
  {
    filePrefix: 'مرقوم_تحليل_تفسير_القرطبي_للقرطبي',
    kashafId: 'alqurtubi',
    storageKey: 'marqoom/viewcache/alqurtubi_viewcache.json',
    isNew: false,
  },
  // ── 11 كشافاً جديدة ──
  {
    filePrefix: 'مرقوم_تحليل_الجواب_الصحيح_لابن_تيمية',
    kashafId: 'marqoom_jawab_sahih',
    storageKey: 'marqoom/viewcache/marqoom_jawab_sahih_viewcache.json',
    isNew: true,
  },
  {
    filePrefix: 'مرقوم_تحليل_درء_تعارض_العقل_والنقل_لابن_تيمية',
    kashafId: 'marqoom_dara_taarus',
    storageKey: 'marqoom/viewcache/marqoom_dara_taarus_viewcache.json',
    isNew: true,
  },
  {
    filePrefix: 'مرقوم_تحليل_بيان_تلبيس_الجهمية_لابن_تيمية',
    kashafId: 'marqoom_bayan_talbis',
    storageKey: 'marqoom/viewcache/marqoom_bayan_talbis_viewcache.json',
    isNew: true,
  },
  {
    filePrefix: 'مرقوم_تحليل_الكافي_في_فقه_اهل_المدينة_لابن_عبد_البر',
    kashafId: 'marqoom_alkafi_ibnabdulbar',
    storageKey: 'marqoom/viewcache/marqoom_alkafi_ibnabdulbar_viewcache.json',
    isNew: true,
  },
  {
    filePrefix: 'مرقوم_تحليل_تفسير_ابن_كثير_لابن_كثير',
    kashafId: 'marqoom_ibnkathir',
    storageKey: 'marqoom/viewcache/marqoom_ibnkathir_viewcache.json',
    isNew: true,
  },
  {
    filePrefix: 'مرقوم_تحليل_زاد_المعاد_لابن_القيم',
    kashafId: 'marqoom_zad_almaaad',
    storageKey: 'marqoom/viewcache/marqoom_zad_almaaad_viewcache.json',
    isNew: true,
  },
  {
    filePrefix: 'مرقوم_تحليل_مدارج_السالكين_لابن_القيم',
    kashafId: 'marqoom_madarij',
    storageKey: 'marqoom/viewcache/marqoom_madarij_viewcache.json',
    isNew: true,
  },
  {
    filePrefix: 'مرقوم_تحليل_الجامع_لعلوم_الإمام_أحمد_بن_حنبل',
    kashafId: 'marqoom_jamia_ahmad',
    storageKey: 'marqoom/viewcache/marqoom_jamia_ahmad_viewcache.json',
    isNew: true,
  },
  {
    filePrefix: 'مرقوم_تحليل_الزيادة_والإحسان_في_علوم_القرآن_لعقيلة',
    kashafId: 'marqoom_ziyadah_ihsan',
    storageKey: 'marqoom/viewcache/marqoom_ziyadah_ihsan_viewcache.json',
    isNew: true,
  },
  {
    filePrefix: 'مرقوم_تحليل_كتاب_الأغاني_لأبي_الفرج_الأصفهاني',
    kashafId: 'marqoom_aghani',
    storageKey: 'marqoom/viewcache/marqoom_aghani_viewcache.json',
    isNew: true,
  },
  {
    filePrefix: 'مرقوم_تحليل_وفيات_الأعيان_لابن_خلكان',
    kashafId: 'marqoom_wafayat',
    storageKey: 'marqoom/viewcache/marqoom_wafayat_viewcache.json',
    isNew: true,
  },
  // ── 3 كتب منفصلة: ابن عبد البر ──
  {
    filePrefix: 'مرقوم_تحليل_التمهيد_لما_في_الموطا_لابن_عبد_البر',
    kashafId: 'marqoom_altamhid',
    storageKey: 'marqoom/viewcache/marqoom_altamhid_viewcache.json',
    isNew: true,
  },
  {
    filePrefix: 'مرقوم_تحليل_الاستذكار_لابن_عبد_البر',
    kashafId: 'marqoom_alistidhkar',
    storageKey: 'marqoom/viewcache/marqoom_alistidhkar_viewcache.json',
    isNew: true,
  },
  // ── كتاب إعلام الموقعين (ابن القيم) ──
  {
    filePrefix: 'مرقوم_تحليل_إعلام_الموقعين_لابن_القيم',
    kashafId: 'marqoom_ilam_almuwaqqiin',
    storageKey: 'marqoom/viewcache/marqoom_ilam_almuwaqqiin_viewcache.json',
    isNew: true,
  },
];

async function uploadToS3(storageKey, content) {
  const presignUrl = new URL('v1/storage/presign/put', FORGE_URL + '/');
  presignUrl.searchParams.set('path', storageKey);
  presignUrl.searchParams.set('content_type', 'application/json');

  const presignResp = await fetch(presignUrl, {
    headers: { Authorization: `Bearer ${FORGE_KEY}` },
  });

  if (!presignResp.ok) {
    throw new Error(`فشل presign: ${await presignResp.text()}`);
  }

  const { url: uploadUrl } = await presignResp.json();

  const uploadResp = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: content,
  });

  if (!uploadResp.ok) {
    throw new Error(`فشل الرفع: ${uploadResp.status}`);
  }
}

async function uploadExcel(xlsxPath) {
  try {
    const result = execSync(`manus-upload-file --webdev "${xlsxPath}"`, {
      encoding: 'utf8',
      timeout: 120000,
    });
    // استخراج الرابط من النتيجة
    const match = result.match(/\/manus-storage\/\S+/);
    return match ? match[0].trim() : null;
  } catch (e) {
    console.error(`  ❌ فشل رفع Excel: ${e.message}`);
    return null;
  }
}

const results = [];
const conn = await mysql.createConnection(process.env.DATABASE_URL);

for (const k of KASHAFAT_MAP) {
  const vcPath = path.join(BASE_DIR, `${k.filePrefix}_view_cache.json`);
  const xlsxPath = path.join(BASE_DIR, `${k.filePrefix}.xlsx`);

  console.log(`\n─── ${k.kashafId} ───`);

  if (!existsSync(vcPath)) {
    console.log(`  ⚠️ ملف view_cache غير موجود: ${vcPath}`);
    results.push({ kashafId: k.kashafId, status: 'MISSING_VC', xlsxUrl: null });
    continue;
  }

  // قراءة view_cache
  const vcContent = readFileSync(vcPath, 'utf8');
  const vc = JSON.parse(vcContent);
  const schemaVersion = vc.protocol_version || '2.2';
  const bookTitle = vc.book?.title || k.kashafId;
  console.log(`  📖 العنوان: ${bookTitle}`);
  console.log(`  📋 schema: ${schemaVersion}`);

  // رفع view_cache على S3
  try {
    await uploadToS3(k.storageKey, vcContent);
    console.log(`  ✅ view_cache مرفوع: ${k.storageKey}`);
  } catch (e) {
    console.error(`  ❌ فشل رفع view_cache: ${e.message}`);
    results.push({ kashafId: k.kashafId, status: 'UPLOAD_FAILED', xlsxUrl: null });
    continue;
  }

  // رفع Excel
  let xlsxUrl = null;
  if (existsSync(xlsxPath)) {
    console.log(`  📤 رفع Excel...`);
    xlsxUrl = await uploadExcel(xlsxPath);
    if (xlsxUrl) {
      console.log(`  ✅ Excel مرفوع: ${xlsxUrl}`);
    }
  } else {
    console.log(`  ⚠️ ملف Excel غير موجود`);
  }

  // تحديث قاعدة البيانات
  const [rows] = await conn.execute(
    'SELECT id FROM kashaf_viewcache WHERE kashafId = ?',
    [k.kashafId]
  );

  if (rows.length > 0) {
    await conn.execute(
      'UPDATE kashaf_viewcache SET storageKey = ?, schemaVersion = ?, updatedAt = NOW() WHERE kashafId = ?',
      [k.storageKey, schemaVersion, k.kashafId]
    );
    console.log(`  ✅ تم تحديث السجل في قاعدة البيانات`);
  } else {
    await conn.execute(
      'INSERT INTO kashaf_viewcache (kashafId, storageKey, schemaVersion, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())',
      [k.kashafId, k.storageKey, schemaVersion]
    );
    console.log(`  ✅ تم إنشاء سجل جديد في قاعدة البيانات`);
  }

  results.push({ kashafId: k.kashafId, status: 'OK', xlsxUrl, bookTitle, schemaVersion });
}

conn.end();

// طباعة ملخص النتائج
console.log('\n\n═══════════════════════════════════════');
console.log('ملخص النتائج:');
console.log('═══════════════════════════════════════');
const ok = results.filter(r => r.status === 'OK');
const failed = results.filter(r => r.status !== 'OK');
console.log(`✅ نجح: ${ok.length} كشاف`);
console.log(`❌ فشل: ${failed.length} كشاف`);

if (failed.length > 0) {
  console.log('\nالكشافات الفاشلة:');
  failed.forEach(r => console.log(`  - ${r.kashafId}: ${r.status}`));
}

console.log('\nروابط Excel المرفوعة:');
ok.forEach(r => {
  if (r.xlsxUrl) {
    console.log(`  ${r.kashafId}: ${r.xlsxUrl}`);
  }
});

// حفظ النتائج في ملف JSON
import { writeFileSync } from 'fs';
writeFileSync('/home/ubuntu/marqoom/etl/batch_results.json', JSON.stringify(results, null, 2), 'utf8');
console.log('\n✅ تم حفظ النتائج في batch_results.json');
