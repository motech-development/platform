// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import { randomFillSync } from 'crypto';
import '@testing-library/jest-dom';
import 'jest-date-mock';
import 'jest-styled-components';
import 'unfetch/polyfill';

window.matchMedia = (query) => ({
  addEventListener: jest.fn(),
  addListener: jest.fn(),
  dispatchEvent: jest.fn(),
  matches: false,
  media: query,
  onchange: null,
  removeEventListener: jest.fn(),
  removeListener: jest.fn(),
});

Object.defineProperty(window, 'crypto', {
  value: {
    getRandomValues: (buffer: NodeJS.ArrayBufferView) => randomFillSync(buffer),
    subtle: {},
  },
  writable: true,
});

// TODO: Improve tests so that the timeout can be reduced
jest.setTimeout(30000);
