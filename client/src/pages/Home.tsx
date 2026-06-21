import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════
// DESIGN: هوية مرقوم الرسمية
// الألوان: أخضر زمردي #1A7A6E + ذهبي #B5A05A + رمادي داكن #3A3A3A
// الشعار: /manus-storage/marqoom_logo_faca7079.png
// التوقيع: /manus-storage/marqoom_signature_a4c79224.png
// ═══════════════════════════════════════════════

// ── COLORS ──
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

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

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
    <div style={{ fontFamily: "'Noto Naskh Arabic', 'Amiri', serif", direction: "rtl", background: C.cream, minHeight: "100vh" }}>

      {/* ── HEADER ── */}
      <header style={{
        background: `linear-gradient(160deg, ${C.emeraldDark} 0%, ${C.emerald} 55%, ${C.emeraldLight} 100%)`,
        position: "relative",
        overflow: "hidden",
        paddingBottom: 0,
      }}>
        {/* Islamic geometric pattern overlay */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30Z' fill='none' stroke='%23B5A05A' stroke-width='1'/%3E%3Cpath d='M30 10 L50 30 L30 50 L10 30Z' fill='none' stroke='%23B5A05A' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }} />
        {/* Gold bottom line */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${C.gold}, ${C.goldLight}, ${C.gold}, transparent)` }} />

        <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px 36px", position: "relative", zIndex: 1, textAlign: "center" }}>
          {/* Bismillah */}
          <p style={{ color: C.goldLight, fontSize: 14, fontFamily: "'Amiri', serif", marginBottom: 20, letterSpacing: 2, opacity: 0.9 }}>
            بسم الله الرحمن الرحيم
          </p>

          {/* Logo Image */}
          <div style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}>
            <img
              src="/manus-storage/marqoom_logo_final_febb27a2.png"
              alt="مرقوم — MARQOOM"
              style={{
                height: "clamp(80px, 14vw, 130px)",
                width: "auto",
                opacity: 0.95,
              }}
            />
          </div>

          {/* NOTE: الأيقونة الهندسية المنفصلة تم حذفها بناءً على طلب المستخدم */}

          <p style={{ color: C.white, fontSize: "clamp(14px, 2.5vw, 18px)", fontFamily: "'Amiri', serif", marginBottom: 6 }}>
            بوابة الكشافات الرقمية
          </p>
          <p style={{ color: C.white, fontSize: 13, marginBottom: 32 }}>
            فهارس تحليلية آلية لكبريات المصنفات الإسلامية
          </p>

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "center", gap: "clamp(16px, 4vw, 48px)", flexWrap: "wrap", marginBottom: 32 }}>
            {[
              { n: "11", l: "كشّافاً منهجياً" },
              { n: "+30م", l: "كلمة محللة" },
              { n: "+1م", l: "عبارة مصنفة" },
              { n: "11", l: "مصنفاً كبيراً" },
            ].map((s) => (
              <div key={s.l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 700, color: C.goldLight, fontFamily: "'Amiri', serif" }}>{s.n}</div>
                <div style={{ fontSize: 12, color: C.white, marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div style={{ maxWidth: 560, margin: "0 auto 4px", position: "relative" }}>
            <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: C.goldLight, fontSize: 18, pointerEvents: "none" }}>🔍</span>
            <input
              ref={searchRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن كشاف... (فتح الباري، ابن تيمية، الرازي...)"
              style={{
                width: "100%",
                padding: "13px 48px 13px 20px",
                borderRadius: 40,
                border: `2px solid rgba(181,160,90,0.4)`,
                background: "rgba(255,255,255,0.12)",
                color: C.white,
                fontSize: 15,
                fontFamily: "'Noto Naskh Arabic', serif",
                outline: "none",
                backdropFilter: "blur(8px)",
                direction: "rtl",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = C.goldLight)}
              onBlur={(e) => (e.target.style.borderColor = "rgba(181,160,90,0.4)")}
            />
          </div>
        </div>
      </header>

      {/* ── FILTER TABS ── */}
      <div style={{
        background: C.white,
        borderBottom: `2px solid ${C.creamMid}`,
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 12px rgba(26,122,110,0.08)",
      }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", gap: 6, overflowX: "auto", scrollbarWidth: "none" }}>
          <span style={{ color: C.textLight, fontSize: 13, whiteSpace: "nowrap", padding: "14px 12px 14px 0", borderLeft: `1px solid ${C.creamMid}`, paddingLeft: 14, marginLeft: 4, flexShrink: 0 }}>التصنيف:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: "7px 16px",
                borderRadius: 40,
                border: activeCategory === cat.id ? `1.5px solid ${C.emerald}` : `1.5px solid transparent`,
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontSize: 13,
                fontFamily: "'Noto Naskh Arabic', serif",
                fontWeight: activeCategory === cat.id ? 700 : 400,
                background: activeCategory === cat.id ? C.emerald : "transparent",
                color: activeCategory === cat.id ? C.white : C.textMid,
                transition: "all 0.2s",
                margin: "8px 0",
                flexShrink: 0,
              }}
            >
              {cat.label}{" "}
              <span style={{ opacity: 0.75, fontSize: 11 }}>
                ({cat.id === "all" ? filtered.length : KASHAFAT.filter(k => k.category === cat.id).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 16px 80px" }}>
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Amiri', serif", fontSize: 28, color: C.emeraldDark, marginBottom: 8 }}>
            الكشافات المنهجية الرقمية
          </h2>
          <div style={{ width: 60, height: 2, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, margin: "0 auto 12px" }} />
          <p style={{ color: C.textMid, fontSize: 14 }}>
            اختر الكشاف الذي تريد الاطلاع عليه — كل كشاف يتضمن تحليلاً آلياً شاملاً للمصنَّف مع فهارس منهجية دقيقة
          </p>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: C.textMid }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 18, fontFamily: "'Amiri', serif" }}>لا توجد نتائج مطابقة للبحث</p>
            <p style={{ fontSize: 14, marginTop: 8, opacity: 0.7 }}>جرّب كلمات بحث مختلفة</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
            gap: 24,
          }}>
            {filtered.map((k) => (
              <KashafCard key={k.id} kashaf={k} />
            ))}
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{
        background: `linear-gradient(160deg, ${C.emeraldDark} 0%, ${C.emerald} 100%)`,
        padding: "36px 24px",
        textAlign: "center",
        position: "relative",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${C.gold}, ${C.goldLight}, ${C.gold}, transparent)` }} />

        {/* Logo in footer */}
        <div style={{ marginBottom: 16 }}>
          <img
            src="/manus-storage/marqoom_logo_transparent_40d69299.png"
            alt="مرقوم"
            style={{ height: 50, width: "auto", opacity: 0.9 }}
          />
        </div>

        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginBottom: 16 }}>
          بوابة الكشافات المنهجية الرقمية
        </p>

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

        <p style={{ color: C.goldLight, fontSize: 12, opacity: 0.75 }}>© 1446هـ / 2025م — جميع الحقوق محفوظة</p>
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
            background: C.emerald,
            border: `2px solid ${C.gold}`,
            color: C.white,
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

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        background: C.white,
        borderRadius: 14,
        border: `1px solid ${hovered ? C.emerald : C.creamMid}`,
        boxShadow: hovered
          ? `0 8px 40px rgba(26,122,110,0.18), 0 2px 8px rgba(181,160,90,0.1)`
          : "0 4px 24px rgba(0,0,0,0.06)",
        overflow: "hidden",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {/* Card Header */}
      <div style={{
        background: hovered
          ? `linear-gradient(135deg, ${C.emeraldDark} 0%, ${C.emerald} 100%)`
          : `linear-gradient(135deg, ${C.emerald} 0%, ${C.emeraldLight} 100%)`,
        padding: "18px 20px 14px",
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
          color: C.goldLight,
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
          background: catColor.bg,
          color: catColor.text,
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
          fontSize: 19,
          fontWeight: 700,
          color: C.white,
          marginBottom: 4,
          lineHeight: 1.3,
          position: "relative",
          zIndex: 1,
        }}>
          {kashaf.title}
        </h3>
        {/* Author */}
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, position: "relative", zIndex: 1 }}>
          ◆ {kashaf.author} ({kashaf.death})
        </p>
      </div>

      {/* Card Body */}
      <div style={{ padding: "16px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
        <p style={{ color: C.textMid, fontSize: 13, lineHeight: 1.75, marginBottom: 14, flex: 1 }}>
          {kashaf.description}
        </p>

        {/* Stats */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {kashaf.stats.map((s) => (
            <span key={s.label} style={{
              background: C.cream,
              border: `1px solid ${C.creamMid}`,
              borderRadius: 20,
              padding: "3px 10px",
              fontSize: 11,
              color: C.textMid,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}>
              <span style={{ color: catColor.accent, fontWeight: 700 }}>{s.value}</span>
              <span>{s.label}</span>
            </span>
          ))}
        </div>

        {/* Tag */}
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: C.textLight, background: C.creamDark, padding: "3px 10px", borderRadius: 20 }}>
            {kashaf.tag}
          </span>
        </div>

        {/* CTA: Enter + Download buttons */}
        <div style={{ borderTop: `1px solid ${C.creamMid}`, paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Main CTA */}
          <a
            href={kashaf.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "10px 16px",
              borderRadius: 8,
              background: hovered ? C.emeraldDark : C.emerald,
              color: C.white,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "'Noto Naskh Arabic', serif",
              textDecoration: "none",
              transition: "background 0.2s",
              letterSpacing: 0.5,
            }}
          >
            <span>دخول الكشاف</span>
            <span style={{ fontSize: 16, opacity: 0.85 }}>←</span>
          </a>

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
                padding: "8px 10px",
                borderRadius: 8,
                background: "#E8F5E9",
                border: "1px solid #A5D6A7",
                color: "#2E7D32",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "'Noto Naskh Arabic', serif",
                textDecoration: "none",
                transition: "background 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#C8E6C9")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#E8F5E9")}
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
                padding: "8px 10px",
                borderRadius: 8,
                background: "#E3F2FD",
                border: "1px solid #90CAF9",
                color: "#1565C0",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "'Noto Naskh Arabic', serif",
                textDecoration: "none",
                transition: "background 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#BBDEFB")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#E3F2FD")}
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
