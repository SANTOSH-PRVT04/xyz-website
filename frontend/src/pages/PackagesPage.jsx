import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, Heart, ArrowRight, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const packages = [
  { 
    name: 'Basic Health Checkup', price: '₹1,499', 
    features: ['Complete Blood Count', 'Liver & Kidney Function', 'Blood Sugar', 'Lipid Profile', 'Urine Routine', 'Doctor Consultation'],
    popular: false, color: 'border-slate-200 hover:border-blue-200',
  },
  { 
    name: 'Comprehensive Wellness', price: '₹3,999', 
    features: ['Everything in Basic', 'Thyroid Profile', 'Vitamin D & B12', 'ECG', 'Chest X-Ray', 'Ultrasound Abdomen', 'Eye Checkup', 'Diet Counselling'],
    popular: true, color: 'border-blue-300 bg-blue-50/30 shadow-lg shadow-blue-100',
  },
  { 
    name: 'Executive Health', price: '₹7,999',
    features: ['Everything in Comprehensive', 'Cardiac Stress Test', 'CT Calcium Score', 'Cancer Markers', 'Bone Density Scan', 'Pulmonary Function', 'Full Body MRI', 'Specialist Review'],
    popular: false, color: 'border-slate-200 hover:border-emerald-200',
  },
];

const PackagesPage = () => {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 py-20 px-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTM5IDM5VjFoLTM4djM4aDM4eiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-30"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-2 rounded-full text-sm font-bold mb-6 border border-white/20">
              <Heart size={16} /> Preventive Healthcare
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Health Packages</h1>
            <p className="text-lg text-emerald-100 max-w-2xl mx-auto">Invest in prevention. Our curated checkup packages are designed to catch issues early and keep you healthy.</p>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {packages.map((pkg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 * i }}
              className={`rounded-3xl border-2 p-8 flex flex-col relative ${pkg.color} transition-all`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                  <Star size={12} fill="currentColor" /> Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-800 mb-2">{pkg.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900">{pkg.price}</span>
                <span className="text-slate-500 text-sm"> / package</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {pkg.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/appointments" className={`text-center py-3 rounded-xl font-bold transition-all ${pkg.popular ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                Book Now
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="bg-emerald-50 rounded-3xl p-10 border border-emerald-100 text-center">
          <Zap size={28} className="text-emerald-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Customize Your Package</h2>
          <p className="text-slate-600 mb-6 max-w-lg mx-auto">Need specific tests? Contact us to build a custom package tailored to your health requirements.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all">
            Contact Us <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PackagesPage;
