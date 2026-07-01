import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertKashafViewcache, InsertUser, kashafViewcache, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// ── Kashaf ViewCache ────────────────────────────────────────────────

/**
 * الحصول على storageKey لكشاف محدد — لا يُرسل للعميل مطلقاً
 */
export async function getViewCacheKey(kashafId: string): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;
  const rows = await db
    .select({ storageKey: kashafViewcache.storageKey })
    .from(kashafViewcache)
    .where(eq(kashafViewcache.kashafId, kashafId))
    .limit(1);
  return rows.length > 0 ? rows[0].storageKey : null;
}

/**
 * الحصول على معلومات السجل (بدون storageKey) — آمن للعرض
 */
export async function getViewCacheMeta(kashafId: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db
    .select({
      kashafId: kashafViewcache.kashafId,
      schemaVersion: kashafViewcache.schemaVersion,
      generatedAt: kashafViewcache.generatedAt,
      bookTitle: kashafViewcache.bookTitle,
      bookAuthor: kashafViewcache.bookAuthor,
    })
    .from(kashafViewcache)
    .where(eq(kashafViewcache.kashafId, kashafId))
    .limit(1);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * إدراج أو تحديث سجل view_cache — يُستخدم من سكريبت ETL فقط
 */
export async function upsertViewCache(record: InsertKashafViewcache): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .insert(kashafViewcache)
    .values(record)
    .onDuplicateKeyUpdate({
      set: {
        storageKey: record.storageKey,
        schemaVersion: record.schemaVersion ?? null,
        generatedAt: record.generatedAt ?? null,
        bookTitle: record.bookTitle ?? null,
        bookAuthor: record.bookAuthor ?? null,
      },
    });
}

/**
 * عدد جميع الكشافات المربوطة في قاعدة البيانات
 */
export async function countViewCaches(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const rows = await db
    .select({ cnt: sql<number>`COUNT(*)` })
    .from(kashafViewcache);
  return Number(rows[0]?.cnt ?? 0);
}

/**
 * قائمة جميع الكشافات المربوطة (بدون storageKey)
 */
export async function listViewCacheMeta() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      kashafId: kashafViewcache.kashafId,
      schemaVersion: kashafViewcache.schemaVersion,
      generatedAt: kashafViewcache.generatedAt,
      bookTitle: kashafViewcache.bookTitle,
      bookAuthor: kashafViewcache.bookAuthor,
      updatedAt: kashafViewcache.updatedAt,
    })
    .from(kashafViewcache);
}
