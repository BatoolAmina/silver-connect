'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  User, Mail, Phone, MapPin, ShieldCheck, 
  Save, Loader2, Fingerprint, Briefcase, Zap, LogOut
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
  const router = useRouter();
  const { secureFetch, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    workArea: '',
    summary: '',
    specialty: '',
    experience: ''
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await secureFetch(`${API_BASE_URL}/api/auth/me`);
      if (res && res.ok) {
        const data = await res.json();
        setUser(data);
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          workArea: data.workArea || '',
          summary: data.summary || data.bio || '',
          specialty: data.specialty || '',
          experience: data.experience || ''
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, [secureFetch, API_BASE_URL]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await secureFetch(`${API_BASE_URL}/api/auth/update-profile`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });

      if (res && res.ok) {
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setMessage({ type: 'success', text: "✓ DOSSIER UPDATED SUCCESSFULLY." });
      } else if (res) {
        setMessage({ type: 'error', text: "TRANSMISSION FAILED." });
      }
    } catch (err) {
      setMessage({ type: 'error', text: "SYSTEM ERROR." });
    } finally {
      setIsUpdating(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F9F6EE]">
      <Loader2 className="animate-spin text-slate-950 mb-4" size={32} />
      <p className="font-black uppercase tracking-[0.4em] text-xs text-slate-400 text-center">
        Authenticating Dossier Access...
      </p>
    </div>
  );

  return (
    <main className="bg-[#F9F6EE] min-h-screen font-sans selection:bg-[#D4AF37] selection:text-slate-950">
      <Header />

      <section className="bg-slate-950 pt-32 pb-24 px-6 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[1400px] mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-10"
        >
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 flex items-center justify-center text-[#D4AF37] text-5xl font-serif font-bold shadow-2xl transition-transform group-hover:scale-105 duration-500">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#D4AF37] p-2.5 rounded-2xl border-4 border-slate-950 shadow-xl">
                <Zap size={20} className="text-slate-950" />
              </div>
            </div>
            
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                <h1 className="text-5xl md:text-4xl font-serif text-white uppercase tracking-tighter leading-tight">{user?.name}</h1>
                <span className="bg-white/5 border border-white/10 text-[#D4AF37] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.3em] w-fit mx-auto md:mx-0">
                  {user?.role}
                </span>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-widest">
                  <Mail size={14} className="text-[#D4AF37]"/> {user?.email}
                </div>
                {user?.isVerified && (
                  <div className="flex items-center gap-2 text-emerald-500 text-xs font-black uppercase tracking-widest">
                    <ShieldCheck size={14} /> Verified Registry Personnel
                  </div>
                )}
              </div>
            </div>
          </div>

          <button 
            onClick={logout}
            className="group flex items-center gap-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-6 py-4 rounded-2xl transition-all border border-red-500/20 font-black text-xs uppercase tracking-widest"
          >
            <LogOut size={16} />
            Terminate Session
          </button>
        </motion.div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 -mt-12 relative z-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                <Fingerprint size={16} className="text-[#D4AF37]" /> Session Matrix
              </h4>
              <div className="space-y-4">
                <StatusCapsule label="Auth Protocol" value={user?.googleId ? "Google Cloud" : "Standard JWT"} />
                <StatusCapsule label="Clearance" value={user?.role === 'admin' ? 'Level 3 Access' : (user?.isVerified ? 'Vetted Specialist' : 'Basic Member')} />
                <StatusCapsule label="Registry Ref" value={`SC-${user?._id?.slice(-6).toUpperCase()}`} />
              </div>
            </div>

            <div className="bg-slate-900 rounded-[3rem] p-8 text-white/70 border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12">
                <ShieldCheck size={120} />
              </div>
              <h4 className="text-xs font-black text-[#D4AF37] uppercase tracking-[0.3em] mb-4">Registry Privacy</h4>
              <p className="text-[11px] leading-relaxed font-medium">
                Your dossier is protected by multi-layer encryption. Session timeouts occur after 24 hours of inactivity to ensure registry integrity.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <form onSubmit={handleUpdate} className="bg-white rounded-[4rem] p-8 md:p-14 border border-slate-100 shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-center pb-8">
                <div>
                  <h3 className="text-3xl font-serif uppercase tracking-tight text-slate-950">Identity Settings</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Personnel Record Management</p>
                </div>
                <AnimatePresence>
                  {message.text && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }} 
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}
                    >
                      {message.text}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FormInput 
                  label="Full Identity Name" 
                  icon={<User size={16} />} 
                  value={formData.name}
                  onChange={(val) => setFormData({...formData, name: val})}
                />
                <FormInput 
                  label="Primary Contact Signal" 
                  icon={<Phone size={16} />} 
                  value={formData.phone}
                  onChange={(val) => setFormData({...formData, phone: val})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FormInput 
                  label="Operation Zone" 
                  icon={<MapPin size={16} />} 
                  value={formData.workArea}
                  placeholder="e.g. Indiranagar, Gomti Nagar"
                  onChange={(val) => setFormData({...formData, workArea: val})}
                />
                {user?.role === 'helper' && (
                  <FormInput 
                    label="Service Tenure (Years)" 
                    icon={<Briefcase size={16} />} 
                    value={formData.experience}
                    onChange={(val) => setFormData({...formData, experience: val})}
                  />
                )}
              </div>

              <div className="space-y-2 mb-12">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Professional Portfolio / Care Log</label>
                <textarea 
                  value={formData.summary}
                  onChange={(e) => setFormData({...formData, summary: e.target.value})}
                  rows="3"
                  className="w-full bg-slate-50 border-none rounded-[2rem] p-8 text-[13px] font-medium text-slate-600 outline-none focus:ring-2 focus:ring-slate-950 transition-all placeholder:text-slate-300 shadow-inner"
                  placeholder="Summarize your qualifications or Household requirements..."
                />
              </div>

              <button 
                disabled={isUpdating}
                className="w-full bg-slate-950 text-white py-7 rounded-[2rem] font-black text-xs uppercase tracking-[0.6em] shadow-[0_20px_40px_-xs_rgba(0,0,0,0.3)] hover:bg-[#D4AF37] hover:text-slate-950 transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50"
              >
                {isUpdating ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} 
                Commit Dossier Changes
              </button>
            </form>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}

function FormInput({ label, icon, value, onChange, placeholder = "" }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#D4AF37] transition-transform group-focus-within:scale-110">{icon}</div>
        <input 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-14 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-950 outline-none placeholder:text-slate-300 transition-all shadow-inner"
        />
      </div>
    </div>
  );
}

function StatusCapsule({ label, value }) {
  return (
    <div className="flex justify-between items-center text-[11px] border-b border-slate-50 pb-3 last:border-0 last:pb-0">
      <span className="text-slate-400 font-bold uppercase tracking-tighter">{label}</span>
      <span className="text-slate-950 font-black uppercase tracking-tight">{value}</span>
    </div>
  );
}