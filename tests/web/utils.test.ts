import { Browser, Page } from 'playwright';
import { launch } from 'playwright-utils';
import { addHtmlSelectorWeb } from '../../src/register';
import { HtmlSelectorWeb } from '../../src/web';
import { TestUrl } from '../utils';

let browser: Browser;
let page: Page;

describe('utils', () => {
  beforeAll(async () => {
    browser = await launch();
    page = await browser.newPage();
    await addHtmlSelectorWeb(page);
    await page.goto(`${TestUrl}click.html`);
  });

  afterAll(() => browser.close());

  describe('serializeAttributes', () => {
    it('serializes attributes including labels', async () => {
      const result = await page.evaluate(() => {
        const htmlselector: HtmlSelectorWeb = (window as any).htmlselector;
        const checkbox = document.getElementById('checkbox');

        return htmlselector.serializeAttributes(checkbox);
      });

      expect(result).toEqual({
        id: 'checkbox',
        labels: 'Check me!',
        type: 'checkbox',
      });
    });
  });
});
