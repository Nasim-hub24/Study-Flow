import React from 'react';
import { FiCheckCircle, FiClock, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';

export default function CompletionTrendChart({
  tasks = [],
  completionRate = 0,
}) {
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const pending = tasks.filter((t) => t.status === 'Pending').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const urgent = tasks.filter((t) => t.priority === 'Urgent' && t.status !== 'Completed').length;

  return (
    <div className="card bg-base-100 border border-base-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base">Task Velocity & Completion</h3>
          <p className="text-xs text-base-content/60">Execution rate across current tasks</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-success">
          <FiTrendingUp />
          <span>{completionRate}% Rate</span>
        </div>
      </div>

      {/* Large visual progress bar */}
      <div className="space-y-2">
        <div className="w-full bg-base-200 h-4 rounded-full overflow-hidden flex">
          <div
            className="bg-success transition-all duration-500"
            style={{ width: `${tasks.length ? (completed / tasks.length) * 100 : 0}%` }}
            title={`Completed: ${completed}`}
          />
          <div
            className="bg-secondary transition-all duration-500"
            style={{ width: `${tasks.length ? (inProgress / tasks.length) * 100 : 0}%` }}
            title={`In Progress: ${inProgress}`}
          />
          <div
            className="bg-base-300 transition-all duration-500"
            style={{ width: `${tasks.length ? (pending / tasks.length) * 100 : 0}%` }}
            title={`Pending: ${pending}`}
          />
        </div>

        <div className="flex justify-between text-[11px] text-base-content/60">
          <span>{completed} completed</span>
          <span>{inProgress} active</span>
          <span>{pending} pending</span>
        </div>
      </div>

      {/* Grid of key performance indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="p-3 bg-base-200/50 rounded-xl text-center">
          <p className="text-[10px] uppercase font-bold text-base-content/50">Total Tasks</p>
          <p className="text-xl font-black text-base-content mt-0.5">{tasks.length}</p>
        </div>

        <div className="p-3 bg-success/10 rounded-xl text-center">
          <p className="text-[10px] uppercase font-bold text-success">Done</p>
          <p className="text-xl font-black text-success mt-0.5">{completed}</p>
        </div>

        <div className="p-3 bg-secondary/10 rounded-xl text-center">
          <p className="text-[10px] uppercase font-bold text-secondary">In Progress</p>
          <p className="text-xl font-black text-secondary mt-0.5">{inProgress}</p>
        </div>

        <div className="p-3 bg-error/10 rounded-xl text-center">
          <p className="text-[10px] uppercase font-bold text-error">Urgent</p>
          <p className="text-xl font-black text-error mt-0.5">{urgent}</p>
        </div>
      </div>
    </div>
  );
}
