import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiCheckSquare,
  FiClock,
  FiBarChart2,
  FiCalendar,
  FiSettings,
  FiZap,
  FiX,
  FiBookOpen,
} from 'react-icons/fi';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
  { name: 'Tasks & Subjects', path: '/tasks', icon: FiCheckSquare },
  { name: 'Study Timer', path: '/sessions', icon: FiClock },
  { name: 'Progress Analytics', path: '/analytics', icon: FiBarChart2 },
  { name: 'Planner & Goals', path: '/planner', icon: FiCalendar },
  { name: 'Settings', path: '/settings', icon: FiSettings },
];

export default function Sidebar({ isOpen, onClose }) {
  const { metrics } = useData();
  const { user } = useAuth();

  const goalHours = user?.weeklyGoalHours || 20;
  const currentHours = metrics?.weekStudyHours || 0;
  const goalPercent = Math.min(Math.round((currentHours / goalHours) * 100), 100);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden animate-fadeIn"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-base-100 border-r border-base-200 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-200 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-content flex items-center justify-center font-bold">
              S
            </div>
            <span className="font-bold text-lg">StudyFlow</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="btn btn-ghost btn-circle btn-sm"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Main Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-base-content/50 px-3 pb-2">
            Workspace
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-primary text-primary-content shadow-xs font-semibold'
                      : 'text-base-content/80 hover:bg-base-200 hover:text-base-content'
                  }`
                }
              >
                <Icon className="text-lg shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Study Streak & Weekly Progress Box */}
        <div className="p-4 border-t border-base-200 bg-base-200/40 m-3 rounded-2xl space-y-3">
          {/* Active Streak */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔥</span>
              <div>
                <p className="text-xs font-bold leading-none">{metrics?.streak || 1} Day Streak</p>
                <p className="text-[10px] text-base-content/60">Keep the momentum!</p>
              </div>
            </div>
            <span className="badge badge-warning badge-sm font-semibold">Active</span>
          </div>

          {/* Weekly Study Hours Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-base-content/70">Weekly Goal</span>
              <span className="font-bold">
                {currentHours} / {goalHours}h
              </span>
            </div>
            <div className="w-full bg-base-300 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                style={{ width: `${goalPercent}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-right text-base-content/50 font-medium">
              {goalPercent}% completed
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
