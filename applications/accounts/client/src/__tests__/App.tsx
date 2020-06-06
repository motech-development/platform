import { render, wait } from '@testing-library/react';
import React from 'react';
import TestProvider, { logout } from '../utils/TestProvider';
import App from '../App';

describe('App', () => {
  it('should render when loaded', async () => {
    const { container } = render(
      <TestProvider>
        <App />
      </TestProvider>,
    );

    await wait();

    const loader = container.querySelector('circle');

    expect(loader).not.toBeInTheDocument();
  });

  it('should show a loader when loading', () => {
    const { container } = render(
      <TestProvider isLoading>
        <App />
      </TestProvider>,
    );
    const loader = container.querySelector('circle');

    expect(loader).toBeInTheDocument();
  });

  it('should log out when idle when not in production mode', async () => {
    jest.useFakeTimers();

    render(
      <TestProvider>
        <App />
      </TestProvider>,
    );

    await wait();

    jest.runAllTimers();

    expect(logout).toHaveBeenCalledWith({
      returnTo: window.location.origin,
    });
  });

  describe('in production mode', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      // @ts-ignore
      process.env.NODE_ENV = 'production';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should log out when idle', async () => {
      jest.useFakeTimers();

      render(
        <TestProvider>
          <App />
        </TestProvider>,
      );

      await wait();

      jest.runAllTimers();

      expect(logout).toHaveBeenCalledWith({
        returnTo: window.location.origin,
      });
    });
  });
});
