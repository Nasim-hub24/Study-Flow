import React from 'react';
import { FiHeart, FiGithub, FiCheckCircle } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="border-t border-base-200 bg-base-100/60 py-6 px-4 sm:px-8 mt-auto text-xs text-base-content/60">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-primary text-primary-content flex items-center justify-center font-bold text-xs">
            S
          </div>
          <span className="font-semibold text-base-content/90">StudyFlow</span>
          <span>— Student Study Planner & Analytics Platform</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-success font-medium">
            <FiCheckCircle className="text-xs" /> System Operational
          </span>
          <span>Crafted for high-performance learners</span>
        </div>
      </div>
    </footer>
  );
}
