import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Ambulance, Clock, MapPin, AlertTriangle, HeartPulse, Siren, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const EmergencyPage = () => {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 py-20 px-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTM5IDM5VjFoLTM4djM4aDM4eiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-30"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-2 rounded-full text-sm font-bold mb-6 border border-white/20">
              <Siren size={16} /> Emergency Department
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Emergency Care</h1>
            <p className="text-lg md:text-xl text-red-100 max-w-2xl mx-auto mb-8">24/7 rapid response unit with state-of-the-art trauma center. Every second counts — we're ready.</p>
            <a href="tel:+911800123456" className="inline-flex items-center gap-3 bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all">
              <Phone size={22} /> Call Now: 1800-123-456
            </a>
          </motion.div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Clock, title: '< 5 Min Response', desc: 'Average emergency room triage time. No waiting in critical situations.', color: 'text-red-500 bg-red-50 border-red-100' },
            { icon: Ambulance, title: 'Ambulance Fleet', desc: 'GPS-tracked ambulance fleet with paramedic teams available 24/7.', color: 'text-orange-500 bg-orange-50 border-orange-100' },
            { icon: HeartPulse, title: 'Trauma Center', desc: 'Level 1 trauma center with 12 ICU beds & advanced cardiac support.', color: 'text-rose-500 bg-rose-50 border-rose-100' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.15 }}
              className={`p-8 rounded-2xl border ${item.color.split(' ').slice(1).join(' ')} flex flex-col items-start`}
            >
              <item.icon size={28} className={item.color.split(' ')[0] + ' mb-4'} />
              <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* When to visit */}
        <div className="bg-slate-50 rounded-3xl p-10 border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3"><AlertTriangle className="text-red-500" /> When to Visit Emergency</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Chest pain or difficulty breathing', 'Severe bleeding or trauma', 'Sudden numbness or stroke symptoms', 'Loss of consciousness', 
              'Severe allergic reactions', 'High fever with convulsions', 'Poisoning or drug overdose', 'Burns covering large body area'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
                <ShieldCheck size={18} className="text-red-500 shrink-0" />
                <span className="text-slate-700 font-medium text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact strip */}
        <div className="mt-12 bg-slate-900 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <MapPin size={24} className="text-red-400" />
            <div>
              <h3 className="text-white font-bold text-lg">Emergency Department Location</h3>
              <p className="text-slate-400 text-sm">Ground Floor, Block A — Direct ambulance entry via Gate 3</p>
            </div>
          </div>
          <Link to="/" className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all border border-white/10">
            Back to Home <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default EmergencyPage;
