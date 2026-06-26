import { useEffect, useState, useMemo } from "react";

// ═══════════════════════════════════════════════
// DESIGN: هوية مرقوم — عارض بيانات الكشاف التفاعلي
// الألوان: أخضر زمردي #1A7A6E + ذهبي #B5A05A
// الهدف: عرض بيانات Excel المحوّلة إلى JSON بدون تحميل
// ═══════════════════════════════════════════════

const T = {
  emerald: "#1A7A6E",
  emeraldDark: "#0D5C52",
  emeraldLight: "#2A9A8E",
  gold: "#B5A05A",
  goldLight: "#D4C07A",
  dark: "#1A2A28",
  cream: "#F4FAF9",
  creamDark: "#E0F0EE",
  textDark: "#0A2A28",
  textMid: "#2A5A56",
  textLight: "#6A9A96",
  white: "#FFFFFF",
  border: "#C8E8E4",
};

type SheetData = {
  headers: string[];
  rows: Record<string, unknown>[];
};

type KashafData = Record<string, SheetData>;

export default function KashafViewer() {
  const [data, setData] = useState<KashafData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSheet, setActiveSheet] = useState<string>("");
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState<string>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;

  useEffect(() => {
    fetch("/bukhari_sample.json")
      .then((r) => r.json())
      .then((d: KashafData) => {
        setData(d);
        setActiveSheet(Object.keys(d)[0] || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const sheet = data?.[activeSheet];

  const filtered = useMemo(() => {
    if (!sheet) return [];
    let rows = sheet.rows;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter((row) =>
        Object.values(row).some((v) =>
          String(v ?? "").toLowerCase().includes(q)
        )
      );
    }
    if (sortCol) {
      rows = [...rows].sort((a, b) => {
        const av = a[sortCol] ?? "";
        const bv = b[sortCol] ?? "";
        const an = Number(av), bn = Number(bv);
        if (!isNaN(an) && !isNaN(bn)) {
          return sortDir === "asc" ? an - bn : bn - an;
        }
        return sortDir === "asc"
          ? String(av).localeCompare(String(bv), "ar")
          : String(bv).localeCompare(String(av), "ar");
      });
    }
    return rows;
  }, [sheet, search, sortCol, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
    setPage(1);
  };

  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  const handleSheet = (name: string) => {
    setActiveSheet(name);
    setSearch("");
    setSortCol("");
    setPage(1);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.cream, direction: "rtl" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, border: `4px solid ${T.creamDark}`, borderTop: `4px solid ${T.emerald}`, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: T.textMid, fontFamily: "'Noto Naskh Arabic', serif" }}>جارٍ تحميل البيانات...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.cream, direction: "rtl" }}>
        <p style={{ color: T.textMid, fontFamily: "'Noto Naskh Arabic', serif" }}>تعذّر تحميل البيانات</p>
      </div>
    );
  }

  const sheets = Object.keys(data);

  return (
    <div style={{ minHeight: "100vh", background: T.cream, direction: "rtl", fontFamily: "'Noto Naskh Arabic', serif" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${T.emeraldDark} 0%, ${T.emerald} 100%)`, padding: "clamp(20px,4vw,32px) clamp(16px,4vw,40px)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M20 0 L40 20 L20 40 L0 20Z' fill='none' stroke='%23B5A05A' stroke-width='1'/%3E%3C/svg%3E")`, backgroundSize: "40px 40px" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <img src="/manus-storage/marqoom_logo_faca7079.png" alt="مرقوم" style={{ height: 36, width: "auto" }} />
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>›</span>
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>كشّاف صحيح البخاري</span>
          </div>
          <h1 style={{ color: T.white, fontSize: "clamp(20px,4vw,28px)", fontWeight: 700, margin: 0, fontFamily: "'Amiri', serif" }}>
            عارض البيانات التفاعلي
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "clamp(13px,2.5vw,15px)", marginTop: 6 }}>
            استعرض جميع أوراق الكشاف وابحث وافرز البيانات — بدون تحميل أي ملف
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(16px,3vw,32px) clamp(12px,3vw,24px)" }}>
        {/* Sheet Tabs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {sheets.map((name) => (
            <button
              key={name}
              onClick={() => handleSheet(name)}
              style={{
                padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                fontSize: "clamp(12px,2.5vw,14px)", fontFamily: "'Noto Naskh Arabic', serif",
                fontWeight: activeSheet === name ? 700 : 400,
                background: activeSheet === name ? T.emerald : T.white,
                color: activeSheet === name ? T.white : T.textMid,
                boxShadow: activeSheet === name ? `0 2px 8px ${T.emerald}44` : "0 1px 4px rgba(0,0,0,0.08)",
                transition: "all 0.18s cubic-bezier(0.23,1,0.32,1)",
                transform: activeSheet === name ? "scale(1.02)" : "scale(1)",
              }}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Search + Stats bar */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginBottom: 16 }}>
          <div style={{ position: "relative", flex: "1 1 240px" }}>
            <input
              type="text"
              placeholder="ابحث في البيانات..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                width: "100%", padding: "10px 40px 10px 16px", borderRadius: 8,
                border: `1.5px solid ${T.border}`, background: T.white,
                fontSize: "clamp(13px,2.5vw,14px)", fontFamily: "'Noto Naskh Arabic', serif",
                color: T.textDark, outline: "none", boxSizing: "border-box",
                transition: "border-color 0.18s",
              }}
              onFocus={(e) => (e.target.style.borderColor = T.emerald)}
              onBlur={(e) => (e.target.style.borderColor = T.border)}
            />
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.textLight, fontSize: 16 }}>🔍</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ padding: "8px 14px", borderRadius: 8, background: T.white, border: `1px solid ${T.border}`, fontSize: 13, color: T.textMid }}>
              <strong style={{ color: T.emerald }}>{filtered.length}</strong> سطر
            </span>
            <span style={{ padding: "8px 14px", borderRadius: 8, background: T.white, border: `1px solid ${T.border}`, fontSize: 13, color: T.textMid }}>
              <strong style={{ color: T.gold }}>{sheet?.headers.length ?? 0}</strong> عمود
            </span>
            {search && (
              <button
                onClick={() => handleSearch("")}
                style={{ padding: "8px 14px", borderRadius: 8, background: "#FFF0F0", border: "1px solid #FFCCCC", fontSize: 13, color: "#C04040", cursor: "pointer", fontFamily: "'Noto Naskh Arabic', serif" }}
              >
                مسح البحث ✕
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div style={{ background: T.white, borderRadius: 12, boxShadow: "0 2px 16px rgba(10,42,40,0.08)", overflow: "hidden", border: `1px solid ${T.border}` }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "clamp(12px,2.5vw,14px)" }}>
              <thead>
                <tr style={{ background: `linear-gradient(90deg, ${T.emeraldDark}, ${T.emerald})` }}>
                  {sheet?.headers.map((h) => (
                    <th
                      key={h}
                      onClick={() => handleSort(h)}
                      style={{
                        padding: "12px 16px", textAlign: "right", color: T.white,
                        fontWeight: 600, fontFamily: "'Noto Naskh Arabic', serif",
                        cursor: "pointer", whiteSpace: "nowrap", userSelect: "none",
                        borderLeft: `1px solid rgba(255,255,255,0.1)`,
                        transition: "background 0.15s",
                      }}
                      title="انقر للفرز"
                    >
                      {h}
                      {sortCol === h && (
                        <span style={{ marginRight: 4, opacity: 0.8 }}>{sortDir === "asc" ? " ↑" : " ↓"}</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={sheet?.headers.length ?? 1} style={{ padding: 40, textAlign: "center", color: T.textLight }}>
                      لا توجد نتائج مطابقة للبحث
                    </td>
                  </tr>
                ) : (
                  pageRows.map((row, i) => (
                    <tr
                      key={i}
                      style={{
                        background: i % 2 === 0 ? T.white : T.cream,
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = T.creamDark)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? T.white : T.cream)}
                    >
                      {sheet?.headers.map((h) => (
                        <td
                          key={h}
                          style={{
                            padding: "10px 16px", borderBottom: `1px solid ${T.border}`,
                            color: T.textDark, textAlign: "right",
                            borderLeft: `1px solid ${T.border}`,
                            maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}
                          title={String(row[h] ?? "")}
                        >
                          {String(row[h] ?? "—")}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: "8px 18px", borderRadius: 8, border: `1.5px solid ${T.border}`,
                background: page === 1 ? T.cream : T.white, color: page === 1 ? T.textLight : T.emerald,
                cursor: page === 1 ? "not-allowed" : "pointer", fontFamily: "'Noto Naskh Arabic', serif",
                fontSize: 14, fontWeight: 600, transition: "all 0.15s",
              }}
            >
              ‹ السابق
            </button>
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let p = i + 1;
              if (totalPages > 7) {
                if (page <= 4) p = i + 1;
                else if (page >= totalPages - 3) p = totalPages - 6 + i;
                else p = page - 3 + i;
              }
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${page === p ? T.emerald : T.border}`,
                    background: page === p ? T.emerald : T.white,
                    color: page === p ? T.white : T.textMid,
                    cursor: "pointer", fontFamily: "'Noto Naskh Arabic', serif", fontSize: 14, fontWeight: page === p ? 700 : 400,
                    minWidth: 40, transition: "all 0.15s",
                  }}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                padding: "8px 18px", borderRadius: 8, border: `1.5px solid ${T.border}`,
                background: page === totalPages ? T.cream : T.white, color: page === totalPages ? T.textLight : T.emerald,
                cursor: page === totalPages ? "not-allowed" : "pointer", fontFamily: "'Noto Naskh Arabic', serif",
                fontSize: 14, fontWeight: 600, transition: "all 0.15s",
              }}
            >
              التالي ›
            </button>
            <span style={{ color: T.textLight, fontSize: 13, marginRight: 8 }}>
              صفحة {page} من {totalPages}
            </span>
          </div>
        )}

        {/* Info note */}
        <div style={{ marginTop: 24, padding: "14px 18px", borderRadius: 10, background: `${T.emerald}12`, border: `1px solid ${T.emerald}30`, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>ℹ️</span>
          <p style={{ margin: 0, color: T.textMid, fontSize: "clamp(12px,2.5vw,13px)", lineHeight: 1.7 }}>
            هذا العارض يعرض بيانات الكشاف مباشرةً من قاعدة البيانات دون الحاجة لتحميل أي ملف. البيانات قابلة للبحث والفرز في جميع الأعمدة. هذا مثال تجريبي على كشّاف صحيح البخاري.
          </p>
        </div>
      </div>
    </div>
  );
}
