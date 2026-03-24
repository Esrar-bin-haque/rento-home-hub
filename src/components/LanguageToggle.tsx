import { useLanguage } from "@/contexts/LanguageContext";

const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center rounded-full p-0.5" style={{ background: '#F1F3F5', border: '1px solid #DEE2E6' }}>
      <button
        onClick={() => setLang("en")}
        className="px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200"
        style={{
          background: lang === "en" ? '#3B5BDB' : 'transparent',
          color: lang === "en" ? '#FFFFFF' : '#495057',
        }}
      >
        EN
      </button>
      <button
        onClick={() => setLang("bn")}
        className="px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200"
        style={{
          background: lang === "bn" ? '#3B5BDB' : 'transparent',
          color: lang === "bn" ? '#FFFFFF' : '#495057',
        }}
      >
        বাং
      </button>
    </div>
  );
};

export default LanguageToggle;
