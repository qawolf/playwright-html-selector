import { Browser, Page } from 'playwright';
import { launch } from 'playwright-utils';
import { addHtmlSelectorWeb } from '../../src/register';
import { HtmlSelectorWeb } from '../../src/web';
import { TestUrl } from '../utils';

describe('htmlToElement', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await launch();
    page = await browser.newPage();
    await addHtmlSelectorWeb(page);
    await page.goto(`${TestUrl}click.html`);
  });

  afterAll(() => browser.close());

  it('it deserializes flat elements', async () => {
    const result = await page.evaluate(() => {
      const htmlselector: HtmlSelectorWeb = (window as any).htmlselector;
      const element = htmlselector.htmlToElement(
        "<input data-qa='test-input' id='secret' placeholder='Password' type='password' />",
      );

      return htmlselector.serializeElementAndDescendants(element);
    });

    expect(result).toEqual([
      {
        'data-qa': 'test-input',
        id: 'secret',
        innerText: '',
        placeholder: 'Password',
        type: 'password',
        tagName: 'input',
      },
    ]);
  });

  it('it deserializes nested elements', async () => {
    const result = await page.evaluate(() => {
      const htmlselector: HtmlSelectorWeb = (window as any).htmlselector;
      const element = htmlselector.htmlToElement(
        "<div class='container'><label data-test='label'>Password <b>Secret</b></label><input data-qa='test-input' id='secret' placeholder='Password' type='password' /></div>",
      );

      return htmlselector.serializeElementAndDescendants(element);
    });

    expect(result).toEqual([
      {
        class: 'container',
        innerText: 'Password Secret',
        tagName: 'div',
      },
      {
        'data-test': 'label',
        innerText: 'Password Secret',
        tagName: 'label',
      },
      {
        innerText: 'Secret',
        tagName: 'b',
      },
      {
        'data-qa': 'test-input',
        id: 'secret',
        innerText: '',
        placeholder: 'Password',
        type: 'password',
        tagName: 'input',
      },
    ]);
  });
});
