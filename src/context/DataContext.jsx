import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import confetti from 'canvas-confetti';
import { subjectsAPI, tasksAPI, sessionsAPI } from '../api/client';
import { isToday, getCurrentWeekDays } from '../utils/dateUtils';
import {
  saveToStorage,
  STORAGE_KEYS,
  INITIAL_SUBJECTS,
  INITIAL_TASKS,
  INITIAL_SESSIONS,
} from '../utils/storage';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [subjects, setSubjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [fetchedSubjects, fetchedTasks, fetchedSessions] = await Promise.all([
        subjectsAPI.getAll(),
        tasksAPI.getAll(),
        sessionsAPI.getAll(),
      ]);
      setSubjects(fetchedSubjects);
      setTasks(fetchedTasks);
      setSessions(fetchedSessions);
    } catch (err) {
      console.error('Failed loading data:', err);
      toast.error('Unable to fetch latest data. Offline mode active.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // ----------------- SUBJECTS ACTIONS -----------------
  const addSubject = async (subjectData) => {
    try {
      const created = await subjectsAPI.create(subjectData);
      setSubjects((prev) => [created, ...prev]);
      toast.success(`Subject "${created.name}" created! 📚`);
      return { success: true, subject: created };
    } catch (err) {
      toast.error(err.message || 'Failed to create subject');
      return { success: false };
    }
  };

  const editSubject = async (id, updates) => {
    try {
      const updated = await subjectsAPI.update(id, updates);
      setSubjects((prev) => prev.map((s) => (s.id === id ? updated : s)));
      toast.success('Subject updated successfully!');
      return { success: true, subject: updated };
    } catch (err) {
      toast.error(err.message || 'Failed to update subject');
      return { success: false };
    }
  };

  const deleteSubject = async (id) => {
    try {
      await subjectsAPI.delete(id);
      setSubjects((prev) => prev.filter((s) => s.id !== id));
      toast.success('Subject deleted successfully.');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to delete subject');
      return { success: false };
    }
  };

  // ----------------- TASKS ACTIONS -----------------
  const addTask = async (taskData) => {
    try {
      const created = await tasksAPI.create(taskData);
      setTasks((prev) => [created, ...prev]);
      toast.success(`Task "${created.title}" added! 🎯`);
      return { success: true, task: created };
    } catch (err) {
      toast.error(err.message || 'Failed to add task');
      return { success: false };
    }
  };

  const editTask = async (id, updates) => {
    try {
      const updated = await tasksAPI.update(id, updates);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      toast.success('Task updated successfully!');
      return { success: true, task: updated };
    } catch (err) {
      toast.error(err.message || 'Failed to update task');
      return { success: false };
    }
  };

  const deleteTask = async (id) => {
    try {
      await tasksAPI.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success('Task removed.');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to delete task');
      return { success: false };
    }
  };

  const toggleTaskComplete = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const isNowCompleted = task.status !== 'Completed';
    const newStatus = isNowCompleted ? 'Completed' : 'Pending';

    try {
      const updated = await tasksAPI.update(id, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));

      if (isNowCompleted) {
        toast.success(`Task completed! Great job! ✨`);
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4F46E5', '#10B981', '#F59E0B', '#EC4899'],
        });
      } else {
        toast.info(`Task marked as pending.`);
      }
    } catch {
      toast.error('Failed to update task status.');
    }
  };

  // ----------------- SESSIONS ACTIONS -----------------
  const logSession = async (sessionData) => {
    try {
      const created = await sessionsAPI.create(sessionData);
      setSessions((prev) => [created, ...prev]);
      toast.success(`Logged ${sessionData.durationMinutes} minutes of focused study! ⏱️`);
      return { success: true, session: created };
    } catch (err) {
      toast.error(err.message || 'Failed to log session');
      return { success: false };
    }
  };

  const deleteSession = async (id) => {
    try {
      await sessionsAPI.delete(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      toast.success('Study session deleted.');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to delete session');
      return { success: false };
    }
  };

  // Reset to default seed data
  const resetToSampleData = () => {
    saveToStorage(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
    saveToStorage(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    saveToStorage(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);
    setSubjects(INITIAL_SUBJECTS);
    setTasks(INITIAL_TASKS);
    setSessions(INITIAL_SESSIONS);
    toast.success('Reset to rich demo data! 🔄');
  };

  // ----------------- COMPUTED METRICS -----------------
  const metrics = useMemo(() => {
    // Subject map for fast lookups
    const subjectMap = new Map();
    subjects.forEach((s) => subjectMap.set(s.id, s));

    // Tasks breakdown
    const pendingTasks = tasks.filter((t) => t.status !== 'Completed');
    const completedTasks = tasks.filter((t) => t.status === 'Completed');
    const todayTasks = tasks.filter((t) => isToday(t.dueDate) && t.status !== 'Completed');

    // Next 7 days upcoming tasks
    const now = new Date();
    const in7Days = new Date();
    in7Days.setDate(now.getDate() + 7);
    const upcomingDeadlines = pendingTasks.filter((t) => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return d >= now && d <= in7Days;
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    // Weekly study sessions
    const weekDays = getCurrentWeekDays();
    const weekDateSet = new Set(weekDays.map((d) => d.date));

    let weekStudyMinutes = 0;
    const dailyMinutesMap = {};
    weekDays.forEach((d) => {
      dailyMinutesMap[d.date] = 0;
    });

    sessions.forEach((s) => {
      if (s.date && weekDateSet.has(s.date)) {
        weekStudyMinutes += Number(s.durationMinutes) || 0;
        dailyMinutesMap[s.date] = (dailyMinutesMap[s.date] || 0) + (Number(s.durationMinutes) || 0);
      }
    });

    const dailyChartData = weekDays.map((d) => ({
      day: d.dayName,
      date: d.formatted,
      hours: Number(((dailyMinutesMap[d.date] || 0) / 60).toFixed(1)),
      minutes: dailyMinutesMap[d.date] || 0,
      isCurrentDay: d.isCurrentDay,
    }));

    // Subject study breakdown
    const subjectMinutesMap = {};
    sessions.forEach((s) => {
      const subId = s.subjectId || 'other';
      subjectMinutesMap[subId] = (subjectMinutesMap[subId] || 0) + (Number(s.durationMinutes) || 0);
    });

    const subjectChartData = subjects.map((sub) => {
      const mins = subjectMinutesMap[sub.id] || 0;
      return {
        id: sub.id,
        name: sub.name,
        code: sub.code || '',
        color: sub.color || '#6366F1',
        minutes: mins,
        hours: Number((mins / 60).toFixed(1)),
      };
    }).filter((item) => item.minutes > 0 || subjects.length <= 4);

    // Calculate active streak
    const sessionDates = new Set(sessions.map((s) => s.date).filter(Boolean));
    let streak = 0;
    const checkDate = new Date();
    // Check if studied today
    const todayStr = checkDate.toISOString().split('T')[0];
    if (sessionDates.has(todayStr)) {
      streak++;
    }
    // Check previous days
    for (let i = 1; i <= 30; i++) {
      const prevDate = new Date();
      prevDate.setDate(prevDate.getDate() - i);
      const prevStr = prevDate.toISOString().split('T')[0];
      if (sessionDates.has(prevStr)) {
        streak++;
      } else {
        break;
      }
    }

    const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

    return {
      subjectMap,
      pendingTasks,
      completedTasks,
      todayTasks,
      upcomingDeadlines,
      weekStudyMinutes,
      weekStudyHours: Number((weekStudyMinutes / 60).toFixed(1)),
      dailyChartData,
      subjectChartData,
      streak: Math.max(streak, 1),
      completionRate,
    };
  }, [subjects, tasks, sessions]);

  return (
    <DataContext.Provider
      value={{
        subjects,
        tasks,
        sessions,
        isLoading,
        loadAllData,
        // Subject actions
        addSubject,
        editSubject,
        deleteSubject,
        // Task actions
        addTask,
        editTask,
        deleteTask,
        toggleTaskComplete,
        // Session actions
        logSession,
        deleteSession,
        // Utilities
        resetToSampleData,
        metrics,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
