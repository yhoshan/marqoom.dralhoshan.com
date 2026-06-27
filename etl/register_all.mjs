#!/usr/bin/env node
/**
 * register_all.mjs — ربط جميع الكشافات بقاعدة البيانات عبر API
 * يقرأ batch_report.json ويرفع كل view_cache.json إلى S3 ويسجله في قاعدة البيانات
 * الاستخدام: node etl/register_all.mjs [--only-new] [--kashaf-id <id>]
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, "..");

// قراءة متغيرات البيئة
import dotenv from "dotenv";
dotenv.config({ path: join(PROJECT_ROOT, ".env") });

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL?.replace(/\/+$/, "");
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

if (!FORGE_API_URL || !FORGE_API_KEY) {
  console.error("❌ متغيرات البيئة BUILT_IN_FORGE_API_URL أو BUILT_IN_FORGE_API_KEY غير موجودة");
  process.exit(1);
}

// قراءة batch_report.json
const batchReportPath = join(__dirname, "output", "batch_report.json");
if (!existsSync(batchReportPath)) {
  console.error("❌ لم يُعثر على batch_report.json — شغّل batch_etl.py أولاً");
  process.exit(1);
}

const batchReport = JSON.parse(readFileSync(batchReportPath, "utf-8"));

// معالجة الحجج
const args = process.argv.slice(2);
const onlyNew = args.includes("--only-new");
const kashafIdFilter = args.includes("--kashaf-id")
  ? args[args.indexOf("--kashaf-id") + 1]
  : null;

// ─── الاتصال بقاعدة البيانات ───────────────────────────────────────────────
import mysql from "mysql2/promise";

async function getDb() {
  return mysql.createConnection(DATABASE_URL);
}

// ─── رفع ملف إلى S3 ────────────────────────────────────────────────────────
async function uploadToStorage(filePath, storageKey) {
  const fileContent = readFileSync(filePath);

  // الحصول على presigned PUT URL
  const presignUrl = new URL("v1/storage/presign/put", FORGE_API_URL + "/");
  presignUrl.searchParams.set("path", storageKey);
  presignUrl.searchParams.set("content_type", "application/json");

  const presignResp = await fetch(presignUrl, {
    headers: { Authorization: `Bearer ${FORGE_API_KEY}` },
  });

  if (!presignResp.ok) {
    throw new Error(`فشل الحصول على presigned URL: ${presignResp.status}`);
  }

  const { url: putUrl } = await presignResp.json();

  // رفع الملف
  const uploadResp = await fetch(putUrl, {
    method: "PUT",
    body: fileContent,
    headers: { "Content-Type": "application/json" },
  });

  if (!uploadResp.ok) {
    throw new Error(`فشل رفع الملف: ${uploadResp.status}`);
  }

  return `/manus-storage/${storageKey}`;
}

// ─── تسجيل الكشاف في قاعدة البيانات ────────────────────────────────────────
async function registerInDb(db, kashafId, storageKey, schemaVersion) {
  const now = Math.floor(Date.now() / 1000);

  // تحقق إذا كان موجوداً
  const [existing] = await db.execute(
    "SELECT id FROM kashaf_viewcache WHERE kashafId = ?",
    [kashafId]
  );

  if (existing.length > 0) {
    // تحديث
    await db.execute(
      "UPDATE kashaf_viewcache SET storageKey = ?, schemaVersion = ?, generatedAt = ? WHERE kashafId = ?",
      [storageKey, schemaVersion, now, kashafId]
    );
    return "updated";
  } else {
    // إدراج جديد
    await db.execute(
      "INSERT INTO kashaf_viewcache (kashafId, storageKey, schemaVersion, generatedAt) VALUES (?, ?, ?, ?)",
      [kashafId, storageKey, schemaVersion, now]
    );
    return "inserted";
  }
}

// ─── المنطق الرئيسي ──────────────────────────────────────────────────────────
async function main() {
  const db = await getDb();
  console.log("✅ اتصال بقاعدة البيانات ناجح");

  // تصفية الكشافات
  let items = batchReport.filter((r) => r.status === "success" && r.view_cache);

  if (kashafIdFilter) {
    items = items.filter((r) => r.kashaf_id === kashafIdFilter);
    if (items.length === 0) {
      console.error(`❌ لم يُعثر على كشاف: ${kashafIdFilter}`);
      await db.end();
      process.exit(1);
    }
  }

  if (onlyNew) {
    // تحقق من الكشافات الموجودة في قاعدة البيانات
    const [existing] = await db.execute("SELECT kashafId FROM kashaf_viewcache");
    const existingIds = new Set(existing.map((r) => r.kashafId));
    items = items.filter((r) => !existingIds.has(r.kashaf_id));
    console.log(`🔍 الكشافات الجديدة فقط: ${items.length}`);
  }

  console.log(`🚀 ربط ${items.length} كشافاً...`);
  console.log("=".repeat(60));

  let success = 0;
  let errors = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const kashafId = item.kashaf_id;
    const viewCachePath = item.view_cache;

    process.stdout.write(`[${i + 1}/${items.length}] ${kashafId}... `);

    if (!existsSync(viewCachePath)) {
      console.log(`⚠️  ملف view_cache غير موجود: ${viewCachePath}`);
      errors++;
      continue;
    }

    try {
      // قراءة schema_version من الملف
      const cacheData = JSON.parse(readFileSync(viewCachePath, "utf-8"));
      const schemaVersion = cacheData._meta?.schema_version || "v1";

      // مفتاح التخزين
      const storageKey = `kashafat/${kashafId}_view_cache.json`;

      // رفع إلى S3
      await uploadToStorage(viewCachePath, storageKey);

      // تسجيل في قاعدة البيانات
      const action = await registerInDb(db, kashafId, storageKey, schemaVersion);

      console.log(`✅ ${action} (امتثال ${item.compliance}%)`);
      success++;
    } catch (err) {
      console.log(`❌ خطأ: ${err.message}`);
      errors++;
    }
  }

  await db.end();

  console.log("=".repeat(60));
  console.log(`✅ نجح: ${success} | ❌ خطأ: ${errors}`);
}

main().catch((err) => {
  console.error("❌ خطأ غير متوقع:", err);
  process.exit(1);
});
