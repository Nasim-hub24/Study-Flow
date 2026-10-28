import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiCheckSquare,
  FiClock,
  FiCalendar,
  FiPlus,
  FiPlay,
  FiBookOpen,
  FiTrendingUp,
  FiAward,
  FiArrowRight,
  FiAlertCircle,
} from 'react-icons/fi';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import MetricCard from '../components/common/MetricCard';
import TaskCard from '../components/tasks/TaskCard';
import TaskModal from '../components/tasks/TaskModal';
import SubjectModal from '../components/subjects/SubjectModal';
import ConfirmModal from '../components/common/ConfirmModal';
import WeeklyStudyChart from '../components/analytics/WeeklyStudyChart';
import { CardSkeleton, TaskListSkeleton } from '../components/common/SkeletonLoader';

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    subjects,
    tasks,
    metrics,
    isLoading,
    addTask,
    editTask,
    deleteTask,
    toggleTaskComplete,
    addSubject,
  } = useData();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [confirmDeleteTask, setConfirmDeleteTask] = useState(null);

  const handleCreateTask = async (data) => {
    await addTask(data);
    setIsTaskModalOpen(false);
  };

  const handleEditTask = async (data) => {
    if (taskToEdit) {
      await editTask(taskToEdit.id, data);
      setTaskToEdit(null);
      setIsTaskModalOpen(false);
    }
  };

  const handleDeleteTask = async () => {
    if (confirmDeleteTask) {
      await deleteTask(confirmDeleteTask.id);
      setConfirmDeleteTask(null);
    }
  };

  const handleCreateSubject = async (data) => {
    await addSubject(data);
    setIsSubjectModalOpen(false);
  };

  // Skeleton loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <TaskListSkeleton count={4} />
      </div>
    );
  }

  // Today's tasks + upcoming
  const todayTasks = metrics?.todayTasks || [];
  const upcomingDeadlines = metrics?.upcomingDeadlines || [];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-base-100 to-base-100 p-6 rounded-2xl border border-base-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Hello, {user?.name?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <span className="badge badge-warning badge-sm font-bold">
              🔥 {metrics?.streak || 1}d Streak
            </span>
          </div>
          <p className="text-xs sm:text-sm text-base-content/70 mt-1">
            {todayTasks.length > 0
              ? `You have ${todayTasks.length} task${todayTasks.length > 1 ? 's' : ''} scheduled for today. Let's make progress!`
              : 'All caught up for today! Ready to dive into your next focus block?'}
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setTaskToEdit(null);
              setIsTaskModalOpen(true);
            }}
            className="btn btn-primary btn-sm gap-2 rounded-xl shadow-xs"
          >
            <FiPlus /> New Task
          </button>
          <button
            type="button"
            onClick={() => setIsSubjectModalOpen(true)}
            className="btn btn-outline btn-sm gap-2 rounded-xl border-base-300"
          >
            <FiBookOpen /> New Subject
          </button>
          <Link
            to="/sessions"
            className="btn btn-secondary btn-sm gap-2 rounded-xl shadow-xs"
          >
            <FiPlay /> Start Timer
          </Link>
        </div>
      </div>

      {/* FR-2.1 & FR-2.2: Summary Metric Cards linking to detailed views */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Today's Tasks"
          value={todayTasks.length}
          subtitle={todayTasks.length ? 'Pending for today' : 'No tasks due today'}
          icon={FiCheckSquare}
          to="/tasks"
          badgeText={todayTasks.length ? 'Active' : 'Clear'}
          badgeColor={todayTasks.length ? 'badge-primary' : 'badge-success'}
          accentColor="bg-primary/10 text-primary"
        />

        <MetricCard
          title="Study Time This Week"
          value={`${metrics?.weekStudyHours || 0}h`}
          subtitle={`Goal: ${user?.weeklyGoalHours || 20} hours`}
          icon={FiClock}
          to="/sessions"
          badgeText={`${Math.min(Math.round(((metrics?.weekStudyHours || 0) / (user?.weeklyGoalHours || 20)) * 100), 100)}%`}
          badgeColor="badge-secondary"
          accentColor="bg-secondary/10 text-secondary"
        />

        <MetricCard
          title="Upcoming Deadlines"
          value={upcomingDeadlines.length}
          subtitle="Next 7 days coursework"
          icon={FiCalendar}
          to="/planner"
          badgeText="Next 7 Days"
          badgeColor="badge-warning"
          accentColor="bg-warning/10 text-warning"
        />

        <MetricCard
          title="Completion Rate"
          value={`${metrics?.completionRate || 0}%`}
          subtitle={`${metrics?.completedTasks?.length || 0} of ${tasks.length} tasks done`}
          icon={FiTrendingUp}
          to="/analytics"
          badgeText="Analytics"
          badgeColor="badge-info"
          accentColor="bg-info/10 text-info"
        />
      </div>

      {/* Main Grid: Today's Tasks & Weekly Study Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FiCheckSquare className="text-primary" /> Today's Focus List
              </h2>
              <p className="text-xs text-base-content/60">
                Tasks due today or urgent assignments
              </p>
            </div>
            <Link
              to="/tasks"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              All Tasks ({tasks.length}) <FiArrowRight />
            </Link>
          </div>

          {todayTasks.length === 0 ? (
            <div className="card bg-base-100 border border-base-200 p-8 text-center rounded-2xl space-y-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-2xl font-bold">
                🎯
              </div>
              <h3 className="font-bold text-base">You have no tasks due today!</h3>
              <p className="text-xs text-base-content/60 max-w-sm mx-auto">
                Plan ahead by creating a new assignment or topic to review, or jump straight into a focused study session.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setTaskToEdit(null);
                    setIsTaskModalOpen(true);
                  }}
                  className="btn btn-primary btn-sm rounded-xl"
                >
                  <FiPlus /> Add First Task
                </button>
                <Link to="/sessions" className="btn btn-outline btn-sm rounded-xl">
                  <FiPlay /> Launch Timer
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {todayTasks.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  subject={metrics.subjectMap.get(t.subjectId)}
                  onToggleComplete={toggleTaskComplete}
                  onEdit={(task) => {
                    setTaskToEdit(task);
                    setIsTaskModalOpen(true);
                  }}
                  onDelete={(task) => setConfirmDeleteTask(task)}
                />
              ))}
            </div>
          )}

          {/* Upcoming deadlines preview */}
          {upcomingDeadlines.length > 0 && (
            <div className="pt-4 border-t border-base-200">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-base-content/80">
                <FiAlertCircle className="text-warning" /> Coming Up Soon
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {upcomingDeadlines.slice(0, 4).map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    subject={metrics.subjectMap.get(t.subjectId)}
                    onToggleComplete={toggleTaskComplete}
                    onEdit={(task) => {
                      setTaskToEdit(task);
                      setIsTaskModalOpen(true);
                    }}
                    onDelete={(task) => setConfirmDeleteTask(task)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Weekly Chart & Active Subjects */}
        <div className="space-y-6">
          {/* Weekly Study Chart */}
          <WeeklyStudyChart data={metrics?.dailyChartData || []} />

          {/* Active Subjects Quick List */}
          <div className="card bg-base-100 border border-base-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <FiBookOpen className="text-primary" /> Active Subjects ({subjects.length})
              </h3>
              <Link to="/tasks" className="text-xs font-semibold text-primary hover:underline">
                Manage
              </Link>
            </div>

            {subjects.length === 0 ? (
              <p className="text-xs text-base-content/60 text-center py-4">
                No subjects yet. Click "New Subject" to get started!
              </p>
            ) : (
              <div className="space-y-2">
                {subjects.slice(0, 5).map((sub) => {
                  const subTasks = tasks.filter((t) => t.subjectId === sub.id && t.status !== 'Completed');
                  return (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-base-200 hover:bg-base-200/50 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: sub.color || '#6366F1' }}
                        />
                        <span className="font-semibold truncate">{sub.name}</span>
                      </div>
                      <span className="badge badge-sm badge-ghost font-mono shrink-0">
                        {subTasks.length} pending
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        taskToEdit={taskToEdit}
        subjects={subjects}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={taskToEdit ? handleEditTask : handleCreateTask}
      />

      {/* Subject Modal */}
      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onSave={handleCreateSubject}
      />

      {/* Delete Task Confirmation Modal */}
      <ConfirmModal
        isOpen={!!confirmDeleteTask}
        title="Delete Task"
        message={`Are you sure you want to delete "${confirmDeleteTask?.title}"?`}
        confirmText="Delete Task"
        onConfirm={handleDeleteTask}
        onCancel={() => setConfirmDeleteTask(null)}
      />
    </div>
  );
}
