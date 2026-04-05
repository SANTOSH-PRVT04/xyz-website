import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Eye, EyeOff, ArrowRight, Users, Stethoscope, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const ROLES = [
  { key: 'patient', label: 'Patient', icon: Users, color: 'blue', email: 'patient@xyz.com', desc: 'Generate tokens & track your queue' },
  { key: 'doctor', label: 'Doctor', icon: Stethoscope, color: 'indigo', email: 'doctor@xyz.com', desc: 'Manage patient queue & consultations' },
  { key: 'admin', label: 'Admin', icon: ShieldCheck, color: 'amber', email: 'admin@xyz.com', desc: 'Monitor system & AI analytics' },
];

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { login, isLoading, error, clearError, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in (e.g. via hospital website), skip login and go to dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      const target = user.role === 'doctor' ? '/qtrack/doctor/dashboard' : user.role === 'admin' ? '/qtrack/admin/dashboard' : '/qtrack/patient/dashboard';
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await login(email, password);
    if (user) {
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'doctor') {
        navigate('/qtrack/doctor/dashboard', { replace: true });
      } else if (user.role === 'admin') {
        navigate('/qtrack/admin/dashboard', { replace: true });
      } else {
        navigate('/qtrack/patient/dashboard', { replace: true });
      }
    }
  };

  const handleDemoLogin = async (roleKey) => {
    clearError();
    const role = ROLES.find(r => r.key === roleKey);
    if (!role) return;
    const user = await login(role.email, 'pass123');
    if (user) {
      if (user.role === 'doctor') navigate('/qtrack/doctor/dashboard', { replace: true });
      else if (user.role === 'admin') navigate('/qtrack/admin/dashboard', { replace: true });
      else navigate('/qtrack/patient/dashboard', { replace: true });
    }
  };

  const activeRole = ROLES.find(r => r.key === selectedRole);

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-600/30">
            <Activity size={28} className="text-white" strokeWidth={3} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sign In to QTrack</h1>
          <p className="text-slate-500 font-medium mt-2">Select your role and enter credentials</p>
        </div>

        {/* Role Tabs */}
        <div className="flex gap-2 mb-6 p-1.5 bg-slate-100 rounded-2xl">
          {ROLES.map(role => (
            <button key={role.key} onClick={() => { setSelectedRole(role.key); clearError(); }}
              className={`flex-1 py-3 px-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                selectedRole === role.key
                  ? `bg-white text-slate-900 shadow-lg`
                  : 'text-slate-500 hover:text-slate-700'
              }`}>
              <role.icon size={16} />
              {role.label}
            </button>
          ))}
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-7 border border-slate-100">
          <div className={`text-xs font-bold uppercase tracking-widest mb-5 flex items-center gap-2 ${
            selectedRole === 'doctor' ? 'text-indigo-600' : selectedRole === 'admin' ? 'text-amber-600' : 'text-blue-600'
          }`}>
            <activeRole.icon size={14} />
            Login as {activeRole.label} — {activeRole.desc}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium mb-5">{error}</div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); clearError(); }} required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-800 font-medium"
              placeholder={activeRole.email} />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); clearError(); }} required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-800 font-medium pr-12"
                placeholder="Enter your password" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading}
            className={`w-full py-3.5 text-white rounded-xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              selectedRole === 'doctor' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20' :
              selectedRole === 'admin' ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20' :
              'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
            }`}>
            {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Sign In as {activeRole.label} <ArrowRight size={18} /></>}
          </button>

          <p className="text-center text-slate-500 mt-5 text-sm font-medium">
            New patient? <Link to="/qtrack/register" className="text-blue-600 font-bold hover:underline">Register Here</Link>
          </p>
        </form>

        {/* Quick Demo Login */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Demo Login</p>
          <div className="grid grid-cols-3 gap-2">
            {ROLES.map(role => (
              <button key={role.key} type="button" onClick={() => handleDemoLogin(role.key)} disabled={isLoading}
                className={`py-2.5 rounded-xl text-sm font-bold transition-all border flex items-center justify-center gap-1.5 disabled:opacity-50 ${
                  role.key === 'patient' ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-100' :
                  role.key === 'doctor' ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-100' :
                  'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-100'
                }`}>
                <role.icon size={14} />
                {role.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-2 text-center">Clicks auto-login with demo account. No credentials needed.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
