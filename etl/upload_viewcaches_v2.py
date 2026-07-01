#!/usr/bin/env python3
"""
رفع view_cache.json للكشافات الجديدة وتحديث قاعدة البيانات
"""
import os
import subprocess
import json
import re

BASE_DIR = "/home/ubuntu/upload/new_kashafat"

# خريطة: جزء من اسم الملف العربي → kashaf_id
MAPPING = [
    # كشافات جديدة 86-98
    ("تفسير_ابن_كثير", "marqoom86_ibnkathir"),
    ("الجامع_لعلوم_الإمام_أحمد", "marqoom87_jamia_ahmad"),
    ("الزيادة_والإحسان", "marqoom88_ziyadah_ihsan"),
    ("كتاب_الأغاني", "marqoom89_aghani"),
    ("وفيات_الأعيان", "marqoom90_wafayat"),
    ("التمهيد_لما_في_الموطا", "marqoom91_altamhid"),
    ("الاستذكار", "marqoom92_alistidhkar"),
    ("الكافي_في_فقه", "marqoom93_alkafi_ibnabdulbar"),
    ("إعلام_الموقعين", "marqoom94_ilam_almuwaqqiin"),
    ("زاد_المعاد", "marqoom95_zad_almaaad"),
    ("مدارج_السالكين", "marqoom96_madarij"),
    ("الجواب_الصحيح", "marqoom97_jawab_sahih"),
    ("بيان_تلبيس_الجهمية", "marqoom98_bayan_talbis"),
    # كشافات موجودة بـ view_cache جديدة
    ("المجموع_شرح_المهذب_للنووي", "annawawe"),
    ("المحلى_بالآثار_لابن_حزم", "almuhalla"),
    ("المغني_لابن_قدامة", "almughni"),
    ("بدائع_الصنائع_للكاساني", "albadaei"),
    ("تفسير_الرازي_مفاتيح_الغيب", "alrazi"),
    ("تفسير_القرطبي_للقرطبي", "alqurtubi"),
    ("فتح_الباري_لابن_حجر", "fathalbaari"),
    ("مجموع_الفتاوى_والمستدرك", "marqoom75_majmoo_fatawa"),
    ("درء_تعارض_العقل_والنقل", "marqoom78_dara_taarus"),
]

# الحصول على قائمة الملفات
all_files = os.listdir(BASE_DIR)
view_cache_files = [f for f in all_files if f.endswith("view_cache.json")]

results = []

for arabic_key, kashaf_id in MAPPING:
    # البحث عن الملف
    match_file = None
    for f in view_cache_files:
        if arabic_key in f:
            match_file = f
            break
    
    if not match_file:
        print(f"⚠️  لم يُعثر على ملف لـ {kashaf_id} (المفتاح: {arabic_key})")
        results.append({"kashafId": kashaf_id, "status": "not_found"})
        continue
    
    file_path = os.path.join(BASE_DIR, match_file)
    print(f"📤 رفع {match_file[:60]}... لـ {kashaf_id}")
    
    # رفع الملف
    try:
        result = subprocess.run(
            ["manus-upload-file", "--webdev", file_path],
            capture_output=True, text=True, timeout=60
        )
        output = result.stdout + result.stderr
        
        # استخراج المسار
        match = re.search(r'/manus-storage/[^\s\n]+', output)
        if not match:
            print(f"❌ فشل رفع {kashaf_id}: {output[:100]}")
            results.append({"kashafId": kashaf_id, "status": "upload_failed"})
            continue
        
        storage_path = match.group(0)
        storage_key = storage_path.replace("/manus-storage/", "")
        print(f"✅ رُفع: {storage_path}")
        results.append({"kashafId": kashaf_id, "storageKey": storage_key, "storagePath": storage_path, "status": "uploaded"})
        
    except Exception as e:
        print(f"❌ خطأ في رفع {kashaf_id}: {e}")
        results.append({"kashafId": kashaf_id, "status": "error", "error": str(e)})

# حفظ النتائج
import pathlib
_etl_dir = pathlib.Path(__file__).parent
with open(_etl_dir / "viewcache_upload_results.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"\n📊 الملخص:")
print(f"  ✅ نجح: {sum(1 for r in results if r['status'] == 'uploaded')}")
print(f"  ⚠️  لم يُعثر: {sum(1 for r in results if r['status'] == 'not_found')}")
print(f"  ❌ فشل: {sum(1 for r in results if r['status'] in ['upload_failed', 'error'])}")
