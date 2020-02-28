import { createEngine } from './engine';
import { htmlToElement } from './htmlToElement';
import { serializeElementAndDescendants } from './utils';

export interface HtmlSelectorWeb {
  htmlToElement: (html: string) => HTMLElement;
  serializeElementAndDescendants: (element: HTMLElement) => object[];
}

// This file is the entrypoint for the web code.
// Export helpers for addHtmlSelectorWeb by decorating the default export.
/* eslint-disable @typescript-eslint/no-explicit-any */
(createEngine as any).htmlToElement = htmlToElement;
(createEngine as any).serializeElementAndDescendants = serializeElementAndDescendants;
/* eslint-enable @typescript-eslint/no-explicit-any */

// Export the selector engine the way Playwright expects it: a function that returns the engine constant.
// We export a constant since the bundle will wrap this in a function.
export default createEngine;
