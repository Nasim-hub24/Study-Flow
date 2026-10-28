import React, { useState, useEffect } from 'react';
import { FiX, FiCheck } from 'react-icons/fi';

const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#EF4444', // Red
  '#6366F1', // Indigo
];

export default function SubjectModal({
  isOpen,
  subjectToEdit,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    color: '#3B82F6',
    targetHours: 5,
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (subjectToEdit) {
      setFormData({
        name: subjectToEdit.name || '',
        code: subjectToEdit.code || '',
        color: subjectToEdit.color || '#3B82F6',
        targetHours: subjectToEdit.targetHours || 5,
        notes: subjectToEdit.notes || '',
      });
    } else {
      setFormData({
        name: '',
        code: '',
        color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)],
        targetHours: 5,
        notes: '',
      });
    }
    setErrors({});
  }, [subjectToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Subject name is required.';
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
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-base-200">
          <h3 className="text-lg font-bold">
            {subjectToEdit ? 'Edit Subject' : 'Add New Subject'}
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
          {/* Subject Name */}
          <div>
            <label className="label font-medium pb-1">Subject Name *</label>
            <input
              type="text"
              placeholder="e.g. Advanced Mathematics"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
            />
            {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Subject Code & Target Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label font-medium pb-1">Course Code</label>
              <input
                type="text"
                placeholder="e.g. MATH-301"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="label font-medium pb-1">Weekly Goal (hrs)</label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.targetHours}
                onChange={(e) =>
                  setFormData({ ...formData, targetHours: Number(e.target.value) || 1 })
                }
                className="input input-bordered w-full"
              />
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="label font-medium pb-1">Color Tag</label>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {PRESET_COLORS.map((clr) => (
                <button
                  key={clr}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: clr })}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    formData.color === clr ? 'scale-125 ring-2 ring-primary ring-offset-2 ring-offset-base-100' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: clr }}
                />
              ))}
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-8 h-8 rounded-full border-0 cursor-pointer p-0"
                title="Custom color"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="label font-medium pb-1">Description / Syllabus Notes</label>
            <textarea
              rows="3"
              placeholder="e.g. Topics include calculus, linear algebra, exam on Dec 12..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="textarea textarea-bordered w-full"
            ></textarea>
          </div>

          {/* Actions */}
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
              <FiCheck /> {subjectToEdit ? 'Save Changes' : 'Create Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
