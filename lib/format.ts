export function formatDate(iso: string, lang: "ru" | "uz" = "ru"): string {
  const d = new Date(iso);
  return d.toLocaleDateString(lang === "ru" ? "ru-RU" : "uz-UZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
