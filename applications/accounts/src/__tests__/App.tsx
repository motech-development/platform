import { render } from '@testing-library/react';
import React from 'react';
import TestProvider from '../utils/TestProvider';
import App from '../App';

describe('App', () => {
  it('should render when loaded', () => {
    const { container } = render(
      <TestProvider>
        <App />
      </TestProvider>,
    );

    expect(container).toBeInTheDocument();
  });

  it('should show a loader when loading', () => {
    const { container } = render(
      <TestProvider isLoading>
        <App />
      </TestProvider>,
    );
    const loader = container.querySelector('circle');

    expect(loader).toBeInTheDocument();
  });
});
