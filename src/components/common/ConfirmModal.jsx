import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

export default function ConfirmModal({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDanger = true,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300 p-6 scale-in-center">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
              isDanger ? 'bg-error/15 text-error' : 'bg-warning/15 text-warning'
            }`}
          >
            <FiAlertTriangle className="text-2xl" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="py-2 text-sm text-base-content/70">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-ghost btn-sm sm:btn-md"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`btn btn-sm sm:btn-md ${isDanger ? 'btn-error' : 'btn-primary'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
