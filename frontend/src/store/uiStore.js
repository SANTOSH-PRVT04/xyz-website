import { create } from 'zustand';

export const useUIStore = create((set, get) => ({
  notifications: [],
  toasts: [],

  addNotification: (msg, type = 'info') => {
    const n = { id: Date.now(), message: msg, type, read: false, createdAt: new Date().toISOString() };
    set(s => ({ notifications: [n, ...s.notifications] }));
  },

  markRead: (id) => {
    set(s => ({ notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n) }));
  },

  showToast: (message, type = 'success', duration = 4000) => {
    const id = Date.now();
    set(s => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => {
      set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }));
    }, duration);
  },
}));
