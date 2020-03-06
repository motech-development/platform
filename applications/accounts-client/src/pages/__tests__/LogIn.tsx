import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import TestProvider, { loginWithRedirect } from '../../utils/TestProvider';
import LogIn from '../LogIn';

describe('LogIn', () => {
  it('should call loginWithRedirect with the correct params', async () => {
    const { findByRole } = render(
      <TestProvider>
        <LogIn />
      </TestProvider>,
    );
    const button = await findByRole('button');

    fireEvent.click(button);

    expect(loginWithRedirect).toHaveBeenCalledWith({
      appState: {
        targetUrl: '/my-companies',
      },
    });
  });
});
