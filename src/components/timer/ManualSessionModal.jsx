import React, { useState } from 'react';
import { FiX, FiCheck } from 'react-icons/fi';
import { toInputDateFormat } from '../../utils/dateUtils';

export default function ManualSessionModal({
  isOpen,
  subjects = [],
  tasks = [],
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState({
    subjectId: subjects[0]?.id || '',
    taskId: '',
    durationMinutes: 45,
    date: toInputDateFormat(),
    notes: '',
  });

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.durationMinutes || formData.durationMinutes <= 0) {
      setError('Please enter a valid study duration in minutes.');
      return;
    }
    setError('');
    onSave(formData);
    onClose();
  };

  const filteredTasks = tasks.filter(
    (t) => !formData.subjectId || t.subjectId === formData.subjectId
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-base-200">
          <h3 className="text-lg font-bold">Log Past Study Session</h3>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-circle btn-sm"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-sm">
          {/* Subject */}
          <div>
            <label className="label font-medium pb-1">Subject</label>
            <select
              value={formData.subjectId}
              onChange={(e) =>
                setFormData({ ...formData, subjectId: e.target.value, taskId: '' })
              }
              className="select select-bordered w-full"
            >
              <option value="">General Study (No Subject)</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Linked Task */}
          <div>
            <label className="label font-medium pb-1">Linked Task (Optional)</label>
            <select
              value={formData.taskId}
              onChange={(e) => setFormData({ ...formData, taskId: e.target.value })}
              className="select select-bordered w-full"
            >
              <option value="">None (Independent Study)</option>
              {filteredTasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          {/* Duration & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label font-medium pb-1">Duration (Minutes) *</label>
              <input
                type="number"
                min="1"
                step="5"
                value={formData.durationMinutes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    durationMinutes: Number(e.target.value) || 0,
                  })
                }
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label font-medium pb-1">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input input-bordered w-full"
                required
              />
            </div>
          </div>

          {error && <p className="text-error text-xs">{error}</p>}

          {/* Notes */}
          <div>
            <label className="label font-medium pb-1">Reflection / Notes</label>
            <textarea
              rows="3"
              placeholder="What did you learn or accomplish during this session?"
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
              <FiCheck /> Save Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
