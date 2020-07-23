import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import TestProvider, { loginWithRedirect } from '../../utils/TestProvider';
import LogIn from '../LogIn';

describe('LogIn', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn().mockImplementation(query => ({
        addEventListener: jest.fn(),
        addListener: jest.fn(),
        dispatchEvent: jest.fn(),
        matches: false,
        media: query,
        onchange: null,
        removeEventListener: jest.fn(),
        removeListener: jest.fn(),
      })),
      writable: true,
    });
  });

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
