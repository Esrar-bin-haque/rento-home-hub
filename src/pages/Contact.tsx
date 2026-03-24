import { useState } from "react";
import { MapPin, Phone, Mail, Share2, Facebook, Linkedin, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const Contact = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "General Inquiry", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!/^01\d{9}$/.test(form.phone)) errs.phone = "Enter valid 11-digit phone starting with 01";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    toast.success("✅ Message sent! We'll get back to you soon.");
    setForm({ name: "", phone: "", email: "", subject: "General Inquiry", message: "" });
    setErrors({});
  };

  const infoCards = [
    { icon: MapPin, title: t("contact.office"), detail: "House 12, Road 5, Dhanmondi, Dhaka-1209, Bangladesh", sub: "" },
    { icon: Phone, title: t("contact.callUs"), detail: "+880-1700-000000", sub: "Mon–Sat, 9AM–6PM" },
    { icon: Mail, title: t("contact.emailUs"), detail: "contact@rento.com.bd", sub: t("contact.replyTime") },
    { icon: Share2, title: t("contact.followUs"), detail: "social", sub: "" },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#F8F9FA' }}>
      <section className="pt-10 pb-12" style={{ background: '#FFFFFF' }}>
        <div className="container mx-auto px-4 text-center">
          <span className="text-sm font-medium tracking-wide uppercase" style={{ color: '#3B5BDB' }}>{t("nav.contact")}</span>
          <h1 className="text-3xl md:text-5xl font-heading font-bold mt-2 mb-3" style={{ color: '#1A1D23' }}>{t("contact.heading")}</h1>
          <p className="max-w-lg mx-auto" style={{ color: '#868E96' }}>{t("contact.subheading")}</p>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #DEE2E6', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block" style={{ color: '#1A1D23' }}>{t("auth.fullName")}</label>
                  <input value={form.name} onChange={e => { setForm({...form, name: e.target.value}); setErrors({...errors, name: ""}); }}
                    className="w-full h-10 rounded-lg px-3 text-sm outline-none" style={{ border: '1px solid #DEE2E6' }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3B5BDB'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#DEE2E6'} />
                  {errors.name && <p className="text-xs mt-1" style={{ color: '#E03131' }}>{errors.name}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block" style={{ color: '#1A1D23' }}>{t("auth.phoneNumber")}</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg text-sm" style={{ border: '1px solid #DEE2E6', borderRight: 'none', background: '#F1F3F5', color: '#868E96' }}>+880</span>
                    <input value={form.phone} onChange={e => { setForm({...form, phone: e.target.value}); setErrors({...errors, phone: ""}); }}
                      placeholder="01XXXXXXXXX"
                      className="flex-1 h-10 rounded-r-lg px-3 text-sm outline-none" style={{ border: '1px solid #DEE2E6' }} />
                  </div>
                  {errors.phone && <p className="text-xs mt-1" style={{ color: '#E03131' }}>{errors.phone}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block" style={{ color: '#1A1D23' }}>{t("contact.email")}</label>
                  <input type="email" value={form.email} onChange={e => { setForm({...form, email: e.target.value}); setErrors({...errors, email: ""}); }}
                    className="w-full h-10 rounded-lg px-3 text-sm outline-none" style={{ border: '1px solid #DEE2E6' }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3B5BDB'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#DEE2E6'} />
                  {errors.email && <p className="text-xs mt-1" style={{ color: '#E03131' }}>{errors.email}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block" style={{ color: '#1A1D23' }}>{t("contact.subject")}</label>
                  <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                    className="w-full h-10 rounded-lg px-3 text-sm outline-none" style={{ border: '1px solid #DEE2E6' }}>
                    {["General Inquiry", "Partnership", "Technical Support", "Pricing", "Other"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block" style={{ color: '#1A1D23' }}>{t("contact.message")}</label>
                  <textarea rows={5} value={form.message} onChange={e => { setForm({...form, message: e.target.value}); setErrors({...errors, message: ""}); }}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none" style={{ border: '1px solid #DEE2E6' }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3B5BDB'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#DEE2E6'} />
                  {errors.message && <p className="text-xs mt-1" style={{ color: '#E03131' }}>{errors.message}</p>}
                </div>
                <button type="submit" className="w-full h-10 font-semibold rounded-lg text-sm transition-colors" style={{ background: '#3B5BDB', color: '#FFFFFF' }}>
                  {t("contact.sendMessage")}
                </button>
                <p className="text-center text-xs" style={{ color: '#868E96' }}>{t("contact.replyTime")}</p>
              </form>
            </div>

            <div className="space-y-4">
              {infoCards.map((card, i) => (
                <div key={i} className="bg-white rounded-xl p-5" style={{ border: '1px solid #DEE2E6', borderLeft: '4px solid #3B5BDB', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EDF2FF' }}>
                      <card.icon className="h-5 w-5" style={{ color: '#3B5BDB' }} />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-sm" style={{ color: '#1A1D23' }}>{card.title}</h3>
                      {card.detail === "social" ? (
                        <div className="flex gap-3 mt-2">
                          {[Facebook, Linkedin, Instagram].map((Icon, j) => (
                            <a key={j} href="#" className="transition-colors" style={{ color: '#868E96' }}
                              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = '#3B5BDB'}
                              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = '#868E96'}>
                              <Icon className="h-5 w-5" />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <>
                          <p className="text-sm mt-1" style={{ color: '#495057' }}>{card.detail}</p>
                          {card.sub && <p className="text-xs mt-0.5" style={{ color: '#868E96' }}>{card.sub}</p>}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-14">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto rounded-2xl h-[300px] flex flex-col items-center justify-center" style={{ background: '#F1F3F5' }}>
            <MapPin className="h-8 w-8 mb-2" style={{ color: '#868E96' }} />
            <p className="font-heading font-semibold" style={{ color: '#495057' }}>📍 Rento HQ — Dhanmondi, Dhaka</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
