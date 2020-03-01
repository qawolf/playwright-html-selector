import { Browser, chromium, Page } from 'playwright';
import { ElementComparison } from '../../src/web/compare';
import { addHtmlSelectorWeb } from '../../src/register';
import { HtmlSelectorWeb } from '../../src/web';
import { TestUrl } from '../utils';

let browser: Browser;
let page: Page;

const buildCompareFunction = (
  functionName:
    | 'compareAttributes'
    | 'compareElements'
    | 'isTagSame'
    | 'isTextSame',
): ((a: string, b: string) => Promise<ElementComparison | boolean>) => {
  return (a: string, b: string): Promise<ElementComparison | boolean> => {
    return page.evaluate(
      (functionName, a, b) => {
        const htmlselector: HtmlSelectorWeb = (window as any).htmlselector;
        const elementA = htmlselector.htmlToElement(a);
        const elementB = htmlselector.htmlToElement(b);

        return htmlselector[functionName](elementA, elementB);
      },
      functionName,
      a,
      b,
    );
  };
};

const compareAttributes = buildCompareFunction('compareAttributes');
const compareElements = buildCompareFunction('compareElements');
const isTagSame = buildCompareFunction('isTagSame');
const isTextSame = buildCompareFunction('isTextSame');

describe('compare', () => {
  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
    await addHtmlSelectorWeb(page);
    await page.goto(`${TestUrl}click.html`);
  });

  afterAll(() => browser.close());

  describe('compareAttributes', () => {
    it('returns all attributes and matching attributes', async () => {
      const result = await compareAttributes(
        '<a data-qa="home" id="link">Home</a>',
        '<a data-qa="home" id="link2">Home</a>',
      );

      expect(result).toEqual({
        attributes: ['data-qa', 'id'],
        matchingAttributes: ['data-qa'],
      });
    });

    it('handles attributes with multiple values', async () => {
      const result = await compareAttributes(
        '<a class="submit" data-qa="home" id="link">Home</a>',
        '<a class="logo submit" data-qa="home" id="link2">Home</a>',
      );

      expect(result).toEqual({
        attributes: ['class.submit', 'class.logo', 'data-qa', 'id'],
        matchingAttributes: ['class.submit', 'data-qa'],
      });
    });

    it('ignores data-reactid', async () => {
      const result = await compareAttributes(
        '<a class="submit" data-qa="home" data-reactid="node" id="link">Home</a>',
        '<a class="logo submit" data-reactid="node" data-qa="home" id="link2">Home</a>',
      );

      expect(result).toEqual({
        attributes: ['class.submit', 'class.logo', 'data-qa', 'id'],
        matchingAttributes: ['class.submit', 'data-qa'],
      });
    });
  });

  describe('compareElements', () => {
    it('returns all attributes and matching attributes including tag and innerText', async () => {
      const result = await compareElements(
        '<a class="submit" data-qa="home" id="link">\ngit is great   </a>',
        '<a class="logo submit" data-reactid="node" data-qa="home" id="link2">git is   great</a>',
      );

      expect(result).toEqual({
        attributes: [
          'class.submit',
          'class.logo',
          'data-qa',
          'id',
          'innerText',
          'tag',
        ],
        matchingAttributes: ['class.submit', 'data-qa', 'innerText', 'tag'],
      });
    });
  });

  describe('isTagSame', () => {
    it('returns true if tag names the same', async () => {
      expect(
        await isTagSame('<a>git is great</a>', '<a>git is great</a>'),
      ).toBe(true);
    });

    it('returns false if tag names differ', async () => {
      expect(
        await isTagSame('<p>git is great</p>', '<a>git is great</a>'),
      ).toBe(false);

      expect(await isTagSame('<input />', '<textarea />')).toBe(false);
    });
  });

  describe('isTextSame', () => {
    it('returns true if innerText same', async () => {
      expect(
        await isTextSame('<a>git is great</a>', '<a>git is great</a>'),
      ).toBe(true);

      expect(
        await isTextSame('<a>git is <b>great</b></a>', '<a>git is great</a>'),
      ).toBe(true);
    });

    it('returns false if innerText differs', async () => {
      expect(
        await isTextSame('<a>git is great</a>', '<a>gitter is great</a>'),
      ).toBe(false);
    });

    it('ignores newlines, whitespace, extra spaces', async () => {
      expect(
        await isTextSame('<a>\ngit is great   </a>', '<a>git is   great</a>'),
      ).toBe(true);
    });

    it('handles elements without innerText', async () => {
      expect(await isTextSame('<div />', '<div>abc</div>')).toBe(false);
      expect(await isTextSame('<div />', '<input type="text" />')).toBe(true);
    });
  });
});
