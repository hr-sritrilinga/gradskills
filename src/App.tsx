import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductBuilderProgram from "./pages/ProductBuilderProgram";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import ScrollToTop from "@/components/ScrollToTop";
import DotGrid from "./components/ui/DotGrid";
import ApplyMentor from "./pages/ApplyMentor";
import ApplyGradteer from "./pages/ApplyGradteer";
import PartnerWithUs from "./pages/PartnerWithUs";
import ApplyIntern from "./pages/ApplyIntern";
import Buildathon from "./pages/Buildathon";
import BuildathonAdmin from "./pages/BuildathonAdmin";
import ManusWorkshop from "./pages/ManusWorkshop";

const queryClient = new QueryClient();

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.error("Missing Clerk Publishable Key");
}

const App = () => (
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <div className="relative min-h-screen">
            {/* Base Background Color Layer */}
            <div className="fixed inset-0 bg-[#030712] -z-20" />
            
            {/* Global Background DotGrid Layer */}
            <div className="fixed inset-0 z-0 pointer-events-none">
              <DotGrid
                dotSize={3}
                gap={30}
                baseColor="#1e293b"
                activeColor="#8c52ff"
                className="opacity-40"
              />
            </div>
            {/* Overlay to mute dots and focus on content */}
            <div className="fixed inset-0 z-[1] pointer-events-none bg-[#030712]/50" />
            <div className="fixed inset-0 z-[2] pointer-events-none bg-gradient-to-b from-[#030712]/0 via-[#030712]/40 to-[#030712]/80" />

            {/* Main Content Layer */}
            <div className="relative z-10">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/product-builder" element={<ProductBuilderProgram />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/apply-mentor" element={<ApplyMentor />} />
                <Route path="/apply-gradteer" element={<ApplyGradteer />} />
                <Route path="/partner-with-us" element={<PartnerWithUs />} />
                <Route path="/apply-intern" element={<ApplyIntern />} />
                <Route path="/buildathon-2405" element={<Buildathon />} />
                <Route path="/buildathon-admin" element={<BuildathonAdmin />} />
                <Route path="/master-manus-ai" element={<ManusWorkshop />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;
