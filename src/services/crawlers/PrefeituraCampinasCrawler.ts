import { Page } from 'puppeteer';
import Event from 'interfaces/Event';

export async function handle(pageInstance: Page) {
  const pageURL = process.env.PREFEITURA_CAMPINAS_URL;

  await pageInstance.goto(pageURL, { waitUntil: 'domcontentloaded' });

  return pageInstance.evaluate(() => {
    const eventList = document.querySelectorAll('div.post25.w-clearfix');

    const events = [...eventList].filter((event) => {
      const rawDate = event.querySelector('a.w_titulo_post25 > div.subcattxt_com_ag')?.innerHTML;

      return rawDate?.includes('/');
    }).map((event) => {
      const title = event.querySelector('a.w_titulo_post25 > h3')?.innerHTML;
      const dateTime = event.querySelector('a.w_titulo_post25 > div.subcattxt_com_ag')?.innerHTML;

      let startDateTime;
      let endDateTime;

      if (dateTime.length === 5 || dateTime.includes(',')) {
        const rawDateWithoutYear = dateTime.substring(0, 5);
        const rawDateWithYear = `${rawDateWithoutYear}/${new Date().getFullYear()}`;

        const [day, month, year] = rawDateWithYear.split('/');

        startDateTime = `${year}-${month}-${day} 00:00:00`;
      } else if (dateTime.length === 13) {
        const startRawDateWithoutYear = dateTime.substring(0, 5);
        const startRawDateWithYear = `${startRawDateWithoutYear}/${new Date().getFullYear()}`;

        const [startDay, startMonth, startYear] = startRawDateWithYear.split('/');

        startDateTime = `${startYear}-${startMonth}-${startDay} 00:00:00`;

        const endRawDateWithoutYear = dateTime.substring(dateTime.length - 5);
        const endRawDateWithYear = `${endRawDateWithoutYear}/${new Date().getFullYear()}`;

        const [endDay, endMonth, endYear] = endRawDateWithYear.split('/');

        endDateTime = `${endYear}-${endMonth}-${endDay} 00:00:00`;
      }

      return {
        title,
        startDateTime,
        endDateTime: endDateTime ?? startDateTime,
        crawledOn: 'Prefeitura Campinas',
        website: 'https://campinas.com.br/cultura',
      } as Event;
    });

    return events;
  });
}
