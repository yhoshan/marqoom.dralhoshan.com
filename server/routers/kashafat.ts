/**
 * Kashafat Router
 * Serves kashaf metadata for the viewer — file URLs are intentionally excluded.
 * The original Excel/Word files remain inaccessible from the browser.
 *
 * getViewCache: يجلب JSON من S3 عبر السيرفر — لا يُكشف أي رابط .json للمتصفح
 */
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../_core/trpc";
import { countViewCaches, getViewCacheKey } from "../db";
import { storageGetSignedUrl } from "../storage";
import { z } from "zod";

// ── Kashaf data (file URLs stripped) ──
const KASHAFAT = [
  {
    id: "fathalbaari",
    num: 1,
    title: "كشّاف فتح الباري بالأرقام",
    author: "ابن حجر العسقلاني",
    death: "ت 852هـ",
    category: "حديث",
    categoryLabel: "الحديث وعلومه",
    description: "فهرس تحليلي آلي شامل لشرح صحيح البخاري — أضخم شروح الحديث النبوي وأجمعها، يرصد المحاور الكبرى من أحاديث وأسانيد وتخريج وترجيح وإشكالات.",
    stats: [
      { label: "كلمة", value: "3.5م" },
      { label: "عبارة", value: "217,433" },
      { label: "صفحة", value: "7,807" },
      { label: "باباً", value: "3,442" },
    ],
    tag: "شرح حديث موسوعي",
    url: "https://marqoom1.dralhoshan.com",
  },
  {
    id: "ibnabdulbar",
    num: 2,
    title: "كشّاف ابن عبد البر",
    author: "ابن عبد البر القرطبي",
    death: "ت 463هـ",
    category: "حديث",
    categoryLabel: "الحديث وعلومه",
    description: "كشاف شامل لثلاثة مصنفات كبرى: التمهيد لما في الموطأ، والاستذكار، والاستيعاب — يرصد منهج الإمام الحافظ في الحديث والفقه والرجال.",
    stats: [
      { label: "كلمة", value: "8.5م" },
      { label: "عبارة", value: "235,427" },
      { label: "صفحة", value: "13,722" },
      { label: "مصنفات", value: "3" },
    ],
    tag: "حديث وفقه مقارن",
    url: "https://marqoom2.dralhoshan.com",
  },
  // Additional kashafat are served from the static data in the frontend.
  // This endpoint is the authoritative source for any server-side queries.
];

export const kashafatRouter = router({
  /**
   * عدد الكشافات المسجلة في قاعدة البيانات — مصدر الحقيقة
   */
  getCount: publicProcedure.query(async () => {
    return { count: await countViewCaches() };
  }),

  /** List all kashafat (no file URLs) */
  list: publicProcedure.query(() => KASHAFAT),

  /** Get a single kashaf by id (no file URLs) */
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const found = KASHAFAT.find((k) => k.id === input.id);
      return found ?? null;
    }),

  /**
   * جلب view_cache لكشاف محدد — آمن تماماً
   * - يقرأ storageKey من قاعدة البيانات
   * - يجلب المحتوى من S3 عبر presigned URL داخلية
   * - يعيد البيانات كـ JSON مباشرة — لا رابط .json يظهر في Network
   */
  getViewCache: publicProcedure
    .input(z.object({ kashafId: z.string().min(1).max(128) }))
    .query(async ({ input }) => {
      // 1. اجلب مفتاح S3 من قاعدة البيانات
      const storageKey = await getViewCacheKey(input.kashafId);
      if (!storageKey) {
        // لا يوجد view_cache لهذا الكشاف — ليس خطأ، فقط لم يُربط بعد
        return null;
      }

      // 2. اجلب presigned URL من S3 (داخلي — لا يُرسل للعميل)
      const presignedUrl = await storageGetSignedUrl(storageKey);

      // 3. جلب محتوى JSON عبر السيرفر
      const resp = await fetch(presignedUrl);
      if (!resp.ok) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `فشل جلب view_cache: ${resp.status}`,
        });
      }

      // 4. أعد JSON مباشرة — لا رابط .json يظهر في Network
      const data = await resp.json();
      return data as Record<string, unknown>;
    }),
});
