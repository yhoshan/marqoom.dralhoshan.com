#!/usr/bin/env node
/**
 * register_viewcache.mjs — سكريبت ETL لربط view_cache.json بكشاف محدد
 *
 * الاستخدام:
 *   node etl/register_viewcache.mjs <kashaf_id> <path/to/view_cache.json>
 *
 * مثال:
 *   node etl/register_viewcache.mjs bahralmuhit /home/ubuntu/webdev-static-assets/bahralmuhit_view_cache.json
 *
 * ما يفعله:
 *   1. يقرأ ملف JSON ويتحقق من صحته
 *   2. يرفعه إلى S3 (private) عبر Forge API
 *   3. يسجّل storageKey في جدول kashaf_viewcache
 *   4. لا يُكشف أي رابط للمتصفح
 *
 * المتطلبات:
 *   - ملف .env في مجلد المشروع يحتوي على DATABASE_URL, BUILT_IN_FORGE_API_URL, BUILT_IN_FORGE_API_KEY
 *   - أو تشغيله من بيئة السيرفر مباشرة
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { createRequire } from "module";

// ── تحميل متغيرات البيئة ──────────────────────────────────────────
const require = createRequire(import.meta.url);
const projectRoot = resolve(import.meta.dirname, "..");

// محاولة تحميل dotenv إن وُجد
try {
  const dotenv = require("dotenv");
  dotenv.config({ path: resolve(projectRoot, ".env") });
} catch {
  // dotenv غير مثبت — نعتمد على متغيرات البيئة المحقونة مباشرة
}

// ── التحقق من المدخلات ────────────────────────────────────────────
const [, , kashafId, jsonFilePath] = process.argv;

if (!kashafId || !jsonFilePath) {
  console.error("الاستخدام: node etl/register_viewcache.mjs <kashaf_id> <path/to/view_cache.json>");
  console.error("مثال:     node etl/register_viewcache.mjs bahralmuhit /path/to/bahralmuhit_view_cache.json");
  process.exit(1);
}

const absPath = resolve(jsonFilePath);

// ── قراءة والتحقق من JSON ─────────────────────────────────────────
let jsonData;
try {
  const raw = readFileSync(absPath, "utf8");
  jsonData = JSON.parse(raw);
  console.log(`✅ قُرئ الملف: ${absPath}`);
} catch (err) {
  console.error(`❌ فشل قراءة أو تحليل JSON: ${err.message}`);
  process.exit(1);
}

// استخراج metadata من الملف
const meta = jsonData._meta || {};
const bookInfo = jsonData.book || {};
const schemaVersion = meta.schema_version || null;
const generatedAt = meta.generated_at || null;
const bookTitle = (typeof bookInfo === "object" ? bookInfo.title : jsonData.book) || null;
const bookAuthor = (typeof bookInfo === "object" ? bookInfo.author : jsonData.author) || null;

console.log(`📖 الكتاب: ${bookTitle || "غير محدد"}`);
console.log(`👤 المؤلف: ${bookAuthor || "غير محدد"}`);
console.log(`🔖 إصدار المخطط: ${schemaVersion || "legacy"}`);

// ── رفع إلى S3 ───────────────────────────────────────────────────
const forgeUrl = (process.env.BUILT_IN_FORGE_API_URL || "").replace(/\/+$/, "");
const forgeKey = process.env.BUILT_IN_FORGE_API_KEY;

if (!forgeUrl || !forgeKey) {
  console.error("❌ متغيرات البيئة BUILT_IN_FORGE_API_URL و BUILT_IN_FORGE_API_KEY مطلوبة");
  process.exit(1);
}

// مفتاح S3 بتنسيق ثابت: viewcache/<kashafId>_<timestamp>.json
const timestamp = Date.now();
const storageKey = `viewcache/${kashafId}_${timestamp}.json`;

console.log(`⬆️  رفع إلى S3: ${storageKey}`);

// الحصول على presigned PUT URL
const presignPutUrl = new URL("v1/storage/presign/put", forgeUrl + "/");
presignPutUrl.searchParams.set("path", storageKey);

const presignResp = await fetch(presignPutUrl, {
  headers: { Authorization: `Bearer ${forgeKey}` },
});

if (!presignResp.ok) {
  const msg = await presignResp.text().catch(() => presignResp.statusText);
  console.error(`❌ فشل الحصول على presigned URL: ${presignResp.status} — ${msg}`);
  process.exit(1);
}

const { url: s3PutUrl } = await presignResp.json();

// رفع الملف إلى S3
const jsonContent = readFileSync(absPath, "utf8");
const uploadResp = await fetch(s3PutUrl, {
  method: "PUT",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: jsonContent,
});

if (!uploadResp.ok) {
  console.error(`❌ فشل رفع الملف إلى S3: ${uploadResp.status}`);
  process.exit(1);
}

console.log(`✅ رُفع إلى S3 بنجاح`);

// ── تسجيل في قاعدة البيانات ───────────────────────────────────────
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("❌ متغير البيئة DATABASE_URL مطلوب");
  process.exit(1);
}

// استخدام mysql2 مباشرة لتجنب تعقيدات Drizzle في ESM
const mysql2 = require("mysql2/promise");

const conn = await mysql2.createConnection(dbUrl);

try {
  await conn.execute(
    `INSERT INTO kashaf_viewcache (kashafId, storageKey, schemaVersion, generatedAt, bookTitle, bookAuthor)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       storageKey = VALUES(storageKey),
       schemaVersion = VALUES(schemaVersion),
       generatedAt = VALUES(generatedAt),
       bookTitle = VALUES(bookTitle),
       bookAuthor = VALUES(bookAuthor),
       updatedAt = NOW()`,
    [kashafId, storageKey, schemaVersion, generatedAt, bookTitle, bookAuthor]
  );

  console.log(`✅ سُجِّل في قاعدة البيانات: kashafId="${kashafId}"`);
  console.log(`\n🎉 اكتمل الربط بنجاح!`);
  console.log(`   الكشاف: ${kashafId}`);
  console.log(`   مفتاح S3: ${storageKey}`);
  console.log(`   الوصول: /api/trpc/kashafat.getViewCache?input={"kashafId":"${kashafId}"}`);
} finally {
  await conn.end();
}
