import 'dotenv/config';
import puppeteer, { Browser } from 'puppeteer';
import Event from './interfaces/Event';
import { BaseCrawler } from './services/BaseCrawler';

(async () => {
  const startedWebScraping: number = performance.now();

  const browser: Browser = await puppeteer.launch();

  const crawler: BaseCrawler = new BaseCrawler(browser);

  const events: Event[] = await crawler.handle();

  const numberOfEvents = events.length;

  const finishedWebScraping = performance.now();

  console.log(`Done! ${numberOfEvents} events were crawled in ${((finishedWebScraping - startedWebScraping) / 1000.0).toFixed(2)} seconds.`);
})();
