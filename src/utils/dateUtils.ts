/**
 * Utility functions for date handling and formatting
 */

export const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const parseDate = (dateString: string | null | undefined): Date | null => {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  return isValidDate(date) ? date : null;
};

export const formatDate = (
  dateString: string | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  },
  fallback: string = 'Unknown date'
): string => {
  const date = parseDate(dateString);
  
  if (!date) {
    if (dateString) {
      console.warn('Invalid date string:', dateString);
    }
    return fallback;
  }
  
  return date.toLocaleDateString('en-US', options);
};

export const formatTime = (timestamp: string | null | undefined): string => {
  if (!timestamp) return 'Just now';
  
  const date = parseDate(timestamp);
  
  if (!date) {
    console.warn('Invalid timestamp:', timestamp);
    return 'Just now';
  }
  
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

export const formatRelativeTime = (dateString: string | null | undefined): string => {
  const date = parseDate(dateString);
  
  if (!date) {
    return 'Unknown time';
  }
  
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hours ago`;
  } else if (diffInHours < 168) { // 7 days
    return `${Math.floor(diffInHours / 24)} days ago`;
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  }
};

export const sortByDate = <T>(array: T[], dateField: keyof T, ascending: boolean = true): T[] => {
  return [...array].sort((a, b) => {
    const dateA = parseDate(a[dateField] as string);
    const dateB = parseDate(b[dateField] as string);
    
    if (!dateA && !dateB) return 0;
    if (!dateA) return ascending ? 1 : -1;
    if (!dateB) return ascending ? -1 : 1;
    
    return ascending 
      ? dateA.getTime() - dateB.getTime()
      : dateB.getTime() - dateA.getTime();
  });
};
