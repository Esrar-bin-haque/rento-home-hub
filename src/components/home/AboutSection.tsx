import { Check } from "lucide-react";

const AboutSection = () => (
  <section className="py-20 bg-card">
    <div className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
        <div>
          <span className="text-sm font-medium text-primary tracking-wide uppercase">About Rento</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mt-2 mb-4">
            Built for Bangladesh's Property Market
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Rento was founded by Muhammad Mushfiqur Rahman and Esrar Bin Haque with one mission — to bring Bangladesh's fragmented, offline property market into the digital age. From small landlords managing a single flat to building associations overseeing 50+ units, Rento gives everyone the tools they need to manage smarter.
          </p>
          <ul className="space-y-3 mb-6">
            {[
              "Verified listings across 4 major cities",
              "Digital rent collection via bKash, Nagad & cards",
              "Transparent building fund management",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3 text-sm text-foreground">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                {t}
              </li>
            ))}
          </ul>
          <a href="#" className="text-sm font-medium text-primary hover:underline">Learn More About Us →</a>
        </div>
        <div className="rounded-card overflow-hidden card-shadow">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop"
            alt="Dhaka cityscape"
            className="w-full h-[340px] object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;
