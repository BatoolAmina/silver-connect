'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, HeartPulse, Users, ShieldAlert, Zap, Globe, Star, Quote, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Counter from '@/components/Counter';

export default function HomePage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }
  };

  return (
    <main className="bg-[#F9F6EE] font-sans selection:bg-slate-900 selection:text-white overflow-x-hidden">
      <Header />

      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.5 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img 
              src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=2000" 
              className="w-full h-full object-cover grayscale brightness-75" 
              alt="Silver Connect Care"
            />
          </motion.div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020617_90%)]" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-3 tracking-tighter uppercase leading-none">
              SILVER CONNECT
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.5em] text-xs md:text-xs mb-8">
              WHERE SAFETY MEETS SOUL • THE BLUEPRINT FOR MODERN AGING
            </p>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto leading-tight font-light"
          >
            Premium <span className="text-white font-semibold">Care Infrastructure</span> designed to bridge the gap between <span className="text-white font-semibold">Safety & Compassion.</span>
          </motion.h2>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-row gap-3 justify-center"
          >
            <Link href="/helpers" className="bg-white text-slate-900 px-7 py-3.5 rounded-md font-bold uppercase text-xs tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2 group shadow-lg">
              Find a Helper <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <Link href="/register" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-7 py-3.5 rounded-md font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-slate-900 transition-all">
              Join the Network
            </Link>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 5, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/30"
        >
          <ChevronDown size={28} />
        </motion.div>
      </section>

      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { label: "Helper Network", value: "2500+" },
              { label: "Active Families", value: "10k+" },
              { label: "Safety Success", value: "100%" },
              { label: "Cities Covered", value: "50+" }
            ].map((stat, i) => (
              <div key={i}>
                <h2 className="font-serif text-3xl md:text-5xl text-white mb-1">
                  <Counter value={stat.value} />
                </h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-none">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-xl">
              <span className="text-[#D4AF37] font-bold tracking-widest text-xs uppercase mb-2 block">
                The Gold Standard
              </span>
              <h3 className="text-3xl md:text-4xl font-serif text-slate-900 uppercase tracking-tight leading-none">
                Engineered for <br />Human Connection.
              </h3>
            </div>
            <Link
              href="/services"
              className="text-slate-400 hover:text-slate-900 transition-colors font-bold text-xs uppercase tracking-widest flex items-center gap-2 border-b border-transparent hover:border-slate-900"
            >
              View Services <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <ShieldAlert />, title: "Strict Vetting", desc: "Multi-stage background check and behavioral interview process." },
              { icon: <HeartPulse />, title: "Personalized Care", desc: "Pairing seniors with helpers based on personality and shared interests." },
              { icon: <Globe />, title: "Local Presence", desc: "Caregivers within your own neighborhood who understand local culture." },
              { icon: <Zap />, title: "Instant SOS", desc: "Emergency protocols that alert family and medical services." },
              { icon: <Users />, title: "Family Dashboard", desc: "Real-time updates, medication schedules, and daily logs." },
              { icon: <Star />, title: "Admin Monitoring", desc: "Routine wellness checks conducted by our core team." }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center text-center bg-[#F9F6EE]/50 p-10 rounded-2xl border border-slate-100 group transition-all duration-300 hover:bg-white hover:shadow-xl"
              >
                <div className="mb-6 w-14 h-14 bg-white rounded-xl flex items-center justify-center transition-all group-hover:bg-slate-900 group-hover:text-white shadow-sm">
                  {React.cloneElement(item.icon, { size: 28 })}
                </div>
                <h4 className="text-base font-serif mb-3 text-slate-900 font-bold uppercase tracking-widest">
                  {item.title}
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed max-w-[250px]">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-900">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Quote className="mx-auto text-slate-800 mb-8" size={50} />
          <h2 className="text-2xl md:text-3xl font-serif text-white mb-8 uppercase tracking-tight leading-snug">
            "A blueprint for modern care. <br/>unmatched peace of mind."
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-slate-900 text-xs uppercase shadow-lg">SJ</div>
            <div className="text-left">
              <p className="text-white font-bold uppercase text-xs tracking-widest">Sarah Jenkins</p>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Client Partner</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-[#F9F6EE] p-16 rounded-[2.5rem] border border-slate-100 text-center shadow-sm"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6 uppercase tracking-tighter leading-none">
            Dignity is the Standard of Care.
          </h2>
          
          <p className="text-slate-500 mb-10 text-xs md:text-xs uppercase tracking-[0.4em] font-bold">
            PRECISION VETTING • COMPASSIONATE INFRASTRUCTURE
          </p>

          <Link 
            href="/register" 
            className="inline-block bg-slate-900 text-white px-10 py-4 rounded-lg font-bold uppercase text-xs tracking-[0.3em] hover:bg-slate-800 transition-all shadow-xl"
          >
            Join the Registry
          </Link>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}