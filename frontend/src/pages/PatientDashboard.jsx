import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, CheckCircle2, ChevronRight, Activity, Clock, Users, ArrowLeft, RefreshCw, MapPin, X, Calendar, Timer, AlertTriangle, User, Bell, BellRing } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useQueueStore } from '../store/queueStore';
import { useUIStore } from '../store/uiStore';

// Format time helpers
const formatTime = (iso) => new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
const formatDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const getEstimatedCallTime = (etaMinutes) => {
  const d = new Date(Date.now() + etaMinutes * 60 * 1000);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};
const getTimeRemaining = (expiresAt) => {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return 'Expired';
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return `${hours}h ${mins}m`;
};

// ─── NOTIFICATION SYSTEM ─────────────────────────────────────────────
const NOTIF_KEY = 'qtrack_patient_notifs';

function _loadNotifs() {
  try { return JSON.parse(localStorage.getItem(NOTIF_KEY) || '[]'); } catch { return []; }
}
function _saveNotifs(notifs) {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs.slice(-20)));
}

const PatientDashboard = () => {
  const { user } = useAuthStore();
  const { departments, filteredDoctors, selectedDepartment, selectedDoctor, activeToken,
    fetchDepartments, setDepartment, setDoctor, resetSelection, generateToken, fetchMyToken, cancelToken, isLoading } = useQueueStore();
  const { showToast } = useUIStore();
  
  const [view, setView] = useState('dashboard');
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedToken, setGeneratedToken] = useState(null);
  const [, forceUpdate] = useState(0);

  // ── Notification State ──
  const [notifications, setNotifications] = useState(_loadNotifs);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [activeNotif, setActiveNotif] = useState(null);
  const prevStatusRef = useRef(null);
  const prevRescheduledRef = useRef(false);
  const prevEtaRef = useRef(null);

  const addNotification = useCallback((notif) => {
    const entry = { id: Date.now(), timestamp: new Date().toISOString(), read: false, ...notif };
    setNotifications(prev => {
      const updated = [...prev, entry];
      _saveNotifs(updated);
      return updated;
    });
    setActiveNotif(entry);
    setTimeout(() => setActiveNotif(prev => prev?.id === entry.id ? null : prev), 6000);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      _saveNotifs(updated);
      return updated;
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    fetchDepartments();
    if (user) fetchMyToken(user.id);
    const poll = setInterval(() => { if (user) fetchMyToken(user.id); }, 5000);
    return () => clearInterval(poll);
  }, [user]);

  useEffect(() => {
    if (activeToken && view !== 'dashboard') setView('dashboard');
  }, [activeToken]);

  // ── Detect status changes & push notifications ──
  useEffect(() => {
    if (!activeToken) {
      prevStatusRef.current = null;
      prevRescheduledRef.current = false;
      prevEtaRef.current = null;
      return;
    }

    const prevStatus = prevStatusRef.current;
    const prevRescheduled = prevRescheduledRef.current;
    const prevEta = prevEtaRef.current;

    // Status change: called
    if (prevStatus && prevStatus !== 'called' && activeToken.status === 'called') {
      addNotification({
        type: 'turn',
        severity: 'success',
        title: "🎉 It's Your Turn!",
        message: `Please proceed to Room ${activeToken.room || 'Reception'}. Your doctor is ready to see you.`,
        icon: '🔔',
      });
    }

    // Status change: near_turn
    if (prevStatus && prevStatus === 'waiting' && activeToken.status === 'near_turn') {
      addNotification({
        type: 'near_turn',
        severity: 'warning',
        title: "⚡ Almost Your Turn!",
        message: `You're next in line. Please start heading to the consultation room.`,
        icon: '⏳',
      });
    }

    // AI rescheduled
    if (!prevRescheduled && activeToken.rescheduled) {
      addNotification({
        type: 'ai_reschedule',
        severity: 'info',
        title: "📢 Schedule Updated by AI",
        message: activeToken.rescheduleReason || `Your appointment time has been adjusted due to high demand.`,
        icon: '🤖',
      });
    }

    // ETA increased
    if (prevEta !== null && activeToken.eta > prevEta && activeToken.rescheduled && prevRescheduled) {
      addNotification({
        type: 'ai_reschedule',
        severity: 'info',
        title: "⏱ Wait Time Extended",
        message: `Your estimated wait has increased to ${activeToken.eta} minutes. ${activeToken.rescheduleReason || ''}`,
        icon: '📋',
      });
    }

    prevStatusRef.current = activeToken.status;
    prevRescheduledRef.current = activeToken.rescheduled || false;
    prevEtaRef.current = activeToken.eta;
  }, [activeToken?.status, activeToken?.rescheduled, activeToken?.eta]);

  useEffect(() => {
    const t = setInterval(() => forceUpdate(n => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

  const handleGenerate = async () => {
    if (!user || !selectedDoctor || !selectedDepartment) return;
    setView('generating');
    const token = await generateToken(user.id, user.name, selectedDoctor, selectedDepartment);
    if (token) {
      setGeneratedToken(token);
      setShowSuccess(true);
      setView('success');
      setTimeout(() => {
        setShowSuccess(false);
        setView('dashboard');
      }, 2500);
    }
  };

  const handleCancel = async () => {
    if (activeToken) {
      await cancelToken(activeToken.id);
      resetSelection();
      showToast('Token cancelled.', 'info');
    }
  };

  const startNewToken = () => { resetSelection(); setView('select-dept'); };

  const statusStyle = (s) => {
    if (s === 'called') return 'bg-green-100 text-green-700 border-green-200';
    if (s === 'near_turn') return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  const notifColor = (severity) => {
    if (severity === 'success') return { bg: 'bg-green-500', border: 'border-green-400', text: 'text-green-50', glow: 'shadow-green-500/40' };
    if (severity === 'warning') return { bg: 'bg-orange-500', border: 'border-orange-400', text: 'text-orange-50', glow: 'shadow-orange-500/40' };
    return { bg: 'bg-blue-600', border: 'border-blue-500', text: 'text-blue-50', glow: 'shadow-blue-600/40' };
  };

  return (
    <div className="min-h-[85vh] pb-20 font-sans bg-slate-50 px-4 md:px-8 pt-6 relative">

      {/* ─── FLOATING ANIMATED NOTIFICATION ─── */}
      <AnimatePresence>
        {activeNotif && (
          <motion.div
            initial={{ opacity: 0, y: -80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -60, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md"
          >
            <div className={`${notifColor(activeNotif.severity).bg} ${notifColor(activeNotif.severity).glow} rounded-2xl shadow-2xl p-4 border ${notifColor(activeNotif.severity).border} backdrop-blur-sm relative overflow-hidden`}>
              <div className="absolute -left-4 top-1/2 -translate-y-1/2">
                <div className="w-16 h-16 rounded-full border-2 border-white/20 animate-ping" style={{ animationDuration: '1.5s' }} />
                <div className="w-12 h-12 rounded-full border-2 border-white/10 animate-ping absolute top-2 left-2" style={{ animationDuration: '2s', animationDelay: '0.3s' }} />
              </div>

              <div className="flex items-start gap-3 relative z-10">
                <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }} transition={{ duration: 0.6, repeat: 2, repeatDelay: 0.5 }} className="text-3xl shrink-0 mt-0.5">
                  {activeNotif.icon}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-black text-sm ${notifColor(activeNotif.severity).text}`}>{activeNotif.title}</h4>
                  <p className={`text-xs font-medium ${notifColor(activeNotif.severity).text} opacity-90 mt-0.5 leading-relaxed`}>{activeNotif.message}</p>
                </div>
                <button onClick={() => setActiveNotif(null)} className="text-white/60 hover:text-white shrink-0"><X size={16} /></button>
              </div>
              <motion.div initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: 6, ease: 'linear' }} className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 origin-left rounded-b-2xl" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── NOTIFICATION BELL ─── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button onClick={() => { setShowNotifPanel(!showNotifPanel); if (!showNotifPanel) markAllRead(); }} className="relative w-14 h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-2xl shadow-slate-900/40 flex items-center justify-center transition-all hover:scale-105 active:scale-95">
          {unreadCount > 0 ? (
            <motion.div animate={{ rotate: [0, -15, 15, -10, 10, 0] }} transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}>
              <BellRing size={22} />
            </motion.div>
          ) : <Bell size={22} />}
          {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">{unreadCount > 9 ? '9+' : unreadCount}</span>}
        </button>
      </div>

      <AnimatePresence>
        {showNotifPanel && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="fixed bottom-24 right-6 z-50 w-80 max-h-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
              <h4 className="font-bold text-sm flex items-center gap-2"><Bell size={14} /> Notifications</h4>
              <button onClick={() => setShowNotifPanel(false)} className="text-slate-400 hover:text-white"><X size={16} /></button>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm font-medium">No notifications yet</div>
              ) : (
                [...notifications].reverse().map(n => (
                  <div key={n.id} className={`px-4 py-3 border-b border-slate-100 ${!n.read ? 'bg-blue-50/50' : ''}`}>
                    <div className="flex items-start gap-2.5">
                      <span className="text-lg shrink-0">{n.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800">{n.title}</p>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{formatTime(n.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">QTrack Queue Port</p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Live Tracker</h2>
          </div>
        </div>

        {/* ─── CONTENT AREA ─── */}
        <AnimatePresence mode="wait">
          
          {/* TOKEN SUCCESS CELEBRATION */}
          {view === 'success' && generatedToken && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.4, ease: 'backOut' }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md">
              <div className="relative flex flex-col items-center text-center px-8">
                <div className="absolute w-64 h-64 rounded-full border-2 border-blue-400/30 animate-ping" style={{ animationDuration: '1.2s' }} />
                <div className="absolute w-48 h-48 rounded-full border-2 border-blue-400/20 animate-ping" style={{ animationDuration: '1.6s', animationDelay: '0.2s' }} />
                <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.2, duration: 0.5, ease: 'backOut' }} className="w-28 h-28 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50 mb-6 relative z-10">
                  <CheckCircle2 size={56} className="text-white" strokeWidth={2} />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4 }} className="relative z-10">
                  <p className="text-blue-300 text-sm font-bold uppercase tracking-widest mb-1">Token Generated!</p>
                  <h1 className="text-7xl font-black text-white tracking-tighter mb-2">{generatedToken.tokenNumber}</h1>
                  <p className="text-slate-300 font-semibold text-lg">{generatedToken.patientName}</p>
                  <p className="text-slate-500 text-sm mt-1">Taking you to your dashboard…</p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {view === 'dashboard' && (
            <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {activeToken ? (
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
                    <div className="p-6 md:p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Your Token</p>
                          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{activeToken.tokenNumber}</h2>
                        </div>
                        <div className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border ${statusStyle(activeToken.status)}`}>
                          <span className="w-2 h-2 rounded-full bg-current animate-pulse" /> {activeToken.status.replace('_', ' ').toUpperCase()}
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
                        <User className="text-blue-500" size={18} />
                        <div>
                          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Patient Name</p>
                          <p className="text-lg font-bold text-blue-900">{activeToken.patientName || user?.name}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">People Ahead</p>
                          <p className="text-3xl font-black text-slate-800">{activeToken.position}</p>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">{activeToken.position === 0 ? "You're next!" : `${activeToken.position} patients before you`}</p>
                        </div>
                        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1">Wait Time</p>
                          <p className="text-3xl font-black text-indigo-900">{activeToken.eta}<span className="text-base font-bold">min</span></p>
                          <p className="text-xs font-medium text-indigo-600 mt-0.5">{activeToken.eta === 0 ? 'Your turn now!' : `Est. call: ${getEstimatedCallTime(activeToken.eta)}`}</p>
                        </div>
                      </div>

                      <div className="border border-slate-100 rounded-xl overflow-hidden mb-6">
                        <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time Schedule</p>
                        </div>
                        <div className="divide-y divide-slate-100">
                          <div className="flex justify-between items-center px-4 py-3">
                            <span className="text-sm text-slate-500 font-medium flex items-center gap-2"><Calendar size={14} /> Generated</span>
                            <span className="text-sm text-slate-800 font-bold">{formatDate(activeToken.createdAt)} · {formatTime(activeToken.createdAt)}</span>
                          </div>
                          <div className="flex justify-between items-center px-4 py-3">
                            <span className="text-sm text-slate-500 font-medium flex items-center gap-2"><Clock size={14} /> Call Time</span>
                            <span className="text-sm text-slate-800 font-bold">{activeToken.eta === 0 ? 'Now' : getEstimatedCallTime(activeToken.eta)}</span>
                          </div>
                        </div>
                      </div>

                      {activeToken.rescheduled && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                          <div className="flex items-start gap-3">
                            <AlertTriangle size={18} className="text-amber-500 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-sm font-bold text-amber-800 mb-1">Schedule Updated by AI</p>
                              <p className="text-xs text-amber-700 leading-relaxed">{activeToken.rescheduleReason}</p>
                              {activeToken.rescheduleDelay && <p className="text-xs font-bold text-amber-600 mt-2">⏱ Wait time extended by +{activeToken.rescheduleDelay} min</p>}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <div className="border-t border-slate-100 pt-5 space-y-2.5">
                        <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Department</span><span className="text-slate-800 font-bold">{activeToken.departmentName}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Doctor</span><span className="text-slate-800 font-bold">{activeToken.doctorName}</span></div>
                        {activeToken.room && <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Room</span><span className="text-slate-800 font-bold flex items-center gap-1"><MapPin size={14} /> {activeToken.room}</span></div>}
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-72 flex flex-col gap-4">
                    <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg">
                      <h4 className="text-sm font-bold mb-4 flex items-center gap-2"><Activity size={16} className="text-blue-400" /> Queue Progress</h4>
                      <div className="w-full bg-slate-800 rounded-full h-3 mb-2 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-1000"
                          style={{ width: activeToken.status === 'called' ? '100%' : activeToken.status === 'near_turn' ? '80%' : `${Math.max(15, 100 - activeToken.position * 20)}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-500">
                        <span>Generated</span><span className="text-blue-400">Waiting</span><span>Called</span>
                      </div>
                    </div>

                    {activeToken.status === 'called' && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-50 border-2 border-green-200 p-5 rounded-2xl text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-green-400/10 animate-pulse" />
                        <CheckCircle2 className="text-green-600 mx-auto mb-2 relative z-10" size={28} />
                        <h4 className="text-lg font-black text-green-800 relative z-10">It's Your Turn!</h4>
                        <p className="text-sm text-green-600 font-medium relative z-10">Proceed to Room {activeToken.room}</p>
                      </motion.div>
                    )}

                    <button onClick={handleCancel} className="w-full py-3.5 text-sm font-bold text-slate-500 hover:text-red-600 bg-white border border-slate-200 hover:border-red-300 rounded-xl transition-all flex items-center justify-center gap-2">
                      <X size={16} /> Cancel Token
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                  <Activity className="mx-auto text-slate-300 mb-4" size={48} />
                  <h3 className="text-xl font-bold text-slate-700 mb-2">No Active Queue Token</h3>
                  <p className="text-slate-500 font-medium mb-6">Generate a digital token to join a doctor's live queue today.</p>
                  <button onClick={startNewToken} className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all">
                    Generate Walk-in Token
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* GENERATION WORKFLOW FOR QTRACK */}
          {view === 'select-dept' && (
            <motion.div key="dept" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 md:p-8 border border-slate-100">
              <p className="text-blue-600 font-bold text-xs tracking-widest uppercase mb-2">Step 1 of 2</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Select Department</h2>
              <p className="text-slate-500 font-medium text-sm mb-6">Choose the department you need a consultation for.</p>
              <div className="grid gap-3">
                {departments.map(dept => (
                  <button key={dept.id} onClick={() => { setDepartment(dept.id); setView('select-doc'); }} className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left group">
                    <div>
                      <h3 className="font-bold text-slate-800">{dept.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{dept.description} · Avg. {dept.avgConsultTime || 10}min limit</p>
                    </div>
                    <ChevronRight className="text-slate-300 group-hover:text-blue-500 transition-colors" size={20} />
                  </button>
                ))}
              </div>
              <button onClick={() => setView('dashboard')} className="mt-6 text-sm text-slate-400 hover:text-slate-700 font-bold flex items-center gap-1"><ArrowLeft size={14} /> Back</button>
            </motion.div>
          )}

          {view === 'select-doc' && (
            <motion.div key="doc" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 md:p-8 border border-slate-100">
              <button onClick={() => { setView('select-dept'); setDepartment(null); }} className="text-slate-400 hover:text-blue-600 flex items-center gap-1 text-sm font-bold mb-5"><ArrowLeft size={14} /> Back</button>
              <p className="text-blue-600 font-bold text-xs tracking-widest uppercase mb-2">Step 2 of 2</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Select Doctor</h2>
              <p className="text-slate-500 font-medium text-sm mb-6">Available in {departments.find(d => d.id === selectedDepartment)?.name}</p>
              {filteredDoctors.length === 0 ? (
                <div className="py-10 text-center text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-xl">No available doctors right now.</div>
              ) : (
                <div className="grid gap-3 mb-6">
                  {filteredDoctors.map(doc => (
                    <button key={doc.id} onClick={() => setDoctor(doc.id)} className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${selectedDoctor === doc.id ? 'border-blue-600 bg-blue-50 shadow-md shadow-blue-100' : 'border-slate-100 hover:border-blue-300'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center"><Stethoscope size={18} /></div>
                        <div>
                          <h3 className="font-bold text-slate-800">{doc.name}</h3>
                          <p className="text-xs text-slate-500 font-medium">{doc.specialization} · Room {doc.room}</p>
                        </div>
                      </div>
                      {selectedDoctor === doc.id && <CheckCircle2 className="text-blue-600" size={20} />}
                    </button>
                  ))}
                </div>
              )}
              <button onClick={handleGenerate} disabled={!selectedDoctor || isLoading} className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg flex justify-center">{isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Generate Token'}</button>
            </motion.div>
          )}

          {view === 'generating' && (
            <motion.div key="gen" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-2xl p-10 border border-slate-100 flex flex-col items-center text-center">
              <RefreshCw size={40} className="text-blue-600 animate-spin mb-5" />
              <h2 className="text-xl font-black text-slate-900 mb-2">Generating Token...</h2>
              <p className="text-slate-500 font-medium text-sm">Securing your position for {user?.name}</p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default PatientDashboard;
