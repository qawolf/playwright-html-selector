import { readFileSync } from 'fs';
import { join } from 'path';
import { selectors } from 'playwright-core';

export const WEB_SCRIPT = readFileSync(
  join(__dirname, '../build/htmlselector.web.js'),
  'utf8',
)
  // make it playwright friendly
  .replace('var htmlselector = ', '')
  // remove the last semicolon
  .slice(0, -2);

export const register = () => selectors.register(WEB_SCRIPT);
