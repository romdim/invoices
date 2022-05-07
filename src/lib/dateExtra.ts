export const addDays = (date: Date, days: number): Date => new Date(date.getFullYear(), date.getMonth() + 1, date.getDay() + days);
export const lastDayOfMonth = (date: Date): Date => (new Date(date.getFullYear(), date.getMonth()+1, 0));
export const daysInMonth = (date: Date): number => lastDayOfMonth(date).getDate();

export const lastWorkingDay = (date: Date): Date => {
  const lastDate: Date = lastDayOfMonth(date);
  const dayOfWeek: number = lastDate.getDay();
  return dayOfWeek === 0 ? addDays(lastDate, -2) : dayOfWeek === 6 ? addDays(lastDate, -1) : lastDate;
}

export const firstDayOfMonth = (date: Date): Date => {
  const newDate: Date = new Date(date);
  newDate.setDate(1);
  return newDate;
}

export const nextMonth = (date: Date): Date => {
  const newDate: Date = new Date(date);
  newDate.setMonth(newDate.getMonth()+1);
  return newDate;
};

export const isWeekday = (date: Date): boolean => {
  const dayOfWeek: number = date.getDay();
  return dayOfWeek !== 0 && dayOfWeek !== 6;
}

export const prependZero = (number: number): string => number < 10 ? '0' + number : number.toString();
export const formatDate = (date: Date): string => `${date.getFullYear()}-${prependZero(date.getMonth()+1)}-${prependZero(date.getDate())}`

export default {
  addDays,
  daysInMonth,
  firstDayOfMonth,
  formatDate,
  isWeekday,
  lastDayOfMonth,
  lastWorkingDay,
  nextMonth,
  prependZero
};
