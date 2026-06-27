# MARQOOM_SCHEMA — البنية الرسمية لـ view_cache.json

**الإصدار:** MARQOOM_SCHEMA_v1  
**تاريخ الإصدار:** 2025  
**المشروع:** مرقوم — بوابة الكشافات التراثية الرقمية

---

## 1. الغرض من view_cache.json

`view_cache.json` هو **ذاكرة تخزين مؤقتة للعرض فقط** (view cache). يُولَّد تلقائياً من ملف Excel الأصلي عبر `etl/marqoom_etl.py`، ولا يُعدَّل يدوياً أبداً.

- **المصدر الوحيد للبيانات:** ملف Excel الأصلي (محفوظ في S3 خاص)
- **JSON:** ناتج مشتق للعرض السريع — لا يُنشر كرابط مباشر
- **التعديل:** أي تعديل يجب أن يتم على Excel ثم إعادة تشغيل ETL

---

## 2. البنية الكاملة

```json
{
  "_meta": {
    "schema_version": "MARQOOM_SCHEMA_v1",
    "book_id": "string — معرّف الكشاف (snake_case، حروف إنجليزية وأرقام وشرطة سفلية فقط)",
    "generated_at": "ISO 8601 UTC — وقت التوليد",
    "source": "excel_etl"
  },
  "project": "مرقوم — بوابة الكشافات التراثية الرقمية",
  "book": "string — عنوان الكتاب كاملاً",
  "author": "string — اسم المؤلف",
  "metrics": {
    "pages": "integer | null",
    "parts": "integer | null",
    "words_approx": "integer | null",
    "chars": "integer | null",
    "surahs_detected": "integer | null — للكتب القرآنية فقط"
  },
  "top_purposes": "array — أعلى الأغراض (من ورقة توزيع الأغراض)",
  "top_resources": "array — أعلى الموارد (من ورقة الموارد حسب المجال)",
  "top_books": "array — أعلى الكتب المذكورة (من ورقة الكتب)",
  "top_people": "array — أعلى الأعلام المذكورين (من ورقة الأعلام)",
  "surah_distribution": "array | null — توزيع السور (للكتب القرآنية فقط)",
  "limits": "array — حدود الدراسة (من ورقة حدود الدراسة)",
  "tables": {
    "<key>": {
      "title": "string — اسم الورقة الأصلي بالعربية",
      "_columns": ["array of strings — أسماء الأعمدة"],
      "rows": [["array of arrays — الصفوف (null للقيم الفارغة)"]]
    }
  }
}
```

---

## 3. قواعد التسمية (book_id)

- حروف إنجليزية صغيرة وأرقام وشرطة سفلية فقط
- لا مسافات، لا حروف عربية، لا شرطات عادية
- أمثلة: `fathalbaari`, `bahr_muhit_zarkashi`, `sahih_bukhari`, `ibn_taymiyyah`

---

## 4. قواعد الجداول (_columns و rows)

- `_columns`: مصفوفة نصوص — أسماء الأعمدة من الصف الأول في Excel
- `rows`: مصفوفة من المصفوفات — كل صف هو مصفوفة قيم بنفس ترتيب `_columns`
- القيم الفارغة: `null` (لا `""` ولا `"None"`)
- الأرقام: `integer` أو `float` (لا نصوص للأرقام)
- الصفوف الفارغة كلياً: تُحذف

---

## 5. الأوراق الرئيسية وترتيبها في top_*

| ورقة Excel | مفتاح JSON | ملاحظة |
|---|---|---|
| توزيع الأغراض | `top_purposes` | أعلى 15 غرضاً |
| الموارد حسب المجال / المجالات | `top_resources` | أعلى 15 مورداً |
| الكتب / الكتب المصرح بها | `top_books` | أعلى 30 كتاباً |
| الأعلام | `top_people` | أعلى 30 علماً |
| السور والصفحات | `surah_distribution` | كل السور (للقرآنيات) |
| حدود الدراسة | `limits` | كل البنود |

---

## 6. الأوراق الإضافية (tables)

جميع الأوراق الأخرى تُضاف في `tables` بمفاتيح موحدة:

| ورقة Excel | مفتاح في tables |
|---|---|
| المصطلحات المنهجية / المصطلحات | `terminology` |
| الخلاف | `disagreement` |
| الترجيح | `preponderance` |
| النقد | `criticism` |
| الإحالات / الإحالات الداخلية | `references` |
| الكثافة العلمية / الكثافة | `density` |
| المؤشرات المركبة | `composite_indicators` |
| صيغ الأداء والرواية | `narration_forms` |
| الجرح والتعديل | `hadith_criticism` |
| الحكم الحديثي | `hadith_ruling` |
| حدود الدراسة | `limits` (أيضاً في top-level) |
| للمستفيد السريع | `quick_summary` |
| نتائج قابلة للنشر / مخرجات نشر | `publishable_results` |
| المراجعة اليدوية / ما يحتاج مراجعة | `manual_review` |
| الملخص التنفيذي / ملخص تنفيذي | `executive_summary` |
| بيانات الكتاب / بيانات الملفات | `book_data` |

---

## 7. الأوراق المُتجاهَلة

الأوراق التالية لا تُضاف إلى JSON:
- تصور بصري للموقع
- تنبيهات منهجية
- عرض بصري
- أفكار أبحاث (اختياري)
- منهجية العمل (اختياري)

---

## 8. مثال عملي مختصر

```json
{
  "_meta": {
    "schema_version": "MARQOOM_SCHEMA_v1",
    "book_id": "fathalbaari",
    "generated_at": "2025-01-01T00:00:00Z",
    "source": "excel_etl"
  },
  "project": "مرقوم — بوابة الكشافات التراثية الرقمية",
  "book": "فتح الباري شرح صحيح البخاري",
  "author": "ابن حجر العسقلاني",
  "metrics": { "pages": 7807, "parts": 13, "words_approx": 3500000, "chars": null },
  "top_purposes": [["تفسير وبيان المعنى", 67357, 48.54, 6180, 99.5, "تفسير + تأويل"]],
  "top_books": [["صحيح البخاري", "حديث", "البخاري", 1200, 5.5, 1, 1, "...", "مطابقة عنوان"]],
  "top_people": [["ابن حجر", "حديث/فقه", 3000, 14.2, 1, 1, "...", "عالٍ", "مطابقة اسم"]],
  "limits": [["مصدر النص", "ملف EPUB..."]],
  "tables": {
    "terminology": {
      "title": "المصطلحات المنهجية",
      "_columns": ["المجال", "المصطلح", "عدد الورود"],
      "rows": [["حديث", "الإسناد", 1500]]
    }
  }
}
```

---

## 9. ملاحظات الصحة (Validation)

الملف صحيح إذا:
1. يمكن تحليله بـ `JSON.parse()` بدون أخطاء
2. يحتوي على `_meta.schema_version === "MARQOOM_SCHEMA_v1"`
3. يحتوي على `_meta.book_id` بالصيغة الصحيحة
4. يحتوي على `book` و`author` غير فارغَين
5. `top_purposes` أو `top_books` أو `top_people` غير فارغة
