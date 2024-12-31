// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import { ReadableStream, TransformStream } from 'node:stream/web';
import { TextDecoder, TextEncoder } from 'node:util';
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

if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (val) => JSON.parse(JSON.stringify(val)) as unknown;
}

if (typeof global.ReadableStream === 'undefined') {
  Object.defineProperties(globalThis, {
    ReadableStream: {
      value: ReadableStream,
    },
    TextDecoder: {
      value: TextDecoder,
    },
    TextEncoder: {
      value: TextEncoder,
    },
    TransformStream: {
      value: TransformStream,
    },
  });
}

if (typeof Promise.withResolvers === 'undefined') {
  Promise.withResolvers = <T>() => {
    let resolve: (value: T | PromiseLike<T>) => void;
    let reject: (reason?: unknown) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return {
      promise,
      reject: reject!,
      resolve: resolve!,
    };
  };
}

// TODO: Improve tests so that the timeout can be reduced
jest.setTimeout(30000);
