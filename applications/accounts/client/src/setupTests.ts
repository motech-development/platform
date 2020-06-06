// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import { randomFillSync } from 'crypto';
import 'jest-date-mock';
import 'jest-styled-components';

Object.defineProperty(window, 'matchMedia', {
  value: jest.fn().mockImplementation(query => ({
    addEventListener: jest.fn(),
    addListener: jest.fn(),
    dispatchEvent: jest.fn(),
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: jest.fn(),
    removeListener: jest.fn(),
  })),
  writable: true,
});

Object.defineProperty(window, 'crypto', {
  value: {
    getRandomValues: (buffer: NodeJS.ArrayBufferView) => randomFillSync(buffer),
    subtle: {},
  },
  writable: true,
});
