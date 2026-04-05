import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, TrendingUp, AlertTriangle, Activity, GitBranch, ArrowRight, CheckCircle2, Users, Clock, RefreshCw, Brain, Cpu, Target, Zap } from 'lucide-react';
import { useQueueStore } from '../store/queueStore';
import { useUIStore } from '../store/uiStore';
import { getStats, generateAIRecommendations, applyAIRecommendation } from '../data/mockDatabase';

// Read live token count from localStorage
function _readTokens() {
  try { return JSON.parse(localStorage.getItem('qtrack_tokens') || '[]'); } catch { return []; }
}

const AdminDashboard = () => {
  const { departmentLoad, fetchDepartmentLoad } = useQueueStore();
  const { showToast } = useUIStore();
  const [stats, setStats] = useState(null);
  const [recs, setRecs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    await fetchDepartmentLoad();
    await new Promise(r => setTimeout(r, 600));
    setStats(getStats());
    setRecs(generateAIRecommendations());
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
    const poll = setInterval(loadData, 15000);
    return () => clearInterval(poll);
  }, []);

  const handleResolve = async (recId) => {
    const success = applyAIRecommendation(recId);
    if (success) {
      showToast('AI action executed: Patient appointment times adjusted.', 'success');
    } else {
      showToast('Info-only alert — no schedule changes needed.', 'info');
    }
    // Fully reload data to recalculate loads, active patients, and regenerate new recommendations!
    await loadData();
  };

  const liveTokens = _readTokens();
  const totalTokensToday = liveTokens.filter(t => new Date(t.createdAt).toDateString() === new Date().toDateString()).length;
  const completedToday = liveTokens.filter(t => t.status === 'completed' && new Date(t.createdAt).toDateString() === new Date().toDateString()).length;

  const severityStyle = (sev) => {
    if (sev === 'critical') return { bg: 'bg-red-500/15', border: 'border-red-500/30', text: 'text-red-400', icon: AlertTriangle, label: 'Critical' };
    if (sev === 'high') return { bg: 'bg-orange-500/15', border: 'border-orange-500/30', text: 'text-orange-400', icon: AlertTriangle, label: 'High Priority' };
    if (sev === 'medium') return { bg: 'bg-yellow-500/15', border: 'border-yellow-500/30', text: 'text-yellow-400', icon: TrendingUp, label: 'Medium' };
    return { bg: 'bg-blue-600/10', border: 'border-blue-500/20', text: 'text-blue-400', icon: TrendingUp, label: 'Optimization' };
  };

  if (isLoading) return (
    <div className="flex h-[80vh] items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 border-4 border-slate-800 border-t-transparent rounded-full animate-spin mb-5" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Initializing Command Center...</p>
      </div>
    </div>
  );

  const activeRecs = recs.filter(r => r.type !== 'all_clear');
  const allClear = recs.length === 1 && recs[0].type === 'all_clear';

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 lg:px-20 pb-24 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Admin Panel</p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Command Center</h2>
          <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> AI Analytics Online
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Tokens Today', value: totalTokensToday, icon: Activity },
            { label: 'Completed', value: completedToday, icon: CheckCircle2 },
            { label: 'Avg Wait', value: `${stats?.avgWaitTime || 0}m`, icon: Clock },
            { label: 'Active', value: stats?.activePatients || 0, icon: Users },
          ].map((m, i) => (
            <div key={i} className="bg-white px-4 py-2.5 border border-slate-200 rounded-xl flex items-center gap-2.5 shadow-sm">
              <m.icon size={16} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-500">{m.label}:</span>
              <span className="text-sm font-black text-slate-900">{m.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Load */}
        <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-lg shadow-slate-100/50">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <h3 className="font-black text-slate-800">Department Load</h3>
            <button onClick={loadData} className="text-xs text-slate-400 hover:text-slate-600 font-bold flex items-center gap-1"><RefreshCw size={12} /> Refresh</button>
          </div>
          <div className="space-y-4">
            {departmentLoad.map(dept => (
              <div key={dept.id} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="font-bold text-slate-700 text-sm">{dept.name}</span>
                    <span className="text-xs text-slate-400 font-medium ml-2">{dept.activeTokens} patients · {dept.doctorCount} doctors</span>
                  </div>
                  <span className={`text-xs font-bold ${dept.loadPercent > 80 ? 'text-red-500' : 'text-emerald-600'}`}>
                    {dept.loadPercent}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${dept.loadPercent > 80 ? 'bg-red-500' : dept.loadPercent > 50 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                    style={{ width: `${dept.loadPercent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations Panel */}
        <div className="col-span-1 bg-slate-900 text-white rounded-2xl p-6 shadow-2xl">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Brain size={18} className="text-blue-400" /> AI Optimizer</h3>
          <p className="text-xs text-slate-500 font-medium mb-5">Dynamic analysis of live queue data</p>

          <div className="space-y-4">
            {allClear ? (
              <div className="text-center py-8">
                <CheckCircle2 size={36} className="text-green-500 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-300">All Systems Balanced</p>
              </div>
            ) : (
              <AnimatePresence>
                {activeRecs.map(rec => {
                  const sev = severityStyle(rec.payload.severity);
                  return (
                    <motion.div key={rec.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2.5">
                      <div className={`p-4 rounded-xl border ${sev.bg} ${sev.border}`}>
                        <div className={`flex items-center gap-2 text-xs font-bold mb-2 ${sev.text}`}>
                          <sev.icon size={14} /> {sev.label}
                        </div>
                        <p className="text-xs font-medium text-slate-300 leading-relaxed mb-1.5">{rec.payload.message}</p>
                        <p className="text-xs font-semibold text-blue-200">🤖 {rec.payload.suggestion}</p>
                        {rec.payload.metric && <p className="text-[10px] text-slate-500 font-bold mt-2 flex justify-between">
                          <span>Metric: {rec.payload.metric}</span>
                          <span className="opacity-50">Refreshed: {rec.lastRefreshed}</span>
                        </p>}
                      </div>
                      {rec.action ? (
                        <button onClick={() => handleResolve(rec.id)}
                          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold flex justify-center items-center gap-1.5 group transition-all shadow-lg shadow-blue-900/40">
                          📅 Update Schedules <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      ) : (
                        <div className="w-full py-2 bg-slate-700/50 rounded-lg text-xs font-medium text-center text-slate-400">
                          ℹ️ Info only — no action needed
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* AI Explanation */}
      <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Cpu size={18} className="text-slate-400" /> How AI Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
            <h4 className="font-bold text-slate-700 mb-1 flex items-center gap-1.5"><Target size={14} className="text-red-500" /> Overload Detection</h4>
            <p className="text-slate-500 font-medium text-xs">When a department exceeds 40% capacity, AI delays appointment slots by 15-30 min.</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
            <h4 className="font-bold text-slate-700 mb-1 flex items-center gap-1.5"><GitBranch size={14} className="text-indigo-500" /> Queue Rebalancing</h4>
            <p className="text-slate-500 font-medium text-xs">When a doctor has a long queue, AI extends wait times by ~20 min to prevent overcrowding.</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
            <h4 className="font-bold text-slate-700 mb-1 flex items-center gap-1.5"><Zap size={14} className="text-amber-500" /> Idle Optimization</h4>
            <p className="text-slate-500 font-medium text-xs">When a department has doctors but zero patients, staff are notified to support busy departments.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
