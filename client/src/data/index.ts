// ═══════════════════════════════════════════════════════════════════
// مرقوم — بيانات الكشافات المُضمَّنة (Inline Data)
// هذه البيانات مُولَّدة تلقائياً من ETL ومُضمَّنة في الكود
// لا تُكشف كملفات قابلة للتنزيل في Network tab
// ═══════════════════════════════════════════════════════════════════

import viewcache_test1 from "./viewcache_test1";
import viewcache_test2 from "./viewcache_test2";
import viewcache_test3 from "./viewcache_test3";
import viewcache_test4 from "./viewcache_test4";
import viewcache_test5 from "./viewcache_test5";
import viewcache_test6 from "./viewcache_test6";

// خريطة book_id → بيانات الكشاف
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const VIEWCACHE_MAP: Record<string, any> = {
  "marqoom-test1": viewcache_test1,  // فيض القدير — المناوي
  "marqoom-test2": viewcache_test2,  // الأنساب — السمعاني
  "marqoom-test3": viewcache_test3,  // إكمال المعلم — القاضي عياض
  "marqoom-test4": viewcache_test4,  // البداية والنهاية — ابن كثير
  "marqoom-test5": viewcache_test5,  // طبقات الشافعية — السبكي
  "marqoom-test6": viewcache_test6,  // عمدة القاري — العيني
};
