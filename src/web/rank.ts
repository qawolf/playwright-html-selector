import { compareElements, ElementComparison } from './compare';
import { TargetElements } from './query';

export type Ranking = Similarity & {
  node: HTMLElement;
};

export interface Similarity {
  score: number;
  strongMatchKeys: string[];
}

const STRONG_MATCH_KEYS = [
  'alt',
  'id',
  'innerText',
  'name',
  'placeholder',
  'src',
  'title',
];

const THRESHOLD = 0.75;

export const computePercent = (shared: number, total: number): number => {
  if (!total) return 0;

  return shared / total;
};

export const computeStrongMatchKeys = (
  elementComparison: ElementComparison,
): string[] => {
  const strongMatchKeys: string[] = [];
  const { attributes, labels } = elementComparison;

  attributes.matching.forEach(attribute => {
    if (STRONG_MATCH_KEYS.includes(attribute)) {
      strongMatchKeys.push(attribute);
    }
  });

  if (labels.matching.length) {
    // consider shared label a strong match
    strongMatchKeys.push('label');
  }

  return strongMatchKeys;
};

export const computeSimilarity = (
  elementComparison: ElementComparison,
): Similarity => {
  let shared = 0;
  let total = 0;
  const { attributes, classes, labels } = elementComparison;

  attributes.all.forEach(attribute => {
    if (attributes.matching.includes(attribute)) {
      shared++;
    }
    total++;
  });

  if (classes.all.length) {
    shared += computePercent(classes.matching.length, classes.all.length);
    total++;
  }
  if (labels.all.length) {
    shared += computePercent(labels.matching.length, labels.all.length);
    total++;
  }

  const score = Math.round(computePercent(shared, total) * 100);

  return { score, strongMatchKeys: computeStrongMatchKeys(elementComparison) };
};

const computeElementSimilarity = (
  target: HTMLElement,
  candidate: HTMLElement,
): Similarity => {
  const elementComparison = compareElements(target, candidate);

  return computeSimilarity(elementComparison);
};

export const buildCandidateRanking = (
  target: TargetElements,
  candidate: HTMLElement,
): Ranking => {
  const { score, strongMatchKeys } = computeElementSimilarity(
    target.target,
    candidate,
  );

  let shared = score;
  let total = 100;
  let candidateAncestor = candidate.parentElement;

  target.ancestors.forEach((ancestor, i) => {
    const weight = 1 / ((i + 1) * 2);
    total += weight * 100;
    if (!candidateAncestor) return;

    const candidateSimilarity = computeElementSimilarity(
      ancestor,
      candidateAncestor,
    );

    shared += weight * candidateSimilarity.score;
    candidateAncestor = candidateAncestor.parentElement;
  });

  const finalScore = Math.round(computePercent(shared, total) * 100);

  return { score: finalScore, node: candidate, strongMatchKeys };
};

export const sortRankings = (rankings: Ranking[]): Ranking[] => {
  return rankings.sort((a, b) => {
    // sort values with strong matches first
    const aStrongValue = a.strongMatchKeys.length > 0 ? 200 : 0;
    const bStrongValue = b.strongMatchKeys.length > 0 ? 200 : 0;

    return b.score + bStrongValue - (a.score + aStrongValue);
  });
};

export const rankCandidateElements = (
  target: TargetElements,
  candidates: HTMLElement[],
): Ranking[] => {
  const rankings = candidates.map(candidate => {
    return buildCandidateRanking(target, candidate);
  });
  const sorted = sortRankings(rankings);

  return sorted.filter(
    ranking =>
      ranking.strongMatchKeys.length || ranking.score / 100 >= THRESHOLD,
  );
};
