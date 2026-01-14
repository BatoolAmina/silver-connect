'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Search, Loader2, ShieldCheck, MapPin, Mail, Clock, Lock, ArrowUpRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function FindHelpers() {
  const router = useRouter();
  const { user: currentUser } = useAuth(); 
  const [helpers, setHelpers] = useState([]);
  const [filteredHelpers, setFilteredHelpers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchHelpers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/verified-helpers`);
        if (res.ok) {
          const data = await res.json();
          setHelpers(data);
          setFilteredHelpers(data);
        }
      } catch (err) {
        console.error("Registry Access Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHelpers();
  }, [API_BASE_URL]);

  useEffect(() => {
    const result = helpers.filter(h => 
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.workArea?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHelpers(result);
  }, [searchTerm, helpers]);

  return (
    <main className="bg-[#F9F6EE] min-h-screen font-sans selection:bg-[#D4AF37] selection:text-slate-950">
      <Header />
      
      <section className="bg-slate-950 pt-32 pb-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-no-repeat bg-cover bg-center opacity-10 bg-[url('https://www.nu.edu/wp-content/uploads/2022/09/types-of-nurses.png')]" />
        <div className="relative z-10">
          <span className="text-xs font-black text-[#D4AF37] uppercase tracking-[0.5em] block mb-4">Registry Directory</span>
          <h1 className="text-3xl md:text-6xl font-serif text-white uppercase tracking-tighter mb-10">
            Verified Specialists
          </h1>
          <div className="max-w-xl mx-auto bg-white/5 p-1.5 rounded-2xl border border-white/10 flex items-center px-5 backdrop-blur-xl shadow-2xl">
            <Search className="text-slate-500" size={20} />
            <input 
              placeholder="Filter by Name, Specialty or Region..." 
              className="bg-transparent border-none text-white text-sm py-4 w-full focus:ring-0 outline-none placeholder:text-slate-500 font-medium" 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 py-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-slate-950 mb-4" size={40} />
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Syncing Personnel Registry...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredHelpers.length > 0 ? filteredHelpers.map((helper) => {
              const isOwnProfile = currentUser?._id === helper._id;

              return (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    key={helper._id} 
                    className="bg-white rounded-[3.5rem] p-2 shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col group relative overflow-hidden"
                >
                  <div className="bg-[#FDFCF0] rounded-[3rem] p-8 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-20 h-20 bg-slate-950 rounded-[2rem] flex items-center justify-center text-[#D4AF37] text-3xl font-serif font-bold shadow-2xl transition-transform group-hover:scale-105 duration-500">
                        {helper.name.charAt(0)}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border border-emerald-100">
                          <ShieldCheck size={12} /> Vetted
                        </div>
                        {isOwnProfile && (
                          <div className="bg-slate-950 text-[#D4AF37] px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10">
                            Personnel
                          </div>
                        )}
                      </div>
                    </div>

                    <h4 className="text-2xl font-serif font-bold text-slate-950 uppercase tracking-tight leading-none mb-2">
                      {helper.name}
                    </h4>
                    <p className="text-[#D4AF37] font-black text-xs uppercase tracking-[0.2em] mb-8">
                      {helper.specialty || 'Care Specialist'}
                    </p>

                    <div className="space-y-4 border-t border-slate-200/50 pt-8 mb-8">
                      <div className="flex items-center gap-4 text-slate-600 text-[11px] font-bold uppercase tracking-widest">
                        <MapPin size={18} className="text-[#D4AF37]" />
                        <span>{helper.workArea || 'Lucknow Region'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-600 text-[11px] font-bold uppercase tracking-widest">
                        <Clock size={18} className="text-[#D4AF37]" />
                        <span>{helper.experience || '0'} Years Experience</span>
                      </div>
                    </div>

                    <div className="mb-8">
                        <p className="text-slate-500 text-[13px] leading-relaxed line-clamp-3 font-medium">
                        "{helper.summary || helper.bio || "Dedicated healthcare professional providing specialized elderly assistance and domestic support."}"
                        </p>
                    </div>

                    <div className="mt-auto">
                        {!currentUser ? (
                            <Link href="/login" className="w-full">
                                <button className="w-full bg-slate-100 text-slate-500 text-xs font-black uppercase tracking-[0.3em] py-5 rounded-[2rem] hover:bg-slate-950 hover:text-white transition-all flex items-center justify-center gap-3 group/btn">
                                    Login to Book <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"/>
                                </button>
                            </Link>
                        ) : isOwnProfile ? (
                            <button disabled className="w-full bg-slate-50 text-slate-300 text-xs font-black uppercase tracking-[0.3em] py-5 rounded-[2rem] flex items-center justify-center gap-3 cursor-not-allowed">
                                <Lock size={14}/> Terminal Locked
                            </button>
                        ) : (
                            <Link href={`/helper/${helper._id}`} className="w-full">
                                <button className="w-full bg-slate-950 text-white text-xs font-black uppercase tracking-[0.4em] py-5 rounded-[2rem] hover:bg-[#D4AF37] hover:text-slate-950 transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3">
                                    Open Dossier <ArrowUpRight size={14}/>
                                </button>
                            </Link>
                        )}
                    </div>
                  </div>
                </motion.div>
              );
            }) : (
                <div className="col-span-full py-32 text-center">
                    <p className="text-slate-400 font-serif italic uppercase text-2xl tracking-tighter">No personnel match the current query.</p>
                </div>
            )}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}