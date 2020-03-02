import { AttributeMap, cleanText, serializeAttributes } from './utils';

// TODO in future consider including additional and missing attributes on other
export interface Comparison {
  all: string[]; // all attributes on target
  matching: string[]; // attributes that match between target and other
}

export interface ElementComparison {
  attributes: Comparison;
  classes: Comparison;
  labels: Comparison;
}

export const compareListAttributes = (
  target?: string,
  other?: string,
): Comparison => {
  const all = [];
  const matching = [];

  const targetValues: string[] = (target || '').split(' ');
  const otherValues: string[] = (other || '').split(' ');

  targetValues.forEach(value => {
    if (!value) return; // ignore empty string

    if (otherValues.includes(value)) {
      matching.push(value);
    }

    all.push(value);
  });

  return { all, matching };
};

export const compareAttributes = (
  targetAttributes: AttributeMap,
  otherAttributes: AttributeMap,
): Comparison => {
  const all = [];
  const matching = [];

  Object.keys(targetAttributes).forEach(key => {
    // ignore dynamic attributes
    if (key === 'data-reactid') return;
    // ignore text, classes, and labels since handled separately
    if (['class', 'labels', 'qaw_innertext', 'qaw_labels'].includes(key))
      return;

    if (targetAttributes[key] === otherAttributes[key]) {
      matching.push(key);
    }

    all.push(key);
  });

  return { all, matching };
};

export const isTagSame = (target: HTMLElement, other: HTMLElement): boolean => {
  return target.tagName.toLowerCase() === other.tagName.toLowerCase();
};

export const isTextSame = (
  target: HTMLElement,
  other: HTMLElement,
): boolean | null => {
  // if target does not have text, return null so text not included in comparison
  if (!target.getAttribute('qaw_innertext')) return null;

  const targetText = cleanText(target.getAttribute('qaw_innertext') || '');
  const otherText = cleanText(other.innerText || '');

  return targetText === otherText;
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
    targetAttributes.qaw_labels,
    otherAttributes.labels,
  );

  const attributes = compareAttributes(targetAttributes, otherAttributes);

  const sameText = isTextSame(target, other);
  if (sameText !== null) {
    attributes.all.push('innerText');
  }
  if (sameText) {
    attributes.matching.push('innerText');
  }

  attributes.all.push('tag');
  if (isTagSame(target, other)) {
    attributes.matching.push('tag');
  }

  return { attributes, classes, labels };
};
