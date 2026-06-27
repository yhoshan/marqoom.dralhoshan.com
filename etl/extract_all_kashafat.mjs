/**
 * استخراج بيانات جميع الكشافات الـ 85 من قاعدة البيانات وview_cache
 * لتوليد بيانات KASHAFAT لـ Home.tsx و KashafDetail.tsx
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { writeFileSync } from 'fs';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute('SELECT * FROM kashaf_viewcache ORDER BY id ASC');
conn.end();

console.log(`استخرجت ${rows.length} كشاف من قاعدة البيانات`);

// طباعة جميع الكشافات مع بياناتها
const output = rows.map(r => ({
  kashafId: r.kashafId,
  storageKey: r.storageKey,
  schemaVersion: r.schemaVersion,
  bookTitle: r.bookTitle,
  bookAuthor: r.bookAuthor,
  generatedAt: r.generatedAt,
}));

writeFileSync('/home/ubuntu/marqoom/etl/all_kashafat_db.json', JSON.stringify(output, null, 2));
console.log('تم حفظ البيانات في all_kashafat_db.json');

// طباعة ملخص
output.forEach((k, i) => {
  console.log(`${i+1}. ${k.kashafId} | ${k.bookTitle || 'بدون عنوان'} | ${k.bookAuthor || 'بدون مؤلف'}`);
});
