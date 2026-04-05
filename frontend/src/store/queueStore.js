import { create } from 'zustand';
import * as db from '../data/mockDatabase.js';

export const useQueueStore = create((set, get) => ({
  selectedDepartment: null,
  selectedDoctor: null,
  activeToken: null,
  departments: [],
  filteredDoctors: [],
  liveQueue: [],
  doctorQueue: [],
  stats: null,
  departmentLoad: [],
  aiRecommendations: [],
  isLoading: false,
  error: null,

  setDepartment: (deptId) => {
    const filtered = db.doctors.filter(d => d.departmentId === deptId && d.available);
    set({ selectedDepartment: deptId, selectedDoctor: null, filteredDoctors: filtered });
  },
  setDoctor: (docId) => set({ selectedDoctor: docId }),
  resetSelection: () => set({ selectedDepartment: null, selectedDoctor: null }),

  fetchDepartments: () => set({ departments: db.departments.filter(d => d.active) }),

  fetchStats: async () => {
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 400));
    set({ stats: db.getStats(), isLoading: false });
  },

  fetchLiveQueue: async () => {
    await new Promise(r => setTimeout(r, 200));
    set({ liveQueue: db.getLiveQueue() });
  },

  fetchDoctorQueue: async (doctorId) => {
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 400));
    set({ doctorQueue: db.getDoctorQueue(doctorId), isLoading: false });
  },

  fetchDepartmentLoad: async () => {
    await new Promise(r => setTimeout(r, 400));
    set({ departmentLoad: db.getDepartmentLoad() });
  },

  fetchAIRecommendations: async () => {
    await new Promise(r => setTimeout(r, 600));
    set({ aiRecommendations: db.generateAIRecommendations() });
  },

  // --- PATIENT ACTIONS ---
  generateToken: async (patientId, patientName, doctorId, departmentId) => {
    set({ isLoading: true, error: null });
    await new Promise(r => setTimeout(r, 1200));
    try {
      const token = db.generateToken(patientId, patientName, doctorId, departmentId);
      // Enrich with doctor/dept names
      const doc = db.doctors.find(d => d.id === token.doctorId);
      const dept = db.departments.find(d => d.id === token.departmentId);
      const enriched = { ...token, doctorName: doc?.name, departmentName: dept?.name, room: doc?.room };
      set({ activeToken: enriched, isLoading: false });
      return enriched;
    } catch (e) {
      set({ error: 'Token generation failed.', isLoading: false });
      return null;
    }
  },

  fetchMyToken: (patientId) => {
    const token = db.getPatientActiveToken(patientId);
    if (token) {
      const doc = db.doctors.find(d => d.id === token.doctorId);
      const dept = db.departments.find(d => d.id === token.departmentId);
      set({ activeToken: { ...token, doctorName: doc?.name, departmentName: dept?.name, room: doc?.room } });
    } else {
      set({ activeToken: null });
    }
  },

  cancelToken: async (tokenId) => {
    await new Promise(r => setTimeout(r, 400));
    db.cancelToken(tokenId);
    set({ activeToken: null, selectedDepartment: null, selectedDoctor: null });
  },

  // --- DOCTOR ACTIONS ---
  callNext: async (doctorId) => {
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 800));
    db.callNextPatient(doctorId);
    set({ doctorQueue: db.getDoctorQueue(doctorId), isLoading: false });
  },

  markComplete: async (doctorId) => {
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 600));
    db.markComplete(doctorId);
    set({ doctorQueue: db.getDoctorQueue(doctorId), isLoading: false });
  },

  delayPatient: async (doctorId) => {
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 600));
    db.delayPatient(doctorId);
    set({ doctorQueue: db.getDoctorQueue(doctorId), isLoading: false });
  },
}));
