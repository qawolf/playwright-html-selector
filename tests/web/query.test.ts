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

const findCandidateElements = (html: string): Promise<AttributeMap[]> => {
  return page.evaluate(html => {
    const htmlselector: HtmlSelectorWeb = (window as any).htmlselector;
    const target = htmlselector.htmlToElement(html);

    const candidates = htmlselector.findCandidateElements(document, target);

    return candidates.map(candidate =>
      htmlselector.serializeElement(candidate),
    );
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

const isVisible = (selector: string): Promise<boolean> => {
  return page.evaluate(selector => {
    const htmlselector: HtmlSelectorWeb = (window as any).htmlselector;
    const element = document.querySelector(selector);

    return htmlselector.isVisible(element as HTMLElement);
  }, selector);
};

const queryHtmlSelectorAll = (selector: string): Promise<AttributeMap[]> => {
  return page.evaluate(selector => {
    const htmlselector: HtmlSelectorWeb = (window as any).htmlselector;

    const candidates = htmlselector.queryHtmlSelectorAll(document, selector);

    return candidates.map(candidate =>
      htmlselector.serializeElement(candidate),
    );
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
        'button,input[type="checkbox"],input[type="radio"],input[type="submit"]';

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

  describe('findCandidateElements', () => {
    it('returns candidate elements', async () => {
      const result = await findCandidateElements('<button>Submit</button>');

      expect(result).toEqual([
        { tagName: 'input', textContent: '', type: 'submit', value: 'Other' },
        {
          'data-qa': 'button',
          id: 'button',
          tagName: 'button',
          textContent: 'Button',
        },
        {
          class: 'button',
          id: 'second',
          tagName: 'button',
          textContent: 'Second Button',
        },
        {
          class: 'button',
          id: 'third',
          tagName: 'button',
          textContent: 'Second Button',
        },
      ]);
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

    it('throws an error if targeting element with siblings', async () => {
      const testFn: () => Promise<{
        ancestors: AttributeMap[];
        target: AttributeMap;
      }> = () => flattenTargetElements('.container');

      await expect(testFn()).rejects.toThrowError();
    });
  });

  describe('isVisible', () => {
    it('returns true for visible element', async () => {
      const result = await isVisible('#button');
      expect(result).toBe(true);
    });

    it('returns false for not visible element', async () => {
      const result = await isVisible('#hidden');
      expect(result).toBe(false);
    });
  });

  describe('queryHtmlSelectorAll', () => {
    it('returns ranked list of candidate elements', async () => {
      const result = await queryHtmlSelectorAll(
        '<button class="button" id="second">Second Button</button>',
      );

      expect(result).toEqual([
        {
          class: 'button',
          id: 'second',
          tagName: 'button',
          textContent: 'Second Button',
        },
        {
          class: 'button',
          id: 'third',
          tagName: 'button',
          textContent: 'Second Button',
        },
      ]);
    });
  });
});
