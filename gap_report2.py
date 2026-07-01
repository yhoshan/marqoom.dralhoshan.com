#!/usr/bin/env python3
"""
Gap Report Phase 2: فحص كل كشاف في الحزمة مقابل DB والواجهة
"""
import json, os, re

BATCH_DIR = "/home/ubuntu/upload/batch2"
HOME_TSX = "/home/ubuntu/marqoom/client/src/pages/Home.tsx"

# ─── 1. استخراج الكشافات من الحزمة ───────────────────────────────────────────
files = os.listdir(BATCH_DIR)
batch_books = {}
for f in files:
    base = f.replace("مرقوم_تحليل_", "")
    if base.endswith("_view_cache.json"):
        name = base.replace("_view_cache.json", "")
        batch_books.setdefault(name, {})["view_cache"] = os.path.join(BATCH_DIR, f)
    elif base.endswith("_validation_report.json"):
        name = base.replace("_validation_report.json", "")
        batch_books.setdefault(name, {})["validation"] = os.path.join(BATCH_DIR, f)
    elif base.endswith(".xlsx"):
        name = base.replace(".xlsx", "")
        batch_books.setdefault(name, {})["excel"] = os.path.join(BATCH_DIR, f)

# ─── 2. قراءة IDs من Home.tsx ─────────────────────────────────────────────────
with open(HOME_TSX) as f:
    home_content = f.read()
ids_in_home = set(re.findall(r'id:\s*["\']([^"\'#]+)["\']', home_content))
# فلترة الألوان والفئات
ids_in_home = {i for i in ids_in_home if not i.startswith('#') and len(i) > 3 and i not in {'all','أصول','تراجم','تفسير','حديث','سيرة','عقيدة','فقه','قرآن','لغة'}}

# ─── 3. قراءة DB من audit_phase1.json ────────────────────────────────────────
db_records = {}
if os.path.exists("/tmp/audit_phase1.json"):
    with open("/tmp/audit_phase1.json") as f:
        audit = json.load(f)
    for r in audit:
        kid = r.get('kashafId','')
        db_records[kid] = r

# ─── 4. خريطة الأسماء العربية → kashafId ─────────────────────────────────────
# يدوياً من خلال مقارنة الأسماء العربية مع IDs المعروفة
name_to_id = {
    "الأم_للشافعي": "umm_shafii",
    "الرسالة_للشافعي": "risala",
    "التمهيد_لما_في_الموطا_لابن_عبد_البر": "marqoom91_altamhid",
    "الاستذكار_لابن_عبد_البر": "marqoom92_alistidhkar",
    "الكافي_في_فقه_اهل_المدينة_لابن_عبد_البر": "marqoom93_alkafi_ibnabdulbar",
    "إعلام_الموقعين_لابن_القيم": "marqoom94_ilam_almuwaqqiin",
    "زاد_المعاد_لابن_القيم": "marqoom95_zad_almaaad",
    "مدارج_السالكين_لابن_القيم": "marqoom96_madarij",
    "الجواب_الصحيح_لابن_تيمية": "marqoom97_jawab_sahih",
    "بيان_تلبيس_الجهمية_لابن_تيمية": "marqoom98_bayan_talbis",
    "درء_تعارض_العقل_والنقل_لابن_تيمية": "marqoom78_dara_taarus",
    "مجموع_الفتاوى_والمستدرك_لابن_تيمية": "marqoom75_majmoo_fatawa",
    "تفسير_القرطبي_للقرطبي": "alqurtubi",
    "فتح_الباري_لابن_حجر": "fathalbaari",
    "المجموع_شرح_المهذب_للنووي": "annawawe",
    "المغني_لابن_قدامة": "almughni",
    "بدائع_الصنائع_للكاساني": "albadaei",
    "المستصفى_للغزالي": "mustasfa",
    "تفسير_البيضاوي_لناصر_الدين_البيضاوي": "baydawi",
    "تفسير_ابن_كثير_لابن_كثير": "marqoom86_ibnkathir",
    "الزيادة_والإحسان_في_علوم_القرآن_محمد_عقيلة": "aqeela-ziyadah",
    "مقالات_الإسلاميين_للأشعري": "marqoom82_maqalat_ashari",
    "الموسوعة_الفقهية_الكويتية_مجموعة_من_المؤلفين": "mawsuah_fiqhiyya",
    "كتاب_التوحيد_لابن_خزيمة_الإصدار_2_2": "ibnkhuzaymah",
    "صحيح_البخاري_للبخاري": "bukhari",
    "تقريب_التهذيب_لابن_حجر": "taqrib",
    "فتح_المغيث_للسخاوي": "fath_mughith_sakhawi",
    "البيان_والتبيين_للجاحظ": "marqoom85_bayan_tabyin",
    "الفصل_في_الملل_والاهواء_والنحل_لابن_حزم": "alfasl_ibnhazm",
    "البيان_والتحصيل_لابن_رشد_الجد": "bayan_tahsil",
    "التاريخ_الكبير_للبخاري": "tarikh_kabir",
    "التذكرة_الحمدونية_لابن_حمدون": "tathkira_hamduniya",
    "التمييز_لمسلم": "tamyiz",
    "الطبقات_السنية_في_تراجم_الحنفية_للغزي": "tabaqat_saniyya",
    "الفروع_لابن_مفلح": "alfuroo",
    "الكتاب_لسيبويه": "sibawayh",
    "الإنصاف_للمرداوي": "alinsaf",
    "إحياء_علوم_الدين_للغزالي": "ihyaa",
    "الإتقان_في_علوم_القرآن_للسيوطي": "itqan",
    "أضواء_البيان_للشنقيطي": "adwaa_bayan",
    "بلغة_السالك_للصاوي": "bulgha_salik",
    "تاج_العروس_للزبيدي": "taj_arous",
    "تدريب_الراوي_للسيوطي": "tadrib_rawi_suyuti",
    "تيسير_العزيز_الحميد_لسليمان_بن_عبدالله": "tayseer",
    "شرح_الطحاوية_لابن_أبي_العز": "tahawiyya_ibn_abi_aliz",
    "طبقات_الشافعية_الكبرى_للسبكي": "tabaqat_shafii_subki",
    "فتح_المجيد_لعبد_الرحمن_بن_حسن": "fath_majid",
    "كتاب_التوحيد_محمد_بن_عبدالوهاب": "tawhid",
    "كشاف_القناع_للبهوتي": "kashaf_qinaa",
}

# ─── 5. النسخ القديمة المدمجة المعروفة ────────────────────────────────────────
old_merged = {
    "risala_legacy": {"title": "الرسالة والأم للشافعي (مدمجة)", "replaces": ["risala","umm_shafii"]},
    "ibnabdulbar": {"title": "مصنفات ابن عبد البر (مدمجة)", "replaces": ["marqoom91_altamhid","marqoom92_alistidhkar","marqoom93_alkafi_ibnabdulbar"]},
    "ibntimiah": {"title": "مصنفات ابن تيمية (مدمجة)", "replaces": ["marqoom75_majmoo_fatawa","marqoom78_dara_taarus","marqoom97_jawab_sahih","marqoom98_bayan_talbis"]},
    "ibnalqayyim": {"title": "كتب ابن القيم (مدمجة)", "replaces": ["marqoom94_ilam_almuwaqqiin","marqoom95_zad_almaaad","marqoom96_madarij"]},
}

# ─── 6. بناء التقرير ──────────────────────────────────────────────────────────
results = []
for arabic_name, files_info in sorted(batch_books.items()):
    kashaf_id = name_to_id.get(arabic_name, f"UNKNOWN_{arabic_name}")
    
    # فحص view_cache
    vc_path = files_info.get("view_cache")
    protocol_version = "?"
    validation_passed = "?"
    if vc_path and os.path.exists(vc_path):
        try:
            with open(vc_path) as f:
                vc = json.load(f)
            protocol_version = vc.get("protocol_version") or vc.get("_meta",{}).get("schema_version","?")
        except: pass
    
    # فحص validation
    val_path = files_info.get("validation")
    if val_path and os.path.exists(val_path):
        try:
            with open(val_path) as f:
                vr = json.load(f)
            passed = vr.get("validation_passed") or vr.get("passed") or vr.get("status")
            validation_passed = "✓" if passed in [True,"passed","success"] else f"~{passed}"
        except: validation_passed = "?"
    
    # فحص DB
    in_db = kashaf_id in db_records
    has_storage_key = bool(db_records.get(kashaf_id,{}).get("storageKey"))
    
    # فحص الواجهة
    in_ui = kashaf_id in ids_in_home
    
    # فحص النسخة القديمة
    old_version = None
    for old_id, old_info in old_merged.items():
        if kashaf_id in old_info.get("replaces",[]):
            old_version = old_id
            break
    
    # تحديد الحالة
    if kashaf_id in ["risala", "umm_shafii"]:
        status = "already_registered"
    elif in_db and has_storage_key and in_ui:
        status = "already_registered"
    elif in_db and has_storage_key and not in_ui:
        status = "needs_ui_link"
    elif in_db and not has_storage_key:
        status = "needs_s3_upload"
    else:
        status = "needs_registration"
    
    results.append({
        "arabic_name": arabic_name,
        "kashaf_id": kashaf_id,
        "protocol_version": protocol_version,
        "has_excel": "نعم" if "excel" in files_info else "لا",
        "has_view_cache": "نعم" if "view_cache" in files_info else "لا",
        "has_validation": "نعم" if "validation" in files_info else "لا",
        "validation_passed": validation_passed,
        "in_db": "نعم" if in_db else "لا",
        "has_storage_key": "نعم" if has_storage_key else "لا",
        "in_ui": "نعم" if in_ui else "لا",
        "old_version": old_version or "—",
        "status": status,
    })

# ─── 7. طباعة النتائج ─────────────────────────────────────────────────────────
print(json.dumps(results, ensure_ascii=False, indent=2))

# ─── 8. ملخص ──────────────────────────────────────────────────────────────────
total = len(results)
already = sum(1 for r in results if r["status"] == "already_registered")
needs_reg = sum(1 for r in results if r["status"] == "needs_registration")
needs_s3 = sum(1 for r in results if r["status"] == "needs_s3_upload")
needs_ui = sum(1 for r in results if r["status"] == "needs_ui_link")
has_old = sum(1 for r in results if r["old_version"] != "—")

print(f"\n=== SUMMARY ===")
print(f"إجمالي الحزمة: {total}")
print(f"already_registered: {already}")
print(f"needs_registration: {needs_reg}")
print(f"needs_s3_upload: {needs_s3}")
print(f"needs_ui_link: {needs_ui}")
print(f"لها نسخة قديمة: {has_old}")
