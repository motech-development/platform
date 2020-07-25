import { act, render, wait } from '@testing-library/react';
import React from 'react';
import { createMemoryHistory } from 'history';
import TestProvider, { add, logout } from '../utils/TestProvider';
import App from '../App';

jest.mock('react-ga');

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

    jest.runOnlyPendingTimers();

    expect(logout).toHaveBeenCalledWith({
      returnTo: window.location.origin,
    });
  });

  it('should display error toast if there are any log in errors', async () => {
    const history = createMemoryHistory({
      initialEntries: ['?error=Error&error_description=Message'],
    });

    render(
      <TestProvider history={history}>
        <App />
      </TestProvider>,
    );

    jest.useFakeTimers();

    act(() => {
      jest.runOnlyPendingTimers();
    });

    await wait(() =>
      expect(add).toHaveBeenCalledWith({
        colour: 'danger',
        message: 'Message',
        onDismiss: expect.any(Function),
      }),
    );

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

      jest.runOnlyPendingTimers();

      expect(logout).toHaveBeenCalledWith({
        returnTo: window.location.origin,
      });
    });
  });
});
