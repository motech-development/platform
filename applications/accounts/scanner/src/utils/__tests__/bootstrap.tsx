import { render } from '@testing-library/react';
import React, { FC } from 'react';
import bootstrap from '../bootstrap';
import TestProvider from '../TestProvider';

const TestComponent: FC = () => <div data-testid="content">Loaded</div>;
const WrappedComponent = bootstrap(TestComponent);

describe('bootstrap', () => {
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

  it('should display loader when loading', async () => {
    const { findByTestId } = render(
      <TestProvider isLoading>
        <WrappedComponent />
      </TestProvider>,
    );

    await expect(findByTestId('auth-loading')).resolves.toBeInTheDocument();
  });

  it('should display content when authenticated', async () => {
    const { findByTestId } = render(
      <TestProvider isAuthenticated>
        <WrappedComponent />
      </TestProvider>,
    );

    await expect(findByTestId('content')).resolves.toBeInTheDocument();
  });

  it('should show login page when not authenticated', async () => {
    const { findByText } = render(
      <TestProvider isAuthenticated={false}>
        <WrappedComponent />
      </TestProvider>,
    );

    await expect(findByText('log-in')).resolves.toBeInTheDocument();
  });
});
