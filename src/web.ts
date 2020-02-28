import { htmlToElement } from './htmlToElement';
import { createEngine } from './engine';

// This file is the entrypoint for the web code.
// Export helpers for addHtmlSelectorWeb by decorating the default export.
(createEngine as any).htmlToElement = htmlToElement;

// Export the selector engine the way Playwright expects it: a function that returns the engine constant.
// We export a constant since the bundle will wrap this in a function.
export default createEngine;
