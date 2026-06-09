export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function isBeforeDate(dateKey: string, compareKey = todayKey()): boolean {
  return dateKey < compareKey;
}

export function formatDateLabel(dateKey: string | null): string {
  if (!dateKey) return 'Ohne Datum';
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Intl.DateTimeFormat('de-AT', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(year, month - 1, day));
}

export function monthDays(anchor: string): string[] {
  const [year, month] = anchor.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  const days: string[] = [];
  while (date.getMonth() === month - 1) {
    days.push(toDateKey(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}
