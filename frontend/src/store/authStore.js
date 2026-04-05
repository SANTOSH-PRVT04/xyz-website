import { create } from 'zustand';
import { users } from '../data/mockDatabase.js';

// Registered users are stored in localStorage so they persist across refreshes.
const REG_KEY = 'qtrack_registered_users';

function _loadRegistered() {
  try { return JSON.parse(localStorage.getItem(REG_KEY) || '[]'); } catch { return []; }
}
function _saveRegistered(list) {
  try { localStorage.setItem(REG_KEY, JSON.stringify(list)); } catch {}
}

// Build a unified user lookup that merges seed users + localStorage-persisted registered ones
function _getAllUsers() {
  const registered = _loadRegistered();
  const seedEmails = new Set(users.map(u => u.email.toLowerCase()));
  // Registered users that aren't already in the seed list
  const extras = registered.filter(u => !seedEmails.has(u.email.toLowerCase()));
  return [...users, ...extras];
}

/**
 * Unified Auth Store
 * One login session for the ENTIRE site (hospital website + QTrack).
 * If a patient logs in via the hospital auth page, they are auto-authenticated
 * in QTrack — no re-login required.
 */
export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  returnTo: null, // URL to redirect back to after login

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    await new Promise(r => setTimeout(r, 600));
    const allUsers = _getAllUsers();
    const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (found) {
      const { password: _, ...safeUser } = found;
      set({ user: safeUser, isAuthenticated: true, isLoading: false, error: null });
      try { sessionStorage.setItem('qtrack_auth', JSON.stringify(safeUser)); } catch {}
      return safeUser;
    } else {
      set({ isLoading: false, error: 'Invalid credentials. Check your email and password.' });
      return null;
    }
  },

  register: async (name, email, password, role = 'patient') => {
    set({ isLoading: true, error: null });
    await new Promise(r => setTimeout(r, 600));
    const allUsers = _getAllUsers();
    // Block duplicate emails (case-insensitive)
    if (allUsers.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      set({ isLoading: false, error: 'An account with this email already exists. Please sign in.' });
      return null;
    }
    const newUser = { id: `user-${Date.now()}`, name, email, password, role, phone: '' };
    // Persist new patient to localStorage
    const registered = _loadRegistered();
    registered.push(newUser);
    _saveRegistered(registered);
    const { password: _, ...safeUser } = newUser;
    set({ user: safeUser, isAuthenticated: true, isLoading: false });
    try { sessionStorage.setItem('qtrack_auth', JSON.stringify(safeUser)); } catch {}
    return safeUser;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, error: null, returnTo: null });
    try { sessionStorage.removeItem('qtrack_auth'); } catch {}
  },

  setReturnTo: (url) => set({ returnTo: url }),
  clearError: () => set({ error: null }),

  // Restore session on app load (reads sessionStorage for current tab session)
  restoreSession: () => {
    try {
      const stored = sessionStorage.getItem('qtrack_auth');
      if (stored) {
        const user = JSON.parse(stored);
        set({ user, isAuthenticated: true });
      }
    } catch {}
  },
}));
