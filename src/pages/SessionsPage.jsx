import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  FiClock,
  FiPlus,
  FiTrash2,
  FiCalendar,
  FiFileText,
  FiCheckCircle,
  FiBarChart2,
} from 'react-icons/fi';
import { useData } from '../context/DataContext';
import PomodoroTimer from '../components/timer/PomodoroTimer';
import ManualSessionModal from '../components/timer/ManualSessionModal';
import ConfirmModal from '../components/common/ConfirmModal';
import { formatDate, formatTimeMinutes } from '../utils/dateUtils';

export default function SessionsPage() {
  const { subjects, tasks, sessions, logSession, deleteSession, metrics } = useData();
  const location = useLocation();

  const initialSubjectId = location.state?.selectedSubjectId || '';
  const initialTaskId = location.state?.selectedTaskId || '';

  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [confirmDeleteSession, setConfirmDeleteSession] = useState(null);
  const [subjectFilter, setSubjectFilter] = useState('ALL');

  const handleSessionRecorded = async (sessionData) => {
    await logSession(sessionData);
  };

  const handleDeleteSession = async () => {
    if (confirmDeleteSession) {
      await deleteSession(confirmDeleteSession.id);
      setConfirmDeleteSession(null);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    if (subjectFilter !== 'ALL' && s.subjectId !== subjectFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Study Timer & Session Log
          </h1>
          <p className="text-xs sm:text-sm text-base-content/60 mt-1">
            Focus with structured Pomodoro intervals or record completed study time
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsManualModalOpen(true)}
          className="btn btn-outline btn-sm rounded-xl gap-2 self-start sm:self-auto border-base-300"
        >
          <FiPlus /> Log Manual Session
        </button>
      </div>

      <PomodoroTimer
        subjects={subjects}
        tasks={tasks}
        initialSubjectId={initialSubjectId}
        initialTaskId={initialTaskId}
        onSessionComplete={handleSessionRecorded}
      />

      <div className="card bg-base-100 border border-base-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              <FiClock className="text-primary" /> Session History ({sessions.length})
            </h3>
            <p className="text-xs text-base-content/60">
              Total focus time logged across all courses: {metrics?.weekStudyHours || 0} hours this week
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-base-content/60">Filter:</span>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="select select-bordered select-xs sm:select-sm text-xs"
            >
              <option value="ALL">All Subjects</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <div className="text-3xl">⏱️</div>
            <p className="text-sm font-semibold">No study sessions recorded yet</p>
            <p className="text-xs text-base-content/60">
              Start a timer above or log a manual session to start tracking your study history!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 sm:mx-0">
            <table className="table table-zebra table-sm sm:table-md w-full text-xs">
              <thead>
                <tr className="border-b border-base-200 text-base-content/60">
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Duration</th>
                  <th>Linked Task / Topic</th>
                  <th>Notes</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((ses) => {
                  const sub = metrics.subjectMap.get(ses.subjectId);
                  const linkedTask = tasks.find((t) => t.id === ses.taskId);

                  return (
                    <tr key={ses.id} className="hover">
                      <td className="font-mono text-base-content/80 whitespace-nowrap">
                        {formatDate(ses.date)}
                      </td>
                      <td>
                        {sub ? (
                          <span
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-semibold text-[11px] border"
                            style={{
                              backgroundColor: `${sub.color}15`,
                              borderColor: `${sub.color}40`,
                              color: sub.color,
                            }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: sub.color }}
                            />
                            {sub.name}
                          </span>
                        ) : (
                          <span className="text-base-content/50 italic">General Study</span>
                        )}
                      </td>
                      <td className="font-bold text-primary font-mono whitespace-nowrap">
                        {formatTimeMinutes(ses.durationMinutes)}
                      </td>
                      <td className="max-w-xs truncate">
                        {linkedTask ? (
                          <span className="font-medium">{linkedTask.title}</span>
                        ) : (
                          <span className="text-base-content/40 italic">—</span>
                        )}
                      </td>
                      <td className="max-w-xs truncate text-base-content/70">
                        {ses.notes || '—'}
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteSession(ses)}
                          className="btn btn-ghost btn-circle btn-xs text-error hover:bg-error/10"
                          title="Delete session"
                        >
                          <FiTrash2 className="text-xs" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ManualSessionModal
        isOpen={isManualModalOpen}
        subjects={subjects}
        tasks={tasks}
        onClose={() => setIsManualModalOpen(false)}
        onSave={handleSessionRecorded}
      />

      <ConfirmModal
        isOpen={!!confirmDeleteSession}
        title="Delete Study Session"
        message="Are you sure you want to remove this logged study session from your history?"
        confirmText="Delete Session"
        onConfirm={handleDeleteSession}
        onCancel={() => setConfirmDeleteSession(null)}
      />
    </div>
  );
}
