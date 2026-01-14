'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Link as LinkIcon, 
    Fingerprint, 
    Loader2, Info
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HelperJoinPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', text: '' });
    const [user, setUser] = useState(null);
    const [isCheckingRole, setIsCheckingRole] = useState(true);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

    const [formData, setFormData] = useState({
        email: '', phone: '', specialty: '', experience: '', 
        summary: '', aadhar: '', workArea: '', resumeLink: '',
        linkedin: '', agreed: false
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            router.push('/login?redirect=/join');
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setFormData(prev => ({ ...prev, email: parsedUser.email || '' }));
        setIsCheckingRole(false);
    }, [router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.agreed) return;
        setIsSubmitting(true);
        setStatus({ type: 'success', text: "AUTHORIZING DATA TRANSMISSION..." });

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/auth/upgrade-to-helper`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const updatedUser = { ...user, applicationStatus: 'pending' };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setStatus({ type: 'success', text: "✓ DOSSIER FILED. PENDING ADMIN AUDIT." });
                setTimeout(() => router.push('/dashboard'), 2000);
            } else {
                const data = await res.json();
                setStatus({ type: 'error', text: data.message });
                setIsSubmitting(false);
            }
        } catch (err) {
            setStatus({ type: 'error', text: "REGISTRY OFFLINE." });
            setIsSubmitting(false);
        }
    };

    if (isCheckingRole) return (
        <div className="h-screen bg-slate-950 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-[#D4AF37] mb-3" size={32} />
            <p className="text-xs font-black uppercase tracking-widest text-white/40">Syncing Registry...</p>
        </div>
    );

    const isRestricted = user?.role === 'admin' || user?.role === 'helper' || user?.applicationStatus === 'pending';

    return (
        <main className="bg-[#F9F6EE] min-h-screen font-sans selection:bg-[#D4AF37] selection:text-slate-950">
            <Header />

            <section className="pt-24 pb-20 bg-slate-950 px-6">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 items-start">
                    
                    <div className="lg:col-span-4 space-y-4">
                        <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-md">
                            <Fingerprint className="text-[#D4AF37] mb-3" size={24} />
                            <h3 className="text-lg font-serif text-white uppercase leading-none">{user?.name}</h3>
                            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-2">Current: Standard Access</p>
                        </div>
                        <div className="py-4">
                            <h2 className="text-3xl font-serif text-white uppercase leading-tight tracking-tighter">Registry<br/>Professional.</h2>
                            <p className="text-slate-400 text-[11px] font-medium leading-relaxed mt-4">
                                Upgrade your profile to Specialist Status to begin receiving care assignments.
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100">
                        {isRestricted ? (
                            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
                                <Info size={32} className="text-[#D4AF37]" />
                                <h3 className="text-xl font-serif uppercase text-slate-900">Account Status Locked</h3>
                                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                                    {user?.role === 'admin' ? "Admins are not permitted to register as helpers." :
                                     user?.role === 'helper' ? "You are already a verified specialist." :
                                     "Your professional dossier is currently being vetted by the board."}
                                </p>
                                <button onClick={() => router.push('/dashboard')} className="mt-6 px-10 py-3 bg-slate-950 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-all">
                                    Back to Dashboard
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <header className="mb-8 border-b border-slate-50 pb-4">
                                    <h2 className="text-2xl font-serif uppercase text-slate-950 tracking-tight">Vetting Application</h2>
                                </header>

                                <AnimatePresence mode="wait">
                                    {status.text && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mb-8 p-4 rounded-xl text-xs font-bold uppercase tracking-widest text-center border ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                            {status.text}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="grid md:grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Registry Email</label>
                                        <input name="email" value={formData.email} onChange={handleChange} required type="email" className="w-full bg-[#F9F6EE] border-none rounded-xl py-3.5 px-4 text-sm font-semibold focus:ring-1 focus:ring-slate-950 outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Phone Signal</label>
                                        <input name="phone" onChange={handleChange} required type="tel" placeholder="+91" className="w-full bg-[#F9F6EE] border-none rounded-xl py-3.5 px-4 text-sm font-semibold focus:ring-1 focus:ring-slate-950 outline-none" />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Specialty</label>
                                        <input name="specialty" onChange={handleChange} required type="text" placeholder="e.g. Elderly Care" className="w-full bg-[#F9F6EE] border-none rounded-xl py-3.5 px-4 text-sm font-semibold focus:ring-1 focus:ring-slate-950 outline-none uppercase" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Years of Experience</label>
                                        <input name="experience" onChange={handleChange} required type="number" placeholder="Total Years" className="w-full bg-[#F9F6EE] border-none rounded-xl py-3.5 px-4 text-sm font-semibold focus:ring-1 focus:ring-slate-950 outline-none" />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Work Zone</label>
                                        <input name="workArea" onChange={handleChange} required type="text" placeholder="Lucknow Area" className="w-full bg-[#F9F6EE] border-none rounded-xl py-3.5 px-4 text-sm font-semibold focus:ring-1 focus:ring-slate-950 outline-none uppercase" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Aadhar Number</label>
                                        <input name="aadhar" onChange={handleChange} required type="text" placeholder="12 Digit ID" className="w-full bg-[#F9F6EE] border-none rounded-xl py-3.5 px-4 text-sm font-semibold focus:ring-1 focus:ring-slate-950 outline-none" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Resume / Dossier Link</label>
                                    <input name="resumeLink" onChange={handleChange} required type="url" placeholder="Google Drive or Dropbox Link" className="w-full bg-[#F9F6EE] border-none rounded-xl py-3.5 px-4 text-sm font-semibold focus:ring-1 focus:ring-slate-950 outline-none" />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Professional Statement</label>
                                    <textarea name="summary" onChange={handleChange} required rows="3" placeholder="Briefly describe your medical/care background..." className="w-full bg-[#F9F6EE] border-none rounded-xl p-4 text-sm font-medium focus:ring-1 focus:ring-slate-950 outline-none" />
                                </div>

                                <div className="py-4 border-t border-slate-50">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input required type="checkbox" onChange={(e) => setFormData({...formData, agreed: e.target.checked})} className="w-4 h-4 rounded border-slate-200 text-slate-900 focus:ring-slate-950 cursor-pointer" />
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">All data submitted is legally verified and authentic.</span>
                                    </label>
                                </div>

                                <button disabled={isSubmitting || !formData.agreed} type="submit" className="w-full bg-slate-950 text-white py-5 rounded-2xl font-bold uppercase text-[11px] tracking-[0.3em] shadow-lg hover:bg-[#D4AF37] hover:text-slate-950 transition-all disabled:bg-slate-200 flex items-center justify-center gap-3">
                                    {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : "Submit Dossier for Vetting"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}