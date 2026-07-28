import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronDown, Target, Users, BookOpen, GraduationCap, Code2, AppWindow, Smartphone, Briefcase, Building2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ApplicationFormModal } from "@/components/ApplicationFormModal";
import PricingSection from "@/components/PricingSection";
import ChatBot from "@/components/ChatBot";
import { BackToTop } from "@/components/BackToTop";
import { useState } from "react";

const FAQ_ITEMS = [
    { q: "Do I need to know basics before joining?", a: "Yes, basic coding knowledge or having completed our Foundation program gives you the best starting point." },
    { q: "Will the mobile app work on both iOS and Android?", a: "Yes! We teach cross-platform development so your app will compile and function on both major platforms." },
    { q: "How much time is required?", a: "Expect to dedicate 10-15 hours per week during the 8 weeks to master the advanced concepts and build your applications." },
    { q: "What do I get at the end of the 8 weeks?", a: "You will have a production-ready website and a utility mobile app that you can install on your phone, providing a strong placement portfolio." }
];

export default function ElevateProgram() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    return (
        <div className="min-h-screen bg-slate-50 overflow-x-hidden font-sans relative selection:bg-orange-200">
            <Navbar simple theme="orange" />

            <main className="pb-24 lg:pb-0">
                {/* HERO SECTION */}
                <section className="relative w-full min-h-[85vh] bg-slate-50 text-gray-900 flex items-center justify-center pt-20 pb-16 overflow-hidden font-sans border-b border-gray-100">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-200 to-transparent" />

                    <div className="relative z-10 mx-auto max-w-[1300px] px-6 lg:px-12 w-full grid lg:grid-cols-2 gap-16 lg:gap-12 items-center lg:items-stretch py-10 lg:py-6">
                        {/* Left Content */}
                        <div className="flex flex-col items-start text-left lg:pr-10 h-full pb-4 lg:pb-0">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                className="mb-8"
                            >
                                <div className="inline-flex items-center px-6 py-2.5 rounded-full border border-orange-200/30 bg-orange-100/50 backdrop-blur-xl shadow-xl shadow-orange-900/5">
                                    <span className="text-[12px] sm:text-[13px] font-black text-orange-800 uppercase tracking-[0.2em] flex items-center gap-2.5">
                                        <Target className="w-4 h-4 text-orange-600" /> ELEVATE PROGRAM (8 Weeks)
                                    </span>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                                className="mb-6 lg:mb-6 flex flex-col gap-2 relative z-20 w-full"
                            >
                                <h1 className="text-[36px] sm:text-[52px] lg:text-[60px] font-black leading-[1.1] tracking-tighter">
                                    <span className="text-gray-900 block pb-1">
                                        Build & Launch Your
                                    </span>
                                    <span className="text-gray-900 underline decoration-orange-500 decoration-[5px] sm:decoration-[8px] underline-offset-[6px] sm:underline-offset-[8px]">
                                        Web + Mobile App.
                                    </span>
                                </h1>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-[16px] sm:text-[18px] text-gray-600 mb-8 max-w-[500px] leading-relaxed font-medium"
                            >
                                Develop a production-ready website and cross-platform mobile app with backend integration.
                            </motion.div>

                            {/* Outcome Strip */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
                                className="mb-8 w-full"
                            >
                                <div className="flex flex-wrap items-center gap-3 text-[14px] sm:text-[15px] font-bold text-gray-700 uppercase tracking-wider">
                                    <span className="text-orange-600">Live Website</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                    <span className="text-orange-600">Mobile App</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                    <span className="text-orange-600">Store Deployment</span>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                                className="flex flex-col sm:flex-row w-full sm:w-auto gap-4"
                            >
                                <ApplicationFormModal>
                                    <button className="w-full sm:w-auto bg-orange-600 text-white px-8 py-4 min-h-[56px] rounded-2xl font-semibold text-[16px] transition-all shadow-md hover:bg-orange-700 hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2">
                                        Start Accelerating <ArrowRight className="w-5 h-5" />
                                    </button>
                                </ApplicationFormModal>
                            </motion.div>
                        </div>

                        {/* Right Visual - Career Outcome & Final Project */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
                            className="relative h-full w-full hidden lg:flex flex-col justify-center items-end"
                        >
                            <div className="bg-white p-8 rounded-[32px] border border-orange-100 shadow-xl w-full max-w-[440px] relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-orange-500 to-orange-400" />

                                <div className="mb-8">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-700 font-bold uppercase tracking-widest text-[11px] rounded-full mb-4">
                                        <Target className="w-4 h-4" /> Final Projects
                                    </div>
                                    <h3 className="text-[24px] font-black text-gray-900 leading-tight">
                                        Production-ready website and utility mobile app
                                    </h3>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                            <Briefcase className="w-5 h-5 text-gray-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Career Outcome</h4>
                                            <p className="text-gray-500 text-[14px] leading-relaxed mt-1">
                                                Move from small projects to fully deployed web and mobile products ready for recruiters.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* WHO THIS IS FOR */}
                <section className="py-24 px-6 bg-slate-50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,_var(--tw-gradient-stops))] from-orange-100/60 via-transparent to-transparent pointer-events-none" />

                    <div className="max-w-[1200px] mx-auto relative z-10">
                        <div className="text-center mb-16">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                                className="mb-6 inline-flex uppercase tracking-widest text-[11px] font-bold px-4 py-1.5 rounded-full bg-orange-100 text-orange-700"
                            >
                                Your Profile
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                className="text-[36px] sm:text-[48px] font-black text-gray-900 tracking-tight"
                            >
                                Who This Is <span className="text-orange-600">For</span>
                            </motion.h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { icon: Code2, title: "Students with basic coding knowledge" },
                                { icon: GraduationCap, title: "Foundation graduates" },
                                { icon: Users, title: "Placement-focused candidates" },
                                { icon: Building2, title: "Students aiming for product-based companies" }
                            ].map((item, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} key={i}
                                    className="group bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300 relative overflow-hidden flex flex-col items-center text-center"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100 group-hover:bg-orange-500 transition-colors duration-300" />
                                    <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 border border-orange-100 group-hover:scale-110 transition-transform duration-300">
                                        <item.icon className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <h3 className="text-[16px] font-bold text-gray-900 leading-snug">{item.title}</h3>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* WHAT YOU WILL BUILD & CURRICULUM */}
                <section className="py-24 px-6 bg-white border-y border-gray-100">
                    <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
                        <div>
                            <div className="mb-6 inline-flex uppercase tracking-widest text-[11px] font-bold px-4 py-1.5 rounded-full bg-orange-100 text-orange-700">
                                The Output
                            </div>
                            <h2 className="text-[36px] sm:text-[48px] font-black text-gray-900 mb-8 leading-tight tracking-tight">
                                What You <span className="text-orange-600">Will Build</span>
                            </h2>
                            <ul className="space-y-5">
                                {[
                                    "Dynamic production-ready website",
                                    "Fully functional mobile app",
                                    "Backend-connected architecture",
                                    "Installable mobile app"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors group">
                                        <CheckCircle2 className="w-7 h-7 text-orange-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                        <span className="text-[18px] text-gray-900 font-bold leading-tight">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-slate-50 p-8 sm:p-12 rounded-[32px] border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/50 rounded-full blur-[80px] pointer-events-none" />

                            <h3 className="text-[28px] font-black text-gray-900 mb-10 tracking-tight">What You Learn</h3>

                            <div className="space-y-10 relative">
                                {[
                                    { w: "Module 1", title: "Advanced Web Development", desc: "Dynamic frontend, API integration" },
                                    { w: "Module 2", title: "Mobile App Development", desc: "Cross-platform development, backend integration" },
                                    { w: "Module 3", title: "Testing & Deployment", desc: "App testing, APK generation, publishing basics" }
                                ].map((item, i, array) => (
                                    <div key={i} className="relative z-10 flex gap-6 group">
                                        {i !== array.length - 1 && (
                                            <div className="absolute left-[19px] top-10 -bottom-10 w-[2px] bg-orange-200" />
                                        )}
                                        <div className="w-10 h-10 rounded-full bg-white border-[4px] border-orange-200 flex shrink-0 items-center justify-center font-bold text-orange-600 text-[12px] group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                                            {i + 1}
                                        </div>
                                        <div className="pt-1">
                                            <div className="text-orange-700 font-black text-[14px] uppercase tracking-widest mb-1">{item.w}</div>
                                            <h4 className="text-[20px] font-bold text-gray-900 mb-1 leading-tight">{item.title}</h4>
                                            <p className="text-gray-600 text-[15px] leading-relaxed font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* PRICING */}
                <PricingSection currentPlan="GradSkills Elevate" theme="orange" />

                {/* FAQ */}
                <section className="py-24 px-6 bg-white border-y border-gray-100">
                    <div className="max-w-[800px] mx-auto">
                        <h2 className="text-[32px] sm:text-[40px] font-black text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {FAQ_ITEMS.map((faq, i) => (
                                <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden bg-slate-50 transition-colors">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        className="w-full flex items-center justify-between p-6 text-left"
                                    >
                                        <span className="font-bold text-[16px] text-gray-900">{faq.q}</span>
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

            <Footer theme="orange" />
            <ChatBot theme="orange" />
            <BackToTop theme="orange" />
        </div>
    );
}
