import { Link } from "react-router-dom";
import { Building2, TrendingUp, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 15000, suffix: "+", label: "Rental Listings" },
  { value: 500, suffix: "+", label: "Buildings Managed" },
  { value: 4, suffix: "", label: "Cities Covered" },
];

const CountUp = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span ref={ref} className="text-3xl md:text-4xl font-heading font-bold text-foreground">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const HeroSection = () => (
  <section className="relative min-h-screen mesh-gradient flex items-center pt-16">
    <div className="container mx-auto px-4 py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div className="animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight mb-6">
            <span className="relative inline-block">
              Smart
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 120 8" fill="none">
                <path d="M2 6C20 2 40 2 60 4C80 6 100 3 118 5" stroke="hsl(175,85%,32%)" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>{" "}
            Property &<br />
            Building Management
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg">
            Bangladesh's all-in-one platform for landlords, renters, and building managers. Find homes, collect rent, and manage buildings — digitally.
          </p>
          <div className="flex flex-wrap gap-4 mb-12">
            <Button asChild className="rounded-button px-6 py-3 text-base bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/rentals"><Search className="mr-2 h-4 w-4" />Explore Rentals</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-button px-6 py-3 text-base">
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </div>
          <div className="flex flex-wrap gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <CountUp target={s.value} suffix={s.suffix} />
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — dashboard mockup */}
        <div className="hidden lg:block animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="bg-card rounded-card card-shadow p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="font-heading font-semibold text-sm">Building Overview</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: "Total Units", value: "24", color: "bg-indigo/10 text-indigo" },
                { label: "Rent Collected", value: "৳4,80,000", color: "bg-primary/10 text-primary" },
                { label: "Overdue", value: "3", color: "bg-destructive/10 text-destructive" },
                { label: "Building Fund", value: "৳1,85,000", color: "bg-accent/10 text-accent" },
              ].map((s) => (
                <div key={s.label} className={`rounded-lg p-3 ${s.color}`}>
                  <p className="text-xs opacity-70">{s.label}</p>
                  <p className="text-lg font-bold">{s.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-secondary">
                  <tr>
                    <th className="text-left p-2 font-medium text-muted-foreground">Flat</th>
                    <th className="text-left p-2 font-medium text-muted-foreground">Tenant</th>
                    <th className="text-left p-2 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { flat: "A1", tenant: "Rahim U.", status: "Paid" },
                    { flat: "B1", tenant: "Kamal H.", status: "Overdue" },
                    { flat: "C2", tenant: "Fatema B.", status: "Paid" },
                  ].map((r) => (
                    <tr key={r.flat} className="border-t border-border">
                      <td className="p-2 font-medium">{r.flat}</td>
                      <td className="p-2 text-muted-foreground">{r.tenant}</td>
                      <td className="p-2">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            r.status === "Paid"
                              ? "bg-primary/10 text-primary"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs text-primary font-medium">
              <TrendingUp className="h-3 w-3" />
              <span>+12% collection vs last month</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
