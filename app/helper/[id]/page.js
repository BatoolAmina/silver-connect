'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  ChevronLeft, ShieldCheck, MapPin, Clock, 
  Send, Loader2, Mail, Info, Zap
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

export default function HelperDetails({ params }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const router = useRouter();
    const { secureFetch } = useAuth();
    const [helper, setHelper] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [todayDate, setTodayDate] = useState('');

    const [bookingData, setBookingData] = useState({
        date: '', phone: '', address: '', notes: ''
    });

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!storedUser || !token) {
            router.replace('/login');
            return;
        }

        setCurrentUser(JSON.parse(storedUser));
        setTodayDate(new Date().toISOString().split('T')[0]);

        const fetchHelperFullProfile = async () => {
            if (!id) return;
            try {
                const res = await fetch(`${API_BASE_URL}/api/helpers/profile/${id}`);
                const result = await res.json();
                
                if (result.success) {
                    setHelper(result.data);
                } else {
                    setMessage({ type: 'error', text: "SPECIALIST DATA NOT FOUND." });
                }
            } catch (err) {
                setMessage({ type: 'error', text: "REGISTRY SERVER OFFLINE." });
            } finally {
                setLoading(false);
            }
        };
        fetchHelperFullProfile();
    }, [id, API_BASE_URL, router]);

    const handleBooking = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await secureFetch(`${API_BASE_URL}/api/bookings/create`, {
                method: 'POST',
                body: JSON.stringify({ 
                    helperId: helper._id, 
                    helperName: helper.name,
                    helperEmail: helper.email,
                    seniorName: currentUser.name,
                    seniorEmail: currentUser.email,
                    ...bookingData 
                })
            });

            if (res && res.ok) {
                setMessage({ type: 'success', text: "✓ DISPATCH AUTHORIZED. SPECIALIST NOTIFIED." });
                setTimeout(() => router.push('/dashboard'), 2000);
            } else if (res) {
                const errData = await res.json();
                setMessage({ type: 'error', text: errData.message || "TRANSMISSION FAILED." });
            }
        } catch (err) {
            setMessage({ type: 'error', text: "SERVER TIMEOUT." });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#F9F6EE]">
            <Loader2 className="animate-spin text-slate-950 mb-4" size={32} />
            <p className="font-black uppercase text-xs tracking-widest text-slate-400">Authenticating Access...</p>
        </div>
    );

    const isOwnProfile = currentUser?._id === helper?._id;

    return (
        <main className="min-h-screen bg-[#F9F6EE] font-sans selection:bg-[#D4AF37]">
            <Header />
            
            <section className="h-[45vh] bg-slate-950 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_100%)] opacity-70" />
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif text-white uppercase tracking-tighter">Book Your Request</h1>
                </motion.div>
            </section>
            
            <div className="max-w-6xl mx-auto px-6 -mt-30 pb-20 relative z-20">
                <div className="flex flex-col lg:flex-row gap-10 items-start">
                    
                    <aside className="w-full lg:w-[360px] lg:sticky lg:top-24">
                        <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white shadow-2xl border border-white/5 relative overflow-hidden">
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="relative mb-6">
                                    <div className="w-24 h-24 rounded-[2rem] bg-slate-900 flex items-center justify-center text-[#D4AF37] text-4xl font-serif font-bold border border-white/10">
                                        {helper?.name?.charAt(0)}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-2 rounded-xl border-4 border-slate-950">
                                        <ShieldCheck size={16} className="text-white"/>
                                    </div>
                                </div>
                                
                                <h1 className="text-2xl font-serif uppercase tracking-tight mb-1">{helper?.name}</h1>
                                <p className="text-[#D4AF37] text-xs font-black uppercase tracking-[0.2em] mb-6">{helper?.specialty}</p>
                                
                                <div className="w-full space-y-4 text-[11px] font-bold border-t border-white/10 pt-6 mb-6 text-left">
                                    <div className="flex justify-between items-center gap-4">
                                        <span className="text-slate-400 uppercase tracking-widest flex items-center gap-3"><Mail size={14} className="text-[#D4AF37]"/> Email</span>
                                        <span className="text-white truncate lowercase font-medium">{helper?.email}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400 uppercase tracking-widest flex items-center gap-3"><Clock size={14} className="text-[#D4AF37]"/> Experience</span>
                                        <span className="text-white">{helper?.experience} Years</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400 uppercase tracking-widest flex items-center gap-3"><MapPin size={14} className="text-[#D4AF37]"/> Zone</span>
                                        <span className="text-white uppercase">{helper?.workArea}</span>
                                    </div>
                                </div>

                                <div className="p-5 bg-white/5 rounded-2xl text-[12px] text-slate-300 leading-relaxed text-left border border-white/5">
                                    {helper?.summary || helper?.bio || "Verified specialist with a clean service history and certified identity."}
                                </div>
                            </div>
                        </div>
                        <Link href="/helpers" className="mt-6 inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-black text-xs uppercase tracking-widest ml-4">
                            <ChevronLeft size={14} /> Back to Directory
                        </Link>
                    </aside>

                    <div className="flex-1 w-full">
                        <section className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-slate-100 min-h-[500px]">
                            {isOwnProfile ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                    <div className="w-16 h-16 bg-[#F9F6EE] rounded-[1.5rem] flex items-center justify-center text-[#D4AF37] mb-6">
                                        <Info size={28} />
                                    </div>
                                    <h3 className="text-xl font-serif uppercase text-slate-950">Terminal Restricted</h3>
                                    <p className="text-xs text-slate-400 max-w-xs mt-3 leading-relaxed uppercase font-black tracking-widest">
                                        You are currently viewing your own profile. Registry dispatches cannot be self-authorized.
                                    </p>
                                    <Link href="/helper" className="mt-8 px-10 py-4 bg-slate-950 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#D4AF37] transition-all">
                                        Go to Helper Terminal
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <header className="mb-3">
                                        <span className="text-xs font-black text-[#D4AF37] uppercase tracking-[0.4em] block mb-1">Engagement Protocol</span>
                                        <h2 className="text-3xl font-serif uppercase text-slate-950 tracking-tighter">
                                            Request Dispatch
                                        </h2>
                                    </header>

                                    <AnimatePresence>
                                        {message.text && (
                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 mb-8 rounded-xl border font-bold text-xs uppercase tracking-widest text-center ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                                {message.text}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <form onSubmit={handleBooking} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Engagement Date</label>
                                                <input type="date" required min={todayDate} className="w-full bg-[#F9F6EE]/50 border-none rounded-xl p-4 text-sm font-bold focus:ring-1 focus:ring-slate-950 outline-none" onChange={(e) => setBookingData({...bookingData, date: e.target.value})} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Contact Signal (Phone)</label>
                                                <input type="tel" required placeholder="+91 XXXX XXXX" className="w-full bg-[#F9F6EE]/50 border-none rounded-xl p-4 text-sm font-bold focus:ring-1 focus:ring-slate-950 outline-none" onChange={(e) => setBookingData({...bookingData, phone: e.target.value})} />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Target Address</label>
                                            <input type="text" required placeholder="Specific location" className="w-full bg-[#F9F6EE]/50 border-none rounded-xl p-4 text-sm font-bold focus:ring-1 focus:ring-slate-950 outline-none" onChange={(e) => setBookingData({...bookingData, address: e.target.value})} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Deployment Directives (Notes)</label>
                                            <textarea rows="4" required placeholder="Any specific medical requirements or care notes..." className="w-full bg-[#F9F6EE]/50 border-none rounded-2xl p-5 text-sm font-medium focus:ring-1 focus:ring-slate-950 outline-none leading-relaxed" onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}></textarea>
                                        </div>

                                        <button type="submit" disabled={isSubmitting} className="w-full bg-slate-950 text-white font-black py-5 rounded-2xl uppercase tracking-[0.5em] text-xs shadow-xl hover:bg-[#D4AF37] hover:text-slate-950 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
                                            {isSubmitting ? <Loader2 className="animate-spin" size={16}/> : <Send size={16}/>}
                                            Authorize Dispatch
                                        </button>
                                    </form>
                                </>
                            )}
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}