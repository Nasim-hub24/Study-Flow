import React, { useState, useMemo } from 'react';
import {
  FiCheckSquare,
  FiBookOpen,
  FiPlus,
  FiSearch,
  FiFilter,
  FiCheckCircle,
} from 'react-icons/fi';
import { useData } from '../context/DataContext';
import TaskCard from '../components/tasks/TaskCard';
import TaskModal from '../components/tasks/TaskModal';
import TaskFilterBar from '../components/tasks/TaskFilterBar';
import SubjectCard from '../components/subjects/SubjectCard';
import SubjectModal from '../components/subjects/SubjectModal';
import ConfirmModal from '../components/common/ConfirmModal';
import { TaskListSkeleton } from '../components/common/SkeletonLoader';

export default function TasksPage() {
  const {
    subjects,
    tasks,
    sessions,
    metrics,
    isLoading,
    addTask,
    editTask,
    deleteTask,
    toggleTaskComplete,
    addSubject,
    editSubject,
    deleteSubject,
  } = useData();

  const [activeTab, setActiveTab] = useState('tasks');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [sortBy, setSortBy] = useState('due-soon');

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [confirmDeleteTask, setConfirmDeleteTask] = useState(null);

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState(null);
  const [confirmDeleteSubject, setConfirmDeleteSubject] = useState(null);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = t.title?.toLowerCase().includes(q);
          const matchNotes = t.notes?.toLowerCase().includes(q);
          if (!matchTitle && !matchNotes) return false;
        }
        if (selectedSubject !== 'ALL' && t.subjectId !== selectedSubject) {
          return false;
        }
        if (selectedStatus !== 'ALL' && t.status !== selectedStatus) {
          return false;
        }
        if (selectedPriority !== 'ALL' && t.priority !== selectedPriority) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'due-soon') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (sortBy === 'due-latest') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(b.dueDate) - new Date(a.dueDate);
        }
        if (sortBy === 'priority') {
          const pOrder = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
          return (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
        }
        if (sortBy === 'title-az') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'newest') {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        return 0;
      });
  }, [tasks, searchQuery, selectedSubject, selectedStatus, selectedPriority, sortBy]);

  const handleSaveTask = async (data) => {
    if (taskToEdit) {
      await editTask(taskToEdit.id, data);
    } else {
      await addTask(data);
    }
    setIsTaskModalOpen(false);
    setTaskToEdit(null);
  };

  const handleDeleteTask = async () => {
    if (confirmDeleteTask) {
      await deleteTask(confirmDeleteTask.id);
      setConfirmDeleteTask(null);
    }
  };

  const handleSaveSubject = async (data) => {
    if (subjectToEdit) {
      await editSubject(subjectToEdit.id, data);
    } else {
      await addSubject(data);
    }
    setIsSubjectModalOpen(false);
    setSubjectToEdit(null);
  };

  const handleDeleteSubject = async () => {
    if (confirmDeleteSubject) {
      await deleteSubject(confirmDeleteSubject.id);
      setConfirmDeleteSubject(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Tasks & Course Subjects
          </h1>
          <p className="text-xs sm:text-sm text-base-content/60 mt-1">
            Manage your assignments, readings, and subject targets
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'tasks' ? (
            <button
              type="button"
              onClick={() => {
                setTaskToEdit(null);
                setIsTaskModalOpen(true);
              }}
              className="btn btn-primary btn-sm rounded-xl gap-2 shadow-xs"
            >
              <FiPlus /> Add Task
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSubjectToEdit(null);
                setIsSubjectModalOpen(true);
              }}
              className="btn btn-primary btn-sm rounded-xl gap-2 shadow-xs"
            >
              <FiPlus /> Add Subject
            </button>
          )}
        </div>
      </div>

      <div className="flex border-b border-base-200 gap-4">
        <button
          type="button"
          onClick={() => setActiveTab('tasks')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'tasks'
              ? 'border-primary text-primary'
              : 'border-transparent text-base-content/60 hover:text-base-content'
          }`}
        >
          <FiCheckSquare /> Tasks ({tasks.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('subjects')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'subjects'
              ? 'border-primary text-primary'
              : 'border-transparent text-base-content/60 hover:text-base-content'
          }`}
        >
          <FiBookOpen /> Course Subjects ({subjects.length})
        </button>
      </div>

      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <TaskFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedSubject={selectedSubject}
            onSubjectChange={setSelectedSubject}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedPriority={selectedPriority}
            onPriorityChange={setSelectedPriority}
            sortBy={sortBy}
            onSortChange={setSortBy}
            subjects={subjects}
          />

          {isLoading ? (
            <TaskListSkeleton count={5} />
          ) : filteredTasks.length === 0 ? (
            <div className="card bg-base-100 border border-base-200 p-12 text-center rounded-2xl space-y-3">
              <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mx-auto text-2xl">
                📋
              </div>
              <h3 className="font-bold text-base">No tasks match your criteria</h3>
              <p className="text-xs text-base-content/60 max-w-sm mx-auto">
                Try clearing search terms or active filters, or create a new study task right now.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSubject('ALL');
                  setSelectedStatus('ALL');
                  setSelectedPriority('ALL');
                }}
                className="btn btn-outline btn-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  subject={metrics.subjectMap.get(task.subjectId)}
                  onToggleComplete={toggleTaskComplete}
                  onEdit={(t) => {
                    setTaskToEdit(t);
                    setIsTaskModalOpen(true);
                  }}
                  onDelete={(t) => setConfirmDeleteTask(t)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'subjects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-base-content/70">
              Each subject carries a distinct color tag applied across all charts, schedules, and task filters.
            </p>
          </div>

          {subjects.length === 0 ? (
            <div className="card bg-base-100 border border-base-200 p-12 text-center rounded-2xl space-y-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-2xl font-bold">
                📚
              </div>
              <h3 className="font-bold text-base">No Subjects Registered</h3>
              <p className="text-xs text-base-content/60 max-w-sm mx-auto">
                Create subjects for your current classes or exam topics to organize all tasks and focus sessions.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubjectToEdit(null);
                  setIsSubjectModalOpen(true);
                }}
                className="btn btn-primary btn-sm rounded-xl"
              >
                <FiPlus /> Add First Subject
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((sub) => (
                <SubjectCard
                  key={sub.id}
                  subject={sub}
                  tasks={tasks}
                  sessions={sessions}
                  onEdit={(s) => {
                    setSubjectToEdit(s);
                    setIsSubjectModalOpen(true);
                  }}
                  onDelete={(s) => setConfirmDeleteSubject(s)}
                />
              ))}
            </div>
          )}
        </div>
      )}

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

      <SubjectModal
        isOpen={isSubjectModalOpen}
        subjectToEdit={subjectToEdit}
        onClose={() => {
          setIsSubjectModalOpen(false);
          setSubjectToEdit(null);
        }}
        onSave={handleSaveSubject}
      />

      <ConfirmModal
        isOpen={!!confirmDeleteTask}
        title="Delete Task"
        message={`Are you sure you want to delete "${confirmDeleteTask?.title}"?`}
        confirmText="Delete Task"
        onConfirm={handleDeleteTask}
        onCancel={() => setConfirmDeleteTask(null)}
      />

      <ConfirmModal
        isOpen={!!confirmDeleteSubject}
        title="Delete Subject"
        message={`Are you sure you want to delete "${confirmDeleteSubject?.name}"? Tasks linked to this subject will remain in your system.`}
        confirmText="Delete Subject"
        onConfirm={handleDeleteSubject}
        onCancel={() => setConfirmDeleteSubject(null)}
      />
    </div>
  );
}
