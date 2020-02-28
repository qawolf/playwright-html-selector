import { Browser, chromium, Page } from 'playwright';
import { addHtmlSelectorWeb } from '../src/register';
import { TestUrl } from './utils';

describe('htmlToElement', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
    await addHtmlSelectorWeb(page);
    await page.goto(`${TestUrl}click.html`);
  });

  afterAll(() => browser.close());

  it('it deserializes flat elements', async () => {
    const result = await page.evaluate(() => {
      return (window as any).htmlselector.htmlToElement(
        '<div id="div" data-qa="test"><span>nested</span><span>stuff</span></div>',
      );
    });

    console.log('RESULT', result);
  });

  it('it deserializes nested elements', async () => {});
});
