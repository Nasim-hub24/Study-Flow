import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FiPlay,
  FiPause,
  FiRotateCcw,
  FiCheckCircle,
  FiVolume2,
  FiVolumeX,
} from 'react-icons/fi';
import confetti from 'canvas-confetti';
import { formatSecondsToMMSS } from '../../utils/dateUtils';
import { playChimeSound } from '../../utils/sound';
import { useAuth } from '../../context/AuthContext';

const MODES = {
  POMODORO: { id: 'pomodoro', label: 'Pomodoro', defaultMinutes: 25, isBreak: false },
  SHORT_BREAK: { id: 'short_break', label: 'Short Break', defaultMinutes: 5, isBreak: true },
  LONG_BREAK: { id: 'long_break', label: 'Long Break', defaultMinutes: 15, isBreak: true },
  STOPWATCH: { id: 'stopwatch', label: 'Stopwatch (Count Up)', defaultMinutes: 0, isBreak: false },
};

export default function PomodoroTimer({
  subjects = [],
  tasks = [],
  initialSubjectId = '',
  initialTaskId = '',
  onSessionComplete,
}) {
  const { user } = useAuth();

  const [mode, setMode] = useState('pomodoro');
  const [selectedSubjectId, setSelectedSubjectId] = useState(initialSubjectId || subjects[0]?.id || '');
  const [selectedTaskId, setSelectedTaskId] = useState(initialTaskId || '');
  const [soundEnabled, setSoundEnabled] = useState(user?.soundEnabled ?? true);
  const [sessionNotes, setSessionNotes] = useState('');

  // Timer states
  const [totalDurationSeconds, setTotalDurationSeconds] = useState(25 * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  const timerRef = useRef(null);

  // Sync initial props
  useEffect(() => {
    if (initialSubjectId) setSelectedSubjectId(initialSubjectId);
    if (initialTaskId) setSelectedTaskId(initialTaskId);
  }, [initialSubjectId, initialTaskId]);

  // Mode change handler
  const handleModeChange = (newMode) => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    setMode(newMode);

    if (newMode === 'stopwatch') {
      setTotalDurationSeconds(0);
      setRemainingSeconds(0);
    } else {
      const minutes =
        newMode === 'pomodoro'
          ? user?.pomodoroFocus || 25
          : newMode === 'short_break'
          ? user?.pomodoroBreak || 5
          : 15;
      const secs = minutes * 60;
      setTotalDurationSeconds(secs);
      setRemainingSeconds(secs);
    }
  };

  // Timer finished celebration
  const handleTimerFinished = useCallback(() => {
    if (soundEnabled) {
      playChimeSound();
    }
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });

    if (mode === 'pomodoro') {
      const minutesSpent = Math.max(1, Math.round(totalDurationSeconds / 60));
      onSessionComplete({
        subjectId: selectedSubjectId,
        taskId: selectedTaskId || null,
        durationMinutes: minutesSpent,
        notes: sessionNotes || 'Completed Pomodoro Focus Block',
        date: new Date().toISOString().split('T')[0],
      });
      setSessionNotes('');
    }
  }, [soundEnabled, mode, totalDurationSeconds, selectedSubjectId, selectedTaskId, sessionNotes, onSessionComplete]);

  // Timer tick effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        if (mode === 'stopwatch') {
          setRemainingSeconds((prev) => prev + 1);
        } else {
          setRemainingSeconds((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              setIsRunning(false);
              handleTimerFinished();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, mode, handleTimerFinished]);

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    if (mode === 'stopwatch') {
      setRemainingSeconds(0);
    } else {
      setRemainingSeconds(totalDurationSeconds);
    }
  };

  const handleManualFinishAndLog = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);

    const minutesLogged =
      mode === 'stopwatch'
        ? Math.max(1, Math.round(remainingSeconds / 60))
        : Math.max(1, Math.round((totalDurationSeconds - remainingSeconds) / 60));

    if (soundEnabled) playChimeSound();
    confetti({ particleCount: 50 });

    onSessionComplete({
      subjectId: selectedSubjectId,
      taskId: selectedTaskId || null,
      durationMinutes: minutesLogged,
      notes: sessionNotes || `Completed Study Session (${minutesLogged} mins)`,
      date: new Date().toISOString().split('T')[0],
    });

    setSessionNotes('');
    resetTimer();
  };

  const progressPercent =
    mode === 'stopwatch'
      ? Math.min(100, (remainingSeconds / 3600) * 100)
      : totalDurationSeconds > 0
      ? Math.round(((totalDurationSeconds - remainingSeconds) / totalDurationSeconds) * 100)
      : 0;

  const activeSubject = subjects.find((s) => s.id === selectedSubjectId);
  const filteredTasks = tasks.filter((t) => t.status !== 'Completed' && (!selectedSubjectId || t.subjectId === selectedSubjectId));

  return (
    <div className="card bg-base-100 border border-base-200 shadow-xl p-6 sm:p-8 max-w-xl mx-auto">
      <div className="flex bg-base-200 p-1 rounded-2xl gap-1 mb-8">
        {Object.values(MODES).map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => handleModeChange(m.id)}
            className={`flex-1 py-2 px-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
              mode === m.id
                ? 'bg-base-100 text-primary shadow-xs font-bold'
                : 'text-base-content/70 hover:text-base-content'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="relative flex flex-col items-center justify-center py-6">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-base-200 fill-none"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className="fill-none transition-all duration-500 ease-linear"
              stroke={activeSubject?.color || 'var(--color-primary, #4F46E5)'}
              strokeWidth="6"
              strokeDasharray="276.46"
              strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-5xl sm:text-6xl font-black tracking-tight font-mono">
              {formatSecondsToMMSS(remainingSeconds)}
            </span>
            <span className="text-xs uppercase font-bold tracking-widest text-base-content/50 mt-2">
              {mode === 'stopwatch'
                ? 'Elapsed Time'
                : mode === 'short_break' || mode === 'long_break'
                ? 'Break Time'
                : 'Focus Session'}
            </span>
            {activeSubject && (
              <span
                className="mt-2 text-xs font-bold px-2.5 py-0.5 rounded-full border"
                style={{
                  backgroundColor: `${activeSubject.color}15`,
                  borderColor: `${activeSubject.color}40`,
                  color: activeSubject.color,
                }}
              >
                {activeSubject.name}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-8">
          <button
            type="button"
            onClick={resetTimer}
            className="btn btn-circle btn-ghost border border-base-200 hover:bg-base-200"
            title="Reset Timer"
          >
            <FiRotateCcw className="text-lg" />
          </button>

          <button
            type="button"
            onClick={toggleTimer}
            className={`btn btn-circle btn-lg shadow-lg hover:scale-105 transition-transform ${
              isRunning ? 'btn-warning' : 'btn-primary'
            }`}
            title={isRunning ? 'Pause' : 'Start'}
          >
            {isRunning ? (
              <FiPause className="text-2xl" />
            ) : (
              <FiPlay className="text-2xl fill-current translate-x-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setSoundEnabled((prev) => !prev)}
            className="btn btn-circle btn-ghost border border-base-200 hover:bg-base-200"
            title={soundEnabled ? 'Mute Alert Chimes' : 'Enable Alert Chimes'}
          >
            {soundEnabled ? (
              <FiVolume2 className="text-lg text-primary" />
            ) : (
              <FiVolumeX className="text-lg text-base-content/40" />
            )}
          </button>
        </div>

        {(isRunning || remainingSeconds > 0) && (
          <button
            type="button"
            onClick={handleManualFinishAndLog}
            className="btn btn-outline btn-sm rounded-xl mt-6 gap-2 border-base-300 hover:border-success hover:bg-success hover:text-white"
          >
            <FiCheckCircle /> Record & Save Focused Minutes
          </button>
        )}
      </div>

      <div className="pt-6 border-t border-base-200 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="label font-semibold pb-1">Focus Subject</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => {
                setSelectedSubjectId(e.target.value);
                setSelectedTaskId('');
              }}
              className="select select-bordered select-sm w-full"
            >
              <option value="">General Study (No Subject)</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label font-semibold pb-1">Link to Task (Optional)</label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="select select-bordered select-sm w-full"
            >
              <option value="">None (Free study)</option>
              {filteredTasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label font-semibold pb-1 text-xs">Session Reflection / Notes</label>
          <input
            type="text"
            placeholder="e.g. Read 20 pages, worked on problem set..."
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            className="input input-bordered input-sm w-full text-xs"
          />
        </div>
      </div>
    </div>
  );
}
