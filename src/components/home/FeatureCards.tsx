import { Link } from "react-router-dom";
import { Search, Building2, Key, Wrench, ArrowRight } from "lucide-react";

const cards = [
  {
    icon: Search,
    title: "Rental Listings",
    desc: "Find or list verified rental properties across Bangladesh",
    route: "/rentals",
    tag: "124+ Listings",
    iconBg: "bg-[#E0F2FE]",
    iconColor: "text-primary",
    tagBg: "bg-primary/10 text-primary",
  },
  {
    icon: Building2,
    title: "Building Management",
    desc: "Manage service charges, building funds & residents digitally",
    route: "/building-management",
    tag: "Smart Dashboard",
    iconBg: "bg-[#EDE9FE]",
    iconColor: "text-indigo",
    tagBg: "bg-indigo/10 text-indigo",
  },
  {
    icon: Key,
    title: "Property Management",
    desc: "Track rent payments, tenants & income in one place",
    route: "/management",
    tag: "Auto Reminders",
    iconBg: "bg-[#FEF3C7]",
    iconColor: "text-accent",
    tagBg: "bg-accent/10 text-accent",
  },
  {
    icon: Wrench,
    title: "Home Services",
    desc: "Book verified plumbers, cleaners & repair experts on-demand",
    route: "/services",
    tag: "8 Service Types",
    iconBg: "bg-[#FCE7F3]",
    iconColor: "text-pink",
    tagBg: "bg-pink/10 text-pink",
  },
];

const FeatureCards = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
          Everything You Need, In One Platform
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Built for landlords, renters, and building associations across Bangladesh
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {cards.map((c) => (
          <Link
            key={c.route}
            to={c.route}
            className="group bg-card border border-[#F1F5F9] rounded-card p-7 cursor-pointer transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:scale-[1.02]"
            style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
          >
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${c.iconBg} mb-5`}>
              <c.icon className={`h-7 w-7 ${c.iconColor}`} />
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-2">{c.title}</h3>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{c.desc}</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${c.tagBg}`}>
              {c.tag}
            </span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default FeatureCards;
