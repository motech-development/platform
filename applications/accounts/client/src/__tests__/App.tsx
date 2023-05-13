import { act, render, waitFor } from '@testing-library/react';
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

    const loader = container.querySelector('circle');

    await waitFor(() => expect(loader).not.toBeInTheDocument());
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

  it('should display error toast if there are any log in errors', async () => {
    act(() => {
      jest.useFakeTimers();
    });

    const history = createMemoryHistory({
      initialEntries: ['?error=Error&error_description=Message'],
    });

    await act(async () => {
      render(
        <TestProvider history={history}>
          <App />
        </TestProvider>,
      );

      await Promise.resolve();
    });

    await waitFor(() =>
      expect(add).toHaveBeenCalledWith({
        colour: 'danger',
        message: 'Message',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        onDismiss: expect.any(Function),
      }),
    );

    act(() => {
      jest.runOnlyPendingTimers();
    });

    await waitFor(() => expect(logout).toHaveBeenCalledTimes(1));
  });

  it('should log out when idle when not in production mode', async () => {
    act(() => {
      jest.useFakeTimers();
    });

    await act(async () => {
      render(
        <TestProvider>
          <App />
        </TestProvider>,
      );

      await Promise.resolve();
    });

    act(() => {
      jest.runOnlyPendingTimers();
    });

    await waitFor(() =>
      expect(logout).toHaveBeenCalledWith({
        logoutParams: {
          returnTo: window.location.origin,
        },
      }),
    );
  });
});
