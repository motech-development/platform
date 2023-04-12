// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { randomFillSync } from 'crypto';
import 'jest-styled-components';

Object.defineProperty(window, 'crypto', {
  value: {
    getRandomValues: (buffer: NodeJS.ArrayBufferView) => randomFillSync(buffer),
  },
  writable: true,
});
