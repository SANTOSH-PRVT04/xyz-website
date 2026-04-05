import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Activity, User, Mail, Lock, Eye, EyeOff, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HospitalAuthPage = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, isLoading, error, clearError, returnTo } = useAuthStore();
  const [mode, setMode] = useState('login'); // login | register
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPass: '' });
  const [localError, setLocalError] = useState('');

  // If already logged in, redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate(returnTo || '/', { replace: true });
    }
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    clearError();
    setLocalError('');
    const user = await login(form.email, form.password);
    if (user) {
      navigate(returnTo || '/', { replace: true });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    clearError();
    setLocalError('');
    if (form.password !== form.confirmPass) {
      setLocalError('Passwords do not match.');
      return;
    }
    if (form.password.length < 4) {
      setLocalError('Password must be at least 4 characters.');
      return;
    }
    const user = await register(form.name, form.email, form.password, 'patient');
    if (user) {
      navigate(returnTo || '/', { replace: true });
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setLocalError('');
    clearError();
    setForm({ name: '', email: '', password: '', confirmPass: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex items-center justify-center px-6 py-20 pt-28">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Activity size={28} className="text-blue-600" strokeWidth={2.5} />
            <span className="text-2xl font-bold text-slate-800">XYZ Hospital</span>
          </div>
          <p className="text-slate-500 text-sm">
            {mode === 'login' ? 'Sign in to book appointments, access QTrack, and manage your health.' : 'Create your patient account to get started.'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50">
          {/* Mode Toggle */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
            <button onClick={() => mode !== 'login' && switchMode()}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === 'login' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
              <LogIn size={16} /> Sign In
            </button>
            <button onClick={() => mode !== 'register' && switchMode()}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === 'register' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
              <UserPlus size={16} /> Register
            </button>
          </div>

          {/* Error */}
          {(error || localError) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium text-center">
              {error || localError}
            </div>
          )}

          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.form key="login" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                onSubmit={handleLogin} className="space-y-4"
              >
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:outline-none" placeholder="patient@xyz.com" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1.5 block">Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                      className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:outline-none" placeholder="Enter your password" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={isLoading}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md disabled:opacity-60 transition-all">
                  {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><LogIn size={18} /> Sign In</>}
                </button>

                {/* Demo login */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400 text-center mb-3 uppercase font-bold tracking-wider">Quick Demo Login</p>
                  <div className="flex gap-2">
                    {[
                      { label: 'Patient', email: 'patient@xyz.com' },
                      { label: 'Doctor', email: 'doctor@xyz.com' },
                      { label: 'Admin', email: 'admin@xyz.com' },
                    ].map(demo => (
                      <button key={demo.label} type="button" onClick={async () => {
                        const u = await login(demo.email, 'pass123');
                        if (u) navigate(returnTo || '/', { replace: true });
                      }}
                        className="flex-1 py-2 text-xs font-bold rounded-lg bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-700 transition-colors">
                        {demo.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.form>
            ) : (
              <motion.form key="register" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                onSubmit={handleRegister} className="space-y-4"
              >
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1.5 block">Full Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:outline-none" placeholder="Your full name" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:outline-none" placeholder="you@email.com" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1.5 block">Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:outline-none" placeholder="Create password" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1.5 block">Confirm Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="password" required value={form.confirmPass} onChange={e => setForm({...form, confirmPass: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:outline-none" placeholder="Confirm password" />
                  </div>
                </div>
                <button type="submit" disabled={isLoading}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md disabled:opacity-60 transition-all">
                  {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><UserPlus size={18} /> Create Account</>}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};

export default HospitalAuthPage;
