import { someHelper } from './parser';

export const createEngine = {
  name: 'html',

  create(): undefined {
    // unclear how to invoke this so we will not implement it yet
    return undefined;
  },

  query(root: Node, selector: string): null {
    console.log(root, selector, someHelper());
    return null;
    // return root.querySelector(selector);
  },

  queryAll(root: Node, selector: string): null {
    console.log(root, selector);
    return null;
    // return Array.from(root.querySelectorAll(selector));
  },
};
