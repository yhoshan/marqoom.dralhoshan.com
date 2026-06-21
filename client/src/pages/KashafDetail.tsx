import { useEffect, useRef } from "react";
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
    description: "فهرس تحليلي آلي شامل لشرح صحيح البخاري — أضخم شروح الحديث النبوي وأجمعها، يرصد المحاور المنهجية من أحاديث وأسانيد وتخريج وترجيح وإشكالات.",
    longDesc: "فتح الباري شرح صحيح البخاري لابن حجر العسقلاني (ت852هـ) هو أعظم شروح صحيح البخاري وأجمعها، استغرق مؤلفه في تأليفه ربع قرن من الزمان. يتناول هذا الكشاف الرقمي تحليلاً آلياً شاملاً لمحتوى الكتاب، رصداً للمحاور المنهجية الكبرى من أحاديث وأسانيد وتخريج وترجيح وإشكالات وردود، مع فهرسة دقيقة لكل أبواب الكتاب.",
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
    xlsxUrl: "/manus-storage/marqoom_fathalbaari_1a2ed060.xlsx",
    docxUrl: "/manus-storage/marqoom_fathalbaari_0e8bfaa6.docx",
  },
  {
    id: "ibnabdulbar",
    num: 2,
    title: "كشّاف ابن عبد البر",
    author: "ابن عبد البر القرطبي",
    death: "ت 463هـ",
    category: "حديث",
    categoryLabel: "الحديث وعلومه",
    description: "كشاف شامل لثلاثة مصنفات كبرى: التمهيد لما في الموطأ، والاستذكار، والاستيعاب — يرصد منهجية الإمام الحافظ في الحديث والفقه والرجال.",
    longDesc: "ابن عبد البر القرطبي (ت463هـ) إمام المحدثين في الغرب الإسلامي، جمع هذا الكشاف ثلاثة مصنفاته الكبرى: التمهيد لما في الموطأ من المعاني والأسانيد، والاستذكار الجامع لمذاهب فقهاء الأمصار، والاستيعاب في معرفة الأصحاب. يرصد الكشاف المنهجية العلمية للإمام في الحديث والفقه المقارن وعلم الرجال.",
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
    xlsxUrl: "/manus-storage/marqoom_ibnabdulbar_52a25ade.xlsx",
    docxUrl: "/manus-storage/marqoom_ibnabdulbar_ff82a1d0.docx",
  },
  {
    id: "ibntimiah",
    num: 3,
    title: "كشّاف ابن تيمية بالأرقام",
    author: "شيخ الإسلام ابن تيمية",
    death: "ت 728هـ",
    category: "عقيدة",
    categoryLabel: "العقيدة والأصول",
    description: "فهرس منهجي لخمسة مصنفات كبرى لشيخ الإسلام — يرصد الاستدلال النقلي والعقلي ومنهج النقد والرد على المخالفين والمدارس الكلامية.",
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
    xlsxUrl: "/manus-storage/marqoom_ibntimiah_111a5a41.xlsx",
    docxUrl: "/manus-storage/marqoom_ibntimiah_cabca36a.docx",
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
    xlsxUrl: "/manus-storage/marqoom_alrazi_8c1cc9e8.xlsx",
    docxUrl: "/manus-storage/marqoom_alrazi_1abec997.docx",
  },
  {
    id: "alqurtubi",
    num: 5,
    title: "كشّاف تفسير القرطبي",
    author: "القرطبي",
    death: "ت 671هـ",
    category: "تفسير",
    categoryLabel: "التفسير",
    description: "فهرس منهجي للجامع لأحكام القرآن — يرصد الخلاف وعرض الأقوال والاستنباط الفقهي من القرآن الكريم في هذا التفسير الموسوعي الفقهي.",
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
    xlsxUrl: "/manus-storage/marqoom_alqurtubi_ef7707ed.xlsx",
    docxUrl: "/manus-storage/marqoom_alqurtubi_ef004210.docx",
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
    xlsxUrl: "/manus-storage/marqoom_altabari_deea92ab.xlsx",
    docxUrl: "/manus-storage/marqoom_altabari_932b9d1c.docx",
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
    xlsxUrl: "/manus-storage/marqoom_annawawe_dc8d138a.xlsx",
    docxUrl: "/manus-storage/marqoom_annawawe_b01865bd.docx",
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
    xlsxUrl: "/manus-storage/marqoom_almuhalla_183185b5.xlsx",
    docxUrl: "/manus-storage/marqoom_almuhalla_4fdbcb5a.docx",
  },
  {
    id: "almughni",
    num: 9,
    title: "كشّاف المغني لابن قدامة",
    author: "ابن قدامة المقدسي",
    death: "ت 620هـ",
    category: "فقه",
    categoryLabel: "الفقه المقارن",
    description: "فهرس تحليلي للمغني شرح مختصر الخرقي — الموسوعة الفقهية الحنبلية الكبرى في الفقه المقارن، يرصد 70 كتاباً فقهياً و37,985 عبارة منهجية.",
    longDesc: "المغني شرح مختصر الخرقي لابن قدامة المقدسي (ت620هـ) الموسوعة الفقهية الحنبلية الكبرى في الفقه المقارن، يعرض الخلاف بين المذاهب الأربعة بأسلوب علمي دقيق. يرصد هذا الكشاف 70 كتاباً فقهياً و37,985 عبارة منهجية مع فهرسة شاملة للمسائل والأدلة.",
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
    xlsxUrl: "/manus-storage/marqoom_almughni_1e4240a2.xlsx",
    docxUrl: "/manus-storage/marqoom_almughni_de6fc1e9.docx",
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
    xlsxUrl: "/manus-storage/marqoom_albadaei_f679be5b.xlsx",
    docxUrl: "/manus-storage/marqoom_albadaei_07b38d0a.docx",
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
    xlsxUrl: "/manus-storage/marqoom_ibnalqayyim_37bd96ed.xlsx",
    docxUrl: "/manus-storage/marqoom_ibnalqayyim_c3b32791.docx",
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
        {isDark ? "☀️" : "🌙"}
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
            <span style={{ fontSize: 16 }}>→</span>
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
                ◆ {kashaf.author} ({kashaf.death})
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
              توزيع المحاور المنهجية
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
                <span style={{ fontSize: 16 }}>←</span>
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
                <span>⬇</span><span>Excel</span>
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
                <span>⬇</span><span>Word</span>
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
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "clamp(12px,3vw,14px)", marginBottom: 4 }}>بوابة الكشافات الرقمية</p>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "clamp(11px,2.5vw,13px)", marginBottom: 14 }}>فهارس تحليلية آلية لمختارات من كتب التراث</p>
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
