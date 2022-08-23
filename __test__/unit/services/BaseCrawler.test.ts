import puppeteer, { Browser } from 'puppeteer-core';
import { BaseCrawler } from '../../../src/services/BaseCrawler';
import EventMock from '../../mocks/EventMock';

// eslint-disable-next-line no-promise-executor-return
const sleep = (ms:number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('BaseCrawler Class', () => {
  jest.spyOn(BaseCrawler.prototype as any, 'getOrderedCrawledEvents').mockImplementation(() => Promise.resolve(EventMock));

  afterEach(async () => {
    await sleep(1000);
  });

  it('handle', async () => {
    const browser: Browser = await puppeteer.launch();

    const crawler: BaseCrawler = new BaseCrawler(browser);

    const events = await crawler.handle();

    expect(events).toBe(EventMock);
  });
});
