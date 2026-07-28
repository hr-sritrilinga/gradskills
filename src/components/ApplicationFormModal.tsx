import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export function ApplicationFormModal({
    children,
    open: externalOpen,
    onOpenChange: setExternalOpen
}: {
    children?: React.ReactNode,
    open?: boolean,
    onOpenChange?: (open: boolean) => void
}) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
    const onOpenChange = externalOpen !== undefined ? setExternalOpen : setInternalOpen;

    const [isSubmitted, setIsSubmitted] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === "/";
    const isElevate = location.pathname === "/elevate";
    const isFoundation = location.pathname === "/foundational";

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        college: "",
        status: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const pageName = isHome ? "Home" : isElevate ? "Elevate" : isFoundation ? "Foundational" : "AI Product Builder";

        try {
            // Send Email Notification (via Web3Forms)
            const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || "d9940085-bcaa-494a-a422-350e57cf3f83";

            if (WEB3FORMS_ACCESS_KEY) {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        access_key: WEB3FORMS_ACCESS_KEY,
                        subject: `New Lead: ${formData.name} from ${pageName}`,
                        from_name: "GradSkills Website",
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        college: formData.college,
                        status: formData.status,
                        page: pageName
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to submit to Web3Forms");
                }
            } else {
                throw new Error("Missing Web3Forms Access Key");
            }

            setIsSubmitted(true);
        } catch (err: any) {
            console.error("Submission Error:", err);
            toast.error("Failed to submit application. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                onOpenChange?.(open);
                if (!open) {
                    setIsSubmitted(false);
                    setFormData({ name: "", phone: "", email: "", college: "", status: "" });
                }
            }}
        >
            {children && (
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
            )}
            <DialogContent
                className="w-[95%] sm:max-w-[450px] bg-white text-gray-900 border border-gray-100 shadow-2xl font-sans rounded-3xl z-[100] max-h-[90dvh] overflow-y-auto outline-none"
            >
                <AnimatePresence mode="wait">
                    {isSubmitted ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                            className="flex flex-col items-center justify-center py-12 text-center gap-5 perspective-[1000px]"
                        >
                            <div className="relative flex items-center justify-center mb-4 mt-2">
                                {/* Trustworthy pulsing rings */}
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1.6, opacity: [0, 0.2, 0] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                                    className={`absolute w-20 h-20 rounded-full ${isHome ? "bg-[#ff5757]" : isElevate ? "bg-orange-500" : isFoundation ? "bg-purple-600" : "bg-blue-600"}`}
                                />
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 2.2, opacity: [0, 0.1, 0] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
                                    className={`absolute w-20 h-20 rounded-full ${isHome ? "bg-[#ff5757]" : isElevate ? "bg-orange-500" : isFoundation ? "bg-purple-600" : "bg-blue-600"}`}
                                />

                                {/* 3D Badge Center */}
                                <motion.div
                                    initial={{ scale: 0, rotateY: 180 }}
                                    animate={{ scale: 1, rotateY: 0 }}
                                    transition={{ type: "spring", damping: 15, stiffness: 150, delay: 0.1 }}
                                    className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-[0_15px_35px_rgba(0,0,0,0.2),inset_0_-4px_10px_rgba(0,0,0,0.1),inset_0_4px_10px_rgba(255,255,255,0.4)] transform-gpu ${isHome ? "bg-gradient-to-tr from-[#e64646] to-[#ff7a7a]" : isElevate ? "bg-gradient-to-tr from-orange-600 to-orange-400" : isFoundation ? "bg-gradient-to-tr from-purple-700 to-purple-400" : "bg-gradient-to-tr from-blue-700 to-blue-400"}`}
                                >
                                    {/* Animated Hand-drawn Check */}
                                    <svg viewBox="0 0 24 24" className="w-12 h-12 text-white drop-shadow-md z-10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <motion.path
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{ duration: 0.6, ease: "circOut", delay: 0.4 }}
                                            d="M6 12l4 4L18 7"
                                        />
                                    </svg>

                                    {/* Inner Gloss */}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent p-[2px] pointer-events-none" />
                                </motion.div>
                            </div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <DialogTitle className="text-[28px] font-bold tracking-tight text-gray-900 mb-2">
                                    Application Received!
                                </DialogTitle>
                                <p className="text-[15px] font-medium text-gray-500 max-w-[300px] mx-auto leading-relaxed">
                                    Your application has been successfully submitted. We will review your profile and get back to you shortly. Keep building!
                                </p>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <div key="form">
                            <DialogHeader className="mb-2">
                                <DialogTitle className="text-[26px] font-bold tracking-tight text-gray-900">
                                    Join <span className={isHome ? "text-home-gradient" : isElevate ? "text-orange-500" : isFoundation ? "text-purple-600" : "text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-600"}>GradSkills</span>
                                </DialogTitle>
                                <p className="text-[14px] font-medium text-gray-500">Secure your spot in the next cohort.</p>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                                <div className="grid grid-cols-2 gap-4">
                                    <div className={`flex flex-col gap-1.5 focus-within:text-[${isHome ? '#8c52ff' : isElevate ? '#f97316' : isFoundation ? '#9333ea' : '#2563eb'}] group`}>
                                        <label className={`text-[11px] font-semibold text-gray-500 uppercase tracking-widest transition-colors ${isHome ? "group-focus-within:text-[#8c52ff]" : isElevate ? "group-focus-within:text-orange-500" : isFoundation ? "group-focus-within:text-purple-600" : "group-focus-within:text-blue-600"}`}>Full Name</label>
                                        <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={`bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[16px] text-gray-900 focus:outline-none focus:ring-1 transition-all font-medium placeholder:text-gray-400 ${isHome ? "focus:border-[#8c52ff] focus:ring-[#8c52ff]" : isElevate ? "focus:border-orange-500 focus:ring-orange-500" : isFoundation ? "focus:border-purple-600 focus:ring-purple-600" : "focus:border-blue-500 focus:ring-blue-500"}`} placeholder="Your Name" />
                                    </div>

                                    <div className={`flex flex-col gap-1.5 focus-within:text-[${isHome ? '#8c52ff' : isElevate ? '#f97316' : isFoundation ? '#9333ea' : '#2563eb'}] group`}>
                                        <label className={`text-[11px] font-semibold text-gray-500 uppercase tracking-widest transition-colors ${isHome ? "group-focus-within:text-[#8c52ff]" : isElevate ? "group-focus-within:text-orange-500" : isFoundation ? "group-focus-within:text-purple-600" : "group-focus-within:text-blue-600"}`}>Phone Number</label>
                                        <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className={`bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[16px] text-gray-900 focus:outline-none focus:ring-1 transition-all font-medium placeholder:text-gray-400 ${isHome ? "focus:border-[#8c52ff] focus:ring-[#8c52ff]" : isElevate ? "focus:border-orange-500 focus:ring-orange-500" : isFoundation ? "focus:border-purple-600 focus:ring-purple-600" : "focus:border-blue-500 focus:ring-blue-500"}`} placeholder="Your Mobile Number" />
                                    </div>
                                </div>

                                <div className={`flex flex-col gap-1.5 focus-within:text-[${isHome ? '#8c52ff' : isElevate ? '#f97316' : isFoundation ? '#9333ea' : '#2563eb'}] group`}>
                                    <label className={`text-[11px] font-semibold text-gray-500 uppercase tracking-widest transition-colors ${isHome ? "group-focus-within:text-[#8c52ff]" : isElevate ? "group-focus-within:text-orange-500" : isFoundation ? "group-focus-within:text-purple-600" : "group-focus-within:text-blue-600"}`}>Email Address</label>
                                    <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className={`bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[16px] text-gray-900 focus:outline-none focus:ring-1 transition-all font-medium placeholder:text-gray-400 ${isHome ? "focus:border-[#8c52ff] focus:ring-[#8c52ff]" : isElevate ? "focus:border-orange-500 focus:ring-orange-500" : isFoundation ? "focus:border-purple-600 focus:ring-purple-600" : "focus:border-blue-500 focus:ring-blue-500"}`} placeholder="Your Mail" />
                                </div>

                                <div className={`flex flex-col gap-1.5 focus-within:text-[${isHome ? '#8c52ff' : isElevate ? '#f97316' : isFoundation ? '#9333ea' : '#2563eb'}] group`}>
                                    <label className={`text-[11px] font-semibold text-gray-500 uppercase tracking-widest transition-colors ${isHome ? "group-focus-within:text-[#8c52ff]" : isElevate ? "group-focus-within:text-orange-500" : isFoundation ? "group-focus-within:text-purple-600" : "group-focus-within:text-blue-600"}`}>Qualification</label>
                                    <input required type="text" value={formData.college} onChange={e => setFormData({ ...formData, college: e.target.value })} className={`bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[16px] text-gray-900 focus:outline-none focus:ring-1 transition-all font-medium placeholder:text-gray-400 ${isHome ? "focus:border-[#8c52ff] focus:ring-[#8c52ff]" : isElevate ? "focus:border-orange-500 focus:ring-orange-500" : isFoundation ? "focus:border-purple-600 focus:ring-purple-600" : "focus:border-blue-500 focus:ring-blue-500"}`} placeholder="Your Qualification" />
                                </div>

                                <div className={`flex flex-col gap-1.5 focus-within:text-[${isHome ? '#8c52ff' : isElevate ? '#f97316' : isFoundation ? '#9333ea' : '#2563eb'}] group relative`}>
                                    <label className={`text-[11px] font-semibold text-gray-500 uppercase tracking-widest transition-colors ${isHome ? "group-focus-within:text-[#8c52ff]" : isElevate ? "group-focus-within:text-orange-500" : isFoundation ? "group-focus-within:text-purple-600" : "group-focus-within:text-blue-600"}`}>Current Status</label>
                                    <Select required value={formData.status} onValueChange={val => setFormData({ ...formData, status: val })}>
                                        <SelectTrigger className={`bg-gray-50 border border-gray-200 rounded-lg px-4 h-[46px] text-[16px] text-gray-900 focus:outline-none focus:ring-1 transition-all font-medium ${isHome ? "focus:border-[#8c52ff] focus:ring-[#8c52ff]" : isElevate ? "focus:border-orange-500 focus:ring-orange-500" : isFoundation ? "focus:border-purple-600 focus:ring-purple-600" : "focus:border-blue-500 focus:ring-blue-500"}`}>
                                            <SelectValue placeholder="Select your year" className="text-gray-400" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-gray-200 rounded-xl shadow-lg z-[110]">
                                            <SelectItem value="grad_1" className={`text-[14px] font-medium py-2.5 cursor-pointer ${isHome ? "focus:bg-[#8c52ff]/10 focus:text-[#8c52ff]" : isElevate ? "focus:bg-orange-50 focus:text-orange-600" : isFoundation ? "focus:bg-purple-50 focus:text-purple-600" : "focus:bg-blue-50 focus:text-blue-700"}`}>Graduation 1st Year</SelectItem>
                                            <SelectItem value="grad_2" className={`text-[14px] font-medium py-2.5 cursor-pointer ${isHome ? "focus:bg-[#8c52ff]/10 focus:text-[#8c52ff]" : isElevate ? "focus:bg-orange-50 focus:text-orange-600" : isFoundation ? "focus:bg-purple-50 focus:text-purple-600" : "focus:bg-blue-50 focus:text-blue-700"}`}>Graduation 2nd Year</SelectItem>
                                            <SelectItem value="grad_3" className={`text-[14px] font-medium py-2.5 cursor-pointer ${isHome ? "focus:bg-[#8c52ff]/10 focus:text-[#8c52ff]" : isElevate ? "focus:bg-orange-50 focus:text-orange-600" : isFoundation ? "focus:bg-purple-50 focus:text-purple-600" : "focus:bg-blue-50 focus:text-blue-700"}`}>Graduation 3rd Year</SelectItem>
                                            <SelectItem value="grad_4" className={`text-[14px] font-medium py-2.5 cursor-pointer ${isHome ? "focus:bg-[#8c52ff]/10 focus:text-[#8c52ff]" : isElevate ? "focus:bg-orange-50 focus:text-orange-600" : isFoundation ? "focus:bg-purple-50 focus:text-purple-600" : "focus:bg-blue-50 focus:text-blue-700"}`}>Graduation 4th Year</SelectItem>
                                            <SelectItem value="graduated" className={`text-[14px] font-medium py-2.5 cursor-pointer ${isHome ? "focus:bg-[#8c52ff]/10 focus:text-[#8c52ff]" : isElevate ? "focus:bg-orange-50 focus:text-orange-600" : isFoundation ? "focus:bg-purple-50 focus:text-purple-600" : "focus:bg-blue-50 focus:text-blue-700"}`}>Graduated</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <button disabled={isLoading} type="submit" className={`mt-4 w-full flex items-center justify-center gap-2 text-white font-semibold py-4 rounded-2xl text-[16px] shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 disabled:opacity-75 disabled:pointer-events-none ${isHome ? "bg-home-gradient hover:opacity-90 shadow-[#8c52ff]/10" : isElevate ? "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20" : isFoundation ? "bg-purple-600 hover:bg-purple-700 shadow-purple-600/20" : "bg-blue-800 hover:bg-blue-900 shadow-blue-800/20"}`}>
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Submit Application <ArrowRightIcon className="w-5 h-5" /></>}
                                </button>
                            </form>
                        </div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}

function ArrowRightIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
    )
}
