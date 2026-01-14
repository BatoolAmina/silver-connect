'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, Search, ShieldCheck, 
  MessageSquare, ArrowUpRight, CheckCircle2, 
  Sparkles, ClipboardCheck, Users 
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HowItWorks() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }
  };

  const steps = [
    {
      icon: <UserPlus size={24} />,
      title: "Step 01",
      subtitle: "Define Your Needs",
      desc: "Register and specify the level of care required—from basic companionship to specialized medical assistance."
    },
    {
      icon: <Search size={24} />,
      title: "Step 02",
      subtitle: "Curated Matching",
      desc: "Our algorithm filters Lucknow's verified helpers based on proximity, expertise, and personality compatibility."
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Step 03",
      subtitle: "Verified Connection",
      desc: "Review detailed profiles, including police verification status and past family feedback, before deciding."
    },
    {
      icon: <MessageSquare size={24} />,
      title: "Step 04",
      subtitle: "Meet & Engage",
      desc: "Schedule a facilitated meeting to ensure the heart-to-heart connection is right for your family."
    }
  ];

  return (
    <main className="bg-[#F9F6EE] font-sans selection:bg-slate-900 selection:text-white overflow-x-hidden">
      <Header />

      <section className="relative h-[70vh] flex items-center justify-center bg-slate-600 overflow-hidden pt-16 text-center">
        <div className="absolute inset-0 z-0">
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img 
              src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=2000" 
              className="w-full h-full object-cover grayscale brightness-80" 
              alt="Process Background"
            />
          </motion.div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020617_90%)]" />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.5em] mb-4 block">
              The Path to Peace of Mind
            </span>
            <h1 className="text-5xl md:text-6xl font-serif text-white uppercase leading-none tracking-tighter mb-6">
              A Blueprint For Trusted Care
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto leading-snug">
              We have engineered a four-stage vetting and matching infrastructure to ensure 
              every senior in Lucknow finds a helper who is a pillar of integrity.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                className="flex flex-col items-center text-center p-10 bg-[#F9F6EE]/50 rounded-3xl border border-slate-50 group hover:bg-white hover:shadow-2xl transition-all duration-500"
              >
                <div className="mb-6 w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:bg-[#D4AF37] group-hover:rotate-6">
                  {step.icon}
                </div>
                <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-2">{step.title}</span>
                <h4 className="text-lg font-serif mb-3 text-slate-900 uppercase font-bold tracking-widest">
                  {step.subtitle}
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F9F6EE]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
            transition={{ duration: 0.8, ease: "circOut" }}
            viewport={{ once: true }}
            className="aspect-video rounded-3xl overflow-hidden shadow-2xl border-[12px] border-white bg-slate-100"
            >
            <img 
                src="https://www.medibubble.com/wp-content/uploads/2024/12/008791_LC_JanCommonMedMythsAndFactsCC-blog.jpg" 
                className="w-full h-full object-cover grayscale transition-all duration-1000 hover:grayscale-0 hover:scale-105" 
                alt="Verification Protocol"
            />
            </motion.div>

            <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" className="space-y-6">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">The Registry Standard</span>
              <h2 className="text-3xl md:text-4xl font-serif text-slate-900 uppercase leading-none tracking-tighter">
                Our Verification <br/>Protocol
              </h2>
              <div className="space-y-4">
                {[
                  "Aadhar & Identity Authentication",
                  "Local Police Background Clearance",
                  "Behavioral & Empathy Assessment",
                  "Previous Employment Reference Checks",
                  "Emergency Response Training"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-[#D4AF37]" />
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-900">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10 text-center">
            {[
              { icon: <ClipboardCheck />, title: "Structural Logs", d: "Daily activity logs shared via the family dashboard." },
              { icon: <Users />, title: "Circle of Care", d: "Multiple family members can track and communicate." },
              { icon: <Sparkles />, title: "Quality Audits", d: "Surprise wellness checks by our core admin team." }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0 }} 
                whileInView={{ opacity: 1 }} 
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center"
              >
                <div className="text-[#D4AF37] mb-4">{feature.icon}</div>
                <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-2">{feature.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed max-w-[200px] uppercase tracking-wider">{feature.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <motion.div 
          initial={{ scale: 0.98, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-[#F9F6EE] p-16 rounded-[2.5rem] text-center border border-slate-100"
        >
          <Sparkles className="mx-auto text-[#D4AF37] mb-6" size={40} />
          <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6 uppercase tracking-tighter leading-none">
            Find the Pillar of<br/> Support Today
          </h2>
          <p className="text-slate-500 text-xs max-w-sm mx-auto mb-10 leading-relaxed uppercase tracking-[0.3em] font-bold">
            Join the thousand families who have secured their parents' tomorrow.
          </p>
          <Link 
            href="/helpers" 
            className="inline-flex items-center gap-3 bg-slate-900 text-white px-12 py-5 rounded-xl font-bold uppercase text-xs tracking-[0.3em] hover:bg-slate-800 transition-all shadow-xl group"
          >
            Start Your Search <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}