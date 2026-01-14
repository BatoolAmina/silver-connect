'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { ShieldCheck, ArrowRight, Lock, Mail, User, Zap, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function UnifiedRegisterPage() {
    const router = useRouter();
    const { setUser, setToken } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCheckingSession, setIsCheckingSession] = useState(true);
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [status, setStatus] = useState({ type: '', text: '' });

    const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreed: false
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            router.replace('/dashboard');
        } else {
            setIsCheckingSession(false);
        }
    }, [router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            if (name === 'password' || name === 'confirmPassword') {
                setPasswordsMatch(updated.password === updated.confirmPassword);
            }
            return updated;
        });
    };

    const handleAuthSuccess = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(token);
        setUser(userData);
        router.push('/dashboard');
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setIsSubmitting(true);
        setStatus({ type: 'success', text: "INITIATING SECURE SYNC..." });
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/google-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken: credentialResponse.credential, role: 'user' })
            });
            const data = await res.json();
            if (res.ok) {
                setStatus({ type: 'success', text: "ACCOUNT AUTHORIZED." });
                handleAuthSuccess(data.user, data.token);
            } else {
                setStatus({ type: 'error', text: data.message || "AUTHENTICATION FAILED." });
            }
        } catch (err) {
            setStatus({ type: 'error', text: "REGISTRY OFFLINE." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!passwordsMatch || !formData.agreed) return;
        setIsSubmitting(true);
        setStatus({ type: '', text: '' });

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email.toLowerCase().trim(),
                    password: formData.password,
                    role: 'user'
                })
            });
            const data = await res.json();
            if (res.ok) {
                setStatus({ type: 'success', text: "IDENTITY CREATED. REDIRECTING..." });
                setTimeout(() => router.push('/login'), 1500);
            } else {
                if (data.message && data.message.includes('already')) {
                    setStatus({ type: 'error', text: "IDENTITY ALREADY REGISTERED. PLEASE LOGIN." });
                    setTimeout(() => router.push('/login'), 2000);
                } else {
                    setStatus({ type: 'error', text: data.message });
                }
            }
        } catch (err) {
            setStatus({ type: 'error', text: "CONNECTION FAILURE." });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isCheckingSession) return (
        <div className="h-screen bg-slate-950 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-[#D4AF37]" size={32} />
        </div>
    );

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <main className="bg-[#F9F6EE] min-h-screen font-sans selection:bg-slate-900 selection:text-white">
                <Header />

                <header className="relative h-[45vh] flex items-center justify-center bg-slate-950 text-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_100%)]" />
                    <div className="max-w-4xl mx-auto relative z-10">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                                <ShieldCheck size={12} className="text-[#D4AF37]" />
                                <span className="text-white text-[9px] font-black uppercase tracking-widest">Global Security Standards</span>
                            </div>
                            <h1 className="text-5xl md:text-5xl font-serif text-white uppercase tracking-tighter">
                                Create Identity
                            </h1>
                        </motion.div>
                    </div>
                </header>

                <section className="py-12 -mt-40 relative z-20 pb-24">
                    <div className="max-w-3xl mx-auto px-6">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-slate-100">
                            
                            <div className="mb-8 flex flex-col items-center">
                                <GoogleLogin 
                                    onSuccess={handleGoogleSuccess} 
                                    theme="filled_black" 
                                    shape="pill" 
                                    text="signup_with"
                                />
                            </div>

                            <div className="relative mb-8">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                                <div className="relative flex justify-center text-xs font-black uppercase tracking-[0.4em] text-slate-300">
                                    <span className="px-4 bg-white">Manual Enrollment</span>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {status.text && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`mb-6 p-4 rounded-xl text-xs font-bold uppercase tracking-widest text-center border ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                        {status.text}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={16} />
                                        <input name="name" onChange={handleChange} required type="text" placeholder="LEGAL NAME" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none text-sm font-bold text-slate-900 focus:ring-1 focus:ring-slate-950 outline-none shadow-inner" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Identifier</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={16} />
                                        <input name="email" onChange={handleChange} required type="email" placeholder="EMAIL@DOMAIN.COM" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none text-sm font-bold text-slate-900 focus:ring-1 focus:ring-slate-950 outline-none shadow-inner" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Pass-Cipher</label>
                                        <input name="password" onChange={handleChange} required type="password" placeholder="••••" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 focus:ring-1 focus:ring-slate-950 outline-none shadow-inner" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Verify</label>
                                        <input name="confirmPassword" onChange={handleChange} required type="password" placeholder="••••" className={`w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 focus:ring-1 outline-none shadow-inner ${!passwordsMatch ? 'ring-red-500 ring-1' : 'focus:ring-slate-950'}`} />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input required type="checkbox" checked={formData.agreed} onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950 cursor-pointer" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">I agree to the Secure Registry Protocols.</span>
                                    </label>
                                </div>

                                <button disabled={isSubmitting || !passwordsMatch || !formData.agreed} type="submit" className={`w-full text-white font-black py-5 rounded-2xl transition-all uppercase tracking-[0.4em] text-xs shadow-xl flex items-center justify-center gap-4 ${isSubmitting || !passwordsMatch || !formData.agreed ? 'bg-slate-300' : 'bg-slate-950 hover:bg-[#D4AF37] hover:text-slate-950 active:scale-[0.98]'}`}>
                                    {isSubmitting ? "SYNCING..." : "Register Account"}
                                    {!isSubmitting && <ArrowRight size={14} />}
                                </button>
                            </form>

                            <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                                <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-2">
                                    EXISTING MEMBER?
                                </p>
                                <Link href="/login" className="inline-block px-8 py-3 rounded-xl border border-slate-200 text-slate-950 text-xs font-black uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all">
                                    Registry Login
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
                <Footer />
            </main>
        </GoogleOAuthProvider>
    );
}