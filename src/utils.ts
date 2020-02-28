const serializeElement = (element: HTMLElement): object => {
  const elementAttributes = element.attributes;
  const attributes = {};

  Object.keys(elementAttributes).forEach(key => {
    const { name, value } = elementAttributes[key];
    attributes[name] = value;
  });

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
