/**
 * تسجيل view_cache الجديدة في قاعدة البيانات
 */
import mysql from "mysql2/promise";

const RECORDS = [
  // كشافات جديدة 86-98
  { kashafId: "marqoom86_ibnkathir", storageKey: "ibnkathir_viewcache_88772f23.json", schemaVersion: "v2.2" },
  { kashafId: "marqoom87_jamia_ahmad", storageKey: "jamia_ahmad_viewcache_29a9edab.json", schemaVersion: "v2.2" },
  { kashafId: "marqoom88_ziyadah_ihsan", storageKey: "ziyadah_ihsan_viewcache_cbb9bb1f.json", schemaVersion: "v2.2" },
  { kashafId: "marqoom89_aghani", storageKey: "aghani_viewcache_fb7a069a.json", schemaVersion: "v2.2" },
  { kashafId: "marqoom90_wafayat", storageKey: "wafayat_viewcache_73601994.json", schemaVersion: "v2.2" },
  { kashafId: "marqoom91_altamhid", storageKey: "altamhid_viewcache_b713097b.json", schemaVersion: "v2.2" },
  { kashafId: "marqoom92_alistidhkar", storageKey: "alistidhkar_viewcache_0ea44c71.json", schemaVersion: "v2.2" },
  { kashafId: "marqoom93_alkafi_ibnabdulbar", storageKey: "alkafi_ibnabdulbar_viewcache_c0599d7c.json", schemaVersion: "v2.2" },
  { kashafId: "marqoom94_ilam_almuwaqqiin", storageKey: "ilam_almuwaqqiin_viewcache_eacd2f50.json", schemaVersion: "v2.2" },
  { kashafId: "marqoom95_zad_almaaad", storageKey: "zad_almaaad_viewcache_8f71eb90.json", schemaVersion: "v2.2" },
  { kashafId: "marqoom96_madarij", storageKey: "madarij_viewcache_1de4f632.json", schemaVersion: "v2.2" },
  { kashafId: "marqoom97_jawab_sahih", storageKey: "jawab_sahih_viewcache_2366ed09.json", schemaVersion: "v2.2" },
  { kashafId: "marqoom98_bayan_talbis", storageKey: "bayan_talbis_viewcache_a7939dfa.json", schemaVersion: "v2.2" },
  // كشافات موجودة محدّثة
  { kashafId: "annawawe", storageKey: "annawawe_viewcache_88827e07.json", schemaVersion: "v2.2" },
  { kashafId: "almuhalla", storageKey: "almuhalla_viewcache_1c4ca55d.json", schemaVersion: "v2.2" },
  { kashafId: "almughni", storageKey: "almughni_viewcache_38df8421.json", schemaVersion: "v2.2" },
  { kashafId: "albadaei", storageKey: "albadaei_viewcache_7ea8aa5c.json", schemaVersion: "v2.2" },
  { kashafId: "alrazi", storageKey: "alrazi_viewcache_9df0ad95.json", schemaVersion: "v2.2" },
  { kashafId: "alqurtubi", storageKey: "alqurtubi_viewcache_016b29f6.json", schemaVersion: "v2.2" },
  { kashafId: "fathalbaari", storageKey: "fathalbaari_viewcache_1f422fb4.json", schemaVersion: "v2.2" },
  { kashafId: "marqoom75_majmoo_fatawa", storageKey: "majmoo_fatawa_viewcache_fda82065.json", schemaVersion: "v2.2" },
  { kashafId: "marqoom78_dara_taarus", storageKey: "dara_taarus_viewcache_acd5abf6.json", schemaVersion: "v2.2" },
];

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  let success = 0;
  let failed = 0;
  
  for (const { kashafId, storageKey, schemaVersion } of RECORDS) {
    try {
      await conn.execute(
        `INSERT INTO kashaf_viewcache (kashafId, storageKey, schemaVersion, generatedAt)
         VALUES (?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE storageKey = ?, schemaVersion = ?, generatedAt = NOW()`,
        [kashafId, storageKey, schemaVersion, storageKey, schemaVersion]
      );
      console.log(`✅ ${kashafId} → ${storageKey}`);
      success++;
    } catch (e) {
      console.error(`❌ ${kashafId}: ${e.message}`);
      failed++;
    }
  }
  
  await conn.end();
  console.log(`\n📊 النتائج: ✅ ${success} نجح | ❌ ${failed} فشل`);
}

main().catch(console.error);
