# محوّل مرقوم العام — Marqoom ETL

## نظرة عامة

`marqoom_etl.py` هو المحوّل الرسمي الأولي لمشروع **مرقوم — بوابة الكشافات التراثية الرقمية**.  
يحوّل أي ملف Excel ملتزم ببروتوكول مرقوم إلى ملفين:

| الملف | الغرض |
|-------|--------|
| `view_cache.json` | بيانات العرض السريع في الموقع (View Cache) |
| `validation_report.json` | تقرير التحقق من الامتثال للبروتوكول |

**المراجع الملزمة:**
- [`MARQOOM_SCHEMA.md`](../MARQOOM_SCHEMA.md) — البنية القياسية لملف view_cache.json
- [`MARQOOM_PROTOCOL.md`](../MARQOOM_PROTOCOL.md) — بروتوكول أوراق Excel المقبولة

---

## متطلبات التشغيل

```bash
pip install openpyxl
```

---

## أمر التشغيل الأساسي

```bash
python3 marqoom_etl.py <مسار_ملف_Excel> \
  --book-id <book_id> \
  --title "<اسم الكتاب>" \
  --author "<اسم المؤلف>" \
  --died-hijri <سنة الوفاة هجرياً> \
  --category "<التصنيف>" \
  --output-dir ./output
```

### مثال كامل

```bash
python3 marqoom_etl.py "/path/to/مرقوم_عمدة_القاري_للعيني.xlsx" \
  --book-id marqoom-22 \
  --title "عمدة القاري شرح صحيح البخاري" \
  --author "بدر الدين العيني" \
  --died-hijri 855 \
  --category "حديث" \
  --output-dir ./output
```

### النتيجة

```
output/
└── marqoom-22/
    ├── view_cache.json
    └── validation_report.json
```

---

## المعاملات

| المعامل | الوصف | مثال |
|---------|-------|-------|
| `<مسار_Excel>` | المسار الكامل لملف Excel | `/data/kashaf.xlsx` |
| `--book-id` | معرّف الكشاف في مرقوم | `marqoom-22` |
| `--title` | اسم الكتاب كاملاً | `"عمدة القاري"` |
| `--author` | اسم المؤلف | `"العيني"` |
| `--died-hijri` | سنة الوفاة هجرياً (رقم) | `855` |
| `--category` | التصنيف العلمي | `حديث` / `تفسير` / `فقه` / `عقيدة` |
| `--output-dir` | مجلد الإخراج (اختياري) | `./output` |

---

## هيكل مجلد الإخراج

كل كشاف يُحفظ في مجلد باسم `book_id`:

```
etl/output/
├── marqoom-1/
│   ├── view_cache.json
│   └── validation_report.json
├── marqoom-2/
│   ├── view_cache.json
│   └── validation_report.json
└── ...
```

---

## تفسير تقرير التحقق

```json
{
  "book_id": "marqoom-22",
  "compliance_score": 95,
  "core_sheets_found": ["الأغراض", "الموارد", "الأعلام"],
  "core_sheets_missing": [],
  "optional_modules_found": ["السور", "الأجزاء"],
  "optional_modules_missing": ["الأبواب"],
  "warnings": [],
  "errors": []
}
```

| الحقل | المعنى |
|-------|--------|
| `compliance_score` | درجة الامتثال (0-100%) |
| `core_sheets_missing` | أوراق أساسية مفقودة — تستوجب المراجعة |
| `optional_modules_missing` | وحدات اختيارية غائبة — لا تُوقف التحويل |
| `warnings` | تحذيرات بيانات (أعمدة ناقصة، قيم غير متوقعة) |
| `errors` | أخطاء تمنع التحويل |

---

## سير العمل الكامل لمرقوم

```
Excel (المصدر الوحيد)
    ↓
python3 marqoom_etl.py ...
    ↓
etl/output/<book_id>/
    ├── view_cache.json    ← يُرفع على CDN ويُعرض في الموقع
    └── validation_report.json ← للمراجعة الداخلية
```

---

## الكشافات المُختبرة

| book_id | الكتاب | درجة الامتثال |
|---------|--------|---------------|
| marqoom-test1 | فيض القدير للمناوي | 100% |
| marqoom-test2 | الأنساب للسمعاني | 100% |
| marqoom-test3 | إكمال المعلم للقاضي عياض | 100% |
| marqoom-test4 | البداية والنهاية لابن كثير | 100% |
| marqoom-test5 | طبقات الشافعية الكبرى للسبكي | 100% |
| marqoom-test6 | عمدة القاري للعيني | 100% |

---

*آخر تحديث: 1446هـ / 2025م — مرقوم v1.0*
