'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { 
  Menu, X, ArrowUpRight, LogOut, Briefcase, ShieldCheck
} from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoutAction = () => {
    logout();
    setIsOpen(false);
  };

  const getNavLinks = () => {
    const publicLinks = [
      { name: 'Home', href: '/'},
      { name: 'Services', href: '/services'},
      { name: 'Registry', href: '/helpers'},
    ];

    if (!user) {
      return [
        ...publicLinks,
        { name: 'How it Works', href: '/how-it-works' },
        { name: 'About', href: '/about'},
        { name: 'Contact', href: '/contact'},
      ];
    }

    if (user.role === 'admin') {
      return [
        { name: 'Terminal', href: '/admin'},
        { name: 'Registry', href: '/helpers'},
        { name: 'Profile', href: '/profile'},
      ];
    }

    if (user.role === 'helper') {
      return [
        { name: 'Operations', href: '/helper'},
        { name: 'Directory', href: '/helpers'},
        { name: 'Services', href: '/services'},
        { name: 'Profile', href: '/profile'},
        { name: 'Contact', href: '/contact'},
      ];
    }

    return [
      ...publicLinks,
      { name: 'Dashboard', href: '/dashboard'},
      { name: 'Profile', href: '/profile'},
      { name: 'Process', href: '/how-it-works'},
      { name: 'Support', href: '/contact'},
    ];
  };

  const navLinks = getNavLinks();

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-500 ${
      scrolled ? 'bg-[#FDFCF0]/95 backdrop-blur-md py-4 shadow-md' : 'bg-transparent py-8'
    }`}>
      <div className="max-w-[1600px] mx-auto px-8 flex items-center justify-between">
        
        <Link href="/">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4 group cursor-pointer">
            <div className={`relative h-10 w-12 transition-all duration-300 ${scrolled ? 'brightness-0' : 'brightness-100'}`}>
              <Image src="/logo-white.png" alt="Logo" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-black font-serif tracking-tighter uppercase leading-none transition-colors ${
                scrolled ? 'text-slate-900' : 'text-white'
              }`}>
                Silver<br/>Connect
              </span>
            </div>
          </motion.div>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`text-xs font-black uppercase tracking-[0.2em] transition-all relative group flex items-center gap-2 ${
                pathname === link.href 
                  ? (scrolled ? 'text-slate-950' : 'text-[#D4AF37]') 
                  : (scrolled ? 'text-slate-500 hover:text-slate-900' : 'text-slate-300 hover:text-white')
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#D4AF37] transition-all ${
                pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
          ))}

          <div className="flex items-center gap-4 border-l border-slate-500/20 pl-8 ml-2">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${scrolled ? 'text-[#D4AF37]' : 'text-[#D4AF37]'}`}>
                    {user.role}
                  </span>
                  <span className={`text-xs font-bold ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                    {user.name.split(' ')[0]}
                  </span>
                </div>
                <button 
                  onClick={handleLogoutAction}
                  className={`p-3 rounded-xl transition-all ${
                    scrolled ? 'bg-slate-100 text-slate-500 hover:text-red-500' : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link href="/register/helper" className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 ${scrolled ? 'text-slate-600 hover:text-slate-950' : 'text-slate-300 hover:text-white'}`}>
                   <Briefcase size={14}/> Join as Helper
                </Link>
                <Link href="/login" className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2 shadow-2xl active:scale-95 ${
                  scrolled ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'
                }`}>
                  Login <ArrowUpRight size={16} className="text-[#D4AF37]" />
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="lg:hidden flex items-center gap-4">
          <button onClick={() => setIsOpen(!isOpen)} className={`p-2 transition-transform active:scale-90 ${scrolled ? 'text-slate-900' : 'text-white'}`}>
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-[#FDFCF0] z-[101] lg:hidden flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
               <span className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Registry Menu</span>
               <button onClick={() => setIsOpen(false)} className="p-3 bg-slate-950 rounded-full text-white"><X size={24}/></button>
            </div>

            <div className="flex flex-col gap-6 overflow-y-auto">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)}
                  className={`text-3xl font-serif uppercase tracking-tighter flex items-center gap-4 ${
                    pathname === link.href ? 'text-[#D4AF37] pl-4 border-l-4 border-[#D4AF37]' : 'text-slate-900'
                  }`}
                >
                  <span className="opacity-20">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto space-y-4">
              {user ? (
                <div className="space-y-4">
                  <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Authenticated as</p>
                    <p className="text-2xl font-serif text-slate-900 uppercase">{user.name}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <ShieldCheck size={14} className="text-[#D4AF37]"/>
                        <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">{user.role} Clearances</span>
                    </div>
                  </div>
                  <button onClick={handleLogoutAction} className="w-full bg-red-500 text-white p-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-transform">
                    <LogOut size={20} /> Terminate Session
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  <Link href="/register/helper" onClick={() => setIsOpen(false)} className="w-full border-2 border-slate-950 p-6 rounded-[2rem] font-black uppercase text-xs tracking-widest text-center active:scale-95 transition-transform">
                    Join as Helper
                  </Link>
                  <Link href="/login" onClick={() => setIsOpen(false)} className="w-full bg-slate-950 text-white p-6 rounded-[2rem] font-black uppercase text-xs tracking-widest text-center shadow-xl active:scale-95 transition-transform">
                    Member Login
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header;