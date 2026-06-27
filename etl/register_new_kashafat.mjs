/**
 * تسجيل الكشافات الـ 14 الجديدة في قاعدة البيانات
 * marqoom71 → marqoom84
 */
import { readFileSync } from "fs";
import { createConnection } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) throw new Error("DATABASE_URL not set");

// خريطة: book_id → بيانات الكشاف
const KASHAFAT = [
  {
    book_id: "marqoom71_jamia_ulum_ahmad",
    title: "كشّاف الجامع لعلوم الإمام أحمد",
    author: "جمع وإعداد",
    died_hijri: null,
    category: "حديث",
    xlsxUrl: "/manus-storage/jamia_ulum_ahmad_7131c3a7.xlsx",
    docxUrl: null,
    externalUrl: null,
    viewCachePath: "etl/output/marqoom71_jamia_ulum_ahmad/marqoom71_jamia_ulum_ahmad_view_cache.json",
  },
  {
    book_id: "marqoom72_durar_saniyya",
    title: "كشّاف الدرر السنية",
    author: "علماء نجد",
    died_hijri: null,
    category: "عقيدة",
    xlsxUrl: "/manus-storage/durar_saniyya_da93f414.xlsx",
    docxUrl: null,
    externalUrl: null,
    viewCachePath: "etl/output/marqoom72_durar_saniyya/marqoom72_durar_saniyya_view_cache.json",
  },
  {
    book_id: "marqoom73_bahr_raiq",
    title: "كشّاف البحر الرائق لابن نجيم",
    author: "ابن نجيم المصري",
    died_hijri: 970,
    category: "فقه",
    xlsxUrl: "/manus-storage/bahr_raiq_3c66c061.xlsx",
    docxUrl: null,
    externalUrl: null,
    viewCachePath: "etl/output/marqoom73_bahr_raiq/marqoom73_bahr_raiq_view_cache.json",
  },
  {
    book_id: "marqoom74_hawi_kabir",
    title: "كشّاف الحاوي الكبير للماوردي",
    author: "أبو الحسن الماوردي",
    died_hijri: 450,
    category: "فقه",
    xlsxUrl: "/manus-storage/hawi_kabir_e5382035.xlsx",
    docxUrl: null,
    externalUrl: null,
    viewCachePath: "etl/output/marqoom74_hawi_kabir/marqoom74_hawi_kabir_view_cache.json",
  },
  {
    book_id: "marqoom75_majmoo_fatawa",
    title: "كشّاف مجموع فتاوى ابن تيمية مع المستدرك",
    author: "شيخ الإسلام ابن تيمية",
    died_hijri: 728,
    category: "عقيدة",
    xlsxUrl: "/manus-storage/majmoo_fatawa_b76cd436.xlsx",
    docxUrl: null,
    externalUrl: null,
    viewCachePath: "etl/output/marqoom75_majmoo_fatawa/marqoom75_majmoo_fatawa_view_cache.json",
  },
  {
    book_id: "marqoom76_rasail_masail_najdiyya",
    title: "كشّاف مجموعة الرسائل والمسائل النجدية",
    author: "علماء نجد",
    died_hijri: null,
    category: "عقيدة",
    xlsxUrl: "/manus-storage/rasail_masail_najdiyya_0ee878da.xlsx",
    docxUrl: null,
    externalUrl: null,
    viewCachePath: "etl/output/marqoom76_rasail_masail_najdiyya/marqoom76_rasail_masail_najdiyya_view_cache.json",
  },
  {
    book_id: "marqoom77_tarikh_islam_dhahabi",
    title: "كشّاف تاريخ الإسلام للذهبي",
    author: "شمس الدين الذهبي",
    died_hijri: 748,
    category: "تاريخ",
    xlsxUrl: "/manus-storage/tarikh_islam_dhahabi_8b9fc602.xlsx",
    docxUrl: null,
    externalUrl: null,
    viewCachePath: "etl/output/marqoom77_tarikh_islam_dhahabi/marqoom77_tarikh_islam_dhahabi_view_cache.json",
  },
  {
    book_id: "marqoom78_dara_taarus",
    title: "كشّاف درء تعارض العقل والنقل",
    author: "شيخ الإسلام ابن تيمية",
    died_hijri: 728,
    category: "عقيدة",
    xlsxUrl: "/manus-storage/dara_taarus_91895692.xlsx",
    docxUrl: null,
    externalUrl: null,
    viewCachePath: "etl/output/marqoom78_dara_taarus/marqoom78_dara_taarus_view_cache.json",
  },
  {
    book_id: "marqoom79_fath_qadir_ibnahummam",
    title: "كشّاف فتح القدير لابن الهمام",
    author: "كمال الدين ابن الهمام",
    died_hijri: 861,
    category: "فقه",
    xlsxUrl: "/manus-storage/fath_qadir_ibnahummam_5f9eeb4b.xlsx",
    docxUrl: null,
    externalUrl: null,
    viewCachePath: "etl/output/marqoom79_fath_qadir_ibnahummam/marqoom79_fath_qadir_ibnahummam_view_cache.json",
  },
  {
    book_id: "marqoom80_bayan_umrani",
    title: "كشّاف البيان في مذهب الإمام الشافعي للعمراني",
    author: "أبو الحسين يحيى العمراني",
    died_hijri: 558,
    category: "فقه",
    xlsxUrl: "/manus-storage/bayan_umrani_2fe8f0be.xlsx",
    docxUrl: null,
    externalUrl: null,
    viewCachePath: "etl/output/marqoom80_bayan_umrani/marqoom80_bayan_umrani_view_cache.json",
  },
  {
    book_id: "marqoom81_dhakhira_qarafi",
    title: "كشّاف الذخيرة للقرافي",
    author: "شهاب الدين القرافي",
    died_hijri: 684,
    category: "فقه",
    xlsxUrl: "/manus-storage/dhakhira_qarafi_1eb3832b.xlsx",
    docxUrl: null,
    externalUrl: null,
    viewCachePath: "etl/output/marqoom81_dhakhira_qarafi/marqoom81_dhakhira_qarafi_view_cache.json",
  },
  {
    book_id: "marqoom82_maqalat_ashari",
    title: "كشّاف مقالات الإسلاميين للأشعري",
    author: "أبو الحسن الأشعري",
    died_hijri: 324,
    category: "عقيدة",
    xlsxUrl: "/manus-storage/maqalat_ashari_c1ef0094.xlsx",
    docxUrl: null,
    externalUrl: null,
    viewCachePath: "etl/output/marqoom82_maqalat_ashari/marqoom82_maqalat_ashari_view_cache.json",
  },
  {
    book_id: "marqoom83_bahr_muhit_abuhayyan",
    title: "كشّاف البحر المحيط لأبي حيان",
    author: "أبو حيان الأندلسي",
    died_hijri: 745,
    category: "تفسير",
    xlsxUrl: "/manus-storage/bahr_muhit_abuhayyan_02ac3db7.xlsx",
    docxUrl: null,
    externalUrl: null,
    viewCachePath: "etl/output/marqoom83_bahr_muhit_abuhayyan/marqoom83_bahr_muhit_abuhayyan_view_cache.json",
  },
  {
    book_id: "marqoom84_tahrir_tanwir",
    title: "كشّاف التحرير والتنوير لابن عاشور",
    author: "محمد الطاهر بن عاشور",
    died_hijri: 1393,
    category: "تفسير",
    xlsxUrl: "/manus-storage/tahrir_tanwir_b718feb3.xlsx",
    docxUrl: null,
    externalUrl: null,
    viewCachePath: "etl/output/marqoom84_tahrir_tanwir/marqoom84_tahrir_tanwir_view_cache.json",
  },
];

async function main() {
  const conn = await createConnection(DB_URL);
  console.log("Connected to DB");

  let inserted = 0;
  let updated = 0;
  let failed = 0;

  for (const k of KASHAFAT) {
    try {
      // قراءة view_cache.json
      let viewCacheJson = null;
      try {
        viewCacheJson = readFileSync(k.viewCachePath, "utf8");
        JSON.parse(viewCacheJson); // التحقق من صحة JSON
      } catch (e) {
        console.warn(`  ⚠️  view_cache not found or invalid for ${k.book_id}: ${e.message}`);
        viewCacheJson = null;
      }

      // فحص إذا كان الكشاف موجوداً
      const [rows] = await conn.execute(
        "SELECT id FROM kashafat WHERE book_id = ?",
        [k.book_id]
      );

      if (rows.length > 0) {
        // تحديث
        await conn.execute(
          `UPDATE kashafat SET 
            title = ?, author = ?, died_hijri = ?, category = ?,
            xlsx_url = ?, docx_url = ?, external_url = ?,
            view_cache_json = ?, updated_at = NOW()
          WHERE book_id = ?`,
          [
            k.title, k.author, k.died_hijri, k.category,
            k.xlsxUrl, k.docxUrl, k.externalUrl,
            viewCacheJson, k.book_id
          ]
        );
        console.log(`  ✏️  Updated: ${k.book_id}`);
        updated++;
      } else {
        // إدراج جديد
        await conn.execute(
          `INSERT INTO kashafat 
            (book_id, title, author, died_hijri, category, xlsx_url, docx_url, external_url, view_cache_json, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            k.book_id, k.title, k.author, k.died_hijri, k.category,
            k.xlsxUrl, k.docxUrl, k.externalUrl, viewCacheJson
          ]
        );
        console.log(`  ✅ Inserted: ${k.book_id}`);
        inserted++;
      }
    } catch (e) {
      console.error(`  ✗ FAILED ${k.book_id}: ${e.message}`);
      failed++;
    }
  }

  await conn.end();
  console.log(`\n=== Done: ${inserted} inserted, ${updated} updated, ${failed} failed ===`);
}

main().catch(console.error);
