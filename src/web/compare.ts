import { AttributeMap, serializeAttributes, unique } from './utils';

// TODO change to just matches and all

export interface Comparison {
  additional: string[]; // on other, missing from target
  different: string[]; // different on target and other
  matching: string[]; // same on target and other
  missing: string[]; // on target, missing from other
}

export interface ElementComparison {
  attributes: Comparison;
  classes: Comparison;
  labels: Comparison;
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

// TODO add tests
export const compareListAttributes = (
  target?: string,
  other?: string,
): Comparison => {
  const additional = [];
  const matching = [];
  const missing = [];

  const targetValues: string[] = (target || '').split(' ');
  const otherValues: string[] = (other || '').split(' ');

  unique(targetValues.concat(otherValues)).forEach(name => {
    if (targetValues.includes(name) && otherValues.includes(name)) {
      matching.push(name);
      return;
    }

    if (targetValues.includes(name)) {
      missing.push(name);
      return;
    }

    additional.push(name);
  });

  return { additional, different: [], matching, missing };
};

export const compareAttributes = (
  targetAttributes: AttributeMap,
  otherAttributes: AttributeMap,
): Comparison => {
  const additional = [];
  const different = [];
  const matching = [];
  const missing = [];

  unique(
    Object.keys(targetAttributes).concat(Object.keys(otherAttributes)),
  ).forEach(key => {
    // ignore dynamic attributes
    if (key === 'data-reactid') return;
    // ignore class and labels since list attributes handled separately
    if (['class', 'labels'].includes(key)) return;

    if (targetAttributes[key] === otherAttributes[key]) {
      matching.push(key);
      return;
    }

    if (targetAttributes[key] && otherAttributes[key]) {
      different.push(key);
      return;
    }

    if (targetAttributes[key]) {
      missing.push(key);
      return;
    }

    additional.push(key);
  });

  return { additional, different, matching, missing };
};

export const isTagSame = (target: HTMLElement, other: HTMLElement): boolean => {
  return target.tagName.toLowerCase() === other.tagName.toLowerCase();
};

export const compareText = (
  target: HTMLElement,
  other: HTMLElement,
): keyof Comparison => {
  const targetText = cleanText(target.innerText || '');
  const otherText = cleanText(other.innerText || '');

  if (targetText === otherText) return 'matching';
  if (!otherText) return 'missing';
  if (!targetText) return 'additional';

  return 'different';
};

export const compareElements = (
  target: HTMLElement,
  other: HTMLElement,
): ElementComparison => {
  const targetAttributes = serializeAttributes(target);
  const otherAttributes = serializeAttributes(other);

  const classes = compareListAttributes(
    targetAttributes.class,
    otherAttributes.class,
  );
  const labels = compareListAttributes(
    targetAttributes.labels,
    otherAttributes.labels,
  );

  const attributes = compareAttributes(targetAttributes, otherAttributes);

  if (isTagSame(target, other)) {
    attributes.matching.push('tag');
  } else {
    attributes.different.push('tag');
  }

  const textComparison = compareText(target, other);
  attributes[textComparison].push('innerText');

  return { attributes, classes, labels };
};
