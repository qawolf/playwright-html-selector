// This file is the entrypoint for the web code

// Playwright selectors.register expects a function that returns the engine constant.
// We return the createEngine constant as default since the bundle will wrap it in a function.
export { createEngine as default } from './engine';
