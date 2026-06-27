import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// TODO: Add your tables here

/**
 * سجل ملفات view_cache لكل كشاف.
 * JSON مخزّن في S3 (private) — لا يُكشف للمتصفح مطلقاً.
 * الوصول عبر API فقط: trpc.kashaf.getViewCache
 */
export const kashafViewcache = mysqlTable("kashaf_viewcache", {
  id: int("id").autoincrement().primaryKey(),
  /** معرّف الكشاف في KashafDetail.tsx */
  kashafId: varchar("kashafId", { length: 128 }).notNull().unique(),
  /** مفتاح الملف في S3 — لا يُرسل للعميل */
  storageKey: varchar("storageKey", { length: 512 }).notNull(),
  /** إصدار المخطط */
  schemaVersion: varchar("schemaVersion", { length: 32 }),
  /** تاريخ توليد الملف */
  generatedAt: varchar("generatedAt", { length: 64 }),
  /** عنوان الكتاب من _meta */
  bookTitle: text("bookTitle"),
  /** المؤلف من _meta */
  bookAuthor: text("bookAuthor"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type KashafViewcache = typeof kashafViewcache.$inferSelect;
export type InsertKashafViewcache = typeof kashafViewcache.$inferInsert;