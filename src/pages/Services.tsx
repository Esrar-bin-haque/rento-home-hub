import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Star, Wrench, Zap, Sparkles, Paintbrush, Snowflake, Bug, Hammer, Truck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  { icon: Wrench, label: "Plumbing", color: "bg-primary/10 text-primary" },
  { icon: Zap, label: "Electrical", color: "bg-accent/10 text-accent" },
  { icon: Sparkles, label: "Cleaning", color: "bg-indigo/10 text-indigo" },
  { icon: Paintbrush, label: "Painting", color: "bg-pink/10 text-pink" },
  { icon: Snowflake, label: "AC Repair", color: "bg-blue-100 text-blue-600" },
  { icon: Bug, label: "Pest Control", color: "bg-orange-100 text-orange-600" },
  { icon: Hammer, label: "Carpentry", color: "bg-green-100 text-green-600" },
  { icon: Truck, label: "Moving Help", color: "bg-purple-100 text-purple-600" },
];

const providers = [
  { name: "Rahim Plumbing Services", service: "Plumbing", rating: 4.8, reviews: 124, price: 500, seed: 1010 },
  { name: "Dhaka Electric Pro", service: "Electrical", rating: 4.9, reviews: 89, price: 600, seed: 2020 },
  { name: "CleanHome BD", service: "Cleaning", rating: 4.7, reviews: 203, price: 400, seed: 3030 },
  { name: "PaintMaster Dhaka", service: "Painting", rating: 4.6, reviews: 67, price: 1500, seed: 4040 },
  { name: "CoolFix AC Repair", service: "AC Repair", rating: 4.8, reviews: 156, price: 800, seed: 5050 },
  { name: "SafeHome Pest Control", service: "Pest Control", rating: 4.5, reviews: 92, price: 1000, seed: 6060 },
];

const Services = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero */}
    <section className="pt-24 pb-12 mesh-gradient">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-3">
          Book Trusted Home Services
        </h1>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          Verified professionals at your doorstep
        </p>
        <div className="flex items-stretch bg-card rounded-full border border-border card-shadow overflow-hidden max-w-xl mx-auto">
          <input
            placeholder="What service do you need?"
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

    {/* Categories */}
    <section className="py-14">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-heading font-bold text-foreground text-center mb-8">Service Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {categories.map(c => (
            <button key={c.label} className="flex flex-col items-center gap-3 bg-card rounded-card border border-border p-5 hover-lift cursor-pointer">
              <div className={`w-12 h-12 rounded-xl ${c.color} flex items-center justify-center`}>
                <c.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-foreground">{c.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>

    {/* Providers */}
    <section className="py-14 bg-card">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-heading font-bold text-foreground text-center mb-8">Featured Providers</h2>
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
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary">{p.service}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                <Star className="h-3 w-3 text-accent fill-accent" />
                <span className="font-medium text-foreground">{p.rating}</span>
                <span>({p.reviews} reviews)</span>
              </div>
              <p className="text-sm text-foreground mb-4">From <span className="font-bold">BDT {p.price}</span></p>
              <Button className="w-full rounded-button bg-primary text-primary-foreground text-sm h-9">Book Now</Button>
            </div>
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default Services;
