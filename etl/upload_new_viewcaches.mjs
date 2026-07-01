/**
 * رفع view_cache.json للكشافات الجديدة 86-98 وتحديث قاعدة البيانات
 */
import { execSync } from "child_process";
import { readFileSync, existsSync, writeFileSync } from "fs";
import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE_DIR = "/home/ubuntu/upload/new_kashafat";

// خريطة: اسم الملف العربي → kashaf_id في قاعدة البيانات
const MAPPING = [
  {
    arabicKey: "تفسير_ابن_كثير",
    kashafId: "marqoom86_ibnkathir",
    localName: "ibnkathir",
  },
  {
    arabicKey: "الجامع_لعلوم_الإمام_أحمد",
    kashafId: "marqoom87_jamia_ahmad",
    localName: "jamia_ahmad",
  },
  {
    arabicKey: "الزيادة_والإحسان",
    kashafId: "marqoom88_ziyadah_ihsan",
    localName: "ziyadah_ihsan",
  },
  {
    arabicKey: "الجواب_الصحيح",
    kashafId: "marqoom97_jawab_sahih",
    localName: "jawab_sahih",
  },
  {
    arabicKey: "بيان_تلبيس_الجهمية",
    kashafId: "marqoom98_bayan_talbis",
    localName: "bayan_talbis",
  },
  {
    arabicKey: "التمهيد_لما_في_الموطا",
    kashafId: "marqoom91_altamhid",
    localName: "altamhid",
  },
  {
    arabicKey: "الاستذكار",
    kashafId: "marqoom92_alistidhkar",
    localName: "alistidhkar",
  },
  {
    arabicKey: "الكافي_في_فقه",
    kashafId: "marqoom93_alkafi_ibnabdulbar",
    localName: "alkafi_ibnabdulbar",
  },
  {
    arabicKey: "إعلام_الموقعين",
    kashafId: "marqoom94_ilam_almuwaqqiin",
    localName: "ilam_almuwaqqiin",
  },
];

// أيضاً تحديث الكشافات الموجودة بـ view_cache جديدة
const EXISTING_MAPPING = [
  {
    arabicKey: "المجموع_شرح_المهذب_للنووي",
    kashafId: "annawawe",
    localName: "annawawe_new",
  },
  {
    arabicKey: "المحلى_بالآثار_لابن_حزم",
    kashafId: "almuhalla",
    localName: "almuhalla_new",
  },
  {
    arabicKey: "المغني_لابن_قدامة",
    kashafId: "almughni",
    localName: "almughni_new",
  },
  {
    arabicKey: "بدائع_الصنائع_للكاساني",
    kashafId: "albadaei",
    localName: "albadaei_new",
  },
  {
    arabicKey: "تفسير_الرازي_مفاتيح_الغيب",
    kashafId: "alrazi",
    localName: "alrazi_new",
  },
  {
    arabicKey: "تفسير_القرطبي_للقرطبي",
    kashafId: "alqurtubi",
    localName: "alqurtubi_new",
  },
];

const ALL_MAPPING = [...MAPPING, ...EXISTING_MAPPING];

// البحث عن الملف في المجلد
function findViewCacheFile(arabicKey) {
  const { readdirSync } = await import("fs");
  // نبحث عن ملف يحتوي على المفتاح العربي وينتهي بـ view_cache.json
  const files = readdirSync(BASE_DIR);
  const match = files.find(
    (f) => f.includes(arabicKey) && f.endsWith("view_cache.json")
  );
  return match ? join(BASE_DIR, match) : null;
}

// رفع ملف على S3 باستخدام manus-upload-file
function uploadFile(filePath) {
  try {
    const result = execSync(`manus-upload-file --webdev "${filePath}"`, {
      encoding: "utf8",
    });
    // استخراج المسار من النتيجة
    const match = result.match(/\/manus-storage\/[^\s]+/);
    return match ? match[0] : null;
  } catch (e) {
    console.error(`خطأ في رفع ${filePath}:`, e.message);
    return null;
  }
}

// تسجيل في قاعدة البيانات
async function registerInDB(kashafId, storageKey) {
  const { execSync: exec } = await import("child_process");
  const schemaVersion = "v2.2";
  const sql = `
    INSERT INTO kashaf_viewcache (kashaf_id, storage_key, schema_version, generated_at)
    VALUES ('${kashafId}', '${storageKey}', '${schemaVersion}', NOW())
    ON DUPLICATE KEY UPDATE storage_key = '${storageKey}', schema_version = '${schemaVersion}', generated_at = NOW();
  `;
  try {
    exec(
      `cd /home/ubuntu/marqoom && node -e "
const mysql = require('mysql2/promise');
async function run() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  await conn.execute(\`INSERT INTO kashaf_viewcache (kashaf_id, storage_key, schema_version, generated_at) VALUES (?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE storage_key = ?, schema_version = ?, generated_at = NOW()\`, ['${kashafId}', '${storageKey}', 'v2.2', '${storageKey}', 'v2.2']);
  console.log('تم: ${kashafId}');
  await conn.end();
}
run().catch(console.error);
"`,
      { encoding: "utf8" }
    );
    return true;
  } catch (e) {
    console.error(`خطأ في تسجيل ${kashafId}:`, e.message);
    return false;
  }
}

// البرنامج الرئيسي
import { readdirSync } from "fs";

const results = [];

for (const { arabicKey, kashafId, localName } of ALL_MAPPING) {
  // البحث عن الملف
  const files = readdirSync(BASE_DIR);
  const matchFile = files.find(
    (f) => f.includes(arabicKey) && f.endsWith("view_cache.json")
  );

  if (!matchFile) {
    console.log(`⚠️ لم يُعثر على ملف لـ ${kashafId} (المفتاح: ${arabicKey})`);
    results.push({ kashafId, status: "not_found" });
    continue;
  }

  const filePath = join(BASE_DIR, matchFile);
  console.log(`📤 رفع ${matchFile} لـ ${kashafId}...`);

  // رفع الملف
  const uploadResult = execSync(`manus-upload-file --webdev "${filePath}"`, {
    encoding: "utf8",
  });
  const storageMatch = uploadResult.match(/\/manus-storage\/[^\s\n]+/);

  if (!storageMatch) {
    console.log(`❌ فشل رفع ${kashafId}`);
    results.push({ kashafId, status: "upload_failed" });
    continue;
  }

  const storageKey = storageMatch[0].replace("/manus-storage/", "");
  console.log(`✅ رُفع: /manus-storage/${storageKey}`);

  results.push({ kashafId, storageKey, status: "uploaded" });
}

// حفظ النتائج
writeFileSync(
  resolve(__dirname, "viewcache_upload_results.json"),
  JSON.stringify(results, null, 2)
);
console.log("\n📊 النتائج:");
console.table(results);
