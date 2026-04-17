import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import PageTransition from "@/components/PageTransition";
import ErrorBoundary from "@/components/ErrorBoundary";
import OrgGuard from "@/components/OrgGuard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Rentals from "./pages/Rentals";
import BuildingManagement from "./pages/BuildingManagement";
import PropertyManagement from "./pages/PropertyManagement";
import PropertyDetail from "./pages/PropertyDetail";
import PropertyEdit from "./pages/PropertyEdit";
import TenantDetail from "./pages/TenantDetail";
import TenantEdit from "./pages/TenantEdit";
import UnitDetail from "./pages/UnitDetail";
import UnitEdit from "./pages/UnitEdit";
import Services from "./pages/Services";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import CreateOrg from "./pages/CreateOrg";
import { useEffect } from "react";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const noFooterRoutes = ["/building-management", "/management", "/login", "/register"];

const AppRoutes = () => {
  const { pathname } = useLocation();
  const showFooter = !noFooterRoutes.includes(pathname);

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <div className="pt-[60px]">
        <PageTransition>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/rentals" element={<Rentals />} />
            <Route path="/building-management" element={<ErrorBoundary><BuildingManagement /></ErrorBoundary>} />
            <Route path="/management" element={<ErrorBoundary><OrgGuard><PropertyManagement /></OrgGuard></ErrorBoundary>} />
            <Route path="/management/property/:id" element={<ErrorBoundary><OrgGuard><PropertyDetail /></OrgGuard></ErrorBoundary>} />
            <Route path="/management/property/:id/edit" element={<ErrorBoundary><OrgGuard><PropertyEdit /></OrgGuard></ErrorBoundary>} />
            <Route path="/management/tenant/:id" element={<ErrorBoundary><OrgGuard><TenantDetail /></OrgGuard></ErrorBoundary>} />
            <Route path="/management/tenant/:id/edit" element={<ErrorBoundary><OrgGuard><TenantEdit /></OrgGuard></ErrorBoundary>} />
            <Route path="/management/unit/:id" element={<ErrorBoundary><OrgGuard><UnitDetail /></OrgGuard></ErrorBoundary>} />
            <Route path="/management/unit/:id/edit" element={<ErrorBoundary><OrgGuard><UnitEdit /></OrgGuard></ErrorBoundary>} />
            <Route path="/services" element={<Services />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/orgs/new" element={<CreateOrg />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
        {showFooter && <Footer />}
      </div>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
