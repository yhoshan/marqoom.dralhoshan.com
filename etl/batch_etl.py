#!/usr/bin/env python3
"""
batch_etl.py — تشغيل ETL على جميع الكشافات المنظمة دفعة واحدة
الاستخدام: python3 etl/batch_etl.py [--dry-run] [--only-new]
"""

import os
import sys
import json
import subprocess
import argparse
from pathlib import Path

# ============================================================
# خريطة الكشافات: kashaf_id → بيانات الكشاف + مسار Excel
# ============================================================

KASHAFAT_MAP = [
    # الكشافات الـ 11 الرئيسية
    {
        "kashaf_id": "fathalbaari",
        "book_id": "marqoom-1",
        "title": "فتح الباري بشرح صحيح البخاري",
        "author": "ابن حجر العسقلاني",
        "died_hijri": 852,
        "category": "حديث",
        "excel": "/home/ubuntu/kashafat_branded/marqoom_fathalbaari.xlsx",
    },
    {
        "kashaf_id": "ibnabdulbar",
        "book_id": "marqoom-2",
        "title": "كتب ابن عبد البر الثلاثة",
        "author": "ابن عبد البر القرطبي",
        "died_hijri": 463,
        "category": "حديث",
        "excel": "/home/ubuntu/kashafat_branded/marqoom_ibnabdulbar.xlsx",
    },
    {
        "kashaf_id": "ibntimiah",
        "book_id": "marqoom-3",
        "title": "كتب ابن تيمية الخمسة",
        "author": "شيخ الإسلام ابن تيمية",
        "died_hijri": 728,
        "category": "عقيدة",
        "excel": "/home/ubuntu/kashafat_branded/marqoom_ibntimiah.xlsx",
    },
    {
        "kashaf_id": "alrazi",
        "book_id": "marqoom-4",
        "title": "مفاتيح الغيب (التفسير الكبير)",
        "author": "فخر الدين الرازي",
        "died_hijri": 606,
        "category": "تفسير",
        "excel": "/home/ubuntu/kashafat_branded/marqoom_alrazi.xlsx",
    },
    {
        "kashaf_id": "alqurtubi",
        "book_id": "marqoom-5",
        "title": "الجامع لأحكام القرآن",
        "author": "القرطبي",
        "died_hijri": 671,
        "category": "تفسير",
        "excel": "/home/ubuntu/kashafat_branded/marqoom_alqurtubi.xlsx",
    },
    {
        "kashaf_id": "altabari",
        "book_id": "marqoom-6",
        "title": "جامع البيان في تأويل القرآن",
        "author": "ابن جرير الطبري",
        "died_hijri": 310,
        "category": "تفسير",
        "excel": "/home/ubuntu/kashafat_branded/marqoom_altabari.xlsx",
    },
    {
        "kashaf_id": "annawawe",
        "book_id": "marqoom-7",
        "title": "المجموع شرح المهذب",
        "author": "الإمام النووي",
        "died_hijri": 676,
        "category": "فقه",
        "excel": "/home/ubuntu/kashafat_branded/marqoom_annawawe.xlsx",
    },
    {
        "kashaf_id": "almuhalla",
        "book_id": "marqoom-8",
        "title": "المحلى بالآثار",
        "author": "ابن حزم الأندلسي",
        "died_hijri": 456,
        "category": "فقه",
        "excel": "/home/ubuntu/kashafat_branded/marqoom_almuhalla.xlsx",
    },
    {
        "kashaf_id": "almughni",
        "book_id": "marqoom-9",
        "title": "المغني شرح مختصر الخرقي",
        "author": "ابن قدامة المقدسي",
        "died_hijri": 620,
        "category": "فقه",
        "excel": "/home/ubuntu/kashafat_branded/marqoom_almughni.xlsx",
    },
    {
        "kashaf_id": "albadaei",
        "book_id": "marqoom-10",
        "title": "بدائع الصنائع في ترتيب الشرائع",
        "author": "علاء الدين الكاساني",
        "died_hijri": 587,
        "category": "فقه",
        "excel": "/home/ubuntu/kashafat_branded/marqoom_albadaei.xlsx",
    },
    {
        "kashaf_id": "ibnalqayyim",
        "book_id": "marqoom-11",
        "title": "كتب ابن القيم الثلاثة",
        "author": "ابن قيم الجوزية",
        "died_hijri": 751,
        "category": "عقيدة",
        "excel": "/home/ubuntu/kashafat_branded/marqoom_ibnalqayyim.xlsx",
    },
    # الكشافات 12-19
    {
        "kashaf_id": "marqoom12_bukhari",
        "book_id": "marqoom-12",
        "title": "صحيح البخاري",
        "author": "الإمام البخاري",
        "died_hijri": 256,
        "category": "حديث",
        "excel": "/home/ubuntu/webdev-static-assets/marqoom12_bukhari.xlsx",
    },
    {
        "kashaf_id": "marqoom13_tamyiz_muslim",
        "book_id": "marqoom-13",
        "title": "التمييز لمسلم",
        "author": "الإمام مسلم",
        "died_hijri": 261,
        "category": "حديث",
        "excel": "/home/ubuntu/webdev-static-assets/marqoom13_tamyiz_muslim.xlsx",
    },
    {
        "kashaf_id": "marqoom14_risala_umm_shafii",
        "book_id": "marqoom-14",
        "title": "الرسالة والأم للشافعي",
        "author": "الإمام الشافعي",
        "died_hijri": 204,
        "category": "فقه",
        "excel": "/home/ubuntu/webdev-static-assets/marqoom14_risala_umm_shafii.xlsx",
    },
    {
        "kashaf_id": "marqoom15_mustasfa_ghazali",
        "book_id": "marqoom-15",
        "title": "المستصفى من علم الأصول",
        "author": "الغزالي",
        "died_hijri": 505,
        "category": "فقه",
        "excel": "/home/ubuntu/webdev-static-assets/marqoom15_mustasfa_ghazali.xlsx",
    },
    {
        "kashaf_id": "marqoom16_tafsir_baydawi",
        "book_id": "marqoom-16",
        "title": "أنوار التنزيل وأسرار التأويل",
        "author": "البيضاوي",
        "died_hijri": 685,
        "category": "تفسير",
        "excel": "/home/ubuntu/webdev-static-assets/marqoom16_tafsir_baydawi.xlsx",
    },
    {
        "kashaf_id": "marqoom17_tawhid_ibnabdulwahhab",
        "book_id": "marqoom-17",
        "title": "كتاب التوحيد",
        "author": "محمد بن عبد الوهاب",
        "died_hijri": 1206,
        "category": "عقيدة",
        "excel": "/home/ubuntu/webdev-static-assets/marqoom17_tawhid_ibnabdulwahhab.xlsx",
    },
    {
        "kashaf_id": "marqoom18_kitab_sibawayh",
        "book_id": "marqoom-18",
        "title": "الكتاب لسيبويه",
        "author": "سيبويه",
        "died_hijri": 180,
        "category": "لغة",
        "excel": "/home/ubuntu/webdev-static-assets/marqoom18_kitab_sibawayh.xlsx",
    },
    {
        "kashaf_id": "marqoom19_rawdh_murbaa",
        "book_id": "marqoom-19",
        "title": "الروض المربع",
        "author": "البهوتي",
        "died_hijri": 1051,
        "category": "فقه",
        "excel": "/home/ubuntu/webdev-static-assets/marqoom19_rawdh_murbaa.xlsx",
    },
    # الكشافات 20-29 (branded4)
    {
        "kashaf_id": "marqoom20_sahih_muslim",
        "book_id": "marqoom-20",
        "title": "صحيح مسلم",
        "author": "الإمام مسلم",
        "died_hijri": 261,
        "category": "حديث",
        "excel": "/home/ubuntu/webdev-static-assets/branded3/marqoom21_muslim.xlsx",
    },
    {
        "kashaf_id": "marqoom21_sunan_abudawud",
        "book_id": "marqoom-21",
        "title": "سنن أبي داود",
        "author": "أبو داود السجستاني",
        "died_hijri": 275,
        "category": "حديث",
        "excel": "/home/ubuntu/webdev-static-assets/branded3/marqoom23_abudawud.xlsx",
    },
    {
        "kashaf_id": "marqoom22_sunan_tirmidhi",
        "book_id": "marqoom-22",
        "title": "سنن الترمذي",
        "author": "الترمذي",
        "died_hijri": 279,
        "category": "حديث",
        "excel": "/home/ubuntu/webdev-static-assets/branded3/marqoom20_tirmidhi.xlsx",
    },
    {
        "kashaf_id": "marqoom23_sunan_ibnmajah",
        "book_id": "marqoom-23",
        "title": "سنن ابن ماجه",
        "author": "ابن ماجه",
        "died_hijri": 273,
        "category": "حديث",
        "excel": "/home/ubuntu/webdev-static-assets/branded3/marqoom24_ibnmajah.xlsx",
    },
    {
        "kashaf_id": "marqoom24_sunan_nasai",
        "book_id": "marqoom-24",
        "title": "سنن النسائي",
        "author": "النسائي",
        "died_hijri": 303,
        "category": "حديث",
        "excel": "/home/ubuntu/webdev-static-assets/branded3/marqoom25_nasai.xlsx",
    },
    {
        "kashaf_id": "marqoom25_musnad_ahmad",
        "book_id": "marqoom-25",
        "title": "مسند الإمام أحمد",
        "author": "الإمام أحمد بن حنبل",
        "died_hijri": 241,
        "category": "حديث",
        "excel": "/home/ubuntu/webdev-static-assets/branded3/marqoom22_musnad_ahmad.xlsx",
    },
    {
        "kashaf_id": "marqoom26_muwatta_malik",
        "book_id": "marqoom-26",
        "title": "موطأ مالك",
        "author": "الإمام مالك",
        "died_hijri": 179,
        "category": "حديث",
        "excel": "/home/ubuntu/webdev-static-assets/branded3/marqoom27_muwatta.xlsx",
    },
    {
        "kashaf_id": "marqoom27_sunan_darimi",
        "book_id": "marqoom-27",
        "title": "سنن الدارمي",
        "author": "الدارمي",
        "died_hijri": 255,
        "category": "حديث",
        "excel": "/home/ubuntu/webdev-static-assets/branded3/marqoom26_darimi.xlsx",
    },
    {
        "kashaf_id": "marqoom28_sahih_ibnkhuzaymah",
        "book_id": "marqoom-28",
        "title": "صحيح ابن خزيمة",
        "author": "ابن خزيمة",
        "died_hijri": 311,
        "category": "حديث",
        "excel": "/home/ubuntu/webdev-static-assets/branded3/marqoom28_ibnkhuzaymah.xlsx",
    },
    {
        "kashaf_id": "marqoom29_sirah_nabawiyyah",
        "book_id": "marqoom-29",
        "title": "السيرة النبوية",
        "author": "ابن هشام",
        "died_hijri": 218,
        "category": "تاريخ",
        "excel": "/home/ubuntu/webdev-static-assets/branded3/marqoom29_seerah.xlsx",
    },
    # الكشافات 30-39 (branded4 فعلياً)
    {
        "kashaf_id": "marqoom30_sunan_bayhaqi",
        "book_id": "marqoom-30",
        "title": "السنن الكبرى للبيهقي",
        "author": "البيهقي",
        "died_hijri": 458,
        "category": "حديث",
        "excel": "/home/ubuntu/webdev-static-assets/branded4/marqoom34_sunan_kubra_bayhaqi.xlsx",
    },
    {
        "kashaf_id": "marqoom31_tahdhib_kamal",
        "book_id": "marqoom-31",
        "title": "تهذيب الكمال في أسماء الرجال",
        "author": "المزي",
        "died_hijri": 742,
        "category": "حديث",
        "excel": "/home/ubuntu/webdev-static-assets/branded4/marqoom35_tahdhib_alkamal_almizzi.xlsx",
    },
    {
        "kashaf_id": "marqoom32_musannaf_ibnabishaybah",
        "book_id": "marqoom-32",
        "title": "مصنف ابن أبي شيبة",
        "author": "ابن أبي شيبة",
        "died_hijri": 235,
        "category": "حديث",
        "excel": "/home/ubuntu/webdev-static-assets/branded4/marqoom36_musannaf_ibn_abi_shayba.xlsx",
    },
    {
        "kashaf_id": "marqoom33_musannaf_abdulrazzaq",
        "book_id": "marqoom-33",
        "title": "مصنف عبد الرزاق",
        "author": "عبد الرزاق الصنعاني",
        "died_hijri": 211,
        "category": "حديث",
        "excel": "/home/ubuntu/webdev-static-assets/branded4/marqoom39_musannaf_abdulrazzaq.xlsx",
    },
    {
        "kashaf_id": "marqoom34_siyar_alam",
        "book_id": "marqoom-34",
        "title": "سير أعلام النبلاء",
        "author": "الذهبي",
        "died_hijri": 748,
        "category": "تاريخ",
        "excel": "/home/ubuntu/webdev-static-assets/branded4/marqoom38_siyar_alam_nubala_dhahabi.xlsx",
    },
    {
        "kashaf_id": "marqoom35_tafsir_ibnabihati",
        "book_id": "marqoom-35",
        "title": "تفسير ابن أبي حاتم",
        "author": "ابن أبي حاتم الرازي",
        "died_hijri": 327,
        "category": "تفسير",
        "excel": "/home/ubuntu/webdev-static-assets/branded4/marqoom37_tafsir_ibn_abi_hatim.xlsx",
    },
    {
        "kashaf_id": "marqoom36_awsat_ibnmundhir",
        "book_id": "marqoom-36",
        "title": "الأوسط لابن المنذر",
        "author": "ابن المنذر",
        "died_hijri": 318,
        "category": "فقه",
        "excel": "/home/ubuntu/webdev-static-assets/branded4/marqoom30_alawsat_ibn_almundhir.xlsx",
    },
    {
        "kashaf_id": "marqoom37_sharh_maani_athar",
        "book_id": "marqoom-37",
        "title": "شرح معاني الآثار",
        "author": "الطحاوي",
        "died_hijri": 321,
        "category": "حديث",
        "excel": "/home/ubuntu/webdev-static-assets/branded4/marqoom31_sharh_maani_alathar_tahawi.xlsx",
    },
    {
        "kashaf_id": "marqoom38_nihaya_gharib",
        "book_id": "marqoom-38",
        "title": "النهاية في غريب الحديث والأثر",
        "author": "ابن الأثير",
        "died_hijri": 606,
        "category": "حديث",
        "excel": "/home/ubuntu/webdev-static-assets/branded4/marqoom33_nihaya_gharib_hadith_ibn_atheer.xlsx",
    },
    {
        "kashaf_id": "marqoom39_rawdh_anf",
        "book_id": "marqoom-39",
        "title": "الروض الأنف",
        "author": "السهيلي",
        "died_hijri": 581,
        "category": "تاريخ",
        "excel": "/home/ubuntu/webdev-static-assets/branded4/marqoom32_rawdh_alnf_suhayli.xlsx",
    },
    # الكشافات 40-49 (branded5 فعلياً)
    {
        "kashaf_id": "marqoom40_alam_zarkali",
        "book_id": "marqoom-40",
        "title": "الأعلام للزركلي",
        "author": "خير الدين الزركلي",
        "died_hijri": 1396,
        "category": "تاريخ",
        "excel": "/home/ubuntu/webdev-static-assets/branded5/marqoom45_alam_alzarkali.xlsx",
    },
    {
        "kashaf_id": "marqoom41_isabah_sahaba",
        "book_id": "marqoom-41",
        "title": "الإصابة في تمييز الصحابة",
        "author": "ابن حجر العسقلاني",
        "died_hijri": 852,
        "category": "حديث",
        "excel": "/home/ubuntu/webdev-static-assets/branded5/marqoom43_isabah_ibn_hajar.xlsx",
    },
    {
        "kashaf_id": "marqoom42_mujam_buldan",
        "book_id": "marqoom-42",
        "title": "معجم البلدان",
        "author": "ياقوت الحموي",
        "died_hijri": 626,
        "category": "تاريخ",
        "excel": "/home/ubuntu/webdev-static-assets/branded5/marqoom44_mujam_albuldan_yaqut.xlsx",
    },
    {
        "kashaf_id": "marqoom43_tafsir_zamakhshari",
        "book_id": "marqoom-43",
        "title": "الكشاف عن حقائق التنزيل",
        "author": "الزمخشري",
        "died_hijri": 538,
        "category": "تفسير",
        "excel": "/home/ubuntu/webdev-static-assets/branded5/marqoom40_zamakhshari_kashaf.xlsx",
    },
    {
        "kashaf_id": "marqoom44_khalq_afal_bukhari",
        "book_id": "marqoom-44",
        "title": "خلق أفعال العباد",
        "author": "الإمام البخاري",
        "died_hijri": 256,
        "category": "عقيدة",
        "excel": "/home/ubuntu/webdev-static-assets/branded5/marqoom47_khalq_afal_albukhari.xlsx",
    },
    {
        "kashaf_id": "marqoom45_sunan_saidbnmansur",
        "book_id": "marqoom-45",
        "title": "سنن سعيد بن منصور",
        "author": "سعيد بن منصور",
        "died_hijri": 227,
        "category": "حديث",
        "excel": "/home/ubuntu/webdev-static-assets/branded5/marqoom41_saeed_ibn_mansur.xlsx",
    },
    {
        "kashaf_id": "marqoom46_sharh_aqida_tahawiyya",
        "book_id": "marqoom-46",
        "title": "شرح العقيدة الطحاوية",
        "author": "ابن أبي العز الحنفي",
        "died_hijri": 792,
        "category": "عقيدة",
        "excel": "/home/ubuntu/webdev-static-assets/branded5/marqoom46_tahawiyya_ibn_abi_aliz.xlsx",
    },
    {
        "kashaf_id": "marqoom47_subul_huda_salhi",
        "book_id": "marqoom-47",
        "title": "سبل الهدى والرشاد",
        "author": "الصالحي الشامي",
        "died_hijri": 942,
        "category": "تاريخ",
        "excel": "/home/ubuntu/webdev-static-assets/branded5/marqoom42_subul_alhuda_salhi.xlsx",
    },
    {
        "kashaf_id": "marqoom48_sharh_usul_lalikai",
        "book_id": "marqoom-48",
        "title": "شرح أصول اعتقاد أهل السنة",
        "author": "اللالكائي",
        "died_hijri": 418,
        "category": "عقيدة",
        "excel": "/home/ubuntu/webdev-static-assets/branded5/marqoom48_usul_itiqad_allalikai.xlsx",
    },
    {
        "kashaf_id": "marqoom49_lisan_arab",
        "book_id": "marqoom-49",
        "title": "لسان العرب",
        "author": "ابن منظور",
        "died_hijri": 711,
        "category": "لغة",
        "excel": "/home/ubuntu/webdev-static-assets/branded5/marqoom49_lisan_alarab_ibn_manzur.xlsx",
    },
    # الكشافات 50-59 (branded6)
    {
        "kashaf_id": "marqoom50_wahidi_wajiz",
        "book_id": "marqoom-50",
        "title": "التفسير الوجيز",
        "author": "الواحدي",
        "died_hijri": 468,
        "category": "تفسير",
        "excel": "/home/ubuntu/webdev-static-assets/branded6/marqoom50_wahidi.xlsx",
    },
    {
        "kashaf_id": "marqoom51_kuwaiti_fiqh",
        "book_id": "marqoom-51",
        "title": "الموسوعة الفقهية الكويتية",
        "author": "وزارة الأوقاف الكويتية",
        "died_hijri": None,
        "category": "فقه",
        "excel": "/home/ubuntu/webdev-static-assets/branded6/marqoom51_mawsuah.xlsx",
    },
    {
        "kashaf_id": "marqoom52_tafsir_baghawi",
        "book_id": "marqoom-52",
        "title": "معالم التنزيل (تفسير البغوي)",
        "author": "البغوي",
        "died_hijri": 516,
        "category": "تفسير",
        "excel": "/home/ubuntu/webdev-static-assets/branded6/marqoom52_baghawi.xlsx",
    },
    {
        "kashaf_id": "marqoom53_tafsir_abusaud",
        "book_id": "marqoom-53",
        "title": "إرشاد العقل السليم (تفسير أبي السعود)",
        "author": "أبو السعود",
        "died_hijri": 982,
        "category": "تفسير",
        "excel": "/home/ubuntu/webdev-static-assets/branded6/marqoom53_abusaud.xlsx",
    },
    {
        "kashaf_id": "marqoom54_tafsir_ibnarafa",
        "book_id": "marqoom-54",
        "title": "تفسير ابن عرفة",
        "author": "ابن عرفة التونسي",
        "died_hijri": 803,
        "category": "تفسير",
        "excel": "/home/ubuntu/webdev-static-assets/branded6/marqoom54_ibnarafa.xlsx",
    },
    {
        "kashaf_id": "marqoom55_tafsir_nasafi",
        "book_id": "marqoom-55",
        "title": "مدارك التنزيل (تفسير النسفي)",
        "author": "النسفي",
        "died_hijri": 710,
        "category": "تفسير",
        "excel": "/home/ubuntu/webdev-static-assets/branded6/marqoom55_nasafi.xlsx",
    },
    {
        "kashaf_id": "marqoom56_tayseer_aziz",
        "book_id": "marqoom-56",
        "title": "تيسير العزيز الحميد",
        "author": "سليمان بن عبد الله آل الشيخ",
        "died_hijri": 1233,
        "category": "عقيدة",
        "excel": "/home/ubuntu/webdev-static-assets/branded6/marqoom56_tayseer.xlsx",
    },
    {
        "kashaf_id": "marqoom57_jamial_usul",
        "book_id": "marqoom-57",
        "title": "جامع الأصول في أحاديث الرسول",
        "author": "ابن الأثير",
        "died_hijri": 606,
        "category": "حديث",
        "excel": "/home/ubuntu/webdev-static-assets/branded6/marqoom57_jamialasul.xlsx",
    },
    {
        "kashaf_id": "marqoom58_sharh_sunnah_barbahary",
        "book_id": "marqoom-58",
        "title": "شرح السنة",
        "author": "البربهاري",
        "died_hijri": 329,
        "category": "عقيدة",
        "excel": "/home/ubuntu/webdev-static-assets/branded6/marqoom58_barbahary.xlsx",
    },
    {
        "kashaf_id": "marqoom59_radd_jahmiyya_ibnmandah",
        "book_id": "marqoom-59",
        "title": "الرد على الجهمية",
        "author": "ابن منده",
        "died_hijri": 395,
        "category": "عقيدة",
        "excel": "/home/ubuntu/webdev-static-assets/branded6/marqoom59_ibmandah.xlsx",
    },
    # الكشافات 60-70 (branded7)
    {
        "kashaf_id": "marqoom60_sarakhsi_usul",
        "book_id": "marqoom-60",
        "title": "أصول السرخسي",
        "author": "السرخسي",
        "died_hijri": 483,
        "category": "فقه",
        "excel": "/home/ubuntu/webdev-static-assets/branded7/marqoom60_sarakhsi_usul.xlsx",
    },
    {
        "kashaf_id": "bahr_muhit_zarkashi",
        "book_id": "marqoom-61",
        "title": "البحر المحيط في التفسير",
        "author": "أبو حيان الأندلسي",
        "died_hijri": 745,
        "category": "تفسير",
        "excel": "/home/ubuntu/webdev-static-assets/branded7/marqoom61_bahr_muhit_zarkashi.xlsx",
    },
    {
        "kashaf_id": "tadrib_rawi_suyuti",
        "book_id": "marqoom-62",
        "title": "تدريب الراوي في شرح تقريب النواوي",
        "author": "السيوطي",
        "died_hijri": 911,
        "category": "حديث",
        "excel": "/home/ubuntu/webdev-static-assets/branded7/marqoom62_tadrib_rawi_suyuti.xlsx",
    },
    {
        "kashaf_id": "marqoom63_jamia_bayan_dani",
        "book_id": "marqoom-63",
        "title": "جامع البيان في القراءات السبع",
        "author": "الداني",
        "died_hijri": 444,
        "category": "قراءات",
        "excel": "/home/ubuntu/webdev-static-assets/branded7/marqoom63_jamia_bayan_dani.xlsx",
    },
    {
        "kashaf_id": "marqoom64_rawda_taqrir",
        "book_id": "marqoom-64",
        "title": "روضة التقرير",
        "author": "ابن قيم الجوزية",
        "died_hijri": 751,
        "category": "فقه",
        "excel": "/home/ubuntu/webdev-static-assets/branded7/marqoom64_rawda_taqrir.xlsx",
    },
    {
        "kashaf_id": "marqoom65_rawda_nazir_ibn_qudama",
        "book_id": "marqoom-65",
        "title": "روضة الناظر وجنة المناظر",
        "author": "ابن قدامة المقدسي",
        "died_hijri": 620,
        "category": "فقه",
        "excel": "/home/ubuntu/webdev-static-assets/branded7/marqoom65_rawda_nazir_ibn_qudama.xlsx",
    },
    {
        "kashaf_id": "marqoom66_sharh_tayba_nuwayri",
        "book_id": "marqoom-66",
        "title": "شرح طيبة النشر في القراءات العشر",
        "author": "النويري",
        "died_hijri": 857,
        "category": "قراءات",
        "excel": "/home/ubuntu/webdev-static-assets/branded7/marqoom66_sharh_tayba_nuwayri.xlsx",
    },
    {
        "kashaf_id": "marqoom67_sharh_mukhtasar_rawda_tufi",
        "book_id": "marqoom-67",
        "title": "شرح مختصر الروضة",
        "author": "الطوفي",
        "died_hijri": 716,
        "category": "فقه",
        "excel": "/home/ubuntu/webdev-static-assets/branded7/marqoom67_sharh_mukhtasar_rawda_tufi.xlsx",
    },
    {
        "kashaf_id": "marqoom68_fath_mughith_sakhawi",
        "book_id": "marqoom-68",
        "title": "فتح المغيث بشرح ألفية الحديث",
        "author": "السخاوي",
        "died_hijri": 902,
        "category": "حديث",
        "excel": "/home/ubuntu/webdev-static-assets/branded7/marqoom68_fath_mughith_sakhawi.xlsx",
    },
    {
        "kashaf_id": "marqoom69_mujam_udaba_yaqut",
        "book_id": "marqoom-69",
        "title": "معجم الأدباء",
        "author": "ياقوت الحموي",
        "died_hijri": 626,
        "category": "تاريخ",
        "excel": "/home/ubuntu/webdev-static-assets/branded7/marqoom69_mujam_udaba_yaqut.xlsx",
    },
    {
        "kashaf_id": "marqoom70_aqeela_ziyadah",
        "book_id": "marqoom-70",
        "title": "عقيلة أتراب القصائد",
        "author": "الشاطبي",
        "died_hijri": 590,
        "category": "قراءات",
        "excel": "/home/ubuntu/webdev-static-assets/branded70/marqoom70_aqeela_ziyadah.xlsx",
    },
]

ETL_SCRIPT = Path(__file__).parent / "marqoom_etl.py"
OUTPUT_DIR = Path(__file__).parent / "output"


def run_etl(kashaf: dict, dry_run: bool = False) -> dict:
    """تشغيل ETL على كشاف واحد وإعادة النتيجة"""
    excel = kashaf["excel"]
    if not os.path.exists(excel):
        return {
            "kashaf_id": kashaf["kashaf_id"],
            "status": "missing_excel",
            "excel": excel,
        }

    out_dir = OUTPUT_DIR / kashaf["kashaf_id"]

    if dry_run:
        return {
            "kashaf_id": kashaf["kashaf_id"],
            "status": "dry_run",
            "excel": excel,
        }

    os.makedirs(out_dir, exist_ok=True)

    cmd = [
        sys.executable,
        str(ETL_SCRIPT),
        excel,
        "--book-id", kashaf["book_id"],
        "--title", kashaf["title"],
        "--author", kashaf["author"],
        "--category", kashaf["category"],
        "--output-dir", str(out_dir),
    ]
    if kashaf.get("died_hijri"):
        cmd += ["--died-hijri", str(kashaf["died_hijri"])]

    result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)

    if result.returncode != 0:
        return {
            "kashaf_id": kashaf["kashaf_id"],
            "status": "error",
            "error": result.stderr or result.stdout,
        }

    # قراءة درجة الامتثال من validation_report
    safe_id = kashaf["book_id"].replace("-", "_")
    report_path = out_dir / f"{safe_id}_validation_report.json"
    compliance = None
    if report_path.exists():
        with open(report_path) as f:
            report = json.load(f)
        compliance = report.get("compliance_score")

    cache_path = out_dir / f"{safe_id}_view_cache.json"

    return {
        "kashaf_id": kashaf["kashaf_id"],
        "book_id": kashaf["book_id"],
        "status": "success",
        "compliance": compliance,
        "view_cache": str(cache_path),
        "validation_report": str(report_path),
        "stdout": result.stdout.strip(),
    }


def main():
    parser = argparse.ArgumentParser(description="Batch ETL لجميع الكشافات")
    parser.add_argument("--dry-run", action="store_true", help="فحص الملفات فقط بدون تشغيل ETL")
    parser.add_argument("--only-new", action="store_true", help="تشغيل ETL على الكشافات الجديدة فقط")
    parser.add_argument("--kashaf-id", help="تشغيل ETL على كشاف واحد فقط")
    args = parser.parse_args()

    OUTPUT_DIR.mkdir(exist_ok=True)

    # تصفية الكشافات
    kashafat = KASHAFAT_MAP
    if args.kashaf_id:
        kashafat = [k for k in kashafat if k["kashaf_id"] == args.kashaf_id]
        if not kashafat:
            print(f"❌ لم يُعثر على كشاف بمعرّف: {args.kashaf_id}")
            sys.exit(1)

    if args.only_new:
        # تشغيل على الكشافات التي لا يوجد لها output بعد
        kashafat = [
            k for k in kashafat
            if not (OUTPUT_DIR / k["kashaf_id"]).exists()
        ]

    print(f"🚀 معالجة {len(kashafat)} كشافاً...")
    print("=" * 60)

    results = []
    success = 0
    missing = 0
    errors = 0

    for i, kashaf in enumerate(kashafat, 1):
        print(f"[{i}/{len(kashafat)}] {kashaf['kashaf_id']}...", end=" ", flush=True)
        result = run_etl(kashaf, dry_run=args.dry_run)
        results.append(result)

        if result["status"] == "success":
            compliance = result.get("compliance", "?")
            print(f"✅ امتثال {compliance}%")
            success += 1
        elif result["status"] == "missing_excel":
            print(f"⚠️  ملف Excel مفقود: {result['excel']}")
            missing += 1
        elif result["status"] == "dry_run":
            print(f"🔍 [dry-run] {result['excel']}")
        else:
            print(f"❌ خطأ: {result.get('error', '')[:100]}")
            errors += 1

    print("=" * 60)
    print(f"✅ نجح: {success} | ⚠️  مفقود: {missing} | ❌ خطأ: {errors}")

    # حفظ تقرير batch
    batch_report = OUTPUT_DIR / "batch_report.json"
    with open(batch_report, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"📊 تقرير batch: {batch_report}")

    return results


if __name__ == "__main__":
    main()
