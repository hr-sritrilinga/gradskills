import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, GraduationCap, FileUp, Send, CheckCircle2, ArrowLeft, HeartHandshake } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DotGrid from "@/components/DotGrid/DotGrid";
import { useToast } from "@/components/ui/use-toast";

import { supabase, uploadToSupabase } from "@/lib/supabase";
import SuccessPopup from "@/components/SuccessPopup";

export default function ApplyGradteer() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const isDark = theme === "dark";
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    variant: "destructive",
                    title: "File too large",
                    description: "Please upload a resume smaller than 5MB.",
                });
                e.target.value = ""; // Clear input
                setResumeFile(null);
                return;
            }
            setResumeFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!resumeFile) {
            toast({ variant: "destructive", title: "Resume required", description: "Please upload your resume." });
            return;
        }

        setIsSubmitting(true);
        
        try {
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());

            // 1. Upload to Supabase Storage
            const resumeUrl = await uploadToSupabase(resumeFile);

            // 2. Save to Supabase Database
            const { error: dbError } = await supabase
                .from('gradteer_applications')
                .insert([{ ...data, resume_url: resumeUrl }]);

            if (dbError) throw dbError;

            // 3. Web3Forms Notification
            await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    access_key: import.meta.env.VITE_WEB3FORMS_KEY || "d9940085-bcaa-494a-a422-350e57cf3f83",
                    subject: "New GradTeer Application",
                    ...data,
                    resume_link: resumeUrl
                }),
            });

            setShowSuccess(true);
            setTimeout(() => navigate("/"), 4500);

        } catch (error: any) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Submission failed",
                description: error.message || "Something went wrong. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`min-h-screen font-sans selection:bg-[#ff5757]/30 transition-colors duration-1000 ${isDark ? "bg-[#030712] text-white" : "bg-white text-slate-900"}`}>
            <Navbar theme={theme} onThemeChange={setTheme} simple />
            
            <SuccessPopup 
                isOpen={showSuccess} 
                onClose={() => setShowSuccess(false)} 
                variant="gradteer"
                title="Application Received!"
                message="Thank you for joining our mission as a Growth Partner. We'll be in touch with you shortly."
            />
            
            <main className="relative pt-40 sm:pt-48 pb-20 px-6">
                {/* Background DotGrid */}
                <div className="absolute inset-0 pointer-events-none z-0 opacity-80">
                    <DotGrid baseColor={isDark ? "#1e293b" : "#e2e8f0"} activeColor="#8c52ff" dotSize={3} gap={30} />
                </div>

                <div className="relative z-10 max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left Side: Content */}
                    <div className="max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 rounded-full border border-[#ff5757]/30 bg-[#ff5757]/5 px-5 py-2 text-[12px] font-bold uppercase tracking-[0.2em] text-[#ff5757] mb-8">
                                GradTeers (Growth Partner)
                            </div>
                            <h1 className="text-[32px] sm:text-[48px] lg:text-[64px] font-black leading-[1.1] tracking-tight mb-8">
                                Drive Growth, <br /> <span className="text-home-gradient">Build Community.</span>
                            </h1>
                            <p className={`text-[18px] sm:text-[22px] leading-relaxed font-medium mb-10 transition-colors ${isDark ? "text-white/50" : "text-slate-500"}`}>
                                Become a GradTeer and play a pivotal role in our mission. As a Growth Partner, you'll help us expand our reach and empower more builders.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { icon: HeartHandshake, text: "Lead community initiatives" },
                                    { icon: HeartHandshake, text: "Drive strategic growth projects" },
                                    { icon: HeartHandshake, text: "Access exclusive GradSkills network" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-6 h-6 rounded-full bg-home-gradient/20 flex items-center justify-center">
                                            <item.icon className="w-3.5 h-3.5 text-[#ff5757]" />
                                        </div>
                                        <span className={`text-[17px] font-bold transition-colors ${isDark ? "text-white/80" : "text-slate-700"}`}>{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Glowing Background Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#ff5757] to-[#8c52ff] rounded-[40px] blur opacity-20" />
                        
                        <div className={`relative p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border backdrop-blur-2xl shadow-2xl transition-colors ${isDark ? "border-white/10 bg-[#030712]/80" : "border-slate-200 bg-white/90"}`}>
                            <h2 className="text-[28px] font-black mb-8 tracking-tight">Become a GradTeer</h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label className={`text-[12px] font-black uppercase tracking-[0.2em] ml-1 transition-colors ${isDark ? "text-white/40" : "text-slate-400"}`}>Full Name</label>
                                    <div className="relative group">
                                        <User className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isDark ? "text-white/20" : "text-slate-300"} group-focus-within:text-[#ff5757]`} />
                                        <input 
                                            required
                                            name="full_name"
                                            type="text" 
                                            placeholder="John Doe"
                                            className={`w-full border rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-[#ff5757]/50 transition-all ${isDark ? "bg-white/5 border-white/10 text-white placeholder:text-white/10" : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-300"}`}
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className={`text-[12px] font-black uppercase tracking-[0.2em] ml-1 transition-colors ${isDark ? "text-white/40" : "text-slate-400"}`}>Email Address</label>
                                    <div className="relative group">
                                        <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isDark ? "text-white/20" : "text-slate-300"} group-focus-within:text-[#ff5757]`} />
                                        <input 
                                            required
                                            name="email"
                                            type="email" 
                                            placeholder="john@example.com"
                                            className={`w-full border rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-[#ff5757]/50 transition-all ${isDark ? "bg-white/5 border-white/10 text-white placeholder:text-white/10" : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-300"}`}
                                        />
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-6">
                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <label className={`text-[12px] font-black uppercase tracking-[0.2em] ml-1 transition-colors ${isDark ? "text-white/40" : "text-slate-400"}`}>Phone Number</label>
                                        <div className="relative group">
                                            <Phone className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isDark ? "text-white/20" : "text-slate-300"} group-focus-within:text-[#ff5757]`} />
                                            <input 
                                                required
                                                name="phone"
                                                type="tel" 
                                                placeholder="+91..."
                                                className={`w-full border rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-[#ff5757]/50 transition-all ${isDark ? "bg-white/5 border-white/10 text-white placeholder:text-white/10" : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-300"}`}
                                            />
                                        </div>
                                    </div>

                                    {/* Qualification */}
                                    <div className="space-y-2">
                                        <label className={`text-[12px] font-black uppercase tracking-[0.2em] ml-1 transition-colors ${isDark ? "text-white/40" : "text-slate-400"}`}>Qualification</label>
                                        <div className="relative group">
                                            <GraduationCap className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isDark ? "text-white/20" : "text-slate-300"} group-focus-within:text-[#ff5757]`} />
                                            <input 
                                                required
                                                name="qualification"
                                                type="text" 
                                                placeholder="College / Degree / Specialization"
                                                className={`w-full border rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-[#ff5757]/50 transition-all ${isDark ? "bg-white/5 border-white/10 text-white placeholder:text-white/10" : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-300"}`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Resume Upload */}
                                <div className="space-y-2">
                                    <label className={`text-[12px] font-black uppercase tracking-[0.2em] ml-1 transition-colors ${isDark ? "text-white/40" : "text-slate-400"}`}>Upload Resume / Profile (PDF - Max 5MB)</label>
                                    <div className="relative group cursor-pointer">
                                        <input 
                                            required
                                            type="file" 
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className={`w-full border border-dashed rounded-2xl py-8 flex flex-col items-center justify-center gap-2 transition-all ${isDark ? "bg-white/5 border-white/20 group-hover:bg-white/10 group-hover:border-[#ff5757]/50" : "bg-slate-50 border-slate-300 group-hover:bg-white group-hover:border-[#ff5757]/50"}`}>
                                            <FileUp className={`w-8 h-8 transition-colors ${isDark ? "text-white/20" : "text-slate-300"} group-hover:text-[#ff5757]`} />
                                            <span className={`text-[14px] font-bold transition-colors ${isDark ? "text-white/40" : "text-slate-500"} group-hover:text-white/60`}>
                                                {resumeFile ? resumeFile.name : "Click to upload or drag & drop"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    disabled={isSubmitting}
                                    className="w-full bg-home-gradient text-white py-5 rounded-2xl font-semibold text-[18px] tracking-tight flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_30px_rgba(255,87,87,0.4)] disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {isSubmitting ? "Submitting..." : "Apply as GradTeer"}
                                    <Send className={`w-5 h-5 transition-transform ${!isSubmitting && "group-hover:translate-x-1 group-hover:-translate-y-1"}`} />
                                </button>
                            </form>
                        </div>
                    </motion.div>

                </div>
            </main>

            <Footer theme={theme} />
        </div>
    );
}
