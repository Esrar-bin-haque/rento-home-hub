import { useLanguage } from "@/contexts/LanguageContext";

export function TestTranslations() {
  const { t, lang } = useLanguage();

  const testKeys = [
    "pm.addUnit",
    "dash.tenant",
    "bm.view",
    "bm.cancel",
    "dash.dashboard"
  ];

  return (
    <div className="fixed top-4 right-4 bg-black text-white p-4 rounded-lg z-50 text-xs">
      <p className="font-bold mb-2">Translation Test (lang: {lang})</p>
      {testKeys.map(key => (
        <p key={key}>
          <span className="text-yellow-400">{key}</span>: <span className="text-green-400">{t(key)}</span>
        </p>
      ))}
    </div>
  );
}