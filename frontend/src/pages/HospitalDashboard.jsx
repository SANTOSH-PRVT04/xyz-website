import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, FileText, CreditCard, User as UserIcon, Shield, Package, ArrowLeft, Download, CheckCircle2, Stethoscope, ChevronRight, Activity, Heart, Bell, Menu, X, Home } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';

const HospitalDashboard = () => {
  const { user, logout } = useAuthStore();
  const [view, setView] = useState('overview'); // 'overview', 'appointments', 'records', 'billing', 'profile'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);

  React.useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('xyz_appointments') || '[]');
      setAppointments(stored);
    } catch (e) {}
  }, []);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'records', label: 'Medical Records', icon: FileText },
    { id: 'billing', label: 'Billing & Payments', icon: CreditCard },
  ];

  const handleNav = (id) => {
    setView(id);
    setMobileMenuOpen(false);
  };

  const Sidebar = ({ mobile }) => (
    <div className={`h-full flex flex-col justify-between ${mobile ? 'p-6' : 'p-8'}`}>
      <div>
        {/* Brand */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Activity className="text-white" size={24} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-black text-white tracking-tight">XYZ Hospital</span>
        </div>

        {/* Navigation */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-3">Dashboard</p>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                view === item.id 
                  ? 'bg-blue-600/10 text-blue-400 font-black' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} strokeWidth={view === item.id ? 2.5 : 2} className={view === item.id ? 'text-blue-500' : ''} />
              {item.label}
              {view === item.id && <motion.div layoutId="navIndicator" className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full" />}
            </button>
          ))}
          
          <Link to="/qtrack/patient/dashboard" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-amber-500 hover:bg-amber-500/10 transition-all mt-2">
            <Clock size={18} strokeWidth={2} /> QTrack Queue
          </Link>
        </div>
      </div>

      <div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-slate-300">
              <UserIcon size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{user?.name || 'Patient'}</p>
              <p className="text-xs text-slate-400 font-medium">ID: XYZ-{user?.id?.substring(0,6).toUpperCase() || '8482A1'}</p>
            </div>
          </div>
          <Link to="/auth" onClick={() => logout()} className="w-full text-xs font-bold text-slate-400 hover:text-white transition-colors text-center block pt-2 border-t border-slate-700/50">Sign Out</Link>
        </div>
        <Link to="/" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors">
          <Home size={16} /> Back to Website
        </Link>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full flex bg-[#f8fafc] overflow-hidden font-sans">
      
      {/* ─── DESKTOP SIDEBAR ─── */}
      <div className="hidden lg:block w-72 bg-slate-900 h-full border-r border-slate-800 relative z-20 shadow-2xl">
        <Sidebar />
      </div>

      {/* ─── MOBILE HEADER & MENU ─── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Activity className="text-white" size={18} strokeWidth={2.5} />
          </div>
          <span className="text-lg font-black text-white">XYZ</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="lg:hidden fixed inset-0 top-16 bg-slate-900 z-30 overflow-y-auto">
            <Sidebar mobile />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className="flex-1 h-full overflow-y-auto relative pt-16 lg:pt-0">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto p-4 md:p-8 lg:p-12 relative z-10 w-full min-h-full">
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{navItems.find(i => i.id === view)?.label || 'Portal'}</p>
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                {view === 'overview' ? `Hello, ${user?.name?.split(' ')[0] || 'Patient'}.` : navItems.find(i => i.id === view)?.label}
              </h2>
            </div>
            <button className="w-10 h-10 bg-white border border-slate-200 text-slate-600 rounded-full flex items-center justify-center hover:shadow-lg hover:border-slate-300 transition-all relative">
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              <Bell size={18} />
            </button>
          </div>

          <AnimatePresence mode="wait">
            
            {/* ─── OVERVIEW (COMMAND CENTER) ─── */}
            {view === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                
                {/* Hero / Pulse Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Next Appointment Card (Glassy/Gradient) */}
                  <div className="lg:col-span-2 relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 overflow-hidden text-white shadow-2xl shadow-indigo-900/20 group">
                    {/* Animated BG elements */}
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                    <motion.div animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="absolute -bottom-32 left-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                      <div className="flex justify-between items-start">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs font-bold backdrop-blur-md border border-white/10">
                          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Next Appointment
                        </div>
                        <Calendar className="text-white/40" size={24} />
                      </div>
                      
                      {appointments.length === 0 ? (
                        <div>
                          <h3 className="text-3xl font-black mb-2 leading-tight">No upcoming visits</h3>
                          <p className="text-indigo-200 font-medium">Your schedule is currently clear. Need to see a doctor?</p>
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-3xl font-black mb-2 leading-tight">{appointments[appointments.length - 1].type}</h3>
                          <p className="text-indigo-200 font-medium font-bold text-lg">{appointments[appointments.length - 1].date} at {appointments[appointments.length - 1].time}</p>
                          <p className="text-indigo-300 font-medium mt-1">with {appointments[appointments.length - 1].doc}</p>
                        </div>
                      )}

                      <div className="flex gap-4">
                        <Link to="/appointments" className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-xl shadow-lg hover:scale-105 transition-transform">Book a Visit</Link>
                        {appointments.length > 0 && <button onClick={() => setView('appointments')} className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-transform backdrop-blur-sm border border-white/10">View Details</button>}
                      </div>
                    </div>
                  </div>

                  {/* Vitals Snapshot */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-bold text-slate-800">Health Pulse</h4>
                      <Heart className="text-rose-500" size={20} />
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center relative">
                      {/* Fake Circular Progress */}
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="56" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                        <motion.circle cx="64" cy="64" r="56" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray="351.8" initial={{ strokeDashoffset: 351.8 }} animate={{ strokeDashoffset: 351.8 * 0.3 }} transition={{ duration: 1.5, ease: "easeOut" }} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col flex-col items-center justify-center">
                        <p className="text-2xl font-black text-slate-800">70<span className="text-sm font-medium text-slate-400">/100</span></p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Score</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-6">
                      <div className="bg-blue-50 rounded-xl p-3 text-center">
                        <p className="text-[10px] font-bold text-blue-500 uppercase">BMI</p>
                        <p className="text-lg font-black text-blue-900">22.4</p>
                      </div>
                      <div className="bg-rose-50 rounded-xl p-3 text-center">
                        <p className="text-[10px] font-bold text-rose-500 uppercase">Blood</p>
                        <p className="text-lg font-black text-rose-900">O+</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Vault Access */}
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-4 px-1">Quick Vault</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { id: 'records', label: 'Lab Results', icon: FileText, delay: 0 },
                      { id: 'records', label: 'Prescriptions', icon: Shield, delay: 0.1 },
                      { id: 'billing', label: 'Pay Bills', icon: CreditCard, delay: 0.2 },
                      { id: 'qtrack', label: 'Live Queue', icon: Clock, delay: 0.3, link: '/qtrack/patient/dashboard' }
                    ].map((item, idx) => {
                      const Wrapper = item.link ? Link : 'button';
                      return (
                        <Wrapper
                          key={idx}
                          to={item.link}
                          onClick={!item.link ? () => setView(item.id) : undefined}
                          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left group"
                        >
                          <div className="w-10 h-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <item.icon size={20} />
                          </div>
                          <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.label}</p>
                          <p className="text-[11px] font-medium text-slate-400 mt-1 flex items-center gap-1">Open Vault <ChevronRight size={10} /></p>
                        </Wrapper>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── APPOINTMENTS VIEW ─── */}
            {view === 'appointments' && (
              <motion.div key="appointments" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-8">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><Calendar className="text-blue-600" size={20} /> Upcoming ({appointments.length})</h3>
                  
                  {appointments.length === 0 ? (
                    <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-10 text-center">
                      <Calendar size={32} className="mx-auto text-slate-300 mb-3" />
                      <h4 className="text-slate-700 font-bold mb-1">No Upcoming Appointments</h4>
                      <p className="text-slate-500 text-sm font-medium mb-6">You don't have any scheduled visits right now.</p>
                      <Link to="/appointments" className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30">Book Appointment</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {appointments.map((visit) => (
                        <div key={visit.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border border-blue-100 bg-blue-50/30 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all group">
                          <div className="flex gap-4 items-center">
                            <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100 shadow-sm">
                              <Stethoscope size={24} />
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-lg">{visit.type}</p>
                              <p className="text-sm font-medium text-slate-500">{visit.doc} · {visit.dept}</p>
                              <p className="text-xs font-bold text-blue-600 mt-1 tracking-widest bg-blue-100/50 inline-block px-2 py-1 rounded-md">{visit.date} at {visit.time}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold text-[10px] uppercase tracking-widest rounded-lg flex items-center gap-1"><CheckCircle2 size={12}/> Confirmed</span>
                            <button className="text-sm font-bold text-slate-500 group-hover:text-blue-600 transition-colors">Reschedule</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-8">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><Clock className="text-slate-500" size={20} /> Past Visits</h3>
                  <div className="space-y-4">
                    {[
                      { type: 'General Consultation', doc: 'Dr. Aisha Khan', dept: 'General Medicine', date: 'Oct 12, 2025' },
                      { type: 'Cardiology Checkup', doc: 'Dr. Emily Chen', dept: 'Cardiology', date: 'Jun 04, 2025' }
                    ].map((visit, i) => (
                      <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border border-slate-100 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all group">
                        <div className="flex gap-4 items-center">
                          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100">
                            <Stethoscope size={24} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-lg">{visit.type}</p>
                            <p className="text-sm font-medium text-slate-500">{visit.doc} · {visit.dept}</p>
                            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{visit.date}</p>
                          </div>
                        </div>
                        <button className="text-sm font-bold text-slate-500 group-hover:text-blue-600 bg-slate-50 group-hover:bg-blue-50 px-5 py-2.5 rounded-xl transition-colors shrink-0">View Details</button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── MEDICAL RECORDS VIEW ─── */}
            {view === 'records' && (
              <motion.div key="records" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-8">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><FileText className="text-indigo-600" size={20} /> Lab Reports</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[ 
                      { name: 'Complete Blood Count (CBC)', date: 'Oct 12, 2025', type: 'PDF' },
                      { name: 'Chest X-Ray', date: 'Sep 05, 2025', type: 'IMAGE' } 
                    ].map((report, idx) => (
                      <div key={idx} className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl hover:border-indigo-200 hover:shadow-md transition-all group cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center border border-rose-100">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{report.name}</p>
                            <p className="text-[11px] font-bold text-slate-400 mt-1 tracking-widest">{report.date} · {report.type}</p>
                          </div>
                        </div>
                        <button className="text-slate-400 group-hover:text-indigo-600 transition-colors bg-slate-50 p-3 rounded-xl group-hover:bg-indigo-50">
                          <Download size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-8">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Digital Prescriptions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-black text-indigo-900 text-xl mb-1">Amoxicillin 500mg</h4>
                          <p className="text-xs text-indigo-600 font-medium">Dr. Aisha Khan · Oct 12, 2025</p>
                        </div>
                        <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg flex items-center gap-1 uppercase tracking-widest"><CheckCircle2 size={12} strokeWidth={3} /> Active</span>
                      </div>
                      <div className="bg-white/60 p-4 rounded-xl border border-indigo-50/50">
                        <p className="text-sm font-bold text-indigo-900">Take 1 tablet every 8 hours for 7 days. After meals.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── BILLING VIEW ─── */}
            {view === 'billing' && (
              <motion.div key="billing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Glassmorphic Balance Card */}
                  <div className="bg-slate-900 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl" />
                    <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
                    
                    <div className="relative z-10">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2"><CreditCard size={14} /> Total Balance</p>
                      <h3 className="text-5xl font-black mb-6">$0.00</h3>
                    </div>

                    <div className="relative z-10 flex items-center gap-2 text-sm text-emerald-400 font-bold bg-emerald-400/10 w-fit px-4 py-2 rounded-xl border border-emerald-400/20">
                      <CheckCircle2 size={18} strokeWidth={2.5}/> Everything is paid!
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-8 flex flex-col justify-center text-center items-center">
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                      <CreditCard size={32} />
                    </div>
                    <h4 className="font-bold text-slate-800 mb-1">No Saved Cards</h4>
                    <p className="text-sm text-slate-500 font-medium mb-6">Add a secure payment method for faster checkouts.</p>
                    <button className="text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl transition-colors">Add Payment Method</button>
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-8 overflow-hidden">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Invoice History</h3>
                  <div className="overflow-x-auto -mx-8 px-8">
                    <table className="w-full text-left min-w-[600px]">
                      <thead>
                        <tr className="border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                          <th className="pb-4">Invoice #</th>
                          <th className="pb-4">Date</th>
                          <th className="pb-4">Service</th>
                          <th className="pb-4 text-right">Amount</th>
                          <th className="pb-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm font-medium">
                        <tr className="border-b border-slate-50 hover:bg-slate-50 group transition-colors">
                          <td className="py-5 text-slate-800 font-bold group-hover:text-blue-600 transition-colors">INV-2025-0042</td>
                          <td className="py-5 text-slate-500">Oct 12, 2025</td>
                          <td className="py-5 text-slate-800">General Consultation</td>
                          <td className="py-5 text-right font-black text-slate-800">$150.00</td>
                          <td className="py-5 text-center"><span className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider">Paid</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
