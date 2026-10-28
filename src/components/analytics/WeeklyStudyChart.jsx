import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-base-100 border border-base-200 p-3 rounded-xl shadow-xl text-xs space-y-1">
        <p className="font-bold text-base-content">{label} ({data.date})</p>
        <p className="text-primary font-semibold">
          {data.hours} hours ({data.minutes} mins)
        </p>
      </div>
    );
  }
  return null;
}

export default function WeeklyStudyChart({ data = [] }) {
  const totalHours = data.reduce((acc, curr) => acc + (curr.hours || 0), 0);
  const highestDay = data.reduce((max, d) => (d.hours > (max?.hours || 0) ? d : max), data[0]);

  return (
    <div className="card bg-base-100 border border-base-200 p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-base">Weekly Study Time</h3>
          <p className="text-xs text-base-content/60">Daily study hours logged this week</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-primary font-bold text-xs">{totalHours.toFixed(1)} hrs total</span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={{ strokeOpacity: 0.2 }}
              tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.7 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.7 }}
              unit="h"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isCurrentDay ? '#6366F1' : '#818CF8'}
                  opacity={entry.hours > 0 ? 0.9 : 0.25}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Accessible text alternative & key takeaways */}
      <div className="text-xs text-base-content/70 pt-2 border-t border-base-200 flex flex-wrap items-center justify-between gap-2">
        <span aria-label="Accessible chart description">
          Peak focus was on <strong>{highestDay?.day || 'N/A'}</strong> with <strong>{highestDay?.hours || 0} hours</strong>.
        </span>
        <span className="text-[11px] text-base-content/50">
          Updated in real-time with your sessions
        </span>
      </div>
    </div>
  );
}
