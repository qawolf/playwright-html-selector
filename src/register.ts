import Debug from 'debug';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Page, selectors } from 'playwright-core';

const debug = Debug('playwright-html-selector:register');

export const WEB_SCRIPT = readFileSync(
  join(__dirname, '../build/htmlselector.web.js'),
  'utf8',
);

// make it playwright friendly
export const HTML_SELECTOR_ENGINE = WEB_SCRIPT.replace(
  'var htmlselector = ',
  '',
)
  // remove the last semicolon
  .slice(0, -2);

// inject our helpers onto the window for using in tests
export const addHtmlSelectorWeb = (page: Page): Promise<[unknown, unknown]> =>
  Promise.all([page.evaluate(WEB_SCRIPT), page.addInitScript(WEB_SCRIPT)]);

// register the selector engine
export const register = async (): Promise<void> => {
  await selectors.register('html', HTML_SELECTOR_ENGINE);
  debug('registered html selector engine');
};
