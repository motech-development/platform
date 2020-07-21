import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import TestProvider, { loginWithRedirect } from '../../utils/TestProvider';
import LogIn from '../LogIn';

describe('LogIn', () => {
  it('should call log in with the correct params', async () => {
    const { findByText } = render(
      <TestProvider>
        <LogIn />
      </TestProvider>,
    );
    const button = await findByText('log-in');

    fireEvent.click(button);

    expect(loginWithRedirect).toHaveBeenCalledWith({
      appState: {
        targetUrl: '/receipts',
      },
    });
  });
});
