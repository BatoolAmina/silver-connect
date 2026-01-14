'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LogOut, CheckCircle, Mail, Calendar, 
  MapPin, Loader2, Star, MessageSquare, 
  AlertTriangle, Zap, User, X
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserDashboard() {
  const router = useRouter();
  const { secureFetch, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('active');

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const fetchData = async () => {
    try {
      const bRes = await secureFetch(`${API_BASE_URL}/api/bookings/my-requests`);
      if (bRes && bRes.ok) setBookings(await bRes.json());

      const rRes = await secureFetch(`${API_BASE_URL}/api/reviews/my-reviews`);
      if (rRes && rRes.ok) setReviews(await rRes.json());
    } catch (err) {
      console.error("Registry Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!storedUser || !token) {
      router.push('/login');
    } else {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role === 'admin') return router.replace('/admin');
      if (parsedUser.role === 'helper' && parsedUser.isVerified) return router.replace('/helper');
      
      setUser(parsedUser);
      fetchData();
    }
  }, [router]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!selectedBooking || !comment.trim()) return;
    setIsSubmittingReview(true);

    try {
      const res = await secureFetch(`${API_BASE_URL}/api/reviews/add`, {
        method: 'POST',
        body: JSON.stringify({
          helper: selectedBooking.helper?._id || selectedBooking.helper, 
          booking: selectedBooking._id,
          rating,
          reviewText: comment
        })
      });

      if (res && res.ok) {
        alert("✓ PERFORMANCE AUDIT LOGGED.");
        setSelectedBooking(null);
        setComment('');
        fetchData();
      }
    } catch (err) {
      alert("NETWORK ERROR.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm("PROTOCOL: Permanently remove this audit log?")) return;

    try {
      const res = await secureFetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
        method: 'DELETE'
      });

      if (res && res.ok) {
        alert("✓ REGISTRY UPDATED: REVIEW REMOVED.");
        fetchData();
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F9F6EE]">
      <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin mb-4" />
      <p className="font-black uppercase tracking-widest text-xs text-slate-400">Syncing Registry...</p>
    </div>
  );

  return (
    <main className="bg-[#F9F6EE] min-h-screen font-sans selection:bg-[#D4AF37]">
      <Header />

      <section className="bg-slate-950 pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-slate-900 border-2 border-white/10 flex items-center justify-center text-[#D4AF37] text-4xl font-serif font-bold shadow-2xl">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#D4AF37] p-2 rounded-xl border-4 border-slate-950 shadow-lg">
                  <Zap size={16} className="text-slate-950" />
                </div>
              </div>
              <div>
                <span className="text-[#D4AF37] text-xs font-black uppercase tracking-widest mb-1 block tracking-[0.3em]">Authorized Member</span>
                <h1 className="text-4xl md:text-5xl font-serif text-white uppercase tracking-tighter leading-none">{user?.name}</h1>
                <div className="mt-4 bg-white/5 text-white/70 px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest inline-flex items-center gap-2 border border-white/10">
                   <Mail size={12} className="text-[#D4AF37]" /> {user?.email}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
               <button onClick={() => router.push('/profile')} className="bg-white/10 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10 flex items-center gap-2">
                 <User size={14} className="text-[#D4AF37]" /> My Profile
               </button>
               <button onClick={logout} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-6 py-4 rounded-xl transition-all border border-red-500/20 shadow-lg">
                <LogOut size={18} />
               </button>
            </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 -mt-8 relative z-20 pb-20">
        <div className="bg-white rounded-[3rem] p-6 md:p-12 shadow-xl border border-slate-100 min-h-[500px]">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 border-b border-slate-50 pb-8">
             <div>
                <span className="text-xs font-black text-[#D4AF37] uppercase tracking-widest block mb-1">Operational Flow</span>
                <h2 className="text-3xl font-serif uppercase tracking-tighter text-slate-950 leading-none">Registry signals</h2>
             </div>
             <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-100 shadow-inner">
                {['active', 'history', 'reviews'].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-slate-950 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>
                    {tab}
                  </button>
                ))}
             </div>
          </div>

          <AnimatePresence mode="wait">
            {(activeTab === 'active' || activeTab === 'history') && (
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {bookings.filter(b => activeTab === 'active' ? (b.status !== 'completed' && b.status !== 'cancelled') : (b.status === 'completed' || b.status === 'cancelled')).map((booking) => {
                  const alreadyReviewed = reviews.some(r => r.booking === booking._id || r.booking?._id === booking._id);

                  return (
                    <div key={booking._id} className="bg-[#FDFCF0] rounded-[2.5rem] p-8 border border-slate-100 relative group transition-all hover:bg-white hover:shadow-2xl">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center text-[#D4AF37] font-serif text-xl shadow-md uppercase">{booking.helperName?.charAt(0)}</div>
                          <div>
                            <h4 className="text-lg font-serif uppercase tracking-tight text-slate-900 leading-none mb-1">{booking.helperName}</h4>
                            <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest">Care Specialist</span>
                          </div>
                        </div>
                        <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${booking.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600'}`}>
                          {booking.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-6">
                         <div className="bg-white p-4 rounded-2xl border border-slate-50">
                            <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Deployment</p>
                            <p className="text-[11px] font-bold text-slate-900">{new Date(booking.date).toLocaleDateString()}</p>
                         </div>
                         <div className="bg-white p-4 rounded-2xl border border-slate-50 shadow-inner">
                            <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Signal ID</p>
                            <p className="text-[11px] font-bold text-slate-900 uppercase">LKO-{booking._id.slice(-6).toUpperCase()}</p>
                         </div>
                      </div>

                      <div className="mt-auto">
                        {booking.status === 'completed' && !alreadyReviewed ? (
                           <button onClick={() => setSelectedBooking(booking)} className="w-full py-4 bg-slate-950 text-white rounded-xl text-[9px] font-black uppercase hover:bg-[#D4AF37] hover:text-slate-950 transition-all flex items-center justify-center gap-2 shadow-lg">
                            <Star size={14}/> Audit Engagement (Review)
                           </button>
                        ) : booking.status === 'completed' && alreadyReviewed ? (
                          <div className="w-full py-4 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase text-center border border-emerald-100 flex items-center justify-center gap-2">
                            <CheckCircle size={14} /> Audit Completed
                          </div>
                        ) : null}
                        {booking.status === 'accepted' && (
                          <div className="w-full py-4 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase text-center border border-emerald-100">Specialist Deployed</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {reviews.length > 0 ? reviews.map((rev) => (
                  <div key={rev._id} className="bg-[#FDFCF0] p-8 rounded-[2.5rem] border border-slate-100 group relative overflow-hidden transition-all hover:bg-white hover:shadow-2xl">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-[#D4AF37] font-serif text-xl shadow-md uppercase">
                          {rev.helper?.name?.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 leading-none mb-1">
                            {rev.helper?.name || "Registry Specialist"}
                          </h4>
                          <div className="flex items-center gap-2 text-slate-400">
                            <Mail size={10} className="text-[#D4AF37]" />
                            <span className="text-xs lowercase font-medium">{rev.helper?.email}</span>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => deleteReview(rev._id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                        <X size={18} />
                      </button>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} fill={i < rev.rating ? "#D4AF37" : "none"} className={i < rev.rating ? "text-[#D4AF37]" : "text-slate-200"} />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic bg-white/50 p-4 rounded-2xl border border-slate-50 relative">
                      <MessageSquare size={12} className="absolute -top-1 -left-1 text-[#D4AF37] opacity-20" />
                      "{rev.reviewText}"
                    </p>
                  </div>
                )) : (
                  <div className="py-24 text-center opacity-30">
                    <AlertTriangle size={32} className="mx-auto mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest">No audit signals found in registry.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedBooking(null)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white rounded-[3rem] w-full max-w-xl p-10 border border-slate-100 shadow-2xl">
              <div className="flex justify-between items-center mb-8 border-b pb-6">
                 <div>
                    <span className="text-xs font-black text-[#D4AF37] uppercase tracking-[0.4em] block mb-1">Performance Audit</span>
                    <h3 className="text-3xl font-serif uppercase tracking-tight text-slate-950">Rate Specialist</h3>
                 </div>
                 <button onClick={() => setSelectedBooking(null)} className="p-3 bg-slate-100 rounded-full hover:bg-slate-950 hover:text-white transition-all shadow-md"><X size={20}/></button>
              </div>
              <form onSubmit={submitReview} className="space-y-6">
                <div className="flex flex-col items-center gap-4 bg-[#F9F6EE] p-8 rounded-3xl border border-slate-100 shadow-inner text-center">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Quality Assessment</p>
                  <div className="flex gap-3 mt-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button key={num} type="button" onClick={() => setRating(num)} className={`p-3 rounded-xl transition-all ${rating >= num ? 'bg-[#D4AF37] text-slate-950 shadow-lg' : 'bg-white text-slate-300 border border-slate-100'}`}>
                        <Star size={24} fill={rating >= num ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Statement of Service</label>
                  <textarea required rows="4" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Provide specific feedback on care standards..." className="w-full bg-[#F9F6EE] border-none rounded-[2rem] p-6 text-xs font-medium text-slate-600 focus:ring-2 focus:ring-[#D4AF37] outline-none shadow-inner" />
                </div>
                <button disabled={isSubmittingReview} type="submit" className="w-full bg-slate-950 text-white py-6 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.6em] shadow-xl hover:bg-[#D4AF37] hover:text-slate-950 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
                  {isSubmittingReview ? <Loader2 className="animate-spin" size={18}/> : "Authorize Data Log"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Footer />
    </main>
  );
}