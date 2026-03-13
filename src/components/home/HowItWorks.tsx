import { UserPlus, Home, Monitor } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Create Your Account", desc: "Sign up as a landlord, renter, or building manager" },
  { icon: Home, title: "List or Find Property", desc: "Post your property or search from thousands of listings" },
  { icon: Monitor, title: "Manage Everything Digitally", desc: "Collect rent, track expenses, and manage tenants online" },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground text-center mb-14">
        How Rento Works
      </h2>
      <div className="flex flex-col md:flex-row items-start justify-center gap-8 md:gap-4 max-w-4xl mx-auto">
        {steps.map((s, i) => (
          <div key={i} className="flex-1 flex flex-col items-center text-center relative">
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-8 left-[60%] w-full border-t-2 border-dashed border-border" />
            )}
            <div className="relative z-10 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <s.icon className="h-7 w-7 text-primary" />
            </div>
            <span className="text-xs font-medium text-primary mb-2">Step {i + 1}</span>
            <h3 className="font-heading font-semibold text-foreground mb-1">{s.title}</h3>
            <p className="text-sm text-muted-foreground max-w-[220px]">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
