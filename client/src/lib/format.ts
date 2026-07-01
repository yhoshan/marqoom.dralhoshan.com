/**
 * formatStatValue — دالة موحّدة لعرض قيم الإحصاءات
 * تُعيد "—" لأي قيمة غير محسوبة أو صفرية غير مقصودة
 */
export function formatStatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";

  if (typeof value === "number") {
    if (!Number.isFinite(value)) return "—";
    if (value === 0) return "—";
    return value.toLocaleString("ar-SA");
  }

  const text = String(value).trim();

  if (!text) return "—";
  if (text === "0" || text === "0.0") return "—";

  return text;
}
