// Simple date utility functions
export const formatDistanceToNow = (date) => {
  const now = new Date();
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return 'less than a minute';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'}`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'}`;
  } else {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'}`;
  }
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString();
};
