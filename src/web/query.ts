// import { htmlToElement } from './htmlToElement';
// import { rankCandidateElements } from './rank';

export interface TargetElements {
  target: HTMLElement;
  ancestors: HTMLElement[];
}

export const buildCandidateSelector = (element: HTMLElement): string => {
  const tagName = element.tagName.toLowerCase();

  if (tagName === 'select') return 'select';

  const isClickableInput =
    tagName === 'input' &&
    ['checkbox', 'radio', 'submit'].includes(
      (element as HTMLInputElement).type,
    );
  if (tagName === 'button' || isClickableInput) {
    return 'button,input[type="checkbox],input[type="radio"],input[type="submit"]';
  }
  // query for typeable inputs
  if (
    ['input', 'textarea'].includes(tagName) ||
    element.contentEditable === 'true'
  ) {
    return 'input,textarea,[contenteditable="true"]';
  }

  return '*';
};

// const findCandidateElements = (target: HTMLElement): HTMLElement[] => {
//   const selector = buildCssSelector(target);

// TODO filter out non visible candidates

//   return Array.from(document.querySelectorAll(selector));
// };

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
  // list closest ancestors to target first
  ancestors.reverse();

  return { ancestors, target };
};

// export const querySelectorAll = (html: string): HTMLElement[] => {
//   const element = htmlToElement(html);
//   const targetElements = flattenTargetElements(element);

//   const candidates = findCandidateElements(targetElements.target);
//   const rankings = rankCandidateElements(targetElements, candidates);

//   return rankings.map(ranking => ranking.node);
// };
