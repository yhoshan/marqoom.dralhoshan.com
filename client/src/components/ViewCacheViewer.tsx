// ═══════════════════════════════════════════════════════════════════
// ViewCacheViewer — عارض view_cache.json وفق MARQOOM_SCHEMA v1.0.0
// يدعم أيضاً البنية التجريبية القديمة (legacy format)
// الألوان: أخضر زمردي #1A7A6E + ذهبي #B5A05A + رمادي داكن #3A3A3A
// الاتجاه: RTL — العربية فقط
// ═══════════════════════════════════════════════════════════════════
import { useEffect, useState } from "react";

// ── Color palette ──────────────────────────────────────────────────
const P = {
  emerald: "#0D8A7A",
  emeraldDark: "#0A6B5E",
  gold: "#B5A05A",
  goldLight: "#D4C07A",
  cream: "#F0FAF9",
  creamDark: "#D8F0EE",
  creamMid: "#B8E0DC",
  textDark: "#0A2A28",
  textMid: "#2A5A56",
  textLight: "#5A8A86",
  white: "#FFFFFF",
  blue: "#2D5FA6",
  orange: "#C06020",
};

// ── Helpers ────────────────────────────────────────────────────────
function fmt(n: number | null | undefined): string {
  if (n == null || isNaN(Number(n))) return "—";
  return Number(n).toLocaleString("en-US");
}

// ── Animated bar ───────────────────────────────────────────────────
function AnimBar({ pct, color, delay = 0 }: { pct: number; color: string; delay?: number }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(pct), 100 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div style={{ height: 8, background: "#E8F5F3", borderRadius: 4, overflow: "hidden", flex: 1 }}>
      <div style={{ height: "100%", borderRadius: 4, background: `linear-gradient(90deg,${color},${color}BB)`, width: `${w}%`, transition: "width 0.7s cubic-bezier(0.23,1,0.32,1)" }} />
    </div>
  );
}

// ── Section header ─────────────────────────────────────────────────
function SH({ icon, title, sub }: { icon: string; title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg,${P.emeraldDark},${P.emerald})`, display: "flex", alignItems: "center", justifyContent: "center", color: P.goldLight, fontSize: 15, flexShrink: 0 }}>
          <i className={icon} />
        </div>
        <h3 style={{ fontFamily: "'Amiri',serif", fontSize: "clamp(15px,4vw,19px)", color: P.emeraldDark, margin: 0, fontWeight: 700 }}>{title}</h3>
      </div>
      {sub && <p style={{ fontSize: 12, color: P.textLight, margin: "0 44px 0 0" }}>{sub}</p>}
      <div style={{ height: 2, background: `linear-gradient(90deg,${P.gold},${P.goldLight}44,transparent)`, marginTop: 8 }} />
    </div>
  );
}

// ── Card ───────────────────────────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: P.white, borderRadius: 16, padding: "clamp(16px,4vw,26px)", boxShadow: "0 2px 16px rgba(10,42,40,0.07)", border: `1px solid ${P.creamMid}`, ...style }}>
      {children}
    </div>
  );
}

// ── Normalizer: يحوّل أي بنية JSON إلى بنية موحّدة داخلياً ─────────
interface NormalizedData {
  title: string;
  author: string;
  diedHijri?: number | null;
  category: string;
  bookId?: string;
  schemaVersion?: string;
  generatedAt?: string;
  summary: { pages?: number; parts?: number; wordsApprox?: number; chars?: number; surahsDetected?: number };
  purposes: { label: string; count: number; pct: number }[];
  resources: { label: string; count: number; pct: number }[];
  books: { title: string; category: string; author: string; count: number; pct: number }[];
  people: { name: string; role: string; count: number; pct: number }[];
  surahs: { number: number; name: string; pageStart?: number; ayahCount?: number; chars?: number; charsPerAyah?: number }[];
  limits: [string, string][];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(d: any): NormalizedData {
  // ── MARQOOM_SCHEMA v1 (has _meta, book, summary, highlights, distributions) ──
  if (d._meta && d.book && d.highlights) {
    const hl = d.highlights || {};
    const dist = d.distributions || {};
    const colIdx = (t: { _columns: string[] }, name: string) => t._columns?.indexOf(name) ?? -1;
    const cell = (row: unknown[], idx: number) => idx >= 0 ? row[idx] : null;

    const parseTable = (t: { _columns: string[]; rows: unknown[][] } | null | undefined, labelC: string, countC: string, pctC: string, extraC?: string) => {
      if (!t?.rows?.length) return [];
      const li = colIdx(t, labelC), ci = colIdx(t, countC), pi = colIdx(t, pctC);
      const ei = extraC ? colIdx(t, extraC) : -1;
      return t.rows.map(r => ({
        label: String(cell(r as unknown[], li) ?? ""),
        count: Number(cell(r as unknown[], ci)) || 0,
        pct: Number(cell(r as unknown[], pi)) || 0,
        extra: ei >= 0 ? String(cell(r as unknown[], ei) ?? "") : "",
      }));
    };

    const parseBooksTable = (t: { _columns: string[]; rows: unknown[][] } | null | undefined) => {
      if (!t?.rows?.length) return [];
      const ti = colIdx(t, "title"), cati = colIdx(t, "category"), ai = colIdx(t, "author"), ci = colIdx(t, "count"), pi = colIdx(t, "pct");
      return t.rows.map(r => ({
        title: String(cell(r as unknown[], ti) ?? ""),
        category: String(cell(r as unknown[], cati) ?? ""),
        author: String(cell(r as unknown[], ai) ?? ""),
        count: Number(cell(r as unknown[], ci)) || 0,
        pct: Number(cell(r as unknown[], pi)) || 0,
      }));
    };

    const parseSurahTable = (t: { _columns: string[]; rows: unknown[][] } | null | undefined) => {
      if (!t?.rows?.length) return [];
      const numi = colIdx(t, "number"), ni = colIdx(t, "name"), psi = colIdx(t, "page_start"), ai = colIdx(t, "ayah_count"), chari = colIdx(t, "chars"), cpai = colIdx(t, "chars_per_ayah");
      return t.rows.map(r => ({
        number: Number(cell(r as unknown[], numi)) || 0,
        name: String(cell(r as unknown[], ni) ?? ""),
        pageStart: Number(cell(r as unknown[], psi)) || undefined,
        ayahCount: Number(cell(r as unknown[], ai)) || undefined,
        chars: Number(cell(r as unknown[], chari)) || undefined,
        charsPerAyah: Number(cell(r as unknown[], cpai)) || undefined,
      }));
    };

    return {
      title: d.book.title || "",
      author: d.book.author || "",
      diedHijri: d.book.died_hijri,
      category: d.book.category || "",
      bookId: d._meta.book_id,
      schemaVersion: d._meta.schema_version,
      generatedAt: d._meta.generated_at,
      summary: {
        pages: d.summary?.pages ?? undefined,
        parts: d.summary?.parts ?? undefined,
        wordsApprox: d.summary?.words_approx ?? undefined,
        chars: d.summary?.chars ?? undefined,
        surahsDetected: d.summary?.surahs_detected ?? undefined,
      },
      purposes: parseTable(hl.top_purposes, "label", "count", "pct_total"),
      resources: parseTable(hl.top_resources, "label", "count", "pct_total"),
      books: parseBooksTable(hl.top_books),
      people: parseTable(hl.top_people, "name", "count", "pct").map(p => ({ ...p, name: p.label, role: p.extra || "" })),
      surahs: parseSurahTable(dist.surah),
      limits: (d.limits || []).map((item: unknown[]) => [String(item[0] ?? ""), String(item[1] ?? "")] as [string, string]),
    };
  }

  // ── Legacy format (ChatGPT output: flat arrays, no _meta) ──
  const parseArr = (arr: unknown[][], labelI: number, countI: number, pctI: number) => {
    if (!Array.isArray(arr)) return [];
    return arr.map(r => ({
      label: String(r[labelI] ?? ""),
      count: Number(r[countI]) || 0,
      pct: Number(r[pctI]) || 0,
    }));
  };

  const parseBooksArr = (arr: unknown[][]) => {
    if (!Array.isArray(arr)) return [];
    return arr.map(r => ({
      title: String(r[0] ?? ""),
      category: String(r[1] ?? ""),
      author: String(r[2] ?? ""),
      count: Number(r[3]) || 0,
      pct: Number(r[4]) || 0,
    }));
  };

  const parsePeopleArr = (arr: unknown[][]) => {
    if (!Array.isArray(arr)) return [];
    return arr.map(r => ({
      name: String(r[0] ?? ""),
      role: String(r[1] ?? ""),
      count: Number(r[2]) || 0,
      pct: Number(r[3]) || 0,
    }));
  };

  const parseSurahArr = (arr: unknown[][]) => {
    if (!Array.isArray(arr)) return [];
    return arr.map(r => ({
      number: Number(r[0]) || 0,
      name: String(r[1] ?? ""),
      pageStart: Number(r[3]) || undefined,
      ayahCount: Number(r[6]) || undefined,
      chars: Number(r[7]) || undefined,
      charsPerAyah: Number(r[8]) || undefined,
    }));
  };

  const m = d.metrics || {};
  return {
    title: String(d.book || ""),
    author: String(d.author || ""),
    diedHijri: null,
    category: String(d.category || ""),
    bookId: undefined,
    schemaVersion: undefined,
    generatedAt: undefined,
    summary: {
      pages: m.pages,
      parts: m.parts,
      wordsApprox: m.words_approx,
      chars: m.chars,
      surahsDetected: m.surahs_detected,
    },
    purposes: parseArr(d.top_purposes || [], 0, 1, 2),
    resources: parseArr(d.top_resources || [], 0, 1, 2),
    books: parseBooksArr(d.top_books || []),
    people: parsePeopleArr(d.top_people || []),
    surahs: parseSurahArr(d.surah_distribution || []),
    limits: (d.limits || []).map((item: unknown[]) => [String(item[0] ?? ""), String(item[1] ?? "")] as [string, string]),
  };
}

// ── Summary cards ──────────────────────────────────────────────────
function SummaryCards({ s }: { s: NormalizedData["summary"] }) {
  const items = [
    { label: "صفحة", value: s.pages, icon: "fa-solid fa-file-lines" },
    { label: "جزء", value: s.parts, icon: "fa-solid fa-layer-group" },
    { label: "كلمة تقريباً", value: s.wordsApprox, icon: "fa-solid fa-font" },
    { label: "حرف", value: s.chars, icon: "fa-solid fa-spell-check" },
    { label: "سورة مرصودة", value: s.surahsDetected, icon: "fa-solid fa-moon" },
  ].filter(i => i.value != null && i.value !== 0);
  if (!items.length) return null;
  return (
    <div>
      <SH icon="fa-solid fa-chart-simple" title="الأرقام الكبرى" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,150px),1fr))", gap: "clamp(10px,2vw,14px)" }}>
        {items.map((item, i) => (
          <div key={i} style={{ background: P.white, borderRadius: 14, padding: "clamp(14px,3vw,20px) clamp(12px,2vw,16px)", textAlign: "center", boxShadow: "0 2px 12px rgba(10,42,40,0.06)", border: `1px solid ${P.creamMid}`, transition: "transform 0.2s,box-shadow 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(10,42,40,0.12)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(10,42,40,0.06)"; }}
          >
            <i className={item.icon} style={{ fontSize: 20, color: P.gold, marginBottom: 8, display: "block" }} />
            <div style={{ fontSize: "clamp(18px,4.5vw,26px)", fontWeight: 700, color: P.emeraldDark, fontFamily: "'Amiri',serif", marginBottom: 4 }}>{fmt(item.value as number)}</div>
            <div style={{ fontSize: "clamp(11px,2.5vw,12px)", color: P.textMid }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Bar chart section ──────────────────────────────────────────────
function BarSection({ items, title, icon, color, sub }: {
  items: { label: string; count: number; pct: number }[];
  title: string; icon: string; color: string; sub?: string;
}) {
  if (!items.length) return null;
  const maxPct = Math.max(...items.map(i => i.pct));
  return (
    <Card>
      <SH icon={icon} title={title} sub={sub} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((item, i) => (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
              <span style={{ fontSize: "clamp(12px,3vw,14px)", color: P.textDark, fontWeight: i === 0 ? 700 : 400 }}>
                {i === 0 && <i className="fa-solid fa-star" style={{ color: P.gold, marginLeft: 5, fontSize: 11 }} />}
                {item.label}
              </span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: P.textLight }}>{fmt(item.count)}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color, background: color + "15", padding: "1px 8px", borderRadius: 10, minWidth: 44, textAlign: "center" }}>{item.pct}%</span>
              </div>
            </div>
            <AnimBar pct={maxPct > 0 ? (item.pct / maxPct) * 100 : 0} color={color} delay={i * 60} />
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Books table ────────────────────────────────────────────────────
function BooksSection({ books }: { books: NormalizedData["books"] }) {
  if (!books.length) return null;
  return (
    <Card>
      <SH icon="fa-solid fa-books" title="أبرز الكتب المُحال إليها" sub={`${books.length} كتاباً`} />
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "clamp(11px,2.5vw,13px)" }}>
          <thead>
            <tr style={{ background: P.cream }}>
              {["#", "الكتاب", "المجال", "المؤلف", "التكرار", "النسبة"].map((h, i) => (
                <th key={i} style={{ padding: "9px 10px", textAlign: "right", color: P.textMid, fontWeight: 600, fontSize: 12, borderBottom: `2px solid ${P.creamMid}`, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {books.map((b, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${P.creamDark}`, transition: "background 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = P.cream; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ""; }}
              >
                <td style={{ padding: "8px 10px", color: P.textLight, fontWeight: 700 }}>{i + 1}</td>
                <td style={{ padding: "8px 10px", color: P.textDark, fontWeight: i < 3 ? 600 : 400 }}>
                  {i < 3 && <i className="fa-solid fa-bookmark" style={{ color: P.gold, marginLeft: 5, fontSize: 10 }} />}
                  {b.title}
                </td>
                <td style={{ padding: "8px 10px" }}>
                  <span style={{ background: P.creamDark, color: P.textMid, padding: "2px 8px", borderRadius: 10, fontSize: 11 }}>{b.category}</span>
                </td>
                <td style={{ padding: "8px 10px", color: P.textMid }}>{b.author}</td>
                <td style={{ padding: "8px 10px", color: P.emerald, fontWeight: 600 }}>{fmt(b.count)}</td>
                <td style={{ padding: "8px 10px" }}><span style={{ color: P.gold, fontWeight: 700 }}>{b.pct}%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ── People grid ────────────────────────────────────────────────────
function PeopleSection({ people }: { people: NormalizedData["people"] }) {
  if (!people.length) return null;
  const maxCount = Math.max(...people.map(p => p.count));
  const roleColors: Record<string, string> = {
    "تفسير": P.blue, "حديث": P.emerald, "فقه": P.orange,
    "نحو": "#6A3A9A", "قراءات": "#8A6A20", "عقيدة": "#4A8A40", "بلاغة": "#2A7A9A",
  };
  return (
    <Card>
      <SH icon="fa-solid fa-users" title="أبرز الأعلام" sub={`${people.length} عَلَماً`} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,260px),1fr))", gap: 12 }}>
        {people.map((p, i) => {
          const roleKey = p.role.split("/")[0];
          const rc = roleColors[roleKey] || P.emerald;
          return (
            <div key={i} style={{ background: P.cream, borderRadius: 12, padding: "12px 14px", border: `1px solid ${P.creamMid}`, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{ fontSize: "clamp(13px,3vw,14px)", fontWeight: 700, color: P.textDark }}>{p.name}</span>
                  {p.role && (
                    <div style={{ marginTop: 2 }}>
                      <span style={{ fontSize: 11, background: rc + "18", color: rc, padding: "1px 8px", borderRadius: 10 }}>{p.role}</span>
                    </div>
                  )}
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: P.emeraldDark }}>{fmt(p.count)}</div>
                  <div style={{ fontSize: 11, color: P.gold, fontWeight: 600 }}>{p.pct}%</div>
                </div>
              </div>
              <AnimBar pct={maxCount > 0 ? (p.count / maxCount) * 100 : 0} color={P.emerald} delay={i * 40} />
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── Surah table ────────────────────────────────────────────────────
function SurahSection({ surahs }: { surahs: NormalizedData["surahs"] }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER = 20;
  if (!surahs.length) return null;
  const filtered = surahs.filter(s => s.name.includes(search));
  const totalPages = Math.ceil(filtered.length / PER);
  const paged = filtered.slice((page - 1) * PER, page * PER);
  const maxChars = Math.max(...surahs.map(s => s.chars || 0));
  return (
    <Card>
      <SH icon="fa-solid fa-quran" title="توزيع السور" sub={`${surahs.length} سورة`} />
      <div style={{ marginBottom: 12, position: "relative" }}>
        <i className="fa-solid fa-magnifying-glass" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: P.textLight, fontSize: 13 }} />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="ابحث عن سورة..."
          style={{ width: "100%", padding: "9px 36px 9px 12px", border: `1px solid ${P.creamMid}`, borderRadius: 10, fontSize: 14, fontFamily: "'Noto Naskh Arabic',serif", direction: "rtl", background: P.cream, color: P.textDark, outline: "none", boxSizing: "border-box" }} />
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "clamp(11px,2.5vw,13px)" }}>
          <thead>
            <tr style={{ background: P.cream }}>
              {["#", "السورة", "الصفحة", "الآيات", "الأحرف", "أحرف/آية", "الكثافة"].map((h, i) => (
                <th key={i} style={{ padding: "9px 10px", textAlign: "right", color: P.textMid, fontWeight: 600, fontSize: 12, borderBottom: `2px solid ${P.creamMid}`, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((s, i) => {
              const barPct = maxChars > 0 ? ((s.chars || 0) / maxChars) * 100 : 0;
              return (
                <tr key={i} style={{ borderBottom: `1px solid ${P.creamDark}`, transition: "background 0.15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = P.cream; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ""; }}
                >
                  <td style={{ padding: "8px 10px", color: P.textLight, fontSize: 11 }}>{s.number}</td>
                  <td style={{ padding: "8px 10px", color: P.textDark, fontWeight: 600 }}>{s.name}</td>
                  <td style={{ padding: "8px 10px", color: P.textMid }}>{s.pageStart ?? "—"}</td>
                  <td style={{ padding: "8px 10px", color: P.emerald, fontWeight: 600 }}>{fmt(s.ayahCount)}</td>
                  <td style={{ padding: "8px 10px", color: P.textMid }}>{fmt(s.chars)}</td>
                  <td style={{ padding: "8px 10px", color: P.textLight }}>{s.charsPerAyah?.toFixed(1) ?? "—"}</td>
                  <td style={{ padding: "8px 10px" }}>
                    <div style={{ height: 6, background: P.creamDark, borderRadius: 3, overflow: "hidden", minWidth: 60 }}>
                      <div style={{ height: "100%", borderRadius: 3, background: P.emerald, width: `${barPct}%` }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ padding: "5px 12px", borderRadius: 8, border: `1px solid ${P.creamMid}`, background: page === 1 ? P.creamDark : P.white, cursor: page === 1 ? "default" : "pointer", color: P.textMid, fontSize: 12 }}>السابق</button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const pg = i + 1;
            return (
              <button key={pg} onClick={() => setPage(pg)}
                style={{ padding: "5px 10px", borderRadius: 8, border: `1px solid ${page === pg ? P.emerald : P.creamMid}`, background: page === pg ? P.emerald : P.white, color: page === pg ? P.white : P.textMid, cursor: "pointer", fontSize: 12, fontWeight: page === pg ? 700 : 400 }}>
                {pg}
              </button>
            );
          })}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{ padding: "5px 12px", borderRadius: 8, border: `1px solid ${P.creamMid}`, background: page === totalPages ? P.creamDark : P.white, cursor: page === totalPages ? "default" : "pointer", color: P.textMid, fontSize: 12 }}>التالي</button>
        </div>
      )}
    </Card>
  );
}

// ── Limits ─────────────────────────────────────────────────────────
function LimitsSection({ limits }: { limits: [string, string][] }) {
  if (!limits.length) return null;
  const icons = ["fa-solid fa-database", "fa-solid fa-crosshairs", "fa-solid fa-calculator", "fa-solid fa-percent", "fa-solid fa-shield-halved", "fa-solid fa-triangle-exclamation"];
  return (
    <Card style={{ background: "linear-gradient(135deg,#FFF8EC,#FFFAF4)", border: "1px solid #E8D89A" }}>
      <SH icon="fa-solid fa-circle-info" title="حدود الدراسة وملاحظات المنهج" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {limits.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", background: "rgba(255,255,255,0.7)", borderRadius: 10, border: "1px solid #E8D89A44" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: `linear-gradient(135deg,${P.gold},${P.goldLight})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#1A1A1A", fontSize: 13 }}>
              <i className={icons[i] || "fa-solid fa-info"} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: P.gold, marginBottom: 3 }}>{item[0]}</div>
              <div style={{ fontSize: "clamp(12px,3vw,13px)", color: P.textMid, lineHeight: 1.7 }}>{item[1]}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div style={{ padding: "16px 0" }}>
      <style>{`@keyframes vcpulse{0%,100%{opacity:1}50%{opacity:0.45}}`}</style>
      {[120, 80, 160].map((h, i) => (
        <div key={i} style={{ background: P.creamDark, borderRadius: 14, height: h, marginBottom: 14, animation: "vcpulse 1.5s ease-in-out infinite" }} />
      ))}
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────
export default function ViewCacheViewer({ jsonUrl }: { jsonUrl: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [raw, setRaw] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true); setError(null);
    fetch(jsonUrl)
      .then(r => { if (!r.ok) throw new Error(`فشل تحميل البيانات (${r.status})`); return r.json(); })
      .then(d => { setRaw(d); setLoading(false); })
      .catch(e => { setError(e.message || "خطأ في التحميل"); setLoading(false); });
  }, [jsonUrl]);

  if (loading) return <Skeleton />;
  if (error) return (
    <div style={{ background: "#FFF5F5", border: "1px solid #FFCDD2", borderRadius: 14, padding: 24, textAlign: "center", color: "#C0392B" }}>
      <i className="fa-solid fa-circle-exclamation" style={{ fontSize: 28, marginBottom: 10, display: "block" }} />
      <p style={{ margin: 0, fontSize: 14 }}>{error}</p>
    </div>
  );
  if (!raw) return null;

  const data = normalize(raw);

  return (
    <div style={{ fontFamily: "'Noto Naskh Arabic','Amiri',serif", direction: "rtl", display: "flex", flexDirection: "column", gap: "clamp(18px,4vw,26px)" }}>
      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${P.gold},transparent)` }} />
        <span style={{ fontSize: 12, color: P.textLight, whiteSpace: "nowrap", padding: "0 8px" }}>
          <i className="fa-solid fa-chart-bar" style={{ marginLeft: 5, color: P.gold }} />
          البيانات التحليلية
          {data.schemaVersion && <span style={{ marginRight: 6, opacity: 0.7 }}>— MARQOOM_SCHEMA v{data.schemaVersion}</span>}
        </span>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(270deg,${P.gold},transparent)` }} />
      </div>

      {/* Book info */}
      <Card style={{ borderTop: `4px solid ${P.gold}` }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg,${P.emeraldDark},${P.emerald})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <i className="fa-solid fa-book-open" style={{ fontSize: 20, color: P.goldLight }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
              {data.category && <span style={{ background: P.creamDark, color: P.textMid, borderRadius: 20, padding: "2px 12px", fontSize: 12, fontWeight: 600 }}>{data.category}</span>}
              {data.bookId && <span style={{ fontSize: 11, color: P.textLight, background: P.creamDark, padding: "2px 10px", borderRadius: 20 }}>{data.bookId}</span>}
            </div>
            <h2 style={{ fontFamily: "'Amiri',serif", fontSize: "clamp(17px,4.5vw,22px)", color: P.textDark, margin: "0 0 4px", fontWeight: 700 }}>{data.title}</h2>
            <p style={{ color: P.textMid, fontSize: "clamp(13px,3vw,15px)", margin: 0 }}>
              <i className="fa-solid fa-user-pen" style={{ marginLeft: 6, color: P.gold }} />
              {data.author}
              {data.diedHijri && <span style={{ color: P.textLight, fontSize: 13 }}> (ت {data.diedHijri}هـ)</span>}
            </p>
          </div>
        </div>
        {data.generatedAt && (
          <div style={{ marginTop: 12, fontSize: 11, color: P.textLight }}>
            <i className="fa-solid fa-clock" style={{ marginLeft: 4 }} />
            آخر تحديث: {new Date(data.generatedAt).toLocaleDateString("ar-SA")}
          </div>
        )}
      </Card>

      {/* Summary */}
      <SummaryCards s={data.summary} />

      {/* Purposes */}
      <BarSection items={data.purposes} title="توزيع الأغراض الرئيسية" icon="fa-solid fa-bullseye" color={P.emerald} sub="أبرز الأغراض العلمية حسب التكرار" />

      {/* Resources */}
      <BarSection items={data.resources} title="أبرز الموارد العلمية" icon="fa-solid fa-layer-group" color={P.blue} sub="الموارد الأكثر حضوراً في الكتاب" />

      {/* Books */}
      <BooksSection books={data.books} />

      {/* People */}
      <PeopleSection people={data.people} />

      {/* Surahs */}
      <SurahSection surahs={data.surahs} />

      {/* Limits */}
      <LimitsSection limits={data.limits} />
    </div>
  );
}
