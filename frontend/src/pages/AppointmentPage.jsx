import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { departments, doctors } from '../data/mockDatabase';
import { Calendar, Clock, User, Building2, Stethoscope, CheckCircle2, ArrowRight, ArrowLeft, CalendarDays, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM',
  '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM',
];

const AppointmentPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, setReturnTo } = useAuthStore();
  const [step, setStep] = useState(1); // 1-4
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  // If not authenticated, redirect to login
  useEffect(() => {
    if (!isAuthenticated) {
      setReturnTo('/appointments');
      navigate('/auth', { replace: true });
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const filteredDoctors = selectedDept
    ? doctors.filter(d => d.departmentId === selectedDept.id && d.available)
    : [];

  // Generate next 14 days
  const dates = [];
  for (let i = 1; i <= 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    if (d.getDay() !== 0) dates.push(d); // Skip Sundays
  }

  const canProceed = () => {
    if (step === 1) return selectedDept;
    if (step === 2) return selectedDoc;
    if (step === 3) return selectedDate && selectedTime;
    return true;
  };

  const handleConfirm = () => {
    // Save to localStorage so it appears in the dashboard
    const newAppointment = {
      id: Date.now().toString(),
      type: `${selectedDept.name} Consultation`,
      doc: selectedDoc.name,
      dept: selectedDept.name,
      date: new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      time: selectedTime,
      room: selectedDoc.room,
      reason: reason || 'Routine Checkup',
      status: 'upcoming'
    };

    try {
      const existing = JSON.parse(localStorage.getItem('xyz_appointments') || '[]');
      localStorage.setItem('xyz_appointments', JSON.stringify([...existing, newAppointment]));
    } catch (e) {
      console.error(e);
    }

    setConfirmed(true);
  };

  if (confirmed) {
    const dept = selectedDept;
    const doc = selectedDoc;
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex items-center justify-center px-6 pt-28 pb-16">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 p-10 shadow-xl text-center"
        >
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={36} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Appointment Confirmed!</h2>
          <p className="text-slate-500 mb-8">Your appointment has been scheduled successfully.</p>
          
          <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-4 border border-slate-100 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Patient</span>
              <span className="font-bold text-slate-800">{user?.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Department</span>
              <span className="font-bold text-slate-800">{dept?.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Doctor</span>
              <span className="font-bold text-slate-800">{doc?.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Room</span>
              <span className="font-bold text-slate-800 flex items-center gap-1"><MapPin size={14} /> {doc?.room}</span>
            </div>
            <hr className="border-slate-200" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Date</span>
              <span className="font-bold text-blue-600">{new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Time</span>
              <span className="font-bold text-blue-600">{selectedTime}</span>
            </div>
            {reason && (
              <div className="flex justify-between items-start">
                <span className="text-sm text-slate-500">Reason</span>
                <span className="font-medium text-slate-700 text-right max-w-[200px]">{reason}</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate('/')} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors">
              Back to Home
            </button>
            <button onClick={() => navigate('/qtrack')} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              QTrack Portal <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 pt-28 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Book an Appointment</h1>
          <p className="text-slate-500">Schedule a visit with our specialists in just a few steps.</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 mb-12">
          {['Department', 'Doctor', 'Schedule', 'Confirm'].map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-slate-200 text-slate-500'
                }`}>
                  {step > i + 1 ? <CheckCircle2 size={18} /> : i + 1}
                </div>
                <span className={`text-xs font-bold ${step === i + 1 ? 'text-blue-600' : 'text-slate-400'}`}>{label}</span>
              </div>
              {i < 3 && <div className={`w-12 h-0.5 rounded mt-[-18px] ${step > i + 1 ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Building2 className="text-blue-600" /> Select Department</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departments.filter(d => d.active).map(dept => (
                  <button key={dept.id} onClick={() => setSelectedDept(dept)}
                    className={`text-left p-5 rounded-2xl border-2 transition-all ${selectedDept?.id === dept.id ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-slate-200 bg-white hover:border-blue-200'}`}>
                    <h3 className="font-bold text-slate-800">{dept.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{dept.description}</p>
                    <p className="text-xs text-blue-600 font-bold mt-2">Avg. consultation: {dept.avgConsultTime} min</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Stethoscope className="text-blue-600" /> Select Doctor</h2>
              {filteredDoctors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDoctors.map(doc => (
                    <button key={doc.id} onClick={() => setSelectedDoc(doc)}
                      className={`text-left p-5 rounded-2xl border-2 transition-all ${selectedDoc?.id === doc.id ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-slate-200 bg-white hover:border-blue-200'}`}>
                      <h3 className="font-bold text-slate-800">{doc.name}</h3>
                      <p className="text-sm text-slate-500">{doc.specialization}</p>
                      <p className="text-xs text-blue-600 font-bold mt-2 flex items-center gap-1"><MapPin size={12} /> Room {doc.room}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-12">No available doctors in this department.</p>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><CalendarDays className="text-blue-600" /> Pick Date & Time</h2>
              
              <label className="text-sm font-bold text-slate-700 mb-2 block">Select Date</label>
              <div className="flex flex-wrap gap-2 mb-8">
                {dates.map(d => {
                  const val = d.toISOString().split('T')[0];
                  const isSelected = selectedDate === val;
                  return (
                    <button key={val} onClick={() => setSelectedDate(val)}
                      className={`py-2 px-4 rounded-xl text-sm font-bold border-2 transition-all ${isSelected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200'}`}>
                      <div className="text-xs">{d.toLocaleDateString('en-IN', { weekday: 'short' })}</div>
                      <div>{d.getDate()} {d.toLocaleDateString('en-IN', { month: 'short' })}</div>
                    </button>
                  );
                })}
              </div>

              <label className="text-sm font-bold text-slate-700 mb-2 block">Select Time Slot</label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-8">
                {timeSlots.map(t => (
                  <button key={t} onClick={() => setSelectedTime(t)}
                    className={`py-2 px-2 rounded-lg text-xs font-bold border-2 transition-all ${selectedTime === t ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200'}`}>
                    {t}
                  </button>
                ))}
              </div>

              <label className="text-sm font-bold text-slate-700 mb-2 block">Reason for Visit (optional)</label>
              <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:outline-none resize-none" placeholder="Describe your symptoms or reason..." />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><CheckCircle2 className="text-emerald-600" /> Review & Confirm</h2>
              <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-4">
                <div className="flex justify-between"><span className="text-slate-500">Patient</span><span className="font-bold">{user?.name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Department</span><span className="font-bold">{selectedDept?.name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Doctor</span><span className="font-bold">{selectedDoc?.name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Room</span><span className="font-bold">{selectedDoc?.room}</span></div>
                <hr />
                <div className="flex justify-between"><span className="text-slate-500">Date</span><span className="font-bold text-blue-600">{new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Time</span><span className="font-bold text-blue-600">{selectedTime}</span></div>
                {reason && <div className="flex justify-between"><span className="text-slate-500">Reason</span><span className="font-medium text-right max-w-[250px]">{reason}</span></div>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-10">
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors">
            <ArrowLeft size={16} /> {step === 1 ? 'Cancel' : 'Back'}
          </button>
          {step < 4 ? (
            <button onClick={() => setStep(step + 1)} disabled={!canProceed()}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md">
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={handleConfirm}
              className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-md">
              <CheckCircle2 size={18} /> Confirm Appointment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
