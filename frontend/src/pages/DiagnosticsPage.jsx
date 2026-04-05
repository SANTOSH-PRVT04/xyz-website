import React from 'react';
import { Link } from 'react-router-dom';
import { Microscope, FlaskConical, Scan, HeartPulse, Droplets, Brain, Eye, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const tests = [
  { name: 'Blood Tests', icon: Droplets, desc: 'CBC, Thyroid, Liver Function, Kidney Function, Blood Sugar', color: 'text-red-500 bg-red-50' },
  { name: 'Imaging & Scans', icon: Scan, desc: 'MRI, CT Scan, X-Ray, Ultrasound, PET-CT', color: 'text-blue-500 bg-blue-50' },
  { name: 'Cardiac Diagnostics', icon: HeartPulse, desc: 'ECG, Echo, Stress Test, Holter Monitoring', color: 'text-pink-500 bg-pink-50' },
  { name: 'Neuro Diagnostics', icon: Brain, desc: 'EEG, EMG, Nerve Conduction Studies', color: 'text-purple-500 bg-purple-50' },
  { name: 'Eye Diagnostics', icon: Eye, desc: 'Retinal Scan, Visual Field Test, OCT', color: 'text-emerald-500 bg-emerald-50' },
  { name: 'Lab Culture', icon: FlaskConical, desc: 'Urine Culture, Sputum Culture, Sensitivity Analysis', color: 'text-amber-500 bg-amber-50' },
];

const DiagnosticsPage = () => {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-600 py-20 px-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTM5IDM5VjFoLTM4djM4aDM4eiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-30"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-2 rounded-full text-sm font-bold mb-6 border border-white/20">
              <Microscope size={16} /> Diagnostics & Lab
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Advanced Diagnostics</h1>
            <p className="text-lg text-purple-100 max-w-2xl mx-auto mb-8">NABL-accredited laboratory with 500+ test panels. Accurate results, fast turnaround.</p>
            <Link to="/appointments" className="inline-flex items-center gap-2 bg-white text-purple-700 px-8 py-3.5 rounded-xl font-bold shadow-xl hover:-translate-y-0.5 transition-all">
              Book a Test <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Tests */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-800 mb-10 text-center">Our Diagnostic Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {tests.map((test, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
              className="bg-white border border-slate-100 rounded-2xl p-7 hover:shadow-lg hover:-translate-y-0.5 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl ${test.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <test.icon size={22} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{test.name}</h3>
              <p className="text-slate-500 text-sm">{test.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Why Us */}
        <div className="bg-purple-50 rounded-3xl p-10 border border-purple-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Why Choose Our Lab</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {['NABL & ISO certified laboratory', 'Reports within 4–24 hours', 'Home sample collection available', 'Digital reports via email & patient portal',
              '500+ test panels available', 'Cross-referenced with AI-assisted validation', 'Dedicated phlebotomy team', 'Affordable pricing with insurance support'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-purple-50">
                <CheckCircle2 size={18} className="text-purple-600 shrink-0" />
                <span className="text-slate-700 font-medium text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DiagnosticsPage;
