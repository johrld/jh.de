export const languages = {
  de: "Deutsch",
  en: "English",
} as const;

export const defaultLang = "de" as const;

export type Lang = keyof typeof languages;

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split("/");
  if (lang in languages) return lang as Lang;
  return defaultLang;
}

export function getPathWithoutLang(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] in languages) {
    return "/" + segments.slice(1).join("/") || "/";
  }
  return pathname;
}

export function getLocalizedPath(path: string, lang: Lang): string {
  const cleanPath = getPathWithoutLang(path);
  return `/${lang}${cleanPath === "/" ? "" : cleanPath}`;
}
