import { render } from '@testing-library/react';
import React from 'react';
import TestProvider from '../utils/TestProvider';
import App from '../App';

describe('App', () => {
  it('should show the name of the app in the bar', async () => {
    const { findByText } = render(
      <TestProvider>
        <App />
      </TestProvider>,
    );

    await expect(findByText('app-name')).resolves.toBeInTheDocument();
  });

  it('should show loading spinner if configs is not set', () => {
    const { container } = render(
      <TestProvider>
        <App />
      </TestProvider>,
    );
    const loader = container.querySelector('circle');

    expect(loader).toBeInTheDocument();
  });

  it('should not show loading spinner if log in config is set', () => {
    window.config = {
      auth0Domain: 'https://auth0.com',
      callbackURL: 'https://my-app.com',
      clientID: 'client-id',
      internalOptions: {},
    };

    const { container } = render(
      <TestProvider>
        <App />
      </TestProvider>,
    );
    const loader = container.querySelector('circle');

    expect(loader).not.toBeInTheDocument();
  });

  it('should not show loading spinner if reset password config is set', () => {
    window.passwordReset = {
      csrfToken: 'token',
      email: 'text@example.com',
      passwordPolicy: 'good',
      ticket: 'ticket',
    };

    const { container } = render(
      <TestProvider>
        <App />
      </TestProvider>,
    );
    const loader = container.querySelector('circle');

    expect(loader).not.toBeInTheDocument();
  });
});
