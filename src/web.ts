import {
  AttributeComparison,
  compareAttributes,
  isTagSame,
  isTextSame,
} from './compare';
import { createEngine } from './engine';
import { htmlToElement } from './htmlToElement';
import { serializeElementAndDescendants } from './utils';

export interface HtmlSelectorWeb {
  compareAttributes: (a: HTMLElement, b: HTMLElement) => AttributeComparison;
  htmlToElement: (html: string) => HTMLElement;
  isTagSame: (a: HTMLElement, b: HTMLElement) => boolean;
  isTextSame: (a: HTMLElement, b: HTMLElement) => boolean;
  serializeElementAndDescendants: (element: HTMLElement) => object[];
}

// This file is the entrypoint for the web code.
// Export helpers for addHtmlSelectorWeb by decorating the default export.
(createEngine as any).compareAttributes = compareAttributes;
(createEngine as any).htmlToElement = htmlToElement;
(createEngine as any).isTagSame = isTagSame;
(createEngine as any).isTextSame = isTextSame;
(createEngine as any).serializeElementAndDescendants = serializeElementAndDescendants;

// Export the selector engine the way Playwright expects it: a function that returns the engine constant.
// We export a constant since the bundle will wrap this in a function.
export default createEngine;
