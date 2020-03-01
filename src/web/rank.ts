interface Ranking {
  node: HTMLElement;
  score: number;
}

const THRESHOLD = 0.75;

export const computeScore = (comparisons: Comparison[]): number => {};

export const buildCandidateRankings = (
  target: TargetElements,
  candidates: HTMLElement[],
): Ranking[] => {
  // call compare for each candidate and ancestors
  // pass result to compute Score
  // combine to rank candidate elements
};

export const rankCandidateElements = (
  target: TargetElements,
  candidates: HTMLElement[],
): Ranking[] => {
  const rankings = buildCandidateRankings(target, candidates);

  const sorted = rankings.sort((a, b) => {
    return b.score - a.score;
  });

  return sorted.filter(ranking => ranking.score >= THRESHOLD);
};
