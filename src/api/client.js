// API client with resilient remote backend support and graceful local fallback
import {
  getFromStorage,
  saveToStorage,
  STORAGE_KEYS,
  INITIAL_USER,
  INITIAL_SUBJECTS,
  INITIAL_TASKS,
  INITIAL_SESSIONS,
} from '../utils/storage';

const API_BASE = '/api';

// Helper to make fetch requests
async function fetchWithTimeout(url, options = {}, timeoutMs = 4000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const token = getFromStorage(STORAGE_KEYS.TOKEN, null);
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// ----------------- AUTH API -----------------
export const authAPI = {
  async register({ name, email, password }) {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/auth/register`, {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.token) saveToStorage(STORAGE_KEYS.TOKEN, data.token);
        const user = data.data || data.user || { name, email, id: `usr_${Date.now()}` };
        saveToStorage(STORAGE_KEYS.USER, user);
        return { success: true, user, token: data.token };
      }
      // If server returned structured error
      if (!res.ok && res.status !== 500) {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (err) {
      if (err.message && !err.message.includes('fetch') && !err.message.includes('abort')) {
        throw err;
      }
      console.warn('Backend unavailable, using client mode for registration:', err.message);
    }

    // Resilient fallback: Create user in local storage
    const newUser = {
      ...INITIAL_USER,
      id: `usr_${Date.now()}`,
      name: name || 'Student',
      email: email,
      createdAt: new Date().toISOString(),
    };
    const mockToken = `token_demo_${Date.now()}`;
    saveToStorage(STORAGE_KEYS.USER, newUser);
    saveToStorage(STORAGE_KEYS.TOKEN, mockToken);
    return { success: true, user: newUser, token: mockToken, isFallback: true };
  },

  async login({ email, password }) {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.token) saveToStorage(STORAGE_KEYS.TOKEN, data.token);
        const user = data.data || data.user || { email, id: `usr_${Date.now()}` };
        saveToStorage(STORAGE_KEYS.USER, user);
        return { success: true, user, token: data.token };
      }
      if (!res.ok && res.status !== 500) {
        throw new Error(data.message || 'Invalid credentials');
      }
    } catch (err) {
      if (err.message && !err.message.includes('fetch') && !err.message.includes('abort')) {
        throw err;
      }
      console.warn('Backend unavailable or cold-starting, authenticating in demo mode');
    }

    // Demo/Fallback login
    const existing = getFromStorage(STORAGE_KEYS.USER, INITIAL_USER);
    const user = {
      ...existing,
      email: email || existing.email,
    };
    const mockToken = `token_demo_${Date.now()}`;
    saveToStorage(STORAGE_KEYS.USER, user);
    saveToStorage(STORAGE_KEYS.TOKEN, mockToken);
    return { success: true, user, token: mockToken, isFallback: true };
  },

  async getMe() {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/auth/me`);
      const data = await res.json();
      if (res.ok && data.success) {
        const user = data.data || data.user;
        saveToStorage(STORAGE_KEYS.USER, user);
        return user;
      }
    } catch {
      // Backend unavailable or token expired
    }
    return getFromStorage(STORAGE_KEYS.USER, INITIAL_USER);
  },

  async logout() {
    try {
      await fetchWithTimeout(`${API_BASE}/auth/logout`, { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    }
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    return { success: true };
  },

  async updateProfile(updates) {
    const current = getFromStorage(STORAGE_KEYS.USER, INITIAL_USER);
    const updated = { ...current, ...updates };
    saveToStorage(STORAGE_KEYS.USER, updated);
    return { success: true, user: updated };
  },
};

// ----------------- SUBJECTS API -----------------
export const subjectsAPI = {
  async getAll() {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/subjects`);
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        saveToStorage(STORAGE_KEYS.SUBJECTS, data.data);
        return data.data;
      }
    } catch {
      // Remote failed, read from local storage
    }
    let local = getFromStorage(STORAGE_KEYS.SUBJECTS, null);
    if (!local || local.length === 0) {
      local = INITIAL_SUBJECTS;
      saveToStorage(STORAGE_KEYS.SUBJECTS, local);
    }
    return local;
  },

  async create(subjectData) {
    const newSubject = {
      ...subjectData,
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetchWithTimeout(`${API_BASE}/subjects`, {
        method: 'POST',
        body: JSON.stringify(subjectData),
      });
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        newSubject.id = data.data.id || data.data._id || newSubject.id;
      }
    } catch {
      // Local fallback
    }

    const current = getFromStorage(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
    const updated = [newSubject, ...current];
    saveToStorage(STORAGE_KEYS.SUBJECTS, updated);
    return newSubject;
  },

  async update(id, updates) {
    try {
      await fetchWithTimeout(`${API_BASE}/subjects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch {
      // Fallback
    }

    const current = getFromStorage(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
    const updated = current.map((sub) => (sub.id === id ? { ...sub, ...updates } : sub));
    saveToStorage(STORAGE_KEYS.SUBJECTS, updated);
    return updated.find((s) => s.id === id);
  },

  async delete(id) {
    try {
      await fetchWithTimeout(`${API_BASE}/subjects/${id}`, {
        method: 'DELETE',
      });
    } catch {
      // Fallback
    }

    const current = getFromStorage(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
    const updated = current.filter((sub) => sub.id !== id);
    saveToStorage(STORAGE_KEYS.SUBJECTS, updated);
    return { success: true };
  },
};

// ----------------- TASKS API -----------------
export const tasksAPI = {
  async getAll() {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/tasks`);
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        saveToStorage(STORAGE_KEYS.TASKS, data.data);
        return data.data;
      }
    } catch {
      // Local fallback
    }
    let local = getFromStorage(STORAGE_KEYS.TASKS, null);
    if (!local || local.length === 0) {
      local = INITIAL_TASKS;
      saveToStorage(STORAGE_KEYS.TASKS, local);
    }
    return local;
  },

  async create(taskData) {
    const newTask = {
      ...taskData,
      id: `tsk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: taskData.status || 'Pending',
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetchWithTimeout(`${API_BASE}/tasks`, {
        method: 'POST',
        body: JSON.stringify(taskData),
      });
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        newTask.id = data.data.id || data.data._id || newTask.id;
      }
    } catch {
      // Local fallback
    }

    const current = getFromStorage(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    const updated = [newTask, ...current];
    saveToStorage(STORAGE_KEYS.TASKS, updated);
    return newTask;
  },

  async update(id, updates) {
    try {
      await fetchWithTimeout(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch {
      // Local fallback
    }

    const current = getFromStorage(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    const updated = current.map((t) => (t.id === id ? { ...t, ...updates } : t));
    saveToStorage(STORAGE_KEYS.TASKS, updated);
    return updated.find((t) => t.id === id);
  },

  async delete(id) {
    try {
      await fetchWithTimeout(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
      });
    } catch {
      // Local fallback
    }

    const current = getFromStorage(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    const updated = current.filter((t) => t.id !== id);
    saveToStorage(STORAGE_KEYS.TASKS, updated);
    return { success: true };
  },
};

// ----------------- SESSIONS API -----------------
export const sessionsAPI = {
  async getAll() {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/sessions`);
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        saveToStorage(STORAGE_KEYS.SESSIONS, data.data);
        return data.data;
      }
    } catch {
      // Fallback
    }
    let local = getFromStorage(STORAGE_KEYS.SESSIONS, null);
    if (!local || local.length === 0) {
      local = INITIAL_SESSIONS;
      saveToStorage(STORAGE_KEYS.SESSIONS, local);
    }
    return local;
  },

  async create(sessionData) {
    const newSession = {
      ...sessionData,
      id: `ses_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetchWithTimeout(`${API_BASE}/sessions`, {
        method: 'POST',
        body: JSON.stringify(sessionData),
      });
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        newSession.id = data.data.id || data.data._id || newSession.id;
      }
    } catch {
      // Local fallback
    }

    const current = getFromStorage(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);
    const updated = [newSession, ...current];
    saveToStorage(STORAGE_KEYS.SESSIONS, updated);
    return newSession;
  },

  async delete(id) {
    try {
      await fetchWithTimeout(`${API_BASE}/sessions/${id}`, {
        method: 'DELETE',
      });
    } catch {
      // Fallback
    }

    const current = getFromStorage(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);
    const updated = current.filter((s) => s.id !== id);
    saveToStorage(STORAGE_KEYS.SESSIONS, updated);
    return { success: true };
  },
};
