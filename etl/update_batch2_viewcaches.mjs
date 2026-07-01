/**
 * تحديث قاعدة البيانات بمسارات view_cache الجديدة للحزمة الثانية
 * الكشافات المُصلَحة: الأم والرسالة للشافعي، كتاب التوحيد لابن خزيمة
 */
import { readFileSync } from "fs";
import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { createConnection } from "mysql2/promise";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });

// خريطة الكشافات المُصلَحة: kashafId → مسار S3 الجديد
const UPDATES = [
  {
    kashafId: "risala",
    storageKey: "alrisala_shafii_view_cache_6e7d1a06.json",
    schemaVersion: "2.2",
    bookTitle: "الرسالة",
    bookAuthor: "الإمام محمد بن إدريس الشافعي",
    generatedAt: "2025",
    note: "الرسالة للشافعي — أضيفت sections من ورقة العناوين"
  },
  {
    kashafId: "ibnkhuzaymah",
    storageKey: "ibnkhuzayma_tawhid_view_cache_7dca4db3.json",
    schemaVersion: "2.2",
    bookTitle: "كتاب التوحيد وإثبات صفات الرب عز وجل",
    bookAuthor: "أبو بكر محمد بن إسحاق بن خزيمة النيسابوري",
    generatedAt: "2025",
    note: "كتاب التوحيد لابن خزيمة — أضيف source_excel في المستوى الأعلى"
  },
];

// ملاحظة: كشاف الأم للشافعي مدمج مع الرسالة في kashafId = "risala"
// لذا لا يوجد kashafId مستقل لـ "الأم"

async function main() {
  const conn = await createConnection(process.env.DATABASE_URL);
  
  for (const item of UPDATES) {
    try {
      const [rows] = await conn.execute(
        "SELECT id, kashafId, storageKey FROM kashaf_viewcache WHERE kashafId = ?",
        [item.kashafId]
      );
      
      if (rows.length === 0) {
        console.log(`⚠️ ${item.kashafId}: لا يوجد سجل في قاعدة البيانات — تخطي`);
        continue;
      }
      
      const existing = rows[0];
      console.log(`\n📋 ${item.kashafId}:`);
      console.log(`  المسار القديم: ${existing.storageKey}`);
      console.log(`  المسار الجديد: ${item.storageKey}`);
      
      await conn.execute(
        `UPDATE kashaf_viewcache 
         SET storageKey = ?, schemaVersion = ?, bookTitle = ?, bookAuthor = ?, generatedAt = ?
         WHERE kashafId = ?`,
        [item.storageKey, item.schemaVersion, item.bookTitle, item.bookAuthor, item.generatedAt, item.kashafId]
      );
      
      console.log(`  ✅ تم التحديث`);
    } catch (err) {
      console.error(`  ❌ خطأ في ${item.kashafId}:`, err.message);
    }
  }
  
  await conn.end();
  console.log("\n✅ اكتمل تحديث قاعدة البيانات");
}

main().catch(console.error);
