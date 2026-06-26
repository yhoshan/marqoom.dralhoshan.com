import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";

// ═══════════════════════════════════════════════
// DESIGN: هوية مرقوم الرسمية
// الألوان: أخضر زمردي #1A7A6E + ذهبي #B5A05A + رمادي داكن #3A3A3A
// الشعار: /manus-storage/marqoom_logo_faca7079.png
// التوقيع: /manus-storage/marqoom_signature_a4c79224.png
// ═══════════════════════════════════════════════

// ── COLORS LIGHT (Teal/Firouzi palette from new header) ──
const C = {
  emerald: "#0D8A7A",
  emeraldDark: "#0A6B5E",
  emeraldLight: "#18B0A0",
  gold: "#B5A05A",
  goldLight: "#D4C07A",
  goldDark: "#8A7840",
  dark: "#0A2A28",
  darkMid: "#1A3A38",
  cream: "#F0FAF9",
  creamDark: "#D8F0EE",
  creamMid: "#B8E0DC",
  textDark: "#0A2A28",
  textMid: "#2A5A56",
  textLight: "#5A8A86",
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
  },

  {
    id: "kashaf50",
    num: 50,
    title: "كشّاف التفسير الوجيز للواحدي",
    author: "الواحدي النيسابوري",
    died: "468هـ",
    category: "تفسير",
    description: "تحليل رقمي لتفسير الواحدي الموجز — 6,236 مدخلاً قرآنياً، و176,801 كلمة، وتغطية كاملة من الفاتحة إلى الناس.",
    stats: [
      { label: "مداخل قرآنية", value: "6,236" },
      { label: "كلمات التفسير", value: "176,801" },
      { label: "أعلى سورة شرحاً", value: "البقرة" },
      { label: "متوسط كلمات/آية", value: "28.35" },
    ],
    url: "https://marqoom50.dralhoshan.com",
  },
  {
    id: "kashaf51",
    num: 51,
    title: "كشّاف الموسوعة الفقهية الكويتية",
    author: "وزارة الأوقاف الكويتية",
    died: "معاصر",
    category: "فقه",
    description: "تحليل رقمي للموسوعة الفقهية الكويتية — 31,950 مقطعاً، و4,810,041 كلمة، وأكثر من 28,000 حاشية فقهية.",
    stats: [
      { label: "مقاطع XHTML", value: "31,950" },
      { label: "كلمات تقريبية", value: "4,810,041" },
      { label: "حواشي فقهية", value: "28,218" },
      { label: "عناوين داخلية", value: "37,773" },
    ],
    url: "https://marqoom51.dralhoshan.com",
  },
  {
    id: "kashaf52",
    num: 52,
    title: "كشّاف تفسير البغوي",
    author: "البغوي",
    died: "516هـ",
    category: "تفسير",
    description: "تحليل رقمي لمعالم التنزيل للبغوي — 852,826 كلمة، و3,526 صفحة، و36,657 عبارة منهجية في قاموس التفسير.",
    stats: [
      { label: "كلمات تقريبية", value: "852,826" },
      { label: "صفحات EPUB", value: "3,526" },
      { label: "عبارات القاموس", value: "36,657" },
    ],
    url: "https://marqoom52.dralhoshan.com",
  },
  {
    id: "kashaf53",
    num: 53,
    title: "كشّاف تفسير أبي السعود",
    author: "أبو السعود العمادي",
    died: "982هـ",
    category: "تفسير",
    description: "تحليل رقمي لإرشاد العقل السليم — 1,032,820 كلمة، و8,642 مقطعاً، و74,717 عبارة في قاموس المصطلحات.",
    stats: [
      { label: "كلمات عربية", value: "1,032,820" },
      { label: "مقاطع XHTML", value: "8,642" },
      { label: "عبارات القاموس", value: "74,717" },
      { label: "مؤشر الخلاف", value: "90.41%" },
    ],
    url: "https://marqoom53.dralhoshan.com",
  },
  {
    id: "kashaf54",
    num: 54,
    title: "كشّاف تفسير ابن عرفة",
    author: "ابن عرفة المالكي",
    died: "803هـ",
    category: "تفسير",
    description: "تحليل رقمي لتفسير ابن عرفة — 101,086 كلمة، و994 صفحة، و8,181 مصطلحاً منهجياً.",
    stats: [
      { label: "كلمات النص", value: "101,086" },
      { label: "صفحات المتن", value: "994" },
      { label: "مصطلحات منهجية", value: "8,181" },
      { label: "نسبتها", value: "26.41%" },
    ],
    url: "https://marqoom54.dralhoshan.com",
  },
  {
    id: "kashaf55",
    num: 55,
    title: "كشّاف تفسير النسفي",
    author: "النسفي",
    died: "710هـ",
    category: "تفسير",
    description: "تحليل رقمي لمدارك التنزيل وحقائق التأويل — 556,376 كلمة، و7,814 صفحة، و23,863 مؤشراً منهجياً.",
    stats: [
      { label: "كلمات تقريبية", value: "556,376" },
      { label: "صفحات نصية", value: "7,814" },
      { label: "مؤشرات منهجية", value: "23,863" },
    ],
    url: "https://marqoom55.dralhoshan.com",
  },
  {
    id: "kashaf56",
    num: 56,
    title: "كشّاف تيسير العزيز الحميد",
    author: "سليمان بن عبدالله آل الشيخ",
    died: "1233هـ",
    category: "عقيدة",
    description: "تحليل رقمي لشرح كتاب التوحيد — 164,841 كلمة، و4,577 عبارة مصنفة، وتحليل منهجي للاستدلال العقدي.",
    stats: [
      { label: "كلمات عربية", value: "164,841" },
      { label: "عبارات مصنفة", value: "4,577" },
      { label: "شرح وتحليل", value: "1,065" },
      { label: "استدلال بالقرآن", value: "760" },
    ],
    url: "https://marqoom56.dralhoshan.com",
  },
  {
    id: "kashaf57",
    num: 57,
    title: "كشّاف جامع الأصول لابن الأثير",
    author: "ابن الأثير الجزري",
    died: "606هـ",
    category: "حديث",
    description: "تحليل رقمي للجامع الحديثي الكبير — 9,523 مدخلاً حديثياً، و1,608,250 كلمة في المتن، وأبو هريرة أكثر الرواة حضوراً.",
    stats: [
      { label: "مداخل حديثية", value: "9,523" },
      { label: "كلمات المتن", value: "1,608,250" },
      { label: "كلمات الحواشي", value: "1,767,702" },
      { label: "أعلى راوٍ", value: "أبو هريرة" },
    ],
    url: "https://marqoom57.dralhoshan.com",
  },
  {
    id: "kashaf58",
    num: 58,
    title: "كشّاف شرح السنة للبربهاري",
    author: "البربهاري",
    died: "329هـ",
    category: "عقيدة",
    description: "تحليل رقمي للمتن العقدي السلفي — 156 فقرة مرقمة، و6,994 كلمة، وتحليل موضوعي للقضايا العقدية.",
    stats: [
      { label: "فقرات مرقمة", value: "156" },
      { label: "كلمات المتن", value: "6,994" },
      { label: "مؤشرات الآيات", value: "8" },
      { label: "نطاق الصفحات", value: "33–138" },
    ],
    url: "https://marqoom58.dralhoshan.com",
  },
  {
    id: "kashaf59",
    num: 59,
    title: "كشّاف الرد على الجهمية لابن منده",
    author: "ابن منده",
    died: "395هـ",
    category: "عقيدة",
    description: "تحليل رقمي لكتاب الرد على الجهمية — 50 خبراً مرقماً، و4,153 كلمة في المتن، و509 صيغة أداء.",
    stats: [
      { label: "أخبار مرقمة", value: "50" },
      { label: "كلمات المتن", value: "4,153" },
      { label: "صيغ الأداء", value: "509" },
      { label: "آيات فريدة", value: "11" },
    ],
    url: "https://marqoom59.dralhoshan.com",
  },
  {
    id: "kashaf60",
    num: 60,
    title: "كشّاف أصول السرخسي",
    author: "السرخسي",
    died: "483هـ",
    category: "أصول",
    description: "تحليل رقمي لأصول السرخسي — 724 صفحة، 224,666 كلمة، و10,356 عبارة منهجية مرصودة.",
    stats: [
      { label: "صفحات", value: "724" },
      { label: "كلمة", value: "224,666" },
      { label: "عبارة منهجية", value: "10,356" },
      { label: "مصطلح أصولي", value: "6,708" },
    ],
    url: "https://marqoom60.dralhoshan.com",
  },
  {
    id: "kashaf61",
    num: 61,
    title: "كشّاف البحر المحيط للزركشي",
    author: "الزركشي",
    died: "794هـ",
    category: "أصول",
    description: "تحليل رقمي للبحر المحيط في أصول الفقه — 3,424 ملف XHTML، موسوعة أصولية تحريرية مقارنة.",
    stats: [
      { label: "ملف XHTML", value: "3,424" },
      { label: "إحالات الكتب", value: "2,465" },
      { label: "إشارات الأعلام", value: "7,495" },
      { label: "مراجع قرآنية", value: "6,497" },
    ],
    url: "https://marqoom61.dralhoshan.com",
  },
  {
    id: "kashaf62",
    num: 62,
    title: "كشّاف تدريب الراوي للسيوطي",
    author: "السيوطي",
    died: "911هـ",
    category: "حديث",
    description: "تحليل رقمي لتدريب الراوي في شرح تقريب النواوي — 926 عنصراً نصياً، 7,468 صيغة رواية وأداء.",
    stats: [
      { label: "عنصر نصي", value: "926" },
      { label: "صيغة رواية", value: "7,468" },
      { label: "مصطلح علوم حديث", value: "3,713" },
      { label: "عبارة خلاف", value: "1,203" },
    ],
    url: "https://marqoom62.dralhoshan.com",
  },
  {
    id: "kashaf63",
    num: 63,
    title: "كشّاف جامع البيان في القراءات للداني",
    author: "أبو عمرو الداني",
    died: "444هـ",
    category: "قرآن",
    description: "تحليل رقمي لجامع البيان في القراءات السبع — 1,683 صفحة، 272,651 كلمة، 26,075 صيغة أداء.",
    stats: [
      { label: "صفحة", value: "1,683" },
      { label: "كلمة", value: "272,651" },
      { label: "صيغة أداء", value: "26,075" },
      { label: "إشارة قارئ", value: "11,204" },
    ],
    url: "https://marqoom63.dralhoshan.com",
  },
  {
    id: "kashaf64",
    num: 64,
    title: "كشّاف روضة التقرير",
    author: "مجهول",
    died: "",
    category: "أصول",
    description: "تحليل رقمي لروضة التقرير — كشاف أصولي تفصيلي.",
    stats: [
      { label: "تصنيف", value: "أصول فقه" },
    ],
    url: "https://marqoom64.dralhoshan.com",
  },
  {
    id: "kashaf65",
    num: 65,
    title: "كشّاف روضة الناظر لابن قدامة",
    author: "ابن قدامة",
    died: "620هـ",
    category: "أصول",
    description: "تحليل رقمي لروضة الناظر وجنة المناظر في أصول الفقه الحنبلي.",
    stats: [
      { label: "تصنيف", value: "أصول حنبلي" },
    ],
    url: "https://marqoom65.dralhoshan.com",
  },
  {
    id: "kashaf66",
    num: 66,
    title: "كشّاف شرح طيبة النشر للنويري",
    author: "النويري",
    died: "857هـ",
    category: "قرآن",
    description: "تحليل رقمي لشرح طيبة النشر في القراءات العشر — كشاف قراءات منهجي.",
    stats: [
      { label: "تصنيف", value: "علوم القرآن" },
    ],
    url: "https://marqoom66.dralhoshan.com",
  },
  {
    id: "kashaf67",
    num: 67,
    title: "كشّاف شرح مختصر الروضة للطوفي",
    author: "الطوفي",
    died: "716هـ",
    category: "أصول",
    description: "تحليل رقمي لشرح مختصر الروضة — 2,052 ملف XHTML، 364,696 كلمة، 21,270 عبارة منهجية.",
    stats: [
      { label: "ملف XHTML", value: "2,052" },
      { label: "كلمة", value: "364,696" },
      { label: "عبارة منهجية", value: "21,270" },
      { label: "إشارة علم", value: "1,619" },
    ],
    url: "https://marqoom67.dralhoshan.com",
  },
  {
    id: "kashaf68",
    num: 68,
    title: "كشّاف فتح المغيث للسخاوي",
    author: "السخاوي",
    died: "902هـ",
    category: "حديث",
    description: "تحليل رقمي لفتح المغيث بشرح ألفية الحديث — 291,615 كلمة، 9,022 عبارة منهجية، 11,905 مصطلح.",
    stats: [
      { label: "كلمة", value: "291,615" },
      { label: "عبارة منهجية", value: "9,022" },
      { label: "مصطلح علوم حديث", value: "11,905" },
      { label: "إشارة علم", value: "5,222" },
    ],
    url: "https://marqoom68.dralhoshan.com",
  },
  {
    id: "kashaf69",
    num: 69,
    title: "كشّاف معجم الأدباء لياقوت الحموي",
    author: "ياقوت الحموي",
    died: "626هـ",
    category: "تراجم",
    description: "تحليل رقمي لمعجم الأدباء — 808,021 كلمة، 1,257 ترجمة مرصودة، 231 مصدراً.",
    stats: [
      { label: "كلمة", value: "808,021" },
      { label: "ترجمة مرصودة", value: "1,257" },
      { label: "مصدر", value: "231" },
      { label: "كلمة متن", value: "692,155" },
    ],
    url: "https://marqoom69.dralhoshan.com",
  },
  {
    id: "aqeela-ziyadah",
    num: 70,
    title: "كشّاف الزيادة والإحسان في علوم القرآن",
    author: "عقيلة المكي",
    death: "ت1150هـ",
    category: "قرآن",
    categoryLabel: "علوم القرآن والقراءات",
    description: "فهرس تحليلي رقمي للزيادة والإحسان في علوم القرآن — 9 أجزاء، 4,240 صفحة، 476,554 كلمة، 24,349 عبارة منهجية مرصودة.",
    stats: [
      { label: "صفحة", value: "4,240" },
      { label: "كلمة", value: "476,554" },
      { label: "عبارة منهجية", value: "24,349" },
      { label: "جزء", value: "9" },
    ],
    tag: "موسوعي تحريري عزوي في علوم القرآن",
    url: "https://marqoom70.dralhoshan.com",
  },
];
const CATEGORIES = [
  { id: "all", label: "الكل", count: 70 },
  { id: "حديث", label: "الحديث وعلومه", count: 25 },
  { id: "قرآن", label: "علوم القرآن والقراءات", count: 3 },
  { id: "فقه", label: "الفقه المقارن", count: 8 },
  { id: "تفسير", label: "التفسير", count: 12 },
  { id: "عقيدة", label: "العقيدة والأصول", count: 9 },
  { id: "أصول", label: "الأصول والمنطق", count: 6 },
  { id: "لغة", label: "اللغة والنحو", count: 3 },
  { id: "سيرة", label: "السيرة والتاريخ", count: 4 },
  { id: "تراجم", label: "التراجم والأعلام", count: 2 },
];

function normalizeArabic(text: string) {
  return text
    .replace(/[أإآا]/g, "ا")
    .replace(/[ةه]/g, "ه")
    .replace(/[يى]/g, "ي")
    .replace(/[\u064B-\u065F]/g, "");
}

const categoryColors: Record<string, { bg: string; text: string; accent: string }> = {
  حديث:  { bg: "#D8F5F2", text: "#0A5A52", accent: "#0D8A7A" },
  تفسير: { bg: "#EEF0F8", text: "#3A4580",     accent: "#5060C0" },
  فقه:   { bg: "#FFF4E6", text: "#7A4010",     accent: "#C06020" },
  عقيدة: { bg: "#EFF4EE", text: "#2E5A28",     accent: "#4A8A40" },
};

// ── COLORS DARK ──
const D = {
  emerald: "#18B0A0",
  emeraldDark: "#0D8A7A",
  emeraldLight: "#2ACABA",
  gold: "#D4C07A",
  goldLight: "#E8D89A",
  goldDark: "#B5A05A",
  dark: "#071E1C",
  darkMid: "#0E2E2C",
  cream: "#071E1C",
  creamDark: "#0E2E2C",
  creamMid: "#163E3C",
  textDark: "#D8F0EE",
  textMid: "#90C8C4",
  textLight: "#5A8A86",
  white: "#FFFFFF",
};

// ── حساب الإحصائيات الإجمالية ديناميكياً من البيانات ──
function parseNum(v: string): number {
  if (!v) return 0;
  const clean = v.replace(/[,،\+\s]/g, "");
  if (clean.endsWith("م")) return Math.round(parseFloat(clean) * 1_000_000);
  if (clean.endsWith("k") || clean.endsWith("K")) return Math.round(parseFloat(clean) * 1_000);
  return parseInt(clean) || 0;
}
// تسميات الصفحات المعتمدة في جميع الكشافات
const PAGE_LABELS = ["صفحة", "صفحات", "صفحات نصية", "صفحات المتن", "مقاطع XHTML", "صفحات/مقاطع", "عدد الصفحات"];
// تسميات الكلمات المعتمدة في جميع الكشافات
const WORD_LABELS = ["كلمة", "كلمات", "كلمات التفسير", "كلمات المتن", "كلمات عربية", "كلمات تقريبية", "إجمالي الكلمات", "كلمات النص"];
// تسميات العبارات المعتمدة في جميع الكشافات
const PHRASE_LABELS = ["عبارة", "عبارات", "عبارات مصنفة", "عبارات القاموس", "مجموع عبارات القاموس"];

function computeGlobalStats() {
  let totalPhrases = 0, totalPages = 0, totalWords = 0;
  for (const k of KASHAFAT) {
    for (const s of k.stats) {
      if (PHRASE_LABELS.some(l => s.label.includes(l.split(" ")[0]) && s.label.length < 20)) totalPhrases += parseNum(s.value);
      else if (PAGE_LABELS.some(l => s.label === l)) totalPages += parseNum(s.value);
      else if (WORD_LABELS.some(l => s.label === l)) totalWords += parseNum(s.value);
    }
  }
  return { totalPhrases, totalPages, totalWords, totalKashafat: KASHAFAT.length };
}
function fmtNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + " مليون";
  if (n >= 1_000) return n.toLocaleString("en-US");
  return String(n);
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const T = isDark ? D : C;
  const STATS = computeGlobalStats();

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
              background: isDark
                ? `linear-gradient(160deg, #071E1C 0%, #0A2A28 50%, #0E3230 100%)`
                : `linear-gradient(160deg, #0A6B5E 0%, #0D8A7A 45%, #18B0A0 80%, #20C8B8 100%)`,
              border: `2px solid rgba(${isDark ? '32,200,184' : '255,255,255'},0.25)`,
              borderRadius: 18,
              padding: "clamp(24px,5vw,36px)",
              maxWidth: 540,
              width: "100%",
              position: "relative",
              overflow: "hidden",
              boxShadow: isDark ? "0 24px 70px rgba(0,0,0,0.8)" : "0 24px 70px rgba(10,107,94,0.55)",
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
        backgroundImage: "url('/manus-storage/marqoom_header_wide2_620c02ba.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        height: "clamp(180px, 30vw, 540px)",
      }}>
        {/* Subtle dark gradient at bottom */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 100%)", pointerEvents: "none" }} />
        {/* Gold bottom line */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${T.gold}, ${T.goldLight}, ${T.gold}, transparent)` }} />
      </header>
      {/* ── STATS BAR ── */}
      <style>{`
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: clamp(10px,2vw,20px); max-width: 960px; margin: 0 auto; }
        @media (max-width: 600px) { .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; } }
      `}</style>
      <div style={{
        background: isDark
          ? `linear-gradient(135deg, #071E1C 0%, #0A2A28 100%)`
          : `linear-gradient(135deg, #0A6B5E 0%, #0D8A7A 50%, #18B0A0 100%)`,
        borderBottom: `2px solid ${T.gold}`,
        padding: "clamp(16px,3vw,28px) clamp(16px,4vw,24px)",
        direction: "rtl",
      }}>
        <div className="stats-grid">
          {[
            { icon: "fa-solid fa-book-open", value: String(STATS.totalKashafat), label: "كشافاً رقمياً", plus: false, arabicIcon: null },
            { icon: "fa-solid fa-list-check", value: fmtNum(STATS.totalPhrases), label: "عبارة محللة", plus: false, arabicIcon: null },
            { icon: "fa-solid fa-file-lines", value: fmtNum(STATS.totalPages), label: "صفحة مفهرسة", plus: false, arabicIcon: null },
            { icon: "", value: fmtNum(STATS.totalWords), label: "كلمة مُعالَجة", plus: false, arabicIcon: "ك" },
          ].map((stat, i) => (
            <div key={i} style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "clamp(4px,1vw,8px)",
              padding: "clamp(12px,2.5vw,20px) clamp(8px,2vw,16px)",
              borderRadius: 14,
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.18)",
              backdropFilter: "blur(8px)",
              textAlign: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.18)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.10)"; }}
            >
              {stat.arabicIcon ? (
                <span style={{ fontFamily: "'Amiri', serif", fontSize: "clamp(22px,4vw,32px)", fontWeight: 700, color: T.goldLight, lineHeight: 1, marginBottom: 2 }}>{stat.arabicIcon}</span>
              ) : (
                <i className={stat.icon} style={{ color: T.goldLight, fontSize: "clamp(18px,3.5vw,26px)", marginBottom: 2 }} />
              )}
              <div style={{ display: "flex", alignItems: "baseline", gap: 2, direction: "ltr" }}>
                <span style={{
                  fontFamily: "'Cairo', sans-serif",
                  fontSize: "clamp(18px,3.5vw,26px)",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  lineHeight: 1.15,
                  letterSpacing: 0,
                }}>{stat.value}</span>
              </div>
              <span style={{
                fontFamily: "'Noto Naskh Arabic', serif",
                fontSize: "clamp(11px,2.2vw,13px)",
                color: "rgba(255,255,255,0.75)",
                marginTop: 2,
              }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

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
        background: isDark ? T.dark : T.white,
        borderBottom: `2px solid ${T.creamMid}`,
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: isDark ? "0 2px 12px rgba(0,0,0,0.4)" : "0 2px 12px rgba(13,138,122,0.12)",
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
        background: `linear-gradient(160deg, ${T.emeraldDark} 0%, ${T.emerald} 60%, ${T.emeraldLight} 100%)`,
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


        </div>
      </div>
    </div>
  );
}
