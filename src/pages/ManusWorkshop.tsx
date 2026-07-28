import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
    Calendar, Clock, Video, CheckCircle2, User, Mail, Phone,
    Briefcase, GraduationCap, Building2, MessageCircle,
    ArrowRight, BarChart3, Users, FileText, Zap
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DotGrid from "@/components/ui/DotGrid";
import { useToast } from "@/components/ui/use-toast";
import manusIcon from "@/assets/tech-icons/manus_icon.png";
import { supabase } from "@/lib/supabase";

const loadRazorpay = () => new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
});

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });
    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }} className={className}>
            {children}
        </motion.div>
    );
}

export default function ManusWorkshop() {
    const { toast, dismiss } = useToast();
    const [theme] = useState<"dark" | "light">("dark");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [persona, setPersona] = useState<"Student" | "Working Professional" | "Business" | "">("");
    const [registrationId, setRegistrationId] = useState<string | null>(null);

    const formRef = useRef<HTMLDivElement>(null);
    const [showSticky, setShowSticky] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting), { threshold: 0.1 });
        if (formRef.current) observer.observe(formRef.current);
        return () => observer.disconnect();
    }, []);
    
    // Check for success parameter in URL (used for Razorpay mobile UPI redirect fallback)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success') === 'true') {
            setShowSuccess(true);
            // Optionally remove the query parameter from URL to keep it clean
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (urlParams.get('error') === 'true') {
            toast({ variant: "destructive", title: "Payment failed or was cancelled." });
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [toast]);

    // 15-minute countdown timer
    const [timeLeft, setTimeLeft] = useState(15 * 60);
    const timeLeftRef = useRef(timeLeft);
    useEffect(() => {
        const id = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 0) {
                    clearInterval(id);
                    return 0;
                }
                const next = t - 1;
                timeLeftRef.current = next;
                return next;
            });
        }, 1000);
        return () => clearInterval(id);
    }, []);
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timerDisplay = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    // Seat counter with batch refills: 49 → 57 → 21 → 9
    const batches = useRef([49, 57, 21, 9]);
    const batchIndex = useRef(0);
    const [seatsLeft, setSeatsLeft] = useState(49);

    // Simulate other people registering dynamically based on time left
    useEffect(() => {
        const tick = () => {
            setSeatsLeft(prev => {
                if (prev <= 1) {
                    const nextIdx = batchIndex.current + 1;
                    if (nextIdx < batches.current.length) {
                        batchIndex.current = nextIdx;
                        return batches.current[nextIdx];
                    }
                    return 0;
                }
                return prev - 1;
            });
        };

        const schedule = () => {
            const currentLeft = timeLeftRef.current;
            let delay;
            if (currentLeft > 12 * 60) {
                // First 3 mins: ~5 seats total -> avg 36s per seat
                delay = 25000 + Math.random() * 22000;
            } else if (currentLeft > 7 * 60) {
                // Next 5 mins: ~14 seats total -> avg 21.4s per seat
                delay = 15000 + Math.random() * 12000;
            } else {
                // Last 7 mins: ~18 seats total -> avg 23.3s per seat
                delay = 18000 + Math.random() * 10000;
            }
            return setTimeout(() => {
                tick();
                timerId.current = schedule();
            }, delay);
        };

        const timerId = { current: schedule() };
        return () => clearTimeout(timerId.current);
    }, []);

    // Decrement seat on successful registration
    useEffect(() => {
        if (showSuccess) {
            setSeatsLeft(prev => {
                if (prev <= 1) {
                    const nextIdx = batchIndex.current + 1;
                    if (nextIdx < batches.current.length) {
                        batchIndex.current = nextIdx;
                        return batches.current[nextIdx];
                    }
                    return 0;
                }
                return prev - 1;
            });
        }
    }, [showSuccess]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!persona) { toast({ variant: "destructive", title: "Select your profile" }); return; }
        
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);
        
        setIsSubmitting(true);
        try {
            // Use relative path in production since frontend and backend are on the same domain
            const apiUrl = import.meta.env.DEV ? "http://localhost:4000" : "";
            
            const res = await loadRazorpay();
            if (!res) throw new Error("Razorpay SDK failed to load. Are you online?");
            
            const { id: toastId } = toast({ title: "Opening Payment…" });
            
            const orderRes = await fetch(`${apiUrl}/api/create-razorpay-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: 100 }) // ₹1 (Testing)
            });
            const orderData = await orderRes.json();
            if (!orderData.success) throw new Error("Failed to create order");
            
            const { data: insertData, error: insertError } = await supabase.from('manus_workshop_registrations').insert([{
                full_name: data.full_name,
                email: data.email,
                phone: data.phone,
                persona,
                order_id: orderData.order.id,
                payment_status: 'pending'
            }]).select('id').single();
            
            if (insertError) {
                console.error("Supabase Error:", insertError);
                throw new Error("Failed to initialize registration. Please try again.");
            }
            const recordId = insertData.id;
            
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_live_TIUVuNeQsIazvt",
                amount: orderData.order.amount,
                currency: "INR",
                name: "GradSkills",
                description: "Manus Workshop Registration",
                order_id: orderData.order.id,
                handler: async function (response: any) {
                    try {
                        const { error } = await supabase.from('manus_workshop_registrations')
                            .update({
                                payment_status: 'done',
                                payment_id: response.razorpay_payment_id,
                                signature: response.razorpay_signature
                            })
                            .eq('id', recordId);
                        
                        if (error) {
                            console.error("Supabase Error:", error);
                            toast({ variant: "destructive", title: "Payment verified but failed to save details." });
                            return;
                        }
                        
                        dismiss(toastId);
                        setRegistrationId(recordId);
                        setShowSuccess(true);
                    } catch (err) {
                        dismiss(toastId);
                        toast({ variant: "destructive", title: "Failed to save registration" });
                    }
                },
                modal: {
                    ondismiss: async function() {
                        await supabase.from('manus_workshop_registrations')
                            .update({ payment_status: 'failed' })
                            .eq('id', recordId);
                        dismiss(toastId);
                        setIsSubmitting(false);
                    }
                },
                prefill: {
                    name: data.full_name as string,
                    email: data.email as string,
                    contact: data.phone as string
                },
                theme: {
                    color: "#8c52ff"
                },
                callback_url: `${apiUrl}/api/payment-callback`,
                redirect: true
            };
            
            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.on('payment.failed', async function (response: any) {
                await supabase.from('manus_workshop_registrations')
                    .update({ 
                        payment_status: 'failed',
                        payment_id: response.error.metadata.payment_id 
                    })
                    .eq('id', recordId);
            });
            paymentObject.open();
            
        } catch (err: any) { 
            toast({ variant: "destructive", title: err.message || "Failed to process payment" }); 
            setIsSubmitting(false);
        }
        // Notice: No finally block here, because ondismiss handles the cleanup if user closes modal.
    };

    const scrollToForm = () => {
        const el = document.getElementById("register");
        if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    return (
        <div className="min-h-screen bg-[#030712] text-white selection:bg-[#8c52ff]/30 font-['Fira_Sans']">
            <Navbar theme={theme} onThemeChange={() => {}} simple />

            {/* ═══ HERO ═══ */}
            <section className="relative w-full overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-40">
                    <DotGrid baseColor="#1e293b" activeColor="#8c52ff" dotSize={3} gap={30} />
                </div>
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#8c52ff]/[0.05] blur-[180px] rounded-full pointer-events-none" />

                <div className="relative z-10 mx-auto max-w-[1100px] px-6 pt-[130px] pb-[130px] lg:pt-[140px] lg:pb-[140px] grid lg:grid-cols-[1fr_420px] gap-16 lg:gap-20 items-start">

                    {/* Left — Copy */}
                    <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}>

                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] mb-10">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5757] opacity-75" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#ff5757]" />
                            </span>
                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Live Workshop</span>
                        </div>

                        <div className="flex items-center gap-5 mb-6">
                            <img src={manusIcon} alt="Manus AI" className="w-14 h-14 sm:w-[68px] sm:h-[68px]" />
                            <div className="leading-none">
                                <h1 className="text-[42px] sm:text-[60px] lg:text-[68px] font-semibold tracking-tight leading-[0.92]">MASTER</h1>
                                <h1 className="text-[42px] sm:text-[60px] lg:text-[68px] font-semibold tracking-tight leading-[0.92] text-home-gradient">MANUS AI</h1>
                            </div>
                        </div>

                        <p className="text-[19px] sm:text-[24px] font-light text-white/50 leading-snug mb-3 max-w-[460px]">
                            For Business Consulting &amp; Client Acquisition
                        </p>
                        <p className="text-[15px] text-white/30 leading-relaxed mb-12 max-w-[420px]">
                            Learn to build consulting reports, acquire clients, and launch your own AI agency in a single 3-hour live session.
                        </p>

                        {/* Meta pills */}
                        <div className="flex flex-wrap gap-3 mb-12">
                            {[
                                { icon: Calendar, t: "9 Aug 2026, Sunday" },
                                { icon: Clock, t: "10 AM – 1 PM IST" },
                                { icon: Video, t: "Live Online" },
                            ].map((p, i) => (
                                <div key={i} className="flex items-center gap-2.5 px-5 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-[13px] font-medium text-white/50">
                                    <p.icon className="w-4 h-4 text-white/25" /> {p.t}
                                </div>
                            ))}
                        </div>

                        {/* Speakers */}
                        <div className="flex items-center gap-5 pt-8 border-t border-white/[0.04]">
                            <div className="flex -space-x-3">
                                <div className="w-12 h-12 rounded-full border-2 border-[#030712] overflow-hidden shrink-0 bg-[#030712]">
                                    <img src="https://www.image2url.com/r2/default/images/1785217738845-7e6d5a9c-5283-4a3b-be63-24d2f9036f83.jpg" alt="Vishwas Gupta" className="w-full h-full object-cover" />
                                </div>
                                <div className="w-12 h-12 rounded-full border-2 border-[#030712] overflow-hidden shrink-0 bg-[#030712]">
                                    <img src="https://www.image2url.com/r2/default/images/1785217785730-a047e458-d392-414b-b538-649685a111c9.jpg" alt="Abhijeet Navandar" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <p className="text-[13px] text-white/30 leading-relaxed">
                                <span className="text-white/60 font-medium">Vishwas Gupta</span> · Microsoft Certified Developer<br />
                                <span className="text-white/60 font-medium">Abhijeet Navandar</span> · ISB Alum
                            </p>
                        </div>

                        <button onClick={scrollToForm} className="mt-10 bg-home-gradient text-white px-8 py-3.5 rounded-xl font-semibold text-[14px] transition-all hover:opacity-90 shadow-[0_0_20px_rgba(255,87,87,0.12)] hover:shadow-[0_0_32px_rgba(140,82,255,0.3)] hover:-translate-y-0.5 inline-flex items-center gap-2">
                            Register Now <ArrowRight className="w-4 h-4" />
                        </button>
                    </motion.div>

                    {/* Right — Form */}
                    <motion.div ref={formRef} id="register" initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] }} className="relative">
                        <div className="absolute -inset-px rounded-[24px] bg-gradient-to-b from-white/[0.07] to-transparent pointer-events-none" />
                        <div className="relative bg-white/[0.025] backdrop-blur-lg rounded-[24px] border border-white/[0.06] p-8 sm:p-10">
                            <AnimatePresence mode="wait">
                                {!showSuccess ? (
                                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                                        {/* Price */}
                                        <div className="text-center mb-10">
                                            <div className="flex items-baseline justify-center gap-2.5 mb-2">
                                                <span className="text-[20px] font-normal line-through text-white/15">₹299</span>
                                                <span className="text-[48px] font-semibold text-white leading-none tracking-tight">₹1</span>
                                            </div>
                                            <p className="text-[12px] text-white/30 tracking-wide">Early-bird pricing · limited seats</p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            {/* Name */}
                                            <div>
                                                <label className="block text-[11px] font-medium text-white/30 mb-2 tracking-wide">Full name</label>
                                                <input required name="full_name" type="text" placeholder="Your full name"
                                                    className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-5 py-3.5 text-[15px] text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors" />
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <label className="block text-[11px] font-medium text-white/30 mb-2 tracking-wide">Email address</label>
                                                <input required name="email" type="email" placeholder="you@example.com"
                                                    className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-5 py-3.5 text-[15px] text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors" />
                                            </div>

                                            {/* Phone */}
                                            <div>
                                                <label className="block text-[11px] font-medium text-white/30 mb-2 tracking-wide">Phone number</label>
                                                <input required name="phone" type="tel" placeholder="+91 98765 43210"
                                                    className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-5 py-3.5 text-[15px] text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors" />
                                            </div>

                                            {/* Persona */}
                                            <div>
                                                <label className="block text-[11px] font-medium text-white/30 mb-3 tracking-wide">I am a</label>
                                                <div className="grid grid-cols-3 gap-2.5">
                                                    {([
                                                        { key: "Student" as const, icon: GraduationCap, label: "Student" },
                                                        { key: "Working Professional" as const, icon: Briefcase, label: "Professional" },
                                                        { key: "Business" as const, icon: Building2, label: "Business" },
                                                    ]).map(p => (
                                                        <button key={p.key} type="button" onClick={() => setPersona(p.key)}
                                                            className={`flex flex-col items-center gap-2 py-4 rounded-xl border text-[11px] font-medium tracking-wide transition-all duration-200 ${
                                                                persona === p.key
                                                                    ? "bg-white/[0.08] border-white/20 text-white"
                                                                    : "bg-white/[0.02] border-white/[0.06] text-white/30 hover:text-white/50 hover:border-white/[0.1]"
                                                            }`}>
                                                            <p.icon className="w-5 h-5" />
                                                            {p.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* CTA */}
                                            <button disabled={isSubmitting} className="w-full bg-home-gradient text-white py-4 rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50">
                                                {isSubmitting ? "Processing…" : (
                                                    <>Register Now — ₹1 <ArrowRight className="w-4 h-4" /></>
                                                )}
                                            </button>

                                            <p className="text-center text-[11px] text-white/20 mt-3 tracking-wide">
                                                Razorpay secured · Certificate included
                                            </p>
                                        </form>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        key="success" 
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        className="flex flex-col items-center text-center py-10 px-4 relative"
                                    >
                                        <div className="absolute inset-0 bg-[#8c52ff]/10 blur-[100px] rounded-full" />
                                        
                                        <motion.div 
                                            initial={{ scale: 0, rotate: -45 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                                            className="w-24 h-24 bg-gradient-to-br from-[#4ade80] to-[#16a34a] rounded-full flex items-center justify-center mb-6 shadow-[0_10px_35px_rgba(34,197,94,0.4),inset_0_4px_15px_rgba(255,255,255,0.4)] relative border border-[#4ade80]/50"
                                        >
                                            <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping" style={{ animationDuration: '3s' }} />
                                            <svg className="w-12 h-12 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </motion.div>
                                        
                                        <motion.h2 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-[28px] font-bold mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70"
                                        >
                                            Registration Confirmed!
                                        </motion.h2>
                                        
                                        <motion.p 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="text-[15px] text-white/60 mb-10 max-w-[320px] leading-relaxed"
                                        >
                                            Welcome to the Manus Workshop! 🎉 Join this WhatsApp group for all workshop updates, session links, and networking. 🚀
                                        </motion.p>
                                        
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="w-full relative group"
                                        >
                                            <div className="absolute -inset-1 bg-gradient-to-r from-[#25D366] to-[#128C7E] rounded-xl blur opacity-25 group-hover:opacity-60 transition duration-500"></div>
                                            <a 
                                                href="https://chat.whatsapp.com/IEkzJZKQWol0cAdYfylTXW?s=cl&p=a&ilr=1&amv=0" 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                onClick={async () => {
                                                    if (registrationId) {
                                                        await supabase.from('manus_workshop_registrations').update({ whatsapp_joined: true }).eq('id', registrationId);
                                                    }
                                                }} 
                                                className="relative w-full bg-[#1e2330] border border-white/10 text-white py-4 rounded-xl font-semibold text-[15px] flex items-center justify-center gap-3 hover:bg-[#25D366] hover:border-[#25D366] transition-all duration-300 shadow-xl overflow-hidden"
                                            >
                                                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-white drop-shadow-md group-hover:animate-bounce" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.81 11.81 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z"/>
                                                </svg>
                                                <span className="text-[16px] font-bold tracking-wide">Join WhatsApp Group</span>
                                                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
                                            </a>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ═══ CURRICULUM ═══ */}
            <section className="relative z-10 border-t border-white/[0.04]">
                <div className="mx-auto max-w-[1100px] px-6 py-24 lg:py-32">
                    <Reveal>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8c52ff]/70 mb-4">Workshop Curriculum</p>
                        <h2 className="text-[30px] sm:text-[38px] font-medium tracking-tight leading-[1.15] mb-16 max-w-[480px]">
                            Everything you need to start an AI consulting practice.
                        </h2>
                    </Reveal>
                    <div className="grid md:grid-cols-2 gap-x-20">
                        {[
                            "Introduction to Manus AI & Business Consulting",
                            "AI-Powered Market & Competitor Research",
                            "SWOT Analysis & Business Strategy Creation",
                            "Sales & Marketing Consulting using AI",
                            "Lead Generation & Client Acquisition Workflows",
                            "Build & Scale Your AI Consulting Agency",
                        ].map((item, i) => (
                            <Reveal key={i} delay={i * 0.04}>
                                <div className="flex items-start gap-5 py-6 border-b border-white/[0.04]">
                                    <span className="text-[13px] font-medium text-white/10 tabular-nums w-6 shrink-0 pt-0.5">{String(i + 1).padStart(2, "0")}</span>
                                    <span className="text-[16px] text-white/60 leading-snug">{item}</span>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ OUTCOMES ═══ */}
            <section className="relative z-10 border-t border-white/[0.04]">
                <div className="mx-auto max-w-[1100px] px-6 py-24 lg:py-32">
                    <Reveal>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8c52ff]/70 mb-4">After The Workshop</p>
                        <h2 className="text-[30px] sm:text-[38px] font-medium tracking-tight leading-[1.15] mb-16 max-w-[500px]">
                            Walk away with real, deployable business assets.
                        </h2>
                    </Reveal>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            { icon: BarChart3, title: "Market Research", desc: "AI-powered competitive analysis" },
                            { icon: Users, title: "Client Acquisition", desc: "Automated lead-gen system" },
                            { icon: Zap, title: "Strategy Docs", desc: "SWOT & business plans" },
                            { icon: FileText, title: "Consulting Reports", desc: "Professional deliverables" },
                        ].map((c, i) => (
                            <Reveal key={i} delay={i * 0.06}>
                                <div className="p-7 rounded-2xl bg-white/[0.025] border border-white/[0.06] hover:border-white/[0.1] transition-colors h-full">
                                    <c.icon className="w-5 h-5 text-white/25 mb-5" />
                                    <h4 className="text-[15px] font-semibold text-white/85 mb-2 tracking-tight">{c.title}</h4>
                                    <p className="text-[13px] text-white/30 leading-relaxed">{c.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ SPEAKERS ═══ */}
            <section className="relative z-10 border-t border-white/[0.04]">
                <div className="mx-auto max-w-[1100px] px-6 py-24 lg:py-32">
                    <Reveal>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8c52ff]/70 mb-4">Your Instructors</p>
                        <h2 className="text-[30px] sm:text-[38px] font-medium tracking-tight leading-[1.15] mb-16 max-w-[420px]">
                            Learn from people who've done it.
                        </h2>
                    </Reveal>
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
                        {[
                            { name: "Vishwas Gupta", role: "Co-Founder, GradSkills", badge: "Microsoft Certified Developer", img: "https://www.image2url.com/r2/default/images/1785217738845-7e6d5a9c-5283-4a3b-be63-24d2f9036f83.jpg" },
                            { name: "Abhijeet Navandar", role: "Co-Founder, GradSkills", badge: "ISB I-Venture Alum", img: "https://www.image2url.com/r2/default/images/1785217785730-a047e458-d392-414b-b538-649685a111c9.jpg" },
                        ].map((s, i) => (
                            <Reveal key={i} delay={i * 0.08}>
                                <div className="flex items-start gap-6">
                                    <div className="w-[88px] h-[88px] rounded-2xl border border-white/[0.06] overflow-hidden shrink-0 bg-[#030712]">
                                        <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="text-[18px] font-medium text-white mb-1">{s.name}</h3>
                                        <p className="text-[14px] text-white/35 mb-4">{s.role}</p>
                                        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8c52ff]/80 bg-[#8c52ff]/8 px-3 py-1.5 rounded-lg border border-[#8c52ff]/15">{s.badge}</span>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ FINAL CTA ═══ */}
            <section className="relative z-10 border-t border-white/[0.04]">
                <div className="mx-auto max-w-[1100px] px-6 py-32 lg:py-40 text-center">
                    <Reveal>
                        <h2 className="text-[34px] sm:text-[48px] font-medium tracking-tight leading-[1.1] mb-5 max-w-[580px] mx-auto">
                            Ready to build your AI consulting career?
                        </h2>
                        <p className="text-[16px] text-white/30 mb-8 max-w-[420px] mx-auto leading-relaxed">
                            One workshop that could change how you do business.
                        </p>
                        <div className="flex items-baseline justify-center gap-2.5 mb-10">
                            <span className="text-[20px] font-normal line-through text-white/15">₹299</span>
                            <span className="text-[42px] font-bold text-white leading-none tracking-tight">₹1</span>
                        </div>
                        <button onClick={scrollToForm} className="bg-home-gradient text-white px-10 py-4 rounded-xl font-semibold text-[15px] transition-all hover:opacity-90 shadow-[0_0_20px_rgba(255,87,87,0.12)] hover:shadow-[0_0_32px_rgba(140,82,255,0.3)] hover:-translate-y-0.5 inline-flex items-center gap-2">
                            Register Now <ArrowRight className="w-4 h-4" />
                        </button>
                    </Reveal>
                </div>
            </section>

            <Footer theme={theme} />

            {/* Sticky bottom bar */}
            <AnimatePresence>
                {showSticky && (
                    <motion.div
                        initial={{ y: 80 }}
                        animate={{ y: 0 }}
                        exit={{ y: 80 }}
                        transition={{ type: "spring", damping: 26, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-50 bg-[#030712]/95 backdrop-blur-xl border-t border-white/[0.06]"
                    >
                        <div className="mx-auto max-w-[1100px] px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
                            {/* Left — Timer + Seats */}
                            <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                                {/* Timer */}
                                <div className="shrink-0">
                                    <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.15em] text-[#ff5757] mb-0.5">Offer ends in</p>
                                    <span className="font-mono text-[20px] sm:text-[24px] font-bold text-white tabular-nums tracking-tight">{timerDisplay}</span>
                                </div>
                                {/* Divider */}
                                <span className="w-px h-8 bg-white/[0.08] shrink-0" />
                                {/* Seats */}
                                <div className="shrink-0">
                                    <p className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40 mb-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff5757] animate-pulse" />
                                        Limited Seats
                                    </p>
                                    <span className="text-[20px] sm:text-[24px] font-bold text-white tracking-tight">{seatsLeft} <span className="text-[12px] sm:text-[14px] font-medium text-white/40 tracking-normal lowercase">left</span></span>
                                </div>
                            </div>

                            {/* Right — CTA */}
                            <button onClick={scrollToForm} className="bg-home-gradient text-white px-6 sm:px-8 py-3 rounded-xl font-semibold text-[13px] sm:text-[14px] flex items-center gap-2 shrink-0 hover:opacity-90 transition-all shadow-[0_0_20px_rgba(255,87,87,0.15)]">
                                Register — ₹1 <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
