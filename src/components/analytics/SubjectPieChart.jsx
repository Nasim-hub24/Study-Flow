import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { formatTimeMinutes } from '../../utils/dateUtils';

function CustomPieTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-base-100 border border-base-200 p-3 rounded-xl shadow-xl text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-bold">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <span>{data.name}</span>
        </div>
        <p className="text-base-content/80 font-medium">
          {formatTimeMinutes(data.minutes)} ({data.hours} hrs)
        </p>
      </div>
    );
  }
  return null;
}

export default function SubjectPieChart({ data = [] }) {
  const totalMinutes = data.reduce((acc, curr) => acc + (curr.minutes || 0), 0);

  if (!data || data.length === 0 || totalMinutes === 0) {
    return (
      <div className="card bg-base-100 border border-base-200 p-6 shadow-xs flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="text-3xl mb-2">📊</div>
        <h4 className="font-bold text-sm">No Study Time Recorded Yet</h4>
        <p className="text-xs text-base-content/60 max-w-xs mt-1">
          Complete a timer session or log study minutes to see your subject time distribution!
        </p>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 border border-base-200 p-5 shadow-xs space-y-4">
      <div>
        <h3 className="font-bold text-base">Time by Subject</h3>
        <p className="text-xs text-base-content/60">Study balance across your active subjects</p>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomPieTooltip />} />
            <Pie
              data={data}
              dataKey="minutes"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || '#6366F1'} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Accessible Table & Legend Breakdown */}
      <div className="space-y-2 pt-2 border-t border-base-200">
        {data.map((item) => {
          const percent = totalMinutes > 0 ? Math.round((item.minutes / totalMinutes) * 100) : 0;
          return (
            <div
              key={item.id || item.name}
              className="flex items-center justify-between text-xs py-1"
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium truncate">{item.name}</span>
                {item.code && (
                  <span className="text-[10px] text-base-content/50 font-mono hidden sm:inline">
                    ({item.code})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 font-mono shrink-0">
                <span className="text-base-content/70">{formatTimeMinutes(item.minutes)}</span>
                <span className="badge badge-xs badge-ghost font-bold">{percent}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
