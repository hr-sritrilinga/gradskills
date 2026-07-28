import { CheckCircle2, ArrowRight, Rocket, TerminalSquare } from "lucide-react";
import { motion } from "framer-motion";
import { ApplicationFormModal } from "./ApplicationFormModal";
import { ContainerScroll } from "./ui/container-scroll-animation";
import DotGrid from "./DotGrid/DotGrid";

const productBuilder = {
  name: "AI Powered Product Builder",
  duration: "12 WEEKS",
  icon: Rocket,
  unit: "Focus: Web + App + AI Agents",
  outcome: "The elite, career-defining path",
  badge: "AI PRODUCT BUILDER",
  features: [
    "Live website deployed",
    "Cross-platform mobile app",
    "Two intelligent AI agents",
    "Portfolio + certification",
  ],
  button: "Become a Product Builder",
};

export default function PricingSection({ theme = "dark" }: { theme?: "dark" | "light" | string }) {
  const isDark = theme === "dark" || theme === "default" || theme === "home";

  return (
    <section id="programs" className={`relative w-full transition-colors duration-1000 ${isDark ? "bg-transparent text-white" : "bg-white text-slate-900"} px-6 font-sans overflow-visible`}>
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-home-gradient opacity-[0.07] blur-[120px] rounded-full transition-opacity ${!isDark && "opacity-[0.04]"}`} />
        <div className={`absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-home-gradient opacity-[0.07] blur-[120px] rounded-full transition-opacity ${!isDark && "opacity-[0.04]"}`} />

        {/* Interactive Dot Grid Pattern - Standardized Visibility */}
        <div className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000 opacity-80">
          <DotGrid
            baseColor={isDark ? "#1e293b" : "#e2e8f0"}
            activeColor="#8c52ff"
            dotSize={3}
            gap={30}
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <ContainerScroll
          titleComponent={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8 text-center max-w-3xl mx-auto"
            >
              <div className={`mb-8 inline-flex items-center gap-2 rounded-full border px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.2em] shadow-2xl backdrop-blur-md transition-colors ${isDark ? "border-white/10 bg-white/5 text-white/80" : "border-slate-200 bg-slate-50 text-slate-500"}`}>
                <TerminalSquare className="w-4 h-4 text-home-gradient" /> The Flagship Program
              </div>
              <h2 className={`mb-8 text-[40px] font-bold tracking-tight sm:text-[56px] lg:text-[72px] leading-[1.2] font-['Fira_Sans'] transition-colors ${isDark ? "text-white" : "text-slate-900"}`}>
                A Structured Path to <span className="relative inline-block text-home-gradient">
                  Build
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                    className="absolute -bottom-2 left-0 h-[4px] bg-home-gradient rounded-full"
                  />
                </span> <span className="text-home-gradient">Real Products.</span>
              </h2>
              <p className={`text-[18px] lg:text-[20px] font-medium max-w-2xl mx-auto leading-relaxed transition-colors ${isDark ? "text-white/60" : "text-slate-500"}`}>
                Stop practicing. Start building. The elite, career-defining path for the next generation of product engineers.
              </p>
            </motion.div>
          }
        >
          <div className="relative h-full w-full overflow-hidden">
            {/* Glowing Border Effect */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-home-gradient to-transparent rounded-[2rem] opacity-30 blur-sm" />
            <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-home-gradient to-transparent rounded-3xl opacity-30 blur-sm" />

            <div className={`relative h-full overflow-hidden border rounded-3xl backdrop-blur-xl shadow-2xl transition-colors ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
              <div className="h-full w-full">
                {/* --- PREMIUM MOBILE LAYOUT (App-style) --- */}
                <div className="lg:hidden flex flex-col h-full p-0">
                  {/* Header Area */}
                  <div className="relative bg-home-gradient p-8 pb-12 rounded-3xl overflow-hidden text-white shadow-lg">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-center mb-6">
                        <span className="bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm">
                          {productBuilder.badge}
                        </span>
                        <div className="flex flex-col items-end">
                           <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-0.5">Duration</span>
                           <span className="text-[12px] font-bold">{productBuilder.duration}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-[28px] font-bold leading-[1.1] mb-2 tracking-tight">
                        {productBuilder.name}
                      </h3>
                      <p className="text-white/70 text-[13px] font-medium mb-6">
                        {productBuilder.unit}
                      </p>

                      <div className="flex items-center gap-2 text-[14px] font-bold text-white italic">
                         <Rocket className="w-5 h-5 text-white animate-bounce" />
                         {productBuilder.outcome}
                      </div>
                    </div>

                    {/* Faded Large Icon */}
                    <productBuilder.icon className="absolute -right-6 bottom-0 w-36 h-36 text-white/10 -rotate-12 translate-y-6" />
                  </div>

                  {/* Body Area */}
                  <div className="p-8 pt-6 flex flex-col h-full">
                    <motion.div 
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={{
                        visible: { transition: { staggerChildren: 0.15 } }
                      }}
                      className="grid grid-cols-1 gap-5 mb-10"
                    >
                      {productBuilder.features.map((f, j) => (
                        <motion.div 
                          key={j} 
                          variants={{
                            hidden: { opacity: 0, x: -10 },
                            visible: { opacity: 1, x: 0 }
                          }}
                          className="flex items-center gap-4 group"
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                            <motion.div
                              initial={{ scale: 0, rotate: -20 }}
                              whileInView={{ scale: 1, rotate: 0 }}
                              transition={{ 
                                type: "spring", 
                                stiffness: 400, 
                                damping: 10,
                                delay: 0.3 + (j * 0.15) 
                              }}
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            </motion.div>
                          </div>
                          <span className={`text-[15px] font-semibold transition-colors ${isDark ? "text-white/80" : "text-slate-600"} leading-tight`}>
                            {f}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>

                    <div className="mt-auto space-y-6">
                      {/* Status Info */}
                      <div className={`flex items-center justify-center gap-4 p-4 rounded-xl border border-dashed transition-colors ${isDark ? "bg-white/[0.02] border-white/10" : "bg-slate-50 border-slate-200"}`}>
                        <div className="flex flex-col items-center">
                          <div className={`text-[9px] font-bold uppercase tracking-[0.3em] mb-1 transition-colors ${isDark ? "text-white/30" : "text-slate-400"}`}>Status</div>
                          <div className={`text-[14px] font-bold uppercase tracking-widest transition-colors ${isDark ? "text-white" : "text-slate-900"}`}>Enrolling Now</div>
                        </div>
                      </div>

                      <ApplicationFormModal>
                        <button className="w-full group flex items-center justify-center gap-3 bg-home-gradient text-white px-8 py-5 rounded-2xl font-semibold text-[17px] transition-all shadow-xl hover:opacity-90 active:scale-95">
                          {productBuilder.button} <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                        </button>
                      </ApplicationFormModal>
                    </div>
                  </div>
                </div>

                {/* --- ORIGINAL DESKTOP LAYOUT --- */}
                <div className="hidden lg:flex flex-row items-center gap-16 p-12 h-full">
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="px-5 py-2 rounded-full text-[12px] font-bold uppercase tracking-[0.2em] bg-home-gradient text-white shadow-lg">
                        {productBuilder.name}
                      </div>
                      <div className={`text-[14px] font-semibold uppercase tracking-widest transition-colors ${isDark ? "text-white/60" : "text-slate-400"}`}>
                        {productBuilder.duration}
                      </div>
                    </div>

                    <h3 className={`mb-6 text-[40px] font-bold leading-[1.2] font-['Fira_Sans'] transition-colors ${isDark ? "text-white" : "text-slate-900"}`}>
                      {productBuilder.outcome}
                    </h3>

                    <motion.div 
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={{
                        visible: { transition: { staggerChildren: 0.1 } }
                      }}
                      className="grid sm:grid-cols-2 gap-4 mb-10"
                    >
                      {productBuilder.features.map((f, j) => (
                        <motion.div 
                          key={j} 
                          variants={{
                            hidden: { opacity: 0, x: -20 },
                            visible: { opacity: 1, x: 0 }
                          }}
                          className="flex items-start gap-4 group"
                        >
                          <div className="w-6 h-6 rounded-full bg-home-gradient/20 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 mt-0.5">
                            <motion.div
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              transition={{ 
                                type: "spring", 
                                stiffness: 500, 
                                damping: 15,
                                delay: 0.5 + (j * 0.1) 
                              }}
                            >
                              <CheckCircle2 className={`w-3.5 h-3.5 transition-colors ${isDark ? "text-emerald-400" : "text-emerald-500"}`} />
                            </motion.div>
                          </div>
                          <span className={`text-[17px] font-medium transition-colors ${isDark ? "text-white/80" : "text-slate-600"} leading-tight`}>
                            {f}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>

                    <ApplicationFormModal>
                      <button className="w-full sm:w-auto group flex items-center justify-center gap-3 bg-home-gradient text-white px-10 py-5 rounded-2xl font-semibold text-[18px] transition-all shadow-[0_0_20px_rgba(255,87,87,0.2)] hover:shadow-[0_0_40px_rgba(140,82,255,0.4)] hover:-translate-y-1">
                        {productBuilder.button} <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                      </button>
                    </ApplicationFormModal>
                  </div>

                  <div className="lg:w-[320px] shrink-0">
                    <div className="relative aspect-square w-full lg:max-w-none mx-auto">
                      <div className="absolute inset-0 bg-home-gradient opacity-20 blur-[60px] rounded-full animate-pulse" />
                      <div className={`relative h-full w-full border rounded-[2.5rem] flex flex-col items-center justify-center backdrop-blur-md shadow-inner transition-colors ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200"}`}>
                        <productBuilder.icon className={`w-20 h-20 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-colors ${isDark ? "text-white" : "text-slate-900"}`} />
                        <div className="mt-6 text-center">
                          <div className={`text-[11px] font-semibold uppercase tracking-[0.3em] mb-1 transition-colors ${isDark ? "text-white/60" : "text-slate-400"}`}>Status</div>
                          <div className={`text-[16px] font-bold uppercase tracking-widest transition-colors ${isDark ? "text-white" : "text-slate-900"}`}>Enrolling Now</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ContainerScroll>
      </div>
    </section>
  );
}

