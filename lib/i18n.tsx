"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import ru from "@/locales/ru.json";
import uz from "@/locales/uz.json";

export type Lang = "ru" | "uz";

const dictionaries: Record<Lang, unknown> = { ru, uz };
const STORAGE_KEY = "rb-lang";

type Dictionary = Record<string, unknown>;

function resolve(dict: Dictionary, path: string): string | undefined {
  let node: unknown = dict;
  for (const key of path.split(".")) {
    if (node && typeof node === "object" && key in (node as Dictionary)) {
      node = (node as Dictionary)[key];
    } else {
      return undefined;
    }
  }
  return typeof node === "string" ? node : undefined;
}

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (path: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored !== "uz" && stored !== "ru") return;
    const id = window.requestAnimationFrame(() => setLangState(stored));
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "uz" ? "uz" : "ru";
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const t = useCallback(
    (path: string) => resolve(dictionaries[lang] as Dictionary, path) ?? path,
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
