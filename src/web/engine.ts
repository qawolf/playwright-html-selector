import { queryHtmlSelectorAll } from './query';

export const createEngine = {
  name: 'html',

  create(): undefined {
    // unclear how to invoke this so we will not implement it yet
    return undefined;
  },

  query(root: Node, selector: string): HTMLElement | null {
    const elements = queryHtmlSelectorAll(selector);

    return elements[0] || null;
  },

  queryAll(root: Node, selector: string): HTMLElement[] | null {
    const elements = queryHtmlSelectorAll(selector);

    return elements.length ? elements : null;
  },
};
