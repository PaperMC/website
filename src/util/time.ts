// TODO: Use INTL instead?
export const formatRelativeDate = (date: Date): string => {
  const now = Date.now();
  const secondsPast = (now - date.getTime()) / 1000;

  if (secondsPast < 60) return formatRelativeUnit(secondsPast, "second");
  if (secondsPast < 3600) return formatRelativeUnit(secondsPast / 60, "minute");
  if (secondsPast < 86400)
    return formatRelativeUnit(secondsPast / 3600, "hour");

  return formatRelativeUnit(secondsPast / 86400, "day");
};

const formatRelativeUnit = (count: number, unit: string): string => {
  count = Math.round(count);
  if (count !== 1) {
    return `${count} ${unit}s ago`;
  }

  return `${count} ${unit} ago`;
};

export const formatISODate = (date: Date): string => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};
