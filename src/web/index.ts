import { compareElements, isTagSame, isTextSame } from './compare';
import { createEngine } from './engine';
import { htmlToElement } from './htmlToElement';
import {
  buildCandidateSelector,
  findCandidateElements,
  flattenTargetElements,
  isVisible,
  queryHtmlSelectorAll,
} from './query';
import { buildCandidateRanking } from './rank';
import {
  serializeAttributes,
  serializeElement,
  serializeElementAndDescendants,
} from './utils';

const web = {
  buildCandidateRanking,
  buildCandidateSelector,
  compareElements,
  findCandidateElements,
  flattenTargetElements,
  htmlToElement,
  isTagSame,
  isTextSame,
  isVisible,
  queryHtmlSelectorAll,
  serializeAttributes,
  serializeElement,
  serializeElementAndDescendants,
};

export type HtmlSelectorWeb = typeof web;

// This file is the entrypoint for the web code.
// Export helpers for addHtmlSelectorWeb by decorating the default export.
Object.keys(web).forEach(key => {
  (createEngine as any)[key] = web[key];
});

// Export the selector engine the way Playwright expects it: a function that returns the engine constant.
// We export a constant since the bundle will wrap this in a function.
export default createEngine;
