'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { ShieldCheck, Lock, Mail, LogIn, Loader2, Zap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LoginPage() {
    const router = useRouter();
    const { setUser, setToken } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCheckingSession, setIsCheckingSession] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            const user = JSON.parse(storedUser);
            routeUserByRole(user);
        } else {
            setIsCheckingSession(false);
        }
    }, [router]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const routeUserByRole = (user) => {
        if (user.role === 'admin') {
            router.replace('/admin');
        } else if (user.role === 'helper') {
            user.isVerified ? router.replace('/helper') : router.replace('/dashboard');
        } else {
            router.replace('/dashboard');
        }
    };

    const handleLoginSuccess = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(token);
        setUser(userData);
        routeUserByRole(userData);
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setIsSubmitting(true);
        setMessage({ type: 'success', text: "INITIATING EXTERNAL HANDSHAKE..." });
        
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/google-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken: credentialResponse.credential })
            });
            const data = await res.json();
            
            if (res.ok) {
                setMessage({ type: 'success', text: "IDENTITY SYNCED. AUTHORIZING..." });
                handleLoginSuccess(data.user, data.token);
            } else {
                setMessage({ type: 'error', text: data.message || "GOOGLE AUTH DENIED." });
            }
        } catch (err) {
            setMessage({ type: 'error', text: "CONNECTION INTERRUPTED." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setIsSubmitting(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email.toLowerCase().trim(),
                    password: formData.password
                })
            });
            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: "IDENTITY VERIFIED. SYNCING TERMINAL..." });
                handleLoginSuccess(data.user, data.token);
            } else {
                setMessage({ type: 'error', text: data.message || "INVALID CIPHER." });
            }
        } catch (err) {
            setMessage({ type: 'error', text: "ENCRYPTION HANDSHAKE FAILED." });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isCheckingSession) return (
        <div className="h-screen bg-slate-950 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-[#D4AF37] mb-4" size={32} />
            <p className="text-xs font-black uppercase tracking-[0.4em] text-white/40">Authenticating Session...</p>
        </div>
    );

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <main className="bg-[#F9F6EE] min-h-screen font-sans selection:bg-slate-900 selection:text-white">
                <Header />

                <header className="relative h-[45vh] flex items-center justify-center bg-slate-950 text-center ">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_100%)]" />
                    <div className="max-w-4xl mx-auto relative z-10">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                                <Zap size={12} className="text-[#D4AF37]" />
                                <span className="text-white text-[9px] font-black uppercase tracking-widest">
                                    Encrypted Access Portal
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-5xl font-serif text-white uppercase tracking-tighter">
                                Registry Login
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
                                    text="signin_with"
                                />
                            </div>

                            <div className="relative mb-8">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                                <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.4em] text-slate-300">
                                    <span className="px-4 bg-white font-sans">Internal Credential Match</span>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {message.text && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`p-4 mb-6 rounded-xl border text-xs font-bold uppercase tracking-widest text-center ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                        {message.text}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 font-sans">Identifier Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={16} />
                                        <input type="email" name="email" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none text-sm font-bold text-slate-900 focus:ring-1 focus:ring-slate-950 outline-none shadow-inner" placeholder="name@registry.com" value={formData.email} onChange={handleChange} required />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest font-sans">Pass-Cipher</label>
                                        <Link href="/forgot-password" size={12} className="text-[9px] font-bold text-[#D4AF37] hover:text-slate-950 transition-colors uppercase tracking-widest">Restore Access?</Link>
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={16} />
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            name="password" 
                                            className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-50 border-none text-sm font-bold text-slate-900 focus:ring-1 focus:ring-slate-950 outline-none shadow-inner" 
                                            placeholder="••••••••" 
                                            value={formData.password} 
                                            onChange={handleChange} 
                                            required 
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <button disabled={isSubmitting} type="submit" className="w-full bg-slate-950 text-white font-black py-5 rounded-2xl transition-all uppercase tracking-[0.4em] text-xs shadow-xl hover:bg-[#D4AF37] hover:text-slate-950 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50">
                                    {isSubmitting ? 'AUTHORIZING...' : 'GRANT ACCESS'}
                                    {!isSubmitting && <LogIn size={14} />}
                                </button>
                            </form>

                            <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                                <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-2">
                                    UNREGISTERED NODE?
                                </p>
                                <Link href="/register" className="inline-block px-8 py-3 rounded-xl border border-slate-200 text-slate-950 text-xs font-black uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all">
                                    Create New Identity
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