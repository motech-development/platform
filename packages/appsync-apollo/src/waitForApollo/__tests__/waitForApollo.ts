import type { Mock } from 'vitest';
import waitForApollo from '../waitForApollo';

describe('waitForApollo', () => {
  let spy: Mock;

  beforeEach(() => {
    spy = vi.fn();

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should resolve after set period of time', async () => {
    const test = waitForApollo(5000).then(spy);

    vi.advanceTimersByTime(5000);

    await test;

    expect(spy).toHaveBeenCalled();
  });
});
