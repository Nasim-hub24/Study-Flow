import React from 'react';
import { getCurrentWeekDays } from '../../utils/dateUtils';
import { FiClock, FiCalendar } from 'react-icons/fi';

export default function WeeklyCalendar({
  tasks = [],
  sessions = [],
  subjects = [],
  onSelectTask,
}) {
  const weekDays = getCurrentWeekDays();

  // Map subjects for color badges
  const subjectMap = new Map();
  subjects.forEach((s) => subjectMap.set(s.id, s));

  return (
    <div className="card bg-base-100 border border-base-200 shadow-xs p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-base flex items-center gap-2">
            <FiCalendar className="text-primary" /> 7-Day Study Schedule
          </h3>
          <p className="text-xs text-base-content/60">
            Overview of deadlines and study blocks this week
          </p>
        </div>
      </div>

      {/* 7-day columns grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3">
        {weekDays.map((day) => {
          const dayTasks = tasks.filter((t) => t.dueDate === day.date);
          const daySessions = sessions.filter((s) => s.date === day.date);
          const totalDayMinutes = daySessions.reduce(
            (acc, s) => acc + (Number(s.durationMinutes) || 0),
            0
          );

          return (
            <div
              key={day.date}
              className={`rounded-2xl p-3 border flex flex-col min-h-[180px] transition-all ${
                day.isCurrentDay
                  ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                  : 'border-base-200 bg-base-200/20'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between border-b border-base-200/60 pb-2 mb-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider">{day.dayName}</p>
                  <p className="text-[11px] text-base-content/60">{day.formatted}</p>
                </div>
                {day.isCurrentDay && (
                  <span className="badge badge-primary badge-xs font-bold">Today</span>
                )}
              </div>

              {/* Day Study Log Pill */}
              {totalDayMinutes > 0 && (
                <div className="mb-2 text-[10px] font-semibold text-secondary flex items-center gap-1 bg-secondary/10 px-2 py-0.5 rounded-md">
                  <FiClock className="text-[9px]" />
                  <span>{Math.round(totalDayMinutes)}m studied</span>
                </div>
              )}

              {/* Tasks List for the Day */}
              <div className="space-y-1.5 flex-1 overflow-y-auto max-h-48">
                {dayTasks.length === 0 ? (
                  <p className="text-[11px] text-base-content/40 italic text-center py-4">
                    No deadlines
                  </p>
                ) : (
                  dayTasks.map((t) => {
                    const sub = subjectMap.get(t.subjectId);
                    const isDone = t.status === 'Completed';

                    return (
                      <div
                        key={t.id}
                        onClick={() => onSelectTask && onSelectTask(t)}
                        className={`p-2 rounded-xl text-[11px] border cursor-pointer hover:scale-[1.02] transition-transform ${
                          isDone
                            ? 'bg-base-100/70 border-base-200 opacity-60 line-through'
                            : 'bg-base-100 border-base-200 shadow-2xs'
                        }`}
                        style={{
                          borderLeftWidth: '3px',
                          borderLeftColor: sub?.color || '#6366F1',
                        }}
                      >
                        <p className="font-semibold line-clamp-2 leading-tight">{t.title}</p>
                        {sub && (
                          <span className="text-[9px] text-base-content/60 mt-1 block">
                            {sub.name}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
