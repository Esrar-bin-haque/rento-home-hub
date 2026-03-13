import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free Plan",
    price: "0",
    subtitle: "Perfect to get started",
    features: [
      { text: "Up to 2 property listings", ok: true },
      { text: "Basic tenant records", ok: true },
      { text: "Manual payment tracking", ok: true },
      { text: "Email support", ok: true },
      { text: "Digital rent collection", ok: false },
      { text: "Building management dashboard", ok: false },
      { text: "Automated reminders", ok: false },
    ],
    cta: "Get Started Free",
    popular: false,
    variant: "outline" as const,
  },
  {
    name: "Pro Plan",
    price: "999",
    subtitle: "For active landlords",
    features: [
      { text: "Up to 20 property listings", ok: true },
      { text: "Full tenant management", ok: true },
      { text: "Digital rent collection (SSLCommerz)", ok: true },
      { text: "Automated payment reminders", ok: true },
      { text: "Expense tracking", ok: true },
      { text: "Priority support", ok: true },
      { text: "Building management dashboard", ok: false },
      { text: "Multi-building management", ok: false },
    ],
    cta: "Start Pro Plan",
    popular: true,
    variant: "default" as const,
  },
  {
    name: "Building Plan",
    price: "2,499",
    subtitle: "For building associations",
    features: [
      { text: "Unlimited property listings", ok: true },
      { text: "Full building management dashboard", ok: true },
      { text: "Service charge tracking", ok: true },
      { text: "Building fund management", ok: true },
      { text: "Pie charts & financial reports", ok: true },
      { text: "Multi-building support", ok: true },
      { text: "Dedicated account manager", ok: true },
      { text: "Custom branding", ok: true },
    ],
    cta: "Contact Sales",
    popular: false,
    variant: "secondary" as const,
  },
];

const PricingSection = () => (
  <section id="pricing" className="py-20 bg-card">
    <div className="container mx-auto px-4">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
          Simple, Transparent Pricing
        </h2>
        <p className="text-muted-foreground">Choose the plan that fits your needs. No hidden fees.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`relative rounded-card bg-card p-6 border ${
              p.popular ? "border-primary card-shadow scale-[1.02]" : "border-border"
            }`}
          >
            {p.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                Most Popular
              </div>
            )}
            <h3 className="font-heading font-semibold text-lg text-foreground">{p.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{p.subtitle}</p>
            <div className="mb-6">
              <span className="text-3xl font-heading font-bold text-foreground">BDT {p.price}</span>
              <span className="text-muted-foreground text-sm"> / month</span>
            </div>
            <ul className="space-y-2.5 mb-6">
              {p.features.map((f) => (
                <li key={f.text} className={`flex items-start gap-2 text-sm ${f.ok ? "text-foreground" : "text-muted-foreground/50"}`}>
                  {f.ok ? (
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground/30 flex-shrink-0 mt-0.5" />
                  )}
                  {f.text}
                </li>
              ))}
            </ul>
            <Button
              className={`w-full rounded-button ${
                p.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
              } ${p.variant === "secondary" ? "bg-foreground text-background hover:bg-foreground/90" : ""}`}
              variant={p.variant === "secondary" ? "default" : p.variant}
            >
              {p.cta}
            </Button>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground mt-8">
        All plans include a 14-day free trial. No credit card required.
      </p>
    </div>
  </section>
);

export default PricingSection;
