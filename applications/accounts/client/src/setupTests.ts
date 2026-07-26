// Adds custom DOM matchers such as toHaveTextContent.
import { ReadableStream, TransformStream } from 'node:stream/web';
import { TextDecoder, TextEncoder } from 'node:util';
import { randomFillSync } from 'crypto';
import '@testing-library/jest-dom/vitest';
import 'unfetch/polyfill';

vi.mock('@auth0/auth0-react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@auth0/auth0-react')>()),
  useAuth0: vi.fn(),
}));

vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}));

window.matchMedia = (query) => ({
  addEventListener: vi.fn(),
  addListener: vi.fn(),
  dispatchEvent: vi.fn(),
  matches: false,
  media: query,
  onchange: null,
  removeEventListener: vi.fn(),
  removeListener: vi.fn(),
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
