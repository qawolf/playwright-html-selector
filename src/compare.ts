import { serializeAttributes, unique } from './utils';

export interface ElementComparison {
  attributes: string[];
  matchingAttributes: string[];
}

const cleanText = (text = ''): string => {
  const cleaned = text
    // remove newlines
    .replace(/[\r\n\t]+/gm, ' ')
    // remove excessive whitespace
    .replace(/\s+/gm, ' ')
    .trim();

  return cleaned;
};

export const compareAttributes = (
  a: HTMLElement,
  b: HTMLElement,
): ElementComparison => {
  const attributesA = serializeAttributes(a);
  const attributesB = serializeAttributes(b);

  const attributes = [];
  const matchingAttributes = [];

  unique(Object.keys(attributesA).concat(Object.keys(attributesB))).forEach(
    key => {
      // ignore dynamic attributes
      if (key === 'data-reactid') return;

      if (['class', 'labels'].includes(key)) {
        const aValues: string[] = (attributesA[key] || '').split(' ');
        const bValues: string[] = (attributesB[key] || '').split(' ');

        unique(aValues.concat(bValues)).forEach(name => {
          const matchKey = `${key}.${name}`;

          attributes.push(matchKey);
          if (aValues.includes(name) && bValues.includes(name)) {
            matchingAttributes.push(matchKey);
          }
        });
      } else {
        attributes.push(key);
        if (attributesA[key] === attributesB[key]) {
          matchingAttributes.push(key);
        }
      }
    },
  );

  return { attributes, matchingAttributes };
};

export const isTagSame = (a: HTMLElement, b: HTMLElement): boolean => {
  return a.tagName.toLowerCase() === b.tagName.toLowerCase();
};

export const isTextSame = (a: HTMLElement, b: HTMLElement): boolean => {
  return cleanText(a.innerText || '') === cleanText(b.innerText || '');
};

export const compareElements = (
  a: HTMLElement,
  b: HTMLElement,
): ElementComparison => {
  const comparison = compareAttributes(a, b);
  comparison.attributes.push('innerText', 'tag');

  if (isTextSame(a, b)) {
    comparison.matchingAttributes.push('innerText');
  }
  if (isTagSame(a, b)) {
    comparison.matchingAttributes.push('tag');
  }

  return comparison;
};
