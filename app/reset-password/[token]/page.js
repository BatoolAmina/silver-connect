'use client';
import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordPage({ params }) {
    const resolvedParams = use(params);
    const token = resolvedParams.token;
    const router = useRouter();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    
    const [status, setStatus] = useState({ type: '', text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setStatus({ type: 'error', text: 'PASSWORDS DO NOT MATCH.' });
        }
        setIsSubmitting(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/reset-password/${token}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            if (res.ok) {
                setStatus({ type: 'success', text: '✓ ACCESS RESTORED. REDIRECTING...' });
                setTimeout(() => router.push('/login'), 2000);
            } else {
                setStatus({ type: 'error', text: 'TOKEN EXPIRED OR INVALID.' });
            }
        } catch (err) {
            setStatus({ type: 'error', text: 'SYSTEM ERROR.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#F9F6EE] flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 text-center">
                <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center text-[#D4AF37] mx-auto mb-6">
                    <ShieldCheck size={32} />
                </div>
                <h1 className="text-3xl font-serif uppercase tracking-tight text-slate-950 mb-2">New Cipher</h1>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Update Security Credentials</p>

                {status.text && (
                    <div className={`p-4 mb-8 rounded-xl text-xs font-bold uppercase tracking-widest ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {status.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative group">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            required 
                            placeholder="NEW PASSWORD" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full p-4 pr-12 rounded-xl bg-slate-50 border-none text-xs font-bold tracking-widest focus:ring-1 focus:ring-slate-950 outline-none transition-all" 
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-950 transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    <div className="relative group">
                        <input 
                            type={showConfirm ? "text" : "password"} 
                            required 
                            placeholder="CONFIRM PASSWORD" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            className="w-full p-4 pr-12 rounded-xl bg-slate-50 border-none text-xs font-bold tracking-widest focus:ring-1 focus:ring-slate-950 outline-none transition-all" 
                        />
                        <button 
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-950 transition-colors"
                        >
                            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    <button 
                        disabled={isSubmitting} 
                        className="w-full bg-slate-950 text-white font-black py-5 rounded-2xl uppercase tracking-[0.4em] text-xs hover:bg-[#D4AF37] hover:text-slate-950 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin mx-auto" size={16}/>
                        ) : (
                            "Update Cipher"
                        )}
                    </button>
                </form>
            </div>
        </main>
    );
}