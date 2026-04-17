import en from './en.json';
import bn from './bn.json';

export type Lang = 'en' | 'bn';

export const translations = {
  en,
  bn,
} as const;

export type TranslationKey = keyof typeof en;

export function getTranslation(lang: Lang, key: string): string {
  return translations[lang]?.[key as keyof typeof en] || key;
}

export { en, bn };