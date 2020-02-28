import { Browser, chromium, Page } from 'playwright';
// import { htmlToElement } from '../src/htmlToElement';
import { TestUrl } from './utils';

describe('htmlToElement', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();

    await page.goto(`${TestUrl}click.html`);
    await page.evaluate(() => {
      (window as any).htmlToElement = (html: string): HTMLElement => {
        const template = document.createElement('template');
        html = html.trim(); // remove whitespace
        template.innerHTML = html;

        return template.content.firstChild as HTMLElement;
      };
    });
  });

  afterAll(() => browser.close());

  it('it deserializes flat elements', async () => {
    const result = await page.evaluate(() => {
      return (window as any).htmlToElement(
        '<div id="div" data-qa="test"><span>nested</span><span>stuff</span></div>',
      );
    });

    console.log('RESULT', result);
  });

  it('it deserializes nested elements', async () => {});
});
