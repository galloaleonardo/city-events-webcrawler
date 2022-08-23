import { Page } from 'puppeteer-core';
import Event from 'interfaces/Event';

export async function handle(pageInstance: Page) {
  const pageURL = process.env.SHOWS_CAMPINAS_BLOG_URL;

  await pageInstance.goto(pageURL, { waitUntil: 'domcontentloaded' });

  const eventsWithIncompleteDate = pageInstance.evaluate(() => {
    document.querySelectorAll('b[style*="font-family: inherit; font-size: xx-large; text-align: center;"]')[1]?.parentElement?.remove();

    const eventList = document.querySelectorAll('a');

    const events = [...eventList].filter((event) => {
      const isValidEvent = event?.getAttribute('target') === '_blank';

      const infoEvent = event.innerHTML?.replace(/<[^>]*>?/gm, '')?.replace('&nbsp;', ' ')?.replace('&amp;', 'e')?.trim();

      const isCampinasEvent = infoEvent?.substring(infoEvent.length - 8) === 'Campinas';

      const haveEventDate = Number(infoEvent?.substring(0, 2)) && infoEvent?.includes('-');

      return isValidEvent && isCampinasEvent && haveEventDate;
    }).map((event) => {
      const infoEvent = event.innerHTML?.replace(/<[^>]*>?/gm, '')?.replace('&nbsp;', ' ')?.replace('&amp;', 'e')?.trim();

      const titleWithouCity = infoEvent?.replace(' - Campinas', '');
      const title = titleWithouCity.substring(5);

      const dayOfDate = infoEvent.substring(0, 2);

      return {
        title,
        startDateTime: dayOfDate,
        endDateTime: dayOfDate,
        crawledOn: 'Shows Campinas',
        website: 'http://www.showscampinas.com.br/p/agenda.html',
      } as Event;
    });

    return events;
  });

  const today = new Date();
  const currentDay = today.getDay();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  let lastEventDay: number;
  let lastEventMonth: number;
  let lastEventYear: number;

  const events = (await eventsWithIncompleteDate).map((event) => {
    let eventMonth: number;
    let eventYear: number;

    const eventDay = Number(event.startDateTime);

    if (!lastEventMonth && !lastEventYear) {
      if (eventDay < currentDay) {
        if (lastEventMonth === 12) {
          eventMonth = 1;
          lastEventMonth = 1;

          eventYear = currentYear + 1;
          lastEventYear = currentYear + 1;
        } else {
          eventMonth = currentMonth + 1;
          lastEventMonth = currentMonth + 1;

          eventYear = currentYear;
          lastEventYear = currentYear;
        }
      } else {
        eventMonth = currentMonth;
        lastEventMonth = currentMonth;

        eventYear = currentYear;
        lastEventYear = currentYear;
      }
    } else if (eventDay >= lastEventDay) {
      eventMonth = lastEventMonth;

      eventYear = lastEventYear;
    } else if (eventDay < lastEventDay) {
      if (lastEventMonth === 12) {
        eventMonth = 1;
        lastEventMonth = 1;

        eventYear = currentYear + 1;
        lastEventYear = currentYear + 1;
      } else {
        eventMonth = currentMonth + 1;
        lastEventMonth = currentMonth + 1;

        eventYear = currentYear;
        lastEventYear = currentYear;
      }
    }

    lastEventDay = Number(event.startDateTime);

    const strEventDay = String(eventDay).padStart(2, '0');
    const strEventMonth = String(eventMonth).padStart(2, '0');
    const strEventYear = String(eventYear);

    const date = `${strEventYear}-${strEventMonth}-${strEventDay} 00:00:00`;

    return {
      ...event,
      startDateTime: date,
      endDateTime: date,
    } as Event;
  });

  return events;
}
