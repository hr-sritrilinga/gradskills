import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, ArrowRight, CheckCircle2, Terminal, LineChart, Globe, Cpu } from "lucide-react";
import { ApplicationFormModal } from "./ApplicationFormModal";
import DotGrid from "./DotGrid/DotGrid";
import TechMarquee from "./TechMarquee";

export default function HeroSection({ theme = "dark" }: { theme?: "dark" | "light" | string }) {
  const isDark = theme === "dark" || theme === "default" || theme === "home";

  return (
    <section className={`relative w-full min-h-[100vh] flex items-center overflow-hidden font-sans transition-colors duration-1000 ${isDark ? "text-white" : "text-slate-900"}`}>
      <div className="absolute inset-0 z-0 transition-opacity duration-1000 opacity-80 pointer-events-none">
        <DotGrid
          baseColor={isDark ? "#1e293b" : "#e2e8f0"}
          activeColor="#8c52ff"
          dotSize={3}
          gap={30}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1300px] px-6 lg:px-12 w-full pt-[140px] pb-16 flex flex-col items-center text-center">
        <div className="w-full flex flex-col items-center">
          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-10"
          >
            <div className={`inline-flex items-center px-6 py-2.5 rounded-full border backdrop-blur-xl shadow-lg transition-all duration-1000 ${isDark ? "bg-white/5 border-white/10 shadow-white/5" : "bg-slate-500/5 border-slate-200 shadow-slate-200/50"}`}>
              <span className="text-home-gradient font-bold uppercase tracking-[0.2em] text-[12px] sm:text-[13px] font-['Fira_Sans']">
                AI Powered Product Builder
              </span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h1 className={`text-[36px] sm:text-[64px] lg:text-[84px] font-medium leading-[1.2] tracking-tight mb-8 font-['Fira_Sans'] transition-colors duration-1000 ${isDark ? "text-white" : "text-slate-900"}`}>
              <span className="whitespace-nowrap">From Classroom Grad</span> <br />
              <span className="text-home-gradient font-medium">to AI Product Builder</span>
            </h1>
            <p className={`text-[13px] sm:text-[15px] max-w-[1000px] mx-auto text-center leading-relaxed font-light uppercase tracking-[0.25em] font-['Fira_Sans'] transition-colors duration-1000 ${isDark ? "text-white/60" : "text-slate-500"} lg:whitespace-nowrap`}>
              Master the skills to build and ship production-ready products.
            </p>
          </motion.div>
 
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center justify-center gap-10 mb-16 mt-12 w-full"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-10">
              <ApplicationFormModal>
                <button className="bg-home-gradient text-white hover:opacity-90 px-10 py-4 rounded-2xl font-semibold text-[16px] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,87,87,0.2)] hover:shadow-[0_0_30px_rgba(140,82,255,0.4)] hover:-translate-y-1 w-full sm:w-auto justify-center">
                  Apply Now <ArrowRight className="w-4 h-4" />
                </button>
              </ApplicationFormModal>

              <div className="hidden sm:block w-[1px] h-10 bg-white/10"></div>

              <div className={`flex items-center gap-10 transition-colors duration-1000 ${isDark ? "text-white/80" : "text-slate-600"}`}>
                <div className="flex flex-col items-start">
                  <span className={`text-[11px] font-semibold uppercase tracking-widest mb-1 transition-colors duration-1000 ${isDark ? "text-white/40" : "text-slate-400"}`}>Start Date</span>
                  <span className={`text-[17px] font-bold transition-colors duration-1000 ${isDark ? "text-white" : "text-slate-900"}`}>01 July 2026</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className={`text-[11px] font-semibold uppercase tracking-widest mb-1 transition-colors duration-1000 ${isDark ? "text-white/40" : "text-slate-400"}`}>Start Time</span>
                  <span className={`text-[17px] font-bold transition-colors duration-1000 ${isDark ? "text-white" : "text-slate-900"}`}>10 AM IST</span>
                </div>
              </div>
            </div>
          </motion.div>

          <TechMarquee theme={theme} />

        </div>
      </div>
    </section>
  );
}
