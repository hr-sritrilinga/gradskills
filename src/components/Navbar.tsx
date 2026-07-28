import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ApplicationFormModal } from "./ApplicationFormModal";


export default function Navbar({ 
  simple = false, 
  theme = "dark",
  onThemeChange,
  customBanner
}: { 
  simple?: boolean; 
  theme?: "dark" | "light" | string;
  onThemeChange?: (theme: "dark" | "light") => void;
  customBanner?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const isDark = theme === "dark" || theme === "home" || theme === "default";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    if (onThemeChange) {
      onThemeChange(isDark ? "light" : "dark");
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? isDark 
          ? "bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-lg" 
          : "bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm"
        : "bg-transparent"
    } font-sans`}>


      <div className={`mx-auto flex max-w-[1350px] items-center justify-between px-6 transition-all duration-500 ${scrolled ? "py-3" : "py-6"}`}>

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <img 
            src={isDark 
              ? "https://www.image2url.com/r2/default/images/1778127317902-a7e88d3f-f0eb-497d-b18f-24984d8f0ac9.png" 
              : "https://www.image2url.com/r2/default/images/1778152066419-1ba8578d-1152-47e0-adf6-5a96c3ed2cbd.png"
            } 
            alt="GradSkills" 
            className="h-12 w-auto object-contain transition-all duration-500"
          />
        </Link>

        {/* Desktop links */}
        {!simple && (
          <div className="hidden lg:flex items-center gap-8">
            <Link 
              to="/partner-with-us" 
              className={`text-[14px] font-semibold transition-colors ${isDark ? "text-white/70 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}
            >
              Partner with Us
            </Link>
          </div>
        )}

        {/* Action Group: Toggle + CTA */}
        {!simple && (
          <div className="hidden lg:flex items-center gap-6">
            <button onClick={() => setShowModal(true)} className="bg-home-gradient text-white px-8 py-3 rounded-2xl text-[14px] font-semibold transition-all hover:opacity-90 shadow-[0_0_20px_rgba(255,87,87,0.2)] hover:shadow-[0_0_30px_rgba(140,82,255,0.4)] hover:-translate-y-0.5">
              Apply Now
            </button>
          </div>
        )}

        {/* Mobile menu */}
        {!simple && (
          <div className="lg:hidden flex items-center gap-4">
            <button onClick={toggleTheme} className="hidden">
              {isDark ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
            </button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button className={`p-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                  <Menu className="h-7 w-7" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className={`w-[300px] border-l p-6 shadow-2xl ${isDark ? "bg-[#030712] border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"}`}>
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="mt-10 flex flex-col gap-6">
                  <Link
                    to="/partner-with-us"
                    onClick={() => setOpen(false)}
                    className={`text-[18px] font-semibold transition-colors ${isDark ? "text-white/70 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    Partner with Us
                  </Link>
                  <button
                    onClick={() => { setOpen(false); setShowModal(true); }}
                    className={`mt-8 w-full rounded-md px-6 py-4 text-[16px] font-semibold shadow-md transition-all ${isDark ? "bg-white text-black hover:bg-white/90" : "bg-slate-900 text-white hover:bg-slate-800"}`}
                  >
                    Apply Now
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
      <ApplicationFormModal open={showModal} onOpenChange={setShowModal} />
    </nav >
  );
}
