import { useState } from "react";
import { Layers, Terminal, Smartphone, Bot, Rocket, ArrowRight, Sun, Moon } from "lucide-react";
import DotGrid from "./DotGrid/DotGrid";
import { ApplicationFormModal } from "./ApplicationFormModal";

export default function BridgeSection({ theme = "dark" }: { theme?: "dark" | "light" | string }) {
    const isDark = theme === "dark" || theme === "default" || theme === "home";

    const flowSteps = [
        {
            phase: "PHASE 01",
            icon: Terminal,
            title: "The Learner",
            desc: "Knowing syntax but didn't build real projects. We bridge the gap from coder to builder.",
            skills: ["Syntax Mastery", "Logic Patterns", "Git Workflow", "Problem Solving"],
            outcome: "Logic Foundation"
        },
        {
            phase: "PHASE 02",
            icon: Layers,
            title: "Web Dev with AI",
            desc: "Building a complex live web app using AI tools for rapid, high-quality production.",
            skills: ["React Systems", "AI Orchestration", "Backend Logic", "Live Deployment"],
            outcome: "Full-Stack Web"
        },
        {
            phase: "PHASE 03",
            icon: Smartphone,
            title: "App Deployment",
            desc: "Shipping cross-platform mobile apps for real users with native performance.",
            skills: ["Cross-Platform", "UX Engineering", "Auth Systems", "App Store Ship"],
            outcome: "Production Apps"
        },
        {
            phase: "PHASE 04",
            icon: Bot,
            title: "Agentic AI",
            desc: "Creating automated workflows and intelligent agents that solve complex business tasks.",
            skills: ["LLM Agents", "Vector DBs", "RAG Pipeline", "Autonomous Flows"],
            outcome: "Agentic Systems"
        },
        {
            phase: "PHASE 05",
            icon: Rocket,
            title: "AI Powered Product Builder",
            desc: "Industry-ready and portfolio-equipped. Transition into elite engineering roles.",
            skills: ["Portfolio Polish", "Interview Prep", "Architecture", "Senior Lead"],
            outcome: "Elite Builder",
            isFinal: true
        }
    ];

    const trustIndicators = [
        "Project-Based",
        "Mentor-Led",
        "Production-Focused",
        "Industry-Aligned"
    ];

    return (
        <section id="bridge" className={`relative w-full transition-colors duration-1000 ${isDark ? "bg-[#030712] text-white" : "bg-white text-slate-900"} px-6 py-16 lg:py-24 font-sans overflow-hidden border-b ${isDark ? "border-white/5" : "border-slate-200"}`}>
            {/* Advanced Background Layering */}
            {/* Interactive Dot Grid Pattern - Standardized Visibility */}
            <div className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000 opacity-80">
                <DotGrid 
                    baseColor={isDark ? "#1e293b" : "#e2e8f0"}
                    activeColor="#8c52ff"
                    dotSize={3}
                    gap={30}
                />
            </div>
            
            <div className={`absolute top-0 left-1/4 w-[600px] h-[600px] bg-home-gradient opacity-[0.08] blur-[150px] rounded-full pointer-events-none transition-opacity duration-1000 ${!isDark && "opacity-[0.04]"}`} />
            <div className={`absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-home-gradient opacity-[0.08] blur-[150px] rounded-full pointer-events-none transition-opacity duration-1000 ${!isDark && "opacity-[0.04]"}`} />

            <div className="relative z-10 mx-auto max-w-[1440px]">
                
                {/* Elite Header Section */}
                <div className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                    <div className="max-w-4xl">
                        <div className="mb-8 inline-flex items-center gap-5">
                            <div className="w-12 h-[2px] bg-home-gradient rounded-full shadow-[0_0_10px_rgba(140,82,255,0.5)]" />
                            <span className={`text-[12px] font-bold uppercase tracking-[0.6em] transition-colors duration-1000 ${isDark ? "text-white/60" : "text-slate-400"}`}>
                                CURRICULUM FRAMEWORK
                            </span>
                        </div>
                        
                        <h2 className={`mb-6 text-[44px] sm:text-[56px] lg:text-[68px] font-bold leading-[1.3] font-['Fira_Sans',sans-serif] transition-colors duration-1000 ${isDark ? "text-white" : "text-slate-900"}`}>
                            From Fundamentals to <br />
                            <span className="inline-block overflow-visible pb-10 -mb-10">
                                <span className="text-home-gradient drop-shadow-[0_0_40px_rgba(140,82,255,0.4)]">Production Engineering</span>
                            </span>
                        </h2>
                        
                        <p className={`max-w-3xl text-[18px] sm:text-[20px] leading-relaxed font-medium mb-12 transition-colors duration-1000 ${isDark ? "text-white/50" : "text-slate-500"}`}>
                            A specialized engineering track built to bridge the gap between syntax and systems.
                        </p>

                        <div className={`flex flex-wrap gap-x-12 gap-y-6 py-6 border-y transition-colors duration-1000 ${isDark ? "border-white/5" : "border-slate-100"}`}>
                            {trustIndicators.map((text, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-home-gradient shadow-[0_0_15px_rgba(140,82,255,0.8)]" />
                                    <span className={`text-[13px] font-bold uppercase tracking-[0.3em] transition-colors duration-1000 ${isDark ? "text-white/60" : "text-slate-400"}`}>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Horizontal Roadmap Track */}
                <div className="relative pt-16">
                    <div className="flex flex-col lg:grid lg:grid-cols-5 gap-20 lg:gap-6 relative">
                        {/* Single Continuous Horizontal Gradient Line (Desktop) — connects all 5 phases */}
                        <div className="absolute top-[28px] left-[10%] right-[10%] h-[3px] z-0 hidden lg:block">
                            <div className="absolute inset-0 bg-home-gradient rounded-full" />
                            <div className="absolute inset-0 bg-home-gradient blur-[6px] opacity-60 rounded-full" />
                            <div className="absolute inset-0 bg-home-gradient blur-[14px] opacity-30 rounded-full" />
                        </div>

                        {/* Continuous Vertical Glowing Gradient Line (Mobile) */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-8 bottom-0 w-[3px] lg:hidden z-0">
                            <div className="absolute inset-0 bg-gradient-to-b from-[#ff5757] via-[#8c52ff] to-[#8c52ff]/20 rounded-full" />
                            <div className="absolute inset-0 bg-gradient-to-b from-[#ff5757] via-[#8c52ff] to-transparent blur-[6px] opacity-60" />
                            <div className="absolute inset-0 bg-gradient-to-b from-[#ff5757] via-[#8c52ff] to-transparent blur-[14px] opacity-30" />
                        </div>

                        {flowSteps.map((step, idx) => (
                            <div
                                key={idx}
                                className="relative w-full group"
                            >
                                <div className="relative z-10 mb-6 flex flex-col items-center">
                                    <div className={`text-[9px] font-bold tracking-[0.4em] uppercase mb-4 lg:absolute lg:-top-10 transition-all group-hover:text-home-gradient duration-1000 ${isDark ? "text-white/30" : "text-slate-300"}`}>
                                        {step.phase}
                                    </div>
                                    
                                    <div className="w-14 h-14 rounded-full bg-home-gradient flex items-center justify-center shadow-[0_0_25px_rgba(140,82,255,0.3)] group-hover:scale-110 transition-transform duration-500 relative z-10">
                                        <step.icon className="w-6 h-6 text-white drop-shadow-sm" />
                                    </div>

                                </div>

                                <div className={`flex flex-col border rounded-2xl p-6 h-full transition-all duration-1000 hover:border-home-gradient/20 backdrop-blur-xl relative overflow-hidden ${isDark ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]" : "bg-slate-50/50 border-slate-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50"}`}>
                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-home-gradient/40 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    
                                    <h3 className={`text-[18px] lg:text-[20px] font-bold mb-2 tracking-tight leading-none font-['Fira_Sans'] group-hover:text-home-gradient transition-colors duration-1000 ${isDark ? "text-white" : "text-slate-900"}`}>
                                        {step.title}
                                    </h3>
                                    <p className={`text-[13px] font-medium leading-relaxed mb-4 transition-colors duration-1000 ${isDark ? "text-white/60" : "text-slate-500"}`}>
                                        {step.desc}
                                    </p>

                                    <div className="space-y-2 mb-6 mt-auto">
                                        {step.skills?.map((skill, sIdx) => (
                                            <div key={sIdx} className="flex items-start gap-3 group/item">
                                                <div className="w-1 h-1 rounded-full bg-home-gradient opacity-20 group-hover/item:opacity-100 group-hover/item:scale-125 transition-all duration-500 mt-1.5" />
                                                <span className={`text-[12px] font-semibold transition-colors duration-1000 tracking-tight ${isDark ? "text-white/30 group-hover/item:text-white/60" : "text-slate-400 group-hover/item:text-slate-600"} leading-tight`}>{skill}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className={`mt-auto pt-4 border-t transition-colors duration-1000 ${isDark ? "border-white/5" : "border-slate-100"}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className={`text-[8px] font-bold uppercase tracking-[0.3em] mb-0.5 transition-colors duration-1000 ${isDark ? "text-white/30" : "text-slate-300"}`}>Target Outcome</span>
                                                <span className="text-[11px] font-bold text-home-gradient uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">{step.outcome}</span>
                                            </div>
                                            <ArrowRight className={`w-3.5 h-3.5 transition-all duration-1000 group-hover:text-home-gradient group-hover:translate-x-1 ${isDark ? "text-white/30" : "text-slate-200"}`} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`mt-20 flex flex-col lg:flex-row items-center justify-between py-12 px-10 border rounded-2xl backdrop-blur-3xl gap-8 transition-colors duration-1000 ${isDark ? "bg-white/[0.01] border-white/5" : "bg-slate-50/50 border-slate-200"}`}>
                    <div className="text-left max-w-xl">
                        <div className="inline-block px-4 py-1 rounded-full bg-home-gradient/10 border border-home-gradient/20 text-[11px] font-bold text-home-gradient tracking-[0.3em] uppercase mb-5">Program Assessment</div>
                        <div className={`text-[24px] sm:text-[28px] font-bold leading-tight tracking-tight font-['Fira_Sans'] transition-colors duration-1000 ${isDark ? "text-white" : "text-slate-900"}`}>
                            Master the skills required to build <br className="hidden md:block" />
                            <span className="text-home-gradient">world-class software products.</span>
                        </div>
                    </div>
                    <ApplicationFormModal>
                        <button className="shrink-0 px-10 py-5 bg-home-gradient text-white rounded-2xl font-semibold text-[17px] transition-all hover:shadow-[0_0_50px_rgba(140,82,255,0.5)] hover:-translate-y-1 flex items-center gap-4 group">
                            Get Full Syllabus <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
                        </button>
                    </ApplicationFormModal>
                </div>
            </div>
        </section>
    );
}
