# MARQOOM_SCHEMA — البنية القياسية لملفات `view_cache.json`

> **مرقوم — بوابة الكشافات التراثية الرقمية**
> الإصدار: 1.0.0 | تاريخ الاعتماد: 2025م / 1446هـ

---

## 1. الغرض من `view_cache.json`

ملف `view_cache.json` هو **ملف عرض مؤقت (View Cache)** يُولَّد آلياً من ملف Excel الأصلي، ويُستخدم حصراً لتغذية العارض التفاعلي في موقع مرقوم بأسرع وقت ممكن.

**ليس** مصدراً مستقلاً للبيانات، ولا يُعتمد عليه في أي عمليات تحليلية أو بحثية.

---

## 2. مبادئ البنية

| المبدأ | التفصيل |
|--------|---------|
| **Excel هو المصدر الوحيد** | جميع البيانات تُستخرج من ملف Excel الأصلي المحفوظ في التخزين الخاص |
| **JSON للعرض فقط** | يُولَّد آلياً عند كل تحديث لملف Excel، ولا يُعدَّل يدوياً |
| **قاعدة البيانات هي المرجع الدائم** | بيانات Excel تُحوَّل إلى قاعدة بيانات للبحث المتقدم، وJSON مشتق منها للعرض السريع |
| **لا حذف للمفاتيح** | إذا لم تتوفر قيمة، تُوضع `null` — لا يُحذف المفتاح |
| **أرقام إنجليزية دائماً** | جميع الأرقام بالصيغة الإنجليزية (0-9) بدون استثناء |
| **صلاحية JSON** | الملف يجب أن يجتاز `JSON.parse()` بدون أخطاء |

---

## 3. تسمية `book_id`

```
book_id = "marqoom-{رقم الكشاف}"
```

**أمثلة:**

| الكشاف | book_id |
|--------|---------|
| كشاف فتح الباري (الأول) | `marqoom-1` |
| كشاف البحر المحيط (الحادي والستون) | `marqoom-61` |
| كشاف الزيادة والإحسان (السبعون) | `marqoom-70` |

---

## 4. البنية القياسية الكاملة

```json
{
  "_meta": {
    "schema_version": "1.0.0",
    "book_id": "marqoom-XX",
    "generated_at": "2025-11-15T10:30:00Z",
    "source": "excel",
    "excel_sha256": "تجزئة SHA256 لملف Excel المصدر",
    "generator": "marqoom-etl/1.0"
  },
  "book": {
    "title": "اسم الكتاب كاملاً",
    "author": "اسم المؤلف",
    "died_hijri": 000,
    "category": "تفسير",
    "book_id": "marqoom-XX"
  },
  "summary": {
    "pages": 0,
    "parts": 0,
    "words_approx": 0,
    "chars": 0,
    "surahs_detected": null
  },
  "highlights": {
    "top_purposes": {
      "_columns": ["label", "count", "pct_total", "pages_count", "pct_pages", "terms"],
      "rows": []
    },
    "top_resources": {
      "_columns": ["label", "count", "pct_total", "pages_count", "pct_pages", "terms", "note"],
      "rows": []
    },
    "top_books": {
      "_columns": ["title", "category", "author", "count", "pct", "part_first", "part_last", "sample_text"],
      "rows": []
    },
    "top_people": {
      "_columns": ["name", "role", "count", "pct", "part_first", "part_last", "sample_text"],
      "rows": []
    },
    "top_terms": {
      "_columns": ["term", "purpose", "count", "note"],
      "rows": []
    }
  },
  "distributions": {
    "surah": {
      "_columns": ["number", "name", "part_start", "page_start", "part_end", "page_end", "ayah_count", "chars", "chars_per_ayah"],
      "rows": []
    },
    "parts": {
      "_columns": ["part", "pages", "chars", "pct"],
      "rows": []
    }
  },
  "limits": [
    ["مصدر النص", "..."],
    ["نطاق التحليل", "..."],
    ["طريقة العد", "..."],
    ["طبيعة النسب", "..."],
    ["مستوى الثقة العام", "..."],
    ["ما يحتاج مراجعة", "..."]
  ]
}
```

---

## 5. قواعد `_columns` و`rows`

كل جدول داخل `highlights` و`distributions` يجب أن يحتوي على:

- **`_columns`**: مصفوفة بأسماء الأعمدة بالترتيب — إلزامية دائماً
- **`rows`**: مصفوفة من المصفوفات، كل عنصر فيها يقابل عموداً في `_columns`

**مثال:**
```json
"top_purposes": {
  "_columns": ["label", "count", "pct_total", "pages_count", "pct_pages", "terms"],
  "rows": [
    ["تفسير وبيان المعنى", 67357, 48.54, 6180, 99.5, "تفسير + تأويل + معنى"],
    ["النحو والإعراب",     26421, 19.04, 5435, 87.51, "إعراب + النحو + العامل"]
  ]
}
```

---

## 6. ترتيب الأعمدة المعتمد

### `top_purposes`
```
label | count | pct_total | pages_count | pct_pages | terms
```

### `top_resources`
```
label | count | pct_total | pages_count | pct_pages | terms | note
```

### `top_books`
```
title | category | author | count | pct | part_first | part_last | sample_text
```

### `top_people`
```
name | role | count | pct | part_first | part_last | sample_text
```

### `top_terms`
```
term | purpose | count | note
```

### `distributions.surah`
```
number | name | part_start | page_start | part_end | page_end | ayah_count | chars | chars_per_ayah
```

### `distributions.parts`
```
part | pages | chars | pct
```

---

## 7. القيم المفقودة

| الحالة | القيمة |
|--------|--------|
| حقل غير موجود في Excel | `null` |
| حقل موجود لكن فارغ | `null` |
| مصفوفة فارغة | `[]` |
| لا تُحذف المفاتيح أبداً | — |

---

## 8. قاعدة إصدار البنية (Versioning)

```
schema_version: "MAJOR.MINOR.PATCH"
```

| النوع | متى يتغير | التأثير |
|-------|-----------|---------|
| **MAJOR** | حذف مفتاح أو تغيير نوعه | يكسر التوافق — يستلزم تحديث العارض |
| **MINOR** | إضافة مفتاح جديد | متوافق مع الإصدارات القديمة |
| **PATCH** | تصحيح بيانات بدون تغيير البنية | لا يؤثر على العارض |

---

## 9. التحقق من صلاحية الملف

قبل رفع أي ملف `view_cache.json`، يجب التحقق من:

1. **صلاحية JSON:** `JSON.parse(content)` لا يُعطي خطأ
2. **وجود `_meta`:** يحتوي على `schema_version` و`book_id` و`generated_at`
3. **تطابق `book_id`:** القيمة في `_meta.book_id` = القيمة في `book.book_id`
4. **وجود `_columns`:** كل جدول في `highlights` و`distributions` يحتوي على `_columns`
5. **تطابق الأعمدة:** طول كل صف في `rows` = طول `_columns`

---

## 10. مثال تطبيقي مختصر

ملف `view_cache.json` لكشاف **البحر المحيط لأبي حيان (marqoom-61)**:

```json
{
  "_meta": {
    "schema_version": "1.0.0",
    "book_id": "marqoom-61",
    "generated_at": "2025-11-15T10:30:00Z",
    "source": "excel",
    "excel_sha256": "a3f9c2d1e8b7...",
    "generator": "marqoom-etl/1.0"
  },
  "book": {
    "title": "البحر المحيط في التفسير",
    "author": "أبو حيان الأندلسي",
    "died_hijri": 745,
    "category": "تفسير",
    "book_id": "marqoom-61"
  },
  "summary": {
    "pages": 6211,
    "parts": 10,
    "words_approx": 2114540,
    "chars": 18852397,
    "surahs_detected": 114
  },
  "highlights": {
    "top_purposes": {
      "_columns": ["label", "count", "pct_total", "pages_count", "pct_pages", "terms"],
      "rows": [
        ["تفسير وبيان المعنى", 67357, 48.54, 6180, 99.5, "تفسير + تأويل + معنى + أي + المراد"],
        ["النحو والإعراب", 26421, 19.04, 5435, 87.51, "إعراب + النحو + العامل + مبتدأ + خبر"]
      ]
    },
    "top_resources": {
      "_columns": ["label", "count", "pct_total", "pages_count", "pct_pages", "terms", "note"],
      "rows": [
        ["القراءات", 20168, 48.54, 4456, 71.74, "قرأ + قراءة + القراءات + الجمهور", "مؤشر قاموسي مركب"]
      ]
    },
    "top_books": {
      "_columns": ["title", "category", "author", "count", "pct", "part_first", "part_last", "sample_text"],
      "rows": [
        ["السبعة", "قراءات", "ابن مجاهد", 549, 2.6, 1, 4, null]
      ]
    },
    "top_people": {
      "_columns": ["name", "role", "count", "pct", "part_first", "part_last", "sample_text"],
      "rows": [
        ["الزمخشري", "تفسير/بلاغة", 4561, 21.57, 1, 19, null]
      ]
    },
    "top_terms": {
      "_columns": ["term", "purpose", "count", "note"],
      "rows": []
    }
  },
  "distributions": {
    "surah": {
      "_columns": ["number", "name", "part_start", "page_start", "part_end", "page_end", "ayah_count", "chars", "chars_per_ayah"],
      "rows": [
        [1, "الفاتحة", 1, 27, 1, 55, 7, 9792, 1398.9],
        [2, "البقرة", 1, 56, 2, 767, 286, 456345, 1595.6]
      ]
    },
    "parts": {
      "_columns": ["part", "pages", "chars", "pct"],
      "rows": []
    }
  },
  "limits": [
    ["مصدر النص", "ملف EPUB مرفوع من المستخدم"],
    ["نطاق التحليل", "النص الكامل داخل EPUB"],
    ["طريقة العد", "إزالة التشكيل وتوحيد صور الألف والياء قبل المطابقة"],
    ["طبيعة النسب", "النسب مبنية على أساس معلن وليست أحكاماً تفسيرية نهائية"],
    ["مستوى الثقة العام", "عالٍ في المؤشرات الكلية، متوسط في الأعلام المشتركة"],
    ["ما يحتاج مراجعة", "تثبيت الموارد النادرة ومراجعة العناوين المشتركة"]
  ]
}
```

---

## 11. التصنيفات المعتمدة في `category`

| القيمة | الوصف |
|--------|-------|
| `تفسير` | كتب التفسير وعلوم القرآن |
| `حديث` | كتب الحديث والمصطلح |
| `فقه` | كتب الفقه والأصول |
| `عقيدة` | كتب العقيدة والكلام |
| `لغة` | كتب اللغة والنحو والبلاغة |
| `تاريخ` | كتب السيرة والتراجم والتاريخ |

---

*هذه الوثيقة مرجع ثابت لجميع كشافات مرقوم. أي تعديل في البنية يستلزم رفع رقم `schema_version` وتحديث هذا الملف.*
