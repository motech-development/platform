import { render, waitFor } from '@testing-library/react';
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
    jest.useFakeTimers();

    const history = createMemoryHistory({
      initialEntries: ['?error=Error&error_description=Message'],
    });

    render(
      <TestProvider history={history}>
        <App />
      </TestProvider>,
    );

    await waitFor(() =>
      expect(add).toHaveBeenCalledWith({
        colour: 'danger',
        message: 'Message',
        onDismiss: expect.any(Function),
      }),
    );

    jest.runOnlyPendingTimers();

    expect(logout).toHaveBeenCalledTimes(1);
  });

  it('should log out when idle when not in production mode', async () => {
    jest.useFakeTimers();

    render(
      <TestProvider>
        <App />
      </TestProvider>,
    );

    jest.runOnlyPendingTimers();

    await waitFor(() =>
      expect(logout).toHaveBeenCalledWith({
        returnTo: window.location.origin,
      }),
    );
  });
});
