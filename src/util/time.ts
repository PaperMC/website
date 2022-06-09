// TODO: Use INTL instead?
export const formatRelativeDate = (date: Date): string => {
  const now = Date.now();
  const secondsPast = (now - date.getTime()) / 1000;

  if (secondsPast < 60) return `${Math.round(secondsPast)} seconds ago`;
  if (secondsPast < 3600) return `${Math.round(secondsPast / 60)} minutes ago`;
  if (secondsPast < 86400) return `${Math.round(secondsPast / 3600)} hours ago`;
  return `${Math.round(secondsPast / 86400)} days ago`;
};
