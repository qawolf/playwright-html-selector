import { queryHtmlSelectorAll } from './query';

export const createEngine = {
  create(): null {
    // unclear how to invoke this so we will not implement it yet
    return null;
  },

  query(root: Document | Element, selector: string): HTMLElement | null {
    const elements = queryHtmlSelectorAll(root, selector);

    return elements[0] || null;
  },

  queryAll(root: Document | Element, selector: string): HTMLElement[] {
    return queryHtmlSelectorAll(root, selector);
  },
};
