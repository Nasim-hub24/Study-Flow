import React from 'react';
import {
  FiCalendar,
  FiClock,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiPlay,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getRelativeDays, isOverdue } from '../../utils/dateUtils';

const PRIORITY_STYLES = {
  Urgent: 'badge-error text-white font-bold',
  High: 'badge-warning font-semibold',
  Medium: 'badge-info font-medium',
  Low: 'badge-ghost text-base-content/70',
};

export default function TaskCard({
  task,
  subject,
  onToggleComplete,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();
  const isCompleted = task.status === 'Completed';
  const relativeDate = getRelativeDays(task.dueDate);
  const overdue = !isCompleted && isOverdue(task.dueDate);

  const startTaskFocus = () => {
    // Navigate to sessions page with this task and subject preselected
    navigate('/sessions', {
      state: { selectedTaskId: task.id, selectedSubjectId: task.subjectId },
    });
  };

  return (
    <div
      className={`card bg-base-100 border transition-all duration-200 hover:shadow-md p-4 group ${
        isCompleted
          ? 'border-base-200/60 bg-base-200/20 opacity-75'
          : overdue
          ? 'border-error/40 hover:border-error'
          : 'border-base-200 hover:border-primary/40'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Completion Checkbox */}
        <button
          type="button"
          onClick={() => onToggleComplete(task.id)}
          aria-label={isCompleted ? 'Mark task as pending' : 'Mark task as completed'}
          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all mt-0.5 shrink-0 ${
            isCompleted
              ? 'bg-success text-success-content ring-2 ring-success/30'
              : 'border-2 border-base-300 hover:border-primary hover:bg-primary/10 text-transparent'
          }`}
        >
          <FiCheck className={`text-sm ${isCompleted ? 'block' : 'opacity-0'}`} />
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {/* Subject pill */}
            {subject && (
              <span
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border"
                style={{
                  backgroundColor: `${subject.color || '#6366F1'}15`,
                  borderColor: `${subject.color || '#6366F1'}40`,
                  color: subject.color || '#6366F1',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: subject.color || '#6366F1' }}
                />
                {subject.name}
              </span>
            )}

            {/* Priority badge */}
            <span className={`badge badge-xs text-[10px] ${PRIORITY_STYLES[task.priority] || 'badge-ghost'}`}>
              {task.priority || 'Medium'}
            </span>

            {/* Status indicator if in progress */}
            {task.status === 'In Progress' && (
              <span className="badge badge-xs badge-secondary font-medium">In Progress</span>
            )}
          </div>

          {/* Task Title */}
          <h4
            className={`font-semibold text-sm leading-snug break-words ${
              isCompleted ? 'line-through text-base-content/50' : 'text-base-content'
            }`}
          >
            {task.title}
          </h4>

          {/* Task Notes / Description */}
          {task.notes && (
            <p className="text-xs text-base-content/65 line-clamp-2 mt-1 font-normal">
              {task.notes}
            </p>
          )}

          {/* Footer Meta: Due date & Estimated Time */}
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-base-content/60">
            {task.dueDate && (
              <span
                className={`flex items-center gap-1.5 font-medium ${
                  overdue ? 'text-error font-semibold' : relativeDate === 'Today' ? 'text-warning font-semibold' : ''
                }`}
              >
                <FiCalendar className="text-xs" />
                <span>{relativeDate}</span>
              </span>
            )}

            {task.estimatedMinutes && (
              <span className="flex items-center gap-1">
                <FiClock className="text-xs" />
                <span>{task.estimatedMinutes}m est.</span>
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          {!isCompleted && (
            <button
              type="button"
              onClick={startTaskFocus}
              className="btn btn-ghost btn-circle btn-xs text-primary hover:bg-primary/10"
              title="Start Focus Timer for this task"
            >
              <FiPlay className="text-xs fill-current" />
            </button>
          )}

          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              className="btn btn-ghost btn-circle btn-xs"
              aria-label="Task options"
            >
              <FiMoreVertical />
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-20 w-36 p-1.5 shadow-xl border border-base-200 text-xs"
            >
              <li>
                <button type="button" onClick={() => onEdit(task)}>
                  <FiEdit2 className="text-xs" /> Edit Task
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onDelete(task)}
                  className="text-error hover:bg-error/10"
                >
                  <FiTrash2 className="text-xs" /> Delete Task
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
