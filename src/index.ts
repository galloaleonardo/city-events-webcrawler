import 'dotenv/config';
import puppeteer from 'puppeteer';
import * as BrasucaCrawler from 'services/BrasucaCrawler';
import * as PrefeituraCampinasCrawler from 'services/PrefeituraCampinasCrawler';

(async () => {
  const startedWebScraping = performance.now();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setRequestInterception(true);

  page.on('request', (req) => {
    if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
      req.abort();
    } else {
      req.continue();
    }
  });

  const brasucaEvents = await BrasucaCrawler.handle(page);
  const prefeituraCampinasEvents = await PrefeituraCampinasCrawler.handle(page);

  const allEvents = [
    ...brasucaEvents,
    ...prefeituraCampinasEvents,
  ].sort((previous, next) => new Date(previous.startDateTime) - new Date(next.endDateTime));

  const numberOfEvents = allEvents.length;

  await browser.close();

  const finishedWebScraping = performance.now();

  console.log(`Done! ${numberOfEvents} events were crawled in ${((finishedWebScraping - startedWebScraping) / 1000.0).toFixed(2)} seconds.`);
})();
