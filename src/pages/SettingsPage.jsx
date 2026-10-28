import React, { useState } from 'react';
import {
  FiUser,
  FiMoon,
  FiSun,
  FiBell,
  FiClock,
  FiTarget,
  FiSave,
  FiRefreshCw,
  FiDownload,
  FiTrash2,
  FiShield,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import ConfirmModal from '../components/common/ConfirmModal';

export default function SettingsPage() {
  const { user, updateProfile, logout } = useAuth();
  const { theme, changeTheme, availableThemes } = useTheme();
  const { resetToSampleData, tasks, subjects, sessions } = useData();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    weeklyGoalHours: user?.weeklyGoalHours || 20,
    dailyGoalMinutes: user?.dailyGoalMinutes || 180,
    pomodoroFocus: user?.pomodoroFocus || 25,
    pomodoroBreak: user?.pomodoroBreak || 5,
    soundEnabled: user?.soundEnabled ?? true,
    autoStartBreaks: user?.autoStartBreaks ?? false,
  });

  const [saving, setSaving] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile(profileData);
    setSaving(false);
  };

  const handleExportData = () => {
    const exportObj = {
      user,
      subjects,
      tasks,
      sessions,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studyflow_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Study data exported successfully! 📁');
  };

  const handleResetData = () => {
    resetToSampleData();
    setIsResetConfirmOpen(false);
  };

  const handleDeleteAccount = async () => {
    setIsDeleteAccountOpen(false);
    await logout();
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Settings & Account Preferences
        </h1>
        <p className="text-xs sm:text-sm text-base-content/60 mt-1">
          Customize your study experience, theme appearance, and focus timer settings
        </p>
      </div>

      <form onSubmit={handleProfileSubmit} className="space-y-6">
        <div className="card bg-base-100 border border-base-200 shadow-xs p-6 space-y-4">
          <h3 className="font-bold text-base flex items-center gap-2 border-b border-base-200 pb-3">
            <FiUser className="text-primary" /> Profile Details
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6 pb-2">
            <div className="avatar">
              <div className="w-20 h-20 rounded-2xl ring-2 ring-primary/30 ring-offset-2 ring-offset-base-100 overflow-hidden shadow-md">
                <img
                  src={
                    profileData.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      profileData.name || 'Student'
                    )}`
                  }
                  alt={profileData.name}
                />
              </div>
            </div>

            <div className="flex-1 space-y-1 text-center sm:text-left">
              <p className="font-bold text-base">{profileData.name || 'Student'}</p>
              <p className="text-xs text-base-content/60">{profileData.email}</p>
              <p className="text-xs text-primary font-medium">{profileData.role || 'Active Learner'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="label font-medium pb-1">Full Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="input input-bordered input-sm sm:input-md w-full"
                required
              />
            </div>

            <div>
              <label className="label font-medium pb-1">Major / Program / Focus</label>
              <input
                type="text"
                placeholder="e.g. Computer Science & Math"
                value={profileData.role}
                onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                className="input input-bordered input-sm sm:input-md w-full"
              />
            </div>
          </div>

          <div>
            <label className="label font-medium pb-1 text-xs">Avatar URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={profileData.avatar}
              onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
              className="input input-bordered input-sm sm:input-md w-full text-xs"
            />
          </div>

          <div>
            <label className="label font-medium pb-1 text-xs">Bio / Academic Target</label>
            <textarea
              rows="2"
              placeholder="e.g. Preparing for GRE and maintaining high GPA..."
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              className="textarea textarea-bordered w-full text-xs"
            ></textarea>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-xs p-6 space-y-4">
          <h3 className="font-bold text-base flex items-center gap-2 border-b border-base-200 pb-3">
            <FiMoon className="text-secondary" /> Appearance & Theme
          </h3>
          <p className="text-xs text-base-content/60">
            Select your preferred visual style. Changes apply immediately and are persisted for your account.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {availableThemes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => changeTheme(t.id)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                  theme === t.id
                    ? 'border-primary ring-2 ring-primary/30 bg-primary/10 font-bold'
                    : 'border-base-200 hover:border-base-300 bg-base-100'
                }`}
              >
                <span className="text-2xl">{t.icon}</span>
                <span className="text-xs">{t.name}</span>
                {theme === t.id && (
                  <span className="badge badge-primary badge-xs">Active</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-xs p-6 space-y-4">
          <h3 className="font-bold text-base flex items-center gap-2 border-b border-base-200 pb-3">
            <FiClock className="text-accent" /> Focus Timer & Goal Defaults
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="label font-medium pb-1">Weekly Study Target (Hours)</label>
              <input
                type="number"
                min="1"
                max="80"
                value={profileData.weeklyGoalHours}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    weeklyGoalHours: Number(e.target.value) || 1,
                  })
                }
                className="input input-bordered input-sm sm:input-md w-full"
              />
            </div>

            <div>
              <label className="label font-medium pb-1">Daily Study Target (Minutes)</label>
              <input
                type="number"
                min="10"
                step="15"
                value={profileData.dailyGoalMinutes}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    dailyGoalMinutes: Number(e.target.value) || 10,
                  })
                }
                className="input input-bordered input-sm sm:input-md w-full"
              />
            </div>

            <div>
              <label className="label font-medium pb-1">Pomodoro Focus Block (Minutes)</label>
              <input
                type="number"
                min="5"
                max="90"
                value={profileData.pomodoroFocus}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    pomodoroFocus: Number(e.target.value) || 5,
                  })
                }
                className="input input-bordered input-sm sm:input-md w-full"
              />
            </div>

            <div>
              <label className="label font-medium pb-1">Short Break Duration (Minutes)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={profileData.pomodoroBreak}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    pomodoroBreak: Number(e.target.value) || 1,
                  })
                }
                className="input input-bordered input-sm sm:input-md w-full"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={profileData.soundEnabled}
                onChange={(e) =>
                  setProfileData({ ...profileData, soundEnabled: e.target.checked })
                }
                className="checkbox checkbox-primary checkbox-sm"
              />
              <span className="font-medium">
                Play melodic chime alert when focus block or break ends
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={profileData.autoStartBreaks}
                onChange={(e) =>
                  setProfileData({ ...profileData, autoStartBreaks: e.target.checked })
                }
                className="checkbox checkbox-primary checkbox-sm"
              />
              <span className="font-medium">
                Automatically transition into break intervals
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary gap-2 shadow-sm rounded-xl"
          >
            {saving ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <FiSave /> Save Settings
              </>
            )}
          </button>
        </div>
      </form>

      <div className="card bg-base-100 border border-base-200 shadow-xs p-6 space-y-4">
        <h3 className="font-bold text-base flex items-center gap-2 border-b border-base-200 pb-3">
          <FiShield className="text-warning" /> Data & Privacy Controls
        </h3>
        <p className="text-xs text-base-content/60">
          Your tasks and sessions are protected in browser storage and can be backed up or reset at any time.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportData}
            className="btn btn-outline btn-sm rounded-xl gap-2 border-base-300"
          >
            <FiDownload /> Export Study Data (JSON)
          </button>

          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="btn btn-outline btn-warning btn-sm rounded-xl gap-2"
          >
            <FiRefreshCw /> Reset Sample Demo Data
          </button>

          <button
            type="button"
            onClick={() => setIsDeleteAccountOpen(true)}
            className="btn btn-outline btn-error btn-sm rounded-xl gap-2"
          >
            <FiTrash2 /> Clear All Data & Delete Account
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Reset to Sample Data"
        message="This will repopulate your tasks, subjects, and study sessions with the initial rich demo student data. Current changes will be overwritten."
        confirmText="Reset Data"
        isDanger={false}
        onConfirm={handleResetData}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

      <ConfirmModal
        isOpen={isDeleteAccountOpen}
        title="Delete Account & Erase Data"
        message="Are you sure you want to delete your account and clear all local storage? This action cannot be reversed."
        confirmText="Erase All Data"
        isDanger={true}
        onConfirm={handleDeleteAccount}
        onCancel={() => setIsDeleteAccountOpen(false)}
      />
    </div>
  );
}
