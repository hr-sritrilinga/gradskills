import { motion } from "framer-motion";
import { ApplicationFormModal } from "./ApplicationFormModal";

import DotGrid from "./DotGrid/DotGrid";

export default function ImpactSection({ theme = "dark" }: { theme?: "dark" | "light" | string }) {
  const isDark = theme === "dark" || theme === "default" || theme === "home";

  return (
    <section className={`relative w-full transition-colors duration-1000 px-6 py-32 lg:py-48 font-sans overflow-hidden ${isDark ? "bg-transparent text-white" : "bg-white text-slate-900"}`}>
      {/* Interactive Dot Grid Pattern - Standardized Visibility */}
      <div className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000 opacity-80">
          <DotGrid 
              baseColor={isDark ? "#1e293b" : "#e2e8f0"}
              activeColor="#8c52ff"
              dotSize={3}
              gap={30}
          />
      </div>
      {/* Background Ambient Glows */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#8c52ff]/5 blur-[150px] rounded-full pointer-events-none transition-opacity ${!isDark && "opacity-40"}`} />
      <div className={`absolute -top-20 -right-20 w-[400px] h-[400px] bg-[#ff5757]/5 blur-[100px] rounded-full pointer-events-none transition-opacity ${!isDark && "opacity-40"}`} />

      <div className="relative z-10 mx-auto max-w-[1200px] text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={`relative border rounded-[64px] p-10 sm:p-20 lg:p-32 shadow-[0_40px_100px_-20px_rgba(140,82,255,0.15)] overflow-hidden backdrop-blur-2xl group transition-colors duration-700 ${isDark ? "bg-white/[0.02] border-white/10" : "bg-slate-50 border-slate-200 shadow-slate-100"}`}
        >
          {/* Subtle Animated Gradients */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#ff5757]/10 rounded-full blur-[80px] group-hover:bg-[#ff5757]/20 transition-all duration-700" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#8c52ff]/10 rounded-full blur-[80px] group-hover:bg-[#8c52ff]/20 transition-all duration-700" />

          {/* Top Line Accent */}
          <div className="absolute top-0 inset-x-0 h-2 bg-home-gradient opacity-60" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h2 className={`mb-10 text-[42px] sm:text-[64px] lg:text-[72px] font-bold leading-[1] tracking-tight transition-colors ${isDark ? "text-white" : "text-slate-900"}`}>
              Stop Learning.<br />
              <span className="text-home-gradient">
                Start Shipping.
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h3 className={`mb-20 text-[24px] sm:text-[32px] lg:text-[40px] font-semibold leading-tight transition-colors ${isDark ? "text-white/40" : "text-slate-400"}`}>
              Change your interview narrative from:<br className="sm:hidden" />
              <span className={`sm:ml-3 relative inline-block mt-4 sm:mt-0 font-bold italic transition-colors ${isDark ? "text-white" : "text-slate-900"}`}>
                "Here is my code."
                <div className="absolute -bottom-3 left-0 w-full h-[4px] bg-home-gradient rounded-full shadow-[0_5px_15px_rgba(140,82,255,0.5)]" />
              </span>
            </h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <ApplicationFormModal>
              <motion.div
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="relative inline-flex group/btn cursor-pointer"
              >
                {/* Button Glow */}
                <div className="absolute -inset-2 bg-home-gradient rounded-2xl blur-lg opacity-30 group-hover/btn:opacity-60 transition duration-500" />

                <div className="relative inline-flex items-center justify-center bg-home-gradient text-white px-12 py-6 rounded-2xl font-semibold tracking-[0.2em] text-[18px] sm:text-[22px] uppercase shadow-2xl transition-transform duration-300">
                  Join the Next Cohort
                </div>
              </motion.div>
            </ApplicationFormModal>
          </motion.div>
          
          <p className={`mt-12 text-[14px] font-semibold tracking-[0.3em] uppercase transition-colors ${isDark ? "text-white/20" : "text-slate-300"}`}>
            Limited Seats. Application Required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
