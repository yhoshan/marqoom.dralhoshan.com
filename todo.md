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
