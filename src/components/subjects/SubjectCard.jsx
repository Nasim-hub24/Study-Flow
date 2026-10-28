import React from 'react';
import { FiBookOpen, FiClock, FiCheckSquare, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { formatTimeMinutes } from '../../utils/dateUtils';

export default function SubjectCard({
  subject,
  tasks = [],
  sessions = [],
  onEdit,
  onDelete,
}) {
  const linkedTasks = tasks.filter((t) => t.subjectId === subject.id);
  const completedTasks = linkedTasks.filter((t) => t.status === 'Completed');
  const linkedSessions = sessions.filter((s) => s.subjectId === subject.id);

  const totalMinutes = linkedSessions.reduce((acc, s) => acc + (Number(s.durationMinutes) || 0), 0);

  return (
    <div
      className="card bg-base-100 border border-base-200 hover:border-primary/40 shadow-xs hover:shadow-md transition-all duration-200 p-5 relative overflow-hidden"
      style={{
        borderTopWidth: '4px',
        borderTopColor: subject.color || '#6366F1',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: subject.color || '#6366F1' }}
            />
            {subject.code && (
              <span className="badge badge-sm badge-ghost font-mono text-[11px]">
                {subject.code}
              </span>
            )}
          </div>
          <h4 className="font-bold text-base text-base-content">{subject.name}</h4>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(subject)}
            aria-label="Edit subject"
            className="btn btn-ghost btn-circle btn-xs"
          >
            <FiEdit2 className="text-xs" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(subject)}
            aria-label="Delete subject"
            className="btn btn-ghost btn-circle btn-xs text-error hover:bg-error/10"
          >
            <FiTrash2 className="text-xs" />
          </button>
        </div>
      </div>

      {subject.notes && (
        <p className="text-xs text-base-content/65 mb-4 line-clamp-2">
          {subject.notes}
        </p>
      )}

      {/* Stats summary */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-base-200 text-xs">
        <div className="flex items-center gap-1.5 text-base-content/75">
          <FiCheckSquare className="text-primary text-xs" />
          <span>
            {completedTasks.length}/{linkedTasks.length} Tasks
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-base-content/75">
          <FiClock className="text-secondary text-xs" />
          <span>{formatTimeMinutes(totalMinutes)} logged</span>
        </div>
      </div>

      {subject.targetHours && (
        <div className="mt-2 text-[11px] text-base-content/50 font-medium">
          Target: {subject.targetHours}h / week
        </div>
      )}
    </div>
  );
}
