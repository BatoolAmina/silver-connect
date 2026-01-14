'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MapPin, Phone, Mail, Clock, ArrowUpRight, Sparkles } from 'lucide-react';
import emailjs from '@emailjs/browser';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
      {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      },
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    )
    .then(() => {
      setSubmitted(true);
      setIsSubmitting(false);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    }, (error) => {
      alert("Transmission Error: " + error.text);
      setIsSubmitting(false);
    });
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }
  };

  return (
    <main className="bg-[#F9F6EE] font-sans selection:bg-slate-900 selection:text-white overflow-x-hidden">
      <Header />

      <section className="relative h-[60vh] flex items-center justify-center bg-slate-700 overflow-hidden pt-16 text-center">
        <div className="absolute inset-0 z-0">
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img 
              src="https://content.jdmagicbox.com/v2/comp/coimbatore/c8/0422px422.x422.250916200056.d3c8/catalogue/1fhf69xvh8zpbfo-v13slz51la.jpg" 
              className="w-full h-full object-cover grayscale brightness-80" 
              alt="Contact Support"
            />
          </motion.div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020617_90%)]" />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.5em] mb-4 block">
              Network Support Hub
            </span>
            <h1 className="text-5xl md:text-6xl font-serif text-white uppercase leading-none tracking-tighter mb-6">
              Connect With Our Admin.
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-snug">
              Whether you are a family seeking a pillar of support or a helper 
              applying for the registry, our Lucknow team is here to assist.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12">
            
            <motion.div 
              variants={fadeInUp} 
              initial="initial" 
              whileInView="whileInView"
              className="lg:col-span-5 space-y-10"
            >
              <div>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-2">Direct Channels</span>
                <h2 className="text-3xl md:text-4xl font-serif text-slate-900 uppercase leading-none tracking-tighter mb-8">
                  The Infrastructure <br/>of Communication.
                </h2>
              </div>

              <div className="space-y-8">
                {[
                  { icon: <Mail size={20}/>, label: "Email Queries", val: "hello@silverconnect.com" },
                  { icon: <Phone size={20}/>, label: "Helpline", val: "+91 555 000 1234" },
                  { icon: <MapPin size={20}/>, label: "Lucknow Hub", val: "Gomti Nagar, Lucknow, UP" },
                  { icon: <Clock size={20}/>, label: "Response Time", val: "Within 24 Business Hours" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 items-start group">
                    <div className="p-3 bg-slate-50 text-slate-900 rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                      <p className="text-sm font-bold text-slate-900 uppercase tracking-wider">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              className="lg:col-span-7 bg-[#F9F6EE] p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-20 flex flex-col items-center justify-center h-full"
                  >
                    <div className="w-20 h-20 bg-white text-slate-900 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-sm">✓</div>
                    <h3 className="text-3xl font-serif text-slate-900 uppercase tracking-tighter mb-4">Message Received</h3>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto mb-10">The registry has logged your transmission. Expect a response within 24 operational hours.</p>
                    <button 
                      onClick={() => setSubmitted(false)} 
                      className="bg-slate-900 text-white font-bold px-10 py-4 rounded-xl uppercase tracking-widest text-xs active:scale-95 shadow-xl transition-all"
                    >
                      New Dispatch
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                      <input 
                        required
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter name" 
                        className="w-full bg-white border border-slate-200 p-4 rounded-xl text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-slate-900 transition-all placeholder:opacity-30" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                      <input 
                        required
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email" 
                        className="w-full bg-white border border-slate-200 p-4 rounded-xl text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-slate-900 transition-all placeholder:opacity-30" 
                      />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Subject Protocol</label>
                            <div className="relative">
                            <select 
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="w-full bg-white border border-slate-200 p-4 rounded-xl text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-slate-900 transition-all cursor-pointer appearance-none"
                            >
                                <option value="" disabled>Select Service Pillar...</option>
                                <option value="General Inquiry">General Inquiry</option>
                                <option value="Assisted Living">Assisted Living</option>
                                <option value="Wellness Checks">Wellness Checks</option>
                                <option value="Cognitive Care">Cognitive Care</option>
                                <option value="Nutritional Support">Nutritional Support</option>
                                <option value="Travel Escorts">Travel Escorts</option>
                                <option value="24/7 SOS Response">24/7 SOS Response</option>
                                <option value="Social Companion">Social Companion</option>
                                <option value="Physical Therapy">Physical Therapy</option>
                                <option value="Post-Surgical Support">Post-Surgical Support</option>
                                <option value="Helper Registration">Join as Helper</option>
                                <option value="Other">Other Category</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                                <ArrowUpRight size={14} className="rotate-90" />
                            </div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {formData.subject === 'Other' && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-2"
                            >
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Specify Topic</label>
                                <input 
                                type="text" 
                                name="otherSubject"
                                value={formData.otherSubject || ''}
                                onChange={handleChange}
                                required
                                placeholder="ENTER SPECIFIC REQUIREMENT" 
                                className="w-full bg-white border border-slate-200 p-4 rounded-xl text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-slate-900 transition-all shadow-inner" 
                                />
                            </motion.div>
                            )}
                        </AnimatePresence>
                        </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Message</label>
                      <textarea 
                        required
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="4" 
                        placeholder="How can we assist your family?" 
                        className="w-full bg-white border border-slate-200 p-4 rounded-xl text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-slate-900 transition-all placeholder:opacity-30 resize-none"
                      ></textarea>
                    </div>
                    <div className="md:col-span-2 pt-4">
                      <button 
                        disabled={isSubmitting}
                        type="submit" 
                        className="w-full bg-slate-900 text-white p-5 rounded-xl font-bold uppercase text-xs tracking-[0.3em] hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-3 group"
                      >
                        {isSubmitting ? "Transmitting..." : "Dispatch Message"} 
                        {!isSubmitting && <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                      </button>
                    </div>
                  </form>
                )}
              </AnimatePresence>
            </motion.div>

          </div>
        </div>
      </section>

      <section className="py-16 bg-[#F9F6EE]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-slate-900 rounded-[3rem] p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-2xl font-serif text-white uppercase tracking-tight mb-2">Prefer instant chat?</h3>
              <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">Our support pillars are available on WhatsApp 24/7</p>
            </div>
            <a 
              href="https://wa.me/6307140755" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-slate-900 px-10 py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-slate-100 transition-all relative z-10 flex items-center gap-2"
            >
              WhatsApp Support <ArrowUpRight size={14} />
            </a>
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full blur-3xl -mr-32 -mt-32"></div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}