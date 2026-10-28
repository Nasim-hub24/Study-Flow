import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiClock,
  FiMoon,
  FiSun,
  FiLogOut,
  FiUser,
  FiSettings,
  FiMenu,
  FiCheckCircle,
  FiBarChart2,
  FiCalendar,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar({ onToggleSidebar }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, changeTheme, availableThemes } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-base-200 bg-base-100/90 backdrop-blur-md px-4 sm:px-6">
      {/* Left side: Hamburger for mobile + Brand */}
      <div className="flex items-center gap-3">
        {isAuthenticated && (
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
            className="btn btn-ghost btn-square btn-sm lg:hidden"
          >
            <FiMenu className="text-xl" />
          </button>
        )}

        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 font-black text-lg">
            S
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              StudyFlow
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-base-content/50 -mt-1 hidden sm:block">
              Student Workspace
            </span>
          </div>
        </Link>
      </div>

      {/* Middle: Desktop Quick Links if authenticated */}
      {isAuthenticated && (
        <nav className="hidden md:flex items-center gap-1 bg-base-200/50 p-1 rounded-xl text-xs font-semibold">
          <Link
            to="/dashboard"
            className={`px-3 py-1.5 rounded-lg transition-all ${
              location.pathname === '/dashboard' ? 'bg-base-100 shadow-xs text-primary' : 'hover:text-primary text-base-content/70'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/tasks"
            className={`px-3 py-1.5 rounded-lg transition-all ${
              location.pathname === '/tasks' ? 'bg-base-100 shadow-xs text-primary' : 'hover:text-primary text-base-content/70'
            }`}
          >
            Tasks & Subjects
          </Link>
          <Link
            to="/sessions"
            className={`px-3 py-1.5 rounded-lg transition-all ${
              location.pathname === '/sessions' ? 'bg-base-100 shadow-xs text-primary' : 'hover:text-primary text-base-content/70'
            }`}
          >
            Study Timer
          </Link>
          <Link
            to="/analytics"
            className={`px-3 py-1.5 rounded-lg transition-all ${
              location.pathname === '/analytics' ? 'bg-base-100 shadow-xs text-primary' : 'hover:text-primary text-base-content/70'
            }`}
          >
            Analytics
          </Link>
          <Link
            to="/planner"
            className={`px-3 py-1.5 rounded-lg transition-all ${
              location.pathname === '/planner' ? 'bg-base-100 shadow-xs text-primary' : 'hover:text-primary text-base-content/70'
            }`}
          >
            Planner & Goals
          </Link>
        </nav>
      )}

      {/* Right side: Controls & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Launch Focus Timer button */}
        {isAuthenticated && (
          <Link
            to="/sessions"
            className="btn btn-primary btn-sm rounded-lg gap-2 shadow-xs hidden sm:inline-flex"
            title="Open Focus Timer"
          >
            <FiClock className="animate-spin-slow" />
            <span>Focus Timer</span>
          </Link>
        )}

        {/* Theme Picker Dropdown */}
        <div className="dropdown dropdown-end">
          <button
            tabIndex={0}
            className="btn btn-ghost btn-circle btn-sm"
            aria-label="Theme selector"
            title={`Current theme: ${theme}`}
          >
            {theme === 'dark' ? <FiMoon className="text-lg text-yellow-300" /> : <FiSun className="text-lg text-amber-500" />}
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow-xl border border-base-200 text-sm mt-2"
          >
            <li className="menu-title text-xs">Choose Appearance</li>
            {availableThemes.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => changeTheme(t.id)}
                  className={`flex items-center justify-between ${theme === t.id ? 'active font-bold' : ''}`}
                >
                  <span className="flex items-center gap-2">
                    <span>{t.icon}</span>
                    <span>{t.name}</span>
                  </span>
                  {theme === t.id && <span className="badge badge-xs badge-primary">Active</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* User Account / Auth buttons */}
        {isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar ring-2 ring-primary/30 ring-offset-2 ring-offset-base-100 btn-sm"
              aria-label="User profile menu"
            >
              <div className="w-8 rounded-full">
                <img
                  src={
                    user?.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'Student')}`
                  }
                  alt={user?.name || 'User avatar'}
                />
              </div>
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-50 w-60 p-3 shadow-xl border border-base-200 text-sm mt-2"
            >
              <div className="px-3 py-2 border-b border-base-200 mb-2">
                <p className="font-bold text-sm truncate">{user?.name || 'Student'}</p>
                <p className="text-xs text-base-content/60 truncate">{user?.email}</p>
                <span className="badge badge-xs badge-primary/20 text-primary mt-1">Student Account</span>
              </div>
              <li>
                <Link to="/settings" className="flex items-center gap-2">
                  <FiSettings /> Settings & Goals
                </Link>
              </li>
              <li>
                <Link to="/tasks" className="flex items-center gap-2">
                  <FiCheckCircle /> My Tasks
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="flex items-center gap-2">
                  <FiBarChart2 /> Study Reports
                </Link>
              </li>
              <div className="divider my-1"></div>
              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-error hover:bg-error/10"
                >
                  <FiLogOut /> Sign Out
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn btn-ghost btn-sm">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
