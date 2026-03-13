import { useLanguage } from "@/contexts/LanguageContext";

const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center bg-secondary rounded-full p-0.5 border border-border">
      <button
        onClick={() => setLang("en")}
        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
          lang === "en"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("bn")}
        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
          lang === "bn"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        বাং
      </button>
    </div>
  );
};

export default LanguageToggle;
