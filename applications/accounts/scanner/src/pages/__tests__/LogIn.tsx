import { Capacitor } from '@capacitor/core';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import TestProvider, {
  buildAuthorizeUrl,
  loginWithRedirect,
} from '../../utils/TestProvider';
import LogIn from '../LogIn';

describe('LogIn', () => {
  it('should call log in with the correct params when plugin is available', async () => {
    (Capacitor.isPluginAvailable as jest.Mock).mockReturnValueOnce(false);

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

  it('should call log in with the correct params when plugin is available', async () => {
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
