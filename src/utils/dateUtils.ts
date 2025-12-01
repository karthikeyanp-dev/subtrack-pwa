export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getDaysUntilExpiration = (endDate: string): number => {
  const today = new Date();
  const expiration = new Date(endDate);
  const diffTime = expiration.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const isExpiringSoon = (endDate: string, days: number = 7): boolean => {
  const daysUntil = getDaysUntilExpiration(endDate);
  return daysUntil <= days && daysUntil >= 0;
};

export const isExpired = (endDate: string): boolean => {
  return getDaysUntilExpiration(endDate) < 0;
};

export const calculateEndDate = (startDate: string, subscriptionType: string): string => {
  const start = new Date(startDate);
  const end = new Date(start);

  switch (subscriptionType) {
    case 'Weekly':
      end.setDate(start.getDate() + 7);
      break;
    case 'Monthly':
      end.setMonth(start.getMonth() + 1);
      break;
    case 'Yearly':
      end.setFullYear(start.getFullYear() + 1);
      break;
    default:
      return startDate;
  }

  return end.toISOString().split('T')[0];
};
