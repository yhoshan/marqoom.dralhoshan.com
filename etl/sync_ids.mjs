/**
 * sync_ids.mjs
 * مزامنة معرّفات قاعدة البيانات مع معرّفات الواجهة في KashafDetail.tsx
 * 
 * الخريطة مبنية بمطابقة عنوان الكتاب بين:
 * - ملفات view_cache.json (book.title) → المعرّف الفعلي في قاعدة البيانات
 * - مصفوفة KASHAFAT في KashafDetail.tsx → المعرّف المستخدم في الواجهة
 * 
 * التحقق: كل سطر تم التحقق منه يدوياً بمطابقة العنوان
 */

import mysql from "mysql2/promise";
import { config } from "dotenv";
config();

// خريطة: معرّف قاعدة البيانات الحالي → معرّف الواجهة الصحيح
// تم التحقق من كل سطر بمطابقة عنوان الكتاب من view_cache.json
const ID_MAP = {
  // ─── الكشافات 20-29 ───────────────────────────────────────
  "marqoom20_sahih_muslim":          "muslim",          // صحيح مسلم
  "marqoom21_sunan_abudawud":        "abudawud",        // سنن أبي داود
  "marqoom22_sunan_tirmidhi":        "tirmidhi",        // سنن الترمذي
  "marqoom23_sunan_ibnmajah":        "ibnmajah",        // سنن ابن ماجه
  "marqoom24_sunan_nasai":           "nasai",           // سنن النسائي
  "marqoom25_musnad_ahmad":          "musnad-ahmad",    // مسند الإمام أحمد
  "marqoom26_muwatta_malik":         "muwatta",         // موطأ مالك
  "marqoom27_sunan_darimi":          "darimi",          // سنن الدارمي
  "marqoom28_sahih_ibnkhuzaymah":    "ibnkhuzaymah",   // صحيح ابن خزيمة
  "marqoom29_sirah_nabawiyyah":      "seerah",          // السيرة النبوية

  // ─── الكشافات 30-39 ───────────────────────────────────────
  "marqoom30_sunan_bayhaqi":         "bayhaqi",         // السنن الكبرى للبيهقي
  "marqoom31_tahdhib_kamal":         "mizzi",           // تهذيب الكمال في أسماء الرجال (المزي)
  "marqoom32_musannaf_ibnabishaybah":"ibnabishaybah",   // مصنف ابن أبي شيبة
  "marqoom33_musannaf_abdulrazzaq":  "abdulrazzaq",     // مصنف عبد الرزاق
  // marqoom34_siyar_alam → dhahabi (موجود بالفعل بالمعرّف الصحيح)
  "marqoom35_tafsir_ibnabihati":     "ibnabihatimt",    // تفسير ابن أبي حاتم
  "marqoom36_awsat_ibnmundhir":      "alawsat",         // الأوسط لابن المنذر
  "marqoom37_sharh_maani_athar":     "tahawi",          // شرح معاني الآثار (للطحاوي)
  "marqoom38_nihaya_gharib":         "nihaya",          // النهاية في غريب الحديث
  "marqoom39_rawdh_anf":             "suhayli",         // الروض الأنف (للسهيلي)

  // ─── الكشافات 40-49 ───────────────────────────────────────
  "marqoom40_alam_zarkali":          "alam_alzarkali",  // الأعلام للزركلي
  "marqoom41_isabah_sahaba":         "isabah_ibn_hajar",// الإصابة في تمييز الصحابة
  "marqoom42_mujam_buldan":          "mujam_albuldan",  // معجم البلدان
  "marqoom43_tafsir_zamakhshari":    "zamakhshari",     // الكشاف عن حقائق التنزيل
  "marqoom44_khalq_afal_bukhari":    "khalq_afal_albukhari", // خلق أفعال العباد
  "marqoom45_sunan_saidbnmansur":    "saeed_ibn_mansur",// سنن سعيد بن منصور
  "marqoom46_sharh_aqida_tahawiyya": "tahawiyya_ibn_abi_aliz", // شرح العقيدة الطحاوية
  "marqoom47_subul_huda_salhi":      "subul_alhuda",    // سبل الهدى والرشاد
  "marqoom48_sharh_usul_lalikai":    "usul_itiqad_allalikai", // شرح أصول اعتقاد أهل السنة
  "marqoom49_lisan_arab":            "lisan_alarab",    // لسان العرب

  // ─── الكشافات 50-57 ───────────────────────────────────────
  "marqoom50_wahidi_wajiz":          "wahidi",          // التفسير الوجيز
  "marqoom51_kuwaiti_fiqh":          "mawsuah_fiqhiyya",// الموسوعة الفقهية الكويتية
  "marqoom52_tafsir_baghawi":        "baghawi",         // معالم التنزيل (تفسير البغوي)
  "marqoom53_tafsir_abusaud":        "abusaud",         // إرشاد العقل السليم (تفسير أبي السعود)
  "marqoom54_tafsir_ibnarafa":       "ibnarafa",        // تفسير ابن عرفة
  "marqoom55_tafsir_nasafi":         "nasafi",          // مدارك التنزيل (تفسير النسفي)
  "marqoom56_tayseer_aziz":          "tayseer",         // تيسير العزيز الحميد
  "marqoom57_jamial_usul":           "jamialasul",      // جامع الأصول في أحاديث الرسول
};

async function main() {
  const db = await mysql.createConnection(process.env.DATABASE_URL);
  let updated = 0;
  let notFound = 0;
  let conflict = 0;

  console.log("🔄 بدء مزامنة معرّفات الكشافات...\n");

  for (const [oldId, newId] of Object.entries(ID_MAP)) {
    // التحقق من وجود السجل القديم
    const [existingRows] = await db.execute(
      "SELECT id FROM kashaf_viewcache WHERE kashafId = ?",
      [oldId]
    );

    if (existingRows.length === 0) {
      console.log(`⚠️  غير موجود في قاعدة البيانات: ${oldId}`);
      notFound++;
      continue;
    }

    // التحقق من عدم وجود تعارض مع المعرّف الجديد
    const [conflictRows] = await db.execute(
      "SELECT id FROM kashaf_viewcache WHERE kashafId = ?",
      [newId]
    );

    if (conflictRows.length > 0) {
      console.log(`⚠️  تعارض: ${newId} موجود بالفعل — تخطي ${oldId}`);
      conflict++;
      continue;
    }

    // تحديث المعرّف
    await db.execute(
      "UPDATE kashaf_viewcache SET kashafId = ? WHERE kashafId = ?",
      [newId, oldId]
    );
    console.log(`✅ ${oldId} → ${newId}`);
    updated++;
  }

  console.log(`\n${"─".repeat(55)}`);
  console.log(`📊 النتيجة النهائية:`);
  console.log(`  ✅ تم تحديث:      ${updated} سجل`);
  console.log(`  ⚠️  تعارض (تخطي): ${conflict} سجل`);
  console.log(`  ❌ غير موجود:      ${notFound} سجل`);
  console.log(`${"─".repeat(55)}`);

  await db.end();
}

main().catch(console.error);
