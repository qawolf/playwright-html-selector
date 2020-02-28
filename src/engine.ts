// <a><div>Yo!</div><span>Sup</span></a>

// Selector must not have siblings
// <a><div><span>Sup</span></div></a>

// Check selector is flat, throw an error otherwise
// Compare the selector descendant first, then parent and parent

// numChildren
// isTagMatch
// isTypeable
// isSelectable

// comparison.ts
// { attributes, isTextSame, isTagSame }

// const compareNodes = (node: Node, otherNode: Node) => {
//   //
// };

// const compareAncestors = () => {};

// const matchNodes = (node: Node, otherNode: Node) => {
//   return {
//     // match info
//     percent: 100,
//     node,
//   };
// };

export const createEngine = {
  name: 'html',

  create(): undefined {
    // unclear how to invoke this so we will not implement it yet
    return undefined;
  },

  query(root: Node, selector: string): null {
    console.log(root, selector);
    return null;
    // return root.querySelector(selector);
  },

  queryAll(root: Node, selector: string): null {
    console.log(root, selector);
    // const selectorElement = htmlToElement(selector);
    // return findMatchingDescendants(root, selectorElement);
    return null;
  },
};
