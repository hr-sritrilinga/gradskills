import { motion } from "framer-motion";
import { Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import DotGrid from "./DotGrid/DotGrid";

export default function MentorSection({ theme = "dark" }: { theme?: "dark" | "light" | string }) {
    const isDark = theme === "dark" || theme === "default" || theme === "home";

    return (
        <section className={`relative w-full transition-colors duration-1000 px-6 py-24 lg:py-32 font-sans overflow-hidden border-b ${isDark ? "bg-transparent text-white border-white/5" : "bg-slate-50 text-slate-900 border-slate-200"}`}>
            {/* Interactive Dot Grid Pattern - Standardized Visibility */}
            <div className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000 opacity-80">
                <DotGrid 
                    baseColor={isDark ? "#1e293b" : "#e2e8f0"}
                    activeColor="#8c52ff"
                    dotSize={3}
                    gap={30}
                />
            </div>

            <div className="relative z-10 mx-auto max-w-[1300px]">
                <div className={`relative p-8 lg:p-16 rounded-[40px] border overflow-hidden backdrop-blur-xl transition-all duration-700 shadow-2xl ${isDark ? "bg-white/[0.02] border-white/10" : "bg-white border-slate-200"}`}>
                    {/* Glowing Accent */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-home-gradient opacity-[0.05] blur-[100px] rounded-full pointer-events-none" />
                    
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="max-w-2xl text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 rounded-full border border-[#8c52ff]/30 bg-[#8c52ff]/5 px-5 py-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#8c52ff] mb-8">
                                <Users className="w-4 h-4" /> Become a Knowledge Partner
                            </div>
                            <h2 className={`mb-6 text-[36px] sm:text-[48px] font-bold leading-tight tracking-tight transition-colors ${isDark ? "text-white" : "text-slate-900"}`}>
                                Become a <span className="text-home-gradient">Mentor.</span> <br />
                                Shape the builders of tomorrow.
                            </h2>
                            <p className={`text-[18px] lg:text-[20px] font-medium leading-relaxed transition-colors ${isDark ? "text-white/50" : "text-slate-500"}`}>
                                Join our network of experts from top tech companies. Share your experience, guide real-world projects, and build your professional legacy.
                            </p>
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link 
                                to="/apply-mentor" 
                                className="group flex items-center justify-center gap-3 bg-white text-black px-10 py-6 rounded-2xl font-semibold text-[20px] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:shadow-[0_20px_60px_rgba(140,82,255,0.3)]"
                            >
                                Apply as Mentor <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
