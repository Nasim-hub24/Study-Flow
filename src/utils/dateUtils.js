// Date and time utility functions for StudyFlow

export function formatDate(dateString) {
  if (!dateString) return 'No date';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatShortDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatTimeMinutes(minutes) {
  if (!minutes || minutes <= 0) return '0m';
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
  if (hrs > 0) return `${hrs}h`;
  return `${mins}m`;
}

export function formatSecondsToMMSS(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function isToday(dateString) {
  if (!dateString) return false;
  const d = new Date(dateString);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

export function isOverdue(dateString) {
  if (!dateString) return false;
  const d = new Date(dateString);
  d.setHours(23, 59, 59, 999);
  return d < new Date();
}

export function getRelativeDays(dateString) {
  if (!dateString) return null;
  const d = new Date(dateString);
  d.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((d - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays < -1) return `${Math.abs(diffDays)} days overdue`;
  if (diffDays <= 7) return `In ${diffDays} days`;
  return formatDate(dateString);
}

// Generate the 7 days of the current week (Mon-Sun or Sun-Sat)
export function getCurrentWeekDays() {
  const now = new Date();
  const currentDay = now.getDay(); // 0 is Sunday
  const distanceToMonday = (currentDay + 6) % 7; // Monday as day 0
  const monday = new Date(now);
  monday.setDate(now.getDate() - distanceToMonday);
  monday.setHours(0, 0, 0, 0);

  const days = [];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    days.push({
      date: dateStr,
      dayName: dayNames[i],
      formatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isCurrentDay: isToday(dateStr),
    });
  }
  return days;
}

export function toInputDateFormat(date = new Date()) {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}
