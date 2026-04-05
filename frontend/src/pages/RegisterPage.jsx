import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await register(name, email, password, 'patient');
    if (user) {
      navigate('/qtrack/patient/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/30">
            <Activity size={28} className="text-white" strokeWidth={3} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h1>
          <p className="text-slate-500 font-medium mt-2">Register as a patient to generate tokens</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium mb-6">{error}</div>}

          <div className="mb-5">
            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
            <input type="text" value={name} onChange={e => { setName(e.target.value); clearError(); }} required
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-800 font-medium" placeholder="John Doe" />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); clearError(); }} required
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-800 font-medium" placeholder="you@example.com" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <input type="password" value={password} onChange={e => { setPassword(e.target.value); clearError(); }} required minLength={4}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-800 font-medium" placeholder="Min 4 characters" />
          </div>

          <button type="submit" disabled={isLoading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed">
            {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Create Account <ArrowRight size={18} /></>}
          </button>

          <p className="text-center text-slate-500 mt-6 text-sm font-medium">
            Already have an account? <Link to="/qtrack/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
