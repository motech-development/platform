import waitForApollo from '../waitForApollo';

describe('waitForApollo', () => {
  let spy: jest.Mock;

  beforeEach(() => {
    spy = jest.fn();

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should resolve after set period of time', async () => {
    const test = waitForApollo(5000).then(spy);

    jest.advanceTimersByTime(5000);

    await test;

    expect(spy).toHaveBeenCalled();
  });
});
