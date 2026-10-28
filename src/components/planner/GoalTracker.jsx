import React from 'react';
import {
  FiTarget,
  FiZap,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const MOTIVATIONAL_QUOTES = [
  { text: 'Small disciplines repeated with consistency every day lead to great achievements.', author: 'John C. Maxwell' },
  { text: 'Continuous effort—not strength or intelligence—is the key to unlocking our potential.', author: 'Winston Churchill' },
  { text: 'Action is the foundational key to all success.', author: 'Pablo Picasso' },
  { text: 'Success is the sum of small efforts, repeated day in and day out.', author: 'Robert Collier' },
  { text: 'Focus on being productive instead of busy.', author: 'Tim Ferriss' },
];

export default function GoalTracker({
  weekStudyHours = 0,
  completedTasks = 0,
  pendingTasks = 0,
  streak = 1,
}) {
  const { user } = useAuth();
  const targetHours = user?.weeklyGoalHours || 20;
  const progressPercent = Math.min(Math.round((weekStudyHours / targetHours) * 100), 100);

  // Motivational quote of the day (based on day of month)
  const quoteIndex = new Date().getDate() % MOTIVATIONAL_QUOTES.length;
  const quote = MOTIVATIONAL_QUOTES[quoteIndex];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Target Hours Progress */}
      <div className="card bg-base-100 border border-base-200 p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FiTarget className="text-xl" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Study Time Target</h4>
              <p className="text-xs text-base-content/60">Weekly focus commitment</p>
            </div>
          </div>
          <span className="badge badge-primary font-bold text-xs">{progressPercent}%</span>
        </div>

        <div className="space-y-2 mt-2">
          <div className="flex justify-between text-xs font-semibold">
            <span>{weekStudyHours} hours logged</span>
            <span className="text-base-content/60">{targetHours} hrs target</span>
          </div>
          <div className="w-full bg-base-200 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-emerald-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-base-content/60">
            {progressPercent >= 100
              ? '🎉 Weekly goal achieved! Outstanding work!'
              : `${(targetHours - weekStudyHours).toFixed(1)} hours remaining this week`}
          </p>
        </div>
      </div>

      {/* Streak & Consistency */}
      <div className="card bg-base-100 border border-base-200 p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <FiZap className="text-xl" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Study Streak</h4>
              <p className="text-xs text-base-content/60">Consecutive days active</p>
            </div>
          </div>
          <span className="badge badge-warning font-bold text-xs">🔥 {streak} Days</span>
        </div>

        <div className="flex items-center gap-2 py-2">
          <div className="flex -space-x-1">
            {['🌱', '⚡', '🔥', '🏆'].map((badge, i) => (
              <span
                key={i}
                className="w-8 h-8 rounded-full bg-base-200 border-2 border-base-100 flex items-center justify-center text-sm shadow-xs"
                title={`Level ${i + 1} Habit Milestone`}
              >
                {badge}
              </span>
            ))}
          </div>
          <div className="text-xs">
            <p className="font-bold">Habit Builder Level {Math.min(streak, 4)}</p>
            <p className="text-[11px] text-base-content/60">Study today to maintain streak!</p>
          </div>
        </div>

        <div className="text-[11px] text-base-content/60 border-t border-base-200 pt-2">
          Completed {completedTasks} tasks with {pendingTasks} upcoming.
        </div>
      </div>

      {/* Motivational Mindset Card */}
      <div className="card bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-base-100 border border-indigo-500/20 p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-xs">
            💡
          </div>
          <h4 className="font-bold text-sm">Focus Mindset</h4>
        </div>

        <p className="text-xs italic text-base-content/80 leading-relaxed my-2">
          "{quote.text}"
        </p>

        <p className="text-[11px] font-semibold text-primary text-right">
          — {quote.author}
        </p>
      </div>
    </div>
  );
}
