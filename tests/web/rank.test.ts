import { Browser, chromium, Page } from 'playwright';
import { addHtmlSelectorWeb } from '../../src/register';
import { HtmlSelectorWeb } from '../../src/web';
import {
  computePercent,
  computeStrongMatchKeys,
  computeSimilarity,
  sortRankings,
} from '../../src/web/rank';
import { TestUrl } from '../utils';

describe('rank', () => {
  describe('buildCandidateRanking', () => {
    let browser: Browser;
    let page: Page;

    beforeAll(async () => {
      browser = await chromium.launch();
      page = await browser.newPage();
      await addHtmlSelectorWeb(page);
      await page.goto(`${TestUrl}click.html`);
    });

    afterAll(() => browser.close());

    it('returns similarity ranking between target and candidate', async () => {
      const result = await page.evaluate(() => {
        const htmlselector: HtmlSelectorWeb = (window as any).htmlselector;
        const target = {
          ancestors: [
            htmlselector.htmlToElement(
              '<div class="container main buttons">Button</div>',
            ),
          ],
          target: htmlselector.htmlToElement(
            '<button id="button" title="submit">Button</button>',
          ),
        };
        const candidate = document.getElementById('button');

        return htmlselector.buildCandidateRanking(target, candidate);
      });

      expect(result).toMatchObject({
        score: 76,
        strongMatchKeys: ['id', 'innerText'],
      });
    });
  });

  describe('computePercent', () => {
    it('returns percent', () => {
      expect(computePercent(3, 5)).toBe(0.6);
      expect(computePercent(2, 3)).toBeCloseTo(0.67);
    });

    it('returns 0 if denominator is 0', () => {
      expect(computePercent(5, 0)).toBe(0);
    });
  });

  describe('computeSimilarity', () => {
    it('returns similarity score and strong match keys', () => {
      const result = computeSimilarity({
        attributes: {
          all: ['data-qa', 'id', 'innerText', 'tag'],
          matching: ['data-qa', 'innerText', 'tag'],
        },
        classes: {
          all: ['logo', 'submit', 'large'],
          matching: ['logo', 'large'],
        },
        labels: {
          all: ['Submit'],
          matching: ['Submit'],
        },
      });

      expect(result).toEqual({
        strongMatchKeys: ['innerText', 'label'],
        score: 78,
      });
    });
  });

  describe('computeStrongMatchKeys', () => {
    it('returns strong match keys', () => {
      const result = computeStrongMatchKeys({
        attributes: {
          all: ['alt', 'data-qa', 'href', 'id', 'src', 'title'],
          matching: ['data-qa', 'id', 'href', 'src'],
        },
        classes: {
          all: ['submit'],
          matching: ['submit'],
        },
        labels: { all: [], matching: [] },
      });

      expect(result).toEqual(['id', 'src']);
    });

    it('includes labels if present', () => {
      const result = computeStrongMatchKeys({
        attributes: {
          all: ['alt', 'data-qa', 'href', 'id', 'src', 'title'],
          matching: ['data-qa', 'id', 'href', 'src'],
        },
        classes: {
          all: [],
          matching: [],
        },
        labels: { all: ['Submit'], matching: ['Submit'] },
      });

      expect(result).toEqual(['id', 'src', 'label']);
    });
  });

  describe('sortRankings', () => {
    it('sorts rankings with strong match keys first', () => {
      const result = sortRankings([
        {
          score: 100,
          strongMatchKeys: [],
          node: null as any,
        },
        {
          score: 50,
          strongMatchKeys: ['alt'],
          node: null as any,
        },
        {
          score: 60,
          strongMatchKeys: ['id'],
          node: null as any,
        },
      ]);

      expect(result).toEqual([
        {
          score: 60,
          strongMatchKeys: ['id'],
          node: null as any,
        },
        {
          score: 50,
          strongMatchKeys: ['alt'],
          node: null as any,
        },
        {
          score: 100,
          strongMatchKeys: [],
          node: null as any,
        },
      ]);
    });
  });
});
