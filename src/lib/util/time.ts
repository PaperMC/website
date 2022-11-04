// TODO: Use INTL instead?
export const formatRelativeDate = (date: Date): string => {
  const now = Date.now();
  const secondsPast = (now - date.getTime()) / 1000;

  if (secondsPast < 60) return formatRelativeUnit(secondsPast, "second");
  if (secondsPast < 3600) return formatRelativeUnit(secondsPast / 60, "minute");
  if (secondsPast < 86400)
    return formatRelativeUnit(secondsPast / 3600, "hour");

  const days = secondsPast / 86400;
  if (days > 7) return formatISODate(date);

  return formatRelativeUnit(days, "day");
};

const formatRelativeUnit = (count: number, unit: string): string => {
  count = Math.round(count);
  if (count !== 1) {
    return `${count} ${unit}s ago`;
  }

  return `${count} ${unit} ago`;
};

export const formatISODate = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

export const formatISODateTime = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}`;
};

export const formatISOFullTime = (date: Date): string => {
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");
  return `${hour}:${minute}:${second}`;
};
