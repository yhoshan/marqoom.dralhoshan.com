# مرقوم — قائمة المهام

## المرحلة الحالية: تحسين UX + تأمين الملفات

### تأمين الملفات الأصلية
- [x] حذف أزرار Excel وWord من بطاقات الكشافات في Home.tsx
- [x] حذف أزرار Excel وWord من صفحة KashafDetail.tsx
- [x] إزالة حقول xlsxUrl وdocxUrl من بيانات KASHAFAT في Home.tsx
- [x] إزالة حقول xlsxUrl وdocxUrl من KashafDetail.tsx

### تحسين تجربة المستخدم
- [x] إضافة زر "دخول الكشاف" يفتح صفحة KashafDetail الداخلية (بدلاً من موقع خارجي)
- [x] تحسين صفحة KashafDetail: تنقل سريع بين الأقسام (anchor navigation)
- [x] تحسين عرض الجداول في ViewCacheViewer: بحث + فرز + تصفية
- [x] إصلاح ViewCacheViewer ليدعم الأعمدة العربية بالموضع لا بالاسم
- [x] تحسين الأداء: lazy loading للبيانات الثقيلة في KashafDetail

### استقرار العارض
- [x] اختبار ViewCacheViewer على الكشافات الستة المربوطة بـ JSON
- [x] معالجة حالة عدم وجود JSON (fallback graceful)
- [x] التأكد من عمل البحث والتصفية في الجداول

## مكتمل سابقاً
- [x] بناء الصفحة الرئيسية مع 70 كشافاً
- [x] بناء ViewCacheViewer
- [x] بناء ETL لتحويل Excel إلى JSON
- [x] ربط 6 كشافات بملفات JSON
- [x] التراجع عن ترقية Full-Stack

## المرحلة الجديدة: API + تأمين الملفات (معتمدة)
- [x] إضافة tRPC procedure لخدمة بيانات الكشافات بدون روابط الملفات
- [x] إزالة حقول xlsxUrl وdocxUrl من KASHAFAT في Home.tsx
- [x] حذف أزرار Excel وWord من KashafCard في Home.tsx
- [x] حذف أزرار Excel وWord من KashafDetail.tsx (إن وُجدت)
- [x] إضافة زر "دخول الكشاف" يفتح KashafDetail الداخلية
- [x] التحقق من عدم ظهور روابط الملفات في Network tab
- [x] حفظ checkpoint

## إصلاح TypeScript بعد ترقية Full-Stack
- [x] إصلاح خطأ TypeScript في KashafDetail.tsx (تغليف chartData بشرط)
- [x] إضافة استيراد @fortawesome في main.tsx
- [x] التحقق من صحة TypeScript (pnpm check — لا أخطاء)
- [x] مزامنة قاعدة البيانات (pnpm db:push)

## الجداول التفصيلية — العارض البحثي الكامل

- [x] فحص بنية view_cache.json وتحديد مفاتيح الجداول المتاحة
- [x] بناء مكوّن DetailedTablesViewer مستقل بنظام تبويبات
- [x] جداول قابلة للبحث والفرز والتصفية مع pagination
- [x] دمج المكوّن في KashafDetail تحت قسم "الجداول التفصيلية"
- [x] توصيل المكوّن ببيانات inlineData/jsonUrl المتاحة لكل كشاف
- [x] التحقق البصري والوظيفي

## ربط ملفات JSON بالكشافات
- [x] رفع ملفات JSON على CDN (bahralmuhit, fayd_alqadir, umdat_alqari + 6 ملفات ETL)
- [x] ربط كشاف البحر المحيط للزركشي (61) بملف JSON
- [x] ربط كشاف تدريب الراوي للسيوطي (62) بملف JSON
- [x] التحقق البصري من ViewCacheViewer في صفحة كشاف 61

## ETL الآمن — API داخلي لـ view_cache
- [x] إضافة جدول kashaf_viewcache في قاعدة البيانات (kashaf_id, storage_key, schema_version, generated_at)
- [x] بناء API endpoint: GET /api/trpc/kashaf.getViewCache?input={"kashafId":"..."} يجلب JSON من S3 ويعيده
- [x] تحديث ViewCacheViewer لاستخدام trpc.kashaf.getViewCache بدلاً من jsonUrl
- [x] إزالة jsonUrl من KashafDetail نهائياً واستبداله بـ kashafId فقط
- [x] بناء سكريبت ETL: يرفع view_cache.json إلى S3 ويسجّل في قاعدة البيانات
- [x] رفع ملف JSON كشاف البحر المحيط عبر ETL
- [x] اختبار: التحقق من عدم ظهور أي .json في Network tab
- [x] إزالة jsonUrl الخاطئ من كشاف تدريب الراوي ✅ (مكتمل)

## توليد view_cache.json لجميع الكشافات (36 ملف Excel)
- [x] فحص بنية ملفات Excel وتحديد الأوراق والأعمدة المشتركة
- [x] بناء سكريبت ETL شامل لتحويل Excel إلى view_cache.json
- [x] توليد view_cache.json لجميع الكشافات الـ 70
- [x] ربط كل كشاف بملف JSON عبر قاعدة البيانات
- [x] التحقق من عمل الكشافات المربوطة في المنصة

## خط الإنتاج المعياري (Excel → ETL → مرقوم)
- [x] إنشاء MARQOOM_SCHEMA.md (مرجع البنية الرسمية لـ view_cache.json)
- [x] إنشاء MARQOOM_PROTOCOL.md (بروتوكول خط الإنتاج الكامل)
- [x] بناء etl/marqoom_etl.py الرسمي (يولّد view_cache.json + validation_report.json)
- [x] اختبار ETL على كشاف البحر المحيط والتحقق من الامتثال 100%
- [x] تحديث register_viewcache.mjs ليستخدم مخرجات ETL مباشرة
- [x] توثيق خط الإنتاج في README

## التحقق والتوثيق النهائي
- [x] التحقق عملياً من عمل مجموعة ممثلة من الكشافات في الواجهة عبر API (70/70 ✅)
- [x] توثيق خط الإنتاج في README.md (70 كشاف موثق)

## جلسة 2026-06-27 — إضافة الكشاف 85 + مراجعة الجداول التفصيلية

### ما تم ✅
- [x] إضافة كشاف البيان والتبيين للجاحظ (رقم 85) في Home.tsx وKashafDetail.tsx
- [x] إضافة تصنيف "اللغة والبلاغة" في قائمة التصنيفات
- [x] تحديث DetailedTablesViewer لدعم schema protocol v2.1 (views/facets/stats)
- [x] إعادة رفع view_cache للكشاف 85 على S3 وتحديث قاعدة البيانات
- [x] رفع view_cache للكشاف 75 (مجموع فتاوى ابن تيمية) على S3
- [x] رفع view_cache للكشاف 82 (مقالات الإسلاميين للأشعري) على S3
- [x] التحقق من عمل الجداول التفصيلية للكشافات 1 و12 (schema v1)
- [x] التحقق من عمل الجداول التفصيلية للكشاف 85 (schema v2.1)

### ما تبقى ❌
- [ ] دعم schema "dashboard/tables" في DetailedTablesViewer (للكشاف 82 — مقالات الإسلاميين)
  - الجداول: sections, topics, groups, persons, terms, resources, evidence (كل منها list من objects)
  - يختلف عن v1 (highlights/distributions) وعن v2.1 (views/facets)
- [ ] فحص الكشافات ذات الإحصائيات الصفرية (17 كشاف) والتأكد من عمل جداولها
  - بعضها لديه highlights وبعضها لا (مثل altabari له 4 جداول)
- [x] حفظ checkpoint نهائي ورفع على GitHub (version: 5d5ec262)

## جلسة 2026-06-28 — استبدال ملفات الطبري + دعم schema v2.2

### ما تم ✅
- [x] استبدال ملفات تفسير الطبري بالنسخة الجديدة (protocol v2.2)
- [x] تحديث عنوان الكشاف إلى "كشّاف تفسير الطبري"
- [x] إصلاح خطأ d.limits.map في ViewCacheViewer.tsx
- [x] إضافة دعم schema v2.2 في DetailedTablesViewer (getV22Tabs)
- [x] الجداول التفصيلية للطبري تعمل: السور (114) + الأغراض + الأعلام + المدارس + المصطلحات

### جاهز للملفات القادمة ✅
- [x] schema v2.2 مدعوم: protocol_version (رئيسي) + sections + resources + summary + terms
- [ ] الملفات القادمة بنفس schema v2.2 — جاهز لاستقبالها

## جلسة 2026-06-28 — إضافة الكشافات 86-98

### ما تم ✅
- [x] رفع 22 ملف Excel جديد على S3 وتحديث قاعدة البيانات
- [x] إضافة الكشافات الجديدة 86-98 في Home.tsx وKashafDetail.tsx:
  - 86: كشّاف تفسير ابن كثير (ت774هـ) — تفسير
  - 87: كشّاف الجامع لعلوم الإمام أحمد — حديث
  - 88: كشّاف الزيادة والإحسان في علوم القرآن — قرآن
  - 89: كشّاف كتاب الأغاني للأصفهاني — لغة
  - 90: كشّاف وفيات الأعيان لابن خلكان — تراجم
  - 91: كشّاف التمهيد لابن عبد البر — حديث
  - 92: كشّاف الاستذكار لابن عبد البر — حديث
  - 93: كشّاف الكافي لابن عبد البر — فقه
  - 94: كشّاف إعلام الموقعين لابن القيم — عقيدة
  - 95: كشّاف زاد المعاد لابن القيم — عقيدة
  - 96: كشّاف مدارج السالكين لابن القيم — عقيدة
  - 97: كشّاف الجواب الصحيح لابن تيمية — عقيدة
  - 98: كشّاف بيان تلبيس الجهمية لابن تيمية — عقيدة
- [x] تحديث ملفات Excel للكشافات الموجودة (فتح الباري، النووي، المحلى، المغني، البدائع، الرازي، القرطبي، مجموع الفتاوى، درء التعارض)
- [x] تحديث CATEGORIES لتعكس العدد الجديد (98 كشاف)
- [x] رفع view_cache لجميع الكشافات الجديدة على S3 وتسجيلها في قاعدة البيانات
- [x] تسجيل 22 view_cache في قاعدة البيانات (13 جديدة + 9 محدّثة)

### ما تبقى ❌
- [x] حفظ checkpoint نهائي ورفع على GitHub (version: 5d5ec262)
