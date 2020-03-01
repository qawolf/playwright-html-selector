import { htmlToElement } from './htmlToElement';
import { rankCandidateElements } from './rank';

export interface TargetElements {
  target: HTMLElement;
  ancestors: HTMLElement[];
}

// considers the type of the element to return the CSS selector
// to use with document.querySelector
// for example, if element is select tag, only query select elements
const buildCssSelector = (element: HTMLElement): string => {};

const findCandidateElements = (target: HTMLElement): HTMLElement[] => {
  const selector = buildCssSelector(target);

  return Array.from(document.querySelectorAll(selector));
};

// takes the nested DOM element and returns the true target child
const flattenTargetElements = (element: HTMLElement): TargetElements => {};

export const querySelectorAll = (html: string): HTMLElement[] => {
  const element = htmlToElement(html);
  const targetElements = flattenTargetElements(element);

  const candidates = findCandidateElements(targetElements.target);
  const rankings = rankCandidateElements(targetElements, candidates);

  return rankings.map(ranking => ranking.node);
};
