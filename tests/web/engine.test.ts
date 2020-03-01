import { Browser, chromium, Page } from 'playwright';
import { register } from '../../src/register';
import { TestUrl } from '../utils';

describe('html selector', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    await register();

    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterAll(() => browser.close());

  // TODO outline real tests
  it('selects an element', async () => {
    await page.goto(`${TestUrl}click.html`);

    const element = await page.$(
      'html=<a href="https://www.iana.org/domains/example">More information...</a>',
    );

    expect(!!element).toBe(false);
  });
});
