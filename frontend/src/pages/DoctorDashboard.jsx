import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle, Play, CheckCircle, Clock, Search, AlertCircle, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useQueueStore } from '../store/queueStore';
import { useUIStore } from '../store/uiStore';
import { doctors as allDoctors, getPatientName } from '../data/mockDatabase';

const DoctorDashboard = () => {
  const { user } = useAuthStore();
  const { doctorQueue, fetchDoctorQueue, callNext, markComplete, delayPatient, isLoading } = useQueueStore();
  const { showToast } = useUIStore();
  const [actionType, setActionType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Animation states
  const [showCompleteAnim, setShowCompleteAnim] = useState(false);
  const [showCallNextAnim, setShowCallNextAnim] = useState(false);
  const [calledToken, setCalledToken] = useState(null);

  const doctorId = user?.doctorId;
  const doctorProfile = allDoctors.find(d => d.id === doctorId);

  useEffect(() => {
    if (doctorId) fetchDoctorQueue(doctorId);
    const poll = setInterval(() => { if (doctorId) fetchDoctorQueue(doctorId); }, 8000);
    return () => clearInterval(poll);
  }, [doctorId]);

  const currentPatient = doctorQueue.find(t => t.status === 'called');
  const waitingPatients = doctorQueue.filter(t => t.status !== 'called' && t.status !== 'completed');
  const filteredWaiting = waitingPatients.filter(t =>
    t.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.patientName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = async (action) => {
    if (!doctorId || actionType) return;
    setActionType(action);
    if (action === 'call') {
      const nextP = waitingPatients[0];
      if (nextP) setCalledToken(nextP.tokenNumber);
      setShowCallNextAnim(true);
      await callNext(doctorId);
      showToast('Next patient called.', 'success');
      setTimeout(() => setShowCallNextAnim(false), 2000);
    }
    if (action === 'complete') {
      setShowCompleteAnim(true);
      await markComplete(doctorId);
      showToast('Patient marked complete.', 'success');
      setTimeout(() => setShowCompleteAnim(false), 1500);
    }
    if (action === 'delay') { 
      await delayPatient(doctorId); 
      showToast('Patient delayed.', 'info'); 
    }
    await fetchDoctorQueue(doctorId);
    setActionType(null);
  };

  if (!doctorId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-8">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-10 text-center max-w-md">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={36} />
          <h2 className="text-xl font-bold text-red-700 mb-2">No Doctor Profile</h2>
          <p className="text-red-600 font-medium text-sm">This account is not linked to a doctor profile. Please log in with a doctor account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[85vh] bg-slate-50 font-sans relative">
      {/* ── ALERTS / ANIMATIONS OUTSIDE THE MAIN FLOW ── */}
      <AnimatePresence>
        {showCompleteAnim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="flex flex-col items-center bg-white p-8 rounded-3xl shadow-2xl"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={56} className="text-green-500" />
              </div>
              <p className="text-slate-800 text-2xl font-black">Consultation Complete!</p>
              <p className="text-slate-500 mt-2 font-medium">Great work, Doctor.</p>
            </motion.div>
          </motion.div>
        )}
        
        {showCallNextAnim && calledToken && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed bottom-10 left-10 z-50 bg-indigo-600 text-white p-6 rounded-2xl shadow-2xl flex items-center gap-4 pointer-events-none"
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Play fill="white" size={24} />
            </div>
            <div>
              <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Calling Next</p>
              <p className="text-2xl font-black">{calledToken}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT: Active Workspace */}
      <div className="flex-1 p-6 md:p-8 flex flex-col">
        <div className="mb-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Doctor Console</p>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{doctorProfile?.name || 'Doctor'}</h2>
          <p className="text-sm text-slate-500 font-medium">{doctorProfile?.specialization} · Room {doctorProfile?.room}</p>
        </div>

        {/* Current Patient */}
        {currentPatient ? (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl shadow-slate-200/30 border border-slate-100 overflow-hidden mb-6">
            <div className="h-1.5 bg-indigo-500" />
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                    <UserCircle size={32} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Now Serving</p>
                    <h3 className="text-3xl font-black text-slate-800">{currentPatient.tokenNumber}</h3>
                  </div>
                </div>
                <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-green-200">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> IN PROGRESS
                </div>
              </div>

              {/* Patient Name */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-5 flex items-center gap-3">
                <User className="text-indigo-500" size={18} />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient</p>
                  <p className="text-base font-bold text-slate-800">{currentPatient.patientName || getPatientName(currentPatient.patientId)}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => handleAction('complete')} disabled={actionType !== null}
                  className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/15">
                  {/* Kept basic loader, plus our new overlay triggers */}
                  {actionType === 'complete' ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><CheckCircle size={18}/> Complete</>}
                </button>
                <button onClick={() => handleAction('delay')} disabled={actionType !== null}
                  className="flex-1 py-3.5 bg-white border-2 border-slate-200 hover:border-orange-400 hover:text-orange-600 text-slate-600 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {actionType === 'delay' ? <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /> : <><Clock size={18}/> Delay</>}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 font-medium shadow-sm mb-6">
            No patient currently being served.
          </div>
        )}

        {/* Call Next */}
        <div className="mt-auto pt-4">
          <button onClick={() => handleAction('call')} disabled={actionType !== null || waitingPatients.length === 0}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-lg transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed group">
            {actionType === 'call' ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <><Play size={20} className="group-hover:translate-x-0.5 transition-transform" /> Call Next ({waitingPatients[0]?.tokenNumber || 'None'})</>
            )}
          </button>
        </div>
      </div>

      {/* RIGHT: Queue Sidebar */}
      <div className="w-full lg:w-[380px] bg-white border-l border-slate-200 flex flex-col">
        <div className="p-5 border-b border-slate-100 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-slate-800">Waiting List</h3>
            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-bold">{waitingPatients.length}</span>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search token or name..." className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:bg-white transition-all" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
          {filteredWaiting.length === 0 ? (
            <p className="text-center text-slate-400 font-medium text-sm mt-8">Queue is empty.</p>
          ) : filteredWaiting.map((pt, idx) => (
            <motion.div key={pt.id} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }}
              className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between hover:shadow-md hover:border-indigo-200 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-50 text-slate-500 rounded-lg flex items-center justify-center font-bold text-xs border border-slate-100">
                  #{pt.position}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{pt.tokenNumber}</h4>
                  <p className="text-[11px] font-bold text-indigo-600">{pt.patientName || getPatientName(pt.patientId)}</p>
                  <p className="text-[10px] font-medium text-slate-500">{pt.status === 'near_turn' ? '⚡ Next in line' : `ETA: ${pt.eta}m`}</p>
                </div>
              </div>
              <div className={`w-2.5 h-2.5 rounded-full ${pt.status === 'near_turn' ? 'bg-orange-500' : 'bg-yellow-400'}`} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
