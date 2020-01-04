import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import TestProvider, { loginWithRedirect } from '../../utils/TestProvider';
import Index from '../Index';

describe('Index', () => {
  it('should call loginWithRedirect with the correct params', async () => {
    const { findByRole } = render(
      <TestProvider>
        <Index />
      </TestProvider>,
    );
    const button = await findByRole('button');

    fireEvent.click(button);

    expect(loginWithRedirect).toHaveBeenCalledWith({
      appState: {
        targetUrl: '/dashboard',
      },
    });
  });
});
