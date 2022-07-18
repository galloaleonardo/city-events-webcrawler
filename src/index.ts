import 'dotenv/config';
import puppeteer from 'puppeteer';
import * as BrasucaCrawler from 'services/BrasucaCrawler';

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

  await browser.close();

  const finishedWebScraping = performance.now();

  console.log(`Web scraping just finished in ${((finishedWebScraping - startedWebScraping) / 1000.0).toFixed(2)} seconds.`);
})();
