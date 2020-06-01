import { render } from '@testing-library/react';
import React from 'react';
import TestProvider from '../../utils/TestProvider';
import Apollo from '../Apollo';

describe('Apollo', () => {
  it('should show error if no AppSync settings are set', async () => {
    const { findByText } = render(
      <TestProvider>
        <Apollo>
          <div data-testid="content" />
        </Apollo>
      </TestProvider>,
    );

    await expect(findByText('error.title')).resolves.toBeInTheDocument();
  });

  describe('when AppSync settings are set', () => {
    let env: NodeJS.ProcessEnv;

    beforeEach(() => {
      env = {
        ...process.env,
      };

      process.env.REACT_APP_APPSYNC_URL = 'https://appsync.endpoint';
      process.env.REACT_APP_AWS_REGION = 'eu-west-1';
    });

    afterEach(() => {
      process.env = env;
    });

    it('should show spinner if loading', () => {
      const { container } = render(
        <TestProvider isLoading>
          <Apollo>
            <div data-testid="content" />
          </Apollo>
        </TestProvider>,
      );
      const loader = container.querySelector('circle');

      expect(loader).toBeInTheDocument();
    });

    it('should show error if user is not authenticated', async () => {
      const { findByText } = render(
        <TestProvider isAuthenticated={false}>
          <Apollo>
            <div data-testid="content" />
          </Apollo>
        </TestProvider>,
      );

      await expect(
        findByText('unauthorised.title'),
      ).resolves.toBeInTheDocument();
    });

    it('should render child', async () => {
      const { findByTestId } = render(
        <TestProvider>
          <Apollo>
            <div data-testid="content" />
          </Apollo>
        </TestProvider>,
      );

      await expect(findByTestId('content')).resolves.toBeInTheDocument();
    });
  });
});
