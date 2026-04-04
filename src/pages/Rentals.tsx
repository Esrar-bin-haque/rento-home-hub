import { useState, useMemo } from "react";
import { Search, MapPin, Star, Heart, Bed, Bath, Maximize, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const cityAreas: Record<string, string[]> = {
  Dhaka: ["Uttara", "Bashundhara", "Gulshan", "Banani", "Dhanmondi", "Mirpur", "Mohakhali", "Wari", "Motijheel", "Rampura", "Badda", "Khilgaon", "Shyamoli", "Lalmatia", "Panthapath", "Farmgate", "Tejgaon", "Maghbazar", "Malibagh", "Jatrabari"],
  Chittagong: ["Agrabad", "Nasirabad", "Halishahar", "Panchlaish", "Khulshi", "Bayazid", "Oxygen", "Muradpur", "Chawkbazar", "Chandgaon"],
  Rajshahi: ["Shaheb Bazar", "Uposhohor", "Rajpara", "Boalia", "Motihar", "Kazla"],
  Khulna: ["Sonadanga", "Khalishpur", "Daulatpur", "Boyra", "Nirala", "Gollamari"],
};

const listings = [
  { id: 1, name: "Modern 2BHK — Dhanmondi", area: "Dhanmondi", city: "Dhaka", price: 25000, beds: 2, baths: 2, sqft: 850, rating: 4.8, reviews: 12, seed: 101 },
  { id: 2, name: "Spacious 3BHK — Gulshan", area: "Gulshan", city: "Dhaka", price: 45000, beds: 3, baths: 3, sqft: 1400, rating: 4.9, reviews: 24, seed: 202 },
  { id: 3, name: "Cozy Studio — Banani", area: "Banani", city: "Dhaka", price: 15000, beds: 1, baths: 1, sqft: 450, rating: 4.5, reviews: 8, seed: 303 },
  { id: 4, name: "Family Apartment — Bashundhara", area: "Bashundhara", city: "Dhaka", price: 30000, beds: 3, baths: 2, sqft: 1200, rating: 4.7, reviews: 18, seed: 404 },
  { id: 5, name: "Premium Flat — Uttara", area: "Uttara", city: "Dhaka", price: 35000, beds: 3, baths: 2, sqft: 1100, rating: 4.6, reviews: 15, seed: 505 },
  { id: 6, name: "Budget Room — Mirpur", area: "Mirpur", city: "Dhaka", price: 8000, beds: 1, baths: 1, sqft: 300, rating: 4.3, reviews: 6, seed: 606 },
  { id: 7, name: "Luxury Penthouse — Gulshan", area: "Gulshan", city: "Dhaka", price: 85000, beds: 4, baths: 4, sqft: 2200, rating: 5.0, reviews: 31, seed: 707 },
  { id: 8, name: "Furnished Flat — Mohakhali", area: "Mohakhali", city: "Dhaka", price: 22000, beds: 2, baths: 1, sqft: 750, rating: 4.4, reviews: 10, seed: 808 },
  { id: 9, name: "River View — Wari", area: "Wari", city: "Dhaka", price: 18000, beds: 2, baths: 1, sqft: 680, rating: 4.6, reviews: 14, seed: 909 },
  { id: 10, name: "New Build — Dhanmondi", area: "Dhanmondi", city: "Dhaka", price: 28000, beds: 2, baths: 2, sqft: 900, rating: 4.7, reviews: 9, seed: 110 },
  { id: 11, name: "Student Flat — Banani", area: "Banani", city: "Dhaka", price: 12000, beds: 1, baths: 1, sqft: 400, rating: 4.2, reviews: 5, seed: 211 },
  { id: 12, name: "Executive Suite — Uttara", area: "Uttara", city: "Dhaka", price: 55000, beds: 3, baths: 3, sqft: 1600, rating: 4.8, reviews: 22, seed: 312 },
];

const Rentals = () => {
  const [city, setCity] = useState("Dhaka");
  const [area, setArea] = useState("");
  const [page, setPage] = useState(1);
  const { t } = useLanguage();

  const areas = cityAreas[city] || [];

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    setArea("");
    setPage(1);
  };

  const filtered = useMemo(() => {
    return listings.filter(l => {
      if (l.city !== city) return false;
      if (area && l.area !== area) return false;
      return true;
    });
  }, [city, area]);

  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-6 pb-6 bg-card border-b border-border">
        <div className="container mx-auto px-3 md:px-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-stretch bg-card rounded-2xl md:rounded-full border border-border card-shadow overflow-hidden max-w-4xl mx-auto">
            <div className="flex-1 px-4 md:px-5 py-3 border-b md:border-b-0 md:border-r border-border">
              <p className="text-[10px] font-medium text-muted-foreground uppercase">{t("rentals.city")}</p>
              <select className="text-sm font-medium bg-transparent outline-none w-full text-foreground" value={city} onChange={e => handleCityChange(e.target.value)}>
                {Object.keys(cityAreas).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-1 px-4 md:px-5 py-3 border-b md:border-b-0 md:border-r border-border">
              <p className="text-[10px] font-medium text-muted-foreground uppercase">{t("rentals.area")}</p>
              <select className="text-sm font-medium bg-transparent outline-none w-full text-foreground" value={area} onChange={e => { setArea(e.target.value); setPage(1); }}>
                <option value="">{t("rentals.allAreas")}</option>
                {areas.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className="flex-1 px-4 md:px-5 py-3 border-b md:border-b-0 md:border-r border-border">
              <p className="text-[10px] font-medium text-muted-foreground uppercase">{t("rentals.propertyType")}</p>
              <select className="text-sm font-medium bg-transparent outline-none w-full text-foreground">
                {["Apartment", "House", "Room", "Studio"].map(tt => <option key={tt}>{tt}</option>)}
              </select>
            </div>
            <div className="flex-1 px-4 md:px-5 py-3 border-b md:border-b-0 md:border-r border-border">
              <p className="text-[10px] font-medium text-muted-foreground uppercase">{t("rentals.budget")}</p>
              <input placeholder="BDT min – max" className="text-sm font-medium bg-transparent outline-none w-full text-foreground placeholder:text-muted-foreground" />
            </div>
            <Button className="m-2 rounded-full bg-primary text-primary-foreground px-6 w-full md:w-auto">
              <Search className="h-4 w-4 mr-2 md:mr-0" /><span className="md:hidden">Search</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 md:px-4 py-6 md:py-8">
        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowFilters(true)}
          className="lg:hidden w-full flex items-center justify-center gap-2 mb-4 py-3 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
        >
          <Search className="h-4 w-4" /> {t("rentals.filterResults")}
        </button>

        {/* Mobile filter bottom sheet */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setShowFilters(false)}>
            <div className="absolute inset-0 bg-black/30" />
            <div
              className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-center pt-2 pb-1">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-semibold text-foreground">{t("rentals.filterResults")}</h3>
                  <button onClick={() => setShowFilters(false)} className="p-1"><X className="h-5 w-5" /></button>
                </div>
                <div className="space-y-5 text-sm">
                  <div>
                    <p className="font-medium text-foreground mb-2">{t("rentals.city")}</p>
                    {Object.keys(cityAreas).map(c => (
                      <label key={c} className="flex items-center gap-2 py-1 text-muted-foreground cursor-pointer">
                        <input type="radio" name="city" checked={c === city} onChange={() => handleCityChange(c)} className="accent-primary" /> {c}
                      </label>
                    ))}
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-2">{t("rentals.area")}</p>
                    <select className="w-full text-sm border border-border rounded-button px-3 py-2 bg-card text-foreground outline-none" value={area} onChange={e => { setArea(e.target.value); setPage(1); }}>
                      <option value="">{t("rentals.allAreas")}</option>
                      {areas.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-2">{t("rentals.bedrooms")}</p>
                    <div className="flex gap-2">
                      {["1", "2", "3", "4+"].map(b => (
                        <button key={b} className="px-3 py-1.5 rounded-button border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors text-xs">{b}</button>
                      ))}
                    </div>
                  </div>
                  <div className="sticky bottom-0 bg-card pt-3 pb-2 flex gap-3">
                    <Button className="flex-1 rounded-button bg-primary text-primary-foreground text-sm h-11" onClick={() => setShowFilters(false)}>{t("rentals.applyFilters")}</Button>
                    <button className="text-sm text-muted-foreground hover:text-primary" onClick={() => { setArea(""); setPage(1); setShowFilters(false); }}>{t("rentals.reset")}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block lg:w-[260px] flex-shrink-0">
            <div className="bg-card rounded-card card-shadow p-5 border border-border sticky top-24">
              <h3 className="font-heading font-semibold text-foreground mb-4">{t("rentals.filterResults")}</h3>
              <div className="space-y-5 text-sm">
                <div>
                  <p className="font-medium text-foreground mb-2">{t("rentals.city")}</p>
                  {Object.keys(cityAreas).map(c => (
                    <label key={c} className="flex items-center gap-2 py-1 text-muted-foreground cursor-pointer">
                      <input type="radio" name="city" checked={c === city} onChange={() => handleCityChange(c)} className="accent-primary" /> {c}
                    </label>
                  ))}
                </div>
                <div>
                  <p className="font-medium text-foreground mb-2">{t("rentals.area")}</p>
                  <select className="w-full text-sm border border-border rounded-button px-3 py-1.5 bg-card text-foreground outline-none" value={area} onChange={e => { setArea(e.target.value); setPage(1); }}>
                    <option value="">{t("rentals.allAreas")}</option>
                    {areas.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-2">{t("rentals.bedrooms")}</p>
                  <div className="flex gap-2">
                    {["1", "2", "3", "4+"].map(b => (
                      <button key={b} className="px-3 py-1 rounded-button border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors text-xs">{b}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-2">{t("rentals.furnished")}</p>
                  <div className="flex gap-2">
                    {[t("rentals.yes"), t("rentals.no")].map(f => (
                      <button key={f} className="px-3 py-1 rounded-button border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors text-xs">{f}</button>
                    ))}
                  </div>
                </div>
                <Button className="w-full rounded-button bg-primary text-primary-foreground text-xs">{t("rentals.applyFilters")}</Button>
                <button className="w-full text-xs text-muted-foreground hover:text-primary transition-colors" onClick={() => { setArea(""); setPage(1); }}>{t("rentals.reset")}</button>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">{filtered.length}</span> {t("rentals.propertiesFound")} {city}{area ? `, ${area}` : ""}</p>
              <select className="text-xs border border-border rounded-button px-3 py-1.5 bg-card text-foreground outline-none">
                <option>{t("rentals.newest")}</option>
                <option>{t("rentals.priceLH")}</option>
                <option>{t("rentals.priceHL")}</option>
              </select>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map(l => (
                <div key={l.id} className="bg-card rounded-card border border-border overflow-hidden hover-lift group">
                  <div className="relative">
                    <img src={`https://picsum.photos/seed/${l.seed}/400/250`} alt={l.name} className="w-full h-[200px] object-cover" loading="lazy" />
                    <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-medium px-2 py-0.5 rounded-full">{t("rentals.verified")}</span>
                    <span className="absolute top-3 right-10 bg-card/90 text-primary text-[10px] font-medium px-2 py-0.5 rounded-full">{t("rentals.availableNow")}</span>
                    <button className="absolute top-3 right-3 text-card hover:text-destructive transition-colors">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-semibold text-foreground text-sm mb-1">{l.name}</h3>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3" />{l.area}, {l.city}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <Star className="h-3 w-3 text-accent fill-accent" />{l.rating} · {l.reviews} {t("rentals.reviews")}
                    </p>
                    <p className="text-base font-bold text-foreground mb-2">BDT {l.price.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">/ month</span></p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1"><Bed className="h-3 w-3" />{l.beds} {t("rentals.beds")}</span>
                      <span className="flex items-center gap-1"><Bath className="h-3 w-3" />{l.baths} {t("rentals.baths")}</span>
                      <span className="flex items-center gap-1"><Maximize className="h-3 w-3" />{l.sqft} sqft</span>
                    </div>
                    <Button className="w-full rounded-button bg-primary text-primary-foreground text-xs h-9">{t("rentals.viewDetails")}</Button>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg font-medium">No properties found in {area}, {city}</p>
                <p className="text-sm mt-1">Try selecting a different area or city.</p>
              </div>
            )}

            {filtered.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <Button variant="outline" size="sm" className="rounded-button text-xs" onClick={() => setPage(Math.max(1, page - 1))}>
                  <ChevronLeft className="h-3 w-3 mr-1" />{t("rentals.previous")}
                </Button>
                {[1].map(p => (
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
                <Button variant="outline" size="sm" className="rounded-button text-xs" onClick={() => setPage(Math.min(1, page + 1))}>
                  {t("rentals.next")}<ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Rentals;
