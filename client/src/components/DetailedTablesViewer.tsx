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

// بنية v2.1 الجديدة (protocol_version: "2.1")
type ViewCacheV21 = {
  schema?: { protocol_version?: string };
  metadata?: Record<string, unknown>;
  stats?: Record<string, unknown>;
  facets?: {
    domains?: { name: string; count: number }[];
    levels?: { name: string; count: number }[];
    genres?: { name: string; count: number }[];
    resources?: { type: string; count: number }[];
    [key: string]: unknown;
  };
  views?: {
    units?: Record<string, unknown>[];
    resources?: Record<string, unknown>[];
    [key: string]: unknown;
  };
};

type ViewCacheData = ViewCacheV21 & {
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

// ── تحويل مصفوفة كائنات إلى TableData ──
function objectArrayToTableData(arr: Record<string, unknown>[]): TableData | null {
  if (!arr || arr.length === 0) return null;
  const columns = Object.keys(arr[0]);
  const rows = arr.map(obj => columns.map(col => {
    const val = obj[col];
    if (val === null || val === undefined) return null;
    return typeof val === 'object' ? JSON.stringify(val) : (val as string | number);
  }));
  return { _columns: columns, rows };
}

// ── تحويل facets إلى TableData ──
function facetToTableData(arr: { name?: string; type?: string; count: number }[]): TableData | null {
  if (!arr || arr.length === 0) return null;
  const hasName = arr[0].name !== undefined;
  const labelKey = hasName ? 'name' : 'type';
  const columns = [hasName ? 'المجال' : 'النوع', 'العدد'];
  const rows = arr.map(item => [
    String(item[labelKey as keyof typeof item] ?? ''),
    Number(item.count) || 0,
  ] as (string | number | null)[]);
  return { _columns: columns, rows };
}

// ── كشف هل البيانات v2.1 أو v2.2 ──
function isV21(d: ViewCacheData): boolean {
  const raw = d as Record<string, unknown>;
  // v2.2: protocol_version كمفتاح رئيسي (sections + resources + book)
  if (raw.protocol_version && raw.sections && raw.book) return true;
  // الكشف بوجود views أو facets كمفاتيح رئيسية
  if (raw.views && typeof raw.views === 'object') return true;
  if (raw.facets && typeof raw.facets === 'object') return true;
  // أو بوجود schema.protocol_version
  const schema = raw.schema;
  if (schema && typeof schema === 'object') {
    const sv = (schema as Record<string, unknown>).protocol_version;
    if (sv) return true;
  }
  return false;
}

// ── استخراج التبويبات من v2.2 ──
function getV22Tabs(d: ViewCacheData): { id: string; label: string; icon: string; description: string; tableData: TableData }[] {
  const raw = d as Record<string, unknown>;
  const tabs: { id: string; label: string; icon: string; description: string; tableData: TableData }[] = [];

  // ── مساعدات: استخراج قيمة من حقول متعددة الأسماء ──
  const num = (obj: Record<string, unknown>, ...keys: string[]) => {
    for (const k of keys) { const v = obj[k]; if (v !== undefined && v !== null) return Number(v) || 0; }
    return 0;
  };
  const str = (obj: Record<string, unknown>, ...keys: string[]) => {
    for (const k of keys) { const v = obj[k]; if (v !== undefined && v !== null) return String(v); }
    return '';
  };
  // استخراج أول مصفوفة كائنات من قائمة مفاتيح
  const getArr = (obj: Record<string, unknown> | undefined, ...keys: string[]): Record<string, unknown>[] | undefined => {
    if (!obj) return undefined;
    for (const k of keys) {
      const v = obj[k];
      if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'object') return v as Record<string, unknown>[];
    }
    return undefined;
  };

  // السور (sections) — بنية التفسير
  const sections = raw.sections as Record<string, unknown>[] | undefined;
  if (Array.isArray(sections) && sections.length > 0 && sections[0].surah_no !== undefined) {
    const rows = sections.map((s) => [
      Number(s.surah_no) || 0,
      String(s.title || ''),
      Number(s.internal_units) || 0,
      Number(s.approx_words) || 0,
    ] as (string | number | null)[]);
    tabs.push({
      id: 'v22_surahs', label: 'توزيع السور', icon: '📖',
      description: 'السور الـ 114 مع عدد الوحدات والكلمات',
      tableData: { _columns: ['رقم', 'السورة', 'وحدات', 'كلمات'], rows },
    });
  }

  // مدخلات الفهرس (sections) — بنية الكتب الحديثية والفقهية
  if (Array.isArray(sections) && sections.length > 0 && sections[0]['العنوان'] !== undefined) {
    const rows = sections.map((s) => [
      str(s, 'الترتيب', 'num'),
      str(s, 'نوع المدخل', 'type'),
      str(s, 'العنوان', 'title'),
      str(s, 'بداية الصفحة الرقمية', 'page'),
      str(s, 'كلمات المقطع التقريبية', 'words'),
    ] as (string | number | null)[]);
    tabs.push({
      id: 'v22_entries', label: 'مدخلات الفهرس', icon: '📋',
      description: 'أقسام الكتاب ومدخلاته الرئيسية',
      tableData: { _columns: ['#', 'النوع', 'العنوان', 'الصفحة', 'الكلمات'], rows },
    });
  }

  // الأغراض (purpose_distribution) — يدعم الحقول العربية والإنجليزية
  const summary = raw.summary as Record<string, unknown> | undefined;
  const purposeDist = summary?.purpose_distribution as Record<string, unknown>[] | undefined;
  if (Array.isArray(purposeDist) && purposeDist.length > 0) {
    const rows = purposeDist.map((p) => [
      str(p, 'الغرض', 'purpose'),
      num(p, 'العدد', 'الحضور', 'count'),
      num(p, 'النسبة %', 'النسبة من مجموع العبارات المنهجية %', 'percentage'),
    ] as (string | number | null)[]);
    tabs.push({
      id: 'v22_purposes', label: 'توزيع الأغراض', icon: '🎯',
      description: 'توزيع الأغراض المنهجية ونسبها من مجموع العبارات',
      tableData: { _columns: ['الغرض', 'العدد', 'النسبة%'], rows },
    });
  }

  // المؤشرات التحليلية — يدعم composite_indicators وindicators
  const indicators = (summary?.composite_indicators ?? summary?.indicators) as Record<string, unknown>[] | undefined;
  if (Array.isArray(indicators) && indicators.length > 0) {
    const rows = indicators.map((ind) => [
      str(ind, 'المؤشر', 'name'),
      num(ind, 'القيمة', 'البسط', 'count'),
      num(ind, 'أساس الحساب', 'المقام', 'total'),
      num(ind, 'النسبة %', 'percentage'),
      str(ind, 'الصيغة', 'درجة الثقة', 'confidence'),
    ] as (string | number | null)[]);
    tabs.push({
      id: 'v22_indicators', label: 'المؤشرات التحليلية', icon: '📊',
      description: 'مؤشرات منهجية مركّبة تقيس أبعاد الكتاب',
      tableData: { _columns: ['المؤشر', 'القيمة', 'الأساس', 'النسبة%', 'الصيغة'], rows },
    });
  }

  const resources = raw.resources as Record<string, unknown> | undefined;

  // الأعلام — يدعم figures وpersons وpeople
  const figures = getArr(resources, 'figures', 'persons', 'people');
  if (figures && figures.length > 0) {
    const rows = figures.map((f) => [
      str(f, 'العلم', 'الشخصية', 'name', 'الشخص'),
      str(f, 'المدرسة/الطبقة', 'المجال', 'category', 'التصنيف'),
      num(f, 'الحضور', 'العدد', 'count'),
      str(f, 'النسبة من مجموع الأعلام في هذا الكتاب %', 'النسبة %', 'percentage') || '',
    ] as (string | number | null)[]);
    tabs.push({
      id: 'v22_figures', label: 'الأعلام', icon: '👥',
      description: 'أبرز الأعلام المذكورين وتكرارهم',
      tableData: { _columns: ['العلم', 'المدرسة/المجال', 'الحضور', 'النسبة%'], rows },
    });
  }

  // المصادر والكتب — يدعم books وexplicit_books وtop_books وhuman_sources
  const books = getArr(resources, 'books', 'explicit_books', 'top_books');
  if (books && books.length > 0) {
    const rows = books.map((b) => [
      str(b, 'الكتاب/المصدر المصرح به', 'name', 'الكتاب', 'المصدر'),
      str(b, 'المجال', 'category', 'التصنيف'),
      num(b, 'الحضور', 'العدد', 'count'),
      num(b, 'النسبة من مجموع إحالات الكتب في هذا الكتاب %', 'النسبة %', 'percentage'),
    ] as (string | number | null)[]);
    tabs.push({
      id: 'v22_books', label: 'المصادر المُحال إليها', icon: '📚',
      description: 'الكتب والمصادر المصرح بها وتكرارها',
      tableData: { _columns: ['المصدر', 'المجال', 'الحضور', 'النسبة%'], rows },
    });
  }

  // المصادر البشرية (human_sources) — منفصلة عن الكتب
  const humanSources = getArr(resources, 'human_sources');
  if (humanSources && humanSources.length > 0) {
    const rows = humanSources.map((h) => [
      str(h, 'العلم/المصدر البشري', 'name', 'الشخص'),
      str(h, 'المجال', 'category'),
      num(h, 'الحضور', 'العدد', 'count'),
      num(h, 'النسبة %', 'percentage'),
    ] as (string | number | null)[]);
    tabs.push({
      id: 'v22_human_sources', label: 'المصادر البشرية', icon: '👤',
      description: 'العلماء والشخصيات المصرح بهم بالاسم',
      tableData: { _columns: ['العلم', 'المجال', 'الحضور', 'النسبة%'], rows },
    });
  }

  // المدارس والاتجاهات — يدعم schools وschools_and_trends وschools_trends
  const schools = getArr(resources, 'schools', 'schools_and_trends', 'schools_trends');
  if (schools && schools.length > 0) {
    const rows = schools.map((s) => [
      str(s, 'المدرسة/الاتجاه', 'name', 'المدرسة', 'الاتجاه'),
      str(s, 'المجال', 'category'),
      num(s, 'الحضور', 'العدد', 'count'),
      num(s, 'النسبة من مجموع المدارس والاتجاهات في هذا الكتاب %', 'النسبة %', 'percentage'),
    ] as (string | number | null)[]);
    tabs.push({
      id: 'v22_schools', label: 'المدارس والاتجاهات', icon: '🏫',
      description: 'المدارس الفقهية والاتجاهات العلمية المذكورة',
      tableData: { _columns: ['المدرسة/الاتجاه', 'المجال', 'الحضور', 'النسبة%'], rows },
    });
  }

  // توزيع المجالات — يدعم by_field وfields وdomains
  const byField = getArr(resources, 'by_field', 'fields', 'domains');
  if (byField && byField.length > 0) {
    const rows = byField.map((f) => [
      str(f, 'المجال', 'field', 'domain', 'name'),
      num(f, 'العدد', 'عدد الحضور', 'count'),
      num(f, 'النسبة %', 'النسبة من مجموع الموارد العامة في هذا الكتاب %', 'percentage'),
    ] as (string | number | null)[]);
    tabs.push({
      id: 'v22_byfield', label: 'توزيع المجالات', icon: '🗂️',
      description: 'توزيع الموارد حسب المجال العلمي',
      tableData: { _columns: ['المجال', 'العدد', 'النسبة%'], rows },
    });
  }

  // أقسام الكتاب (sections) — بنية الجامع لعلوم الإمام أحمد (name/title + words + text_units)
  if (Array.isArray(sections) && sections.length > 0 && sections[0].surah_no === undefined && sections[0]['العنوان'] === undefined && (sections[0].title !== undefined || sections[0].name !== undefined)) {
    const rows = sections.map((s, i) => [
      i + 1,
      str(s, 'title', 'name'),
      num(s, 'words'),
      num(s, 'text_units'),
    ] as (string | number | null)[]);
    tabs.push({
      id: 'v22_sections', label: 'أقسام الكتاب', icon: '📂',
      description: 'أقسام الموسوعة مع حجم كل قسم بالكلمات والوحدات',
      tableData: { _columns: ['#', 'القسم', 'الكلمات', 'الوحدات'], rows },
    });
  }

  // المصطلحات (terms) — يدعم الحقول العربية والإنجليزية
  const terms = raw.terms as Record<string, unknown>[] | undefined;
  if (Array.isArray(terms) && terms.length > 0) {
    const rows = terms.map((t) => [
      str(t, 'المصطلح/العبارة', 'العبارة', 'term'),
      str(t, 'التصنيف', 'المجموعة', 'domain'),
      num(t, 'العدد', 'الحضور', 'count'),
      num(t, 'النسبة من مجموع العبارات المنهجية', 'percentage'),
    ] as (string | number | null)[]);
    tabs.push({
      id: 'v22_terms', label: 'المصطلحات المنهجية', icon: '📝',
      description: 'أبرز المصطلحات المنهجية وأغراضها وتكرارها',
      tableData: { _columns: ['المصطلح/العبارة', 'التصنيف', 'العدد', 'النسبة%'], rows },
    });
  }

  // المجموعات المنهجية (methodological_subsets) — خلاف/ترجيح/نقد/إحالة
  const methodSubsets = raw.methodological_subsets as Record<string, Record<string, unknown>[]> | undefined;
  if (methodSubsets && typeof methodSubsets === 'object') {
    const subsetLabels: Record<string, string> = {
      khilaf: 'مصطلحات الخلاف',
      tarjih: 'مصطلحات الترجيح',
      criticism: 'مصطلحات النقد والعلل',
      cross_references: 'مصطلحات الإحالة الداخلية',
    };
    for (const [key, label] of Object.entries(subsetLabels)) {
      const arr = methodSubsets[key];
      if (Array.isArray(arr) && arr.length > 0) {
        const rows = arr.map((item) => [
          str(item, 'المصطلح/العبارة', 'term'),
          str(item, 'التصنيف', 'category'),
          num(item, 'العدد', 'count'),
          num(item, 'النسبة من مجموع عبارات هذا الغرض %', 'percentage'),
        ] as (string | number | null)[]);
        tabs.push({
          id: `v22_subset_${key}`, label, icon: key === 'khilaf' ? '⚖️' : key === 'tarjih' ? '🏆' : key === 'criticism' ? '🔍' : '🔗',
          description: `أبرز مصطلحات ${label} وتكرارها`,
          tableData: { _columns: ['المصطلح/العبارة', 'التصنيف', 'العدد', 'النسبة%'], rows },
        });
      }
    }
  }

  // صيغ الأداء والرواية (narration_forms) — من summary أو resources
  const narrationForms = getArr(summary as Record<string, unknown> | undefined, 'narration_forms')
    ?? getArr(resources, 'narration_forms');
  if (narrationForms && narrationForms.length > 0) {
    const rows = narrationForms.map((n) => [
      str(n, 'صيغة الأداء', 'الصيغة', 'name', 'form'),
      str(n, 'التصنيف', 'category'),
      num(n, 'الحضور', 'العدد', 'count'),
      num(n, 'النسبة %', 'percentage'),
    ] as (string | number | null)[]);
    tabs.push({
      id: 'v22_narration', label: 'صيغ الأداء والرواية', icon: '📜',
      description: 'صيغ التحديث والرواية وأنواعها وأعدادها',
      tableData: { _columns: ['الصيغة', 'التصنيف', 'الحضور', 'النسبة%'], rows },
    });
  }

  // الكثافة العلمية (density) — من distributions أو summary
  const densityArr = getArr(raw.distributions as Record<string, unknown> | undefined, 'density')
    ?? getArr(summary as Record<string, unknown> | undefined, 'density');
  if (densityArr && densityArr.length > 0) {
    const rows = densityArr.map((d2) => [
      str(d2, 'القسم', 'الباب', 'section', 'name'),
      num(d2, 'الكثافة', 'الكثافة العلمية', 'density'),
      num(d2, 'عدد العبارات', 'count'),
      num(d2, 'عدد الصفحات', 'pages'),
    ] as (string | number | null)[]);
    tabs.push({
      id: 'v22_density', label: 'الكثافة العلمية', icon: '🔬',
      description: 'توزيع الكثافة العلمية على أقسام المصنّف',
      tableData: { _columns: ['القسم', 'الكثافة', 'العبارات', 'الصفحات'], rows },
    });
  }

  // القارئ السريع (quick_reader) — من raw.quick_reader أو summary
  const quickReader = getArr(raw, 'quick_reader')
    ?? getArr(summary as Record<string, unknown> | undefined, 'quick_reader');
  if (quickReader && quickReader.length > 0) {
    const rows = quickReader.map((q) => [
      str(q, 'المحور', 'الموضوع', 'topic', 'name'),
      str(q, 'الخلاصة', 'الوصف', 'summary', 'description'),
      num(q, 'العدد', 'count'),
    ] as (string | number | null)[]);
    tabs.push({
      id: 'v22_quick_reader', label: 'القارئ السريع', icon: '⚡',
      description: 'محاور سريعة للباحث المتعجل',
      tableData: { _columns: ['المحور', 'الخلاصة', 'العدد'], rows },
    });
  }

  // الملخص التنفيذي (executive_summary) — من raw.executive_summary أو summary
  const execSummary = getArr(raw, 'executive_summary')
    ?? getArr(summary as Record<string, unknown> | undefined, 'executive_summary');
  if (execSummary && execSummary.length > 0) {
    const rows = execSummary.map((e) => [
      str(e, 'المحور', 'البند', 'item', 'name'),
      str(e, 'القيمة', 'الوصف', 'value', 'description'),
    ] as (string | number | null)[]);
    tabs.push({
      id: 'v22_exec_summary', label: 'الملخص التنفيذي', icon: '📋',
      description: 'أبرز النتائج والمحاور الكبرى للكشاف',
      tableData: { _columns: ['المحور', 'القيمة'], rows },
    });
  }

  // النتائج القابلة للنشر (publishable_results) — من raw
  const publishable = getArr(raw, 'publishable_results', 'results');
  if (publishable && publishable.length > 0) {
    const rows = publishable.map((p) => [
      str(p, 'النتيجة', 'البند', 'result', 'name'),
      str(p, 'التفصيل', 'الوصف', 'detail', 'description'),
      str(p, 'القيمة', 'value'),
    ] as (string | number | null)[]);
    tabs.push({
      id: 'v22_publishable', label: 'نتائج قابلة للنشر', icon: '🌟',
      description: 'أبرز النتائج العلمية القابلة للنشر والاستشهاد',
      tableData: { _columns: ['النتيجة', 'التفصيل', 'القيمة'], rows },
    });
  }

  // حدود الدراسة (limits) — من raw.limits (array of [string, string])
  const limits = raw.limits as [string, string][] | undefined;
  if (Array.isArray(limits) && limits.length > 0 && Array.isArray(limits[0])) {
    const rows = limits.map((l) => [String(l[0] || ''), String(l[1] || '')] as (string | number | null)[]);
    tabs.push({
      id: 'v22_limits', label: 'حدود الدراسة', icon: '⚠️',
      description: 'ملاحظات منهجية وحدود الكشاف',
      tableData: { _columns: ['الحد', 'التفصيل'], rows },
    });
  }

  return tabs;
}

// ── استخراج التبويبات من v2.1 ──
function getV21Tabs(d: ViewCacheData): { id: string; label: string; icon: string; description: string; tableData: TableData }[] {
  const v = d as ViewCacheV21;
  const tabs: { id: string; label: string; icon: string; description: string; tableData: TableData }[] = [];

  // وحدات الكشاف
  const units = v.views?.units;
  if (Array.isArray(units) && units.length > 0) {
    const td = objectArrayToTableData(units);
    if (td) tabs.push({ id: 'v21_units', label: 'وحدات الكشاف', icon: '📋', description: 'جميع الوحدات التحليلية مع مجالاتها وموضعها وخلاصة مرقوم', tableData: td });
  }

  // الموارد
  const resources = v.views?.resources;
  if (Array.isArray(resources) && resources.length > 0) {
    const td = objectArrayToTableData(resources);
    if (td) tabs.push({ id: 'v21_resources', label: 'الموارد والأعلام', icon: '📚', description: 'الموارد والأعلام المرصودة مع تكرارها وتصنيفها', tableData: td });
  }

  // توزيع المجالات
  const domains = v.facets?.domains;
  if (Array.isArray(domains) && domains.length > 0) {
    const td = facetToTableData(domains as { name: string; count: number }[]);
    if (td) tabs.push({ id: 'v21_domains', label: 'توزيع المجالات', icon: '🎯', description: 'توزيع الوحدات على المجالات الموضوعية الرئيسية', tableData: td });
  }

  // توزيع الأجناس المعرفية
  const genres = v.facets?.genres;
  if (Array.isArray(genres) && genres.length > 0) {
    const td = facetToTableData(genres as { name: string; count: number }[]);
    if (td) tabs.push({ id: 'v21_genres', label: 'الأجناس المعرفية', icon: '🏛️', description: 'توزيع الوحدات على الأجناس المعرفية (خطبة، مادة أدبية، باب...)', tableData: td });
  }

  // توزيع المستويات
  const levels = v.facets?.levels;
  if (Array.isArray(levels) && levels.length > 0) {
    const td = facetToTableData(levels as { name: string; count: number }[]);
    if (td) tabs.push({ id: 'v21_levels', label: 'مستويات البنية', icon: '🔬', description: 'توزيع الوحدات على مستويات البنية (جذر، باب، وحدة فرعية...)', tableData: td });
  }

  // توزيع أنواع الموارد
  const resTypes = v.facets?.resources;
  if (Array.isArray(resTypes) && resTypes.length > 0) {
    const td = facetToTableData(resTypes as { type: string; count: number }[]);
    if (td) tabs.push({ id: 'v21_res_types', label: 'أنواع الموارد', icon: '📊', description: 'توزيع الموارد على أنواعها (أعلام، كتب، مدارس...)', tableData: td });
  }

  return tabs;
}

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
                      {cell === null || cell === undefined || cell === "" || cell === "0" || cell === 0 ? (
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

  // كشف schema
  const isNewSchema = useMemo(() => isV21(data), [data]);
  const raw = data as Record<string, unknown>;
  const isV22 = useMemo(() => !!(raw.protocol_version && raw.sections && raw.book), [data]);
  const v21Tabs = useMemo(() => {
    if (!isNewSchema) return [];
    if (isV22) return getV22Tabs(data);
    return getV21Tabs(data);
  }, [data, isNewSchema, isV22]);

  // تحديد التبويبات المتاحة (v1 أو v2.1 أو v2.2)
  const availableTabs = useMemo(() => {
    if (isNewSchema) {
      return v21Tabs.map(t => ({
        id: t.id,
        label: t.label,
        icon: t.icon,
        description: t.description,
        getData: () => null,
      }));
    }
    // v1: المنطق القديم
    return TABS.filter((tab) => {
      if (tab.id === "limits") {
        return Array.isArray(data.limits) && data.limits.length > 0;
      }
      const tableData = tab.getData(data);
      return tableData && tableData.rows && tableData.rows.length > 0;
    });
  }, [data, isNewSchema, v21Tabs]);

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

  // استخراج بيانات التبويب النشط
  const getActiveTableData = (): TableData | null => {
    if (isNewSchema) {
      const v21Tab = v21Tabs.find(t => t.id === activeTab);
      return v21Tab?.tableData ?? null;
    }
    const activeTabDef = TABS.find(t => t.id === activeTab);
    if (!activeTabDef || activeTabDef.id === 'limits') return null;
    return activeTabDef.getData(data);
  };

  const activeTabDef = availableTabs.find((t) => t.id === activeTab);
  const activeTableData = getActiveTableData();
  const limitsData = data.limits as [string, string][] | undefined;

  // دالة مساعدة لحساب عدد سجلات كل تبويب
  const getTabCount = (tabId: string): number => {
    if (isNewSchema) {
      const v21Tab = v21Tabs.find(t => t.id === tabId);
      return v21Tab?.tableData?.rows?.length ?? 0;
    }
    if (tabId === "limits") {
      return Array.isArray(data.limits) ? data.limits.length : 0;
    }
    const tabDef = TABS.find(t => t.id === tabId);
    if (!tabDef) return 0;
    const td = tabDef.getData(data);
    return td?.rows?.length ?? 0;
  };

  return (
    <div style={{ direction: "rtl", fontFamily: "'Noto Naskh Arabic', serif" }}>

      {/* شريط التبويبات */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        {/* سهم التمرير يمين */}
        <button
          onClick={() => { if (tabsRef.current) tabsRef.current.scrollBy({ left: -120, behavior: "smooth" }); }}
          style={{
            position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
            zIndex: 2, background: isDark ? "rgba(10,42,40,0.95)" : "rgba(255,255,255,0.95)",
            border: `1px solid ${isDark ? T.border : C.creamMid}`,
            borderRadius: "50%", width: 28, height: 28, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, color: T.emerald, boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            padding: 0, lineHeight: 1,
          }}
          aria-label="تمرير يمين"
        >›</button>
        {/* سهم التمرير يسار */}
        <button
          onClick={() => { if (tabsRef.current) tabsRef.current.scrollBy({ left: 120, behavior: "smooth" }); }}
          style={{
            position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
            zIndex: 2, background: isDark ? "rgba(10,42,40,0.95)" : "rgba(255,255,255,0.95)",
            border: `1px solid ${isDark ? T.border : C.creamMid}`,
            borderRadius: "50%", width: 28, height: 28, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, color: T.emerald, boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            padding: 0, lineHeight: 1,
          }}
          aria-label="تمرير يسار"
        >‹</button>
        <div
          ref={tabsRef}
          style={{
            display: "flex",
            gap: 4,
            overflowX: "auto",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            paddingBottom: 2,
            paddingLeft: 36,
            paddingRight: 36,
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
                {getTabCount(tab.id).toLocaleString("en-US")}
              </span>
            </button>
            );
          })}
        </div>
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
      {!isNewSchema && activeTab === "limits" && limitsData ? (
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
