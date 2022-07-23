import { Page } from 'puppeteer';
import Event from 'interfaces/Event';

export async function handle(pageInstance: Page): Promise<Event[]> {
  const pageURL = process.env.BRASUCA_URL;

  await pageInstance.goto(pageURL, { waitUntil: 'domcontentloaded' });

  return pageInstance.evaluate(() => {
    const eventList = document.querySelectorAll('section.elementor-section');

    const events = [...eventList].map((event) => {
      const eventInfo = event.querySelectorAll('div.elementor-widget-wrap')[1];

      const dateTimeInfo = eventInfo.querySelector('div');
      const descriptionInfo = eventInfo.querySelector('div')?.nextElementSibling;

      const fullTime = dateTimeInfo.querySelector('h2.elementor-heading-title.elementor-size-default > i')?.innerHTML;

      const rawTime = fullTime.substring(fullTime.indexOf('às') + 2).trim();

      const rawDateWithoutYear = dateTimeInfo.querySelector('h2.elementor-heading-title.elementor-size-default > b')?.innerHTML;
      const rawDateWithYear = `${rawDateWithoutYear}/${new Date().getFullYear()}`;

      const [day, month, year] = rawDateWithYear.split('/');

      const time = rawTime.length === 3 ? `${rawTime.substring(0, 2)}:00:00` : `${rawTime.substring(0, 2)}:${rawTime.substring(3, 2)}:00`;

      const dateTime = new Date(`${year}-${month}-${day} ${time}`).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

      const descriptionRaw = descriptionInfo.querySelector<HTMLUListElement>('h2.elementor-heading-title.elementor-size-default')?.innerHTML;

      const description = descriptionRaw.replace(/<[^>]*>?/gm, '').toLowerCase().replace(/\b[a-z]/g, (match) => match.toUpperCase());

      return {
        title: description,
        startDateTime: dateTime,
        place: 'Brasuca',
        placeWebsite: 'https://brasucabar.com.br',
      } as Event;
    });

    console.log(events);

    return events;
  });
}
