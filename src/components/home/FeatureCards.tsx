import { Link } from "react-router-dom";
import { Search, Building, Key, Wrench, ArrowRight } from "lucide-react";

const cards = [
  {
    icon: Search,
    title: "Rental Listings",
    desc: "Browse thousands of verified rental properties across Dhaka, Chittagong, Rajshahi & Khulna. Filter by price, location, and size.",
    route: "/rentals",
    color: "bg-primary/10",
    iconColor: "text-primary",
    accent: "bg-primary",
  },
  {
    icon: Building,
    title: "Building Management",
    desc: "Manage service charges, building funds, expenses, and residents — all from one smart dashboard.",
    route: "/building-management",
    color: "bg-indigo/10",
    iconColor: "text-indigo",
    accent: "bg-indigo",
  },
  {
    icon: Key,
    title: "Property Management",
    desc: "Track rent payments, manage tenant records, send automated reminders, and monitor your income.",
    route: "/management",
    color: "bg-accent/10",
    iconColor: "text-accent",
    accent: "bg-accent",
  },
  {
    icon: Wrench,
    title: "Home Services",
    desc: "Book verified plumbers, electricians, cleaners, and repair experts on-demand at your doorstep.",
    route: "/services",
    color: "bg-pink/10",
    iconColor: "text-pink",
    accent: "bg-pink",
  },
];

const FeatureCards = () => (
  <section className="py-20 bg-card">
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
            className="group relative bg-card border border-border rounded-card p-6 hover-lift cursor-pointer overflow-hidden"
          >
            {/* Subtle pattern */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${c.accent} opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2`} />
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${c.color} mb-4`}>
              <c.icon className={`h-6 w-6 ${c.iconColor} transition-transform group-hover:scale-110`} />
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-2">{c.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{c.desc}</p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
              Explore <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default FeatureCards;
