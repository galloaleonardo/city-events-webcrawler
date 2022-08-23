import chromium from 'chrome-aws-lambda';
import 'dotenv/config';
import { Browser } from 'puppeteer-core';
import Event from './interfaces/Event';
import { BaseCrawler } from './services/BaseCrawler';

(async () => {
  const startedWebScraping: number = performance.now();

  const browser: Browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
  });

  const crawler: BaseCrawler = new BaseCrawler(browser);

  const events: Event[] = await crawler.handle();

  const numberOfEvents = events.length;

  const finishedWebScraping = performance.now();

  console.log(`Done! ${numberOfEvents} events were crawled in ${((finishedWebScraping - startedWebScraping) / 1000.0).toFixed(2)} seconds.`);
})();
