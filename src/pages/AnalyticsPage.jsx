import React, { useState } from 'react';
import {
  FiBarChart2,
  FiPieChart,
  FiClock,
  FiTarget,
  FiZap,
  FiTrendingUp,
  FiCheckCircle,
} from 'react-icons/fi';
import { useData } from '../context/DataContext';
import WeeklyStudyChart from '../components/analytics/WeeklyStudyChart';
import SubjectPieChart from '../components/analytics/SubjectPieChart';
import CompletionTrendChart from '../components/analytics/CompletionTrendChart';
import { ChartSkeleton } from '../components/common/SkeletonLoader';
import { formatTimeMinutes } from '../utils/dateUtils';

export default function AnalyticsPage() {
  const { metrics, tasks, sessions, isLoading } = useData();
  const [timeRange, setTimeRange] = useState('week');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  const totalMinutes = sessions.reduce((acc, s) => acc + (Number(s.durationMinutes) || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const topSubject = metrics?.subjectChartData?.reduce(
    (max, curr) => (curr.minutes > (max?.minutes || 0) ? curr : max),
    null
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Progress & Study Analytics
          </h1>
          <p className="text-xs sm:text-sm text-base-content/60 mt-1">
            Data visualizations of your study time, subjects, and task completion
          </p>
        </div>

        <div className="flex bg-base-200 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeRange === 'week' ? 'bg-base-100 shadow-xs text-primary font-bold' : 'text-base-content/60'
            }`}
          >
            This Week
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeRange === 'all' ? 'bg-base-100 shadow-xs text-primary font-bold' : 'text-base-content/60'
            }`}
          >
            All-Time History
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-base-100 border border-base-200 p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl">
              <FiClock />
            </div>
            <div>
              <p className="text-[11px] uppercase font-bold text-base-content/60">Total Hours</p>
              <p className="text-2xl font-black">{totalHours}h</p>
            </div>
          </div>
          <p className="text-xs text-base-content/60 mt-2">
            Across {sessions.length} logged sessions
          </p>
        </div>

        <div className="card bg-base-100 border border-base-200 p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xl">
              <FiCheckCircle />
            </div>
            <div>
              <p className="text-[11px] uppercase font-bold text-base-content/60">Task Completion</p>
              <p className="text-2xl font-black">{metrics?.completionRate || 0}%</p>
            </div>
          </div>
          <p className="text-xs text-base-content/60 mt-2">
            {metrics?.completedTasks?.length || 0} completed of {tasks.length} tasks
          </p>
        </div>

        <div className="card bg-base-100 border border-base-200 p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center text-xl">
              <FiTarget />
            </div>
            <div>
              <p className="text-[11px] uppercase font-bold text-base-content/60">Top Subject</p>
              <p className="text-lg font-bold truncate max-w-[140px]">
                {topSubject ? topSubject.name : 'None'}
              </p>
            </div>
          </div>
          <p className="text-xs text-base-content/60 mt-2">
            {topSubject ? `${formatTimeMinutes(topSubject.minutes)} spent` : 'No sessions yet'}
          </p>
        </div>

        <div className="card bg-base-100 border border-base-200 p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl">
              <FiZap />
            </div>
            <div>
              <p className="text-[11px] uppercase font-bold text-base-content/60">Current Streak</p>
              <p className="text-2xl font-black">🔥 {metrics?.streak || 1} Days</p>
            </div>
          </div>
          <p className="text-xs text-base-content/60 mt-2">Daily study momentum</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyStudyChart data={metrics?.dailyChartData || []} />
        <SubjectPieChart data={metrics?.subjectChartData || []} />
      </div>

      <CompletionTrendChart
        tasks={tasks}
        completionRate={metrics?.completionRate || 0}
      />
    </div>
  );
}
