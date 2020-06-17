import { render } from '@testing-library/react';
import React from 'react';
import TestProvider from '../utils/TestProvider';
import App from '../App';

jest.mock('react-ga');

describe('App', () => {
  it('should show the name of the app in the bar', async () => {
    const { findByText } = render(
      <TestProvider>
        <App />
      </TestProvider>,
    );

    await expect(findByText('app-name')).resolves.toBeInTheDocument();
  });
});
