export const calculatePriority = (
  deadlineIso: string,
): 'overdue' | 'high' | 'medium' | 'low' => {
  if (!deadlineIso) return 'low';

  const deadlineTime = new Date(deadlineIso).getTime();
  if (isNaN(deadlineTime)) return 'low'; // fallback for existing string data like "Tomorrow"

  const now = new Date().getTime();
  const diffHours = (deadlineTime - now) / (1000 * 60 * 60);

  // Deadline sudah lewat -> overdue (TERLAMBAT, urgent)
  if (diffHours < 0) return 'overdue';
  if (diffHours <= 24) return 'high';
  if (diffHours <= 72) return 'medium';
  return 'low';
};

export const formatDeadline = (deadlineIso: string): string => {
  if (!deadlineIso) return '';
  
  const date = new Date(deadlineIso);
  if (isNaN(date.getTime())) return deadlineIso; // fallback for unparseable strings

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
