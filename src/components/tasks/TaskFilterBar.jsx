import React from 'react';
import { FiSearch, FiFilter, FiSliders } from 'react-icons/fi';

export default function TaskFilterBar({
  searchQuery,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
  selectedStatus,
  onStatusChange,
  selectedPriority,
  onPriorityChange,
  sortBy,
  onSortChange,
  subjects = [],
}) {
  return (
    <div className="bg-base-100 p-4 rounded-2xl border border-base-200 shadow-xs space-y-3">
      {/* Search Bar + Quick Reset */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 text-base" />
          <input
            type="text"
            placeholder="Search tasks by title or notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input input-bordered input-sm sm:input-md w-full pl-10"
          />
        </div>
      </div>

      {/* Filters row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {/* Subject filter */}
        <select
          value={selectedSubject}
          onChange={(e) => onSubjectChange(e.target.value)}
          className="select select-bordered select-sm w-full"
        >
          <option value="ALL">All Subjects</option>
          {subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="select select-bordered select-sm w-full"
        >
          <option value="ALL">All Statuses</option>
          <option value="Pending">Pending Only</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        {/* Priority filter */}
        <select
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="select select-bordered select-sm w-full"
        >
          <option value="ALL">All Priorities</option>
          <option value="Urgent">Urgent</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        {/* Sort by */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="select select-bordered select-sm w-full"
        >
          <option value="due-soon">Due Soonest</option>
          <option value="due-latest">Due Latest</option>
          <option value="priority">Priority (High to Low)</option>
          <option value="title-az">Title (A-Z)</option>
          <option value="newest">Recently Added</option>
        </select>
      </div>
    </div>
  );
}
