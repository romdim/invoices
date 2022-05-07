import type { EventInput } from 'svelte-fullcalendar';
import Holidays, { type HolidaysTypes } from 'date-holidays';
const hd = new Holidays('NL');

import {
  daysInMonth,
  isWeekday
} from '../lib/dateExtra';

export const workEvents = (firstDay: Date): EventInput[] => [ ...Array(daysInMonth(firstDay)).keys() ]
      .map((i: number): Date => {const date = new Date(firstDay); return new Date(date.setDate(date.getDate()+i))})
      .filter((date: Date): boolean => isWeekday(date))
      .filter((date: Date): boolean => !hd.isHoliday(date) ||
                                      ((<HolidaysTypes.Holiday[]>hd.isHoliday(date))[0].type !== 'public' &&
                                      (<HolidaysTypes.Holiday[]>hd.isHoliday(date))[0].type !== 'bank'))
      .map((date: Date) => ({
        id: date.getDate().toString(),
        title: 'work',
        start: date,
        allDay: true
      }));

export const holidayEvents = (firstDay: Date): EventInput[] => hd.getHolidays(firstDay.getFullYear())
      .map((holiday: HolidaysTypes.Holiday) => ({
        id: 'holiday',
        title: `${holiday.name}\n${holiday.type}`,
        start: holiday.start,
        end: holiday.end,
        allDay: true,
        backgroundColor: 'white',
        textColor: '#3788d8'
      }));
