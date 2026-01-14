'use client'
import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Heart, ArrowUpRight, Quote, Linkedin, Search, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Counter from '@/components/Counter';

export default function AboutPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }
  };

  const clipReveal = {
    initial: { clipPath: 'inset(0 100% 0 0)' },
    whileInView: { clipPath: 'inset(0 0% 0 0)' },
    transition: { duration: 0.8, ease: "circOut" },
    viewport: { once: true }
  };

  return (
    <main className="bg-[#F9F6EE] font-sans selection:bg-slate-900 selection:text-white overflow-x-hidden">
      <Header />

      <section className="relative h-[70vh] flex items-center justify-center bg-slate-600 overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img 
              src="https://www.portea.com/static/ad63fb57468502f3461ef225393b7652/ca537/Nursing-service-in-City-page-big.png" 
              className="w-full h-full object-cover grayscale brightness-75" 
              alt="Elderly care"
            />
          </motion.div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020617_90%)]" />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.5em] mb-4 block">
              Redefining Senior Infrastructure
            </span>
            <h1 className="text-5xl md:text-6xl font-serif text-white uppercase leading-none tracking-tighter mb-6">
              Heart In Every Helper
            </h1>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-snug">
              We bridge the gap between bank-level security and family-level compassion.<br/>
              Find the help your family deserves through our verified Lucknow network.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div {...clipReveal} className="relative group">
              <div className="aspect-[1/1] rounded-2xl overflow-hidden shadow-xl ">
                <img 
                  src="/batool.png" 
                  className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0" 
                  alt="Founder"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-slate-900 text-white p-6 rounded-xl hidden md:block">
                <p className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">Founder & CEO</p>
                <p className="font-serif text-lg">Batool Amina</p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" className="space-y-5">
              <h2 className="text-3xl md:text-4xl font-serif text-slate-900 uppercase leading-none tracking-tighter">
                A Blueprint of Integrity.
              </h2>
              <div className="text-slate-600 text-sm md:text-base leading-relaxed space-y-4 max-w-lg border-l border-slate-200 pl-6">
                <p>
                  "I started Silver Connect because I saw a flaw in the foundation of modern care. We treat the care of our elders as an afterthought - I'm here to fix that."
                </p>
                <p className="font-bold text-slate-800">
                  We apply structural-grade vetting to ensure every helper is a pillar of trust.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#F9F6EE]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Search size={22} />, title: "Precision Vetting", desc: "Our 5-step check is the city's most rigorous." },
              { icon: <Heart size={22} />, title: "Compassion Match", desc: "Matches based on temperament and hobbies." },
              { icon: <ShieldCheck size={22} />, title: "Structural Safety", desc: "Real-time tracking and SOS built-in." }
            ].map((pillar, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl border border-slate-200 flex flex-col items-center text-center group transition-all"
              >
                <div className="mb-4 w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6">
                  {pillar.icon}
                </div>
                <h4 className="text-sm font-serif text-slate-900 uppercase tracking-widest font-bold mb-2">{pillar.title}</h4>
                <p className="text-slate-500 text-sm">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Helper Network", value: "2500+" },
            { label: "Neighborhoods", value: "45+" },
            { label: "Verification", value: "100%" },
            { label: "Families", value: "10k+" }
          ].map((stat, i) => (
            <div key={i}>
              <h3 className="text-2xl md:text-3xl font-serif text-white mb-1"><Counter value={stat.value} /></h3>
              <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-white">
        <motion.div 
          initial={{ scale: 0.98, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-slate-50 p-12 rounded-[2rem] text-center border border-slate-100"
        >
          <Quote className="mx-auto text-slate-200 mb-6" size={40} />
          <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-8 uppercase tracking-tighter">
            Dignity is the Standard.
          </h2>
          <Link 
            href="/register" 
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-10 py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-slate-800 transition-all shadow-lg"
          >
            Join Registry <ArrowUpRight size={14} />
          </Link>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}