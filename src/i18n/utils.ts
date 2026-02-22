import { defaultLang, type Lang } from "./config";

import de from "./ui/de.json";
import en from "./ui/en.json";

export const translations = { de, en } as const;

type TranslationKey = string;

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj as unknown);
}

export function t(
  lang: Lang,
  key: TranslationKey,
  params?: Record<string, string | number>,
): string {
  const translation = getNestedValue(translations[lang], key) as string | undefined;
  const fallback = getNestedValue(translations[defaultLang], key) as string | undefined;

  let result = translation ?? fallback ?? key;

  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      result = result.replace(new RegExp(`\\{${param}\\}`, "g"), String(value));
    });
  }

  return result;
}

export function tArray<T>(lang: Lang, key: TranslationKey): T[] {
  const translation = getNestedValue(translations[lang], key);
  const fallback = getNestedValue(translations[defaultLang], key);
  const result = translation ?? fallback;
  return Array.isArray(result) ? (result as T[]) : [];
}

export function formatDate(date: Date, lang: Lang): string {
  const locales: Record<Lang, string> = {
    de: "de-DE",
    en: "en-US",
  };

  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.toLocaleDateString(locales[lang], { month: "short" });

  if (lang === "de") {
    return `${day}. ${month.replace(".", "")}, ${year}`;
  }
  return `${month} ${day}, ${year}`;
}
