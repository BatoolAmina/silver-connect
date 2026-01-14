'use client'
import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Heart, ArrowUpRight, Search, 
  Users, Zap, Globe, HeartPulse, Clock, 
  Utensils, Brain, Activity, UserCheck, Sparkles
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ServicesPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }
  };

  const services = [
    {
      icon: <Users size={24} />,
      title: "Assisted Living",
      desc: "Comprehensive daily support including grooming, mobility, and personal hygiene management.",
      features: ["Grooming", "Mobility Support", "Dressing"]
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Travel Escorts",
      desc: "Safe accompaniment for doctor appointments, temple visits, and social gatherings.",
      features: ["Hospital Visits", "Temple Escorts", "Safe Travel"]
    },
    {
      icon: <Zap size={24} />,
      title: "24/7 SOS Response",
      desc: "Instant alert protocols that bridge the gap between emergency and medical arrival.",
      features: ["One-Tap SOS", "Family Alerts", "Local Outreach"]
    },
    {
      icon: <HeartPulse size={24} />,
      title: "Wellness Checks",
      desc: "Routine monitoring of vitals and medication schedules by vetted health companions.",
      features: ["Vitals Tracking", "Meds Management", "Health Logs"]
    },
    {
      icon: <Brain size={24} />,
      title: "Cognitive Care",
      desc: "Specialized engagement for dementia and Alzheimer’s support through social stimuli.",
      features: ["Memory Exercises", "Mental Stimulation", "Patient Care"]
    },
    {
      icon: <UserCheck size={24} />,
      title: "Post-Surg Support",
      desc: "Short-term specialized care focused on recovery after hospital discharge.",
      features: ["Recovery Care", "Dressing Support", "Wound Hygiene"]
    },
    {
      icon: <Utensils size={24} />,
      title: "Nutritional Support",
      desc: "Diet-specific meal preparation and feeding assistance curated for senior health.",
      features: ["Meal Prep", "Diet Adherence", "Hydration Tracking"]
    },
    {
      icon: <Activity size={24} />,
      title: "Physical Therapy",
      desc: "Assisting with doctor-prescribed exercises to maintain muscle strength and mobility.",
      features: ["Stretch Support", "Strength Recovery", "Walking Aid"]
    },
    {
      icon: <Globe size={24} />,
      title: "Social Companion",
      desc: "Vetting individuals based on shared life experiences to provide intellectual friendship.",
      features: ["Life-Story Sharing", "Reading", "Hobbies"]
    }
  ];

  return (
    <main className="bg-[#F9F6EE] font-sans selection:bg-slate-900 selection:text-white overflow-x-hidden">
      <Header />

      <section className="relative h-[70vh] flex items-center justify-center bg-slate-600 overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <motion.div 
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img 
              src="https://ashamodernschool.in/wp-content/uploads/2025/04/Health_assistant_ff9e3576-d165-4302-9e7f-9fb208037a97.jpg" 
              className="w-full h-full object-cover grayscale brightness-90" 
              alt="Services"
            />
          </motion.div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020617_90%)]" />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.5em] mb-4 block">
              <Sparkles size={12} className="inline mr-2 mb-1" />
              Precision Care Pillars
            </span>
            <h1 className="text-5xl md:text-6xl font-serif text-white uppercase leading-none tracking-tighter mb-6">
              Our Service Framework.
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-snug">
              We provide the structural support needed for a dignified life. 
              Explore our nine pillars of verified elderly care in Lucknow.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                whileHover={{ y: -8 }}
                className="flex flex-col items-center text-center bg-[#F9F6EE]/40 p-10 rounded-3xl border border-slate-50 group transition-all duration-500 hover:bg-white hover:shadow-2xl"
              >
                <motion.div 
                  initial={{ rotate: -10, opacity: 0 }}
                  whileInView={{ rotate: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="mb-6 w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:bg-[#D4AF37] group-hover:scale-110 shadow-lg"
                >
                  {service.icon}
                </motion.div>
                <h4 className="text-lg font-serif mb-3 text-slate-900 font-bold uppercase tracking-widest group-hover:text-slate-700 transition-colors">
                  {service.title}
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed mb-6 max-w-[240px]">
                  {service.desc}
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-auto">
                  {service.features.map((feature, idx) => (
                    <span key={idx} className="px-2 py-1 bg-white border border-slate-100 text-xs font-bold uppercase tracking-tighter text-slate-400 rounded group-hover:border-slate-200 group-hover:text-slate-600 transition-all">
                      {feature}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-900 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView">
            <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.4em] mb-5 block">Vetting Integrity</span>
            <h2 className="text-3xl md:text-4xl font-serif text-white uppercase tracking-tighter mb-10 leading-none">
              The Vetting Protocol.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
              {[
                { icon: <ShieldCheck size={20}/>, title: "Verification", desc: "Aadhar & Police Clearance mandatory for all." },
                { icon: <Users size={20}/>, title: "Behavioral", desc: "Psychometric testing for empathy and patience." },
                { icon: <Search size={20}/>, title: "Monitoring", desc: "Family-access daily logs and quality checks." }
              ].map((process, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.2 }}
                  className="space-y-3 flex flex-col items-center"
                >
                  <div className="text-[#D4AF37] mb-2">{process.icon}</div>
                  <h4 className="text-white text-xs font-bold uppercase tracking-widest">{process.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-[180px]">{process.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </section>

      <section className="py-20 bg-white flex justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-6 w-full bg-[#F9F6EE] p-12 rounded-[2.5rem] text-center border border-slate-100 shadow-sm relative overflow-hidden"
        >
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="mx-auto text-slate-200 mb-6 flex justify-center"
          >
            <Search size={40} />
          </motion.div>
          <h2 className="text-3xl font-serif text-slate-900 mb-6 uppercase tracking-tighter leading-none">
            Custom Care Structures.
          </h2>
          <p className="text-slate-500 text-xs max-w-sm mx-auto mb-8 leading-relaxed uppercase tracking-widest font-bold">
            Every family is unique. We architect custom plans specifically for your parents' legacy.
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-10 py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-slate-800 transition-all shadow-xl group"
          >
            Discuss Requirements <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100/50 rounded-full blur-3xl -mr-16 -mt-16"></div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}