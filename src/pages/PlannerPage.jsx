import React, { useState } from 'react';
import {
  FiCalendar,
  FiTarget,
  FiZap,
  FiPlus,
  FiCheckCircle,
} from 'react-icons/fi';
import { useData } from '../context/DataContext';
import WeeklyCalendar from '../components/planner/WeeklyCalendar';
import GoalTracker from '../components/planner/GoalTracker';
import TaskModal from '../components/tasks/TaskModal';

export default function PlannerPage() {
  const { tasks, sessions, subjects, metrics, addTask, editTask } = useData();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const handleSaveTask = async (data) => {
    if (taskToEdit) {
      await editTask(taskToEdit.id, data);
    } else {
      await addTask(data);
    }
    setIsTaskModalOpen(false);
    setTaskToEdit(null);
  };

  const handleSelectTaskFromCalendar = (task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Weekly Planner & Study Goals
          </h1>
          <p className="text-xs sm:text-sm text-base-content/60 mt-1">
            Map out your upcoming week, schedule assignments, and hit your target hours
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setTaskToEdit(null);
            setIsTaskModalOpen(true);
          }}
          className="btn btn-primary btn-sm rounded-xl gap-2 shadow-xs"
        >
          <FiPlus /> Schedule Task
        </button>
      </div>

      <GoalTracker
        weekStudyHours={metrics?.weekStudyHours || 0}
        completedTasks={metrics?.completedTasks?.length || 0}
        pendingTasks={metrics?.pendingTasks?.length || 0}
        streak={metrics?.streak || 1}
      />

      <WeeklyCalendar
        tasks={tasks}
        sessions={sessions}
        subjects={subjects}
        onSelectTask={handleSelectTaskFromCalendar}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        taskToEdit={taskToEdit}
        subjects={subjects}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSaveTask}
      />
    </div>
  );
}
