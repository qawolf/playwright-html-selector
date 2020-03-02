import { Browser, chromium, Page } from 'playwright';
import { addHtmlSelectorWeb } from '../../src/register';
import { HtmlSelectorWeb } from '../../src/web';
import {
  compareAttributes,
  compareListAttributes,
  ElementComparison,
} from '../../src/web/compare';
import { TestUrl } from '../utils';

let browser: Browser;
let page: Page;

const buildCompareFunction = (
  functionName: 'compareElements' | 'isTagSame' | 'isTextSame',
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
      const result = compareAttributes(
        {
          'data-qa': 'home',
          id: 'link',
        },
        {
          class: 'extra',
          'data-qa': 'home',
          id: 'link2',
        },
      );

      expect(result).toEqual({
        all: ['data-qa', 'id'],
        matching: ['data-qa'],
      });
    });

    it('ignores data-reactid, qawolf, and list attributes', async () => {
      const result = compareAttributes(
        {
          class: 'submit',
          'data-qa': 'home',
          'data-reactid': 'node',
          id: 'link',
          qaw_innertext: 'Text',
        },
        {
          class: 'logo submit',
          'data-qa': 'home',
          'data-reactid': 'node',
          id: 'link2',
        },
      );

      expect(result).toEqual({
        all: ['data-qa', 'id'],
        matching: ['data-qa'],
      });
    });
  });

  describe('compareElements', () => {
    it('returns all attributes and matching attributes including tag and innerText', async () => {
      const result = await compareElements(
        '<a class="submit logo" data-qa="home" id="link" qaw_innertext="\ngit is great">\ngit is great   </a>',
        '<a class="submit" data-reactid="node" data-qa="home" id="link2">git is   great</a>',
      );

      expect(result).toEqual({
        attributes: {
          all: ['data-qa', 'id', 'innerText', 'tag'],
          matching: ['data-qa', 'innerText', 'tag'],
        },
        classes: {
          all: ['submit', 'logo'],
          matching: ['submit'],
        },
        labels: {
          all: [],
          matching: [],
        },
      });
    });
  });

  describe('compareListAttributes', () => {
    it('returns all attributes and matching attributes', () => {
      const result = compareListAttributes('logo submit large', 'large logo');

      expect(result).toEqual({
        all: ['logo', 'submit', 'large'],
        matching: ['logo', 'large'],
      });
    });

    it('handles undefined arguments', () => {
      const result = compareListAttributes('');

      expect(result).toEqual({ all: [], matching: [] });
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
        await isTextSame(
          '<a qaw_innertext="git is great">git is great</a>',
          '<a>git is great</a>',
        ),
      ).toBe(true);

      expect(
        await isTextSame(
          '<a qaw_innertext="git is great">git is <b>great</b></a>',
          '<a>git is great</a>',
        ),
      ).toBe(true);
    });

    it('returns false if innerText differs', async () => {
      expect(
        await isTextSame(
          '<a qaw_innertext="git is great">git is great</a>',
          '<a>gitter is great</a>',
        ),
      ).toBe(false);
    });

    it('ignores newlines, whitespace, extra spaces', async () => {
      expect(
        await isTextSame(
          '<a qaw_innertext="\ngit is great   ">\ngit is great   </a>',
          '<a>git is   great</a>',
        ),
      ).toBe(true);
    });

    it('handles elements without innerText', async () => {
      expect(await isTextSame('<div />', '<div>abc</div>')).toBe(false);
      expect(await isTextSame('<div />', '<input type="text" />')).toBe(true);
    });
  });
});
