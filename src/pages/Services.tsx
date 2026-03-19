import { Search, Star, Wrench, Zap, Sparkles, Paintbrush, Snowflake, Bug, Hammer, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const Services = () => {
  const { t } = useLanguage();

  const categories = [
    { icon: Wrench, labelKey: "services.plumbing", color: "bg-primary/10 text-primary" },
    { icon: Zap, labelKey: "services.electrical", color: "bg-accent/10 text-accent" },
    { icon: Sparkles, labelKey: "services.cleaning", color: "bg-indigo/10 text-indigo" },
    { icon: Paintbrush, labelKey: "services.painting", color: "bg-pink/10 text-pink" },
    { icon: Snowflake, labelKey: "services.acRepair", color: "bg-blue-100 text-blue-600" },
    { icon: Bug, labelKey: "services.pestControl", color: "bg-orange-100 text-orange-600" },
    { icon: Hammer, labelKey: "services.carpentry", color: "bg-green-100 text-green-600" },
    { icon: Truck, labelKey: "services.movingHelp", color: "bg-purple-100 text-purple-600" },
  ];

  const providers = [
    { name: "Rahim Plumbing Services", serviceKey: "services.plumbing", rating: 4.8, reviews: 124, price: 500, seed: 1010 },
    { name: "Dhaka Electric Pro", serviceKey: "services.electrical", rating: 4.9, reviews: 89, price: 600, seed: 2020 },
    { name: "CleanHome BD", serviceKey: "services.cleaning", rating: 4.7, reviews: 203, price: 400, seed: 3030 },
    { name: "PaintMaster Dhaka", serviceKey: "services.painting", rating: 4.6, reviews: 67, price: 1500, seed: 4040 },
    { name: "CoolFix AC Repair", serviceKey: "services.acRepair", rating: 4.8, reviews: 156, price: 800, seed: 5050 },
    { name: "SafeHome Pest Control", serviceKey: "services.pestControl", rating: 4.5, reviews: 92, price: 1000, seed: 6060 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-10 pb-12 mesh-gradient">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-3">
            {t("services.heading")}
          </h1>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            {t("services.subheading")}
          </p>
          <div className="flex items-stretch bg-card rounded-full border border-border card-shadow overflow-hidden max-w-xl mx-auto">
            <input
              placeholder={t("services.whatService")}
              className="flex-1 px-5 py-3 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            />
            <div className="border-l border-border px-4 flex items-center">
              <select className="text-sm bg-transparent outline-none text-muted-foreground">
                {["Dhaka", "Chittagong", "Rajshahi", "Khulna"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <Button className="m-1.5 rounded-full bg-primary text-primary-foreground px-5">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-heading font-bold text-foreground text-center mb-8">{t("services.categories")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {categories.map(c => (
              <button key={c.labelKey} className="flex flex-col items-center gap-3 bg-card rounded-card border border-border p-5 hover-lift cursor-pointer">
                <div className={`w-12 h-12 rounded-xl ${c.color} flex items-center justify-center`}>
                  <c.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-foreground">{t(c.labelKey)}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-heading font-bold text-foreground text-center mb-8">{t("services.featured")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {providers.map(p => (
              <div key={p.name} className="bg-card rounded-card border border-border p-5 hover-lift">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={`https://picsum.photos/seed/${p.seed}/80/80`}
                    alt={p.name}
                    className="w-14 h-14 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div>
                    <h3 className="font-heading font-semibold text-foreground text-sm">{p.name}</h3>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary">{t(p.serviceKey)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <Star className="h-3 w-3 text-accent fill-accent" />
                  <span className="font-medium text-foreground">{p.rating}</span>
                  <span>({p.reviews} {t("services.reviews")})</span>
                </div>
                <p className="text-sm text-foreground mb-4">{t("services.from")} <span className="font-bold">BDT {p.price}</span></p>
                <Button className="w-full rounded-button bg-primary text-primary-foreground text-sm h-9">{t("services.bookNow")}</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
