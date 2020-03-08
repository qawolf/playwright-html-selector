export const getTags = (html: string): string[] => html.match(/(<([^>]+)>)/g);

export const getTagName = (tag: string): string => {
  return tag.replace(/<|>|\//g, '').trim();
};

export const htmlToElement = (html: string): HTMLElement => {
  const tags = getTags(html);
  const tagName = getTagName(tags[0]);

  const element = document.createElement(tagName);

  // remove the opening tag
  let innerHtml = html.substring(tags[0].length);
  if (tags.length > 1) {
    // remove the closing tag
    const closingTag = tags[tags.length - 1];
    innerHtml = innerHtml.substring(0, innerHtml.length - closingTag.length);
  }

  element.innerHTML = innerHtml;

  return element;
};
