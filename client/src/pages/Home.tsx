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
  {
    id: "tirmidhi",
    num: 20,
    title: "كشّاف سنن الترمذي",
    author: "أبو عيسى محمد الترمذي",
    death: "ت 279هـ",
    category: "حديث",
    categoryLabel: "الحديث وعلومه",
    description:
      "فهرس تحليلي رقمي لجامع الترمذي — يرصد 381,819 كلمة في 2,224 باباً، مع تحليل 2,824 حكماً حديثياً بعبارة \"هذا حديث\" وتصنيفها بين حسن وصحيح وغريب، و438 شيخاً مباشراً.",
    stats: [
      { label: "كلمة", value: "381,819" },
      { label: "حكم حديثي", value: "2,824" },
      { label: "باباً", value: "2,224" },
      { label: "شيخاً", value: "438" },
    ],
    tag: "حديث نقدي",
    url: "https://marqoom20.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom20_tirmidhi_01990461.xlsx",
    docxUrl: "/manus-storage/marqoom20_tirmidhi_summary_b45a2aad.docx",
  },
  {
    id: "muslim",
    num: 21,
    title: "كشّاف صحيح مسلم",
    author: "الإمام مسلم بن الحجاج",
    death: "ت 261هـ",
    category: "حديث",
    categoryLabel: "الحديث وعلومه",
    description:
      "فهرس تحليلي رقمي لصحيح مسلم — يرصد 516,329 كلمة في 56 كتاباً و1,334 باباً، مع 6,986 مدخلاً حديثياً و3,010 حديثاً فريداً، و375 شيخاً مباشراً لمسلم.",
    stats: [
      { label: "كلمة", value: "516,329" },
      { label: "مدخل حديثي", value: "6,986" },
      { label: "باباً", value: "1,334" },
      { label: "شيخاً", value: "375" },
    ],
    tag: "حديث صحيح",
    url: "https://marqoom21.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom21_muslim_4d89fd03.xlsx",
    docxUrl: "/manus-storage/marqoom21_muslim_summary_20713e40.docx",
  },
  {
    id: "musnad-ahmad",
    num: 22,
    title: "كشّاف مسند الإمام أحمد",
    author: "الإمام أحمد بن حنبل",
    death: "ت 241هـ",
    category: "حديث",
    categoryLabel: "الحديث وعلومه",
    description:
      "فهرس تحليلي رقمي لمسند الإمام أحمد — يرصد 5,412,638 كلمة في 45 جزءاً، مع 27,317 مدخلاً حديثياً و1,045 مسنداً وقسماً، و23,204 راوياً وعلماً مستخرجاً آلياً.",
    stats: [
      { label: "كلمة", value: "5,412,638" },
      { label: "مدخل حديثي", value: "27,317" },
      { label: "مسنداً", value: "1,045" },
      { label: "راوياً", value: "23,204" },
    ],
    tag: "حديث مسند",
    url: "https://marqoom22.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom22_musnad_ahmad_073bdf65.xlsx",
    docxUrl: "/manus-storage/marqoom22_musnad_ahmad_summary_1a562a5d.docx",
  },
  {
    id: "abudawud",
    num: 23,
    title: "كشّاف سنن أبي داود",
    author: "أبو داود السجستاني",
    death: "ت 275هـ",
    category: "حديث",
    categoryLabel: "الحديث وعلومه",
    description:
      "فهرس تحليلي رقمي لسنن أبي داود — يرصد 337,677 كلمة في 5,274 حديثاً و1,869 باباً، مع 853 تعقيباً صريحاً لأبي داود و672 شيخاً مباشراً فريداً.",
    stats: [
      { label: "كلمة", value: "337,677" },
      { label: "حديثاً", value: "5,274" },
      { label: "باباً", value: "1,869" },
      { label: "تعقيباً", value: "853" },
    ],
    tag: "حديث فقهي",
    url: "https://marqoom23.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom23_abudawud_faf0eb40.xlsx",
    docxUrl: "/manus-storage/marqoom23_abudawud_summary_7f8cfb3d.docx",
  },
  {
    id: "ibnmajah",
    num: 24,
    title: "كشّاف سنن ابن ماجه",
    author: "ابن ماجه القزويني",
    death: "ت 273هـ",
    category: "حديث",
    categoryLabel: "الحديث وعلومه",
    description:
      "فهرس تحليلي رقمي لسنن ابن ماجه — يرصد 135,895 كلمة عربية في 2,130 مدخلاً حديثياً و682 باباً، مع رصد الطابع الإسنادي الصريح وغلبة صيغة \"عن\" و\"حدثنا\" في النص.",
    stats: [
      { label: "كلمة", value: "135,895" },
      { label: "مدخل حديثي", value: "2,130" },
      { label: "باباً", value: "682" },
      { label: "كتاباً", value: "12" },
    ],
    tag: "حديث سنن",
    url: "https://marqoom24.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom24_ibnmajah_04d20e3c.xlsx",
    docxUrl: "/manus-storage/marqoom24_ibnmajah_summary_98fbc706.docx",
  },
  {
    id: "nasai",
    num: 25,
    title: "كشّاف سنن النسائي الكبرى",
    author: "أحمد بن شعيب النسائي",
    death: "ت 303هـ",
    category: "حديث",
    categoryLabel: "الحديث وعلومه",
    description:
      "فهرس تحليلي رقمي للسنن الكبرى للنسائي — يرصد 804,232 كلمة في 11,699 مدخلاً حديثياً و4,534 باباً، مع 92,087 صيغة أداء ورواية و1,444 شيخاً مباشراً فريداً.",
    stats: [
      { label: "كلمة", value: "804,232" },
      { label: "مدخل حديثي", value: "11,699" },
      { label: "باباً", value: "4,534" },
      { label: "شيخاً", value: "1,444" },
    ],
    tag: "حديث سنن كبرى",
    url: "https://marqoom25.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom25_nasai_7410c2d2.xlsx",
    docxUrl: "/manus-storage/marqoom25_nasai_summary_b19f76be.docx",
  },
  {
    id: "darimi",
    num: 26,
    title: "كشّاف سنن الدارمي",
    author: "عبد الله بن عبد الرحمن الدارمي",
    death: "ت 255هـ",
    category: "حديث",
    categoryLabel: "الحديث وعلومه",
    description:
      "فهرس تحليلي رقمي لمسند الدارمي — يرصد 575,142 كلمة في 3,542 مدخلاً حديثياً، مع مقدمة علمية واسعة تُعدّ كتلة حديثية ومنهجية في العلم والسنة والفتيا والبدعة.",
    stats: [
      { label: "كلمة", value: "575,142" },
      { label: "مدخل حديثي", value: "3,542" },
      { label: "باباً", value: "674" },
      { label: "شيخاً", value: "248" },
    ],
    tag: "حديث مسند",
    url: "https://marqoom26.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom26_darimi_15c395c2.xlsx",
    docxUrl: "/manus-storage/marqoom26_darimi_summary_aa80a77e.docx",
  },
  {
    id: "muwatta",
    num: 27,
    title: "كشّاف موطأ الإمام مالك",
    author: "الإمام مالك بن أنس",
    death: "ت 179هـ",
    category: "حديث",
    categoryLabel: "الحديث وعلومه",
    description:
      "فهرس تحليلي رقمي لموطأ مالك برواية يحيى الليثي — يرصد 147,668 كلمة عربية في 1,821 مدخلاً في 61 كتاباً و601 باباً، مع رصد الطابع الحديثي الفقهي الأثري المبكر.",
    stats: [
      { label: "كلمة", value: "147,668" },
      { label: "مدخل", value: "1,821" },
      { label: "كتاباً", value: "61" },
      { label: "باباً", value: "601" },
    ],
    tag: "حديث فقهي مبكر",
    url: "https://marqoom27.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom27_muwatta_e5e9be5f.xlsx",
    docxUrl: "/manus-storage/marqoom27_muwatta_summary_5066dfc3.docx",
  },
  {
    id: "ibnkhuzaymah",
    num: 28,
    title: "كشّاف صحيح ابن خزيمة",
    author: "محمد بن إسحاق ابن خزيمة",
    death: "ت 311هـ",
    category: "حديث",
    categoryLabel: "الحديث وعلومه",
    description:
      "فهرس تحليلي رقمي لصحيح ابن خزيمة — يرصد 351,946 كلمة في 3,079 حديثاً و2,141 باباً فريداً، مع 705 تعليقاً صريحاً بعبارة \"قال أبو بكر\" وتحليل التوزيع على الكتب الفقهية.",
    stats: [
      { label: "كلمة", value: "351,946" },
      { label: "حديثاً", value: "3,079" },
      { label: "باباً", value: "2,141" },
      { label: "تعليقاً", value: "705" },
    ],
    tag: "حديث صحيح",
    url: "https://marqoom28.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom28_ibnkhuzaymah_824275ee.xlsx",
    docxUrl: "/manus-storage/marqoom28_ibnkhuzaymah_summary_4cc8229f.docx",
  },
  {
    id: "seerah",
    num: 29,
    title: "كشّاف السيرة النبوية لابن هشام",
    author: "عبد الملك بن هشام الحميري",
    death: "ت 213هـ",
    category: "سيرة",
    categoryLabel: "السيرة والتاريخ",
    description:
      "فهرس تحليلي رقمي للسيرة النبوية لابن هشام — يرصد 279,341 كلمة في 1,385 صفحة، مع تحليل مؤشرات الرواية والعزو والسرد التاريخي والنسب والقبائل والاستشهاد القرآني.",
    stats: [
      { label: "كلمة", value: "279,341" },
      { label: "صفحة", value: "1,385" },
      { label: "عنواناً", value: "2,387" },
      { label: "حاشية", value: "1,331" },
    ],
    tag: "سيرة ومغازي",
    url: "https://marqoom29.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom29_seerah_e14e23f2.xlsx",
    docxUrl: "/manus-storage/marqoom29_seerah_summary_3b589993.docx",
  },
  {
    id: "alawsat",
    num: 30,
    title: "كشّاف الأوسط لابن المنذر",
    author: "أبو بكر محمد بن إبراهيم بن المنذر النيسابوري",
    death: "ت 319هـ",
    category: "فقه",
    categoryLabel: "الفقه المقارن",
    description:
      "فهرس تحليلي رقمي لكتاب الأوسط في السنن والإجماع والاختلاف — يرصد 373,788 كلمة في 5,086 صفحة، مع تحليل 1,460 باباً ومسألة، و3,531 حديثاً وأثراً، و2,755 استخراجاً للإجماع والاختلاف والترجيح، و1,138 موضعاً لقول أبي بكر.",
    stats: [
      { label: "كلمة", value: "373,788" },
      { label: "صفحة", value: "5,086" },
      { label: "باباً", value: "1,460" },
      { label: "حديثاً", value: "3,531" },
    ],
    tag: "فقه مقارن",
    url: "https://marqoom30.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom30_alawsat_ibn_almundhir_9ec2bbd7.xlsx",
    docxUrl: "/manus-storage/marqoom30_alawsat_summary_d68fce92.docx",
  },
  {
    id: "tahawi",
    num: 31,
    title: "كشّاف شرح معاني الآثار للطحاوي",
    author: "أبو جعفر أحمد بن محمد الطحاوي",
    death: "ت 321هـ",
    category: "حديث",
    categoryLabel: "الحديث وعلومه",
    description:
      "فهرس تحليلي رقمي لشرح معاني الآثار — يرصد 1,850,285 كلمة في 337 باباً، مع تحليل مؤشرات الأحاديث والآثار والاستدلال الفقهي وأوجه الخلاف بين المذاهب ومنهج الطحاوي في التوفيق والترجيح.",
    stats: [
      { label: "كلمة", value: "1,850,285" },
      { label: "باباً", value: "337" },
    ],
    tag: "حديث وفقه",
    url: "https://marqoom31.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom31_sharh_maani_alathar_tahawi_2a189fb9.xlsx",
    docxUrl: "/manus-storage/marqoom31_tahawi_summary_6cbde5c6.docx",
  },
  {
    id: "suhayli",
    num: 32,
    title: "كشّاف الروض الأنف للسهيلي",
    author: "أبو القاسم عبد الرحمن بن عبد الله السهيلي",
    death: "ت 581هـ",
    category: "سيرة",
    categoryLabel: "السيرة والتاريخ",
    description:
      "فهرس تحليلي رقمي للروض الأنف في شرح السيرة النبوية لابن هشام — يرصد مؤشرات الشرح اللغوي والتاريخي والفقهي والنقد الحديثي ومنهج السهيلي في التعليق على أحداث السيرة وتوجيه الروايات.",
    stats: [],
    tag: "سيرة وشرح",
    url: "https://marqoom32.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom32_rawdh_alnf_suhayli_48feb2bd.xlsx",
    docxUrl: "/manus-storage/marqoom32_suhayli_summary_6f63d368.docx",
  },
  {
    id: "nihaya",
    num: 33,
    title: "كشّاف النهاية في غريب الحديث والأثر",
    author: "مجد الدين أبو السعادات ابن الأثير الجزري",
    death: "ت 606هـ",
    category: "حديث",
    categoryLabel: "الحديث وعلومه",
    description:
      "فهرس تحليلي رقمي لكتاب النهاية في غريب الحديث والأثر — يرصد 582 باباً مع تحليل مؤشرات المصطلحات اللغوية الغريبة وشواهدها الحديثية وأصولها المعجمية وطريقة ابن الأثير في التوضيح والتأصيل.",
    stats: [
      { label: "باباً", value: "582" },
    ],
    tag: "غريب الحديث",
    url: "https://marqoom33.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom33_nihaya_gharib_hadith_ibn_atheer_69396255.xlsx",
    docxUrl: "/manus-storage/marqoom33_nihaya_summary_877fc4de.docx",
  },
  {
    id: "bayhaqi",
    num: 34,
    title: "كشّاف السنن الكبرى للبيهقي",
    author: "أبو بكر أحمد بن الحسين البيهقي",
    death: "ت 458هـ",
    category: "حديث",
    categoryLabel: "الحديث وعلومه",
    description:
      "فهرس تحليلي رقمي للسنن الكبرى — يرصد 3,751,155 كلمة في 3,731 باباً، مع تحليل مؤشرات الأحاديث والآثار والاستدلال الفقهي والتعليقات النقدية ومنهج البيهقي في التوثيق والاستنباط.",
    stats: [
      { label: "كلمة", value: "3,751,155" },
      { label: "باباً", value: "3,731" },
    ],
    tag: "حديث وفقه",
    url: "https://marqoom34.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom34_sunan_kubra_bayhaqi_d638fe21.xlsx",
    docxUrl: "/manus-storage/marqoom34_bayhaqi_summary_6cb305f2.docx",
  },
  {
    id: "mizzi",
    num: 35,
    title: "كشّاف تهذيب الكمال للمزي",
    author: "يوسف بن عبد الرحمن المزي جمال الدين",
    death: "ت 742هـ",
    category: "حديث",
    categoryLabel: "الحديث وعلومه",
    description:
      "فهرس تحليلي رقمي لتهذيب الكمال في أسماء الرجال — يرصد 4,052,217 كلمة مع تحليل مؤشرات التراجم والجرح والتعديل وصيغ الرواية والمدارس الحديثية وطبقات الرواة ومنهج المزي في التحقيق والتمييز.",
    stats: [
      { label: "كلمة", value: "4,052,217" },
    ],
    tag: "رجال الحديث",
    url: "https://marqoom35.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom35_tahdhib_alkamal_almizzi_e72bd391.xlsx",
    docxUrl: "/manus-storage/marqoom35_mizzi_summary_072f451a.docx",
  },
  {
    id: "ibnabishaybah",
    num: 36,
    title: "كشّاف مصنف ابن أبي شيبة",
    author: "أبو بكر عبد الله بن محمد بن أبي شيبة",
    death: "ت 235هـ",
    category: "حديث",
    categoryLabel: "الحديث وعلومه",
    description:
      "فهرس تحليلي رقمي للمصنف — يرصد 4,970 باباً مع تحليل مؤشرات الأحاديث والآثار والفتاوى الفقهية وأقوال الصحابة والتابعين ومنهج ابن أبي شيبة في التبويب والاستيعاب.",
    stats: [
      { label: "باباً", value: "4,970" },
    ],
    tag: "حديث وآثار",
    url: "https://marqoom36.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom36_musannaf_ibn_abi_shayba_7002a8f8.xlsx",
    docxUrl: "/manus-storage/marqoom36_ibn_abi_shayba_summary_4125f07f.docx",
  },
  {
    id: "ibnabihatimt",
    num: 37,
    title: "كشّاف تفسير ابن أبي حاتم",
    author: "أبو محمد عبد الرحمن بن محمد بن إدريس الرازي ابن أبي حاتم",
    death: "ت 327هـ",
    category: "تفسير",
    categoryLabel: "التفسير",
    description:
      "فهرس تحليلي رقمي لتفسير ابن أبي حاتم المسند — يرصد 894,075 كلمة و20,230 مدخلاً مرقماً، مع تحليل 111 سورة وتوزيع المداخل الإسنادية وكثافة التفسير في كل سورة ومنهج ابن أبي حاتم في الاستدلال بالأسانيد.",
    stats: [
      { label: "كلمة", value: "894,075" },
      { label: "مدخلاً", value: "20,230" },
      { label: "سورة", value: "111" },
    ],
    tag: "تفسير مسند",
    url: "https://marqoom37.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom37_tafsir_ibn_abi_hatim_49cb872c.xlsx",
    docxUrl: "/manus-storage/marqoom37_ibn_abi_hatim_summary_cdacdfda.docx",
  },
  {
    id: "dhahabi",
    num: 38,
    title: "كشّاف سير أعلام النبلاء للذهبي",
    author: "شمس الدين محمد بن أحمد الذهبي",
    death: "ت 748هـ",
    category: "سيرة",
    categoryLabel: "السيرة والتاريخ",
    description:
      "فهرس تحليلي رقمي لسير أعلام النبلاء — يرصد 2,426,621 كلمة و6,103 ترجمة، مع تحليل 10,970 علماً مرصوداً و110,796 عبارة في قاموس الجرح والتعديل والتقييم، ومنهج الذهبي في النقد والترجيح.",
    stats: [
      { label: "كلمة", value: "2,426,621" },
      { label: "ترجمة", value: "6,103" },
      { label: "علماً", value: "10,970" },
    ],
    tag: "تراجم ورجال",
    url: "https://marqoom38.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom38_siyar_alam_nubala_dhahabi_7e5fe1f7.xlsx",
    docxUrl: "/manus-storage/marqoom38_dhahabi_summary_9c498271.docx",
  },
  {
    id: "abdulrazzaq",
    num: 39,
    title: "كشّاف مصنف عبد الرزاق الصنعاني",
    author: "أبو بكر عبد الرزاق بن همام الصنعاني",
    death: "ت 211هـ",
    category: "حديث",
    categoryLabel: "الحديث وعلومه",
    description:
      "فهرس تحليلي رقمي للمصنف — يرصد 817,393 كلمة في 2,079 باباً، مع تحليل مؤشرات الأحاديث والآثار والفتاوى وأقوال الصحابة والتابعين ومنهج عبد الرزاق في التبويب والجمع والتوثيق.",
    stats: [
      { label: "كلمة", value: "817,393" },
      { label: "باباً", value: "2,079" },
    ],
    tag: "حديث وآثار",
    url: "https://marqoom39.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom39_musannaf_abdulrazzaq_8b02a06e.xlsx",
    docxUrl: "/manus-storage/marqoom39_abdulrazzaq_summary_1517aca0.docx",
    },
  {
    id: "zamakhshari",
    num: 40,
    title: "كشّاف تفسير الكشاف للزمخشري",
    author: "أبو القاسم الزمخشري",
    died: "538هـ",
    category: "تفسير",
    description: "تحليل رقمي لتفسير الكشاف اللغوي البلاغي الجدلي — 773,790 كلمة في المتن، و39,136 عبارة منهجية مرصودة.",
    stats: [
      { label: "كلمات المتن", value: "773,790" },
      { label: "عبارات منهجية", value: "39,136" },
      { label: "إحالات كتب", value: "1,545" },
      { label: "أعلام مرصودة", value: "6,843" },
    ],
    url: "https://marqoom40.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom40_zamakhshari_kashaf_a1148cea.xlsx",
    docxUrl: "/manus-storage/marqoom40_zamakhshari_summary_b77efa95.docx",
  },
  {
    id: "saeed_ibn_mansur",
    num: 41,
    title: "كشّاف سنن سعيد بن منصور",
    author: "سعيد بن منصور الخراساني",
    died: "227هـ",
    category: "حديث",
    description: "تحليل رقمي لسنن سعيد بن منصور الحديثية الفقهية — 2,941 حديثاً وأثراً، و20,008 صيغة أداء ورواية مرصودة.",
    stats: [
      { label: "أحاديث وآثار", value: "2,941" },
      { label: "صيغ الأداء", value: "20,008" },
      { label: "أبواب الفهرس", value: "284" },
      { label: "كلمات النص", value: "400,965" },
    ],
    url: "https://marqoom41.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom41_saeed_ibn_mansur_cc03d825.xlsx",
    docxUrl: "/manus-storage/marqoom41_saeed_ibn_mansur_summary_5975bb00.docx",
  },
  {
    id: "subul_alhuda",
    num: 42,
    title: "كشّاف سبل الهدى والرشاد للصالحي",
    author: "محمد بن يوسف الصالحي الشامي",
    died: "942هـ",
    category: "سيرة",
    description: "تحليل رقمي لموسوعة السيرة النبوية — 1,950,974 كلمة، و6,453 عنواناً في الفهرس، وأكثر من 4,456 إحالة لصحيح مسلم.",
    stats: [
      { label: "كلمات النص", value: "1,950,974" },
      { label: "عناوين الفهرس", value: "6,453" },
      { label: "إحالات مسلم", value: "4,456" },
      { label: "إحالات البخاري", value: "3,540" },
    ],
    url: "https://marqoom42.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom42_subul_alhuda_salhi_dfe2817c.xlsx",
    docxUrl: "/manus-storage/marqoom42_subul_alhuda_summary_06caa745.docx",
  },
  {
    id: "isabah_ibn_hajar",
    num: 43,
    title: "كشّاف الإصابة في تمييز الصحابة",
    author: "ابن حجر العسقلاني",
    died: "852هـ",
    category: "حديث",
    description: "تحليل رقمي لموسوعة تراجم الصحابة — 12,245 ترجمة ملتقطة، و1,525,779 كلمة، و99,193 عبارة منهجية مرصودة.",
    stats: [
      { label: "تراجم الصحابة", value: "12,245" },
      { label: "كلمات النص", value: "1,525,779" },
      { label: "عبارات منهجية", value: "99,193" },
      { label: "إحالات كتب", value: "24,812" },
    ],
    url: "https://marqoom43.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom43_isabah_ibn_hajar_c2f5f318.xlsx",
    docxUrl: "/manus-storage/marqoom43_isabah_summary_45f08504.docx",
  },
  {
    id: "mujam_albuldan",
    num: 44,
    title: "كشّاف معجم البلدان لياقوت الحموي",
    author: "ياقوت الحموي",
    died: "626هـ",
    category: "لغة",
    description: "تحليل رقمي للمعجم الجغرافي التاريخي الموسوعي — 997,891 كلمة، و12,740 مدخلاً، و70,102 عبارة منهجية مرصودة.",
    stats: [
      { label: "مداخل المعجم", value: "12,740" },
      { label: "كلمات المتن", value: "997,891" },
      { label: "عبارات منهجية", value: "70,102" },
      { label: "موارد حسب المجال", value: "54,337" },
    ],
    url: "https://marqoom44.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom44_mujam_albuldan_yaqut_6463a464.xlsx",
    docxUrl: "/manus-storage/marqoom44_mujam_albuldan_summary_d6ec9085.docx",
  },
  {
    id: "alam_alzarkali",
    num: 45,
    title: "كشّاف الأعلام للزركلي",
    author: "خير الدين الزركلي",
    died: "1396هـ",
    category: "تراجم",
    description: "تحليل رقمي لموسوعة الأعلام الكبرى — 14,676 ترجمة، و1,643,208 كلمة، و7,313 حاشية في 8 أجزاء.",
    stats: [
      { label: "تراجم الأعلام", value: "14,676" },
      { label: "كلمات النص", value: "1,643,208" },
      { label: "حواشي", value: "7,313" },
      { label: "أنماط تواريخ", value: "8,734" },
    ],
    url: "https://marqoom45.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom45_alam_alzarkali_02ac0b0d.xlsx",
    docxUrl: "/manus-storage/marqoom45_alam_alzarkali_summary_916bdfbe.docx",
  },
  {
    id: "tahawiyya_ibn_abi_aliz",
    num: 46,
    title: "كشّاف شرح العقيدة الطحاوية لابن أبي العز",
    author: "صدر الدين ابن أبي العز الحنفي",
    died: "792هـ",
    category: "عقيدة",
    description: "تحليل رقمي للشرح العقدي التقريري الجدلي — 127,537 كلمة، و6,379 عبارة منهجية، وأعلى محور: الاستدلال النقلي والحديثي.",
    stats: [
      { label: "كلمات النص", value: "127,537" },
      { label: "عبارات منهجية", value: "6,379" },
      { label: "عناوين الفهرس", value: "393" },
      { label: "ملفات EPUB", value: "798" },
    ],
    url: "https://marqoom46.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom46_tahawiyya_ibn_abi_aliz_aaadc8b1.xlsx",
    docxUrl: "/manus-storage/marqoom46_tahawiyya_summary_ff6aecb0.docx",
  },
  {
    id: "khalq_afal_albukhari",
    num: 47,
    title: "كشّاف خلق أفعال العباد للبخاري",
    author: "الإمام البخاري",
    died: "256هـ",
    category: "عقيدة",
    description: "تحليل رقمي لكتاب البخاري العقدي — 24,566 كلمة، و890 صيغة أداء، و147 ذكراً للقرآن، و48 موضعاً لجذر جهم.",
    stats: [
      { label: "كلمات النص", value: "24,566" },
      { label: "صيغ الأداء", value: "890" },
      { label: "ذكر القرآن", value: "147" },
      { label: "أبواب الكتاب", value: "12" },
    ],
    url: "https://marqoom47.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom47_khalq_afal_albukhari_d7b4faff.xlsx",
    docxUrl: "/manus-storage/marqoom47_khalq_afal_summary_a33758b6.docx",
  },
  {
    id: "usul_itiqad_allalikai",
    num: 48,
    title: "كشّاف شرح أصول اعتقاد أهل السنة للالكائي",
    author: "أبو القاسم اللالكائي",
    died: "418هـ",
    category: "عقيدة",
    description: "تحليل رقمي للمصنف العقدي الأثري المسند — 233,873 كلمة، و7,332 صيغة أداء، وأعلى رقم للآثار: 2,823.",
    stats: [
      { label: "كلمات النص", value: "233,873" },
      { label: "صيغ الأداء", value: "7,332" },
      { label: "أعلى رقم أثر", value: "2,823" },
      { label: "شواهد قرآنية", value: "748" },
    ],
    url: "https://marqoom48.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom48_usul_itiqad_allalikai_afa85dee.xlsx",
    docxUrl: "/manus-storage/marqoom48_usul_itiqad_summary_82b76129.docx",
  },
  {
    id: "lisan_alarab",
    num: 49,
    title: "كشّاف لسان العرب لابن منظور",
    author: "ابن منظور الأفريقي",
    died: "711هـ",
    category: "لغة",
    description: "تحليل رقمي للمعجم اللغوي الموسوعي الكبير — 3,128,027 كلمة، و378,768 لفظاً فريداً، و32,701 شاهداً مرصوداً.",
    stats: [
      { label: "كلمات النص", value: "3,128,027" },
      { label: "ألفاظ فريدة", value: "378,768" },
      { label: "شواهد مرصودة", value: "32,701" },
      { label: "ملفات EPUB", value: "8,101" },
    ],
    url: "https://marqoom49.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom49_lisan_alarab_ibn_manzur_4d7de4c8.xlsx",
    docxUrl: "/manus-storage/marqoom49_lisan_alarab_summary_9d1ac665.docx",
  },
];
const CATEGORIES = [
  { id: "all", label: "الكل", count: 49 },
  { id: "حديث", label: "الحديث وعلومه", count: 22 },
  { id: "فقه", label: "الفقه المقارن", count: 7 },
  { id: "تفسير", label: "التفسير", count: 6 },
  { id: "عقيدة", label: "العقيدة والأصول", count: 6 },
  { id: "أصول", label: "الأصول والمنطق", count: 1 },
  { id: "لغة", label: "اللغة والنحو", count: 3 },
  { id: "سيرة", label: "السيرة والتاريخ", count: 4 },
  { id: "تراجم", label: "التراجم والأعلام", count: 1 },
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
        backgroundImage: "url('/manus-storage/marqoom_header2_707a96ff.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        height: "clamp(155px, 40vw, 380px)",
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
