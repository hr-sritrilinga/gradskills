import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronDown, Target, Users, GraduationCap, Code2, Cpu, Rocket, Award, Network } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ApplicationFormModal } from "@/components/ApplicationFormModal";
import PricingSection from "@/components/PricingSection";
import ChatBot from "@/components/ChatBot";
import { BackToTop } from "@/components/BackToTop";
import { useState } from "react";

const FAQ_ITEMS = [
    { q: "Is this program suitable for beginners?", a: "While this is our most comprehensive program, it starts with foundational web development before moving into mobile apps and complex AI agents. Dedicated dedication is key." },
    { q: "What exactly is an AI Agent?", a: "AI Agents are sophisticated programs powered by Large Language Models (LLMs) that can perform tasks, use tools, search the web, and automate workflows autonomously, rather than just returning text like ChatGPT." },
    { q: "Do I need a high-end laptop for AI development?", a: "No, most heavy AI computations and agent workflows will be handled via APIs and cloud services. Any standard modern laptop will be sufficient." },
    { q: "What is the final certification?", a: "Upon successfully completing the program and presenting your final capstone project, you'll receive the 'Certified AI Powered Product Builder' credential to clearly highlight your capability to recruiters." }
];

export default function ProductBuilderProgram() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    return (
        <div className="min-h-screen bg-transparent overflow-x-hidden font-sans relative selection:bg-blue-200">
            <Navbar simple theme="product-builder" />

            <main className="pb-24 lg:pb-0">
                {/* HERO SECTION */}
                <section className="relative w-full min-h-[85vh] bg-transparent text-white flex items-center justify-center pt-20 pb-16 overflow-hidden font-sans border-b border-white/5">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent" />

                    <div className="relative z-10 mx-auto max-w-[1300px] px-6 lg:px-12 w-full grid lg:grid-cols-2 gap-16 lg:gap-12 items-center lg:items-stretch py-10 lg:py-6">
                        {/* Left Content */}
                        <div className="flex flex-col items-start text-left lg:pr-10 h-full pb-4 lg:pb-0">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                className="mb-8"
                            >
                                <div className="inline-flex items-center px-6 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl shadow-blue-900/10">
                                    <span className="text-[12px] sm:text-[13px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2.5">
                                        <Award className="w-4 h-4 text-blue-400" /> FLAGSHIP AI POWERED PRODUCT BUILDER (12 Weeks)
                                    </span>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                                className="mb-6 lg:mb-6 flex flex-col gap-2 relative z-20 w-full"
                            >
                                <h1 className="text-[36px] sm:text-[52px] lg:text-[60px] font-black leading-[1.1] tracking-tighter text-white">
                                    Become a Certified <br className="hidden sm:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#1E3A8A]">
                                        AI Powered Product Builder.
                                    </span>
                                </h1>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-[16px] sm:text-[18px] text-gray-600 mb-8 max-w-[500px] leading-relaxed font-medium"
                            >
                                Build a website, mobile app, and intelligent AI agents — fully deployed and portfolio-ready.
                            </motion.div>

                            {/* Outcome Strip */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
                                className="mb-8 w-full"
                            >
                                <div className="flex flex-wrap items-center gap-3 text-[14px] sm:text-[15px] font-bold text-gray-700 uppercase tracking-wider">
                                    <span className="text-[#2563EB]">Website</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                    <span className="text-[#2563EB]">App</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                    <span className="text-[#2563EB]">AI Agents</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                    <span className="text-[#2563EB]">Certification</span>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                                className="flex flex-col sm:flex-row w-full sm:w-auto gap-4"
                            >
                                <ApplicationFormModal>
                                    <button className="w-full sm:w-auto bg-[#2563EB] text-white px-8 py-4 min-h-[56px] rounded-2xl font-semibold text-[16px] transition-all shadow-md hover:bg-[#1E40AF] hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2">
                                        Become an AI Powered Product Builder <ArrowRight className="w-5 h-5" />
                                    </button>
                                </ApplicationFormModal>
                            </motion.div>
                        </div>

                        {/* Right Visual - Career Outcome & Final Project */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
                            className="relative h-full w-full hidden lg:flex flex-col justify-center items-end"
                        >
                            <div className="bg-transparent p-8 rounded-[32px] border border-blue-100 shadow-[0_20px_40px_rgba(37,99,235,0.08)] w-full max-w-[440px] relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-blue-600 via-blue-400 to-blue-800" />

                                <div className="mb-8 mt-2">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#2563EB] font-bold uppercase tracking-widest text-[11px] rounded-full mb-4">
                                        <Award className="w-4 h-4" /> Capstone Project
                                    </div>
                                    <h3 className="text-[26px] font-black text-white leading-tight">
                                        Personal AI Assistant System
                                    </h3>
                                    <p className="text-gray-500 text-[14px] leading-relaxed mt-2 font-medium">
                                        Complete with web interface, mobile app connectivity, task automation, and diverse API integrations.
                                    </p>
                                </div>

                                <div className="space-y-6 pt-6 border-t border-white/10">
                                    <div className="flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                                            <Rocket className="w-5 h-5 text-[#2563EB]" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">Career Outcome</h4>
                                            <p className="text-gray-500 text-[14px] leading-relaxed mt-1">
                                                Move from completing courses to building deployable products across Web, App, and AI ecosystems.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* WHO THIS IS FOR */}
                <section className="py-24 px-6 bg-transparent relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,_var(--tw-gradient-stops))] from-blue-100/60 via-transparent to-transparent pointer-events-none" />

                    <div className="max-w-[1200px] mx-auto relative z-10">
                        <div className="text-center mb-16">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                                className="mb-6 inline-flex uppercase tracking-widest text-[11px] font-bold px-4 py-1.5 rounded-full bg-blue-100 text-[#2563EB]"
                            >
                                Your Profile
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                className="text-[36px] sm:text-[48px] font-black text-white tracking-tight"
                            >
                                Who This Is <span className="text-[#2563EB]">For</span>
                            </motion.h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { icon: GraduationCap, title: "Final year students" },
                                { icon: Users, title: "Placement-focused candidates" },
                                { icon: Rocket, title: "Aspiring startup founders" },
                                { icon: Cpu, title: "Students serious about AI and product roles" }
                            ].map((item, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} key={i}
                                    className="group bg-transparent p-8 rounded-[24px] border border-white/10 shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300 relative overflow-hidden flex flex-col items-center text-center"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100 group-hover:bg-[#2563EB] transition-colors duration-300" />
                                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 group-hover:scale-110 transition-transform duration-300">
                                        <item.icon className="w-6 h-6 text-[#2563EB]" />
                                    </div>
                                    <h3 className="text-[16px] font-bold text-white leading-snug">{item.title}</h3>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* WHAT YOU WILL BUILD & CURRICULUM */}
                <section className="py-24 px-6 bg-transparent border-y border-white/10">
                    <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
                        <div>
                            <div className="mb-6 inline-flex uppercase tracking-widest text-[11px] font-bold px-4 py-1.5 rounded-full bg-blue-100 text-[#2563EB]">
                                The Output
                            </div>
                            <h2 className="text-[36px] sm:text-[48px] font-black text-white mb-8 leading-tight tracking-tight">
                                What You <span className="text-[#2563EB]">Will Build</span>
                            </h2>
                            <ul className="space-y-5">
                                {[
                                    "Production-ready website",
                                    "Cross-platform mobile app",
                                    "Two working AI agents",
                                    "Integrated automation workflows"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 p-5 bg-transparent rounded-2xl border border-white/10 hover:border-blue-200 transition-colors group">
                                        <CheckCircle2 className="w-7 h-7 text-[#2563EB] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                        <span className="text-[18px] text-white font-bold leading-tight">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-transparent p-8 sm:p-12 rounded-[32px] border border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-[80px] pointer-events-none" />

                            <h3 className="text-[28px] font-black text-white mb-10 tracking-tight">Program Structure</h3>

                            <div className="space-y-10 relative">
                                {[
                                    { w: "Phase 1", title: "Web Development with AI", desc: "Full stack foundation and deployment" },
                                    { w: "Phase 2", title: "App Development", desc: "React Native app and store-ready deployment" },
                                    { w: "Phase 3", title: "Agentic AI & Automation", desc: "AI agents, tools, triggers, automation" },
                                    { w: "Final Week", title: "Integration & Presentation", desc: "Showcase your complete portfolio" }
                                ].map((item, i, array) => (
                                    <div key={i} className="relative z-10 flex gap-6 group">
                                        {i !== array.length - 1 && (
                                            <div className="absolute left-[19px] top-10 -bottom-10 w-[2px] bg-blue-200" />
                                        )}
                                        <div className="w-10 h-10 rounded-full bg-transparent border-[4px] border-blue-200 flex shrink-0 items-center justify-center font-bold text-[#2563EB] text-[12px] group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-300">
                                            {i + 1}
                                        </div>
                                        <div className="pt-1">
                                            <div className="text-blue-700 font-black text-[14px] uppercase tracking-widest mb-1">{item.w}</div>
                                            <h4 className="text-[20px] font-bold text-white mb-1 leading-tight">{item.title}</h4>
                                            <p className="text-gray-600 text-[15px] leading-relaxed font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* PRICING */}
                <PricingSection currentPlan="AI Powered Product Builder" theme="product-builder" />

                {/* FAQ */}
                <section className="py-24 px-6 bg-transparent border-y border-white/10">
                    <div className="max-w-[800px] mx-auto">
                        <h2 className="text-[32px] sm:text-[40px] font-black text-white mb-12 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {FAQ_ITEMS.map((faq, i) => (
                                <div key={i} className="border border-white/10 rounded-2xl overflow-hidden bg-transparent transition-colors">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        className="w-full flex items-center justify-between p-6 text-left"
                                    >
                                        <span className="font-bold text-[16px] text-white">{faq.q}</span>
                                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                                    </button>
                                    {openFaq === i && (
                                        <div className="px-6 pb-6 text-gray-600 leading-relaxed text-[15px]">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>

            <Footer theme="product-builder" />
            <ChatBot theme="product-builder" />
            <BackToTop theme="product-builder" />
        </div>
    );
}
