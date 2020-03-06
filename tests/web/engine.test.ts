import { Browser, Page } from 'playwright';
import { launch } from 'playwright-utils';
import { register } from '../../src/register';
import { TestUrl } from '../utils';

describe('html selector', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    await register();

    browser = await launch();
    page = await browser.newPage();
    await page.goto(`${TestUrl}click.html`);
  });

  afterAll(() => browser.close());

  describe('query', () => {
    it('returns strongest match to selector', async () => {
      const elementHandle = await page.$('html=<button id="button" />');
      const id = await page.evaluate(element => element.id, elementHandle);
      expect(id).toBe('button');
    });

    it('returns null if good enough match not found', async () => {
      const elementHandle = await page.$('html=<textarea />');
      expect(elementHandle).toBeNull();
    });
  });

  describe('queryAll', () => {
    it('returns array of matches ordered by strength', async () => {
      const elementHandles = await page.$$(
        'html=<button class="button" id="third" qaw_innertext="Second Button" />',
      );
      expect(elementHandles).toHaveLength(2);

      const id = await page.evaluate(element => element.id, elementHandles[0]);
      expect(id).toBe('third');

      const id2 = await page.evaluate(element => element.id, elementHandles[1]);
      expect(id2).toBe('second');
    });

    it('returns empty array if no good enough matches found', async () => {
      const elementHandles = await page.$$('html=<textarea />');
      expect(elementHandles).toEqual([]);
    });
  });
});
