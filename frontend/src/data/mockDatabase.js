// ============================================================
// QTrack Mock Database — localStorage-synced across tabs
// Every mutation saves to localStorage. Every read syncs first.
// This means tokens generated in Tab A appear in Tab B.
// ============================================================

// --- DEPARTMENTS ---
export const departments = [
  { id: 'dept-1', name: 'Cardiology', description: 'Heart and cardiovascular system', active: true, avgConsultTime: 12 },
  { id: 'dept-2', name: 'General Medicine', description: 'Primary care and general consultation', active: true, avgConsultTime: 8 },
  { id: 'dept-3', name: 'Pediatrics', description: 'Child and adolescent healthcare', active: true, avgConsultTime: 10 },
  { id: 'dept-4', name: 'Orthopedics', description: 'Bones, joints, and musculoskeletal system', active: true, avgConsultTime: 15 },
  { id: 'dept-5', name: 'Dermatology', description: 'Skin, hair, and nail conditions', active: true, avgConsultTime: 8 },
  { id: 'dept-6', name: 'Neurology', description: 'Brain and nervous system disorders', active: true, avgConsultTime: 18 },
  { id: 'dept-7', name: 'Radiology', description: 'Medical imaging and diagnostics', active: true, avgConsultTime: 20 },
];

// --- DOCTORS ---
export const doctors = [
  { id: 'doc-1', name: 'Dr. Sarah Jenkins', departmentId: 'dept-1', specialization: 'Interventional Cardiology', available: true, room: 'C-101' },
  { id: 'doc-2', name: 'Dr. Michael Chen', departmentId: 'dept-1', specialization: 'Electrophysiology', available: true, room: 'C-102' },
  { id: 'doc-3', name: 'Dr. Emily Roberts', departmentId: 'dept-2', specialization: 'Internal Medicine', available: true, room: 'G-201' },
  { id: 'doc-4', name: 'Dr. James Wilson', departmentId: 'dept-2', specialization: 'Family Medicine', available: false, room: 'G-202' },
  { id: 'doc-5', name: 'Dr. Aisha Patel', departmentId: 'dept-3', specialization: 'Neonatology', available: true, room: 'P-301' },
  { id: 'doc-6', name: 'Dr. Robert Kim', departmentId: 'dept-4', specialization: 'Joint Replacement', available: true, room: 'O-401' },
  { id: 'doc-7', name: 'Dr. Lisa Chang', departmentId: 'dept-5', specialization: 'Cosmetic Dermatology', available: true, room: 'D-501' },
  { id: 'doc-8', name: 'Dr. Raj Mehta', departmentId: 'dept-6', specialization: 'Stroke & Epilepsy', available: true, room: 'N-601' },
  { id: 'doc-9', name: 'Dr. Anna Torres', departmentId: 'dept-7', specialization: 'Diagnostic Imaging', available: true, room: 'R-701' },
];

// --- USERS ---
// NOTE: Registered patients are stored in localStorage under 'qtrack_registered_users'
// so they persist across page reloads. See authStore.js for the read logic.
export const users = [
  // ── PATIENTS ──
  { id: 'user-p1', name: 'Santosh Kumar',  email: 'patient@xyz.com',  password: 'pass123', role: 'patient', phone: '9876543210' },
  { id: 'user-p2', name: 'Priya Sharma',   email: 'priya@xyz.com',    password: 'pass123', role: 'patient', phone: '9876543211' },
  { id: 'user-p3', name: 'Rahul Verma',    email: 'rahul@xyz.com',    password: 'pass123', role: 'patient', phone: '9876543212' },
  { id: 'user-p4', name: 'Neha Gupta',     email: 'neha@xyz.com',     password: 'pass123', role: 'patient', phone: '9876543213' },
  // ── DOCTORS (one per doctor, matching doctors[] above) ──
  { id: 'user-d1', name: 'Dr. Sarah Jenkins', email: 'sarah.jenkins@xyz.com', password: 'doc123', role: 'doctor', phone: '9876543220', doctorId: 'doc-1' },
  { id: 'user-d2', name: 'Dr. Michael Chen',  email: 'michael.chen@xyz.com',  password: 'doc123', role: 'doctor', phone: '9876543221', doctorId: 'doc-2' },
  { id: 'user-d3', name: 'Dr. Emily Roberts', email: 'emily.roberts@xyz.com',  password: 'doc123', role: 'doctor', phone: '9876543222', doctorId: 'doc-3' },
  { id: 'user-d4', name: 'Dr. James Wilson',  email: 'james.wilson@xyz.com',   password: 'doc123', role: 'doctor', phone: '9876543223', doctorId: 'doc-4' },
  { id: 'user-d5', name: 'Dr. Aisha Patel',   email: 'aisha.patel@xyz.com',    password: 'doc123', role: 'doctor', phone: '9876543224', doctorId: 'doc-5' },
  { id: 'user-d6', name: 'Dr. Robert Kim',    email: 'robert.kim@xyz.com',     password: 'doc123', role: 'doctor', phone: '9876543225', doctorId: 'doc-6' },
  { id: 'user-d7', name: 'Dr. Lisa Chang',    email: 'lisa.chang@xyz.com',     password: 'doc123', role: 'doctor', phone: '9876543226', doctorId: 'doc-7' },
  { id: 'user-d8', name: 'Dr. Raj Mehta',     email: 'raj.mehta@xyz.com',      password: 'doc123', role: 'doctor', phone: '9876543227', doctorId: 'doc-8' },
  { id: 'user-d9', name: 'Dr. Anna Torres',   email: 'anna.torres@xyz.com',    password: 'doc123', role: 'doctor', phone: '9876543228', doctorId: 'doc-9' },
  // ── ADMIN ──
  { id: 'user-a1', name: 'Admin User',         email: 'admin@xyz.com',          password: 'pass123', role: 'admin', phone: '9876543230' },
];

// Helper
function makeExpiry(createdAt) {
  return new Date(new Date(createdAt).getTime() + 2 * 60 * 60 * 1000).toISOString();
}

// ============================================================
// SHARED STATE via localStorage
// This is the key fix: all browser tabs share the same queue.
// ============================================================
const STORAGE_KEY = 'qtrack_tokens';
const COUNTER_KEY = 'qtrack_counter';
const LOG_KEY = 'qtrack_logs';

// Default seed data
const now = Date.now();
const SEED_TOKENS = [
  { id: 'tkn-1', tokenNumber: 'TKN-001', patientId: 'user-p2', patientName: 'Priya Sharma', doctorId: 'doc-1', departmentId: 'dept-1', position: 0, status: 'called', eta: 0, priority: 1, createdAt: new Date(now - 3600000).toISOString(), expiresAt: makeExpiry(new Date(now - 3600000)) },
  { id: 'tkn-2', tokenNumber: 'TKN-002', patientId: 'user-p1', patientName: 'Santosh Kumar', doctorId: 'doc-1', departmentId: 'dept-1', position: 1, status: 'near_turn', eta: 12, priority: 1, createdAt: new Date(now - 1800000).toISOString(), expiresAt: makeExpiry(new Date(now - 1800000)) },
  { id: 'tkn-3', tokenNumber: 'TKN-003', patientId: 'user-p3', patientName: 'Rahul Verma', doctorId: 'doc-1', departmentId: 'dept-1', position: 2, status: 'waiting', eta: 24, priority: 1, createdAt: new Date(now - 900000).toISOString(), expiresAt: makeExpiry(new Date(now - 900000)) },
  { id: 'tkn-4', tokenNumber: 'TKN-004', patientId: 'user-p4', patientName: 'Neha Gupta', doctorId: 'doc-3', departmentId: 'dept-2', position: 0, status: 'called', eta: 0, priority: 1, createdAt: new Date(now - 2400000).toISOString(), expiresAt: makeExpiry(new Date(now - 2400000)) },
  { id: 'tkn-5', tokenNumber: 'TKN-005', patientId: null, patientName: 'Amit Singh', doctorId: 'doc-3', departmentId: 'dept-2', position: 1, status: 'waiting', eta: 8, priority: 1, createdAt: new Date(now - 600000).toISOString(), expiresAt: makeExpiry(new Date(now - 600000)) },
  { id: 'tkn-6', tokenNumber: 'TKN-006', patientId: null, patientName: 'Kavita Devi', doctorId: 'doc-5', departmentId: 'dept-3', position: 0, status: 'called', eta: 0, priority: 2, createdAt: new Date(now - 300000).toISOString(), expiresAt: makeExpiry(new Date(now - 300000)) },
  { id: 'tkn-7', tokenNumber: 'TKN-007', patientId: null, patientName: 'Deepak Yadav', doctorId: 'doc-6', departmentId: 'dept-4', position: 0, status: 'called', eta: 0, priority: 1, createdAt: new Date(now).toISOString(), expiresAt: makeExpiry(new Date(now)) },
  { id: 'tkn-8', tokenNumber: 'TKN-008', patientId: null, patientName: 'Sanjay Mehta', doctorId: 'doc-2', departmentId: 'dept-1', position: 0, status: 'called', eta: 0, priority: 1, createdAt: new Date(now - 1200000).toISOString(), expiresAt: makeExpiry(new Date(now - 1200000)) },
  { id: 'tkn-9', tokenNumber: 'TKN-009', patientId: null, patientName: 'Anita Roy', doctorId: 'doc-2', departmentId: 'dept-1', position: 1, status: 'waiting', eta: 12, priority: 1, createdAt: new Date(now - 500000).toISOString(), expiresAt: makeExpiry(new Date(now - 500000)) },
  { id: 'tkn-10', tokenNumber: 'TKN-010', patientId: null, patientName: 'Vikram Thakur', doctorId: 'doc-7', departmentId: 'dept-5', position: 0, status: 'waiting', eta: 5, priority: 1, createdAt: new Date(now - 200000).toISOString(), expiresAt: makeExpiry(new Date(now - 200000)) },
];

// Initialize: load from localStorage, or seed defaults
function _initStorage() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TOKENS));
    localStorage.setItem(COUNTER_KEY, '10');
    localStorage.setItem(LOG_KEY, JSON.stringify([]));
  }
}
_initStorage();

// READ from localStorage (called before every getter)
function _loadTokens() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

function _loadCounter() {
  return parseInt(localStorage.getItem(COUNTER_KEY) || '10', 10);
}

function _loadLogs() {
  try {
    return JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
  } catch { return []; }
}

// WRITE to localStorage (called after every mutation)
function _saveTokens(tkns) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tkns));
}

function _saveCounter(c) {
  localStorage.setItem(COUNTER_KEY, c.toString());
}

function _saveLogs(logs) {
  localStorage.setItem(LOG_KEY, JSON.stringify(logs));
}

// ============================================================
// MUTATION HELPERS — all read/write through localStorage
// ============================================================

export function generateToken(patientId, patientName, doctorId, departmentId) {
  const tkns = _loadTokens();
  let counter = _loadCounter();
  const logs = _loadLogs();

  // BLOCK: prevent duplicate active tokens for same patient
  const existing = tkns.find(t => t.patientId === patientId && t.status !== 'completed' && t.status !== 'cancelled');
  if (existing) {
    return existing; // Return existing token instead of creating duplicate
  }

  const dept = departments.find(d => d.id === departmentId);
  const consultTime = dept?.avgConsultTime || 10;

  // Count active tokens for this specific doctor (across ALL tabs)
  const doctorTokens = tkns.filter(t => t.doctorId === doctorId && t.status !== 'completed' && t.status !== 'cancelled');
  const position = doctorTokens.length;

  counter++;
  const createdAt = new Date().toISOString();
  const newToken = {
    id: `tkn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    tokenNumber: `TKN-${String(counter).padStart(3, '0')}`,
    patientId,
    patientName,
    doctorId,
    departmentId,
    position,
    status: position === 0 ? 'called' : (position === 1 ? 'near_turn' : 'waiting'),
    eta: position * consultTime,
    priority: 1,
    createdAt,
    expiresAt: makeExpiry(createdAt),
  };

  tkns.push(newToken);
  logs.push({ id: `log-${Date.now()}`, tokenId: newToken.id, action: 'created', source: 'patient', details: `Token generated for ${patientName}`, timestamp: createdAt });

  _saveTokens(tkns);
  _saveCounter(counter);
  _saveLogs(logs);

  return newToken;
}

export function callNextPatient(doctorId) {
  const tkns = _loadTokens();
  const logs = _loadLogs();

  const current = tkns.find(t => t.doctorId === doctorId && t.status === 'called');
  if (current) {
    current.status = 'completed';
    logs.push({ id: `log-${Date.now()}`, tokenId: current.id, action: 'completed', source: 'doctor', timestamp: new Date().toISOString() });
  }

  const dept = departments.find(d => d.id === (current?.departmentId || tkns.find(t => t.doctorId === doctorId)?.departmentId));
  const consultTime = dept?.avgConsultTime || 10;

  const waiting = tkns
    .filter(t => t.doctorId === doctorId && (t.status === 'waiting' || t.status === 'near_turn'))
    .sort((a, b) => a.position - b.position);

  if (waiting.length > 0) {
    waiting[0].status = 'called';
    waiting[0].eta = 0;
    waiting[0].position = 0;
    waiting.slice(1).forEach((t, i) => {
      t.position = i + 1;
      t.eta = (i + 1) * consultTime;
      t.status = i === 0 ? 'near_turn' : 'waiting';
    });
    logs.push({ id: `log-${Date.now()}a`, tokenId: waiting[0].id, action: 'called', source: 'doctor', timestamp: new Date().toISOString() });
  }

  _saveTokens(tkns);
  _saveLogs(logs);
  return waiting[0] || null;
}

export function markComplete(doctorId) {
  const tkns = _loadTokens();
  const logs = _loadLogs();

  const current = tkns.find(t => t.doctorId === doctorId && t.status === 'called');
  if (current) {
    current.status = 'completed';
    logs.push({ id: `log-${Date.now()}`, tokenId: current.id, action: 'completed', source: 'doctor', timestamp: new Date().toISOString() });

    const dept = departments.find(d => d.id === current.departmentId);
    const consultTime = dept?.avgConsultTime || 10;
    const waiting = tkns.filter(t => t.doctorId === doctorId && (t.status === 'waiting' || t.status === 'near_turn')).sort((a, b) => a.position - b.position);
    if (waiting.length > 0) {
      waiting[0].status = 'called';
      waiting[0].eta = 0;
      waiting[0].position = 0;
      waiting.slice(1).forEach((t, i) => { t.position = i + 1; t.eta = (i + 1) * consultTime; t.status = i === 0 ? 'near_turn' : 'waiting'; });
    }
  }

  _saveTokens(tkns);
  _saveLogs(logs);
  return current;
}

export function delayPatient(doctorId) {
  const tkns = _loadTokens();
  const logs = _loadLogs();

  const current = tkns.find(t => t.doctorId === doctorId && t.status === 'called');
  if (current) {
    const waiting = tkns.filter(t => t.doctorId === doctorId && (t.status === 'waiting' || t.status === 'near_turn')).sort((a, b) => a.position - b.position);
    current.status = 'waiting';
    current.position = waiting.length + 1;
    const dept = departments.find(d => d.id === current.departmentId);
    const consultTime = dept?.avgConsultTime || 10;
    current.eta = current.position * consultTime;
    if (waiting.length > 0) {
      waiting[0].status = 'called';
      waiting[0].eta = 0;
      waiting[0].position = 0;
      waiting.slice(1).forEach((t, i) => { t.position = i + 1; t.eta = (i + 1) * consultTime; t.status = i === 0 ? 'near_turn' : 'waiting'; });
    }
    logs.push({ id: `log-${Date.now()}`, tokenId: current.id, action: 'delayed', source: 'doctor', timestamp: new Date().toISOString() });
  }

  _saveTokens(tkns);
  _saveLogs(logs);
  return current;
}

export function cancelToken(tokenId) {
  const tkns = _loadTokens();
  const tkn = tkns.find(t => t.id === tokenId);
  if (tkn) {
    tkn.status = 'cancelled';
    _saveTokens(tkns);
  }
  return tkn;
}

// ============================================================
// DYNAMIC AI — computed from LIVE shared queue state
// ============================================================

const EXECUTED_AI_KEY = 'qtrack_executed_ai';

function _loadExecutedAI() {
  try {
    const data = JSON.parse(localStorage.getItem(EXECUTED_AI_KEY) || '{}');
    const now = Date.now();
    // Auto-expire entries older than 10 minutes so they can resurface if problem persists
    const cleaned = {};
    for (const [id, ts] of Object.entries(data)) {
      if (now - ts < 10 * 60 * 1000) cleaned[id] = ts;
    }
    if (Object.keys(cleaned).length !== Object.keys(data).length) {
      localStorage.setItem(EXECUTED_AI_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch { return {}; }
}

function _markAIExecuted(recId) {
  const data = _loadExecutedAI();
  data[recId] = Date.now();
  localStorage.setItem(EXECUTED_AI_KEY, JSON.stringify(data));
}

export function generateAIRecommendations() {
  const tkns = _loadTokens();
  const recs = [];
  const deptLoads = _getDeptLoadFromTokens(tkns);
  const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric" });

  // ── Rule 1: Overload Detection — delay patients, keep same doctor ──
  deptLoads.filter(d => d.loadPercent > 40).forEach(dept => {
    const delayMins = dept.loadPercent > 80 ? 30 : 15;
    recs.push({
      id: `ai-overload-${dept.id}-${dept.activeTokens}`, departmentId: dept.id, type: 'overload', lastRefreshed: now,
      action: { type: 'delay', deptId: dept.id, delayMins, reason: `${dept.name} is at ${dept.loadPercent}% capacity with ${dept.activeTokens} active patients. To ensure quality care, appointment times have been pushed by ${delayMins} minutes.` },
      payload: {
        message: `${dept.name} is at ${dept.loadPercent}% capacity with ${dept.activeTokens} active patients.`,
        suggestion: `Push waiting patients' slots by ~${delayMins} min to reduce congestion.`,
        severity: dept.loadPercent > 80 ? 'critical' : 'high',
        metric: `${dept.loadPercent}%`,
      },
    });
  });

  // ── Rule 2: Queue Imbalance — delay if avg ≥ 2 patients/doctor ──
  doctors.filter(d => d.available).forEach(doc => {
    const queue = tkns.filter(t => t.doctorId === doc.id && t.status !== 'completed' && t.status !== 'cancelled');
    if (queue.length >= 2) {
      const sameDeptDocs = doctors.filter(d => d.departmentId === doc.departmentId && d.available && d.id !== doc.id);
      const lessLoaded = sameDeptDocs.find(d => tkns.filter(t => t.doctorId === d.id && t.status !== 'completed' && t.status !== 'cancelled').length < queue.length - 1);
      if (lessLoaded) {
        recs.push({
          id: `ai-queue-${doc.id}-${queue.length}`, departmentId: doc.departmentId, type: 'rebalance', lastRefreshed: now,
          action: { type: 'delay', deptId: doc.departmentId, delayMins: 20, reason: `${doc.name} has ${queue.length} patients queued. Wait times extended by 20 minutes to prevent overcrowding.` },
          payload: {
            message: `${doc.name} has ${queue.length} patients queued.`,
            suggestion: `Extend slots by ~20 min for patients with ${doc.name}.`,
            severity: queue.length >= 4 ? 'high' : 'medium',
            metric: `${queue.length} patients`,
          },
        });
      }
    }
  });

  // ── Rule 3: Idle Resource — info only, no delay needed ──
  deptLoads.filter(d => d.loadPercent === 0 && d.doctorCount > 0).forEach(dept => {
    const busiest = deptLoads.reduce((a, b) => a.loadPercent > b.loadPercent ? a : b);
    if (busiest.loadPercent >= 20) {
      recs.push({
        id: `ai-idle-${dept.id}`, departmentId: dept.id, type: 'optimization', lastRefreshed: now,
        action: null, // No patient action needed — info only
        payload: {
          message: `${dept.name} has ${dept.doctorCount} doctors but 0 active patients.`,
          suggestion: `Staff notified to support ${busiest.name} (${busiest.loadPercent}% load) if needed.`,
          severity: 'low',
          metric: '0%',
        },
      });
    }
  });

  // Live noise for visual refresh
  const noise = () => Math.floor(Math.random() * 5);
  recs.forEach(r => {
    if(r.payload.metric !== '0%') r.payload.metric += ` (±${noise()}% var)`; 
  });

  // Filter out already-executed recommendations
  const executedIds = _loadExecutedAI();
  const filtered = recs.filter(r => !executedIds[r.id]);

  return filtered.length > 0 ? filtered.slice(0, 4) : [{ id: 'ai-clear', type: 'all_clear', lastRefreshed: now, action: null, payload: { message: 'All departments balanced.', suggestion: 'No action required.', severity: 'none', metric: '✓' } }];
}

export function applyAIRecommendation(recId) {
  const tkns = _loadTokens();
  const recs = generateAIRecommendations();
  const rec = recs.find(r => r.id === recId);
  if (!rec || !rec.action) return false;

  let modified = false;
  const { type, deptId, delayMins, reason } = rec.action;

  if (type === 'delay' && deptId && delayMins) {
    // Find all waiting patients in this department and push their ETA
    const waiting = tkns.filter(t => t.departmentId === deptId && (t.status === 'waiting' || t.status === 'near_turn'));
    waiting.forEach(patient => {
      patient.eta = (patient.eta || 0) + delayMins;
      patient.rescheduled = true;
      patient.rescheduleReason = reason;
      patient.rescheduleDelay = delayMins;
      modified = true;
    });
  }

  if (modified) {
    _markAIExecuted(recId); // Track so this rec disappears from the panel
    const logs = _loadLogs();
    logs.push({ id: `log-${Date.now()}`, tokenId: null, action: 'ai_schedule_delay', source: 'admin', details: reason, timestamp: new Date().toISOString() });
    _saveLogs(logs);
    _saveTokens(tkns);
  }
  return modified;
}

// ============================================================
// COMPUTED GETTERS — always read fresh from localStorage
// ============================================================

function _getDeptLoadFromTokens(tkns) {
  return departments.map(dept => {
    const active = tkns.filter(t => t.departmentId === dept.id && t.status !== 'completed' && t.status !== 'cancelled');
    const deptDoctors = doctors.filter(d => d.departmentId === dept.id);
    const capacity = deptDoctors.length * 5;
    return { ...dept, activeTokens: active.length, doctorCount: deptDoctors.length, loadPercent: capacity > 0 ? Math.min(100, Math.round((active.length / capacity) * 100)) : 0 };
  });
}

export function getStats() {
  const tkns = _loadTokens();
  const activeTokens = tkns.filter(t => t.status !== 'completed' && t.status !== 'cancelled');
  const avgEta = activeTokens.length > 0 ? Math.round(activeTokens.reduce((s, t) => s + t.eta, 0) / activeTokens.length) : 0;
  return { activePatients: activeTokens.length, avgWaitTime: avgEta, availableDoctors: doctors.filter(d => d.available).length, emergencyCases: activeTokens.filter(t => t.priority >= 3).length };
}

export function getLiveQueue() {
  const tkns = _loadTokens();
  return tkns
    .filter(t => t.status !== 'completed' && t.status !== 'cancelled')
    .sort((a, b) => a.position - b.position)
    .slice(0, 6)
    .map(t => ({ ...t, doctorName: doctors.find(d => d.id === t.doctorId)?.name || 'Unknown', departmentName: departments.find(d => d.id === t.departmentId)?.name || 'Unknown' }));
}

export function getDoctorQueue(doctorId) {
  const tkns = _loadTokens();
  return tkns
    .filter(t => t.doctorId === doctorId && t.status !== 'completed' && t.status !== 'cancelled')
    .sort((a, b) => a.position - b.position);
}

export function getDepartmentLoad() {
  return _getDeptLoadFromTokens(_loadTokens());
}

export function getPatientActiveToken(patientId) {
  const tkns = _loadTokens();
  return tkns.find(t => t.patientId === patientId && t.status !== 'completed' && t.status !== 'cancelled') || null;
}

export function getPatientName(patientId) {
  if (!patientId) return 'Walk-in Patient';
  const u = users.find(u => u.id === patientId);
  return u?.name || 'Unknown Patient';
}

// Reset function (for debugging — call from console: qtrackReset())
window.qtrackReset = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(COUNTER_KEY);
  localStorage.removeItem(LOG_KEY);
  _initStorage();
  window.location.reload();
};
