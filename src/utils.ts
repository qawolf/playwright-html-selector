export const serializeAttributes = (element: HTMLElement): object => {
  const attributes = element.attributes;
  const serialized = {};

  Object.keys(attributes).forEach(key => {
    const { name, value } = attributes[key];
    serialized[name] = value;
  });

  return serialized;
};

const serializeElement = (element: HTMLElement): object => {
  const attributes = serializeAttributes(element);

  return {
    ...attributes,
    tagName: element.tagName.toLowerCase(),
    textContent: element.innerText,
  };
};

export const serializeElementAndDescendants = (
  element: HTMLElement,
): object[] => {
  let attributes = [serializeElement(element)];

  for (let i = 0; i < element.children.length; i++) {
    attributes = attributes.concat(
      serializeElementAndDescendants(element.children[i] as HTMLElement),
    );
  }

  return attributes;
};

export const unique = (array: any[]): any[] => {
  return [...new Set(array)];
};
