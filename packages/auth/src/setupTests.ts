// Adds custom DOM matchers such as toHaveTextContent.
import '@testing-library/jest-dom/vitest';

Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation((query: unknown) => ({
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(),
  })),
  writable: true,
});
