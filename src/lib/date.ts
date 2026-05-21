export function toReiwa(year: number): number {
  return year - 2018;
}

export function parseDateParts(dateStr: string): {
  eraYear: string;
  month: string;
  day: string;
} {
  let year: number, month: number, day: number;
  if (dateStr.includes('-')) {
    [year, month, day] = dateStr.split('-').map(Number);
  } else {
    year = parseInt(dateStr.slice(0, 4), 10);
    month = parseInt(dateStr.slice(4, 6), 10);
    day = parseInt(dateStr.slice(6, 8), 10);
  }
  return {
    eraYear: String(toReiwa(year)),
    month: String(month),
    day: String(day),
  };
}

export function parseDateTimeParts(datetimeLocal: string): {
  eraYear: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
} {
  const [datePart, timePart] = datetimeLocal.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  return {
    eraYear: String(toReiwa(year)),
    month: String(month),
    day: String(day),
    hour: String(hour),
    minute: String(minute).padStart(2, '0'),
  };
}

export function formatFileDate(dateStr: string): string {
  return dateStr.replace(/-/g, '');
}
