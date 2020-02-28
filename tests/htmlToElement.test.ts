import { Browser, chromium, Page } from 'playwright';
import { addHtmlSelectorWeb } from '../src/register';
import { TestUrl } from './utils';

describe('htmlToElement', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch({ headless: false });
    page = await browser.newPage();
    await addHtmlSelectorWeb(page);
    await page.goto(`${TestUrl}click.html`);
  });

  afterAll(() => browser.close());

  it('it deserializes flat elements', async () => {
    const result = await page.evaluate(() => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const element = (window as any).htmlselector.htmlToElement(
        "<input data-qa='test-input' id='secret' placeholder='Password' type='password' />",
      );

      return (window as any).htmlselector.serializeElementAndDescendants(
        element,
      );
      /* eslint-enable @typescript-eslint/no-explicit-any */
    });

    expect(result).toEqual([
      {
        'data-qa': 'test-input',
        id: 'secret',
        placeholder: 'Password',
        type: 'password',
        tagName: 'input',
        textContent: '',
      },
    ]);
  });

  it('it deserializes nested elements', async () => {
    const result = await page.evaluate(() => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const element = (window as any).htmlselector.htmlToElement(
        "<div class='container'><label data-test='label'>Password <b>Secret</b></label><input data-qa='test-input' id='secret' placeholder='Password' type='password' /></div>",
      );

      return (window as any).htmlselector.serializeElementAndDescendants(
        element,
      );
      /* eslint-enable @typescript-eslint/no-explicit-any */
    });

    expect(result).toEqual([
      {
        class: 'container',
        tagName: 'div',
        textContent: 'Password Secret',
      },
      {
        'data-test': 'label',
        tagName: 'label',
        textContent: 'Password Secret',
      },
      {
        tagName: 'b',
        textContent: 'Secret',
      },
      {
        'data-qa': 'test-input',
        id: 'secret',
        placeholder: 'Password',
        type: 'password',
        tagName: 'input',
        textContent: '',
      },
    ]);
  });
});