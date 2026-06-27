# MARQOOM_PROTOCOL — بروتوكول خط الإنتاج المعياري

**الإصدار:** v1.0  
**المشروع:** مرقوم — بوابة الكشافات التراثية الرقمية

---

## خط الإنتاج الكامل

```
Excel (المصدر الوحيد)
  ↓
etl/marqoom_etl.py
  ↓
view_cache.json + validation_report.json
  ↓
etl/register_viewcache.mjs (رفع إلى S3 + تسجيل في قاعدة البيانات)
  ↓
مرقوم (العارض يطلب عبر API فقط — لا روابط مباشرة)
```

---

## الخطوات التفصيلية

### الخطوة 1: تشغيل ETL

```bash
cd /home/ubuntu/marqoom
python3 etl/marqoom_etl.py <excel_file> <kashaf_id> [book_title] [author_name]
```

**مثال:**
```bash
python3 etl/marqoom_etl.py \
  "/path/to/كشاف_فتح_الباري.xlsx" \
  "fathalbaari" \
  "فتح الباري شرح صحيح البخاري" \
  "ابن حجر العسقلاني"
```

**المخرجات:**
- `/tmp/viewcache_<kashaf_id>.json` — ذاكرة التخزين المؤقتة للعرض
- `/tmp/validation_<kashaf_id>.json` — تقرير التحقق

### الخطوة 2: مراجعة تقرير التحقق

```bash
cat /tmp/validation_<kashaf_id>.json
```

**إذا كان `compliance_score` = 100%:** انتقل مباشرة للخطوة 3.  
**إذا كان أقل:** راجع `issues` في التقرير وعدّل ملف Excel ثم أعد الخطوة 1.

### الخطوة 3: تسجيل الكشاف في المنصة

```bash
node etl/register_viewcache.mjs <kashaf_id> /tmp/viewcache_<kashaf_id>.json
```

هذا الأمر:
1. يرفع `view_cache.json` إلى S3 (خاص — غير قابل للوصول المباشر)
2. يسجّل `storage_key` في جدول `kashaf_viewcache` في قاعدة البيانات
3. الكشاف يصبح متاحاً فوراً في المنصة

---

## القواعد الأساسية

| القاعدة | التفاصيل |
|---|---|
| المصدر الوحيد | Excel فقط — لا تعديل يدوي على JSON |
| الأمان | لا روابط `.json` مباشرة في المتصفح |
| الوصول | عبر `/api/trpc/kashafat.getViewCache` فقط |
| التعديل | Excel → ETL → register (دائماً) |
| الأرقام | إنجليزية دائماً (0-9) |
| التحقق | يجب أن يكون `compliance_score` ≥ 90% قبل التسجيل |

---

## معرّفات الكشافات الـ 11 الرئيسية

| الكشاف | kashaf_id |
|---|---|
| كشاف فتح الباري | `fathalbaari` |
| كشاف ابن عبد البر | `ibnabdulbar` |
| كشاف ابن تيمية | `ibntimiah` |
| كشاف تفسير الرازي | `alrazi` |
| كشاف تفسير القرطبي | `alqurtubi` |
| كشاف جامع البيان للطبري | `altabari` |
| كشاف المجموع للنووي | `annawawe` |
| كشاف المحلى لابن حزم | `almuhalla` |
| كشاف المغني لابن قدامة | `almughni` |
| كشاف بدائع الصنائع للكاساني | `albadaei` |
| كشاف كتب ابن القيم الثلاثة | `ibnalqayyim` |

---

## هيكل ملف validation_report.json

```json
{
  "kashaf_id": "string",
  "excel_file": "string",
  "generated_at": "ISO 8601",
  "compliance_score": 0-100,
  "status": "PASS | WARN | FAIL",
  "checks": [
    {
      "check": "string — اسم الفحص",
      "status": "PASS | WARN | FAIL",
      "message": "string — رسالة توضيحية",
      "suggestion": "string | null — اقتراح التعديل على Excel"
    }
  ],
  "summary": {
    "passed": "integer",
    "warnings": "integer",
    "failed": "integer"
  }
}
```

---

## الفحوصات المعيارية

| الفحص | الوزن | FAIL إذا |
|---|---|---|
| وجود `_meta` كاملاً | 10% | مفقود |
| صحة `book_id` (snake_case) | 10% | يحتوي مسافات أو حروف عربية |
| وجود `book` و`author` | 15% | فارغان |
| وجود `metrics` | 10% | فارغ كلياً |
| وجود `top_purposes` | 15% | فارغ |
| وجود `top_books` أو `top_people` | 15% | كلاهما فارغ |
| وجود `limits` | 10% | فارغ |
| صحة JSON (قابل للتحليل) | 15% | خطأ في التحليل |

---

## ملاحظات مهمة

- لا تُضف أزرار تحميل أو روابط مباشرة للملفات الأصلية في الواجهة
- لا تُعدَّل ملفات JSON يدوياً — أي تعديل يبطل التحقق
- عند تحديث بيانات كشاف موجود: شغّل ETL مجدداً ثم `register_viewcache.mjs` (يُحدَّث السجل تلقائياً)
