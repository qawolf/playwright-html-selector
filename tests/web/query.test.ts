import { Browser, chromium, Page } from 'playwright';
import { addHtmlSelectorWeb } from '../../src/register';
import { HtmlSelectorWeb } from '../../src/web';
import { TestUrl } from '../utils';
import { AttributeMap } from '../../src/web/utils';

let browser: Browser;
let page: Page;

const buildCandidateSelector = (html: string): Promise<string> => {
  return page.evaluate(html => {
    const htmlselector: HtmlSelectorWeb = (window as any).htmlselector;
    const element = htmlselector.htmlToElement(html);

    return htmlselector.buildCandidateSelector(element);
  }, html);
};

const flattenTargetElements = (
  selector: string,
): Promise<{ ancestors: AttributeMap[]; target: AttributeMap }> => {
  return page.evaluate(selector => {
    const htmlselector: HtmlSelectorWeb = (window as any).htmlselector;
    const flattened = htmlselector.flattenTargetElements(
      document.querySelector(selector),
    );

    return {
      ancestors: flattened.ancestors.map(ancestor =>
        htmlselector.serializeElement(ancestor),
      ),
      target: htmlselector.serializeElement(flattened.target),
    };
  }, selector);
};

describe('query', () => {
  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
    await addHtmlSelectorWeb(page);
    await page.goto(`${TestUrl}click.html`);
  });

  afterAll(() => browser.close());

  describe('buildCandidateSelector', () => {
    it('returns select if element is select', async () => {
      const result = await buildCandidateSelector('<select value="" />');
      expect(result).toBe('select');
    });

    it('returns click input selector for clickable inputs', async () => {
      const expected =
        'button,input[type="checkbox],input[type="radio"],input[type="submit"]';

      const result = await buildCandidateSelector('<input type="radio" />');
      expect(result).toBe(expected);

      const result2 = await buildCandidateSelector('<input type="checkbox" />');
      expect(result2).toBe(expected);

      const result3 = await buildCandidateSelector('<input type="submit" />');
      expect(result3).toBe(expected);

      const result4 = await buildCandidateSelector('<button>Submit</button>');
      expect(result4).toBe(expected);
    });

    it('returns type input selector for typeable elements', async () => {
      const expected = 'input,textarea,[contenteditable="true"]';

      const result = await buildCandidateSelector('<input type="password" />');
      expect(result).toBe(expected);

      const result2 = await buildCandidateSelector('<textarea />');
      expect(result2).toBe(expected);

      const result3 = await buildCandidateSelector(
        '<div contenteditable="true" />',
      );
      expect(result3).toBe(expected);
    });

    it('returns all selector otherwise', async () => {
      const expected = '*';

      const result = await buildCandidateSelector('<div />');
      expect(result).toBe(expected);

      const result2 = await buildCandidateSelector('<a href="#" />');
      expect(result2).toBe(expected);
    });
  });

  describe('flattenTargetElements', () => {
    it('returns target element with no ancestors', async () => {
      const result = await flattenTargetElements('#button');

      expect(result).toEqual({
        ancestors: [],
        target: {
          'data-qa': 'button',
          id: 'button',
          tagName: 'button',
          textContent: 'Button',
        },
      });
    });

    it('returns target element and its ancestors', async () => {
      const result = await flattenTargetElements('#main');

      expect(result).toEqual({
        ancestors: [
          {
            class: 'container',
            tagName: 'div',
            textContent: 'Button',
          },
          { id: 'main', tagName: 'div', textContent: 'Button' },
        ],
        target: {
          'data-qa': 'button',
          id: 'button',
          tagName: 'button',
          textContent: 'Button',
        },
      });
    });

    it('throws an error if targeting element with siblings', () => {
      const testFn = () => flattenTargetElements('.container');

      expect(testFn()).rejects.toThrowError();
    });
  });
});
