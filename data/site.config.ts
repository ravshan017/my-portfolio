// ============================================================
// ЦЕНТРАЛЬНЫЙ КОНФИГ САЙТА
// Реальные значения теперь в data/site.json (туда пишет админка).
// Меняй структуру здесь только если добавляешь новые поля.
// ============================================================

import data from "./site.json";

export type SocialKind = "pro" | "creative";

export interface Social {
  id: "telegram" | "instagram" | "youtube";
  label: string;
  handle: string;
  url: string;
  kind: SocialKind;
}

export interface SiteConfig {
  nameRu: string;
  nameLat: string;
  initials: string;
  email: string;
  url: string;
  socials: Social[];
  skills: string[];
}

export const site: SiteConfig = data as unknown as SiteConfig;
