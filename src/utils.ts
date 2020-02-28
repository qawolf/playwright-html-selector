export const getElementAttributes = (element: HTMLElement): object[] => {
  let attributes = [getSingleElementAttributes(element)];

  for (let i = 0; i < element.children.length; i++) {
    attributes = attributes.concat(
      getElementAttributes(element.children[i] as HTMLElement),
    );
  }

  return attributes;
};

const getSingleElementAttributes = (element: HTMLElement): object => {
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
