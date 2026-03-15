import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Lang = "en" | "bn";

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

const translations: Record<string, Record<Lang, string>> = {
  // Navbar
  "nav.rentals": { en: "Rentals", bn: "ভাড়া" },
  "nav.building": { en: "Building Management", bn: "বিল্ডিং ম্যানেজমেন্ট" },
  "nav.property": { en: "Property Management", bn: "প্রপার্টি ম্যানেজমেন্ট" },
  "nav.services": { en: "Services", bn: "সেবাসমূহ" },
  "nav.pricing": { en: "Pricing", bn: "মূল্য পরিকল্পনা" },
  "nav.login": { en: "Login", bn: "লগইন" },
  "nav.getStarted": { en: "Get Started", bn: "শুরু করুন" },

  // Hero
  "hero.smart": { en: "Smart", bn: "স্মার্ট" },
  "hero.title1": { en: "Bangladesh's Digital", bn: "বাংলাদেশের ডিজিটাল" },
  "hero.title2": { en: "Property Ecosystem", bn: "প্রপার্টি ইকোসিস্টেম" },
  "hero.subtitle": {
    en: "Find rentals, buy property, manage tenants, and book home services — all in one place.",
    bn: "ভাড়া খুঁজুন, সম্পত্তি কিনুন, ভাড়াটে পরিচালনা করুন এবং হোম সার্ভিস বুক করুন — সব এক জায়গায়।",
  },
  "hero.exploreRentals": { en: "Explore Rentals", bn: "ভাড়া দেখুন" },
  "hero.howItWorks": { en: "See How It Works", bn: "কীভাবে কাজ করে" },
  "hero.stat1": { en: "Rental Listings", bn: "ভাড়ার তালিকা" },
  "hero.stat2": { en: "Buildings Managed", bn: "বিল্ডিং পরিচালিত" },
  "hero.stat3": { en: "Cities Covered", bn: "শহরে সেবা" },
  "hero.statValue1": { en: "15,000+", bn: "১৫,০০০+" },
  "hero.statValue2": { en: "500+", bn: "৫০০+" },
  "hero.statValue3": { en: "4", bn: "৪টি" },

  // Dashboard mockup
  "hero.buildingOverview": { en: "Building Overview", bn: "বিল্ডিং ওভারভিউ" },
  "hero.totalUnits": { en: "Total Units", bn: "মোট ইউনিট" },
  "hero.rentCollected": { en: "Rent Collected", bn: "সংগৃহীত ভাড়া" },
  "hero.overdue": { en: "Overdue", bn: "বকেয়া" },
  "hero.buildingFund": { en: "Building Fund", bn: "বিল্ডিং ফান্ড" },
  "hero.flat": { en: "Flat", bn: "ফ্ল্যাট" },
  "hero.tenant": { en: "Tenant", bn: "ভাড়াটে" },
  "hero.status": { en: "Status", bn: "অবস্থা" },
  "hero.paid": { en: "Paid", bn: "পরিশোধিত" },
  "hero.overdueStat": { en: "Overdue", bn: "বকেয়া" },
  "hero.collectionVs": { en: "+12% collection vs last month", bn: "+১২% সংগ্রহ গত মাসের তুলনায়" },

  // Feature Cards
  "features.heading": { en: "Everything You Need, In One Platform", bn: "আপনার যা দরকার, একটি প্ল্যাটফর্মে" },
  "features.subheading": { en: "Built for landlords, renters, and building associations across Bangladesh", bn: "বাংলাদেশজুড়ে বাড়িওয়ালা, ভাড়াটে এবং বিল্ডিং অ্যাসোসিয়েশনের জন্য তৈরি" },
  "features.rentals.title": { en: "Rental Listings", bn: "ভাড়ার তালিকা" },
  "features.rentals.desc": { en: "Find or list verified rental properties across Bangladesh", bn: "বাংলাদেশজুড়ে যাচাইকৃত ভাড়ার সম্পত্তি খুঁজুন বা তালিকাভুক্ত করুন" },
  "features.rentals.tag": { en: "124+ Listings", bn: "১২৪+ তালিকা" },
  "features.building.title": { en: "Building Management", bn: "বিল্ডিং ম্যানেজমেন্ট" },
  "features.building.desc": { en: "Manage service charges, building funds & residents digitally", bn: "সার্ভিস চার্জ, বিল্ডিং ফান্ড এবং বাসিন্দাদের ডিজিটালভাবে পরিচালনা করুন" },
  "features.building.tag": { en: "Smart Dashboard", bn: "স্মার্ট ড্যাশবোর্ড" },
  "features.property.title": { en: "Property Management", bn: "প্রপার্টি ম্যানেজমেন্ট" },
  "features.property.desc": { en: "Track rent payments, tenants & income in one place", bn: "ভাড়া পেমেন্ট, ভাড়াটে এবং আয় একটি জায়গায় ট্র্যাক করুন" },
  "features.property.tag": { en: "Auto Reminders", bn: "অটো রিমাইন্ডার" },
  "features.services.title": { en: "Home Services", bn: "হোম সার্ভিস" },
  "features.services.desc": { en: "Book verified plumbers, cleaners & repair experts on-demand", bn: "যাচাইকৃত প্লাম্বার, ক্লিনার এবং মেরামত বিশেষজ্ঞ অন-ডিমান্ডে বুক করুন" },
  "features.services.tag": { en: "8 Service Types", bn: "৮ ধরনের সেবা" },

  // How It Works
  "how.heading": { en: "How Rento Works", bn: "রেন্টো কীভাবে কাজ করে" },
  "how.step1.title": { en: "Create Your Account", bn: "আপনার অ্যাকাউন্ট তৈরি করুন" },
  "how.step1.desc": { en: "Sign up as a landlord, renter, or building manager", bn: "বাড়িওয়ালা, ভাড়াটে বা বিল্ডিং ম্যানেজার হিসেবে সাইন আপ করুন" },
  "how.step2.title": { en: "List or Find Property", bn: "সম্পত্তি তালিকাভুক্ত বা খুঁজুন" },
  "how.step2.desc": { en: "Post your property or search from thousands of listings", bn: "আপনার সম্পত্তি পোস্ট করুন বা হাজার হাজার তালিকা থেকে খুঁজুন" },
  "how.step3.title": { en: "Manage Everything Digitally", bn: "সবকিছু ডিজিটালি পরিচালনা করুন" },
  "how.step3.desc": { en: "Collect rent, track expenses, and manage tenants online", bn: "ভাড়া সংগ্রহ করুন, খরচ ট্র্যাক করুন এবং ভাড়াটে অনলাইনে পরিচালনা করুন" },
  "how.step": { en: "Step", bn: "ধাপ" },

  // About
  "about.label": { en: "About Rento", bn: "রেন্টো সম্পর্কে" },
  "about.heading": { en: "Built for Bangladesh's Property Market", bn: "বাংলাদেশের প্রপার্টি মার্কেটের জন্য তৈরি" },
  "about.body": {
    en: "Rento was founded by Muhammad Mushfiqur Rahman and Esrar Bin Haque with one mission — to bring Bangladesh's fragmented, offline property market into the digital age. From small landlords managing a single flat to building associations overseeing 50+ units, Rento gives everyone the tools they need to manage smarter.",
    bn: "রেন্টো একটি লক্ষ্য নিয়ে প্রতিষ্ঠিত হয়েছে — বাংলাদেশের বিচ্ছিন্ন, অফলাইন প্রপার্টি মার্কেটকে ডিজিটাল যুগে নিয়ে আসা। একটি ফ্ল্যাট পরিচালনাকারী ছোট বাড়িওয়ালা থেকে শুরু করে ৫০+ ইউনিটের বিল্ডিং অ্যাসোসিয়েশন পর্যন্ত, রেন্টো সবাইকে স্মার্ট ম্যানেজমেন্টের টুলস দেয়।",
  },
  "about.bullet1": { en: "Verified listings across 4 major cities", bn: "৪টি প্রধান শহরে যাচাইকৃত তালিকা" },
  "about.bullet2": { en: "Digital rent collection via bKash, Nagad & cards", bn: "বিকাশ, নগদ ও কার্ডের মাধ্যমে ডিজিটাল ভাড়া সংগ্রহ" },
  "about.bullet3": { en: "Transparent building fund management", bn: "স্বচ্ছ বিল্ডিং ফান্ড ম্যানেজমেন্ট" },
  "about.learnMore": { en: "Learn More About Us →", bn: "আমাদের সম্পর্কে আরও জানুন →" },

  // Services Detail
  "servicesDetail.heading": { en: "Our Services, In Detail", bn: "আমাদের সেবাসমূহ, বিস্তারিত" },
  "servicesDetail.row1.title": { en: "Rental Marketplace", bn: "ভাড়ার মার্কেটপ্লেস" },
  "servicesDetail.row1.body": { en: "Search and discover verified rental properties with real photos, accurate pricing, and location maps. No fake listings. No broker fees.", bn: "বাস্তব ছবি, সঠিক মূল্য এবং লোকেশন ম্যাপসহ যাচাইকৃত ভাড়ার সম্পত্তি খুঁজুন। কোনো নকল তালিকা নেই। কোনো দালাল ফি নেই।" },
  "servicesDetail.row2.title": { en: "Smart Building Management", bn: "স্মার্ট বিল্ডিং ম্যানেজমেন্ট" },
  "servicesDetail.row2.body": { en: "Track service charge collections, building fund balances, resident contributions, and maintenance expenses — all in a single dashboard with charts and reports.", bn: "সার্ভিস চার্জ সংগ্রহ, বিল্ডিং ফান্ড ব্যালেন্স, বাসিন্দাদের অবদান এবং রক্ষণাবেক্ষণ খরচ — সব একটি ড্যাশবোর্ডে চার্ট ও রিপোর্টসহ ট্র্যাক করুন।" },
  "servicesDetail.row3.title": { en: "Digital Rent Collection", bn: "ডিজিটাল ভাড়া সংগ্রহ" },
  "servicesDetail.row3.body": { en: "Landlords can collect rent digitally via bKash, Nagad, debit/credit cards, and internet banking — powered by SSLCommerz. Every payment is automatically recorded.", bn: "বাড়িওয়ালারা বিকাশ, নগদ, ডেবিট/ক্রেডিট কার্ড এবং ইন্টারনেট ব্যাংকিংয়ের মাধ্যমে ডিজিটালি ভাড়া সংগ্রহ করতে পারেন — SSLCommerz দ্বারা চালিত। প্রতিটি পেমেন্ট স্বয়ংক্রিয়ভাবে রেকর্ড হয়।" },
  "servicesDetail.row4.title": { en: "Home Services On-Demand", bn: "অন-ডিমান্ড হোম সার্ভিস" },
  "servicesDetail.row4.body": { en: "Book trusted local service providers for plumbing, electrical, cleaning, painting, and more. Transparent pricing, verified workers, doorstep service.", bn: "প্লাম্বিং, ইলেকট্রিক্যাল, পরিষ্কার, রং করা এবং আরও অনেক কিছুর জন্য বিশ্বস্ত স্থানীয় সার্ভিস প্রোভাইডার বুক করুন। স্বচ্ছ মূল্য, যাচাইকৃত কর্মী, দরজায় সেবা।" },
  "servicesDetail.verifiedListings": { en: "Verified Listings", bn: "যাচাইকৃত তালিকা" },
  "servicesDetail.locationFilter": { en: "Location Filter", bn: "লোকেশন ফিল্টার" },
  "servicesDetail.directContact": { en: "Direct Contact", bn: "সরাসরি যোগাযোগ" },
  "servicesDetail.pieCharts": { en: "Pie Charts", bn: "পাই চার্ট" },
  "servicesDetail.expenseLogs": { en: "Expense Logs", bn: "খরচের লগ" },
  "servicesDetail.fundTracking": { en: "Fund Tracking", bn: "ফান্ড ট্র্যাকিং" },
  "servicesDetail.bKash": { en: "bKash", bn: "বিকাশ" },
  "servicesDetail.nagad": { en: "Nagad", bn: "নগদ" },
  "servicesDetail.autoRecords": { en: "Auto Records", bn: "অটো রেকর্ড" },
  "servicesDetail.verifiedWorkers": { en: "Verified Workers", bn: "যাচাইকৃত কর্মী" },
  "servicesDetail.fastBooking": { en: "Fast Booking", bn: "দ্রুত বুকিং" },
  "servicesDetail.transparentPricing": { en: "Transparent Pricing", bn: "স্বচ্ছ মূল্য" },

  // Pricing
  "pricing.heading": { en: "Simple, Transparent Pricing", bn: "সহজ ও স্বচ্ছ মূল্য পরিকল্পনা" },
  "pricing.subheading": { en: "Choose the plan that fits your needs. No hidden fees.", bn: "আপনার প্রয়োজন অনুযায়ী পরিকল্পনা বেছে নিন। কোনো লুকানো ফি নেই।" },
  "pricing.mostPopular": { en: "Most Popular", bn: "সবচেয়ে জনপ্রিয়" },
  "pricing.perMonth": { en: "/ month", bn: "/ মাস" },
  "pricing.trial": { en: "All plans include a 14-day free trial. No credit card required.", bn: "সকল পরিকল্পনায় ১৪ দিনের ফ্রি ট্রায়াল অন্তর্ভুক্ত। ক্রেডিট কার্ডের প্রয়োজন নেই।" },
  "pricing.plan1.name": { en: "Free Plan", bn: "ফ্রি পরিকল্পনা" },
  "pricing.plan1.subtitle": { en: "Perfect to get started", bn: "শুরু করার জন্য উপযুক্ত" },
  "pricing.plan1.cta": { en: "Get Started Free", bn: "ফ্রি শুরু করুন" },
  "pricing.plan2.name": { en: "Pro Plan", bn: "প্রো পরিকল্পনা" },
  "pricing.plan2.subtitle": { en: "For active landlords", bn: "সক্রিয় বাড়িওয়ালাদের জন্য" },
  "pricing.plan2.cta": { en: "Start Pro Plan", bn: "প্রো পরিকল্পনা শুরু করুন" },
  "pricing.plan3.name": { en: "Building Plan", bn: "বিল্ডিং পরিকল্পনা" },
  "pricing.plan3.subtitle": { en: "For building associations", bn: "বিল্ডিং অ্যাসোসিয়েশনের জন্য" },
  "pricing.plan3.cta": { en: "Contact Sales", bn: "সেলসে যোগাযোগ করুন" },
  "pricing.f1": { en: "Up to 2 property listings", bn: "সর্বোচ্চ ২টি সম্পত্তি তালিকা" },
  "pricing.f2": { en: "Basic tenant records", bn: "বেসিক ভাড়াটে রেকর্ড" },
  "pricing.f3": { en: "Manual payment tracking", bn: "ম্যানুয়াল পেমেন্ট ট্র্যাকিং" },
  "pricing.f4": { en: "Email support", bn: "ইমেইল সাপোর্ট" },
  "pricing.f5": { en: "Digital rent collection", bn: "ডিজিটাল ভাড়া সংগ্রহ" },
  "pricing.f6": { en: "Building management dashboard", bn: "বিল্ডিং ম্যানেজমেন্ট ড্যাশবোর্ড" },
  "pricing.f7": { en: "Automated reminders", bn: "অটোমেটেড রিমাইন্ডার" },
  "pricing.f8": { en: "Up to 20 property listings", bn: "সর্বোচ্চ ২০টি সম্পত্তি তালিকা" },
  "pricing.f9": { en: "Full tenant management", bn: "সম্পূর্ণ ভাড়াটে ম্যানেজমেন্ট" },
  "pricing.f10": { en: "Digital rent collection (SSLCommerz)", bn: "ডিজিটাল ভাড়া সংগ্রহ (SSLCommerz)" },
  "pricing.f11": { en: "Automated payment reminders", bn: "অটোমেটেড পেমেন্ট রিমাইন্ডার" },
  "pricing.f12": { en: "Expense tracking", bn: "খরচ ট্র্যাকিং" },
  "pricing.f13": { en: "Priority support", bn: "প্রায়োরিটি সাপোর্ট" },
  "pricing.f14": { en: "Multi-building management", bn: "মাল্টি-বিল্ডিং ম্যানেজমেন্ট" },
  "pricing.f15": { en: "Unlimited property listings", bn: "আনলিমিটেড সম্পত্তি তালিকা" },
  "pricing.f16": { en: "Full building management dashboard", bn: "সম্পূর্ণ বিল্ডিং ম্যানেজমেন্ট ড্যাশবোর্ড" },
  "pricing.f17": { en: "Service charge tracking", bn: "সার্ভিস চার্জ ট্র্যাকিং" },
  "pricing.f18": { en: "Building fund management", bn: "বিল্ডিং ফান্ড ম্যানেজমেন্ট" },
  "pricing.f19": { en: "Pie charts & financial reports", bn: "পাই চার্ট ও আর্থিক রিপোর্ট" },
  "pricing.f20": { en: "Multi-building support", bn: "মাল্টি-বিল্ডিং সাপোর্ট" },
  "pricing.f21": { en: "Dedicated account manager", bn: "ডেডিকেটেড অ্যাকাউন্ট ম্যানেজার" },
  "pricing.f22": { en: "Custom branding", bn: "কাস্টম ব্র্যান্ডিং" },

  // Footer
  "footer.tagline": { en: "Bangladesh's Digital Property Ecosystem", bn: "বাংলাদেশের ডিজিটাল প্রপার্টি ইকোসিস্টেম" },
  "footer.quickLinks": { en: "Quick Links", bn: "দ্রুত লিঙ্ক" },
  "footer.contact": { en: "Contact", bn: "যোগাযোগ করুন" },
  "footer.home": { en: "Home", bn: "হোম" },
  "footer.homeServices": { en: "Home Services", bn: "হোম সার্ভিস" },
  "footer.rights": { en: "© 2026 Rento. All rights reserved.", bn: "© ২০২৬ রেন্টো। সর্বস্বত্ব সংরক্ষিত।" },
  "footer.privacy": { en: "Privacy Policy", bn: "গোপনীয়তা নীতি" },
  "footer.terms": { en: "Terms of Service", bn: "সেবার শর্তাবলী" },

  // Dashboard (Building Management)
  "dash.dashboard": { en: "Dashboard", bn: "ড্যাশবোর্ড" },
  "dash.overview": { en: "Overview of your property portfolio", bn: "আপনার সম্পত্তির পোর্টফোলিওর সংক্ষিপ্ত বিবরণ" },
  "dash.totalMonthlyRent": { en: "Total Monthly Rent", bn: "মোট মাসিক ভাড়া" },
  "dash.rentCollected": { en: "Rent Collected", bn: "সংগৃহীত ভাড়া" },
  "dash.rentDue": { en: "Rent Due", bn: "বকেয়া ভাড়া" },
  "dash.totalExpenses": { en: "Total Expenses", bn: "মোট খরচ" },
  "dash.tenants": { en: "tenants", bn: "ভাড়াটে" },
  "dash.thisMonth": { en: "This month", bn: "এই মাস" },
  "dash.pending": { en: "pending", bn: "মুলতুবি" },
  "dash.entries": { en: "entries", bn: "এন্ট্রি" },
  "dash.rentTrend": { en: "Rent Collection Trend", bn: "ভাড়া সংগ্রহের ট্রেন্ড" },
  "dash.expenseBreakdown": { en: "Expense Breakdown", bn: "খরচের বিবরণ" },
  "dash.recentPayments": { en: "Recent Payments", bn: "সাম্প্রতিক পেমেন্ট" },
  "dash.tenant": { en: "Tenant", bn: "ভাড়াটে" },
  "dash.flat": { en: "Flat", bn: "ফ্ল্যাট" },
  "dash.amount": { en: "Amount", bn: "পরিমাণ" },
  "dash.method": { en: "Method", bn: "পদ্ধতি" },
  "dash.status": { en: "Status", bn: "অবস্থা" },
  "dash.paid": { en: "paid", bn: "পরিশোধিত" },
  "dash.due": { en: "due", bn: "বকেয়া" },
  "dash.logout": { en: "Log out", bn: "লগ আউট" },
  "dash.collected": { en: "Collected", bn: "সংগৃহীত" },

  // Building sidebar
  "dash.buildings": { en: "Buildings", bn: "বিল্ডিং" },
  "dash.flats": { en: "Flats", bn: "ফ্ল্যাট" },
  "dash.tenantsTab": { en: "Tenants", bn: "ভাড়াটে" },
  "dash.rentPayments": { en: "Rent Payments", bn: "ভাড়া পেমেন্ট" },
  "dash.expenses": { en: "Expenses", bn: "খরচ" },
  "dash.reports": { en: "Reports", bn: "রিপোর্ট" },
  "dash.notifications": { en: "Notifications", bn: "বিজ্ঞপ্তি" },
  "dash.settings": { en: "Settings", bn: "সেটিংস" },
  "dash.propertyOwnerDashboard": { en: "Property Owner Dashboard", bn: "সম্পত্তির মালিকের ড্যাশবোর্ড" },

  // Building sub-pages
  "dash.manageProperties": { en: "Manage your properties", bn: "আপনার সম্পত্তি পরিচালনা করুন" },
  "dash.addBuilding": { en: "Add Building", bn: "বিল্ডিং যোগ করুন" },
  "dash.buildingName": { en: "Building Name", bn: "বিল্ডিংয়ের নাম" },
  "dash.location": { en: "Location", bn: "অবস্থান" },
  "dash.totalFlats": { en: "Total Flats", bn: "মোট ফ্ল্যাট" },
  "dash.occupancy": { en: "Occupancy", bn: "দখল" },
  "dash.actions": { en: "Actions", bn: "কার্যক্রম" },
  "dash.allUnits": { en: "All units across your buildings", bn: "আপনার বিল্ডিংয়ের সকল ইউনিট" },
  "dash.addFlat": { en: "Add Flat", bn: "ফ্ল্যাট যোগ করুন" },
  "dash.building": { en: "Building", bn: "বিল্ডিং" },
  "dash.size": { en: "Size", bn: "আকার" },
  "dash.rent": { en: "Rent", bn: "ভাড়া" },
  "dash.occupied": { en: "Occupied", bn: "দখলকৃত" },
  "dash.vacant": { en: "Vacant", bn: "খালি" },
  "dash.allTenants": { en: "All registered tenants", bn: "সকল নিবন্ধিত ভাড়াটে" },
  "dash.addTenant": { en: "Add Tenant", bn: "ভাড়াটে যোগ করুন" },
  "dash.name": { en: "Name", bn: "নাম" },
  "dash.phone": { en: "Phone", bn: "ফোন" },
  "dash.since": { en: "Since", bn: "থেকে" },
  "dash.trackTransactions": { en: "Track all rent transactions", bn: "সকল ভাড়া লেনদেন ট্র্যাক করুন" },
  "dash.recordPayment": { en: "Record Payment", bn: "পেমেন্ট রেকর্ড করুন" },
  "dash.trackExpenses": { en: "Track building expenses", bn: "বিল্ডিংয়ের খরচ ট্র্যাক করুন" },
  "dash.addExpense": { en: "Add Expense", bn: "খরচ যোগ করুন" },
  "dash.date": { en: "Date", bn: "তারিখ" },
  "dash.description": { en: "Description", bn: "বিবরণ" },
  "dash.category": { en: "Category", bn: "ক্যাটাগরি" },
  "dash.manage": { en: "Manage your", bn: "পরিচালনা করুন আপনার" },
  "dash.underDevelopment": { en: "This section is under development. Check back soon!", bn: "এই বিভাগটি তৈরি হচ্ছে। শীঘ্রই আবার দেখুন!" },

  // Property Management specific
  "pm.propertyManagement": { en: "Property Management", bn: "প্রপার্টি ম্যানেজমেন্ট" },
  "pm.myProperties": { en: "My Properties", bn: "আমার সম্পত্তি" },
  "pm.rentRecords": { en: "Rent Records", bn: "ভাড়ার রেকর্ড" },
  "pm.reminders": { en: "Reminders", bn: "রিমাইন্ডার" },
  "pm.statements": { en: "Statements", bn: "স্টেটমেন্ট" },
  "pm.overviewProperties": { en: "Overview of your properties", bn: "আপনার সম্পত্তির সংক্ষিপ্ত বিবরণ" },
  "pm.myPropertiesLabel": { en: "My Properties", bn: "আমার সম্পত্তি" },
  "pm.monthlyIncome": { en: "Monthly Income", bn: "মাসিক আয়" },
  "pm.activeTenants": { en: "Active Tenants", bn: "সক্রিয় ভাড়াটে" },
  "pm.pendingDues": { en: "Pending Dues", bn: "মুলতুবি বকেয়া" },
  "pm.across4": { en: "Across 4 locations", bn: "৪টি অবস্থানে" },
  "pm.allActive": { en: "All active", bn: "সবাই সক্রিয়" },
  "pm.actionNeeded": { en: "Action needed", bn: "পদক্ষেপ প্রয়োজন" },
  "pm.incomeTrend": { en: "Income Collection Trend", bn: "আয় সংগ্রহের ট্রেন্ড" },
  "pm.manageRentals": { en: "Manage your rental properties", bn: "আপনার ভাড়ার সম্পত্তি পরিচালনা করুন" },
  "pm.addProperty": { en: "Add Property", bn: "সম্পত্তি যোগ করুন" },
  "pm.property": { en: "Property", bn: "সম্পত্তি" },
  "pm.allTenants": { en: "All your tenants", bn: "আপনার সকল ভাড়াটে" },
  "pm.allRentHistory": { en: "All rent payment history", bn: "সকল ভাড়া পেমেন্টের ইতিহাস" },
  "pm.upcomingReminders": { en: "Upcoming reminders & alerts", bn: "আসন্ন রিমাইন্ডার ও সতর্কতা" },
  "pm.addReminder": { en: "Add Reminder", bn: "রিমাইন্ডার যোগ করুন" },
  "pm.type": { en: "Type", bn: "ধরন" },

  // Rentals page
  "rentals.location": { en: "Location", bn: "অবস্থান" },
  "rentals.propertyType": { en: "Property Type", bn: "সম্পত্তির ধরন" },
  "rentals.budget": { en: "Budget", bn: "বাজেট" },
  "rentals.filterResults": { en: "Filter Results", bn: "ফিল্টার করুন" },
  "rentals.city": { en: "City", bn: "শহর" },
  "rentals.bedrooms": { en: "Bedrooms", bn: "বেডরুম" },
  "rentals.furnished": { en: "Furnished", bn: "আসবাবসহ" },
  "rentals.applyFilters": { en: "Apply Filters", bn: "ফিল্টার প্রয়োগ করুন" },
  "rentals.reset": { en: "Reset", bn: "রিসেট" },
  "rentals.propertiesFound": { en: "properties found in", bn: "টি সম্পত্তি পাওয়া গেছে" },
  "rentals.newest": { en: "Newest", bn: "সর্বশেষ" },
  "rentals.priceLH": { en: "Price Low–High", bn: "মূল্য কম–বেশি" },
  "rentals.priceHL": { en: "Price High–Low", bn: "মূল্য বেশি–কম" },
  "rentals.verified": { en: "Verified", bn: "যাচাইকৃত" },
  "rentals.availableNow": { en: "Available Now", bn: "পাওয়া যাচ্ছে" },
  "rentals.viewDetails": { en: "View Details", bn: "বিস্তারিত দেখুন" },
  "rentals.reviews": { en: "reviews", bn: "রিভিউ" },
  "rentals.beds": { en: "Beds", bn: "বেড" },
  "rentals.baths": { en: "Baths", bn: "বাথ" },
  "rentals.previous": { en: "Previous", bn: "আগের" },
  "rentals.next": { en: "Next", bn: "পরের" },
  "rentals.yes": { en: "Yes", bn: "হ্যাঁ" },
  "rentals.no": { en: "No", bn: "না" },

  // Services page
  "services.heading": { en: "Book Trusted Home Services", bn: "বিশ্বস্ত হোম সার্ভিস বুক করুন" },
  "services.subheading": { en: "Verified professionals at your doorstep", bn: "যাচাইকৃত পেশাদার আপনার দরজায়" },
  "services.whatService": { en: "What service do you need?", bn: "আপনার কোন সেবা প্রয়োজন?" },
  "services.categories": { en: "Service Categories", bn: "সেবার ক্যাটাগরি" },
  "services.featured": { en: "Featured Providers", bn: "বৈশিষ্ট্যযুক্ত প্রোভাইডার" },
  "services.bookNow": { en: "Book Now", bn: "এখনই বুক করুন" },
  "services.reviews": { en: "reviews", bn: "রিভিউ" },
  "services.from": { en: "From", bn: "শুরু" },
  "services.plumbing": { en: "Plumbing", bn: "প্লাম্বিং" },
  "services.electrical": { en: "Electrical", bn: "ইলেকট্রিক্যাল" },
  "services.cleaning": { en: "Cleaning", bn: "পরিষ্কার" },
  "services.painting": { en: "Painting", bn: "রং করা" },
  "services.acRepair": { en: "AC Repair", bn: "এসি মেরামত" },
  "services.pestControl": { en: "Pest Control", bn: "কীটনাশক" },
  "services.carpentry": { en: "Carpentry", bn: "কাঠমিস্ত্রি" },
  "services.movingHelp": { en: "Moving Help", bn: "মালামাল স্থানান্তর" },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem("rento-language");
      if (saved === "en" || saved === "bn") return saved;
    } catch {}
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("rento-language", lang);
    document.documentElement.style.fontFamily = lang === "bn"
      ? "'Hind Siliguri', 'Noto Sans Bengali', 'DM Sans', sans-serif"
      : "";
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);

  const t = (key: string): string => {
    return translations[key]?.[lang] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
