import {
  Browser, Page,
} from 'puppeteer-core';
import * as PrefeituraCampinasCrawler from './crawlers/PrefeituraCampinasCrawler';
import * as ShowCampinasBlogCrawler from './crawlers/ShowsCampinasBlogCrawler';
import * as BrasucaCrawler from './crawlers/BrasucaCrawler';
import Event from '../interfaces/Event';

export class BaseCrawler {
  private browser: Browser;

  private page: Page;

  constructor(browser: Browser) {
    this.browser = browser;
  }

  public async handle(): Promise<Event[]> {
    this.page = await this.browser.newPage();

    this.ignoreInsignificantRequests(this.page);

    const events: Event[] = await this.getOrderedCrawledEvents(this.page);

    this.browser.close();

    return events;
  }

  private async ignoreInsignificantRequests(page: Page): Promise<void> {
    await page.setRequestInterception(true);

    page.on('request', (req) => {
      if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });
  }

  private async getOrderedCrawledEvents(page: Page): Promise<Event[]> {
    return [
      ...await BrasucaCrawler.handle(page),
      // ...await PrefeituraCampinasCrawler.handle(page),
      // ...await ShowCampinasBlogCrawler.handle(page),
    ].sort((previous, next) => +new Date(previous.startDateTime) - +new Date(next.startDateTime));
  }
}
