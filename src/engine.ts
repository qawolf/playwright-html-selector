export const createEngine = () => {
  return {
    name: 'html',

    create() {
      // unclear how to invoke this so we will not implement it yet
      return undefined;
    },

    query(root: Node, selector: string) {
      console.log(root, selector);
      return null;
      // return root.querySelector(selector);
    },

    queryAll(root: Node, selector: string) {
      console.log(root, selector);
      return null;
      // return Array.from(root.querySelectorAll(selector));
    },
  };
};
