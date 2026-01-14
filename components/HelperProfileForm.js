'use client';
import React, { useState } from 'react';
import { FileText, MapPin, Briefcase, Award, Save } from 'lucide-react';

export default function HelperProfileForm({ userEmail }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    aadhar: '',
    experience: '',
    specialty: 'Companion',
    bio: '',
    address: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      alert("Profile details saved! Admin will review your documents shortly.");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-slate-900 text-white p-3 rounded-2xl">
          <FileText size={24} />
        </div>
        <div>
          <h2 className="text-xl font-serif uppercase tracking-tight">Complete Professional Profile</h2>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Verification Documents Required</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Aadhar Card Number</label>
          <input 
            type="text" 
            placeholder="0000 0000 0000" 
            className="w-full bg-[#F9F6EE] border-none rounded-xl p-4 text-xs font-bold focus:ring-1 focus:ring-slate-950 outline-none"
            onChange={(e) => setFormData({...formData, aadhar: e.target.value})}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Years of Experience</label>
          <div className="relative">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="number" 
              placeholder="E.G. 5" 
              className="w-full bg-[#F9F6EE] border-none rounded-xl py-4 pl-12 pr-4 text-xs font-bold focus:ring-1 focus:ring-slate-950 outline-none"
              onChange={(e) => setFormData({...formData, experience: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Service Category</label>
          <select 
            className="w-full bg-[#F9F6EE] border-none rounded-xl p-4 text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-slate-950 outline-none appearance-none"
            onChange={(e) => setFormData({...formData, specialty: e.target.value})}
          >
            <option>Companion</option>
            <option>Medical Nurse (Registered)</option>
            <option>Home Cook / Nutritionist</option>
            <option>Physiotherapist</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Work Location (Lucknow Area)</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="text" 
              placeholder="E.G. GOMTI NAGAR" 
              className="w-full bg-[#F9F6EE] border-none rounded-xl py-4 pl-12 pr-4 text-xs font-bold uppercase focus:ring-1 focus:ring-slate-950 outline-none"
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Professional Bio</label>
          <textarea 
            rows="4" 
            placeholder="TELL US ABOUT YOUR CAREER AND WHY YOU WANT TO HELP SENIORS..."
            className="w-full bg-[#F9F6EE] border-none rounded-xl p-4 text-xs font-bold focus:ring-1 focus:ring-slate-950 outline-none"
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
          ></textarea>
        </div>

        <div className="md:col-span-2">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-950 hover:bg-[#D4AF37] text-white p-6 rounded-2xl font-black uppercase text-xs tracking-[0.4em] transition-all flex items-center justify-center gap-4 shadow-xl"
          >
            {loading ? "Syncing..." : "Submit for Verification"} <Save size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}