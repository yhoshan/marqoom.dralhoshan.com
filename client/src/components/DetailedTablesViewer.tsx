import { useState, useMemo, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════
// DetailedTablesViewer — عارض الجداول التفصيلية لمشروع مرقوم
// يقبل بيانات view_cache.json ويعرضها في تبويبات قابلة للبحث والفرز
// لا يحتوي على أي روابط تحميل أو مسارات ملفات
// ═══════════════════════════════════════════════════════════════════════

// ── ألوان مرقوم ──
const C = {
  emerald: "#1A7A6E",
  emeraldDark: "#0D5C52",
  emeraldLight: "#2A9A8E",
  gold: "#B5A05A",
  goldLight: "#D4C07A",
  dark: "#0A2A28",
  cream: "#F4FAF9",
  creamDark: "#E0F0EE",
  creamMid: "#C0E0DC",
  textDark: "#0A2A28",
  textMid: "#2A5A56",
  textLight: "#6A9A96",
  white: "#FFFFFF",
  border: "#C8E8E4",
};

const D = {
  emerald: "#2ACABA",
  emeraldDark: "#18B0A0",
  gold: "#D4C07A",
  goldLight: "#E8D89A",
  dark: "#071E1C",
  darkMid: "#0E2E2C",
  cream: "#071E1C",
  creamDark: "#0E2E2C",
  creamMid: "#163E3C",
  textDark: "#D8F0EE",
  textMid: "#90C8C4",
  textLight: "#5A8A86",
  white: "#FFFFFF",
  border: "#1A4A46",
};

// ── أنواع البيانات ──
type TableData = {
  _columns: string[];
  rows: (string | number | null)[][];
};

type ViewCacheData = {
  _meta?: Record<string, unknown>;
  book?: Record<string, unknown>;
  summary?: Record<string, unknown>;
  highlights?: {
    terms?: TableData;
    top_purposes?: TableData;
    top_resources?: TableData;
    top_books?: TableData;
    top_people?: TableData;
    schools?: TableData;
    narration_forms?: TableData;
    composite_indicators?: TableData;
    executive_summary?: TableData;
    disagreement?: TableData;
    quick_reader?: TableData;
    [key: string]: TableData | undefined;
  };
  distributions?: {
    density?: TableData;
    [key: string]: TableData | undefined;
  };
  limits?: [string, string][];
};

// ── تعريف التبويبات ──
type TabDef = {
  id: string;
  label: string;
  icon: string;
  description: string;
  getData: (data: ViewCacheData) => TableData | null;
};

const TABS: TabDef[] = [
  {
    id: "executive_summary",
    label: "الملخص التنفيذي",
    icon: "📋",
    description: "أبرز النتائج والمحاور الكبرى للكشاف",
    getData: (d) => d.highlights?.executive_summary ?? null,
  },
  {
    id: "terms",
    label: "المصطلحات المنهجية",
    icon: "🔤",
    description: "العبارات والمصطلحات المرصودة مع تصنيفاتها وأعدادها",
    getData: (d) => d.highlights?.terms ?? null,
  },
  {
    id: "top_purposes",
    label: "توزيع الأغراض",
    icon: "🎯",
    description: "الأغراض العلمية الكبرى وتوزيعها في المصنَّف",
    getData: (d) => d.highlights?.top_purposes ?? null,
  },
  {
    id: "top_resources",
    label: "الموارد حسب المجال",
    icon: "📚",
    description: "المجالات العلمية وحضورها في موارد المصنَّف",
    getData: (d) => d.highlights?.top_resources ?? null,
  },
  {
    id: "top_books",
    label: "الكتب المُحال إليها",
    icon: "📖",
    description: "أبرز الكتب والمصادر المصرح بها في المصنَّف",
    getData: (d) => d.highlights?.top_books ?? null,
  },
  {
    id: "top_people",
    label: "الأعلام المرصودة",
    icon: "👤",
    description: "العلماء والأعلام الأكثر حضوراً في المصنَّف",
    getData: (d) => d.highlights?.top_people ?? null,
  },
  {
    id: "schools",
    label: "المدارس والاتجاهات",
    icon: "🏛️",
    description: "المذاهب والمدارس الفكرية المرصودة",
    getData: (d) => d.highlights?.schools ?? null,
  },
  {
    id: "narration_forms",
    label: "صيغ الأداء والرواية",
    icon: "📜",
    description: "صيغ التحديث والرواية وأنواعها وأعدادها",
    getData: (d) => d.highlights?.narration_forms ?? null,
  },
  {
    id: "composite_indicators",
    label: "المؤشرات المركّبة",
    icon: "📊",
    description: "المؤشرات الكمية التحليلية للمصنَّف",
    getData: (d) => d.highlights?.composite_indicators ?? null,
  },
  {
    id: "density",
    label: "الكثافة العلمية",
    icon: "🔬",
    description: "توزيع الكثافة العلمية على أقسام المصنَّف",
    getData: (d) => d.distributions?.density ?? null,
  },
  {
    id: "disagreement",
    label: "الخلاف والترجيح",
    icon: "⚖️",
    description: "مواضع الخلاف والترجيح في المصنَّف",
    getData: (d) => d.highlights?.disagreement ?? null,
  },
  {
    id: "limits",
    label: "حدود الدراسة",
    icon: "⚠️",
    description: "ملاحظات منهجية وحدود الكشاف",
    getData: () => null, // handled separately
  },
];

// ── نسخ نص إلى الحافظة ──
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}

// ── مكوّن زر نسخ الصف ──
function CopyRowButton({
  row,
  columns,
  isDark,
}: {
  row: (string | number | null)[];
  columns: string[];
  isDark: boolean;
}) {
  const T = isDark ? D : C;
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      const text = columns.map((col, i) => `${col}: ${row[i] ?? "—"}`).join(" | ");
      const ok = await copyToClipboard(text);
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    },
    [row, columns]
  );
  return (
    <button
      onClick={handleCopy}
      title="نسخ الصف"
      style={{
        padding: "3px 7px",
        borderRadius: 5,
        border: `1px solid ${isDark ? "rgba(42,202,186,0.3)" : "rgba(26,122,110,0.25)"}`,
        background: copied
          ? (isDark ? "rgba(42,202,186,0.18)" : "rgba(26,122,110,0.1)")
          : "transparent",
        color: copied ? T.emerald : T.textLight,
        cursor: "pointer",
        fontSize: 11,
        lineHeight: 1,
        transition: "all 0.15s",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {copied ? "✓ نُسخ" : "نسخ"}
    </button>
  );
}

// ── تطبيع عربي للبحث ──
function normalizeArabic(text: string): string {
  return text
    .replace(/[أإآا]/g, "ا")
    .replace(/[ةه]/g, "ه")
    .replace(/[يى]/g, "ي")
    .replace(/[\u064B-\u065F]/g, "")
    .toLowerCase();
}

// ── مكوّن جدول واحد ──
function DataTable({
  tableData,
  isDark,
}: {
  tableData: TableData;
  isDark: boolean;
}) {
  const T = isDark ? D : C;
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState<number>(-1);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const { _columns: columns, rows } = tableData;

  // فلترة وفرز
  const processed = useMemo(() => {
    let result = rows;

    // بحث
    if (search.trim()) {
      const q = normalizeArabic(search.trim());
      result = result.filter((row) =>
        row.some((cell) => normalizeArabic(String(cell ?? "")).includes(q))
      );
    }

    // فرز
    if (sortCol >= 0) {
      result = [...result].sort((a, b) => {
        const va = a[sortCol] ?? "";
        const vb = b[sortCol] ?? "";
        const na = typeof va === "number" ? va : parseFloat(String(va).replace(/[,،%]/g, "")) || 0;
        const nb = typeof vb === "number" ? vb : parseFloat(String(vb).replace(/[,،%]/g, "")) || 0;
        if (!isNaN(na) && !isNaN(nb)) {
          return sortDir === "asc" ? na - nb : nb - na;
        }
        const sa = String(va);
        const sb = String(vb);
        return sortDir === "asc" ? sa.localeCompare(sb, "ar") : sb.localeCompare(sa, "ar");
      });
    }

    return result;
  }, [rows, search, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(processed.length / PAGE_SIZE));
  const pageRows = processed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // إعادة الصفحة عند تغيير البحث
  useEffect(() => { setPage(1); }, [search, sortCol, sortDir]);

  const handleSort = (colIdx: number) => {
    if (sortCol === colIdx) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(colIdx);
      setSortDir("asc");
    }
  };

  return (
    <div style={{ direction: "rtl" }}>
      {/* شريط البحث */}
      <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
          <span style={{
            position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
            color: T.textLight, fontSize: 14, pointerEvents: "none",
          }}>🔍</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث في الجدول..."
            style={{
              width: "100%",
              padding: "8px 36px 8px 12px",
              borderRadius: 8,
              border: `1.5px solid ${isDark ? T.border : C.creamMid}`,
              background: isDark ? "rgba(255,255,255,0.06)" : "rgba(26,122,110,0.04)",
              color: isDark ? T.textDark : C.textDark,
              fontSize: 13,
              fontFamily: "'Noto Naskh Arabic', serif",
              outline: "none",
              direction: "rtl",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = T.emerald)}
            onBlur={(e) => (e.target.style.borderColor = isDark ? T.border : C.creamMid)}
          />
        </div>
        <span style={{ fontSize: 12, color: T.textLight, whiteSpace: "nowrap" }}>
          {processed.length !== rows.length
            ? `${processed.length} من ${rows.length} نتيجة`
            : `${rows.length} سجل`}
        </span>
      </div>

      {/* الجدول */}
      <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${isDark ? T.border : C.creamMid}` }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "clamp(12px, 2.5vw, 13px)",
          fontFamily: "'Noto Naskh Arabic', serif",
          direction: "rtl",
        }}>
          <thead>
            <tr style={{
              background: isDark
                ? `linear-gradient(135deg, #0D3A36, #0A2A28)`
                : `linear-gradient(135deg, ${C.emeraldDark}, ${C.emerald})`,
            }}>
              {/* عمود النسخ */}
              <th style={{
                padding: "10px 10px",
                width: 52,
                color: "rgba(255,255,255,0.45)",
                fontSize: 11,
                fontWeight: 400,
                borderLeft: "1px solid rgba(255,255,255,0.12)",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}>
                نسخ
              </th>
              {columns.map((col, i) => (
                <th
                  key={i}
                  onClick={() => handleSort(i)}
                  style={{
                    padding: "10px 14px",
                    textAlign: "right",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    userSelect: "none",
                    borderLeft: i < columns.length - 1 ? "1px solid rgba(255,255,255,0.15)" : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                    {col}
                    {sortCol === i ? (
                      <span style={{ fontSize: 10, opacity: 0.9 }}>{sortDir === "asc" ? "↑" : "↓"}</span>
                    ) : (
                      <span style={{ fontSize: 10, opacity: 0.4 }}>↕</span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  style={{
                    padding: "32px",
                    textAlign: "center",
                    color: T.textLight,
                    fontStyle: "italic",
                  }}
                >
                  لا توجد نتائج مطابقة
                </td>
              </tr>
            ) : (
              pageRows.map((row, ri) => (
                <tr
                  key={ri}
                  style={{
                    background: ri % 2 === 0
                      ? (isDark ? "rgba(255,255,255,0.02)" : "rgba(26,122,110,0.02)")
                      : (isDark ? "transparent" : "transparent"),
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = isDark
                      ? "rgba(42,202,186,0.07)"
                      : "rgba(26,122,110,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = ri % 2 === 0
                      ? (isDark ? "rgba(255,255,255,0.02)" : "rgba(26,122,110,0.02)")
                      : "transparent";
                  }}
                >
                  {/* خلية النسخ */}
                  <td style={{
                    padding: "7px 8px",
                    borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(26,122,110,0.08)"}`,
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}>
                    <CopyRowButton row={row} columns={columns} isDark={isDark} />
                  </td>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      style={{
                        padding: "9px 14px",
                        borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(26,122,110,0.08)"}`,
                        borderLeft: ci < row.length - 1 ? `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(26,122,110,0.06)"}` : "none",
                        color: isDark ? T.textDark : C.textDark,
                        maxWidth: 280,
                        wordBreak: "break-word",
                        lineHeight: 1.6,
                      }}
                    >
                      {cell === null || cell === undefined ? (
                        <span style={{ color: T.textLight, fontSize: 11 }}>—</span>
                      ) : (
                        String(cell)
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          marginTop: 12,
          flexWrap: "wrap",
        }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: "5px 12px",
              borderRadius: 6,
              border: `1px solid ${isDark ? T.border : C.creamMid}`,
              background: "transparent",
              color: page === 1 ? T.textLight : T.emerald,
              cursor: page === 1 ? "default" : "pointer",
              fontSize: 13,
              opacity: page === 1 ? 0.4 : 1,
            }}
          >
            ‹ السابق
          </button>

          {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 7) {
              pageNum = i + 1;
            } else if (page <= 4) {
              pageNum = i + 1;
            } else if (page >= totalPages - 3) {
              pageNum = totalPages - 6 + i;
            } else {
              pageNum = page - 3 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  border: `1px solid ${page === pageNum ? T.emerald : (isDark ? T.border : C.creamMid)}`,
                  background: page === pageNum ? T.emerald : "transparent",
                  color: page === pageNum ? "#fff" : (isDark ? T.textMid : C.textMid),
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: page === pageNum ? 700 : 400,
                }}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: "5px 12px",
              borderRadius: 6,
              border: `1px solid ${isDark ? T.border : C.creamMid}`,
              background: "transparent",
              color: page === totalPages ? T.textLight : T.emerald,
              cursor: page === totalPages ? "default" : "pointer",
              fontSize: 13,
              opacity: page === totalPages ? 0.4 : 1,
            }}
          >
            التالي ›
          </button>

          <span style={{ fontSize: 12, color: T.textLight, marginRight: 4 }}>
            صفحة {page} من {totalPages}
          </span>
        </div>
      )}
    </div>
  );
}

// ── مكوّن حدود الدراسة ──
function LimitsTable({ limits, isDark }: { limits: [string, string][]; isDark: boolean }) {
  const T = isDark ? D : C;
  return (
    <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${isDark ? T.border : C.creamMid}` }}>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: 13,
        fontFamily: "'Noto Naskh Arabic', serif",
        direction: "rtl",
      }}>
        <thead>
          <tr style={{
            background: isDark
              ? `linear-gradient(135deg, #0D3A36, #0A2A28)`
              : `linear-gradient(135deg, ${C.emeraldDark}, ${C.emerald})`,
          }}>
            <th style={{ padding: "10px 14px", textAlign: "right", color: "#fff", fontWeight: 700, width: "30%" }}>
              الجانب
            </th>
            <th style={{ padding: "10px 14px", textAlign: "right", color: "#fff", fontWeight: 700 }}>
              التفصيل
            </th>
          </tr>
        </thead>
        <tbody>
          {limits.map(([key, val], i) => (
            <tr
              key={i}
              style={{
                background: i % 2 === 0
                  ? (isDark ? "rgba(255,255,255,0.02)" : "rgba(26,122,110,0.02)")
                  : "transparent",
              }}
            >
              <td style={{
                padding: "10px 14px",
                borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(26,122,110,0.08)"}`,
                color: T.emerald,
                fontWeight: 600,
                verticalAlign: "top",
              }}>
                {key}
              </td>
              <td style={{
                padding: "10px 14px",
                borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(26,122,110,0.08)"}`,
                color: isDark ? T.textDark : C.textDark,
                lineHeight: 1.7,
              }}>
                {val}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── المكوّن الرئيسي ──
export default function DetailedTablesViewer({
  data,
  isDark = false,
}: {
  data: ViewCacheData;
  isDark?: boolean;
}) {
  const T = isDark ? D : C;
  const [activeTab, setActiveTab] = useState<string>("");
  const tabsRef = useRef<HTMLDivElement>(null);

  // تحديد التبويبات المتاحة
  const availableTabs = useMemo(() => {
    return TABS.filter((tab) => {
      if (tab.id === "limits") {
        return Array.isArray(data.limits) && data.limits.length > 0;
      }
      const tableData = tab.getData(data);
      return tableData && tableData.rows && tableData.rows.length > 0;
    });
  }, [data]);

  // تعيين التبويب الافتراضي
  useEffect(() => {
    if (availableTabs.length > 0 && !activeTab) {
      setActiveTab(availableTabs[0].id);
    }
  }, [availableTabs, activeTab]);

  if (availableTabs.length === 0) {
    return (
      <div style={{
        padding: "40px 20px",
        textAlign: "center",
        color: T.textLight,
        fontFamily: "'Noto Naskh Arabic', serif",
        direction: "rtl",
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
        <p style={{ fontSize: 16 }}>لا تتوفر جداول تفصيلية لهذا الكشاف بعد</p>
        <p style={{ fontSize: 13, opacity: 0.7, marginTop: 6 }}>
          سيتم إضافة البيانات التفصيلية عند توفر ملف view_cache.json
        </p>
      </div>
    );
  }

  const activeTabDef = availableTabs.find((t) => t.id === activeTab);
  const activeTableData = activeTabDef?.id === "limits"
    ? null
    : (activeTabDef?.getData(data) ?? null);
  const limitsData = data.limits as [string, string][] | undefined;

  // دالة مساعدة لحساب عدد سجلات كل تبويب
  const getTabCount = (tab: typeof TABS[0]): number => {
    if (tab.id === "limits") {
      return Array.isArray(data.limits) ? data.limits.length : 0;
    }
    const td = tab.getData(data);
    return td?.rows?.length ?? 0;
  };

  return (
    <div style={{ direction: "rtl", fontFamily: "'Noto Naskh Arabic', serif" }}>

      {/* شريط التبويبات */}
      <div
        ref={tabsRef}
        style={{
          display: "flex",
          gap: 4,
          overflowX: "auto",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          paddingBottom: 2,
          marginBottom: 16,
          borderBottom: `2px solid ${isDark ? T.border : C.creamMid}`,
        }}
      >
        {availableTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.description}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "8px 14px",
                borderRadius: "8px 8px 0 0",
                border: isActive
                  ? `1.5px solid ${T.emerald}`
                  : "1.5px solid transparent",
                borderBottom: isActive ? `2px solid ${isDark ? T.cream : C.white}` : "none",
                background: isActive
                  ? (isDark ? "rgba(42,202,186,0.12)" : "rgba(26,122,110,0.08)")
                  : "transparent",
                color: isActive ? T.emerald : T.textLight,
                cursor: "pointer",
                fontSize: "clamp(11px, 2.5vw, 13px)",
                fontFamily: "'Noto Naskh Arabic', serif",
                fontWeight: isActive ? 700 : 400,
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all 0.15s",
                marginBottom: -2,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = isDark
                    ? "rgba(42,202,186,0.06)"
                    : "rgba(26,122,110,0.04)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }
              }}
            >
              <span style={{ fontSize: "clamp(12px, 2.5vw, 14px)" }}>{tab.icon}</span>
              <span>{tab.label}</span>
              {/* عداد السجلات */}
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 20,
                height: 18,
                padding: "0 5px",
                borderRadius: 9,
                background: isActive
                  ? (isDark ? "rgba(42,202,186,0.25)" : "rgba(26,122,110,0.18)")
                  : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"),
                color: isActive ? T.emerald : T.textLight,
                fontSize: 10,
                fontWeight: 700,
                lineHeight: 1,
              }}>
                {getTabCount(tab).toLocaleString("en-US")}
              </span>
            </button>
          );
        })}
      </div>

      {/* وصف التبويب النشط */}
      {activeTabDef && (
        <div style={{
          padding: "8px 14px",
          background: isDark ? "rgba(42,202,186,0.06)" : "rgba(26,122,110,0.05)",
          borderRadius: 8,
          marginBottom: 14,
          fontSize: 13,
          color: T.textMid,
          borderRight: `3px solid ${T.emerald}`,
        }}>
          {activeTabDef.description}
        </div>
      )}

      {/* تنبيه منهجي دائم */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        padding: "10px 14px",
        background: isDark ? "rgba(181,160,90,0.07)" : "rgba(181,160,90,0.09)",
        border: `1px solid ${isDark ? "rgba(181,160,90,0.25)" : "rgba(181,160,90,0.35)"}`,
        borderRadius: 8,
        marginBottom: 16,
        fontSize: "clamp(11px, 2.5vw, 12px)",
        color: isDark ? "#D4C07A" : "#7A6020",
        lineHeight: 1.6,
        direction: "rtl",
      }}>
        <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>⚠️</span>
        <span>
          <strong>تنبيه منهجي:</strong>{" "}
          هذه مؤشرات حضور لا تعني اعتمادًا مباشرًا إلا بعد مراجعة سياقية.
        </span>
      </div>

      {/* محتوى التبويب */}
      {activeTab === "limits" && limitsData ? (
        <LimitsTable limits={limitsData} isDark={isDark} />
      ) : activeTableData ? (
        <DataTable tableData={activeTableData} isDark={isDark} />
      ) : (
        <div style={{ padding: "32px", textAlign: "center", color: T.textLight }}>
          لا تتوفر بيانات لهذا القسم
        </div>
      )}
    </div>
  );
}
