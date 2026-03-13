import { CheckCircle2, MapPin, Phone, ShieldCheck, Zap, CreditCard, Users, Clock, DollarSign, BarChart3, FileText, Bookmark } from "lucide-react";

const rows = [
  {
    title: "Rental Marketplace",
    body: "Search and discover verified rental properties with real photos, accurate pricing, and location maps. No fake listings. No broker fees.",
    highlights: [
      { icon: ShieldCheck, label: "Verified Listings" },
      { icon: MapPin, label: "Location Filter" },
      { icon: Phone, label: "Direct Contact" },
    ],
    img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=350&fit=crop",
  },
  {
    title: "Smart Building Management",
    body: "Track service charge collections, building fund balances, resident contributions, and maintenance expenses — all in a single dashboard with charts and reports.",
    highlights: [
      { icon: BarChart3, label: "Pie Charts" },
      { icon: FileText, label: "Expense Logs" },
      { icon: Bookmark, label: "Fund Tracking" },
    ],
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=350&fit=crop",
  },
  {
    title: "Digital Rent Collection",
    body: "Landlords can collect rent digitally via bKash, Nagad, debit/credit cards, and internet banking — powered by SSLCommerz. Every payment is automatically recorded.",
    highlights: [
      { icon: CreditCard, label: "bKash" },
      { icon: DollarSign, label: "Nagad" },
      { icon: CheckCircle2, label: "Auto Records" },
    ],
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=350&fit=crop",
  },
  {
    title: "Home Services On-Demand",
    body: "Book trusted local service providers for plumbing, electrical, cleaning, painting, and more. Transparent pricing, verified workers, doorstep service.",
    highlights: [
      { icon: Users, label: "Verified Workers" },
      { icon: Zap, label: "Fast Booking" },
      { icon: Clock, label: "Transparent Pricing" },
    ],
    img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&h=350&fit=crop",
  },
];

const ServicesDetail = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground text-center mb-14">
        Our Services, In Detail
      </h2>
      <div className="space-y-16 max-w-5xl mx-auto">
        {rows.map((r, i) => (
          <div
            key={r.title}
            className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-10 items-center`}
          >
            <div className="flex-1">
              <img
                src={r.img}
                alt={r.title}
                className="rounded-card card-shadow w-full h-[260px] object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-heading font-bold text-foreground mb-3">{r.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-5">{r.body}</p>
              <div className="flex flex-wrap gap-3">
                {r.highlights.map((h) => (
                  <div key={h.label} className="flex items-center gap-2 bg-primary/5 text-primary rounded-full px-3 py-1.5 text-xs font-medium">
                    <h.icon className="h-3.5 w-3.5" />
                    {h.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesDetail;
