export interface AttributeMap {
  [key: string]: string;
}

export const serializeAttributes = (element: HTMLElement): AttributeMap => {
  const attributes = element.attributes;
  const serialized = {};

  Object.keys(attributes).forEach(key => {
    const { name, value } = attributes[key];
    serialized[name] = value;
  });

  return serialized;
};

const serializeElement = (element: HTMLElement): AttributeMap => {
  const attributes = serializeAttributes(element);

  return {
    ...attributes,
    tagName: element.tagName.toLowerCase(),
    textContent: element.innerText,
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

export const unique = (array: any[]): any[] => {
  return [...new Set(array)];
};
