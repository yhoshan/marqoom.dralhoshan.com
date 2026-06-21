import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════
// DESIGN: تراثي إسلامي — ألوان العاجي والذهبي والبني
// متوافق مع هوية dralhoshan.com
// ═══════════════════════════════════════════════

const KASHAFAT = [
  {
    id: "fathalbaari",
    title: "كشّاف فتح الباري بالأرقام",
    author: "ابن حجر العسقلاني",
    death: "ت ٨٥٢هـ",
    category: "حديث",
    categoryLabel: "الحديث وعلومه",
    categoryIcon: "📜",
    description:
      "فهرس تحليلي آلي شامل لشرح صحيح البخاري — أضخم شروح الحديث النبوي وأجمعها، يرصد المحاور المنهجية من أحاديث وأسانيد وتخريج وترجيح وإشكالات.",
    stats: [
      { label: "كلمة", value: "٣٫٥م" },
      { label: "عبارة", value: "٢١٧٬٤٣٣" },
      { label: "صفحة", value: "٧٬٨٠٧" },
      { label: "باباً", value: "٣٬٤٤٢" },
    ],
    tag: "شرح حديث موسوعي",
    url: "https://fathalbaari.dralhoshan.com",
  },
  {
    id: "ibnabdulbar",
    title: "كشّاف ابن عبد البر",
    author: "ابن عبد البر القرطبي",
    death: "ت ٤٦٣هـ",
    category: "حديث",
    categoryLabel: "الحديث وعلومه",
    categoryIcon: "📜",
    description:
      "كشاف شامل لثلاثة مصنفات كبرى: التمهيد لما في الموطأ، والاستذكار، والاستيعاب — يرصد منهجية الإمام الحافظ في الحديث والفقه والرجال.",
    stats: [
      { label: "كلمة", value: "٨٫٥م" },
      { label: "عبارة", value: "٢٣٥٬٤٢٧" },
      { label: "صفحة", value: "١٣٬٧٢٢" },
      { label: "مصنفات", value: "٣" },
    ],
    tag: "حديث وفقه مقارن",
    url: "https://ibnabdulbar.dralhoshan.com",
  },
  {
    id: "ibntimiah",
    title: "كشّاف ابن تيمية بالأرقام",
    author: "شيخ الإسلام ابن تيمية",
    death: "ت ٧٢٨هـ",
    category: "عقيدة",
    categoryLabel: "العقيدة والأصول",
    categoryIcon: "🔖",
    description:
      "فهرس منهجي لخمسة مصنفات كبرى لشيخ الإسلام — يرصد الاستدلال النقلي والعقلي ومنهج النقد والرد على المخالفين والمدارس الكلامية.",
    stats: [
      { label: "كلمة", value: "٥م" },
      { label: "عبارة", value: "١٤٥٬١٧٥" },
      { label: "صفحة", value: "٢٩٬٨٢٨" },
      { label: "مصنفات", value: "٥" },
    ],
    tag: "عقيدة وأصول",
    url: "https://ibntimiah.dralhoshan.com",
  },
  {
    id: "alrazi",
    title: "كشّاف تفسير الرازي",
    author: "فخر الدين الرازي",
    death: "ت ٦٠٦هـ",
    category: "تفسير",
    categoryLabel: "التفسير",
    categoryIcon: "📖",
    description:
      "فهرس تحليلي لمفاتيح الغيب (التفسير الكبير) — يرصد الاستدلال والتعليل والجدل الكلامي والترجيح والقراءات في أضخم تفاسير القرآن الكريم.",
    stats: [
      { label: "كلمة", value: "٣م" },
      { label: "عبارة", value: "٩٢٬٤٠٠+" },
      { label: "جزءاً", value: "٣٢" },
      { label: "نوع", value: "جدلي" },
    ],
    tag: "تفسير موسوعي جدلي",
    url: "https://alrazi.dralhoshan.com",
  },
  {
    id: "alqurtubi",
    title: "كشّاف تفسير القرطبي",
    author: "القرطبي",
    death: "ت ٦٧١هـ",
    category: "تفسير",
    categoryLabel: "التفسير",
    categoryIcon: "📖",
    description:
      "فهرس منهجي للجامع لأحكام القرآن — يرصد الخلاف وعرض الأقوال والاستنباط الفقهي من القرآن الكريم في هذا التفسير الموسوعي الفقهي.",
    stats: [
      { label: "كلمة", value: "٢٫٢م" },
      { label: "عبارة", value: "١٠٠٬٤٦٢" },
      { label: "صفحة", value: "٧٬٤٥٤" },
      { label: "مدخل", value: "٣٬٤٢٣" },
    ],
    tag: "تفسير فقهي موسوعي",
    url: "https://alqurtubi.dralhoshan.com",
  },
  {
    id: "altabari",
    title: "كشّاف جامع البيان للطبري",
    author: "ابن جرير الطبري",
    death: "ت ٣١٠هـ",
    category: "تفسير",
    categoryLabel: "التفسير",
    categoryIcon: "📖",
    description:
      "فهرس تحليلي لجامع البيان في تأويل القرآن — أقدم التفاسير الكبرى وأوسعها في نقل أقوال السلف والروايات، يرصد الأعلام والمصادر والمدارس التفسيرية.",
    stats: [
      { label: "كلمة", value: "٤٫٣م" },
      { label: "مورد", value: "١٥٧٬٣١٤" },
      { label: "علم", value: "٧٧٬٥٦٤" },
      { label: "ملفات", value: "١٠" },
    ],
    tag: "تفسير بالمأثور",
    url: "https://altabari.dralhoshan.com",
  },
  {
    id: "annawawe",
    title: "كشّاف المجموع للنووي",
    author: "الإمام النووي",
    death: "ت ٦٧٦هـ",
    category: "فقه",
    categoryLabel: "الفقه المقارن",
    categoryIcon: "⚖️",
    description:
      "فهرس تحليلي للمجموع شرح المهذب — الموسوعة الفقهية الشافعية الكبرى، يرصد الخلاف المذهبي والمقارن في ٤٤ كتاباً فقهياً.",
    stats: [
      { label: "كلمة", value: "٢٫٨م" },
      { label: "صفحة", value: "٩٬٧٩٣" },
      { label: "كتاباً", value: "٤٤" },
      { label: "مدخل", value: "٣٣٥" },
    ],
    tag: "فقه شافعي موسوعي",
    url: "https://annawawe.dralhoshan.com",
  },
  {
    id: "almuhalla",
    title: "كشّاف المحلى لابن حزم",
    author: "ابن حزم الأندلسي",
    death: "ت ٤٥٦هـ",
    category: "فقه",
    categoryLabel: "الفقه المقارن",
    categoryIcon: "⚖️",
    description:
      "فهرس تحليلي للمحلى بالآثار — الموسوعة الفقهية الظاهرية الكبرى، يرصد المنهج الأثري الجدلي في ٦١ كتاباً فقهياً مع ٢١٥٨ مسألة.",
    stats: [
      { label: "كلمة", value: "١٫٥م" },
      { label: "عبارة", value: "١١٧٬٨٥٤" },
      { label: "كتاباً", value: "٦١" },
      { label: "مسألة", value: "٢٬١٥٨" },
    ],
    tag: "فقه ظاهري أثري",
    url: "https://almuhalla.dralhoshan.com",
  },
  {
    id: "almughni",
    title: "كشّاف المغني لابن قدامة",
    author: "ابن قدامة المقدسي",
    death: "ت ٦٢٠هـ",
    category: "فقه",
    categoryLabel: "الفقه المقارن",
    categoryIcon: "⚖️",
    description:
      "فهرس تحليلي للمغني شرح مختصر الخرقي — الموسوعة الفقهية الحنبلية الكبرى في الفقه المقارن، يرصد ٧٠ كتاباً فقهياً و٣٧٬٩٨٥ عبارة منهجية.",
    stats: [
      { label: "كلمة", value: "١٫٨م" },
      { label: "عبارة", value: "٣٧٬٩٨٥" },
      { label: "كتاباً", value: "٧٠" },
      { label: "مدخل", value: "٧٬٦٦٨" },
    ],
    tag: "فقه حنبلي مقارن",
    url: "https://almughni.dralhoshan.com",
  },
  {
    id: "albadaei",
    title: "كشّاف بدائع الصنائع للكاساني",
    author: "علاء الدين الكاساني",
    death: "ت ٥٨٧هـ",
    category: "فقه",
    categoryLabel: "الفقه المقارن",
    categoryIcon: "⚖️",
    description:
      "فهرس تحليلي لبدائع الصنائع في ترتيب الشرائع — الموسوعة الفقهية الحنفية التعليلية، يرصد ٦٦ كتاباً فقهياً بمنهج تعليلي مقارن فريد.",
    stats: [
      { label: "كلمة", value: "١٫٥م" },
      { label: "صفحة", value: "٢٬١٢٧" },
      { label: "كتاباً", value: "٦٦" },
      { label: "مدخل", value: "٩٥٣" },
    ],
    tag: "فقه حنفي تعليلي",
    url: "https://albadaei.dralhoshan.com",
  },
  {
    id: "ibnalqayyim",
    title: "كشّاف كتب ابن القيم الثلاثة",
    author: "ابن قيم الجوزية",
    death: "ت ٧٥١هـ",
    category: "عقيدة",
    categoryLabel: "العقيدة والأصول",
    categoryIcon: "🔖",
    description:
      "فهرس تحليلي لثلاثة مصنفات كبرى: إعلام الموقعين، ومدارج السالكين، وزاد المعاد — يرصد الحديث والرواية والسلوك والتزكية والاستدلال.",
    stats: [
      { label: "كلمة", value: "١م+" },
      { label: "عبارة", value: "٣٧٬٢٩٠" },
      { label: "صفحة", value: "٣٬١٠٧" },
      { label: "مصنفات", value: "٣" },
    ],
    tag: "عقيدة وسلوك وفقه",
    url: "https://ibnalqayyim.dralhoshan.com",
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
    <div style={{ fontFamily: "'Noto Naskh Arabic', 'Amiri', serif", direction: "rtl", background: "#F5F0E8", minHeight: "100vh" }}>
      {/* ── HEADER ── */}
      <header style={{
        background: "linear-gradient(160deg, #3D2510 0%, #5A3C1E 60%, #7A5C3E 100%)",
        position: "relative",
        overflow: "hidden",
        paddingBottom: 0,
      }}>
        {/* Islamic geometric pattern overlay */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.07,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30Z' fill='none' stroke='%23D4AF37' stroke-width='1'/%3E%3Cpath d='M30 10 L50 30 L30 50 L10 30Z' fill='none' stroke='%23D4AF37' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }} />
        {/* Gold bottom line */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, transparent, #D4AF37, #F0D060, #D4AF37, transparent)" }} />

        <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px 40px", position: "relative", zIndex: 1, textAlign: "center" }}>
          {/* Bismillah */}
          <p style={{ color: "#D4AF37", fontSize: 15, fontFamily: "'Amiri', serif", marginBottom: 24, letterSpacing: 2, opacity: 0.9 }}>
            بسم الله الرحمن الرحيم
          </p>
          {/* Ornament */}
          <div style={{ color: "#D4AF37", fontSize: 22, marginBottom: 16, opacity: 0.7, letterSpacing: 8 }}>❖ ✦ ❖</div>

          {/* Logo / Title */}
          <h1 style={{
            fontFamily: "'Amiri', serif",
            fontSize: "clamp(52px, 10vw, 88px)",
            fontWeight: 700,
            color: "#F0D060",
            lineHeight: 1.1,
            marginBottom: 12,
            textShadow: "0 2px 16px rgba(0,0,0,0.4)",
            letterSpacing: 4,
          }}>
            مرقوم
          </h1>
          <p style={{ color: "#EDE0C8", fontSize: "clamp(16px, 3vw, 22px)", fontFamily: "'Amiri', serif", marginBottom: 6 }}>
            بوابة الكشافات المنهجية الرقمية
          </p>
          <p style={{ color: "#B8960C", fontSize: 14, marginBottom: 36, opacity: 0.85 }}>
            فهارس تحليلية آلية لكبريات المصنفات الإسلامية
          </p>

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "center", gap: "clamp(16px, 4vw, 48px)", flexWrap: "wrap", marginBottom: 36 }}>
            {[
              { n: "١١", l: "كشّافاً منهجياً" },
              { n: "+٣٠م", l: "كلمة محللة" },
              { n: "+١م", l: "عبارة مصنفة" },
              { n: "١١", l: "مصنفاً كبيراً" },
            ].map((s) => (
              <div key={s.l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 700, color: "#F0D060", fontFamily: "'Amiri', serif" }}>{s.n}</div>
                <div style={{ fontSize: 12, color: "#EDE0C8", opacity: 0.8, marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div style={{ maxWidth: 560, margin: "0 auto 28px", position: "relative" }}>
            <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: "#B8960C", fontSize: 18, pointerEvents: "none" }}>🔍</span>
            <input
              ref={searchRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن كشاف... (فتح الباري، ابن تيمية، الرازي...)"
              style={{
                width: "100%",
                padding: "14px 48px 14px 20px",
                borderRadius: 40,
                border: "2px solid rgba(212,175,55,0.4)",
                background: "rgba(255,255,255,0.08)",
                color: "#F5F0E8",
                fontSize: 15,
                fontFamily: "'Noto Naskh Arabic', serif",
                outline: "none",
                backdropFilter: "blur(8px)",
                direction: "rtl",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(212,175,55,0.4)")}
            />
          </div>

          {/* Author */}
          <p style={{ color: "#EDE0C8", fontSize: 13, opacity: 0.75 }}>
            إعداد:{" "}
            <a href="https://dralhoshan.com" style={{ color: "#D4AF37", textDecoration: "none" }}>
              د. يوسف الهاشم
            </a>
            {" "}·{" "}
            <a href="https://dralhoshan.com" style={{ color: "#D4AF37", textDecoration: "none" }}>
              dralhoshan.com
            </a>
          </p>
        </div>
      </header>

      {/* ── FILTER TABS ── */}
      <div style={{ background: "#EDE5D5", borderBottom: "1px solid #D4AF3730", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(44,24,16,0.08)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", gap: 8, overflowX: "auto", scrollbarWidth: "none" }}>
          <span style={{ color: "#7A5C3E", fontSize: 13, whiteSpace: "nowrap", padding: "16px 8px 16px 0", borderLeft: "1px solid #D4AF3740", paddingLeft: 16, marginLeft: 4 }}>التصنيف:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: "8px 18px",
                borderRadius: 40,
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontSize: 13,
                fontFamily: "'Noto Naskh Arabic', serif",
                fontWeight: activeCategory === cat.id ? 700 : 400,
                background: activeCategory === cat.id ? "#5A3C1E" : "transparent",
                color: activeCategory === cat.id ? "#F0D060" : "#5A3C1E",
                transition: "all 0.2s",
                margin: "8px 0",
              }}
            >
              {cat.label}{" "}
              <span style={{ opacity: 0.7, fontSize: 11 }}>
                ({cat.id === "all" ? filtered.length : KASHAFAT.filter(k => k.category === cat.id).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 16px 80px" }}>
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Amiri', serif", fontSize: 28, color: "#3D2510", marginBottom: 8 }}>
            الكشافات المنهجية الرقمية
          </h2>
          <div style={{ width: 60, height: 2, background: "linear-gradient(90deg, transparent, #B8960C, transparent)", margin: "0 auto 12px" }} />
          <p style={{ color: "#7A5C3E", fontSize: 14 }}>
            اختر الكشاف الذي تريد الاطلاع عليه — كل كشاف يتضمن تحليلاً آلياً شاملاً للمصنَّف مع فهارس منهجية دقيقة
          </p>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#7A5C3E" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 18, fontFamily: "'Amiri', serif" }}>لا توجد نتائج مطابقة للبحث</p>
            <p style={{ fontSize: 14, marginTop: 8, opacity: 0.7 }}>جرّب كلمات بحث مختلفة</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
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
        background: "linear-gradient(160deg, #3D2510 0%, #5A3C1E 100%)",
        padding: "32px 24px",
        textAlign: "center",
        position: "relative",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, transparent, #D4AF37, #F0D060, #D4AF37, transparent)" }} />
        <p style={{ fontFamily: "'Amiri', serif", fontSize: 20, color: "#F0D060", marginBottom: 8 }}>مرقوم</p>
        <p style={{ color: "#EDE0C8", fontSize: 13, opacity: 0.8, marginBottom: 12 }}>
          بوابة الكشافات المنهجية الرقمية — إعداد{" "}
          <a href="https://dralhoshan.com" style={{ color: "#D4AF37", textDecoration: "none" }}>د. يوسف الهاشم</a>
          <br />
          جزء من مشروع{" "}
          <a href="https://dralhoshan.com" style={{ color: "#D4AF37", textDecoration: "none" }}>dralhoshan.com</a>
          {" "}للفهرسة العلمية الرقمية
        </p>
        <p style={{ color: "#B8960C", fontSize: 12, opacity: 0.7 }}>© ١٤٤٦هـ / ٢٠٢٥م — جميع الحقوق محفوظة</p>
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
            background: "#5A3C1E",
            border: "2px solid #D4AF37",
            color: "#F0D060",
            fontSize: 20,
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(44,24,16,0.3)",
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

  const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    حديث: { bg: "#EEF4F0", text: "#2E6B5E", border: "#2E6B5E30" },
    تفسير: { bg: "#F0EEF8", text: "#4A3580", border: "#4A358030" },
    فقه: { bg: "#FFF4E6", text: "#8B4513", border: "#8B451330" },
    عقيدة: { bg: "#F0F4EE", text: "#3D6B2E", border: "#3D6B2E30" },
  };
  const catColor = categoryColors[kashaf.category] || categoryColors["حديث"];

  return (
    <a
      href={kashaf.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#FAFAF8",
        borderRadius: 12,
        border: `1px solid ${hovered ? "#B8960C" : "#E8DCC8"}`,
        boxShadow: hovered
          ? "0 8px 40px rgba(44,24,16,0.18), 0 2px 8px rgba(184,150,12,0.12)"
          : "0 4px 24px rgba(44,24,16,0.08)",
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        cursor: "pointer",
      }}
    >
      {/* Card Header */}
      <div style={{
        background: hovered
          ? "linear-gradient(135deg, #3D2510 0%, #5A3C1E 100%)"
          : "linear-gradient(135deg, #5A3C1E 0%, #7A5C3E 100%)",
        padding: "20px 20px 16px",
        position: "relative",
        overflow: "hidden",
        transition: "background 0.25s",
      }}>
        {/* Pattern */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M20 0 L40 20 L20 40 L0 20Z' fill='none' stroke='%23D4AF37' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
        }} />
        {/* Category badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: catColor.bg,
          color: catColor.text,
          border: `1px solid ${catColor.border}`,
          borderRadius: 20,
          padding: "3px 10px",
          fontSize: 11,
          fontWeight: 600,
          marginBottom: 10,
          position: "relative",
          zIndex: 1,
        }}>
          <span>{kashaf.categoryIcon}</span>
          <span>{kashaf.categoryLabel}</span>
        </div>
        {/* Title */}
        <h3 style={{
          fontFamily: "'Amiri', serif",
          fontSize: 20,
          fontWeight: 700,
          color: "#F0D060",
          marginBottom: 4,
          lineHeight: 1.3,
          position: "relative",
          zIndex: 1,
        }}>
          {kashaf.title}
        </h3>
        {/* Author */}
        <p style={{ color: "#EDE0C8", fontSize: 12, opacity: 0.85, position: "relative", zIndex: 1 }}>
          ◆ {kashaf.author} ({kashaf.death})
        </p>
      </div>

      {/* Card Body */}
      <div style={{ padding: "16px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
        <p style={{ color: "#5A3C1E", fontSize: 13, lineHeight: 1.7, marginBottom: 16, flex: 1 }}>
          {kashaf.description}
        </p>

        {/* Stats */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {kashaf.stats.map((s) => (
            <span key={s.label} style={{
              background: "#F5F0E8",
              border: "1px solid #E8DCC8",
              borderRadius: 20,
              padding: "3px 10px",
              fontSize: 11,
              color: "#7A5C3E",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}>
              <span style={{ color: "#B8960C", fontWeight: 700 }}>{s.value}</span>
              <span>{s.label}</span>
            </span>
          ))}
        </div>

        {/* Tag + CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #E8DCC8", paddingTop: 12 }}>
          <span style={{ fontSize: 11, color: "#7A5C3E", background: "#EDE5D5", padding: "3px 10px", borderRadius: 20 }}>
            {kashaf.tag}
          </span>
          <span style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            color: hovered ? "#F0D060" : "#B8960C",
            background: hovered ? "#5A3C1E" : "transparent",
            border: `1px solid ${hovered ? "#5A3C1E" : "#B8960C"}`,
            borderRadius: 20,
            padding: "5px 14px",
            transition: "all 0.2s",
          }}>
            <span>دخول الكشاف</span>
            <span style={{ fontSize: 16 }}>›</span>
          </span>
        </div>
      </div>
    </a>
  );
}
