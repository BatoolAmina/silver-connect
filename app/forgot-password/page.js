'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, Zap, ShieldCheck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', text: '' });

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email: email.toLowerCase().trim() })
            });

            const contentType = res.headers.get("content-type");
            
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await res.json();
                
                if (res.ok) {
                    setStatus({ 
                        type: 'success', 
                        text: "RECOVERY LINK DISPATCHED. CHECK YOUR INBOX." 
                    });
                } else {
                    setStatus({ 
                        type: 'error', 
                        text: data.message || "RECOVERY REQUEST DENIED." 
                    });
                }
            } else {
                // Handle non-JSON errors (like 404 or 500 HTML pages from Render)
                const text = await res.text();
                console.error("Server Error Response:", text);
                setStatus({ 
                    type: 'error', 
                    text: "REGISTRY ERROR: INVALID SERVER RESPONSE." 
                });
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setStatus({ 
                type: 'error', 
                text: "REGISTRY OFFLINE. CHECK YOUR CONNECTION." 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="bg-[#F9F6EE] min-h-screen font-sans selection:bg-slate-900 selection:text-white">
            <Header />

            <header className="relative h-[30vh] flex items-center justify-center bg-slate-950 pt-12 text-center px-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_100%)]" />
                <div className="max-w-4xl mx-auto relative z-10">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                            <ShieldCheck size={12} className="text-[#D4AF37]" />
                            <span className="text-white text-[9px] font-black uppercase tracking-widest">
                                Identity Recovery Terminal
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-serif text-white uppercase tracking-tighter">
                            Restore Access
                        </h1>
                    </motion.div>
                </div>
            </header>

            <section className="py-12 -mt-16 relative z-20 pb-24">
                <div className="max-w-lg mx-auto px-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-slate-100"
                    >
                        
                        <div className="mb-8 text-center">
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                Enter your registered identity email below. We will dispatch a secure cipher reset link to your node.
                            </p>
                        </div>

                        <AnimatePresence mode="wait">
                            {status.text && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }} 
                                    animate={{ opacity: 1, scale: 1 }} 
                                    exit={{ opacity: 0 }}
                                    className={`p-4 mb-8 rounded-xl border text-xs font-bold uppercase tracking-widest text-center ${
                                        status.type === 'success' 
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                        : 'bg-red-50 text-red-700 border-red-100'
                                    }`}
                                >
                                    {status.text}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                                    Identity Email
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-950 transition-colors" size={16} />
                                    <input 
                                        type="email" 
                                        required
                                        placeholder="NAME@REGISTRY.COM"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none text-sm font-bold text-slate-900 focus:ring-1 focus:ring-slate-950 outline-none shadow-inner transition-all"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button 
                                disabled={isSubmitting} 
                                type="submit" 
                                className="w-full bg-slate-950 text-white font-black py-5 rounded-2xl transition-all uppercase tracking-[0.4em] text-xs shadow-xl hover:bg-[#D4AF37] hover:text-slate-950 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={14} />
                                        <span>Dispatching Signal...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Send Recovery Link</span>
                                        <Zap size={14} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                            <Link href="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-950 transition-all font-black text-xs uppercase tracking-widest">
                                <ArrowLeft size={14} /> Back to Login
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}