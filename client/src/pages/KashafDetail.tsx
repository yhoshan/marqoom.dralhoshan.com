import { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";

// ═══════════════════════════════════════════════
// DESIGN: هوية مرقوم الرسمية
// الألوان: أخضر زمردي #1A7A6E + ذهبي #B5A05A + رمادي داكن #3A3A3A
// الصفحة التفصيلية: رسوميات وإحصائيات بصرية لكل كشاف
// ═══════════════════════════════════════════════

const C = {
  emerald: "#1A7A6E",
  emeraldDark: "#145F55",
  emeraldLight: "#2A9A8E",
  gold: "#B5A05A",
  goldLight: "#D4C07A",
  dark: "#2A2A2A",
  cream: "#F8F4EC",
  creamDark: "#EDE5D5",
  creamMid: "#E0D5C0",
  textDark: "#1E1E1E",
  textMid: "#4A4A4A",
  textLight: "#7A7A7A",
  white: "#FFFFFF",
};


// ── COLORS DARK ──
const D = {
  emerald: "#1A7A6E",
  emeraldDark: "#145F55",
  emeraldLight: "#2A9A8E",
  gold: "#B5A05A",
  goldLight: "#D4C07A",
  dark: "#2A2A2A",
  cream: "#1A1F2E",
  creamDark: "#232A3A",
  creamMid: "#2E3650",
  textDark: "#E8E0D0",
  textMid: "#B0A890",
  textLight: "#7A7A8A",
  white: "#FFFFFF",
};

const categoryColors: Record<string, { bg: string; text: string; accent: string; bar: string }> = {
  حديث:  { bg: "#E8F4F2", text: C.emeraldDark, accent: C.emerald,  bar: "#1A7A6E" },
  تفسير: { bg: "#EEF0F8", text: "#3A4580",     accent: "#5060C0",  bar: "#5060C0" },
  فقه:   { bg: "#FFF4E6", text: "#7A4010",     accent: "#C06020",  bar: "#C06020" },
  عقيدة: { bg: "#EFF4EE", text: "#2E5A28",     accent: "#4A8A40",  bar: "#4A8A40" },
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
    description: "فهرس تحليلي آلي شامل لشرح صحيح البخاري — أضخم شروح الحديث النبوي وأجمعها، يرصد المحاور الكبرى من أحاديث وأسانيد وتخريج وترجيح وإشكالات.",
    longDesc: "فتح الباري شرح صحيح البخاري لابن حجر العسقلاني (ت852هـ) هو أعظم شروح صحيح البخاري وأجمعها، استغرق مؤلفه في تأليفه ربع قرن من الزمان. يتناول هذا الكشاف الرقمي تحليلاً آلياً شاملاً لمحتوى الكتاب، رصداً للمحاور الكبرى من أحاديث وأسانيد وتخريج وترجيح وإشكالات وردود، مع فهرسة دقيقة لكل أبواب الكتاب.",
    stats: [
      { label: "كلمة", value: "3.5م", raw: 3500000 },
      { label: "عبارة", value: "217,433", raw: 217433 },
      { label: "صفحة", value: "7,807", raw: 7807 },
      { label: "باباً", value: "3,442", raw: 3442 },
    ],
    chartData: [
      { label: "أحاديث وأسانيد", pct: 38 },
      { label: "تخريج وترجيح", pct: 22 },
      { label: "فقه الحديث", pct: 18 },
      { label: "إشكالات وردود", pct: 12 },
      { label: "لغة وبيان", pct: 10 },
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
    description: "كشاف شامل لثلاثة مصنفات كبرى: التمهيد لما في الموطأ، والاستذكار، والاستيعاب — يرصد منهج الإمام الحافظ في الحديث والفقه والرجال.",
    longDesc: "ابن عبد البر القرطبي (ت463هـ) إمام المحدثين في الغرب الإسلامي، جمع هذا الكشاف ثلاثة مصنفاته الكبرى: التمهيد لما في الموطأ من المعاني والأسانيد، والاستذكار الجامع لمذاهب فقهاء الأمصار، والاستيعاب في معرفة الأصحاب. يرصد الكشاف منهج الإمام في الحديث والفقه المقارن وعلم الرجال.",
    stats: [
      { label: "كلمة", value: "8.5م", raw: 8500000 },
      { label: "عبارة", value: "235,427", raw: 235427 },
      { label: "صفحة", value: "13,722", raw: 13722 },
      { label: "مصنفات", value: "3", raw: 3 },
    ],
    chartData: [
      { label: "الحديث والأسانيد", pct: 35 },
      { label: "الفقه المقارن", pct: 28 },
      { label: "علم الرجال", pct: 20 },
      { label: "اللغة والبيان", pct: 10 },
      { label: "التاريخ والسير", pct: 7 },
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
    description: "فهرس تحليلي لخمسة مصنفات كبرى لشيخ الإسلام — يرصد الاستدلال النقلي والعقلي ومنهج النقد والرد على المخالفين والمدارس الكلامية.",
    longDesc: "شيخ الإسلام ابن تيمية (ت728هـ) من أبرز علماء الإسلام في العقيدة والأصول والفقه، يتناول هذا الكشاف خمسة مصنفاته الكبرى ويرصد منهجه في الاستدلال النقلي والعقلي، ونقد المدارس الكلامية والفلسفية، والرد على المخالفين، مع فهرسة شاملة للمسائل العقدية والأصولية.",
    stats: [
      { label: "كلمة", value: "5م", raw: 5000000 },
      { label: "عبارة", value: "145,175", raw: 145175 },
      { label: "صفحة", value: "29,828", raw: 29828 },
      { label: "مصنفات", value: "5", raw: 5 },
    ],
    chartData: [
      { label: "العقيدة والأصول", pct: 40 },
      { label: "الرد على المخالفين", pct: 25 },
      { label: "الفقه والفتاوى", pct: 18 },
      { label: "التفسير والحديث", pct: 10 },
      { label: "السلوك والتزكية", pct: 7 },
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
    description: "فهرس تحليلي لمفاتيح الغيب (التفسير الكبير) — يرصد الاستدلال والتعليل والجدل الكلامي والترجيح والقراءات في أضخم تفاسير القرآن الكريم.",
    longDesc: "مفاتيح الغيب للإمام فخر الدين الرازي (ت606هـ) أضخم التفاسير وأكثرها استيعاباً للعلوم العقلية والنقلية، يجمع بين التفسير والكلام والفلسفة والفقه. يرصد هذا الكشاف المنهج التفسيري للرازي في الاستدلال والتعليل والجدل الكلامي والترجيح بين الأقوال والقراءات القرآنية.",
    stats: [
      { label: "كلمة", value: "3م", raw: 3000000 },
      { label: "عبارة", value: "92,400+", raw: 92400 },
      { label: "جزءاً", value: "32", raw: 32 },
      { label: "نوع", value: "جدلي", raw: 1 },
    ],
    chartData: [
      { label: "التفسير والبيان", pct: 32 },
      { label: "الجدل الكلامي", pct: 28 },
      { label: "الفقه والأحكام", pct: 18 },
      { label: "القراءات", pct: 12 },
      { label: "العلوم العقلية", pct: 10 },
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
    description: "فهرس تحليلي للجامع لأحكام القرآن — يرصد الخلاف وعرض الأقوال والاستنباط الفقهي من القرآن الكريم في هذا التفسير الموسوعي الفقهي.",
    longDesc: "الجامع لأحكام القرآن للإمام القرطبي (ت671هـ) من أبرز التفاسير الفقهية في التراث الإسلامي، يُعنى بالأحكام الشرعية المستنبطة من الآيات القرآنية. يرصد هذا الكشاف منهج القرطبي في عرض الخلاف الفقهي والاستنباط من القرآن، مع فهرسة شاملة للمسائل والأقوال.",
    stats: [
      { label: "كلمة", value: "2.2م", raw: 2200000 },
      { label: "عبارة", value: "100,462", raw: 100462 },
      { label: "صفحة", value: "7,454", raw: 7454 },
      { label: "مدخل", value: "3,423", raw: 3423 },
    ],
    chartData: [
      { label: "الأحكام الفقهية", pct: 42 },
      { label: "الخلاف والأقوال", pct: 25 },
      { label: "التفسير والبيان", pct: 18 },
      { label: "الحديث والأسانيد", pct: 10 },
      { label: "اللغة والإعراب", pct: 5 },
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
    description: "فهرس تحليلي لجامع البيان في تأويل القرآن — أقدم التفاسير الكبرى وأوسعها في نقل أقوال السلف والروايات، يرصد الأعلام والمصادر والمدارس التفسيرية.",
    longDesc: "جامع البيان في تأويل القرآن للإمام ابن جرير الطبري (ت310هـ) أقدم التفاسير الكبرى المتكاملة وأوسعها في نقل أقوال السلف والروايات. يرصد هذا الكشاف الأعلام المذكورين في الكتاب، والمصادر المستشهد بها، والمدارس التفسيرية المختلفة، مع فهرسة شاملة للروايات والأسانيد.",
    stats: [
      { label: "كلمة", value: "4.3م", raw: 4300000 },
      { label: "مورد", value: "157,314", raw: 157314 },
      { label: "علم", value: "77,564", raw: 77564 },
      { label: "ملفات", value: "10", raw: 10 },
    ],
    chartData: [
      { label: "الروايات والأسانيد", pct: 45 },
      { label: "التأويل والبيان", pct: 25 },
      { label: "الأعلام والرجال", pct: 15 },
      { label: "اللغة والإعراب", pct: 10 },
      { label: "الأحكام", pct: 5 },
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
    description: "فهرس تحليلي للمجموع شرح المهذب — الموسوعة الفقهية الشافعية الكبرى، يرصد الخلاف المذهبي والمقارن في 44 كتاباً فقهياً.",
    longDesc: "المجموع شرح المهذب للإمام النووي (ت676هـ) من أعظم الموسوعات الفقهية في التراث الإسلامي، يجمع بين الفقه الشافعي والمقارنة المذهبية. يرصد هذا الكشاف الخلاف الفقهي بين المذاهب الأربعة، مع فهرسة شاملة لـ 44 كتاباً فقهياً تشمل العبادات والمعاملات.",
    stats: [
      { label: "كلمة", value: "2.8م", raw: 2800000 },
      { label: "صفحة", value: "9,793", raw: 9793 },
      { label: "كتاباً", value: "44", raw: 44 },
      { label: "مدخل", value: "335", raw: 335 },
    ],
    chartData: [
      { label: "الفقه الشافعي", pct: 40 },
      { label: "الخلاف المذهبي", pct: 30 },
      { label: "الحديث والأسانيد", pct: 15 },
      { label: "الأصول والقواعد", pct: 10 },
      { label: "اللغة والتعريفات", pct: 5 },
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
    description: "فهرس تحليلي للمحلى بالآثار — الموسوعة الفقهية الظاهرية الكبرى، يرصد المنهج الأثري الجدلي في 61 كتاباً فقهياً مع 2158 مسألة.",
    longDesc: "المحلى بالآثار لابن حزم الأندلسي (ت456هـ) الموسوعة الفقهية الظاهرية الكبرى التي تتميز بمنهجها الأثري الجدلي الصارم في الاستدلال بالنصوص. يرصد هذا الكشاف المنهج الفقهي لابن حزم في 61 كتاباً فقهياً تشمل 2158 مسألة، مع فهرسة شاملة للأدلة والردود.",
    stats: [
      { label: "كلمة", value: "1.5م", raw: 1500000 },
      { label: "عبارة", value: "117,854", raw: 117854 },
      { label: "كتاباً", value: "61", raw: 61 },
      { label: "مسألة", value: "2,158", raw: 2158 },
    ],
    chartData: [
      { label: "المسائل الفقهية", pct: 38 },
      { label: "الأدلة النصية", pct: 30 },
      { label: "الرد على المخالفين", pct: 20 },
      { label: "الحديث والأسانيد", pct: 8 },
      { label: "التعريفات", pct: 4 },
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
    description: "فهرس تحليلي للمغني شرح مختصر الخرقي — الموسوعة الفقهية الحنبلية الكبرى في الفقه المقارن، يرصد 70 كتاباً فقهياً و37,985 عبارة تحليلية.",
    longDesc: "المغني شرح مختصر الخرقي لابن قدامة المقدسي (ت620هـ) الموسوعة الفقهية الحنبلية الكبرى في الفقه المقارن، يعرض الخلاف بين المذاهب الأربعة بأسلوب علمي دقيق. يرصد هذا الكشاف 70 كتاباً فقهياً و37,985 عبارة تحليلية مع فهرسة شاملة للمسائل والأدلة.",
    stats: [
      { label: "كلمة", value: "1.8م", raw: 1800000 },
      { label: "عبارة", value: "37,985", raw: 37985 },
      { label: "كتاباً", value: "70", raw: 70 },
      { label: "مدخل", value: "7,668", raw: 7668 },
    ],
    chartData: [
      { label: "الفقه الحنبلي", pct: 38 },
      { label: "الخلاف المذهبي", pct: 32 },
      { label: "الأدلة والتعليل", pct: 18 },
      { label: "الحديث والأسانيد", pct: 8 },
      { label: "الأصول والقواعد", pct: 4 },
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
    description: "فهرس تحليلي لبدائع الصنائع في ترتيب الشرائع — الموسوعة الفقهية الحنفية التعليلية، يرصد 66 كتاباً فقهياً بمنهج تعليلي مقارن فريد.",
    longDesc: "بدائع الصنائع في ترتيب الشرائع للإمام الكاساني (ت587هـ) الموسوعة الفقهية الحنفية التعليلية التي تتميز بمنهجها الفريد في التعليل والتأصيل. يرصد هذا الكشاف 66 كتاباً فقهياً بمنهج تعليلي مقارن مع فهرسة شاملة للمسائل والأدلة والتعليلات.",
    stats: [
      { label: "كلمة", value: "1.5م", raw: 1500000 },
      { label: "صفحة", value: "2,127", raw: 2127 },
      { label: "كتاباً", value: "66", raw: 66 },
      { label: "مدخل", value: "953", raw: 953 },
    ],
    chartData: [
      { label: "الفقه الحنفي", pct: 42 },
      { label: "التعليل والتأصيل", pct: 28 },
      { label: "الخلاف المذهبي", pct: 18 },
      { label: "الأدلة النصية", pct: 8 },
      { label: "التعريفات", pct: 4 },
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
    description: "فهرس تحليلي لثلاثة مصنفات كبرى: إعلام الموقعين، ومدارج السالكين، وزاد المعاد — يرصد الحديث والرواية والسلوك والتزكية والاستدلال.",
    longDesc: "ابن قيم الجوزية (ت751هـ) من أبرز علماء الإسلام في العقيدة والسلوك والفقه، يجمع هذا الكشاف ثلاثة مصنفاته الكبرى: إعلام الموقعين عن رب العالمين، ومدارج السالكين بين منازل إياك نعبد وإياك نستعين، وزاد المعاد في هدي خير العباد. يرصد الكشاف الحديث والرواية والسلوك والتزكية والاستدلال الفقهي.",
    stats: [
      { label: "كلمة", value: "1م+", raw: 1000000 },
      { label: "عبارة", value: "37,290", raw: 37290 },
      { label: "صفحة", value: "3,107", raw: 3107 },
      { label: "مصنفات", value: "3", raw: 3 },
    ],
    chartData: [
      { label: "السلوك والتزكية", pct: 35 },
      { label: "العقيدة والأصول", pct: 28 },
      { label: "الفقه والاستدلال", pct: 20 },
      { label: "الحديث والرواية", pct: 12 },
      { label: "السيرة والتاريخ", pct: 5 },
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
    description: "فهرس تحليلي رقمي لصحيح البخاري — يرصد 97 كتاباً و3,870 باباً وصيغ الأداء والرواية والأسانيد، مع تحليل شيوخ البخاري المباشرين البالغين 519 اسماً فريداً.",
    longDesc: "صحيح البخاري (ت256هـ) أصح كتاب بعد كتاب الله، يجمع هذا الكشّاف تحليلاً رقمياً شاملاً لبنيته الحديثية: 97 كتاباً و3,870 باباً و602,468 كلمة وصيغ أداء ورواية بلغت 59,307 ظهوراً، و519 شيخاً مباشراً فريداً. أعلى كتاب مداخل حديثية: كتاب تفسير القرآن بـ368 باباً.",
    stats: [
      { label: "كلمة", value: "602,468", raw: 602468 },
      { label: "حديث", value: "7,563", raw: 7563 },
      { label: "باب", value: "3,870", raw: 3870 },
      { label: "كتاب", value: "97", raw: 97 },
    ],
    chartData: [
      { label: "صيغ الأداء والرواية", pct: 42 },
      { label: "التبويب والترتيب", pct: 28 },
      { label: "الأسانيد والرجال", pct: 18 },
      { label: "الآيات والاستشهاد", pct: 8 },
      { label: "المدارس والاتجاهات", pct: 4 },
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
    description: "فهرس تحليلي رقمي لكتاب التمييز — مصنَّف نقدي حديثي مركّز في 52 صفحة، يرصد 1,103 صيغة أداء ورواية، و99 علامة نقد وعلل، مع تحليل مركزية الإسناد على المتن.",
    longDesc: "كتاب التمييز للإمام مسلم (ت261هـ) مصنف نقدي حديثي فريد يكشف أسس تمييز الروايات وعللها. يرصد الكشّاف 1,103 صيغة أداء ورواية، و99 علامة نقد وعلل، ويكشف أن ذكر الإسناد (26) يفوق ذكر المتن (13)، دلالة على مركزية الإسناد في منهج مسلم.",
    stats: [
      { label: "كلمة", value: "10,613", raw: 10613 },
      { label: "حديث", value: "106", raw: 106 },
      { label: "صفحة", value: "52", raw: 52 },
      { label: "علامة نقد", value: "99", raw: 99 },
    ],
    chartData: [
      { label: "صيغ الأداء والرواية", pct: 45 },
      { label: "النقد والعلل", pct: 28 },
      { label: "الإسناد", pct: 18 },
      { label: "الترجيح والتصحيح", pct: 9 },
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
    description: "فهرس تحليلي رقمي للرسالة والأم — يرصد 1,236,322 كلمة في المصنَّفين، مع تحليل مؤشرات الجدل والاستدلال والتعليل، ويكشف الفرق البنيوي بين الطابع الأصولي للرسالة والطابع الفقهي التطبيقي للأم.",
    longDesc: "الإمام الشافعي (ت204هـ) مؤسس علم أصول الفقه. يجمع هذا الكشّاف تحليلاً مقارناً لمصنفين: الرسالة (48,083 كلمة) والأم (1,188,239 كلمة). الرسالة ذات بناء أصولي حواري بمؤشر جدل 22.17%، والأم ذات بناء فقهي تطبيقي بتعليل (9,627 مرة) وحضور (قال الشافعي) 7,715 مرة.",
    stats: [
      { label: "كلمة", value: "1.2م+", raw: 1236322 },
      { label: "عبارة", value: "48,967", raw: 48967 },
      { label: "مقطع", value: "2,528", raw: 2528 },
      { label: "مصنَّف", value: "2", raw: 2 },
    ],
    chartData: [
      { label: "الاستدلال والتعليل", pct: 38 },
      { label: "الجدل والحوار", pct: 24 },
      { label: "الخلاف والترجيح", pct: 20 },
      { label: "الأدلة الشرعية", pct: 12 },
      { label: "التعريف والتقسيم", pct: 6 },
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
    description: "فهرس تحليلي رقمي للمستصفى — يرصد 182,512 كلمة في كتاب أصول الفقه التحليلي الجدلي، مع تحليل مؤشرات الاستدلال والتعليل والجدل والتعريف والحدود، وأعلى الأعلام حضوراً: الشافعي بـ 93 ظهوراً.",
    longDesc: "المستصفى للغزالي (ت505هـ) كتاب أصول فقه تحليلي جدلي ذو مقدمة منطقية/برهانية. يرصد الكشّاف 182,512 كلمة في 381 ملف XHTML و295 مدخلاً. مؤشر الخلاف 31.33%، مؤشر الترجيح 50.67%، مؤشر النقد 36.49%، مؤشر الجدل 14.31%، مؤشر الاستدلال 32.07%.",
    stats: [
      { label: "كلمة", value: "182,512", raw: 182512 },
      { label: "مدخل", value: "295", raw: 295 },
      { label: "مؤشر خلاف", value: "31.33%", raw: 31 },
      { label: "مؤشر ترجيح", value: "50.67%", raw: 51 },
    ],
    chartData: [
      { label: "الاستدلال والتعليل", pct: 32 },
      { label: "الجدل والحدود", pct: 28 },
      { label: "الخلاف والترجيح", pct: 22 },
      { label: "الأدلة الشرعية", pct: 12 },
      { label: "اللغة والدلالة", pct: 6 },
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
    description: "فهرس تحليلي رقمي لأنوار التنزيل وأسرار التأويل — يرصد 567,780 كلمة في 114 سورة، مع تحليل مؤشرات التفسير والبيان والتعليل والقراءات والإعراب والموارد الفقهية.",
    longDesc: "تفسير البيضاوي (ت685هـ) أنوار التنزيل وأسرار التأويل تفسير تحريري. يرصد الكشّاف 567,780 كلمة في 1,253 صفحة تغطي 114 سورة. أكثر المجالات حضوراً: التفسير والبيان (21,947 ضربة)، التعليل والاستدلال، القراءات، الإعراب والتوجيه اللغوي. أعلى السور كثافة: البقرة، النساء، آل عمران، المائدة.",
    stats: [
      { label: "كلمة", value: "567,780", raw: 567780 },
      { label: "سورة", value: "114", raw: 114 },
      { label: "صفحة", value: "1,253", raw: 1253 },
      { label: "ضربة قاموس", value: "82,426", raw: 82426 },
    ],
    chartData: [
      { label: "التفسير والبيان", pct: 36 },
      { label: "التعليل والاستدلال", pct: 28 },
      { label: "القراءات والرواة", pct: 18 },
      { label: "الإعراب واللغة", pct: 12 },
      { label: "الموارد الفقهية", pct: 6 },
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
    description: "فهرس تحليلي رقمي لكتاب التوحيد — يرصد 67 باباً و588 مسألة و129 إحالة قرآنية، مع تحليل المحاور العقدية: الشرك والتوحيد والدعاء والاستغاثة وسد الذرائع.",
    longDesc: "كتاب التوحيد لابن عبدالوهاب (ت1206هـ) مرجع عقدي محوري. يرصد الكشّاف 67 باباً و588 مسألة و129 إحالة قرآنية و173 دليلاً قبل المسائل. المحاور العقدية: الشرك الأكبر والأصغر (26.87%)، التوحيد والشهادة (22.39%)، الدعاء والاستغاثة (17.91%)، الألفاظ والآداب (17.91%).",
    stats: [
      { label: "باب", value: "67", raw: 67 },
      { label: "مسألة", value: "588", raw: 588 },
      { label: "آية", value: "129", raw: 129 },
      { label: "حديث وأثر", value: "173", raw: 173 },
    ],
    chartData: [
      { label: "الشرك والتوحيد", pct: 49 },
      { label: "الدعاء والاستغاثة", pct: 18 },
      { label: "الألفاظ والآداب", pct: 18 },
      { label: "وسائل الشرك وسد الذرائع", pct: 10 },
      { label: "السحر والكهانة", pct: 5 },
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
    description: "فهرس تحليلي رقمي للكتاب — يرصد 277,406 كلمة في 1,973 صفحة، مع تحليل المصطلحات النحوية واللغوية البالغة 9,934 مصطلحاً، والأعلام والمدارس النحوية والاتجاهات.",
    longDesc: "كتاب سيبويه (ت180هـ) أساس علم النحو العربي. يرصد الكشّاف 277,406 كلمة في 1,973 صفحة وعبارات قاموس 14,327 ظهوراً، ومصطلحات نحوية/لغوية 9,934 مصطلحاً، و935 علماً، وإشارات مدارس 1,322. أبرز أغراض الكتاب: التعليل (32.81%)، التعليم والخطاب (19.29%)، التبويب والبناء (6.32%).",
    stats: [
      { label: "كلمة", value: "277,406", raw: 277406 },
      { label: "مصطلح نحوي", value: "9,934", raw: 9934 },
      { label: "صفحة", value: "1,973", raw: 1973 },
      { label: "علم", value: "935", raw: 935 },
    ],
    chartData: [
      { label: "التعليل والتقعيد", pct: 33 },
      { label: "التعليم والخطاب", pct: 19 },
      { label: "المصطلحات النحوية", pct: 25 },
      { label: "اللغات واللهجات", pct: 12 },
      { label: "التبويب والبناء", pct: 11 },
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
    description: "فهرس تحليلي رقمي للروض المربع شرح زاد المستقنع — يرصد 150,368 كلمة في شرح فقهي حنبلي، مع تحليل 11,939 عبارة وأبرز مصطلحات الشرح والبيان والتعليل والاستدلال النصي.",
    longDesc: "الروض المربع شرح زاد المستقنع لمنصور البهوتي (ت1051هـ) شرح فقهي حنبلي معتمد. يرصد الكشّاف 150,368 كلمة و880,383 حرفاً و626 علماً وإشارات مدارس 1,201. أبرز مصطلحات: الشرح والبيان (أي: 3,552)، التعليل والتقعيد (إذ: 1,342)، الاستدلال النصي (رواه: 381).",
    stats: [
      { label: "كلمة", value: "150,368", raw: 150368 },
      { label: "عبارة", value: "11,939", raw: 11939 },
      { label: "علم", value: "626", raw: 626 },
      { label: "إشارة مدرسة", value: "1,201", raw: 1201 },
    ],
    chartData: [
      { label: "الشرح والبيان", pct: 38 },
      { label: "التعليل والتقعيد", pct: 28 },
      { label: "الاستدلال النصي", pct: 20 },
      { label: "المدارس والاتجاهات", pct: 9 },
      { label: "الأعلام", pct: 5 },
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
    description: "فهرس تحليلي رقمي لجامع الترمذي — يرصد 381,819 كلمة في 2,224 باباً، مع تحليل 2,824 حكماً حديثياً و438 شيخاً مباشراً.",
    longDesc: "جامع الترمذي (ت279هـ) من أهم كتب الحديث وأوسعها في نقد الأحاديث. يرصد الكشّاف 381,819 كلمة في 2,224 باباً، مع 2,824 حكماً حديثياً بعبارة \"هذا حديث\" موزّعة بين حسن وصحيح وغريب، و438 شيخاً مباشراً.",
    stats: [
      { label: "كلمة", value: "381,819", raw: 381819 },
      { label: "حكم حديثي", value: "2,824", raw: 2824 },
      { label: "باباً", value: "2,224", raw: 2224 },
      { label: "شيخاً", value: "438", raw: 438 },
    ],
    chartData: [
      { label: "حسن صحيح", pct: 42 },
      { label: "حسن غريب", pct: 28 },
      { label: "صحيح", pct: 18 },
      { label: "غريب", pct: 8 },
      { label: "ضعيف", pct: 4 },
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
    description: "فهرس تحليلي رقمي لصحيح مسلم — يرصد 516,329 كلمة في 56 كتاباً و1,334 باباً، مع 6,986 مدخلاً حديثياً و3,010 حديثاً فريداً.",
    longDesc: "صحيح مسلم (ت261هـ) ثاني الصحيحين وأحكمهما ترتيباً. يرصد الكشّاف 516,329 كلمة في 56 كتاباً و1,334 باباً، مع 6,986 مدخلاً حديثياً و3,010 حديثاً فريداً و375 شيخاً مباشراً.",
    stats: [
      { label: "كلمة", value: "516,329", raw: 516329 },
      { label: "مدخل حديثي", value: "6,986", raw: 6986 },
      { label: "باباً", value: "1,334", raw: 1334 },
      { label: "شيخاً", value: "375", raw: 375 },
    ],
    chartData: [
      { label: "الصلاة", pct: 35 },
      { label: "الطهارة", pct: 22 },
      { label: "الحج", pct: 15 },
      { label: "البيوع", pct: 18 },
      { label: "الإيمان", pct: 10 },
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
    description: "فهرس تحليلي رقمي لمسند الإمام أحمد — يرصد 5,412,638 كلمة في 45 جزءاً، مع 27,317 مدخلاً حديثياً و1,045 مسنداً.",
    longDesc: "مسند الإمام أحمد (ت241هـ) أضخم دواوين الحديث. يرصد الكشّاف 5,412,638 كلمة في 45 جزءاً، مع 27,317 مدخلاً حديثياً و1,045 مسنداً وقسماً، و23,204 راوياً وعلماً مستخرجاً آلياً.",
    stats: [
      { label: "كلمة", value: "5,412,638", raw: 5412638 },
      { label: "مدخل حديثي", value: "27,317", raw: 27317 },
      { label: "مسنداً", value: "1,045", raw: 1045 },
      { label: "راوياً", value: "23,204", raw: 23204 },
    ],
    chartData: [
      { label: "الفقه والأحكام", pct: 38 },
      { label: "العقيدة", pct: 22 },
      { label: "السيرة", pct: 18 },
      { label: "الآداب", pct: 14 },
      { label: "التفسير", pct: 8 },
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
    description: "فهرس تحليلي رقمي لسنن أبي داود — يرصد 337,677 كلمة في 5,274 حديثاً و1,869 باباً، مع 853 تعقيباً صريحاً لأبي داود.",
    longDesc: "سنن أبي داود (ت275هـ) من أهم السنن الفقهية. يرصد الكشّاف 337,677 كلمة في 5,274 حديثاً و1,869 باباً، مع 853 تعقيباً صريحاً و672 شيخاً مباشراً فريداً.",
    stats: [
      { label: "كلمة", value: "337,677", raw: 337677 },
      { label: "حديثاً", value: "5,274", raw: 5274 },
      { label: "باباً", value: "1,869", raw: 1869 },
      { label: "تعقيباً", value: "853", raw: 853 },
    ],
    chartData: [
      { label: "الصلاة", pct: 30 },
      { label: "الطهارة", pct: 20 },
      { label: "البيوع", pct: 22 },
      { label: "النكاح", pct: 15 },
      { label: "الجهاد", pct: 13 },
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
    description: "فهرس تحليلي رقمي لسنن ابن ماجه — يرصد 135,895 كلمة في 2,130 مدخلاً حديثياً و682 باباً.",
    longDesc: "سنن ابن ماجه (ت273هـ) سادس الكتب الستة. يرصد الكشّاف 135,895 كلمة في 2,130 مدخلاً حديثياً و682 باباً في 12 كتاباً، مع غلبة صيغة \"عن\" و\"حدثنا\" في النص.",
    stats: [
      { label: "كلمة", value: "135,895", raw: 135895 },
      { label: "مدخل حديثي", value: "2,130", raw: 2130 },
      { label: "باباً", value: "682", raw: 682 },
      { label: "كتاباً", value: "12", raw: 12 },
    ],
    chartData: [
      { label: "الصلاة", pct: 28 },
      { label: "الطهارة", pct: 18 },
      { label: "البيوع", pct: 25 },
      { label: "النكاح", pct: 17 },
      { label: "الحدود", pct: 12 },
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
    description: "فهرس تحليلي رقمي للسنن الكبرى — يرصد 804,232 كلمة في 11,699 مدخلاً حديثياً و4,534 باباً و1,444 شيخاً.",
    longDesc: "السنن الكبرى للنسائي (ت303هـ) أوسع رواياته وأشملها. يرصد الكشّاف 804,232 كلمة في 11,699 مدخلاً حديثياً و4,534 باباً، مع 92,087 صيغة أداء و1,444 شيخاً فريداً.",
    stats: [
      { label: "كلمة", value: "804,232", raw: 804232 },
      { label: "مدخل حديثي", value: "11,699", raw: 11699 },
      { label: "باباً", value: "4,534", raw: 4534 },
      { label: "شيخاً", value: "1,444", raw: 1444 },
    ],
    chartData: [
      { label: "الصلاة", pct: 32 },
      { label: "الطهارة", pct: 20 },
      { label: "الصيام", pct: 15 },
      { label: "الحج", pct: 18 },
      { label: "البيوع", pct: 15 },
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
    description: "فهرس تحليلي رقمي لمسند الدارمي — يرصد 575,142 كلمة في 3,542 مدخلاً حديثياً و674 باباً و248 شيخاً.",
    longDesc: "سنن الدارمي (ت255هـ) مسند حديثي متقدم بمقدمة علمية واسعة. يرصد الكشّاف 575,142 كلمة في 3,542 مدخلاً حديثياً و674 باباً و248 شيخاً مباشراً.",
    stats: [
      { label: "كلمة", value: "575,142", raw: 575142 },
      { label: "مدخل حديثي", value: "3,542", raw: 3542 },
      { label: "باباً", value: "674", raw: 674 },
      { label: "شيخاً", value: "248", raw: 248 },
    ],
    chartData: [
      { label: "العلم والسنة", pct: 35 },
      { label: "الفتيا والأحكام", pct: 25 },
      { label: "الصلاة", pct: 20 },
      { label: "البدعة والنقد", pct: 12 },
      { label: "الزهد", pct: 8 },
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
    description: "فهرس تحليلي رقمي لموطأ مالك — يرصد 147,668 كلمة في 1,821 مدخلاً في 61 كتاباً و601 باباً.",
    longDesc: "موطأ مالك (ت179هـ) أول الدواوين الحديثية الفقهية. يرصد الكشّاف 147,668 كلمة في 1,821 مدخلاً في 61 كتاباً و601 باباً برواية يحيى الليثي.",
    stats: [
      { label: "كلمة", value: "147,668", raw: 147668 },
      { label: "مدخل", value: "1,821", raw: 1821 },
      { label: "كتاباً", value: "61", raw: 61 },
      { label: "باباً", value: "601", raw: 601 },
    ],
    chartData: [
      { label: "الصلاة", pct: 30 },
      { label: "البيوع", pct: 25 },
      { label: "الحج", pct: 18 },
      { label: "الطلاق", pct: 15 },
      { label: "الجهاد", pct: 12 },
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
    description: "فهرس تحليلي رقمي لصحيح ابن خزيمة — يرصد 351,946 كلمة في 3,079 حديثاً و2,141 باباً و705 تعليقاً صريحاً.",
    longDesc: "صحيح ابن خزيمة (ت311هـ) من أهم المستخرجات الحديثية. يرصد الكشّاف 351,946 كلمة في 3,079 حديثاً و2,141 باباً فريداً، مع 705 تعليقاً صريحاً بعبارة \"قال أبو بكر\".",
    stats: [
      { label: "كلمة", value: "351,946", raw: 351946 },
      { label: "حديثاً", value: "3,079", raw: 3079 },
      { label: "باباً", value: "2,141", raw: 2141 },
      { label: "تعليقاً", value: "705", raw: 705 },
    ],
    chartData: [
      { label: "الصلاة", pct: 40 },
      { label: "الطهارة", pct: 22 },
      { label: "الصيام", pct: 18 },
      { label: "الحج", pct: 12 },
      { label: "الزكاة", pct: 8 },
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
    description: "فهرس تحليلي رقمي للسيرة النبوية لابن هشام — يرصد 279,341 كلمة في 1,385 صفحة وتحليل مؤشرات الرواية والسرد التاريخي.",
    longDesc: "السيرة النبوية لابن هشام (ت213هـ) أوسع مصنفات السيرة. يرصد الكشّاف 279,341 كلمة في 1,385 صفحة، مع 2,387 عنواناً و1,331 حاشية، وتحليل مؤشرات الرواية والعزو والنسب والقبائل.",
    stats: [
      { label: "كلمة", value: "279,341", raw: 279341 },
      { label: "صفحة", value: "1,385", raw: 1385 },
      { label: "عنواناً", value: "2,387", raw: 2387 },
      { label: "حاشية", value: "1,331", raw: 1331 },
    ],
    chartData: [
      { label: "الغزوات والسرايا", pct: 30 },
      { label: "النسب والقبائل", pct: 25 },
      { label: "السيرة المكية", pct: 22 },
      { label: "السيرة المدنية", pct: 15 },
      { label: "الحوادث", pct: 8 },
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
    category: "فقه مقارن",
    description: "فهرس تحليلي رقمي لكتاب الأوسط في السنن والإجماع والاختلاف — يرصد 373,788 كلمة في 5,086 صفحة، مع تحليل 1,460 باباً ومسألة، و3,531 حديثاً وأثراً، و2,755 استخراجاً للإجماع والاختلاف والترجيح، و1,138 موضعاً لقول أبي بكر.",
    stats: [
      { label: "كلمة", value: "373,788" },
      { label: "صفحة", value: "5,086" },
      { label: "باباً", value: "1,460" },
      { label: "حديثاً", value: "3,531" },
      { label: "استخراج إجماع", value: "2,755" },
      { label: "قول أبي بكر", value: "1,138" },
    ],
    chartData: [
      { label: "الإجماع والاختلاف", pct: 54 },
      { label: "الأحاديث والآثار", pct: 35 },
      { label: "قول أبي بكر", pct: 11 },
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
    category: "حديث وفقه",
    description: "فهرس تحليلي رقمي لشرح معاني الآثار — يرصد 1,850,285 كلمة في 337 باباً، مع تحليل مؤشرات الأحاديث والآثار والاستدلال الفقهي وأوجه الخلاف بين المذاهب ومنهج الطحاوي في التوفيق والترجيح.",
    stats: [
      { label: "كلمة", value: "1,850,285" },
      { label: "باباً", value: "337" },
    ],
    chartData: [
      { label: "الأحاديث والآثار", pct: 60 },
      { label: "الاستدلال الفقهي", pct: 25 },
      { label: "الخلاف بين المذاهب", pct: 15 },
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
    category: "سيرة وشرح",
    description: "فهرس تحليلي رقمي للروض الأنف في شرح السيرة النبوية لابن هشام — يرصد مؤشرات الشرح اللغوي والتاريخي والفقهي والنقد الحديثي ومنهج السهيلي في التعليق على أحداث السيرة وتوجيه الروايات.",
    stats: [],
    chartData: [
      { label: "الشرح اللغوي", pct: 40 },
      { label: "النقد التاريخي", pct: 35 },
      { label: "الفقه والحديث", pct: 25 },
    ],
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
    category: "غريب الحديث",
    description: "فهرس تحليلي رقمي لكتاب النهاية في غريب الحديث والأثر — يرصد 582 باباً مع تحليل مؤشرات المصطلحات اللغوية الغريبة وشواهدها الحديثية وأصولها المعجمية وطريقة ابن الأثير في التوضيح والتأصيل.",
    stats: [
      { label: "باباً", value: "582" },
    ],
    chartData: [
      { label: "المصطلحات اللغوية", pct: 70 },
      { label: "الشواهد الحديثية", pct: 30 },
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
    category: "حديث وفقه",
    description: "فهرس تحليلي رقمي للسنن الكبرى — يرصد 3,751,155 كلمة في 3,731 باباً، مع تحليل مؤشرات الأحاديث والآثار والاستدلال الفقهي والتعليقات النقدية ومنهج البيهقي في التوثيق والاستنباط.",
    stats: [
      { label: "كلمة", value: "3,751,155" },
      { label: "باباً", value: "3,731" },
    ],
    chartData: [
      { label: "الأحاديث والآثار", pct: 65 },
      { label: "الاستدلال الفقهي", pct: 25 },
      { label: "التعليقات النقدية", pct: 10 },
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
    category: "رجال الحديث",
    description: "فهرس تحليلي رقمي لتهذيب الكمال في أسماء الرجال — يرصد 4,052,217 كلمة مع تحليل مؤشرات التراجم والجرح والتعديل وصيغ الرواية والمدارس الحديثية وطبقات الرواة ومنهج المزي في التحقيق والتمييز.",
    stats: [
      { label: "كلمة", value: "4,052,217" },
    ],
    chartData: [
      { label: "التراجم", pct: 50 },
      { label: "الجرح والتعديل", pct: 35 },
      { label: "صيغ الرواية", pct: 15 },
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
    category: "حديث وآثار",
    description: "فهرس تحليلي رقمي للمصنف — يرصد 4,970 باباً مع تحليل مؤشرات الأحاديث والآثار والفتاوى الفقهية وأقوال الصحابة والتابعين ومنهج ابن أبي شيبة في التبويب والاستيعاب.",
    stats: [
      { label: "باباً", value: "4,970" },
    ],
    chartData: [
      { label: "الأحاديث والآثار", pct: 55 },
      { label: "الفتاوى الفقهية", pct: 30 },
      { label: "أقوال الصحابة", pct: 15 },
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
    category: "تفسير مسند",
    description: "فهرس تحليلي رقمي لتفسير ابن أبي حاتم المسند — يرصد 894,075 كلمة و20,230 مدخلاً مرقماً، مع تحليل 111 سورة وتوزيع المداخل الإسنادية وكثافة التفسير في كل سورة ومنهج ابن أبي حاتم في الاستدلال بالأسانيد.",
    stats: [
      { label: "كلمة", value: "894,075" },
      { label: "مدخلاً", value: "20,230" },
      { label: "سورة", value: "111" },
    ],
    chartData: [
      { label: "المداخل الإسنادية", pct: 60 },
      { label: "كثافة التفسير", pct: 40 },
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
    category: "تراجم ورجال",
    description: "فهرس تحليلي رقمي لسير أعلام النبلاء — يرصد 2,426,621 كلمة و6,103 ترجمة، مع تحليل 10,970 علماً مرصوداً و110,796 عبارة في قاموس الجرح والتعديل والتقييم، ومنهج الذهبي في النقد والترجيح.",
    stats: [
      { label: "كلمة", value: "2,426,621" },
      { label: "ترجمة", value: "6,103" },
      { label: "علماً", value: "10,970" },
    ],
    chartData: [
      { label: "التراجم", pct: 55 },
      { label: "الجرح والتعديل", pct: 30 },
      { label: "التقييم والترجيح", pct: 15 },
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
    category: "حديث وآثار",
    description: "فهرس تحليلي رقمي للمصنف — يرصد 817,393 كلمة في 2,079 باباً، مع تحليل مؤشرات الأحاديث والآثار والفتاوى وأقوال الصحابة والتابعين ومنهج عبد الرزاق في التبويب والجمع والتوثيق.",
    stats: [
      { label: "كلمة", value: "817,393" },
      { label: "باباً", value: "2,079" },
    ],
    chartData: [
      { label: "الأحاديث والآثار", pct: 60 },
      { label: "أقوال الصحابة والتابعين", pct: 25 },
      { label: "الفتاوى الفقهية", pct: 15 },
    ],
    tag: "حديث وآثار",
    url: "https://marqoom39.dralhoshan.com",
    xlsxUrl: "/manus-storage/marqoom39_musannaf_abdulrazzaq_8b02a06e.xlsx",
    docxUrl: "/manus-storage/marqoom39_abdulrazzaq_summary_1517aca0.docx",
  },
];

// ── Animated Bar Chart Component ──
function BarChart({ data, color }: { data: { label: string; pct: number }[]; color: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bars = ref.current?.querySelectorAll<HTMLDivElement>(".bar-fill");
    if (!bars) return;
    bars.forEach((bar, i) => {
      setTimeout(() => {
        bar.style.width = bar.getAttribute("data-width") || "0%";
      }, 100 + i * 80);
    });
  }, []);

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.map((item) => (
        <div key={item.label}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: "clamp(11px,2.8vw,13px)", color: C.textMid, fontFamily: "'Noto Naskh Arabic', serif" }}>{item.label}</span>
            <span style={{ fontSize: "clamp(11px,2.8vw,12px)", color: color, fontWeight: 700 }}>{item.pct}%</span>
          </div>
          <div style={{ background: "#E8EEE8", borderRadius: 6, height: 10, overflow: "hidden" }}>
            <div
              className="bar-fill"
              data-width={`${item.pct}%`}
              style={{
                height: "100%",
                width: "0%",
                background: `linear-gradient(90deg, ${color}CC, ${color})`,
                borderRadius: 6,
                transition: "width 0.7s cubic-bezier(0.23,1,0.32,1)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Donut Chart Component ──
function DonutChart({ data, color }: { data: { label: string; pct: number }[]; color: string }) {
  const size = 140;
  const cx = size / 2;
  const cy = size / 2;
  const r = 50;
  const strokeW = 18;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const segments = data.map((item) => {
    const dash = (item.pct / 100) * circumference;
    const gap = circumference - dash;
    const rotation = (offset / 100) * 360 - 90;
    offset += item.pct;
    return { ...item, dash, gap, rotation };
  });

  const colors = [color, C.gold, "#5060C0", "#C06020", "#4A8A40"];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
        {segments.map((seg, i) => (
          <circle
            key={seg.label}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={colors[i % colors.length]}
            strokeWidth={strokeW}
            strokeDasharray={`${seg.dash} ${seg.gap}`}
            strokeDashoffset={0}
            transform={`rotate(${seg.rotation} ${cx} ${cy})`}
            style={{ opacity: 0.9 }}
          />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fill={C.textMid} fontFamily="'Noto Naskh Arabic', serif">المحاور</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="11" fill={C.textMid} fontFamily="'Noto Naskh Arabic', serif">الرئيسية</text>
      </svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 12px", justifyContent: "center" }}>
        {segments.map((seg, i) => (
          <div key={seg.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: colors[i % colors.length], flexShrink: 0 }} />
            <span style={{ fontSize: "clamp(10px,2.5vw,11px)", color: C.textMid }}>{seg.label} ({seg.pct}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function KashafDetail() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const T = isDark ? D : C;
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [showAbout, setShowAbout] = useState(false);

  const kashaf = KASHAFAT.find((k) => k.id === id);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (!kashaf) {
    return (
      <div style={{ fontFamily: "'Noto Naskh Arabic', serif", direction: "rtl", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.cream }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 24, color: T.textMid, marginBottom: 16 }}>الكشاف غير موجود</p>
          <button onClick={() => navigate("/")} style={{ padding: "10px 24px", background: T.emerald, color: T.white, border: "none", borderRadius: 8, cursor: "pointer", fontSize: 15, fontFamily: "'Noto Naskh Arabic', serif" }}>
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  const catColor = categoryColors[kashaf.category] || categoryColors["حديث"];

  return (
    <div style={{ fontFamily: "'Noto Naskh Arabic', 'Amiri', serif", direction: "rtl", background: T.cream, minHeight: "100vh" }}>

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
          color: "#D4C07A",
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
            <div style={{
              position: "absolute", inset: 0, opacity: 0.07, pointerEvents: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30Z' fill='none' stroke='%23B5A05A' stroke-width='1'/%3E%3Cpath d='M30 10 L50 30 L30 50 L10 30Z' fill='none' stroke='%23B5A05A' stroke-width='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <i className="fa-solid fa-shield-halved" style={{ fontSize: 22, color: "#D4C07A" }} />
                <span style={{ fontSize: "clamp(17px,4.5vw,22px)", fontWeight: 700, color: "#D4C07A", fontFamily: "'Amiri', serif" }}>حول مرقوم</span>
              </div>
              <button onClick={() => setShowAbout(false)} style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", fontSize: 18, color: "rgba(255,255,255,0.8)", lineHeight: 1, padding: "5px 10px", borderRadius: 8, transition: "background 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.22)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
              ><i className="fa-solid fa-xmark" /></button>
            </div>
            <div style={{ height: 1.5, background: `linear-gradient(90deg, transparent, #D4C07A, #B5A05A, #D4C07A, transparent)`, marginBottom: 22, position: "relative", zIndex: 1 }} />
            <p style={{ fontSize: "clamp(14px,3.5vw,16px)", lineHeight: 2, color: "rgba(255,255,255,0.92)", margin: 0, marginBottom: 28, textAlign: "justify", position: "relative", zIndex: 1 }}>
              <strong style={{ color: "#D4C07A", fontSize: "clamp(15px,4vw,18px)", fontFamily: "'Amiri', serif" }}>مرقوم</strong>
              {" "}مشروع رقمي لفهرسة وتحليل كتب التراث الإسلامي، ينتج كشافات رقمية منظّمة تساعد الباحثين على اكتشاف محتوى الكتاب من خلال مسائله، وأعلامه، ومصادره، ومصطلحاته، واستشهاداته، واتجاهاته العلمية. ويحوّل النص التراثي الطويل إلى خريطة بحثية ذكية، قابلة للبحث والتنزيل والمقارنة، تقرّب الباحث من منهج المؤلف وبنية الكتاب.
            </p>
            <button onClick={() => setShowAbout(false)} style={{ display: "block", width: "100%", padding: "clamp(12px,3vw,14px)", background: `linear-gradient(135deg, #B5A05A, #D4C07A, #B5A05A)`, color: "#1A1A1A", border: "none", borderRadius: 40, fontSize: "clamp(14px,3.5vw,16px)", fontFamily: "'Amiri', serif", cursor: "pointer", fontWeight: 700, letterSpacing: 1, transition: "opacity 0.2s", position: "relative", zIndex: 1, boxShadow: "0 4px 16px rgba(181,160,90,0.4)" }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >فهمت</button>
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
        background: `linear-gradient(160deg, ${T.emeraldDark} 0%, ${T.emerald} 55%, ${T.emeraldLight} 100%)`,
        position: "relative",
        overflow: "hidden",
        paddingBottom: 0,
      }}>
        {/* Pattern */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30Z' fill='none' stroke='%23B5A05A' stroke-width='1'/%3E%3Cpath d='M30 10 L50 30 L30 50 L10 30Z' fill='none' stroke='%23B5A05A' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px", pointerEvents: "none",
        }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${T.gold}, ${T.goldLight}, ${T.gold}, transparent)` }} />

        <div style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(20px,4vw,32px) clamp(16px,4vw,24px)", position: "relative", zIndex: 1 }}>
          {/* Back button */}
          <button
            onClick={() => navigate("/")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 8, padding: "8px 14px", color: T.white,
              fontSize: "clamp(12px,3vw,14px)", cursor: "pointer", marginBottom: 20,
              fontFamily: "'Noto Naskh Arabic', serif",
              backdropFilter: "blur(8px)", transition: "background 0.2s",
              WebkitTapHighlightColor: "transparent",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
          >
            <i className="fa-solid fa-arrow-left" style={{ fontSize: 14 }} />
            <span>العودة للبوابة</span>
          </button>



          {/* Title area */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
            <div style={{
              width: "clamp(44px,10vw,56px)", height: "clamp(44px,10vw,56px)",
              borderRadius: "50%", background: "rgba(255,255,255,0.15)",
              border: `2px solid rgba(181,160,90,0.6)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "clamp(16px,4vw,22px)", color: T.goldLight, fontWeight: 700,
              flexShrink: 0,
            }}>
              {kashaf.num}
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                background: catColor.bg, color: catColor.text,
                borderRadius: 20, padding: "3px 12px", fontSize: "clamp(11px,2.5vw,12px)",
                fontWeight: 600, marginBottom: 8,
              }}>
                {kashaf.categoryLabel}
              </div>
              <h1 style={{
                fontFamily: "'Amiri', serif",
                fontSize: "clamp(20px,5vw,30px)",
                fontWeight: 700, color: T.white,
                marginBottom: 6, lineHeight: 1.3,
              }}>
                {kashaf.title}
              </h1>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "clamp(13px,3vw,15px)" }}>
                <i className="fa-solid fa-diamond" style={{ fontSize: 8, marginLeft: 6, verticalAlign: 'middle' }} /> {kashaf.author} ({kashaf.death})
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(20px,4vw,36px) clamp(12px,4vw,20px) 60px" }}>

        {/* Stats cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 140px), 1fr))",
          gap: "clamp(10px,2vw,16px)",
          marginBottom: "clamp(24px,4vw,36px)",
        }}>
          {kashaf.stats.map((s) => (
            <div key={s.label} style={{
              background: T.white,
              borderRadius: 12,
              padding: "clamp(14px,3vw,20px) clamp(12px,2vw,16px)",
              textAlign: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              border: `1px solid ${T.creamMid}`,
            }}>
              <div style={{ fontSize: "clamp(18px,4.5vw,26px)", fontWeight: 700, color: catColor.accent, fontFamily: "'Amiri', serif", marginBottom: 4 }}>
                {s.value}
              </div>
              <div style={{ fontSize: "clamp(11px,2.5vw,13px)", color: T.textMid }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div style={{
          background: T.white, borderRadius: 14, padding: "clamp(18px,4vw,28px)",
          marginBottom: "clamp(20px,4vw,28px)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          border: `1px solid ${T.creamMid}`,
        }}>
          <h2 style={{ fontFamily: "'Amiri', serif", fontSize: "clamp(16px,4vw,20px)", color: T.emeraldDark, marginBottom: 12 }}>
            نبذة عن الكشاف
          </h2>
          <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, ${T.gold}, transparent)`, marginBottom: 14 }} />
          <p style={{ color: T.textMid, fontSize: "clamp(14px,3.2vw,15px)", lineHeight: 1.9 }}>
            {kashaf.longDesc}
          </p>
          <div style={{ marginTop: 12 }}>
            <span style={{ fontSize: "clamp(11px,2.5vw,12px)", color: T.textLight, background: T.creamDark, padding: "3px 12px", borderRadius: 20 }}>
              {kashaf.tag}
            </span>
          </div>
        </div>

        {/* Charts section */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
          gap: "clamp(16px,3vw,24px)",
          marginBottom: "clamp(20px,4vw,28px)",
        }}>
          {/* Bar chart */}
          <div style={{
            background: T.white, borderRadius: 14,
            padding: "clamp(16px,3vw,24px)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            border: `1px solid ${T.creamMid}`,
          }}>
            <h3 style={{ fontFamily: "'Amiri', serif", fontSize: "clamp(15px,3.5vw,18px)", color: T.emeraldDark, marginBottom: 16 }}>
              توزيع المحاور الرئيسية
            </h3>
            <BarChart data={kashaf.chartData} color={catColor.bar} />
          </div>

          {/* Donut chart */}
          <div style={{
            background: T.white, borderRadius: 14,
            padding: "clamp(16px,3vw,24px)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            border: `1px solid ${T.creamMid}`,
            display: "flex", flexDirection: "column", alignItems: "center",
          }}>
            <h3 style={{ fontFamily: "'Amiri', serif", fontSize: "clamp(15px,3.5vw,18px)", color: T.emeraldDark, marginBottom: 16, alignSelf: "flex-start" }}>
              نسب المحاور الرئيسية
            </h3>
            <DonutChart data={kashaf.chartData} color={catColor.bar} />
          </div>
        </div>

        {/* CTA section */}
        <div style={{
          background: `linear-gradient(135deg, ${T.emeraldDark} 0%, ${T.emerald} 100%)`,
          borderRadius: 14, padding: "clamp(20px,4vw,32px)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0, opacity: 0.05,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M20 0 L40 20 L20 40 L0 20Z' fill='none' stroke='%23B5A05A' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h3 style={{ fontFamily: "'Amiri', serif", fontSize: "clamp(17px,4vw,22px)", color: T.white, marginBottom: 8 }}>
              استعرض الكشاف كاملاً
            </h3>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "clamp(13px,3vw,14px)", marginBottom: 20 }}>
              ادخل إلى الكشاف التفاعلي الكامل مع جميع الفهارس والتحليلات
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <a
                href={kashaf.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "clamp(11px,2.5vw,13px) clamp(20px,4vw,28px)",
                  borderRadius: 8, background: T.gold, color: T.dark,
                  fontSize: "clamp(14px,3.5vw,16px)", fontWeight: 700,
                  fontFamily: "'Noto Naskh Arabic', serif", textDecoration: "none",
                  transition: "background 0.2s", WebkitTapHighlightColor: "transparent",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = T.goldLight)}
                onMouseLeave={(e) => (e.currentTarget.style.background = T.gold)}
              >
                <span>دخول الكشاف</span>
                <i className="fa-solid fa-arrow-right" style={{ fontSize: 14 }} />
              </a>
              <a
                href={kashaf.xlsxUrl}
                download
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "clamp(11px,2.5vw,13px) clamp(16px,3vw,20px)",
                  borderRadius: 8, background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: T.white, fontSize: "clamp(13px,3vw,14px)", fontWeight: 600,
                  fontFamily: "'Noto Naskh Arabic', serif", textDecoration: "none",
                  transition: "background 0.2s", WebkitTapHighlightColor: "transparent",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
              >
                <i className="fa-solid fa-download" style={{ fontSize: 13 }} /><span>Excel</span>
              </a>
              <a
                href={kashaf.docxUrl}
                download
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "clamp(11px,2.5vw,13px) clamp(16px,3vw,20px)",
                  borderRadius: 8, background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: T.white, fontSize: "clamp(13px,3vw,14px)", fontWeight: 600,
                  fontFamily: "'Noto Naskh Arabic', serif", textDecoration: "none",
                  transition: "background 0.2s", WebkitTapHighlightColor: "transparent",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
              >
                <i className="fa-solid fa-download" style={{ fontSize: 13 }} /><span>Word</span>
              </a>
            </div>
          </div>
        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer style={{
        background: `linear-gradient(160deg, ${T.emeraldDark} 0%, ${T.emerald} 100%)`,
        padding: "clamp(24px,4vw,36px) 24px",
        textAlign: "center", position: "relative",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${T.gold}, ${T.goldLight}, ${T.gold}, transparent)` }} />
        <p style={{ color: T.white, fontSize: "clamp(20px,5vw,26px)", fontFamily: "'Amiri', serif", fontWeight: 700, marginBottom: 4 }}>مرقوم</p>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "clamp(12px,3vw,14px)", marginBottom: 14 }}>بوابة الكشافات التراثية الرقمية</p>
        <div style={{ marginBottom: 14, display: "flex", justifyContent: "center" }}>
          <a href="https://dralhoshan.com" target="_blank" rel="noopener noreferrer">
            <img
              src="/manus-storage/marqoom_signature_hq_2a392bb3.png"
              alt="د. يوسف بن حمود الحوشان"
              style={{ height: 56, width: "auto", filter: "brightness(0) invert(1)", opacity: 0.85, transition: "opacity 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
            />
          </a>
        </div>
        <p style={{ color: T.goldLight, fontSize: "clamp(11px,2.5vw,12px)", opacity: 0.75 }}>© 1448هـ / 2026م — جميع الحقوق محفوظة</p>
      </footer>

    </div>
  );
}
