import { computePercent, computeSimilarity } from '../../src/web/rank';

describe('rank', () => {
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
});
