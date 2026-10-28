// Default initial seed data & LocalStorage persistence manager

const STORAGE_KEYS = {
  USER: 'studyflow_user',
  TOKEN: 'studyflow_token',
  THEME: 'studyflow_theme',
  SUBJECTS: 'studyflow_subjects',
  TASKS: 'studyflow_tasks',
  SESSIONS: 'studyflow_sessions',
  SETTINGS: 'studyflow_settings',
};

const getIsoDateOffset = (daysOffset) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

export const INITIAL_USER = {
  id: 'usr_demo_101',
  name: 'Alex Rivera',
  email: 'alex.rivera@studyflow.edu',
  role: 'Computer Science & Mathematics',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  bio: 'Aiming for Dean’s List this semester. Tracking focus hours daily.',
  weeklyGoalHours: 25,
  dailyGoalMinutes: 180,
  pomodoroFocus: 25,
  pomodoroBreak: 5,
  soundEnabled: true,
  autoStartBreaks: false,
  streak: 7,
};

export const INITIAL_SUBJECTS = [
  {
    id: 'sub_math',
    name: 'Advanced Calculus',
    code: 'MATH-301',
    color: '#3B82F6', // Blue
    targetHours: 7,
    notes: 'Multivariable calculus, vector fields, and surface integrals.',
  },
  {
    id: 'sub_cs',
    name: 'Algorithms & Data Structures',
    code: 'CS-204',
    color: '#10B981', // Emerald
    targetHours: 8,
    notes: 'Graph algorithms, dynamic programming, and complexity proofs.',
  },
  {
    id: 'sub_phys',
    name: 'Quantum & Electromagnetism',
    code: 'PHYS-220',
    color: '#8B5CF6', // Violet
    targetHours: 5,
    notes: 'Maxwell equations, wave interference, and atomic spectra.',
  },
  {
    id: 'sub_chem',
    name: 'Organic Chemistry II',
    code: 'CHEM-240',
    color: '#F59E0B', // Amber
    targetHours: 4,
    notes: 'Synthesis mechanisms, spectroscopy, and reagent reviews.',
  },
  {
    id: 'sub_lit',
    name: 'Critical Thinking & Literature',
    code: 'LIT-110',
    color: '#EC4899', // Pink
    targetHours: 3,
    notes: 'Modernist texts and weekly analytical essays.',
  },
];

export const INITIAL_TASKS = [
  {
    id: 'tsk_1',
    title: 'Complete Problem Set 6: Green’s Theorem',
    subjectId: 'sub_math',
    dueDate: getIsoDateOffset(0), // Today
    priority: 'Urgent',
    status: 'Pending',
    estimatedMinutes: 90,
    notes: 'Exercises 14-26 in Chapter 16. Show all intermediate partial derivatives.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tsk_2',
    title: 'Implement Dijkstra & A* Pathfinding Visualizer',
    subjectId: 'sub_cs',
    dueDate: getIsoDateOffset(1), // Tomorrow
    priority: 'High',
    status: 'In Progress',
    estimatedMinutes: 120,
    notes: 'Finish priority queue implementation and write unit test benchmarks.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tsk_3',
    title: 'Review Electromagnetism Wave Equation Notes',
    subjectId: 'sub_phys',
    dueDate: getIsoDateOffset(2),
    priority: 'Medium',
    status: 'Pending',
    estimatedMinutes: 60,
    notes: 'Summarize Poynting vector calculations for midterm exam prep.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tsk_4',
    title: 'Synthesize Carbonyl Reaction Mechanisms Map',
    subjectId: 'sub_chem',
    dueDate: getIsoDateOffset(3),
    priority: 'High',
    status: 'Pending',
    estimatedMinutes: 75,
    notes: 'Diagram nucleophilic addition vs substitution flowcharts.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tsk_5',
    title: 'Draft 1,000-word Essay on Post-War Fiction',
    subjectId: 'sub_lit',
    dueDate: getIsoDateOffset(4),
    priority: 'Medium',
    status: 'Pending',
    estimatedMinutes: 90,
    notes: 'Outline thesis statement and cite primary text citations.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tsk_6',
    title: 'Read CS Chapter 8: Dynamic Programming Memoization',
    subjectId: 'sub_cs',
    dueDate: getIsoDateOffset(-1), // Yesterday
    priority: 'Low',
    status: 'Completed',
    estimatedMinutes: 45,
    notes: 'Finished reading and notes in markdown notebook.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tsk_7',
    title: 'Math Quiz 3 Preparation & Formula Cheat Sheet',
    subjectId: 'sub_math',
    dueDate: getIsoDateOffset(-2),
    priority: 'High',
    status: 'Completed',
    estimatedMinutes: 60,
    notes: 'Covered divergence theorem equations and unit normal vectors.',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_SESSIONS = [
  {
    id: 'ses_1',
    subjectId: 'sub_cs',
    taskId: 'tsk_2',
    durationMinutes: 75,
    date: getIsoDateOffset(0), // Today
    notes: 'Focused on graph edge relaxation and min-heap debugging.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ses_2',
    subjectId: 'sub_math',
    taskId: 'tsk_1',
    durationMinutes: 60,
    date: getIsoDateOffset(0), // Today
    notes: 'Solved surface integrals on bounded hemisphere.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ses_3',
    subjectId: 'sub_phys',
    taskId: 'tsk_3',
    durationMinutes: 90,
    date: getIsoDateOffset(-1), // Yesterday
    notes: 'Derived electromagnetic plane wave equations in vacuum.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ses_4',
    subjectId: 'sub_cs',
    taskId: 'tsk_6',
    durationMinutes: 80,
    date: getIsoDateOffset(-1),
    notes: 'Dynamic programming matrix chain multiplication problem.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ses_5',
    subjectId: 'sub_chem',
    taskId: 'tsk_4',
    durationMinutes: 50,
    date: getIsoDateOffset(-2),
    notes: 'Aldol condensation reaction pathway analysis.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ses_6',
    subjectId: 'sub_math',
    taskId: 'tsk_7',
    durationMinutes: 95,
    date: getIsoDateOffset(-2),
    notes: 'Intensive formula review and practice exam 2.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ses_7',
    subjectId: 'sub_lit',
    taskId: 'tsk_5',
    durationMinutes: 45,
    date: getIsoDateOffset(-3),
    notes: 'Textual analysis and quote indexing for literature essay.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ses_8',
    subjectId: 'sub_cs',
    taskId: 'tsk_2',
    durationMinutes: 110,
    date: getIsoDateOffset(-4),
    notes: 'Built interactive graph canvas component.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ses_9',
    subjectId: 'sub_phys',
    taskId: 'tsk_3',
    durationMinutes: 60,
    date: getIsoDateOffset(-5),
    notes: 'Worked through Lorentz force practice problems.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ses_10',
    subjectId: 'sub_math',
    taskId: 'tsk_1',
    durationMinutes: 85,
    date: getIsoDateOffset(-6),
    notes: 'Stokes theorem line integral proofs.',
    createdAt: new Date().toISOString(),
  },
];

// Helper functions for reading and writing to localStorage
export function getFromStorage(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing ${key} to storage:`, e);
  }
}

export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn(`Error removing ${key} from storage:`, e);
  }
}

export { STORAGE_KEYS };
