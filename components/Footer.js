'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Instagram, Twitter, Linkedin, Mail, Phone, 
  ShieldCheck, LayoutDashboard, Fingerprint, Activity,
  Info, Settings, HeartHandshake, Zap, HelpCircle,
  ShieldAlert, Briefcase, FileText, Globe
} from 'lucide-react';

const Footer = () => {
  const [user, setUser] = useState(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const getRoleBasedLinks = () => {
    if (!user) {
      return (
        <>
          <li><Link href="/login" className="hover:text-white transition-colors">Access Portal</Link></li>
          <li><Link href="/register/helper" className="hover:text-[#D4AF37] transition-colors font-bold">Join as Specialist</Link></li>
          <li><Link href="/register" className="hover:text-white transition-colors">Client Registry</Link></li>
        </>
      );
    }

    if (user.role === 'admin') {
      return (
        <>
          <li><Link href="/admin" className="hover:text-[#D4AF37] transition-colors flex items-center gap-2">Admin Terminal</Link></li>
          <li><Link href="/helpers" className="hover:text-white transition-colors">Registry Audit</Link></li>
          <li><Link href="/profile" className="hover:text-white transition-colors">Security Settings</Link></li>
          
        </>
      );
    }

    if (user.role === 'helper') {
      return (
        <>
          <li><Link href="/helper" className="hover:text-[#D4AF37] transition-colors">Specialist Terminal</Link></li>
          <li><Link href="/profile" className="hover:text-white transition-colors">My Dossier</Link></li>
          <li><Link href="/helpers" className="hover:text-white transition-colors">Network Directory</Link></li>
          <li><Link href="/contact" className="hover:text-white transition-colors">Contact Hub</Link></li>
        </>
      );
    }

    return (
      <>
        <li><Link href="/dashboard" className="hover:text-[#D4AF37] transition-colors">Client Dashboard</Link></li>
        <li><Link href="/profile" className="hover:text-white transition-colors">Account Settings</Link></li>
        <li><Link href="/helpers" className="hover:text-white transition-colors">Find Specialists</Link></li>
        <li><Link href="/register/helper" className="hover:text-white transition-colors">Register as Helper</Link></li>
        <li><Link href="/contact" className="hover:text-white transition-colors">Contact Hub</Link></li>
      </>
    );
  };

  return (
    <footer className="bg-slate-950 text-slate-400 pt-13 pb-10 font-sans border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-8 border-b border-slate-900">
          
          <div className="flex flex-col space-y-6">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="relative h-20 w-20 transition-all duration-300 brightness-110 group-hover:scale-110">
                <Image src="/logo-white.png" alt="Silver Connect" fill className="object-contain" />
              </div>
              <span className="text-3xl font-serif text-white tracking-tighter uppercase leading-none">
                Silver<br/>Connect
              </span>
            </Link>
            <p className="text-xs leading-relaxed max-w-[240px] text-slate-500 font-medium uppercase tracking-widest">
              The premier senior care infrastructure. Vetted professional deployment and specialized elderly assistance.
            </p>
            <div className="flex gap-5">
              <Link href="#" className="text-slate-600 hover:text-[#D4AF37] transition-colors"><Instagram size={16} /></Link>
              <Link href="#" className="text-slate-600 hover:text-[#D4AF37] transition-colors"><Twitter size={16} /></Link>
              <Link href="#" className="text-slate-600 hover:text-[#D4AF37] transition-colors"><Linkedin size={16} /></Link>
            </div>
          </div>

          <div className="flex flex-col">
            <h4 className="text-white font-serif text-xs font-bold uppercase tracking-[0.4em] mb-4 border-b border-white/5 pb-2 w-fit">Navigation</h4>
            <ul className="space-y-4 text-xs uppercase tracking-[0.2em] font-black">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Mission</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">Process & Vetting</Link></li>
            </ul>
          </div>

          <div className="flex flex-col">
            <h4 className="text-white font-serif text-xs font-bold uppercase tracking-[0.4em] mb-4 border-b border-white/5 pb-2 w-fit">Operations</h4>
            <ul className="space-y-4 text-xs uppercase tracking-[0.2em] font-black">
              {getRoleBasedLinks()}
            </ul>
          </div>

          <div className="flex flex-col">
            <h4 className="text-white font-serif text-xs font-bold uppercase tracking-[0.4em] mb-4 border-b border-white/5 pb-2 w-fit">System Status</h4>
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Mail size={14} className="text-[#D4AF37]" />
                <span className="text-slate-400 lowercase font-medium text-sm tracking-tight">registry@silverconnect.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-[#D4AF37]" />
                <span className="text-slate-400 font-medium text-sm">+91 555 000 1234</span>
              </div>
              <div className="flex items-center gap-3 text-emerald-500 pt-4 font-black text-xs uppercase tracking-widest animate-pulse">
                <Activity size={14} />
                <span>Registry Network Online</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5 flex flex-col items-center justify-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-slate-700 font-bold text-center">
            <p>© {currentYear} Silver Connect Network.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;