import { render } from '@testing-library/react';
import React from 'react';
import TestProvider from '../../utils/TestProvider';
import Connected from '../Connected';

describe('Connected', () => {
  it('should show spinner when loading', async () => {
    const { findByTestId } = render(
      <TestProvider>
        <Connected loading>
          <div data-testid="content">Hello world</div>
        </Connected>
      </TestProvider>,
    );

    await expect(
      findByTestId('connected-loading'),
    ).resolves.toBeInTheDocument();
  });

  it('should display an error message', async () => {
    const error = {
      extraInfo: null,
      graphQLErrors: [],
      message: 'There is an error',
      name: 'Test error',
      networkError: null,
    };
    const { findByText } = render(
      <TestProvider>
        <Connected loading={false} error={error}>
          <div data-testid="content">Hello world</div>
        </Connected>
      </TestProvider>,
    );

    await expect(findByText('Test error')).resolves.toBeInTheDocument();
  });

  it('should display content', async () => {
    const { findByTestId } = render(
      <TestProvider>
        <Connected loading={false}>
          <div data-testid="content">Hello world</div>
        </Connected>
      </TestProvider>,
    );

    await expect(findByTestId('content')).resolves.toBeInTheDocument();
  });
});
