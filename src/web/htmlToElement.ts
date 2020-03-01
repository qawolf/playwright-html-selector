export const htmlToElement = (html: string): HTMLElement => {
  const template = document.createElement('template');
  html = html.trim(); // remove whitespace
  template.innerHTML = html;

  return template.content.firstChild as HTMLElement;
};
