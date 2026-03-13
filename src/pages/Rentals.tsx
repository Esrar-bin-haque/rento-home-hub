import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, MapPin, Star, Heart, Bed, Bath, Maximize, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const listings = [
  { id: 1, name: "Modern 2BHK — Dhanmondi", area: "Dhanmondi, Dhaka", price: 25000, beds: 2, baths: 2, sqft: 850, rating: 4.8, reviews: 12, seed: 101 },
  { id: 2, name: "Spacious 3BHK — Gulshan", area: "Gulshan, Dhaka", price: 45000, beds: 3, baths: 3, sqft: 1400, rating: 4.9, reviews: 24, seed: 202 },
  { id: 3, name: "Cozy Studio — Banani", area: "Banani, Dhaka", price: 15000, beds: 1, baths: 1, sqft: 450, rating: 4.5, reviews: 8, seed: 303 },
  { id: 4, name: "Family Apartment — Bashundhara", area: "Bashundhara, Dhaka", price: 30000, beds: 3, baths: 2, sqft: 1200, rating: 4.7, reviews: 18, seed: 404 },
  { id: 5, name: "Premium Flat — Uttara", area: "Uttara, Dhaka", price: 35000, beds: 3, baths: 2, sqft: 1100, rating: 4.6, reviews: 15, seed: 505 },
  { id: 6, name: "Budget Room — Mirpur", area: "Mirpur, Dhaka", price: 8000, beds: 1, baths: 1, sqft: 300, rating: 4.3, reviews: 6, seed: 606 },
  { id: 7, name: "Luxury Penthouse — Gulshan", area: "Gulshan, Dhaka", price: 85000, beds: 4, baths: 4, sqft: 2200, rating: 5.0, reviews: 31, seed: 707 },
  { id: 8, name: "Furnished Flat — Mohakhali", area: "Mohakhali, Dhaka", price: 22000, beds: 2, baths: 1, sqft: 750, rating: 4.4, reviews: 10, seed: 808 },
  { id: 9, name: "River View — Wari", area: "Wari, Dhaka", price: 18000, beds: 2, baths: 1, sqft: 680, rating: 4.6, reviews: 14, seed: 909 },
  { id: 10, name: "New Build — Dhanmondi", area: "Dhanmondi, Dhaka", price: 28000, beds: 2, baths: 2, sqft: 900, rating: 4.7, reviews: 9, seed: 110 },
  { id: 11, name: "Student Flat — Banani", area: "Banani, Dhaka", price: 12000, beds: 1, baths: 1, sqft: 400, rating: 4.2, reviews: 5, seed: 211 },
  { id: 12, name: "Executive Suite — Uttara", area: "Uttara, Dhaka", price: 55000, beds: 3, baths: 3, sqft: 1600, rating: 4.8, reviews: 22, seed: 312 },
];

const Rentals = () => {
  const [location, setLocation] = useState("Dhaka");
  const [page, setPage] = useState(1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-6 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-stretch bg-card rounded-full border border-border card-shadow overflow-hidden max-w-3xl mx-auto">
            <div className="flex-1 px-5 py-3 border-b sm:border-b-0 sm:border-r border-border">
              <p className="text-[10px] font-medium text-muted-foreground uppercase">Location</p>
              <select className="text-sm font-medium bg-transparent outline-none w-full text-foreground" value={location} onChange={e => setLocation(e.target.value)}>
                {["Dhaka", "Chittagong", "Rajshahi", "Khulna"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-1 px-5 py-3 border-b sm:border-b-0 sm:border-r border-border">
              <p className="text-[10px] font-medium text-muted-foreground uppercase">Property Type</p>
              <select className="text-sm font-medium bg-transparent outline-none w-full text-foreground">
                {["Apartment", "House", "Room", "Studio"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex-1 px-5 py-3 border-b sm:border-b-0 sm:border-r border-border">
              <p className="text-[10px] font-medium text-muted-foreground uppercase">Budget</p>
              <input placeholder="BDT min – max" className="text-sm font-medium bg-transparent outline-none w-full text-foreground placeholder:text-muted-foreground" />
            </div>
            <Button className="m-2 rounded-full bg-primary text-primary-foreground px-6">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-[260px] flex-shrink-0">
            <div className="bg-card rounded-card card-shadow p-5 border border-border sticky top-24">
              <h3 className="font-heading font-semibold text-foreground mb-4">Filter Results</h3>
              <div className="space-y-5 text-sm">
                <div>
                  <p className="font-medium text-foreground mb-2">City</p>
                  {["Dhaka", "Chittagong", "Rajshahi", "Khulna"].map(c => (
                    <label key={c} className="flex items-center gap-2 py-1 text-muted-foreground cursor-pointer">
                      <input type="radio" name="city" defaultChecked={c === "Dhaka"} className="accent-primary" /> {c}
                    </label>
                  ))}
                </div>
                <div>
                  <p className="font-medium text-foreground mb-2">Bedrooms</p>
                  <div className="flex gap-2">
                    {["1", "2", "3", "4+"].map(b => (
                      <button key={b} className="px-3 py-1 rounded-button border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors text-xs">{b}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-2">Furnished</p>
                  <div className="flex gap-2">
                    {["Yes", "No"].map(f => (
                      <button key={f} className="px-3 py-1 rounded-button border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors text-xs">{f}</button>
                    ))}
                  </div>
                </div>
                <Button className="w-full rounded-button bg-primary text-primary-foreground text-xs">Apply Filters</Button>
                <button className="w-full text-xs text-muted-foreground hover:text-primary transition-colors">Reset</button>
              </div>
            </div>
          </aside>

          {/* Main grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">124</span> properties found in {location}</p>
              <select className="text-xs border border-border rounded-button px-3 py-1.5 bg-card text-foreground outline-none">
                <option>Newest</option>
                <option>Price Low–High</option>
                <option>Price High–Low</option>
              </select>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {listings.map(l => (
                <div key={l.id} className="bg-card rounded-card border border-border overflow-hidden hover-lift group">
                  <div className="relative">
                    <img src={`https://picsum.photos/seed/${l.seed}/400/250`} alt={l.name} className="w-full h-[200px] object-cover" loading="lazy" />
                    <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-medium px-2 py-0.5 rounded-full">Verified</span>
                    <span className="absolute top-3 right-10 bg-card/90 text-primary text-[10px] font-medium px-2 py-0.5 rounded-full">Available Now</span>
                    <button className="absolute top-3 right-3 text-card hover:text-destructive transition-colors">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-semibold text-foreground text-sm mb-1">{l.name}</h3>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3" />{l.area}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <Star className="h-3 w-3 text-accent fill-accent" />{l.rating} · {l.reviews} reviews
                    </p>
                    <p className="text-base font-bold text-foreground mb-2">BDT {l.price.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">/ month</span></p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1"><Bed className="h-3 w-3" />{l.beds} Beds</span>
                      <span className="flex items-center gap-1"><Bath className="h-3 w-3" />{l.baths} Baths</span>
                      <span className="flex items-center gap-1"><Maximize className="h-3 w-3" />{l.sqft} sqft</span>
                    </div>
                    <Button className="w-full rounded-button bg-primary text-primary-foreground text-xs h-9">View Details</Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-10">
              <Button variant="outline" size="sm" className="rounded-button text-xs" onClick={() => setPage(Math.max(1, page - 1))}>
                <ChevronLeft className="h-3 w-3 mr-1" />Previous
              </Button>
              {[1, 2, 3].map(p => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="sm"
                  className={`rounded-button text-xs w-8 ${p === page ? "bg-primary text-primary-foreground" : ""}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
              <Button variant="outline" size="sm" className="rounded-button text-xs" onClick={() => setPage(Math.min(3, page + 1))}>
                Next<ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Rentals;
