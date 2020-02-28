const cleanText = (text = ''): string => {
  const cleaned = text
    // remove newlines
    .replace(/[\r\n\t]+/gm, ' ')
    // remove excessive whitespace
    .replace(/\s+/gm, ' ')
    .trim();

  return cleaned;
};

export const isTagSame = (a: HTMLElement, b: HTMLElement): boolean => {
  return a.tagName.toLowerCase() === b.tagName.toLowerCase();
};

export const isTextSame = (a: HTMLElement, b: HTMLElement): boolean => {
  return cleanText(a.innerText || '') === cleanText(b.innerText || '');
};

// TODO: account for attributes that do NOT match target
// what % of attributes are shared?
