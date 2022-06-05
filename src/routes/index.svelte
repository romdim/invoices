<script lang="ts">
  import FullCalendar, { type CalendarOptions, type EventInput } from 'svelte-fullcalendar';
  import daygridPlugin from '@fullcalendar/daygrid';
  import interactionPlugin from '@fullcalendar/interaction';

  import type Company from '../types/company';
  import type Payment from '../types/payment';

  import {
    firstDayOfMonth,
    nextMonth
  } from '../lib/dateExtra';
  import { holidayEvents, workEvents } from '../lib/events';
  import pdf from '../lib/pdf';

  import DataFile from '../components/data.svelte';
  let dataFile;
  let data: {
    billing: Company;
    vendor: Company;
    payment: Payment;
  };
  let billing: Company;
  let vendor: Company;
  let payment: Payment;
  $: if (data) ({ billing, vendor, payment } = data);

  const daysOfWeek: number[] = [ ...Array(5).keys() ].map( i => i+1 );

  let calendarRef: FullCalendar;
  let options: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [ daygridPlugin, interactionPlugin ],
    fixedWeekCount: false,
    businessHours: {
      daysOfWeek
    },
    firstDay: 1,
    height: "100vh",
    headerToolbar: {
      left: 'title',
      center: 'data printInvoice',
      right: 'today prev,next'
    },
    customButtons: {
      data: {
        text: 'Data',
        click: () => {
          dataFile.click();
        }
      },
      printInvoice: {
        text: 'Invoice',
        click: () => {
          const calendarApi = calendarRef.getAPI();
          const days = calendarApi.getEvents().filter(event => event._def.title === 'work').length;
          
          if (data) {
            payment.date = calendarApi.view.currentStart;
            pdf(billing, vendor, payment, days);
          }
        }
      }
    },

    events: (info): PromiseLike<EventInput[]> => {
      // info.start contains the first day that is in view which is most likely from the previous month
      const eventDay = info.start.getDate() === 1 ? info.start : nextMonth(firstDayOfMonth(info.start));
      return new Promise((resolve) => resolve(workEvents(eventDay).concat(holidayEvents(eventDay))));
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
<DataFile bind:this={dataFile} bind:data={data} />
