import { Capacitor } from '@capacitor/core';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import TestProvider, {
  buildAuthorizeUrl,
  loginWithRedirect,
} from '../../utils/TestProvider';
import LogIn from '../LogIn';

describe('LogIn', () => {
  it('should call log in with the correct params when not run native', async () => {
    const { findByText } = render(
      <TestProvider>
        <LogIn />
      </TestProvider>,
    );
    const button = await findByText('log-in');

    fireEvent.click(button);

    expect(loginWithRedirect).toHaveBeenCalledWith({
      appState: {
        targetUrl: '/my-companies',
      },
    });
  });

  it('should call log in with the correct params when run native', async () => {
    Capacitor.isNative = true;

    const { findByText } = render(
      <TestProvider>
        <LogIn />
      </TestProvider>,
    );
    const button = await findByText('log-in');

    fireEvent.click(button);

    expect(buildAuthorizeUrl).toHaveBeenCalledWith({
      appState: {
        targetUrl: '/my-companies',
      },
    });
  });
});
