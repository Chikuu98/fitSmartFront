
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (isNaN(date.getTime())) {
    console.warn('Invalid date string provided:', dateString);
    return 'Unknown date';
  }

  if (diffInMs < 0) {
    return 'Just now';
  }

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

export const formatFullDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    console.warn('Invalid date string provided:', dateString);
    return 'Unknown date';
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    console.warn('Invalid date string provided:', dateString);
    return 'Unknown date';
  }

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const formatTimeOnly = (dateString: string): string => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    console.warn('Invalid date string provided:', dateString);
    return 'Unknown time';
  }

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  
  return date.toDateString() === today.toDateString();
};

export const isYesterday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return date.toDateString() === yesterday.toDateString();
};

export const getDateDifference = (dateString: string): {
  minutes: number;
  hours: number;
  days: number;
  weeks: number;
  months: number;
  years: number;
} => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();

  return {
    minutes: Math.floor(diffInMs / (1000 * 60)),
    hours: Math.floor(diffInMs / (1000 * 60 * 60)),
    days: Math.floor(diffInMs / (1000 * 60 * 60 * 24)),
    weeks: Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7)),
    months: Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30)),
    years: Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365))
  };
};

export const getPlanDayDate = (startDateString: string, dayNumber: number): Date => {
  const startDate = new Date(startDateString);
  const dayDate = new Date(startDate);
  dayDate.setDate(startDate.getDate() + (dayNumber - 1));
  return dayDate;
};

export const calculateCurrentDayNumber = (
  startDateString: string,
  totalPausedDays: number = 0,
  pausedAt?: string | null
): number => {
  const startDate = new Date(startDateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  
  const totalElapsedDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  let currentPausedDays = totalPausedDays;
  if (pausedAt) {
    const pauseDate = new Date(pausedAt);
    pauseDate.setHours(0, 0, 0, 0);
    const daysPausedCurrent = Math.floor((today.getTime() - pauseDate.getTime()) / (1000 * 60 * 60 * 24));
    currentPausedDays = totalPausedDays + daysPausedCurrent;
  }
  
  const activeDays = totalElapsedDays - currentPausedDays;
  
  return Math.max(1, activeDays + 1);
};

export const getAdjustedPlanDayDate = (
  startDateString: string,
  dayNumber: number,
  totalPausedDays: number = 0,
  pausedAt?: string | null,
  status?: string
): Date => {
  const startDate = new Date(startDateString);
  startDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const currentDay = calculateCurrentDayNumber(startDateString, totalPausedDays, status === 'paused' ? pausedAt : null);
  
  if (dayNumber <= currentDay) {
    const dayDate = new Date(startDate);
    dayDate.setDate(startDate.getDate() + (dayNumber - 1));
    return dayDate;
  }
  
  const daysFromNow = dayNumber - currentDay;
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + daysFromNow);
  
  return futureDate;
};

export const formatPlanDay = (
  startDateString: string, 
  dayNumber: number, 
  fallbackName?: string,
  totalPausedDays?: number,
  pausedAt?: string | null,
  status?: string
): string => {
  try {
    const dayDate = (totalPausedDays && totalPausedDays > 0) 
      ? getAdjustedPlanDayDate(startDateString, dayNumber, totalPausedDays, pausedAt, status)
      : getPlanDayDate(startDateString, dayNumber);
    
    if (isNaN(dayDate.getTime())) {
      return fallbackName || `Day ${dayNumber}`;
    }

    const weekday = dayDate.toLocaleDateString('en-US', { weekday: 'short' });
    const date = dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    return `Day ${dayNumber} (${weekday}, ${date})`;
  } catch (error) {
    console.warn('Error formatting plan day:', error);
    return fallbackName || `Day ${dayNumber}`;
  }
};

export const formatPlanDayWithWeekday = (
  startDateString: string, 
  dayNumber: number,
  includeDay: boolean = true,
  totalPausedDays?: number,
  pausedAt?: string | null,
  status?: string
): string => {
  try {
    const dayDate = (totalPausedDays && totalPausedDays > 0)
      ? getAdjustedPlanDayDate(startDateString, dayNumber, totalPausedDays, pausedAt, status)
      : getPlanDayDate(startDateString, dayNumber);
    
    if (isNaN(dayDate.getTime())) {
      return `Day ${dayNumber}`;
    }

    const weekday = dayDate.toLocaleDateString('en-US', { weekday: 'long' });
    
    return includeDay ? `Day ${dayNumber}: ${weekday}` : weekday;
  } catch (error) {
    console.warn('Error formatting plan day with weekday:', error);
    return `Day ${dayNumber}`;
  }
};