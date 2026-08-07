import { registerSW } from 'virtual:pwa-register';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { registerServiceWorker } from './registration';

describe('registerServiceWorker', () => {
  beforeEach(() => {
    vi.mocked(registerSW).mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('registers immediately in the browser', () => {
    registerServiceWorker();

    expect(registerSW).toHaveBeenCalledWith({ immediate: true });
  });

  it('does not register during server rendering', () => {
    vi.stubGlobal('window', undefined);

    registerServiceWorker();

    expect(registerSW).not.toHaveBeenCalled();
  });
});
