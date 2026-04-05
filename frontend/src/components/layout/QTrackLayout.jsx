import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, LogOut, User, LogIn } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useUIStore } from '../../store/uiStore';

const QTrackLayout = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { toasts } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/qtrack');
  };

  const isLoginPage = location.pathname.includes('/login') || location.pathname.includes('/register');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white py-3.5 px-6 md:px-12 sticky top-0 z-50 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/qtrack" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white group-hover:scale-105 transition-all shadow-lg shadow-blue-600/30">
              <Activity size={18} strokeWidth={3} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold tracking-tight leading-none">QTrack</h1>
              <span className="text-[9px] uppercase tracking-widest text-blue-400 font-semibold mt-0.5 leading-none">Smart Queue</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center gap-2 text-sm text-slate-400 border border-slate-700 rounded-lg px-3 py-1.5">
                  <User size={14} />
                  <span className="font-medium">{user?.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${
                    user?.role === 'doctor' ? 'bg-indigo-600/30 text-indigo-300' :
                    user?.role === 'admin' ? 'bg-amber-600/30 text-amber-300' :
                    'bg-blue-600/30 text-blue-300'
                  }`}>{user?.role}</span>
                </div>
                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-white transition-colors" title="Logout">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              !isLoginPage && (
                <Link to="/qtrack/login"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-600/20">
                  <LogIn size={16} /> Login
                </Link>
              )
            )}

            <Link to="/" className="text-xs font-medium text-slate-500 hover:text-white transition-colors border-l border-slate-700 pl-3 ml-1">
              Exit
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 w-full relative overflow-x-hidden">
        <Outlet />
      </main>

      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 50 }}
              className={`px-5 py-3.5 rounded-xl shadow-2xl font-bold text-sm flex items-center gap-2 border ${
                t.type === 'success' ? 'bg-green-600 text-white border-green-500' :
                t.type === 'error' ? 'bg-red-600 text-white border-red-500' :
                'bg-slate-800 text-white border-slate-700'
              }`}>
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QTrackLayout;
