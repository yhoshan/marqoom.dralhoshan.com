# مرقوم — قائمة المهام

## المرحلة الحالية: تحسين UX + تأمين الملفات

### تأمين الملفات الأصلية
- [x] حذف أزرار Excel وWord من بطاقات الكشافات في Home.tsx
- [x] حذف أزرار Excel وWord من صفحة KashafDetail.tsx
- [x] إزالة حقول xlsxUrl وdocxUrl من بيانات KASHAFAT في Home.tsx
- [x] إزالة حقول xlsxUrl وdocxUrl من KashafDetail.tsx

### تحسين تجربة المستخدم
- [ ] إضافة زر "دخول الكشاف" يفتح صفحة KashafDetail الداخلية (بدلاً من موقع خارجي)
- [ ] تحسين صفحة KashafDetail: تنقل سريع بين الأقسام (anchor navigation)
- [ ] تحسين عرض الجداول في ViewCacheViewer: بحث + فرز + تصفية
- [ ] إصلاح ViewCacheViewer ليدعم الأعمدة العربية بالموضع لا بالاسم
- [ ] تحسين الأداء: lazy loading للبيانات الثقيلة في KashafDetail

### استقرار العارض
- [ ] اختبار ViewCacheViewer على الكشافات الستة المربوطة بـ JSON
- [ ] معالجة حالة عدم وجود JSON (fallback graceful)
- [ ] التأكد من عمل البحث والتصفية في الجداول

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
- [ ] إضافة زر "دخول الكشاف" يفتح KashafDetail الداخلية
- [x] التحقق من عدم ظهور روابط الملفات في Network tab
- [x] حفظ checkpoint

## الجداول التفصيلية — العارض البحثي الكامل

- [x] فحص بنية view_cache.json وتحديد مفاتيح الجداول المتاحة
- [x] بناء مكوّن DetailedTablesViewer مستقل بنظام تبويبات
- [x] جداول قابلة للبحث والفرز والتصفية مع pagination
- [x] دمج المكوّن في KashafDetail تحت قسم "الجداول التفصيلية"
- [x] توصيل المكوّن ببيانات inlineData/jsonUrl المتاحة لكل كشاف
- [x] التحقق البصري والوظيفي
