import { htmlToElement } from './htmlToElement';
import { rankCandidateElements } from './rank';

export interface TargetElements {
  target: HTMLElement;
  ancestors: HTMLElement[];
}

export const isVisible = (element: HTMLElement): boolean => {
  if (element.offsetWidth <= 0 || element.offsetHeight <= 0) {
    return false;
  }

  return true;
};

export const buildCandidateSelector = (element: HTMLElement): string => {
  const tagName = element.tagName.toLowerCase();

  if (tagName === 'select') return 'select';

  const isClickableInput =
    tagName === 'input' &&
    ['checkbox', 'radio', 'submit'].includes(
      (element as HTMLInputElement).type,
    );
  if (tagName === 'button' || isClickableInput) {
    return 'button,input[type="checkbox"],input[type="radio"],input[type="submit"]';
  }

  if (
    ['input', 'textarea'].includes(tagName) ||
    element.contentEditable === 'true'
  ) {
    return 'input,textarea,[contenteditable="true"]';
  }

  return '*';
};

export const findCandidateElements = (
  root: Document | Element,
  target: HTMLElement,
): HTMLElement[] => {
  const selector = buildCandidateSelector(target);

  const candidates = Array.from(
    root.querySelectorAll(selector),
  ) as HTMLElement[];

  return candidates.filter(candidate => isVisible(candidate));
};

export const flattenTargetElements = (element: HTMLElement): TargetElements => {
  let target: HTMLElement = element;
  const ancestors: HTMLElement[] = [];

  while (target.children.length) {
    if (target.children.length > 1) {
      throw new Error(
        'playwright-html-selector: cannot target multiple elements on same level',
      );
    }

    ancestors.push(target);
    target = target.children[0] as HTMLElement;
  }
  // order the ancestors by ascending distance to the target
  ancestors.reverse();

  return { ancestors, target };
};

export const queryHtmlSelectorAll = (
  root: Document | Element,
  selectorHtml: string,
): HTMLElement[] => {
  const selectorElement = htmlToElement(selectorHtml);
  const targetElements = flattenTargetElements(selectorElement);

  const candidates = findCandidateElements(root, targetElements.target);
  const rankings = rankCandidateElements(targetElements, candidates);

  return rankings.map(ranking => ranking.node);
};
