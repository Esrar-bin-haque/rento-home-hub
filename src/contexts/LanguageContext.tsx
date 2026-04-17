import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations } from "@/i18n";

type Lang = "en" | "bn";

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem("rento-language");
      if (saved === "en" || saved === "bn") return saved;
    } catch {}
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("rento-language", lang);
    document.documentElement.style.fontFamily = lang === "bn" ? "'Hind Siliguri', sans-serif" : "'Inter', sans-serif";
  }, [lang]);

  const t = (key: string): string => {
    const translation = translations[lang]?.[key as keyof typeof translations.en];
    if (!translation) {
      console.log("Translation MISSING:", key);
    }
    return translation || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: setLangState, t }}>
      {children}
    </LanguageContext.Provider>
  );
};