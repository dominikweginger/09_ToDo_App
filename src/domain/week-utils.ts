import { toDateKey } from './date-utils';

export function addDays(dateKey: string, amount: number): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + amount);
  return toDateKey(date);
}

export function startOfWeek(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay() || 7;
  date.setDate(date.getDate() - dayOfWeek + 1);
  return toDateKey(date);
}

export function weekDays(anchor: string): string[] {
  const monday = startOfWeek(anchor);
  return Array.from({ length: 7 }, (_, index) => addDays(monday, index));
}

export function isInWeek(dateKey: string | null, anchor: string): boolean {
  if (!dateKey) return false;
  const days = weekDays(anchor);
  return dateKey >= days[0] && dateKey <= days[6];
}
