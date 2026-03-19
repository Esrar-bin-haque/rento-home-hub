import { useLanguage } from "@/contexts/LanguageContext";

const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center rounded-full p-0.5" style={{ background: '#F1F5F9', border: '1px solid #E2E8F0' }}>
      <button
        onClick={() => setLang("en")}
        className="px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200"
        style={{
          background: lang === "en" ? '#C0392B' : 'transparent',
          color: lang === "en" ? '#FFFFFF' : '#475569',
        }}
      >
        EN
      </button>
      <button
        onClick={() => setLang("bn")}
        className="px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200"
        style={{
          background: lang === "bn" ? '#C0392B' : 'transparent',
          color: lang === "bn" ? '#FFFFFF' : '#475569',
        }}
      >
        বাং
      </button>
    </div>
  );
};

export default LanguageToggle;
