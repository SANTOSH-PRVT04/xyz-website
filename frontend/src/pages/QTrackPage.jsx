import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Clock, Stethoscope, ArrowRight, Activity, RefreshCw, AlertTriangle, Zap, Timer, BarChart3, Brain, Shield, Cpu, Layers, GitBranch, Target, TrendingUp, Sparkles } from 'lucide-react';
import { useQueueStore } from '../store/queueStore';

const AnimatedNumber = ({ value }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const dur = 800, step = 20, inc = value / (dur / step);
    const t = setInterval(() => { start += inc; if (start >= value) { setDisplay(value); clearInterval(t); } else setDisplay(Math.floor(start)); }, step);
    return () => clearInterval(t);
  }, [value]);
  return <>{display}</>;
};

const QTrackPage = () => {
  const { stats, liveQueue, fetchStats, fetchLiveQueue } = useQueueStore();
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [queueLoaded, setQueueLoaded] = useState(false);

  useEffect(() => {
    fetchStats().then(() => setStatsLoaded(true));
    fetchLiveQueue().then(() => setQueueLoaded(true));
    const interval = setInterval(() => { fetchStats(); fetchLiveQueue(); }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-24 font-sans">

      {/* ─── HERO ─── */}
      <section className="relative px-6 md:px-12 lg:px-24 pt-20 pb-16 overflow-hidden">
        <div className="absolute right-0 top-0 w-full h-[800px] bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-16 xl:gap-20 items-start">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex-1 w-full pt-4 z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 text-blue-700 text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
              <RefreshCw size={14} className="animate-spin text-blue-500" style={{ animationDuration: '3s' }} /> System Online
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.08] mb-5 tracking-tighter">
              Welcome to<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">QTrack.</span>
            </h1>
            <p className="text-lg text-slate-500 mb-8 max-w-lg leading-relaxed font-medium">
              XYZ Hospital's intelligent digital queue system. Generate tokens, track live positions, and let AI optimize your visit — zero physical waiting.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/qtrack/login" className="px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-xl shadow-slate-900/15 transition-all hover:-translate-y-0.5 flex items-center gap-2">
                Get Started <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }} className="flex-1 w-full z-10">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Active Patients', value: stats?.activePatients, icon: Users, color: 'text-blue-500' },
                { label: 'Avg Wait Time', value: stats?.avgWaitTime, suffix: 'm', icon: Clock, color: 'text-indigo-500' },
                { label: 'Active Doctors', value: stats?.availableDoctors, icon: Stethoscope, color: 'text-emerald-500' },
                { label: 'Emergency', value: stats?.emergencyCases, icon: AlertTriangle, color: 'text-red-500' },
              ].map((s, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-lg shadow-slate-100/50">
                  <s.icon className={`${s.color} mb-3`} size={24} />
                  <p className="text-xs text-slate-500 font-bold tracking-wide uppercase mb-1">{s.label}</p>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tighter">
                    {!statsLoaded ? <div className="h-8 bg-slate-100 animate-pulse rounded w-16 mt-1" /> : <><AnimatedNumber value={s.value || 0} />{s.suffix && <span className="text-lg text-slate-400 font-bold">{s.suffix}</span>}</>}
                  </h3>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Live Queue */}
        <div className="max-w-7xl mx-auto mt-14">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/50 p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2"><Activity className="text-blue-600" size={22} /> Live Queue</h3>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Auto-refresh
              </div>
            </div>
            {!queueLoaded ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-50 rounded-xl animate-pulse" />)}
              </div>
            ) : liveQueue.length === 0 ? (
              <p className="text-center py-10 text-slate-400 font-medium">No active tokens in queue.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {liveQueue.map((t, i) => (
                  <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className={`p-4 rounded-xl ${i === 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-50 border border-slate-200'}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${i === 0 ? 'text-blue-200' : 'text-slate-400'}`}>
                      {t.status === 'called' ? 'Serving' : t.status === 'near_turn' ? 'Next' : `Pos #${t.position}`}
                    </p>
                    <h4 className="text-xl font-black">{t.tokenNumber}</h4>
                    <p className={`text-[11px] font-bold mt-0.5 ${i === 0 ? 'text-blue-200' : 'text-slate-500'}`}>{t.patientName}</p>
                    <p className={`text-[10px] font-medium mt-1 ${i === 0 ? 'text-blue-100' : 'text-slate-400'}`}>{t.departmentName}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── WHAT IS QTRACK ─── */}
      <section className="px-6 md:px-12 lg:px-24 py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-bold text-xs tracking-widest uppercase mb-3">Digital Queue Management</p>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">What is QTrack?</h2>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              QTrack is an AI-powered digital queue management system designed for XYZ Hospital. It replaces physical queue lines 
              with intelligent, real-time token management that saves patients hours of waiting.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: 'Digital Tokens', desc: 'Generate secure queue tokens instantly from anywhere. No more standing in physical lines.', color: 'bg-blue-50 text-blue-600' },
              { icon: Timer, title: 'Smart ETA', desc: 'AI calculates your estimated wait time based on real consultation data and queue depth.', color: 'bg-indigo-50 text-indigo-600' },
              { icon: Activity, title: 'Live Tracking', desc: 'Track your position in real-time. Get notified when your turn is approaching.', color: 'bg-emerald-50 text-emerald-600' },
              { icon: Shield, title: 'Secure & Private', desc: 'Your medical data is encrypted. Role-based access ensures only authorized personnel see your info.', color: 'bg-violet-50 text-violet-600' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-7 border border-slate-100 shadow-lg shadow-slate-100/30 hover:shadow-xl hover:border-blue-200 transition-all">
                <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-5`}><f.icon size={22} /></div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="px-6 md:px-12 lg:px-24 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">How QTrack Works</h2>
            <p className="text-slate-500 font-medium text-lg">Your hospital visit in 4 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Login', desc: 'Create an account or sign in. Doctors and admins use their hospital credentials.' },
              { step: '02', title: 'Select Department & Doctor', desc: 'Pick your department, choose an available doctor, and see how many patients are ahead of you.' },
              { step: '03', title: 'Generate Token', desc: 'Get a secure token with your name, estimated wait time, queue position, and token expiry time.' },
              { step: '04', title: 'Arrive On Time', desc: 'QTrack sends you real-time updates. Arrive at the hospital when your turn approaches — zero waiting.' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-7 border border-slate-100 shadow-lg shadow-slate-100/30 relative group hover:border-blue-200 transition-all">
                <span className="text-5xl font-black text-slate-100 absolute top-4 right-5 group-hover:text-blue-50 transition-colors">{s.step}</span>
                <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center mb-5 font-bold text-sm">{s.step}</div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW AI POWERS QTRACK ─── */}
      <section className="px-6 md:px-12 lg:px-24 py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-widest uppercase mb-5">
              <Brain size={14} /> Powered by AI
            </div>
            <h2 className="text-4xl font-black tracking-tight mb-4">How AI Powers QTrack</h2>
            <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Our AI engine continuously analyzes queue data from every department in real-time, making intelligent decisions that reduce wait times and optimize hospital resource allocation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Cpu, title: 'Real-time Analysis', desc: 'AI monitors every department\'s patient load, doctor availability, and consultation speeds. It detects bottlenecks before they become critical.', example: 'Example: "Cardiology is at 80% capacity — Radiology is idle. AI suggests rerouting non-urgent Cardiology patients."' },
              { icon: GitBranch, title: 'Smart Rebalancing', desc: 'When one department is overloaded and another is underutilized, AI recommends patient transfers to balance the load across the hospital.', example: 'Example: "Dr. Jenkins has 5 patients queued (50min wait). Dr. Chen in the same dept has only 1. AI suggests transferring 2 patients."' },
              { icon: Target, title: 'Predictive ETA', desc: 'Instead of a simple "position × fixed time" calculation, AI uses each department\'s average consultation time to give accurate wait predictions.', example: 'Example: "Cardiology consultations average 12min, Dermatology averages 8min. Your ETA is calculated using YOUR department\'s real data."' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-7 hover:border-blue-500/30 transition-all">
                <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center mb-5"><item.icon size={22} /></div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed mb-4">{item.desc}</p>
                <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-3 text-xs text-blue-300 font-medium leading-relaxed">
                  <Sparkles size={12} className="inline mr-1 text-blue-400" /> {item.example}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
            <h4 className="font-bold text-lg mb-4 flex items-center gap-3">
              <TrendingUp className="text-blue-400" size={20} /> AI Architecture: How It Works Under the Hood
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              {[
                { label: 'Queue Database', desc: 'Every token, doctor load, and wait time is tracked', icon: Layers },
                { label: 'AI Adapter', desc: 'Transforms raw data into analysis-ready metrics', icon: Cpu },
                { label: 'Optimization Engine', desc: 'Runs algorithms to detect bottlenecks & compute solutions', icon: Brain },
                { label: 'Admin Dashboard', desc: 'Admins review AI suggestions and execute with one click', icon: Target },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center p-4">
                  <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center mb-3"><step.icon size={20} /></div>
                  <h5 className="text-sm font-bold text-white mb-1">{step.label}</h5>
                  <p className="text-xs text-slate-500 font-medium">{step.desc}</p>
                  {i < 3 && <ArrowRight size={16} className="text-slate-600 mt-3 hidden md:block" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="px-6 md:px-12 lg:px-24 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Ready to Skip the Wait?</h2>
          <p className="text-lg text-slate-500 font-medium mb-8">Login to generate your digital token and track your queue position in real-time.</p>
          <Link to="/qtrack/login" className="inline-flex px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-lg shadow-xl shadow-slate-900/15 transition-all hover:-translate-y-0.5 items-center gap-2">
            Login Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default QTrackPage;
