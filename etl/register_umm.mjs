// سكريبت تسجيل كشاف الأم للشافعي في قاعدة البيانات
import { createConnection } from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const db = await createConnection(process.env.DATABASE_URL);

const kashafId = "umm_shafii";
const storageKey = "view_cache_d91ecf76.json";
const schemaVersion = "2.2";
const bookTitle = "الأم";
const bookAuthor = "الإمام محمد بن إدريس الشافعي";
// تحقق هل يوجد مسبقاً
const [existing] = await db.execute(
  "SELECT kashafId FROM kashaf_viewcache WHERE kashafId = ?",
  [kashafId]
);

if (existing.length > 0) {
  console.log(`✓ الكشاف موجود مسبقاً: ${kashafId}`);
  // تحديث storageKey وschemaVersion
  await db.execute(
    "UPDATE kashaf_viewcache SET storageKey = ?, schemaVersion = ?, bookTitle = ?, bookAuthor = ? WHERE kashafId = ?",
    [storageKey, schemaVersion, bookTitle, bookAuthor, kashafId]
  );
  console.log("✓ تم التحديث");
} else {
  // إدراج جديد
  await db.execute(
    "INSERT INTO kashaf_viewcache (kashafId, storageKey, schemaVersion, bookTitle, bookAuthor) VALUES (?, ?, ?, ?, ?)",
    [kashafId, storageKey, schemaVersion, bookTitle, bookAuthor]
  );
  console.log(`✓ تم التسجيل: ${kashafId}`);
}

// تحقق نهائي
const [row] = await db.execute(
  "SELECT kashafId, storageKey, schemaVersion, bookTitle FROM kashaf_viewcache WHERE kashafId = ?",
  [kashafId]
);
console.log("النتيجة:", JSON.stringify(row[0], null, 2));

await db.end();
