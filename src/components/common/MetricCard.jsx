import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  to,
  badgeText,
  badgeColor = 'badge-primary',
  accentColor = 'bg-primary/10 text-primary',
}) {
  const content = (
    <div className="card bg-base-100 border border-base-200 hover:border-primary/40 shadow-xs hover:shadow-md transition-all duration-200 p-5 group cursor-pointer relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-base-content/60">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight">{value}</span>
            {badgeText && <span className={`badge badge-sm font-medium ${badgeColor}`}>{badgeText}</span>}
          </div>
          {subtitle && <p className="text-xs text-base-content/70 pt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${accentColor}`}>
            <Icon className="text-2xl" />
          </div>
        )}
      </div>

      {to && (
        <div className="mt-4 pt-3 border-t border-base-200/60 flex items-center justify-between text-xs font-medium text-primary group-hover:translate-x-0.5 transition-transform">
          <span>View details</span>
          <FiArrowRight />
        </div>
      )}
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
}
