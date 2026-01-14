'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Users, ShieldCheck, Fingerprint,  FileText, Trash2, 
  Search, Mail, UserRoundCheck, 
  ShieldAlert, Activity, MapPin, 
  Phone, Zap, X, Shield, Globe, LogOut, Menu
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminTerminal() {
  const router = useRouter();
  const { secureFetch, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState({ users: [], pending: [], verified: [], messages: [], bookings: [] });
  const [auditItem, setAuditItem] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const fetchData = async () => {
    try {
      const fetchJson = async (url) => {
        const res = await secureFetch(url);
        if (!res || !res.ok) return [];
        const result = await res.json();
        return result.data || result; 
      };

      const [allUsers, pendingHelpers, verifiedHelpers, messages, bookings] = await Promise.all([
        fetchJson(`${API_BASE_URL}/api/auth/admin/users`),
        fetchJson(`${API_BASE_URL}/api/auth/admin/pending-helpers`),
        fetchJson(`${API_BASE_URL}/api/auth/verified-helpers`),
        fetchJson(`${API_BASE_URL}/api/contact`),
        fetchJson(`${API_BASE_URL}/api/admin/all-bookings`)
      ]);

      setData({ 
        users: Array.isArray(allUsers) ? allUsers : [], 
        pending: Array.isArray(pendingHelpers) ? pendingHelpers : [], 
        verified: Array.isArray(verifiedHelpers) ? verifiedHelpers : [], 
        messages: Array.isArray(messages) ? messages : [], 
        bookings: Array.isArray(bookings) ? bookings : [] 
      });
    } catch (err) {
      console.error("Critical System Failure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(storedUser);
    if (user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    fetchData();
  }, []);

  const handleAction = async (userId, status) => {
    if (!window.confirm(`PROTOCOL: Confirm ${status.toUpperCase()} Access?`)) return;
    const res = await secureFetch(`${API_BASE_URL}/api/auth/admin/verify-helper`, {
      method: 'POST',
      body: JSON.stringify({ userId, status })
    });
    if (res && res.ok) fetchData();
  };

  const handleRevoke = async (userId) => {
    if (!window.confirm("CRITICAL: Revoke specialist clearance? This action is logged.")) return;
    const res = await secureFetch(`${API_BASE_URL}/api/auth/admin/verify-helper`, {
      method: 'POST',
      body: JSON.stringify({ userId, status: 'rejected' })
    });
    if (res && res.ok) {
        alert("✓ CLEARANCE TERMINATED");
        fetchData();
    }
  };

  const navigation = [
    { id: 'users', label: 'Users', Icon: Users, count: data.users.length },
    { id: 'pending', label: 'Pending Helpers', Icon: ShieldAlert, count: data.pending.length },
    { id: 'verified', label: 'Active Helpers', Icon: UserRoundCheck, count: data.verified.length },
    { id: 'bookings', label: 'Bookings', Icon: Activity, count: data.bookings.length },
  ];

  if (loading) return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
        <Zap className="text-[#D4AF37]" size={40} />
      </motion.div>
      <p className="text-xs font-black uppercase tracking-[0.6em] text-white/40 mt-6">Initializing Admin Command Center...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#F9F6EE] font-sans">
      <Header />
      <section className="h-[80px] lg:h-[10vh] bg-slate-950" />
      
      <div className="flex flex-col lg:flex-row min-h-screen relative">
        
        <div className="lg:hidden bg-slate-900 p-4 flex justify-between items-center sticky top-0 z-[60] border-b border-white/5">
            <div className="flex items-center gap-3">
                <Shield className="text-[#D4AF37]" size={20} />
                <span className="text-white text-[10px] font-black uppercase tracking-widest">Admin Terminal</span>
            </div>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white p-2">
                {isSidebarOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>
        </div>

        <aside className={`
            fixed lg:sticky top-0 lg:top-[10vh] left-0 h-full lg:h-[90vh] w-80 bg-slate-950 z-[70] 
            transition-transform duration-500 ease-in-out transform
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            flex flex-col p-8 border-r border-white/5
        `}>
          <div className="hidden lg:block mb-12">
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
              <Shield className="text-[#D4AF37]" size={24} />
              <h1 className="text-lg font-black text-white uppercase tracking-widest leading-none">ADMIN PORTAL</h1>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            {navigation.map((item) => (
              <button 
                key={item.id} 
                onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} 
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 ${activeTab === item.id ? 'bg-[#D4AF37] text-slate-950 shadow-2xl scale-[1.02]' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
              >
                <div className="flex items-center gap-4">
                  <item.Icon size={18} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                </div>
                <span className="bg-white/10 px-2 py-0.5 rounded text-[9px] font-bold">{item.count}</span>
              </button>
            ))}
          </nav>

          <button onClick={logout} className="mt-8 flex items-center gap-3 p-5 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all text-xs font-black uppercase tracking-widest">
            <LogOut size={16} /> Terminate Session
          </button>
        </aside>

        <div className="flex-1 p-6 md:p-10 lg:p-16 w-full overflow-x-hidden">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 lg:mb-16 gap-6 w-full">
            <div>
              <h2 className="text-3xl lg:text-4xl font-serif uppercase tracking-tighter text-slate-950">{activeTab}</h2>
            </div>
            <div className="relative w-full md:w-80 lg:w-96">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input type="text" placeholder="FILTER REGISTRY..." className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 lg:py-4 pl-12 lg:pl-14 pr-6 text-[10px] font-bold uppercase focus:ring-2 focus:ring-[#D4AF37] outline-none shadow-xl transition-all" onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              
              {activeTab === 'users' && (
                <div className="bg-white rounded-[2rem] lg:rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px] lg:min-w-full">
                        <thead className="bg-slate-50/50 border-b">
                        <tr>
                            <th className="px-6 lg:px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Identified Member</th>
                            <th className="px-6 lg:px-10 py-6 text-[10px] font-black uppercase text-slate-400 text-center tracking-widest">Role</th>
                            <th className="px-6 lg:px-10 py-6 text-[10px] font-black uppercase text-slate-400 text-right tracking-widest">Access</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                        {data.users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map(u => (
                            <tr key={u._id} className="hover:bg-[#FDFCF0] transition-colors group">
                            <td className="px-6 lg:px-10 py-5 lg:py-7">
                                <div className="flex items-center gap-4 lg:gap-5">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-950 rounded-xl lg:rounded-[1.2rem] flex items-center justify-center text-[#D4AF37] font-serif text-lg">{u.name.charAt(0)}</div>
                                <div>
                                    <p className="text-xs lg:text-sm font-bold text-slate-950 uppercase">{u.name}</p>
                                    <p className="text-[10px] text-slate-400 lowercase font-medium">{u.email}</p>
                                </div>
                                </div>
                            </td>
                            <td className="px-6 lg:px-10 py-5 lg:py-7 text-center">
                                <span className="text-[9px] font-black px-3 py-1 bg-slate-100 rounded-full text-slate-500 uppercase">{u.role}</span>
                            </td>
                            <td className="px-6 lg:px-10 py-5 lg:py-7 text-right">
                                <button className="p-2 text-slate-500 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'pending' && (
                <div className="grid grid-cols-1 gap-8">
                  {data.pending.length > 0 ? (
                    data.pending.map((app) => (
                      <div key={app._id} className="bg-white rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-10 border border-slate-100 flex flex-col gap-8 relative overflow-hidden shadow-xl hover:shadow-2xl transition-all">
                        <div className="absolute top-0 left-0 w-2 h-full bg-amber-400" />
                        
                        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
                          <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-slate-950 rounded-[2rem] flex items-center justify-center text-[#D4AF37] text-3xl font-serif font-bold shadow-xl">
                              {app.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-2xl font-serif uppercase tracking-tight text-slate-950 mb-1">{app.name}</h3>
                              <div className="flex items-center gap-3">
                                <p className="text-[10px] font-black uppercase text-[#D4AF37] tracking-[0.2em]">{app.specialty}</p>
                                <span className="text-[10px] text-slate-300">|</span>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{app.experience} Years Exp.</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3 w-full xl:w-auto">
                            <button onClick={() => handleAction(app._id, 'approved')} className="flex-1 xl:flex-none bg-slate-950 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 shadow-lg transition-all">Grant Clearance</button>
                            <button onClick={() => handleAction(app._id, 'rejected')} className="flex-1 xl:flex-none bg-white border border-slate-200 text-slate-400 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all">Deny</button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <AdminCapsule label="Contact Signal" value={app.phone} icon={<Phone size={14}/>}/>
                          <AdminCapsule label="Auth Email" value={app.email} icon={<Mail size={14}/>}/>
                          <AdminCapsule label="Operational Zone" value={app.workArea} icon={<MapPin size={14}/>}/>
                          <AdminCapsule label="Aadhar ID" value={app.aadhar || 'Not Provided'} icon={<Fingerprint size={14}/>}/>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/80 p-6 rounded-[2rem] border border-slate-100">
                          <div className="lg:col-span-8">
                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block mb-2">Professional Statement</span>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium italic italic">"{app.summary || app.bio || 'No statement provided.'}"</p>
                          </div>
                          <div className="lg:col-span-4 flex flex-col justify-center border-l border-slate-200 pl-6">
                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block mb-3">Verification Dossier</span>
                            {app.resumeLink ? (
                              <a href={app.resumeLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-950 hover:text-[#D4AF37] transition-colors">
                                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100"><FileText size={18} /></div>
                                <span className="text-[10px] font-black uppercase tracking-widest underline decoration-[#D4AF37] decoration-2 underline-offset-4">View Resume</span>
                              </a>
                            ) : <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">No Link Provided</span>}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                      <p className="text-slate-400 font-serif italic uppercase text-lg">No pending applications in registry</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'verified' && (
                <div className="grid grid-cols-1 gap-8">
                  {data.verified.length > 0 ? (
                    data.verified.map((helper) => (
                      <div key={helper._id} className="bg-white rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-10 border border-slate-100 flex flex-col gap-8 relative overflow-hidden shadow-xl hover:shadow-2xl transition-all">
                        <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
                        
                        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
                          <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-slate-950 rounded-[2rem] flex items-center justify-center text-[#D4AF37] text-3xl font-serif font-bold shadow-xl">
                              {helper.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-2xl font-serif uppercase tracking-tight text-slate-950 mb-1">{helper.name}</h3>
                              <div className="flex items-center gap-3">
                                <p className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.2em] flex items-center gap-1">
                                  <ShieldCheck size={12}/> Authenticated
                                </p>
                                <span className="text-[10px] text-slate-300">|</span>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{helper.specialty}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3 w-full xl:w-auto">
                            <button onClick={() => handleRevoke(helper._id)} className="flex-1 xl:flex-none bg-slate-50 text-slate-500 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white shadow-sm transition-all flex items-center justify-center gap-2">
                              <ShieldAlert size={16}/> Revoke Clearance
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <AdminCapsule label="Contact Signal" value={helper.phone} icon={<Phone size={14}/>}/>
                          <AdminCapsule label="Auth Email" value={helper.email} icon={<Mail size={14}/>}/>
                          <AdminCapsule label="Operational Zone" value={helper.workArea} icon={<MapPin size={14}/>}/>
                          <AdminCapsule label="Specialty" value={helper.specialty} icon={<Activity size={14}/>}/>
                        </div>

                        <div className="bg-slate-50/80 p-6 rounded-[2rem] border border-slate-100">
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block mb-2">Registry Bio</span>
                          <p className="text-sm text-slate-600 leading-relaxed font-medium">
                            "{helper.summary || helper.bio || 'Verified professional specialized in healthcare assistance.'}"
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                      <p className="text-slate-400 font-serif italic uppercase text-lg">No active specialists found in registry</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'bookings' && (
                <div className="grid grid-cols-1 gap-4 lg:gap-6">
                  {data.bookings.map(book => (
                    <div key={book._id} className="bg-white p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] border border-slate-100 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-l-4 border-l-slate-950">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:gap-10 flex-1 w-full">
                        <div className="px-5 py-3 bg-[#F9F6EE] rounded-xl text-center shadow-inner w-full sm:w-auto">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Signal REF</p>
                          <p className="text-xs font-black text-slate-950 uppercase">REF-{book._id.slice(-6)}</p>
                        </div>
                        <div className="flex-1">
                          <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest mb-1">Requester</p>
                          <p className="text-xl font-serif uppercase tracking-tight text-slate-950 leading-none mb-3">{book.user?.name || "Member"}</p>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                             <UserRoundCheck size={12} className="text-emerald-500"/> DEPLOYED: <span className="text-slate-950 uppercase font-black">{book.helperName}</span>
                          </div>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${book.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>{book.status}</div>
                      </div>
                      <button onClick={() => setAuditItem(book)} className="w-full md:w-auto px-8 py-4 bg-slate-950 text-white rounded-xl lg:rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-slate-950 shadow-xl transition-all">Audit</button>
                    </div>
                  ))}
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {auditItem && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 lg:p-6 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAuditItem(null)} className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative bg-white rounded-[2.5rem] lg:rounded-[4rem] w-full max-w-2xl p-8 lg:p-12 shadow-2xl border border-slate-100 z-[1001] my-8">
              <div className="flex justify-between items-start mb-8 lg:mb-10 border-b border-slate-50 pb-6 lg:pb-8">
                <div>
                  <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest block mb-1.5">Registry Dossier Audit</span>
                  <h3 className="text-2xl lg:text-4xl font-serif uppercase tracking-tight text-slate-950 leading-none">Internal Review</h3>
                </div>
                <button onClick={() => setAuditItem(null)} className="p-3 bg-slate-100 rounded-full hover:bg-slate-950 hover:text-white transition-all"><X size={20}/></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-8 lg:mb-10">
                <div className="bg-[#F9F6EE] p-6 lg:p-8 rounded-2xl lg:rounded-[2rem] border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">Client Identity</p>
                  <p className="text-base lg:text-lg font-bold text-slate-950 uppercase mb-1">{auditItem.user?.name}</p>
                  <p className="text-[10px] text-slate-500 lowercase truncate">{auditItem.user?.email || auditItem.seniorEmail}</p>
                </div>
                <div className="bg-[#FDFCF0] p-6 lg:p-8 rounded-2xl lg:rounded-[2rem] border border-slate-100 border-l-[6px] border-l-[#D4AF37]">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">Deployed Specialist</p>
                  <p className="text-base lg:text-lg font-bold text-slate-950 uppercase mb-1">{auditItem.helperName}</p>
                  <p className="text-[10px] text-slate-500 lowercase truncate">{auditItem.helperEmail}</p>
                </div>
              </div>
              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-center gap-4 text-slate-900 bg-slate-50 p-5 lg:p-6 rounded-xl lg:rounded-2xl text-[10px] lg:text-[11px] uppercase font-black tracking-widest border border-slate-100">
                  <MapPin size={18} className="text-[#D4AF37]"/> {auditItem.address}
                </div>
                <div className="bg-slate-900 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] text-xs lg:text-[13px] text-white/70 italic leading-relaxed shadow-2xl relative overflow-hidden">
                  <Globe className="absolute -bottom-10 -right-10 opacity-5" size={120} />
                  <span className="text-[9px] font-black text-white uppercase block mb-2 opacity-50 tracking-widest font-sans not-italic">Signal Intel:</span>
                  "{auditItem.notes || "Standard operational guidelines observed."}"
                </div>
              </div>
              <button onClick={() => setAuditItem(null)} className="w-full mt-8 lg:mt-10 py-5 lg:py-6 bg-slate-950 text-white rounded-2xl lg:rounded-[2rem] text-[10px] font-black uppercase tracking-[0.5em] hover:bg-[#D4AF37] hover:text-slate-950 transition-all shadow-2xl">Close Dossier</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}

function AdminCapsule({ label, value, icon }) {
  return (
    <div className="bg-white p-4 lg:p-6 rounded-xl lg:rounded-2xl border border-slate-100 shadow-sm">
      <p className="text-[8px] lg:text-[9px] font-black text-slate-400 uppercase mb-1.5 flex items-center gap-2 tracking-widest leading-none">
        <span className="text-[#D4AF37]">{icon}</span> {label}
      </p>
      <p className="text-[10px] lg:text-[11px] font-bold text-slate-950 uppercase truncate leading-none tracking-tight">{value || "NOT RECORDED"}</p>
    </div>
  );
}