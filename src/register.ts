import { readFileSync } from 'fs';
import { join } from 'path';
import { selectors, Page } from 'playwright-core';

export const WEB_SCRIPT = readFileSync(
  join(__dirname, '../build/htmlselector.web.js'),
  'utf8',
);

// make it playwright friendly
const PLAYWRIGHT_WEB_SCRIPT = WEB_SCRIPT.replace('var htmlselector = ', '')
  // remove the last semicolon
  .slice(0, -2);

// inject our helpers onto the window for using in tests
export const addHtmlSelectorWeb = (page: Page) =>
  Promise.all([
    page.evaluate(WEB_SCRIPT),
    page.evaluateOnNewDocument(WEB_SCRIPT),
  ]);

// register the selector engine
export const register = () => selectors.register(PLAYWRIGHT_WEB_SCRIPT);
