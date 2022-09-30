import chromium from 'chrome-aws-lambda';
import 'dotenv/config';
import { Browser } from 'puppeteer-core';
import * as AppLogger from './infra/AppLogger';
import Event from './interfaces/Event';
import { BaseCrawler } from './services/BaseCrawler';

const index = async (event: any) => {
  try {
    AppLogger.info('Received Event!', event);

    const browser: Browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      dumpio: true,
    });

    const crawler: BaseCrawler = new BaseCrawler(browser);

    const events: Event[] = await crawler.handle();

    const numberOfEvents = events.length;

    AppLogger.info('Events: ', events);

    AppLogger.info(`Done! ${numberOfEvents} events were crawled.`);
  } catch (error) {
    AppLogger.err('Error performing scrap.', error);
  }
};

if (process.env.NODE_ENV === 'local') {
  (async () => {
    await index({});
  })();
}

exports.handler = async (event: any) => {
  await index(event);
};
