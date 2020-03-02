export interface AttributeMap {
  [key: string]: string;
}

export const cleanText = (text = ''): string => {
  const cleaned = text
    // remove newlines
    .replace(/[\r\n\t]+/gm, ' ')
    // remove excessive whitespace
    .replace(/\s+/gm, ' ')
    .trim();

  return cleaned;
};

export const cleanLabels = (labels: NodeListOf<HTMLLabelElement>): string => {
  const labelText: string[] = [];

  labels.forEach((label: HTMLLabelElement) => {
    if (label.innerText.length) labelText.push(cleanText(label.innerText));
  });

  return labelText.length ? labelText.join(' ') : '';
};

export const serializeAttributes = (element: HTMLElement): AttributeMap => {
  const attributes = element.attributes;
  const serialized = {};

  Object.keys(attributes).forEach(key => {
    const { name, value } = attributes[key];
    serialized[name] = value;
  });

  const elementWithLabels = element as HTMLInputElement;

  if (elementWithLabels.labels && elementWithLabels.labels.length) {
    const labelText = cleanLabels(elementWithLabels.labels);
    serialized['labels'] = labelText;
  }

  return serialized;
};

// used in testing
export const serializeElement = (element: HTMLElement): AttributeMap => {
  const attributes = serializeAttributes(element);

  return {
    ...attributes,
    innerText: element.innerText,
    tagName: element.tagName.toLowerCase(),
  };
};

export const serializeElementAndDescendants = (
  element: HTMLElement,
): AttributeMap[] => {
  const attributes = [serializeElement(element)];

  for (let i = 0; i < element.children.length; i++) {
    attributes.push(
      ...serializeElementAndDescendants(element.children[i] as HTMLElement),
    );
  }

  return attributes;
};
