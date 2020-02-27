import { selectors } from 'playwright-core';
import { createEngine } from './engine';

export const register = () => {
  // TODO webpack
  return selectors.register(createEngine);
};
