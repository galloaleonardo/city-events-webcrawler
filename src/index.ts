import puppeteer from 'puppeteer';
import Event from './interfaces/Event';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://brasucabar.com.br/', { waitUntil: 'domcontentloaded' });

  const dale = await page.evaluate(() => {
    const eventList = document.querySelectorAll('section.elementor-section');

    const events = [...eventList].map((event) => {
      const eventInfo = event.querySelectorAll('div.elementor-widget-wrap')[1];

      const dateTimeInfo = eventInfo.querySelector('div');
      const descriptionInfo = eventInfo.querySelector('div')?.nextElementSibling;

      const date = dateTimeInfo.querySelector('h2.elementor-heading-title.elementor-size-default > b')?.innerHTML;
      const fullTime = dateTimeInfo.querySelector('h2.elementor-heading-title.elementor-size-default > i')?.innerHTML;

      const time = fullTime.substring(fullTime.indexOf('às') + 2).trim();

      const descriptionRaw = descriptionInfo.querySelector<HTMLUListElement>('h2.elementor-heading-title.elementor-size-default')?.innerHTML;

      const description = descriptionRaw.replace(/<[^>]*>?/gm, '').toLowerCase().replace(/\b[a-z]/g, (match) => match.toUpperCase());

      return {
        title: description,
        date,
        time,
        place: 'Brasuca',
        placeLink: 'https://brasucabar.com.br/',
      } as Event;
    });

    return events;
  });

  await browser.close();
})();
