export const htmlToElement = (htmlToParse: string): HTMLElement => {
  const html = htmlToParse.trim();

  const doc = new DOMParser().parseFromString(html, 'text/html');

  if (html.startsWith('<html')) {
    return doc.firstElementChild as HTMLElement;
  }

  if (html.startsWith('<body')) {
    return doc.body;
  }

  return doc.body.firstElementChild as HTMLElement;
};
