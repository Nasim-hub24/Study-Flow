import React, { useState, useEffect } from 'react';
import { FiX, FiCheck } from 'react-icons/fi';
import { toInputDateFormat } from '../../utils/dateUtils';

export default function TaskModal({
  isOpen,
  taskToEdit,
  subjects = [],
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState({
    title: '',
    subjectId: '',
    dueDate: toInputDateFormat(),
    priority: 'Medium',
    status: 'Pending',
    estimatedMinutes: 60,
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        subjectId: taskToEdit.subjectId || (subjects[0]?.id || ''),
        dueDate: taskToEdit.dueDate || toInputDateFormat(),
        priority: taskToEdit.priority || 'Medium',
        status: taskToEdit.status || 'Pending',
        estimatedMinutes: taskToEdit.estimatedMinutes || 60,
        notes: taskToEdit.notes || '',
      });
    } else {
      setFormData({
        title: '',
        subjectId: subjects[0]?.id || '',
        dueDate: toInputDateFormat(),
        priority: 'Medium',
        status: 'Pending',
        estimatedMinutes: 60,
        notes: '',
      });
    }
    setErrors({});
  }, [taskToEdit, isOpen, subjects]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Task title is required.';
    }
    if (!formData.subjectId) {
      errs.subjectId = 'Please select or create a subject.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="card w-full max-w-lg bg-base-100 shadow-2xl border border-base-300 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-base-200">
          <h3 className="text-lg font-bold">
            {taskToEdit ? 'Edit Task' : 'Create New Study Task'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-circle btn-sm"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-sm">
          {/* Title */}
          <div>
            <label className="label font-medium pb-1">Task Title *</label>
            <input
              type="text"
              placeholder="e.g. Complete Calculus Problem Set 4"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
            />
            {errors.title && <p className="text-error text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Subject & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label font-medium pb-1">Subject *</label>
              <select
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className={`select select-bordered w-full ${errors.subjectId ? 'select-error' : ''}`}
              >
                <option value="" disabled>
                  Select Subject
                </option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} {sub.code ? `(${sub.code})` : ''}
                  </option>
                ))}
              </select>
              {errors.subjectId && <p className="text-error text-xs mt-1">{errors.subjectId}</p>}
            </div>

            <div>
              <label className="label font-medium pb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="select select-bordered w-full"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
                <option value="Urgent">Urgent / Exam</option>
              </select>
            </div>
          </div>

          {/* Due Date & Estimated Minutes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label font-medium pb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="label font-medium pb-1">Estimated Focus Time (mins)</label>
              <input
                type="number"
                min="5"
                step="5"
                value={formData.estimatedMinutes}
                onChange={(e) =>
                  setFormData({ ...formData, estimatedMinutes: Number(e.target.value) || 0 })
                }
                className="input input-bordered w-full"
              />
            </div>
          </div>

          {/* Status */}
          {taskToEdit && (
            <div>
              <label className="label font-medium pb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="select select-bordered w-full"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          )}

          {/* Notes / Description */}
          <div>
            <label className="label font-medium pb-1">Notes & Instructions (Optional)</label>
            <textarea
              rows="3"
              placeholder="e.g. Focus on questions 10 to 18, reference chapter 4 slides..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="textarea textarea-bordered w-full"
            ></textarea>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-base-200">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-sm sm:btn-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm sm:btn-md gap-2"
            >
              <FiCheck /> {taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
