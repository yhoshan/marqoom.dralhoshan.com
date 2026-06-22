import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";

// ═══════════════════════════════════════════════
// DESIGN: هوية مرقوم الرسمية
// الألوان: أخضر زمردي #1A7A6E + ذهبي #B5A05A + رمادي داكن #3A3A3A
// الشعار: /manus-storage/marqoom_logo_faca7079.png
// التوقيع: /manus-storage/marqoom_signature_a4c79224.png
// ═══════════════════════════════════════════════

// ── COLORS LIGHT ──
const C = {
  emerald: "#1A7A6E",
  emeraldDark: "#145F55",
  emeraldLight: "#2A9A8E",
  gold: "#B5A05A",
  goldLight: "#D4C07A",
  goldDark: "#8A7840",
  dark: "#2A2A2A",
  darkMid: "#3A3A3A",
  cream: "#F8F4EC",
  creamDark: "#EDE5D5",
  creamMid: "#E0D5C0",
  textDark: "#1E1E1E",
  textMid: "#4A4A4A",
  textLight: "#7A7A7A",
  white: "#FFFFFF",
};

const KASHAFAT = [
  {
    id: "fathalbaari",
    num: 1,
    title: "كشّاف فتح الباري بالأرقام",
    author: "ابن حجر العسقلاني",
    death: "ت 852هـ",
    category: "حديث",
    categoryLabel: "الحديث وعلومه",
    description:
      "فهرس تحليلي آلي شامل لشرح صحيح البخاري — أضخم شروح الحديث النبوي وأجمعها، يرصد المحاور الكبرى من أحاديث وأسانيد وتخريج وترجيح وإشكالات.",
    stats: [
      { label: "كلمة", value: "3.5م" },
      { label: "عبارة", value: "217,433" },
      { label: "صفحة", value: "7,807" },
      { label: "باباً", value: "3,442" },
    ],
    tag: "شرح حديث موسوعي",
    url: "https://marqoom1.dralhoshan.com",
    xlsxUrl: "/manus-storage/fathalbaari_941b6fe4.xlsx",
    docxUrl: "/manus-storage/fathalbaari_b996ac19.docx",
  },
  {
    id: "ibnabdulbar",
    num: 2,
    title: "كشّاف ابن عبد البر",
    author: "ابن عبد البر القرطبي",
    death: "ت 463هـ",
    category: "حديث",
    categoryLabel: "الحديث وعلومه",
    description:
      "كشاف شامل لثلاثة مصنفات كبرى: التمهيد لما في الموطأ، والاستذكار، والاستيعاب — يرصد منهج الإمام الحافظ في الحديث والفقه والرجال.",
    stats: [
      { label: "كلمة", value: "8.5م" },
      { label: "عبارة", value: "235,427" },
      { label: "صفحة", value: "13,722" },
      { label: "مصنفات", value: "3" },
    ],
    tag: "حديث وفقه مقارن",
    url: "https://marqoom2.dralhoshan.com",
    xlsxUrl: "/manus-storage/ibnabdulbar_6a68a5e1.xlsx",
    docxUrl: "/manus-storage/ibnabdulbar_c6225243.docx",
  },
  {
    id: "ibntimiah",
    num: 3,
    title: "كشّاف ابن تيمية بالأرقام",
    author: "شيخ الإسلام ابن تيمية",
    death: "ت 728هـ",
    category: "عقيدة",
    categoryLabel: "العقيدة والأصول",
    description:
      "فهرس تحليلي لخمسة مصنفات كبرى لشيخ الإسلام — يرصد الاستدلال النقلي والعقلي ومنهج النقد والرد على المخالفين والمدارس الكلامية.",
    stats: [
      { label: "كلمة", value: "5م" },
      { label: "عبارة", value: "145,175" },
      { label: "صفحة", value: "29,828" },
      { label: "مصنفات", value: "5" },
    ],
    tag: "عقيدة وأصول",
    url: "https://marqoom3.dralhoshan.com",
    xlsxUrl: "/manus-storage/ibntimiah_76aba10d.xlsx",
    docxUrl: "/manus-storage/ibntimiah_f0915251.docx",
  },
  {
    id: "alrazi",
    num: 4,
    title: "كشّاف تفسير الرازي",
    author: "فخر الدين الرازي",
    death: "ت 606هـ",
    category: "تفسير",
    categoryLabel: "التفسير",
    description:
      "فهرس تحليلي لمفاتيح الغيب (التفسير الكبير) — يرصد الاستدلال والتعليل والجدل الكلامي والترجيح والقراءات في أضخم تفاسير القرآن الكريم.",
    stats: [
      { label: "كلمة", value: "3م" },
      { label: "عبارة", value: "92,400+" },
      { label: "جزءاً", value: "32" },
      { label: "نوع", value: "جدلي" },
    ],
    tag: "تفسير موسوعي جدلي",
    url: "https://marqoom4.dralhoshan.com",
    xlsxUrl: "/manus-storage/alrazi_235e5b5f.xlsx",
    docxUrl: "/manus-storage/alrazi_847cb397.docx",
  },
  {
    id: "alqurtubi",
    num: 5,
    title: "كشّاف تفسير القرطبي",
    author: "القرطبي",
    death: "ت 671هـ",
    category: "تفسير",
    categoryLabel: "التفسير",
    description:
      "فهرس تحليلي للجامع لأحكام القرآن — يرصد الخلاف وعرض الأقوال والاستنباط الفقهي من القرآن الكريم في هذا التفسير الموسوعي الفقهي.",
    stats: [
      { label: "كلمة", value: "2.2م" },
      { label: "عبارة", value: "100,462" },
      { label: "صفحة", value: "7,454" },
      { label: "مدخل", value: "3,423" },
    ],
    tag: "تفسير فقهي موسوعي",
    url: "https://marqoom5.dralhoshan.com",
    xlsxUrl: "/manus-storage/alqurtubi_8166b591.xlsx",
    docxUrl: "/manus-storage/alqurtubi_91c92062.docx",
  },
  {
    id: "altabari",
    num: 6,
    title: "كشّاف جامع البيان للطبري",
    author: "ابن جرير الطبري",
    death: "ت 310هـ",
    category: "تفسير",
    categoryLabel: "التفسير",
    description:
      "فهرس تحليلي لجامع البيان في تأويل القرآن — أقدم التفاسير الكبرى وأوسعها في نقل أقوال السلف والروايات، يرصد الأعلام والمصادر والمدارس التفسيرية.",
    stats: [
      { label: "كلمة", value: "4.3م" },
      { label: "مورد", value: "157,314" },
      { label: "علم", value: "77,564" },
      { label: "ملفات", value: "10" },
    ],
    tag: "تفسير بالمأثور",
    url: "https://marqoom6.dralhoshan.com",
    xlsxUrl: "/manus-storage/altabari_b5a853f1.xlsx",
    docxUrl: "/manus-storage/altabari_aebfc1ae.docx",
  },
  {
    id: "annawawe",
    num: 7,
    title: "كشّاف المجموع للنووي",
    author: "الإمام النووي",
    death: "ت 676هـ",
    category: "فقه",
    categoryLabel: "الفقه المقارن",
    description:
      "فهرس تحليلي للمجموع شرح المهذب — الموسوعة الفقهية الشافعية الكبرى، يرصد الخلاف المذهبي والمقارن في 44 كتاباً فقهياً.",
    stats: [
      { label: "كلمة", value: "2.8م" },
      { label: "صفحة", value: "9,793" },
      { label: "كتاباً", value: "44" },
      { label: "مدخل", value: "335" },
    ],
    tag: "فقه شافعي موسوعي",
    url: "https://marqoom7.dralhoshan.com",
    xlsxUrl: "/manus-storage/annawawe_1cadb86b.xlsx",
    docxUrl: "/manus-storage/annawawe_d9bef041.docx",
  },
  {
    id: "almuhalla",
    num: 8,
    title: "كشّاف المحلى لابن حزم",
    author: "ابن حزم الأندلسي",
    death: "ت 456هـ",
    category: "فقه",
    categoryLabel: "الفقه المقارن",
    description:
      "فهرس تحليلي للمحلى بالآثار — الموسوعة الفقهية الظاهرية الكبرى، يرصد المنهج الأثري الجدلي في 61 كتاباً فقهياً مع 2158 مسألة.",
    stats: [
      { label: "كلمة", value: "1.5م" },
      { label: "عبارة", value: "117,854" },
      { label: "كتاباً", value: "61" },
      { label: "مسألة", value: "2,158" },
    ],
    tag: "فقه ظاهري أثري",
    url: "https://marqoom8.dralhoshan.com",
    xlsxUrl: "/manus-storage/almuhalla_c65c1027.xlsx",
    docxUrl: "/manus-storage/almuhalla_63eccc4a.docx",
  },
  {
    id: "almughni",
    num: 9,
    title: "كشّاف المغني لابن قدامة",
    author: "ابن قدامة المقدسي",
    death: "ت 620هـ",
    category: "فقه",
    categoryLabel: "الفقه المقارن",
    description:
      "فهرس تحليلي للمغني شرح مختصر الخرقي — الموسوعة الفقهية الحنبلية الكبرى في الفقه المقارن، يرصد 70 كتاباً فقهياً و37,985 عبارة تحليلية.",
    stats: [
      { label: "كلمة", value: "1.8م" },
      { label: "عبارة", value: "37,985" },
      { label: "كتاباً", value: "70" },
      { label: "مدخل", value: "7,668" },
    ],
    tag: "فقه حنبلي مقارن",
    url: "https://marqoom9.dralhoshan.com",
    xlsxUrl: "/manus-storage/almughni_32baf018.xlsx",
    docxUrl: "/manus-storage/almughni_46f85955.docx",
  },
  {
    id: "albadaei",
    num: 10,
    title: "كشّاف بدائع الصنائع للكاساني",
    author: "علاء الدين الكاساني",
    death: "ت 587هـ",
    category: "فقه",
    categoryLabel: "الفقه المقارن",
    description:
      "فهرس تحليلي لبدائع الصنائع في ترتيب الشرائع — الموسوعة الفقهية الحنفية التعليلية، يرصد 66 كتاباً فقهياً بمنهج تعليلي مقارن فريد.",
    stats: [
      { label: "كلمة", value: "1.5م" },
      { label: "صفحة", value: "2,127" },
      { label: "كتاباً", value: "66" },
      { label: "مدخل", value: "953" },
    ],
    tag: "فقه حنفي تعليلي",
    url: "https://marqoom10.dralhoshan.com",
    xlsxUrl: "/manus-storage/albadaei_d6c19af7.xlsx",
    docxUrl: "/manus-storage/albadaei_edee1f00.docx",
  },
  {
    id: "ibnalqayyim",
    num: 11,
    title: "كشّاف كتب ابن القيم الثلاثة",
    author: "ابن قيم الجوزية",
    death: "ت 751هـ",
    category: "عقيدة",
    categoryLabel: "العقيدة والأصول",
    description:
      "فهرس تحليلي لثلاثة مصنفات كبرى: إعلام الموقعين، ومدارج السالكين، وزاد المعاد — يرصد الحديث والرواية والسلوك والتزكية والاستدلال.",
    stats: [
      { label: "كلمة", value: "1م+" },
      { label: "عبارة", value: "37,290" },
      { label: "صفحة", value: "3,107" },
      { label: "مصنفات", value: "3" },
    ],
    tag: "عقيدة وسلوك وفقه",
    url: "https://marqoom11.dralhoshan.com",
    xlsxUrl: "/manus-storage/ibnalqayyim_e5c84b55.xlsx",
    docxUrl: "/manus-storage/ibnalqayyim_da87858a.docx",
  },
  {
    id: "bukhari",
    num: 12,
    title: "كشّاف صحيح البخاري",
    author: "الإمام محمد بن إسماعيل البخاري",
    death: "ت 256هـ",
    category: "حديث",
    categoryLabel: "الحديث وعلومه",
    description:
      "فهرس تحليلي رقمي لصحيح البخاري — يرصد 97 كتاباً و3,870 باباً وصيغ الأداء والرواية والأسانيد، مع تحليل شيوخ البخاري المباشرين البالغين 519 اسماً فريداً.",
    stats: [
      { label: "كلمة", value: "602,468" },
      { label: "حديث", value: "7,563" },
      { label: "باب", value: "3,870" },
      { label: "كتاب", value: "97" },
    ],
    tag: "حديث مسند مبوّب",
    url: "https://marqoom12.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom12_bukhari_cd9d6e7d.xlsx",
    docxUrl: "/manus-storage/marqoom12_bukhari_summary_8c490f7d.docx",
  },
  {
    id: "tamyiz",
    num: 13,
    title: "كشّاف التمييز لمسلم",
    author: "الإمام مسلم بن الحجاج القشيري",
    death: "ت 261هـ",
    category: "حديث",
    categoryLabel: "الحديث وعلومه",
    description:
      "فهرس تحليلي رقمي لكتاب التمييز — مصنَّف نقدي حديثي مركّز في 52 صفحة، يرصد 1,103 صيغة أداء ورواية، و99 علامة نقد وعلل، مع تحليل مركزية الإسناد على المتن.",
    stats: [
      { label: "كلمة", value: "10,613" },
      { label: "حديث", value: "106" },
      { label: "صفحة", value: "52" },
      { label: "علامة نقد", value: "99" },
    ],
    tag: "نقد حديثي وعلل",
    url: "https://marqoom13.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom13_tamyiz_muslim_85cee9c0.xlsx",
    docxUrl: "/manus-storage/marqoom13_tamyiz_summary_c18bd1c2.docx",
  },
  {
    id: "risala",
    num: 14,
    title: "كشّاف الرسالة والأم للشافعي",
    author: "الإمام محمد بن إدريس الشافعي",
    death: "ت 204هـ",
    category: "فقه",
    categoryLabel: "الفقه المقارن",
    description:
      "فهرس تحليلي رقمي للرسالة والأم — يرصد 1,236,322 كلمة في المصنَّفين، مع تحليل مؤشرات الجدل والاستدلال والتعليل، ويكشف الفرق البنيوي بين الطابع الأصولي للرسالة والطابع الفقهي التطبيقي للأم.",
    stats: [
      { label: "كلمة", value: "1.2م+" },
      { label: "عبارة", value: "48,967" },
      { label: "مقطع", value: "2,528" },
      { label: "مصنَّف", value: "2" },
    ],
    tag: "أصول فقه وفقه شافعي",
    url: "https://marqoom14.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom14_risala_umm_shafii_e476f1ed.xlsx",
    docxUrl: "/manus-storage/marqoom14_risala_summary_649c92ab.docx",
  },
  {
    id: "mustasfa",
    num: 15,
    title: "كشّاف المستصفى للغزالي",
    author: "أبو حامد محمد الغزالي",
    death: "ت 505هـ",
    category: "أصول",
    categoryLabel: "الأصول والمنطق",
    description:
      "فهرس تحليلي رقمي للمستصفى — يرصد 182,512 كلمة في كتاب أصول الفقه التحليلي الجدلي، مع تحليل مؤشرات الاستدلال والتعليل والجدل والتعريف والحدود، وأعلى الأعلام حضوراً: الشافعي بـ 93 ظهوراً.",
    stats: [
      { label: "كلمة", value: "182,512" },
      { label: "مدخل", value: "295" },
      { label: "مؤشر خلاف", value: "31.33%" },
      { label: "مؤشر ترجيح", value: "50.67%" },
    ],
    tag: "أصول فقه وجدل",
    url: "https://marqoom15.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom15_mustasfa_ghazali_9495ad89.xlsx",
    docxUrl: "/manus-storage/marqoom15_mustasfa_summary_5739c413.docx",
  },
  {
    id: "baydawi",
    num: 16,
    title: "كشّاف تفسير البيضاوي",
    author: "ناصر الدين البيضاوي",
    death: "ت 685هـ",
    category: "تفسير",
    categoryLabel: "التفسير",
    description:
      "فهرس تحليلي رقمي لأنوار التنزيل وأسرار التأويل — يرصد 567,780 كلمة في 114 سورة، مع تحليل مؤشرات التفسير والبيان والتعليل والقراءات والإعراب والموارد الفقهية.",
    stats: [
      { label: "كلمة", value: "567,780" },
      { label: "سورة", value: "114" },
      { label: "صفحة", value: "1,253" },
      { label: "ضربة قاموس", value: "82,426" },
    ],
    tag: "تفسير تحريري",
    url: "https://marqoom16.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom16_tafsir_baydawi_7eea3e4b.xlsx",
    docxUrl: "/manus-storage/marqoom16_baydawi_summary_cbce4fae.docx",
  },
  {
    id: "tawhid",
    num: 17,
    title: "كشّاف كتاب التوحيد لابن عبدالوهاب",
    author: "الإمام محمد بن عبدالوهاب",
    death: "ت 1206هـ",
    category: "عقيدة",
    categoryLabel: "العقيدة والأصول",
    description:
      "فهرس تحليلي رقمي لكتاب التوحيد — يرصد 67 باباً و588 مسألة و129 إحالة قرآنية، مع تحليل المحاور العقدية: الشرك والتوحيد والدعاء والاستغاثة وسد الذرائع.",
    stats: [
      { label: "باب", value: "67" },
      { label: "مسألة", value: "588" },
      { label: "آية", value: "129" },
      { label: "حديث وأثر", value: "173" },
    ],
    tag: "عقيدة توحيد",
    url: "https://marqoom17.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom17_tawhid_ibnabdulwahhab_fd5eff7a.xlsx",
    docxUrl: "/manus-storage/marqoom17_tawhid_summary_2b31d140.docx",
  },
  {
    id: "sibawayh",
    num: 18,
    title: "كشّاف الكتاب لسيبويه",
    author: "عمرو بن عثمان سيبويه",
    death: "ت 180هـ",
    category: "لغة",
    categoryLabel: "اللغة والنحو",
    description:
      "فهرس تحليلي رقمي للكتاب — يرصد 277,406 كلمة في 1,973 صفحة، مع تحليل المصطلحات النحوية واللغوية البالغة 9,934 مصطلحاً، والأعلام والمدارس النحوية والاتجاهات.",
    stats: [
      { label: "كلمة", value: "277,406" },
      { label: "مصطلح نحوي", value: "9,934" },
      { label: "صفحة", value: "1,973" },
      { label: "علم", value: "935" },
    ],
    tag: "نحو ولغة تأسيسي",
    url: "https://marqoom18.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom18_kitab_sibawayh_9ddb004c.xlsx",
    docxUrl: "/manus-storage/marqoom18_kitab_summary_5e8b63ce.docx",
  },
  {
    id: "rawdh",
    num: 19,
    title: "كشّاف الروض المربع للبهوتي",
    author: "منصور بن يونس البهوتي",
    death: "ت 1051هـ",
    category: "فقه",
    categoryLabel: "الفقه المقارن",
    description:
      "فهرس تحليلي رقمي للروض المربع شرح زاد المستقنع — يرصد 150,368 كلمة في شرح فقهي حنبلي، مع تحليل 11,939 عبارة وأبرز مصطلحات الشرح والبيان والتعليل والاستدلال النصي.",
    stats: [
      { label: "كلمة", value: "150,368" },
      { label: "عبارة", value: "11,939" },
      { label: "علم", value: "626" },
      { label: "إشارة مدرسة", value: "1,201" },
    ],
    tag: "فقه حنبلي شرح",
    url: "https://marqoom19.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom19_rawdh_murbaa_2b7056ae.xlsx",
    docxUrl: "/manus-storage/marqoom19_rawdh_summary_002166e8.docx",
  },
];

const CATEGORIES = [
  { id: "all", label: "الكل", count: 19 },
  { id: "حديث", label: "الحديث وعلومه", count: 4 },
  { id: "فقه", label: "الفقه المقارن", count: 6 },
  { id: "تفسير", label: "التفسير", count: 4 },
  { id: "عقيدة", label: "العقيدة والأصول", count: 3 },
  { id: "أصول", label: "الأصول والمنطق", count: 1 },
  { id: "لغة", label: "اللغة والنحو", count: 1 },
];

function normalizeArabic(text: string) {
  return text
    .replace(/[أإآا]/g, "ا")
    .replace(/[ةه]/g, "ه")
    .replace(/[يى]/g, "ي")
    .replace(/[\u064B-\u065F]/g, "");
}

const categoryColors: Record<string, { bg: string; text: string; accent: string }> = {
  حديث:  { bg: "#E8F4F2", text: C.emeraldDark, accent: C.emerald },
  تفسير: { bg: "#EEF0F8", text: "#3A4580",     accent: "#5060C0" },
  فقه:   { bg: "#FFF4E6", text: "#7A4010",     accent: "#C06020" },
  عقيدة: { bg: "#EFF4EE", text: "#2E5A28",     accent: "#4A8A40" },
};

// ── COLORS DARK ──
const D = {
  emerald: "#1A7A6E",
  emeraldDark: "#145F55",
  emeraldLight: "#2A9A8E",
  gold: "#B5A05A",
  goldLight: "#D4C07A",
  goldDark: "#8A7840",
  dark: "#2A2A2A",
  darkMid: "#3A3A3A",
  cream: "#1A1F2E",
  creamDark: "#232A3A",
  creamMid: "#2E3650",
  textDark: "#E8E0D0",
  textMid: "#B0A890",
  textLight: "#7A7A8A",
  white: "#FFFFFF",
};

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const T = isDark ? D : C;

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filtered = KASHAFAT.filter((k) => {
    const matchCat = activeCategory === "all" || k.category === activeCategory;
    if (!searchQuery.trim()) return matchCat;
    const q = normalizeArabic(searchQuery.toLowerCase());
    const haystack = normalizeArabic(
      [k.title, k.author, k.description, k.tag, k.categoryLabel].join(" ").toLowerCase()
    );
    return matchCat && haystack.includes(q);
  });

  return (
    <div style={{ fontFamily: "'Noto Naskh Arabic', 'Amiri', serif", direction: "rtl", background: T.cream, minHeight: "100vh", transition: "background 0.3s" }}>

      {/* ── FIXED ABOUT BUTTON (top-right) ── */}
      <button
        onClick={() => setShowAbout(true)}
        title="حول مرقوم"
        style={{
          position: "fixed",
          top: 14,
          right: 14,
          zIndex: 9999,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1.5px solid rgba(181,160,90,0.6)",
          background: isDark ? "rgba(30,40,55,0.85)" : "rgba(255,255,255,0.18)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          color: T.goldLight,
          fontSize: 18,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
          transition: "all 0.2s",
          WebkitTapHighlightColor: "transparent",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? "rgba(30,40,55,0.95)" : "rgba(255,255,255,0.32)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = isDark ? "rgba(30,40,55,0.85)" : "rgba(255,255,255,0.18)"; }}
      >
        <i className="fa-solid fa-circle-info" />
      </button>

      {/* ── ABOUT MODAL ── */}
      {showAbout && (
        <div
          onClick={() => setShowAbout(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 99999,
            background: "rgba(0,0,0,0.72)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: `linear-gradient(160deg, #145F55 0%, #1A7A6E 55%, #2A9A8E 100%)`,
              border: `2px solid rgba(181,160,90,0.7)`,
              borderRadius: 18,
              padding: "clamp(24px,5vw,36px)",
              maxWidth: 540,
              width: "100%",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 24px 70px rgba(0,0,0,0.55)",
              fontFamily: "'Noto Naskh Arabic', serif",
              direction: "rtl",
            }}
          >
            {/* Islamic geometric pattern overlay */}
            <div style={{
              position: "absolute", inset: 0, opacity: 0.07, pointerEvents: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30Z' fill='none' stroke='%23B5A05A' stroke-width='1'/%3E%3Cpath d='M30 10 L50 30 L30 50 L10 30Z' fill='none' stroke='%23B5A05A' stroke-width='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }} />

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <i className="fa-solid fa-shield-halved" style={{ fontSize: 22, color: "#D4C07A" }} />
                <span style={{ fontSize: "clamp(17px,4.5vw,22px)", fontWeight: 700, color: "#D4C07A", fontFamily: "'Amiri', serif", letterSpacing: 0.5 }}>حول مرقوم</span>
              </div>
              <button
                onClick={() => setShowAbout(false)}
                style={{
                  background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
                  cursor: "pointer", fontSize: 18, color: "rgba(255,255,255,0.8)", lineHeight: 1,
                  padding: "5px 10px", borderRadius: 8, transition: "background 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.22)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
              ><i className="fa-solid fa-xmark" /></button>
            </div>

            {/* Gold divider */}
            <div style={{ height: 1.5, background: `linear-gradient(90deg, transparent, #D4C07A, #B5A05A, #D4C07A, transparent)`, marginBottom: 22, position: "relative", zIndex: 1 }} />

            {/* Content */}
            <p style={{
              fontSize: "clamp(14px,3.5vw,16px)",
              lineHeight: 2,
              color: "rgba(255,255,255,0.92)",
              margin: 0,
              marginBottom: 28,
              textAlign: "justify",
              position: "relative", zIndex: 1,
            }}>
              <strong style={{ color: "#D4C07A", fontSize: "clamp(15px,4vw,18px)", fontFamily: "'Amiri', serif" }}>مرقوم</strong>
              {" "}مشروع رقمي لفهرسة وتحليل كتب التراث الإسلامي، ينتج كشافات رقمية منظّمة تساعد الباحثين على اكتشاف محتوى الكتاب من خلال مسائله، وأعلامه، ومصادره، ومصطلحاته، واستشهاداته، واتجاهاته العلمية. ويحوّل النص التراثي الطويل إلى خريطة بحثية ذكية، قابلة للبحث والتنزيل والمقارنة، تقرّب الباحث من منهج المؤلف وبنية الكتاب.
            </p>

            {/* Confirm button */}
            <button
              onClick={() => setShowAbout(false)}
              style={{
                display: "block",
                width: "100%",
                padding: "clamp(12px,3vw,14px)",
                background: `linear-gradient(135deg, #B5A05A, #D4C07A, #B5A05A)`,
                color: "#1A1A1A",
                border: "none",
                borderRadius: 40,
                fontSize: "clamp(14px,3.5vw,16px)",
                fontFamily: "'Amiri', serif",
                cursor: "pointer",
                fontWeight: 700,
                letterSpacing: 1,
                transition: "opacity 0.2s, transform 0.15s",
                position: "relative", zIndex: 1,
                boxShadow: "0 4px 16px rgba(181,160,90,0.4)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "scale(0.98)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
            >
              فهمت
            </button>
          </div>
        </div>
      )}

      {/* ── FIXED DARK MODE BUTTON (top-left) ── */}
      <button
        onClick={toggleTheme}
        title={isDark ? "الوضع النهاري" : "الوضع الليلي"}
        style={{
          position: "fixed",
          top: 14,
          left: 14,
          zIndex: 9999,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1.5px solid rgba(181,160,90,0.6)",
          background: isDark ? "rgba(30,40,55,0.85)" : "rgba(255,255,255,0.18)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          color: "#fff",
          fontSize: 18,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
          transition: "all 0.2s",
          WebkitTapHighlightColor: "transparent",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? "rgba(30,40,55,0.95)" : "rgba(255,255,255,0.32)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = isDark ? "rgba(30,40,55,0.85)" : "rgba(255,255,255,0.18)"; }}
      >
        <i className={isDark ? "fa-solid fa-sun" : "fa-solid fa-moon"} />
      </button>

            {/* ── HEADER ── */}
      <header style={{
        position: "relative",
        overflow: "hidden",
        padding: 0,
        margin: 0,
        backgroundImage: "url('/manus-storage/marqoom_hero_banner_197d6440.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        height: "clamp(160px, 45vw, 480px)",
      }}>
        {/* Subtle dark gradient at bottom */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 100%)", pointerEvents: "none" }} />
        {/* Gold bottom line */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${T.gold}, ${T.goldLight}, ${T.gold}, transparent)` }} />
      </header>
      {/* ── SEARCH BAR ── */}
      <div style={{ background: isDark ? T.dark : T.white, padding: "clamp(12px,3vw,18px) clamp(16px,4vw,24px)", borderBottom: `1px solid ${T.creamMid}` }}>
        <div style={{ maxWidth: 560, margin: "0 auto", position: "relative" }}>
          <i className="fa-solid fa-magnifying-glass" style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: T.emerald, fontSize: 18, pointerEvents: "none" }} />
          <input
            ref={searchRef}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن كشاف... (فتح الباري، ابن تيمية، الرازي...)"
            style={{
              width: "100%",
              padding: "clamp(12px,3vw,14px) 48px clamp(12px,3vw,14px) 20px",
              borderRadius: 40,
              border: `2px solid ${isDark ? 'rgba(181,160,90,0.3)' : 'rgba(26,122,110,0.25)'}`,
              background: isDark ? "rgba(255,255,255,0.06)" : "rgba(26,122,110,0.05)",
              color: isDark ? T.white : T.textDark,
              fontSize: "clamp(14px,3.5vw,16px)",
              fontFamily: "'Noto Naskh Arabic', serif",
              outline: "none",
              direction: "rtl",
              transition: "border-color 0.2s",
              boxSizing: "border-box",
              WebkitAppearance: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = T.emerald)}
            onBlur={(e) => (e.target.style.borderColor = isDark ? 'rgba(181,160,90,0.3)' : 'rgba(26,122,110,0.25)')}
          />
        </div>
      </div>

      {/* ── FILTER TABS ── */}
      <div style={{
        background: T.white,
        borderBottom: `2px solid ${T.creamMid}`,
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 12px rgba(26,122,110,0.08)",
      }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 12px", display: "flex", alignItems: "center", gap: 4, overflowX: "auto", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
          <span style={{ color: T.textLight, fontSize: "clamp(12px,3vw,13px)", whiteSpace: "nowrap", padding: "0 10px 0 0", borderLeft: `1px solid ${T.creamMid}`, paddingLeft: 12, marginLeft: 4, flexShrink: 0, minHeight: 52, display: "flex", alignItems: "center" }}>التصنيف:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: "0 clamp(12px,3vw,16px)",
                minHeight: 44,
                borderRadius: 40,
                border: activeCategory === cat.id ? `1.5px solid ${T.emerald}` : `1.5px solid transparent`,
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontSize: "clamp(12px,3vw,13px)",
                fontFamily: "'Noto Naskh Arabic', serif",
                fontWeight: activeCategory === cat.id ? 700 : 400,
                background: activeCategory === cat.id ? T.emerald : "transparent",
                color: activeCategory === cat.id ? T.white : T.textMid,
                transition: "all 0.2s",
                margin: "4px 0",
                flexShrink: 0,
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {cat.label}{" "}
              <span style={{ opacity: 0.75, fontSize: "clamp(10px,2.5vw,11px)" }}>
                ({cat.id === "all" ? filtered.length : KASHAFAT.filter(k => k.category === cat.id).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(24px,5vw,40px) clamp(12px,4vw,16px) 80px" }}>
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Amiri', serif", fontSize: "clamp(22px,5vw,28px)", color: T.emeraldDark, marginBottom: 8 }}>
            الكشافات الرقمية
          </h2>
          <div style={{ width: 60, height: 2, background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)`, margin: "0 auto 12px" }} />
          <p style={{ color: T.textMid, fontSize: "clamp(14px,3.5vw,16px)", lineHeight: 1.75, padding: "0 clamp(0px,2vw,16px)" }}>
            اختر الكشاف الذي تريد الاطلاع عليه — كل كشاف يتضمن تحليلاً آلياً شاملاً للمصنَّف مع فهارس رقمية دقيقة
          </p>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: T.textMid }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}><i className="fa-solid fa-magnifying-glass" style={{ color: T.emerald, opacity: 0.4 }} /></div>
            <p style={{ fontSize: 18, fontFamily: "'Amiri', serif" }}>لا توجد نتائج مطابقة للبحث</p>
            <p style={{ fontSize: 14, marginTop: 8, opacity: 0.7 }}>جرّب كلمات بحث مختلفة</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 290px), 1fr))",
            gap: "clamp(14px,3vw,24px)",
          }}>
            {filtered.map((k) => (
              <KashafCard key={k.id} kashaf={k} />
            ))}
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{
        background: `linear-gradient(160deg, ${T.emeraldDark} 0%, ${T.emerald} 100%)`,
        padding: "36px 24px",
        textAlign: "center",
        position: "relative",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${T.gold}, ${T.goldLight}, ${T.gold}, transparent)` }} />

        {/* Title in footer instead of logo */}
        <div style={{ marginBottom: 8 }}>
          <p style={{ color: T.white, fontSize: "clamp(22px,5vw,28px)", fontFamily: "'Amiri', serif", fontWeight: 700, marginBottom: 4 }}>
            مرقوم
          </p>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "clamp(13px,3vw,15px)", marginBottom: 16 }}>
            بوابة الكشافات التراثية الرقمية
          </p>
        </div>

        {/* Signature */}
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
          <a href="https://dralhoshan.com" target="_blank" rel="noopener noreferrer">
            <img
              src="/manus-storage/marqoom_signature_hq_2a392bb3.png"
              alt="د. يوسف بن حمود الحوشان"
              style={{
                height: 64,
                width: "auto",
                filter: "brightness(0) invert(1)",
                opacity: 0.9,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
            />
          </a>
        </div>

        <p style={{ color: T.goldLight, fontSize: 12, opacity: 0.75 }}>© 1448هـ / 2026م — جميع الحقوق محفوظة</p>
      </footer>

      {/* ── SCROLL TO TOP ── */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            position: "fixed",
            bottom: 28,
            left: 28,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: T.emerald,
            border: `2px solid ${T.gold}`,
            color: T.white,
            fontSize: 20,
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(26,122,110,0.4)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="العودة للأعلى"
        >
          ↑
        </button>
      )}
    </div>
  );
}

// ── KASHAF CARD COMPONENT ──
function KashafCard({ kashaf }: { kashaf: typeof KASHAFAT[0] }) {
  const [hovered, setHovered] = useState(false);
  const catColor = categoryColors[kashaf.category] || categoryColors["حديث"];
  const [, navigate] = useLocation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const T = isDark ? D : C;
  const darkCatColors: Record<string, { bg: string; text: string; accent: string }> = {
    حديث:  { bg: "#1A2E2C", text: "#7ECFC5", accent: "#2A9A8E" },
    تفسير: { bg: "#1E2040", text: "#8090D0", accent: "#7080C0" },
    فقه:   { bg: "#2A1E10", text: "#D09060", accent: "#C06020" },
    عقيدة: { bg: "#1A2818", text: "#80B870", accent: "#5A9A40" },
  };
  const tc = isDark ? (darkCatColors[kashaf.category] || darkCatColors["حديث"]) : catColor;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        background: isDark ? "#1E2535" : C.white,
        borderRadius: 14,
        border: `1px solid ${hovered ? T.emerald : T.creamMid}`,
        boxShadow: hovered
          ? `0 8px 40px rgba(26,122,110,0.18), 0 2px 8px rgba(181,160,90,0.1)`
          : isDark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 4px 24px rgba(0,0,0,0.06)",
        overflow: "hidden",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {/* Card Header */}
      <div style={{
        background: hovered
          ? `linear-gradient(135deg, ${T.emeraldDark} 0%, ${T.emerald} 100%)`
          : `linear-gradient(135deg, ${T.emerald} 0%, ${T.emeraldLight} 100%)`,
        padding: "clamp(14px,3vw,18px) clamp(16px,4vw,20px) clamp(12px,3vw,14px)",
        position: "relative",
        overflow: "hidden",
        transition: "background 0.25s",
      }}>
        {/* Subtle pattern */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.05,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M20 0 L40 20 L20 40 L0 20Z' fill='none' stroke='%23B5A05A' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
        }} />
        {/* Number badge */}
        <div style={{
          position: "absolute",
          top: 14,
          left: 16,
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          border: `1px solid rgba(181,160,90,0.5)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          color: T.goldLight,
          fontWeight: 700,
          zIndex: 1,
        }}>
          {kashaf.num}
        </div>
        {/* Category badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          background: tc.bg,
          color: tc.text,
          borderRadius: 20,
          padding: "3px 10px",
          fontSize: 11,
          fontWeight: 600,
          marginBottom: 8,
          position: "relative",
          zIndex: 1,
        }}>
          {kashaf.categoryLabel}
        </div>
        {/* Title */}
        <h3 style={{
          fontFamily: "'Amiri', serif",
          fontSize: "clamp(17px,4.5vw,20px)",
          fontWeight: 700,
          color: T.white,
          marginBottom: 4,
          lineHeight: 1.35,
          position: "relative",
          zIndex: 1,
        }}>
          {kashaf.title}
        </h3>
        {/* Author */}
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "clamp(12px,3vw,13px)", position: "relative", zIndex: 1 }}>
          <i className="fa-solid fa-diamond" style={{ fontSize: 8, marginLeft: 6, verticalAlign: 'middle' }} /> {kashaf.author} ({kashaf.death})
        </p>
      </div>

      {/* Card Body */}
      <div style={{ padding: "clamp(14px,3vw,16px) clamp(14px,4vw,20px)", flex: 1, display: "flex", flexDirection: "column" }}>
        <p style={{ color: T.textMid, fontSize: "clamp(13px,3.2vw,14px)", lineHeight: 1.8, marginBottom: 14, flex: 1 }}>
          {kashaf.description}
        </p>

        {/* Stats */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {kashaf.stats.map((s) => (
            <span key={s.label} style={{
              background: T.creamDark,
              border: `1px solid ${T.creamMid}`,
              borderRadius: 20,
              padding: "3px 10px",
              fontSize: 11,
              color: T.textMid,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}>
              <span style={{ color: tc.accent, fontWeight: 700 }}>{s.value}</span>
              <span>{s.label}</span>
            </span>
          ))}
        </div>

        {/* Tag */}
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: T.textLight, background: T.creamMid, padding: "3px 10px", borderRadius: 20 }}>
            {kashaf.tag}
          </span>
        </div>

        {/* CTA: Enter + Download buttons */}
        <div style={{ borderTop: `1px solid ${T.creamMid}`, paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Main CTA */}
          <button
            onClick={() => navigate(`/kashaf/${kashaf.id}`)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "clamp(11px,2.5vw,12px) 16px",
              borderRadius: 8,
              background: hovered ? T.emeraldDark : T.emerald,
              color: T.white,
              fontSize: "clamp(14px,3.5vw,15px)",
              fontWeight: 700,
              fontFamily: "'Noto Naskh Arabic', serif",
              textDecoration: "none",
              transition: "background 0.2s",
              letterSpacing: 0.5,
              border: "none",
              cursor: "pointer",
              width: "100%",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <span>دخول الكشاف</span>
            <i className="fa-solid fa-arrow-right" style={{ fontSize: 14 }} />
          </button>

          {/* Download buttons */}
          <div style={{ display: "flex", gap: 8 }}>
            <a
              href={kashaf.xlsxUrl}
              download
              onClick={(e) => e.stopPropagation()}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              padding: "clamp(9px,2vw,10px) 10px",
              borderRadius: 8,
              background: isDark ? "#1A2E1A" : "#E8F5E9",
              border: isDark ? "1px solid #2A5A2A" : "1px solid #A5D6A7",
              color: isDark ? "#7EC87E" : "#2E7D32",
              fontSize: "clamp(12px,3vw,13px)",
                fontWeight: 600,
                fontFamily: "'Noto Naskh Arabic', serif",
                textDecoration: "none",
                transition: "background 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? "#2A3E2A" : "#C8E6C9")}
              onMouseLeave={(e) => (e.currentTarget.style.background = isDark ? "#1A2E1A" : "#E8F5E9")}
            >
              <i className="fa-solid fa-download" style={{ fontSize: 13 }} />
              <span>Excel</span>
            </a>
            <a
              href={kashaf.docxUrl}
              download
              onClick={(e) => e.stopPropagation()}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              padding: "clamp(9px,2vw,10px) 10px",
              borderRadius: 8,
              background: isDark ? "#1A1E2E" : "#E3F2FD",
              border: isDark ? "1px solid #2A3A6A" : "1px solid #90CAF9",
              color: isDark ? "#7090D0" : "#1565C0",
              fontSize: "clamp(12px,3vw,13px)",
                fontWeight: 600,
                fontFamily: "'Noto Naskh Arabic', serif",
                textDecoration: "none",
                transition: "background 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? "#2A3050" : "#BBDEFB")}
              onMouseLeave={(e) => (e.currentTarget.style.background = isDark ? "#1A1E2E" : "#E3F2FD")}
            >
              <i className="fa-solid fa-download" style={{ fontSize: 13 }} />
              <span>Word</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
