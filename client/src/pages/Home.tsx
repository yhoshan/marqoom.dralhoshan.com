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
      "فهرس تحليلي آلي شامل لشرح صحيح البخاري — أضخم شروح الحديث النبوي وأجمعها، يرصد المحاور المنهجية من أحاديث وأسانيد وتخريج وترجيح وإشكالات.",
    stats: [
      { label: "كلمة", value: "3.5م" },
      { label: "عبارة", value: "217,433" },
      { label: "صفحة", value: "7,807" },
      { label: "باباً", value: "3,442" },
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
    description:
      "كشاف شامل لثلاثة مصنفات كبرى: التمهيد لما في الموطأ، والاستذكار، والاستيعاب — يرصد منهجية الإمام الحافظ في الحديث والفقه والرجال.",
    stats: [
      { label: "كلمة", value: "8.5م" },
      { label: "عبارة", value: "235,427" },
      { label: "صفحة", value: "13,722" },
      { label: "مصنفات", value: "3" },
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
    description:
      "فهرس منهجي لخمسة مصنفات كبرى لشيخ الإسلام — يرصد الاستدلال النقلي والعقلي ومنهج النقد والرد على المخالفين والمدارس الكلامية.",
    stats: [
      { label: "كلمة", value: "5م" },
      { label: "عبارة", value: "145,175" },
      { label: "صفحة", value: "29,828" },
      { label: "مصنفات", value: "5" },
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
    description:
      "فهرس منهجي للجامع لأحكام القرآن — يرصد الخلاف وعرض الأقوال والاستنباط الفقهي من القرآن الكريم في هذا التفسير الموسوعي الفقهي.",
    stats: [
      { label: "كلمة", value: "2.2م" },
      { label: "عبارة", value: "100,462" },
      { label: "صفحة", value: "7,454" },
      { label: "مدخل", value: "3,423" },
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
    description:
      "فهرس تحليلي للمغني شرح مختصر الخرقي — الموسوعة الفقهية الحنبلية الكبرى في الفقه المقارن، يرصد 70 كتاباً فقهياً و37,985 عبارة منهجية.",
    stats: [
      { label: "كلمة", value: "1.8م" },
      { label: "عبارة", value: "37,985" },
      { label: "كتاباً", value: "70" },
      { label: "مدخل", value: "7,668" },
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
    xlsxUrl: "/manus-storage/marqoom_ibnalqayyim_37bd96ed.xlsx",
    docxUrl: "/manus-storage/marqoom_ibnalqayyim_c3b32791.docx",
  },
];

const CATEGORIES = [
  { id: "all", label: "الكل", count: 11 },
  { id: "حديث", label: "الحديث وعلومه", count: 2 },
  { id: "فقه", label: "الفقه المقارن", count: 4 },
  { id: "تفسير", label: "التفسير", count: 3 },
  { id: "عقيدة", label: "العقيدة والأصول", count: 2 },
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

      {/* ── HEADER ── */}
      <header style={{
        position: "relative",
        overflow: "hidden",
        paddingBottom: 0,
        backgroundImage: "url('/manus-storage/marqoom_header_bg_750c3aaf.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}>
        {/* Dark overlay for better contrast on stats/search */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.15)", pointerEvents: "none" }} />
        {/* Gold bottom line */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${T.gold}, ${T.goldLight}, ${T.gold}, transparent)` }} />

        <div style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(28px,6vw,40px) clamp(16px,4vw,24px) clamp(28px,6vw,36px)", position: "relative", zIndex: 1, textAlign: "center" }}>
          {/* Spacer to push stats below the image text area */}
          <div style={{ height: "clamp(180px, 38vw, 320px)" }} />


          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "center", gap: "clamp(12px, 4vw, 48px)", flexWrap: "wrap", marginBottom: 28 }}>
            {[
              { n: "11", l: "كشّافاً منهجياً" },
              { n: "+30م", l: "كلمة محللة" },
              { n: "+1م", l: "عبارة مصنفة" },
              { n: "11", l: "مصنفاً كبيراً" },
            ].map((s) => (
              <div key={s.l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "clamp(20px, 5vw, 32px)", fontWeight: 700, color: T.goldLight, fontFamily: "'Amiri', serif" }}>{s.n}</div>
                <div style={{ fontSize: "clamp(11px, 2.8vw, 13px)", color: T.white, marginTop: 3 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Dark mode toggle */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <button
              onClick={toggleTheme}
              title={isDark ? "الوضع النهاري" : "الوضع الليلي"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "7px 18px",
                borderRadius: 40,
                border: `1.5px solid rgba(181,160,90,0.5)`,
                background: "rgba(255,255,255,0.12)",
                color: T.white,
                fontSize: "clamp(12px,3vw,13px)",
                fontFamily: "'Noto Naskh Arabic', serif",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                transition: "all 0.2s",
                WebkitTapHighlightColor: "transparent",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.22)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
            >
              <span style={{ fontSize: 16 }}>{isDark ? "☀️" : "🌙"}</span>
              <span>{isDark ? "الوضع النهاري" : "الوضع الليلي"}</span>
            </button>
          </div>

          {/* Search */}
          <div style={{ maxWidth: 560, margin: "0 auto 4px", position: "relative", width: "100%" }}>
            <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: T.goldLight, fontSize: 18, pointerEvents: "none" }}>🔍</span>
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
                border: `2px solid rgba(181,160,90,0.4)`,
                background: "rgba(255,255,255,0.15)",
                color: T.white,
                fontSize: "clamp(14px,3.5vw,16px)",
                fontFamily: "'Noto Naskh Arabic', serif",
                outline: "none",
                backdropFilter: "blur(8px)",
                direction: "rtl",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
                WebkitAppearance: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = T.goldLight)}
              onBlur={(e) => (e.target.style.borderColor = "rgba(181,160,90,0.4)")}
            />
          </div>
        </div>
      </header>

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
            الكشافات المنهجية الرقمية
          </h2>
          <div style={{ width: 60, height: 2, background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)`, margin: "0 auto 12px" }} />
          <p style={{ color: T.textMid, fontSize: "clamp(14px,3.5vw,16px)", lineHeight: 1.75, padding: "0 clamp(0px,2vw,16px)" }}>
            اختر الكشاف الذي تريد الاطلاع عليه — كل كشاف يتضمن تحليلاً آلياً شاملاً للمصنَّف مع فهارس منهجية دقيقة
          </p>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: T.textMid }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
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
            بوابة الكشافات الرقمية
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
          ◆ {kashaf.author} ({kashaf.death})
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
            <span style={{ fontSize: 16, opacity: 0.85 }}>←</span>
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
              <span style={{ fontSize: 14 }}>⬇</span>
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
              <span style={{ fontSize: 14 }}>⬇</span>
              <span>Word</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
