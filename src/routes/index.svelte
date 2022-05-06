<script lang="ts">
  import FullCalendar, { type CalendarOptions, type EventInput } from 'svelte-fullcalendar';
  import daygridPlugin from '@fullcalendar/daygrid';
  import interactionPlugin from '@fullcalendar/interaction';
  import Holidays, { type HolidaysTypes } from 'date-holidays';
  const hd = new Holidays('NL');

  // const isWeekend = (dayOfWeek: Number): boolean => {
  //   return dayOfWeek === 0 || dayOfWeek === 6;
  // }

  const daysOfWeek = [ ...Array(5).keys() ].map( i => i+1 );
  const firstDayNextMonth = (date: Date): Date => {
    let newDate = new Date(date);
    newDate.setMonth(newDate.getMonth()+1);
    newDate.setDate(1);
    return newDate;
  };

  const daysInMonth = (date: Date): Number => (new Date(date.getFullYear(), date.getMonth()+1, 0)).getDate();

  let calendarRef: FullCalendar;

  let options: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [ daygridPlugin, interactionPlugin ],
    fixedWeekCount: false,
    businessHours: {
      daysOfWeek
    },
    firstDay: 1,
    events: (info): PromiseLike<EventInput[]> => {
      const eventDay = info.start.getDate() === 1 ? info.start : firstDayNextMonth(info.start);
      const holidaysArray = hd.getHolidays(eventDay.getFullYear());

      let events: EventInput[] = [ ...Array(daysInMonth(eventDay)).keys() ]
        .map((i: number): Date => {const date = new Date(eventDay); return new Date(date.setDate(date.getDate()+i))})
        .filter((date: Date): boolean => date.getDay() !== 0 && date.getDay() !== 6)
        .filter((date: Date): boolean => !hd.isHoliday(date) ||
                                         ((<HolidaysTypes.Holiday[]>hd.isHoliday(date))[0].type !== 'public' &&
                                         (<HolidaysTypes.Holiday[]>hd.isHoliday(date))[0].type !== 'bank'))
        .map((date: Date) => ({
          id: date.getDate().toString(),
          title: 'work',
          start: date,
          allDay: true
        }));

      const holidayEvents: EventInput[] = holidaysArray.map((holiday: HolidaysTypes.Holiday) => ({
        id: 'holiday',
        title: `${holiday.name}\n${holiday.type}`,
        start: holiday.start,
        end: holiday.end,
        allDay: true,
        backgroundColor: 'white',
        textColor: '#3788d8'
      }));

      return new Promise((resolve) => resolve(events.concat(holidayEvents)));
    },
    eventContent: function(arg) {
      return {
        html: arg.event.title.replace(/\n/g, '<br />')
      }
    },
    eventClick: (info) => {
      if (info.event.id !== 'holiday') {
        info.event.remove();
      }
    },
    dateClick: (info) => {
      const calendarApi = calendarRef.getAPI();
      const id = info.date.getDate().toString();
      if (!calendarApi.getEventById(id)) {
        calendarApi.addEvent({
          id,
          title: 'work',
          start: info.date,
          allDay: true
        });
      }
    }
  };
</script>

<FullCalendar bind:this={calendarRef} {options} />
