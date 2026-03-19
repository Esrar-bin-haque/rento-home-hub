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
    <div className="min-h-screen bg-background">
      <section className="pt-10 pb-12 mesh-gradient">
        <div className="container mx-auto px-4 text-center">
          <span className="text-sm font-medium text-primary tracking-wide uppercase">{t("nav.contact")}</span>
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground mt-2 mb-3">{t("contact.heading")}</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">{t("contact.subheading")}</p>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Contact Form */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">{t("auth.fullName")}</label>
                  <input value={form.name} onChange={e => { setForm({...form, name: e.target.value}); setErrors({...errors, name: ""}); }}
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">{t("auth.phoneNumber")}</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-input bg-muted text-sm text-muted-foreground">+880</span>
                    <input value={form.phone} onChange={e => { setForm({...form, phone: e.target.value}); setErrors({...errors, phone: ""}); }}
                      placeholder="01XXXXXXXXX"
                      className="flex-1 h-10 rounded-r-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">{t("contact.email")}</label>
                  <input type="email" value={form.email} onChange={e => { setForm({...form, email: e.target.value}); setErrors({...errors, email: ""}); }}
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">{t("contact.subject")}</label>
                  <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                    {["General Inquiry", "Partnership", "Technical Support", "Pricing", "Other"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">{t("contact.message")}</label>
                  <textarea rows={5} value={form.message} onChange={e => { setForm({...form, message: e.target.value}); setErrors({...errors, message: ""}); }}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none" />
                  {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
                </div>
                <button type="submit" className="w-full h-10 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-colors text-sm">
                  {t("contact.sendMessage")}
                </button>
                <p className="text-center text-xs text-muted-foreground">{t("contact.replyTime")}</p>
              </form>
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              {infoCards.map((card, i) => (
                <div key={i} className="bg-card rounded-xl border border-border shadow-sm p-5 border-l-4 border-l-primary">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <card.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-foreground text-sm">{card.title}</h3>
                      {card.detail === "social" ? (
                        <div className="flex gap-3 mt-2">
                          {[Facebook, Linkedin, Instagram].map((Icon, j) => (
                            <a key={j} href="#" className="text-muted-foreground hover:text-primary transition-colors">
                              <Icon className="h-5 w-5" />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-muted-foreground mt-1">{card.detail}</p>
                          {card.sub && <p className="text-xs text-muted-foreground mt-0.5">{card.sub}</p>}
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

      {/* Map placeholder */}
      <section className="pb-14">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-muted rounded-2xl h-[300px] flex flex-col items-center justify-center text-muted-foreground">
            <MapPin className="h-8 w-8 mb-2" />
            <p className="font-heading font-semibold">📍 Rento HQ — Dhanmondi, Dhaka</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
