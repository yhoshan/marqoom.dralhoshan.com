#!/usr/bin/env python3
"""
build_id_map.py — بناء خريطة دقيقة بمطابقة الكتب بين batch_etl.py وKashafDetail.tsx
يستخدم بيانات الكتاب (العنوان والمؤلف) لمطابقة المعرّفات بشكل آمن
"""

import json
import re

# ============================================================
# بيانات الكشافات من batch_etl.py (المعرّف في قاعدة البيانات)
# ============================================================
BATCH_KASHAFAT = [
    {"db_id": "fathalbaari", "title": "فتح الباري بشرح صحيح البخاري", "author": "ابن حجر العسقلاني"},
    {"db_id": "ibnabdulbar", "title": "كتب ابن عبد البر الثلاثة", "author": "ابن عبد البر القرطبي"},
    {"db_id": "ibntimiah", "title": "كتب ابن تيمية الخمسة", "author": "شيخ الإسلام ابن تيمية"},
    {"db_id": "alrazi", "title": "مفاتيح الغيب (التفسير الكبير)", "author": "فخر الدين الرازي"},
    {"db_id": "alqurtubi", "title": "الجامع لأحكام القرآن", "author": "القرطبي"},
    {"db_id": "altabari", "title": "جامع البيان في تأويل القرآن", "author": "ابن جرير الطبري"},
    {"db_id": "annawawe", "title": "المجموع شرح المهذب", "author": "الإمام النووي"},
    {"db_id": "almuhalla", "title": "المحلى بالآثار", "author": "ابن حزم الأندلسي"},
    {"db_id": "almughni", "title": "المغني شرح مختصر الخرقي", "author": "ابن قدامة المقدسي"},
    {"db_id": "albadaei", "title": "بدائع الصنائع في ترتيب الشرائع", "author": "علاء الدين الكاساني"},
    {"db_id": "ibnalqayyim", "title": "كتب ابن القيم الثلاثة", "author": "ابن قيم الجوزية"},
    # 12-19
    {"db_id": "bukhari", "title": "صحيح البخاري", "author": "الإمام البخاري"},
    {"db_id": "tamyiz", "title": "التمييز لمسلم", "author": "الإمام مسلم"},
    {"db_id": "risala", "title": "الرسالة والأم للشافعي", "author": "الإمام الشافعي"},
    {"db_id": "mustasfa", "title": "المستصفى من علم الأصول", "author": "الغزالي"},
    {"db_id": "baydawi", "title": "أنوار التنزيل وأسرار التأويل", "author": "البيضاوي"},
    {"db_id": "tawhid", "title": "كتاب التوحيد", "author": "محمد بن عبد الوهاب"},
    {"db_id": "sibawayh", "title": "الكتاب لسيبويه", "author": "سيبويه"},
    {"db_id": "rawdh", "title": "الروض المربع", "author": "البهوتي"},
    # 20-29
    {"db_id": "muslim", "title": "صحيح مسلم", "author": "الإمام مسلم"},
    {"db_id": "tirmidhi", "title": "سنن الترمذي", "author": "الترمذي"},
    {"db_id": "musnad-ahmad", "title": "مسند الإمام أحمد", "author": "الإمام أحمد بن حنبل"},
    {"db_id": "abudawud", "title": "سنن أبي داود", "author": "أبو داود السجستاني"},
    {"db_id": "ibnmajah", "title": "سنن ابن ماجه", "author": "ابن ماجه"},
    {"db_id": "nasai", "title": "سنن النسائي", "author": "النسائي"},
    {"db_id": "darimi", "title": "سنن الدارمي", "author": "الدارمي"},
    {"db_id": "muwatta", "title": "موطأ مالك", "author": "الإمام مالك"},
    {"db_id": "ibnkhuzaymah", "title": "صحيح ابن خزيمة", "author": "ابن خزيمة"},
    {"db_id": "seerah", "title": "السيرة النبوية", "author": "ابن هشام"},
    # 30-39
    {"db_id": "alawsat", "title": "الأوسط لابن المنذر", "author": "ابن المنذر"},
    {"db_id": "tahawi", "title": "شرح معاني الآثار", "author": "الطحاوي"},
    {"db_id": "suhayli", "title": "الروض الأنف", "author": "السهيلي"},
    {"db_id": "nihaya", "title": "النهاية في غريب الحديث والأثر", "author": "ابن الأثير"},
    {"db_id": "dhahabi", "title": "سير أعلام النبلاء", "author": "الذهبي"},
    {"db_id": "mizzi", "title": "تهذيب الكمال في أسماء الرجال", "author": "المزي"},
    {"db_id": "ibnabishaybah", "title": "مصنف ابن أبي شيبة", "author": "ابن أبي شيبة"},
    {"db_id": "ibnabihatimt", "title": "تفسير ابن أبي حاتم", "author": "ابن أبي حاتم الرازي"},
    {"db_id": "bayhaqi", "title": "السنن الكبرى للبيهقي", "author": "البيهقي"},
    {"db_id": "abdulrazzaq", "title": "مصنف عبد الرزاق", "author": "عبد الرزاق الصنعاني"},
    # 40-49
    {"db_id": "zamakhshari", "title": "الكشاف عن حقائق التنزيل", "author": "الزمخشري"},
    {"db_id": "saeed_ibn_mansur", "title": "سنن سعيد بن منصور", "author": "سعيد بن منصور"},
    {"db_id": "subul_alhuda", "title": "سبل الهدى والرشاد", "author": "الصالحي الشامي"},
    {"db_id": "isabah_ibn_hajar", "title": "الإصابة في تمييز الصحابة", "author": "ابن حجر العسقلاني"},
    {"db_id": "mujam_albuldan", "title": "معجم البلدان", "author": "ياقوت الحموي"},
    {"db_id": "alam_alzarkali", "title": "الأعلام للزركلي", "author": "خير الدين الزركلي"},
    {"db_id": "tahawiyya_ibn_abi_aliz", "title": "شرح العقيدة الطحاوية", "author": "ابن أبي العز الحنفي"},
    {"db_id": "khalq_afal_albukhari", "title": "خلق أفعال العباد", "author": "الإمام البخاري"},
    {"db_id": "usul_itiqad_allalikai", "title": "شرح أصول اعتقاد أهل السنة", "author": "اللالكائي"},
    {"db_id": "lisan_alarab", "title": "لسان العرب", "author": "ابن منظور"},
    # 50-59
    {"db_id": "wahidi", "title": "التفسير الوجيز", "author": "الواحدي"},
    {"db_id": "mawsuah_fiqhiyya", "title": "الموسوعة الفقهية الكويتية", "author": "وزارة الأوقاف الكويتية"},
    {"db_id": "baghawi", "title": "معالم التنزيل (تفسير البغوي)", "author": "البغوي"},
    {"db_id": "abusaud", "title": "إرشاد العقل السليم (تفسير أبي السعود)", "author": "أبو السعود"},
    {"db_id": "ibnarafa", "title": "تفسير ابن عرفة", "author": "ابن عرفة التونسي"},
    {"db_id": "nasafi", "title": "مدارك التنزيل (تفسير النسفي)", "author": "النسفي"},
    {"db_id": "tayseer", "title": "تيسير العزيز الحميد", "author": "سليمان بن عبد الله آل الشيخ"},
    {"db_id": "jamialasul", "title": "جامع الأصول في أحاديث الرسول", "author": "ابن الأثير"},
    {"db_id": "barbahary", "title": "شرح السنة", "author": "البربهاري"},
    {"db_id": "ibmandah", "title": "الرد على الجهمية", "author": "ابن منده"},
    # 60-70
    {"db_id": "sarakhsi_usul", "title": "أصول السرخسي", "author": "السرخسي"},
    {"db_id": "bahr_muhit_zarkashi", "title": "البحر المحيط في التفسير", "author": "أبو حيان الأندلسي"},
    {"db_id": "tadrib_rawi_suyuti", "title": "تدريب الراوي", "author": "السيوطي"},
    {"db_id": "jamia_bayan_dani", "title": "جامع البيان في القراءات السبع", "author": "الداني"},
    {"db_id": "rawda_taqrir", "title": "روضة التقرير", "author": "ابن قيم الجوزية"},
    {"db_id": "rawda_nazir_ibn_qudama", "title": "روضة الناظر وجنة المناظر", "author": "ابن قدامة المقدسي"},
    {"db_id": "sharh_tayba_nuwayri", "title": "شرح طيبة النشر", "author": "النويري"},
    {"db_id": "sharh_mukhtasar_rawda_tufi", "title": "شرح مختصر الروضة", "author": "الطوفي"},
    {"db_id": "fath_mughith_sakhawi", "title": "فتح المغيث", "author": "السخاوي"},
    {"db_id": "mujam_udaba_yaqut", "title": "معجم الأدباء", "author": "ياقوت الحموي"},
    {"db_id": "aqeela-ziyadah", "title": "العقيلة وزيادة", "author": "الشاطبي"},
]

# ============================================================
# بيانات الكشافات من batch_etl.py (المعرّف الفعلي في قاعدة البيانات)
# هذه هي المعرّفات التي سجّلها register_all.mjs
# ============================================================
ACTUAL_DB_IDS = {
    # الكتاب (عنوان مختصر) → المعرّف الفعلي في قاعدة البيانات
    "صحيح البخاري": "bukhari",
    "التمييز لمسلم": "tamyiz",
    "الرسالة والأم للشافعي": "risala",
    "المستصفى من علم الأصول": "mustasfa",
    "أنوار التنزيل وأسرار التأويل": "baydawi",
    "كتاب التوحيد": "tawhid",
    "الكتاب لسيبويه": "sibawayh",
    "الروض المربع": "rawdh",
    "صحيح مسلم": "muslim",
    "سنن أبي داود": "marqoom21_sunan_abudawud",
    "سنن الترمذي": "marqoom22_sunan_tirmidhi",
    "سنن ابن ماجه": "marqoom23_sunan_ibnmajah",
    "سنن النسائي": "marqoom24_sunan_nasai",
    "مسند الإمام أحمد": "marqoom25_musnad_ahmad",
    "موطأ مالك": "marqoom26_muwatta_malik",
    "سنن الدارمي": "marqoom27_sunan_darimi",
    "صحيح ابن خزيمة": "marqoom28_sahih_ibnkhuzaymah",
    "السيرة النبوية": "marqoom29_sirah_nabawiyyah",
    "السنن الكبرى للبيهقي": "marqoom30_sunan_bayhaqi",
    "تهذيب الكمال في أسماء الرجال": "marqoom31_tahdhib_kamal",
    "مصنف ابن أبي شيبة": "marqoom32_musannaf_ibnabishaybah",
    "مصنف عبد الرزاق": "marqoom33_musannaf_abdulrazzaq",
    "سير أعلام النبلاء": "dhahabi",
    "تفسير ابن أبي حاتم": "marqoom35_tafsir_ibnabihati",
    "الأوسط لابن المنذر": "marqoom36_awsat_ibnmundhir",
    "شرح معاني الآثار": "marqoom37_sharh_maani_athar",
    "النهاية في غريب الحديث والأثر": "marqoom38_nihaya_gharib",
    "الروض الأنف": "marqoom39_rawdh_anf",
    "الأعلام للزركلي": "marqoom40_alam_zarkali",
    "الإصابة في تمييز الصحابة": "marqoom41_isabah_sahaba",
    "معجم البلدان": "marqoom42_mujam_buldan",
    "الكشاف عن حقائق التنزيل": "marqoom43_tafsir_zamakhshari",
    "خلق أفعال العباد": "marqoom44_khalq_afal_bukhari",
    "سنن سعيد بن منصور": "marqoom45_sunan_saidbnmansur",
    "شرح العقيدة الطحاوية": "marqoom46_sharh_aqida_tahawiyya",
    "سبل الهدى والرشاد": "marqoom47_subul_huda_salhi",
    "شرح أصول اعتقاد أهل السنة": "marqoom48_sharh_usul_lalikai",
    "لسان العرب": "marqoom49_lisan_arab",
    "التفسير الوجيز": "marqoom50_wahidi_wajiz",
    "الموسوعة الفقهية الكويتية": "marqoom51_kuwaiti_fiqh",
    "معالم التنزيل (تفسير البغوي)": "marqoom52_tafsir_baghawi",
    "إرشاد العقل السليم (تفسير أبي السعود)": "marqoom53_tafsir_abusaud",
    "تفسير ابن عرفة": "marqoom54_tafsir_ibnarafa",
    "مدارك التنزيل (تفسير النسفي)": "marqoom55_tafsir_nasafi",
    "تيسير العزيز الحميد": "marqoom56_tayseer_aziz",
    "جامع الأصول في أحاديث الرسول": "marqoom57_jamial_usul",
    "شرح السنة": "barbahary",
    "الرد على الجهمية": "ibmandah",
    "أصول السرخسي": "sarakhsi_usul",
}

# بناء الخريطة: db_id_actual → frontend_id
print("// خريطة المزامنة الصحيحة:")
print("const ID_MAP = {")
for item in BATCH_KASHAFAT:
    frontend_id = item["db_id"]
    title = item["title"]
    actual_db_id = ACTUAL_DB_IDS.get(title, frontend_id)
    
    if actual_db_id != frontend_id:
        print(f'  "{actual_db_id}": "{frontend_id}",  // {title}')

print("};")
