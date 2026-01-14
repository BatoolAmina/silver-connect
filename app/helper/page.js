'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Calendar, Star, MapPin, Clock, 
  ShieldCheck, LogOut,
  Loader2, Zap, Phone, User, Mail
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

export default function HelperDashboard() {
  const router = useRouter();
  const { secureFetch, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ bookings: [] });
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('incoming');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const fetchHelperData = async () => {
    try {
      const bRes = await secureFetch(`${API_BASE_URL}/api/bookings/helper-tasks`);
      if (bRes && bRes.ok) {
        const bookingsData = await bRes.json();
        setData({ bookings: bookingsData });

        const storedUser = JSON.parse(localStorage.getItem('user'));
        const rRes = await secureFetch(`${API_BASE_URL}/api/reviews/helper/${storedUser._id}`);
        if (rRes && rRes.ok) {
          const reviewsData = await rRes.json();
          setReviews(reviewsData);
        }
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!storedUser || !token) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'helper' || !parsedUser.isVerified) {
      router.push('/dashboard');
      return;
    }
    
    setUser(parsedUser);
    fetchHelperData();
  }, [router]);

  const updateStatus = async (id, status) => {
    try {
      const res = await secureFetch(`${API_BASE_URL}/api/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      if (res && res.ok) await fetchHelperData();
    } catch (err) { 
      alert("Action failed."); 
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F9F6EE]">
      <Loader2 className="w-8 h-8 text-slate-900 animate-spin" />
      <p className="font-black uppercase tracking-widest text-[9px] mt-4 text-slate-400">Syncing Registry...</p>
    </div>
  );

  return (
    <main className="bg-[#F9F6EE] min-h-screen font-sans">
      <Header />
      
      <section className="bg-slate-950 pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-[2rem] bg-slate-900 border border-white/10 flex items-center justify-center text-[#D4AF37] text-4xl font-serif font-bold shadow-2xl transition-transform group-hover:scale-105 duration-500">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-2 rounded-xl border-4 border-slate-950">
                <ShieldCheck size={16} className="text-white"/>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#D4AF37] text-slate-950 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-md">Verified Specialist</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif text-white uppercase tracking-tighter leading-none">{user?.name}</h1>
              <div className="flex gap-4 mt-4">
                 <StatBadge icon={<Clock size={12}/>} text={`${user?.experience}yr Experience`} />
                 <StatBadge icon={<Star size={12} className="text-amber-500 fill-amber-500"/>} text={`${reviews.length > 0 ? (reviews.reduce((a,b)=>a+b.rating,0)/reviews.length).toFixed(1) : '5.0'} Performance Rating`} />
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button onClick={() => router.push('/profile')} className="bg-white/5 hover:bg-white text-white hover:text-slate-950 px-8 py-4 rounded-2xl transition-all border border-white/10 font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg">
              <User size={14} /> My Dossier
            </button>
            <button onClick={logout} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-6 py-4 rounded-2xl border border-red-500/10 transition-all shadow-lg">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 -mt-10 relative z-20 pb-24">
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-100">
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 border-b border-slate-50 pb-8">
            <h2 className="text-2xl font-serif uppercase tracking-tight text-slate-950">Registry Terminal</h2>
            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-inner">
              {['incoming', 'history', 'reviews'].map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)} 
                  className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-slate-950 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {tab === 'incoming' ? 'Active Signals' : tab === 'history' ? 'Registry History' : 'Performance Audits'}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {(activeTab === 'incoming' || activeTab === 'history') && (
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                {data.bookings.filter(b => activeTab === 'incoming' ? (b.status === 'pending' || b.status === 'accepted') : (b.status === 'completed' || b.status === 'rejected' || b.status === 'cancelled')).length > 0 ? (
                  data.bookings.filter(b => activeTab === 'incoming' ? (b.status === 'pending' || b.status === 'accepted') : (b.status === 'completed' || b.status === 'rejected' || b.status === 'cancelled')).map((booking) => (
                    <div key={booking._id} className="bg-[#FDFCF0] rounded-[2.5rem] p-8 border border-slate-100 flex flex-col md:flex-row justify-between gap-8 hover:bg-white hover:shadow-xl transition-all group">
                      <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-[#D4AF37] font-serif text-xl shadow-lg">{booking.user?.name?.charAt(0)}</div>
                          <div>
                            <h4 className="text-xl font-serif uppercase tracking-tight text-slate-900 leading-none mb-1">{booking.user?.name}</h4>
                            <div className="flex items-center gap-3">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Signal: {booking._id.slice(-6).toUpperCase()}</span>
                              <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase border ${booking.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{booking.status}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <InfoCard icon={<Calendar size={14}/>} label="Deployment Date" value={new Date(booking.date).toLocaleDateString()} />
                          <InfoCard icon={<MapPin size={14}/>} label="Operation Zone" value={booking.address} />
                          <InfoCard icon={<Phone size={14}/>} label="Contact Vector" value={booking.phone} />
                        </div>

                        <div className="bg-white/80 p-5 rounded-2xl border border-slate-100 text-xs text-slate-600 leading-relaxed italic shadow-inner">
                          <MessageSquare size={12} className="inline mr-2 opacity-30" />
                          "{booking.notes || "Standard care directives logged."}"
                        </div>
                      </div>

                      <div className="flex flex-col justify-center gap-3 md:w-48">
                        {booking.status === 'pending' && (
                          <>
                            <button onClick={() => updateStatus(booking._id, 'accepted')} className="w-full py-4 bg-slate-950 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 shadow-lg transition-all active:scale-95">Accept Task</button>
                            <button onClick={() => updateStatus(booking._id, 'rejected')} className="w-full py-4 bg-white border border-slate-200 text-red-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-all active:scale-95">Deny</button>
                          </>
                        )}
                        {booking.status === 'accepted' && (
                          <button onClick={() => updateStatus(booking._id, 'completed')} className="w-full py-5 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 shadow-xl transition-all active:scale-95">Mark Completed</button>
                        )}
                        {(booking.status === 'completed' || booking.status === 'rejected' || booking.status === 'cancelled') && (
                          <div className="w-full py-4 bg-slate-50 text-slate-300 rounded-2xl text-xs font-black uppercase tracking-widest text-center border border-slate-100">Archived Signal</div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptySignal label="Registry Queue Empty" />
                )}
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {reviews.length > 0 ? reviews.map((rev) => (
                  <div key={rev._id} className="bg-[#FDFCF0] p-8 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-white border border-slate-100 shadow-lg">
                          <User size={20}/>
                        </div>
                        <div>
                          <h4 className="text-lg font-serif uppercase tracking-tight text-slate-950 leading-none mb-1">
                            {rev.user && typeof rev.user === 'object' ? rev.user.name : "Verified Client"}
                          </h4>
                          <div className="flex items-center gap-2">
                              <Mail size={12} className="text-[#D4AF37]"/>
                              <span className="text-xs font-bold text-slate-400 lowercase">
                                {rev.user && typeof rev.user === 'object' ? rev.user.email : "N/A"}
                              </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < rev.rating ? "#D4AF37" : "none"} className={i < rev.rating ? "text-[#D4AF37]" : "text-slate-100"} />
                          ))}
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 text-[13px] text-slate-600 italic leading-relaxed shadow-inner">
                      "{rev.reviewText}"
                    </div>
                  </div>
                )) : (
                  <EmptySignal label="No Performance Audits Found" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function StatBadge({ icon, text }) {
    return (
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/70 flex items-center gap-2 backdrop-blur-md">
            <span className="text-[#D4AF37]">{icon}</span> {text}
        </div>
    );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-50 shadow-sm">
      <p className="text-[8px] font-black text-slate-400 uppercase mb-1 flex items-center gap-2 leading-none">{icon} {label}</p>
      <p className="text-[11px] font-bold text-slate-900 truncate tracking-tight">{value}</p>
    </div>
  );
}

function EmptySignal({ label }) {
  return (
    <div className="py-24 text-center opacity-30 flex flex-col items-center">
      <Zap size={32} className="mb-4" />
      <p className="text-xs font-black uppercase tracking-[0.4em]">{label}</p>
    </div>
  );
}

function MessageSquare({ size, className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}