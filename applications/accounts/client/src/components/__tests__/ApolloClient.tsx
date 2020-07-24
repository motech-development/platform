import { render } from '@testing-library/react';
import React from 'react';
import TestProvider from '../../utils/TestProvider';
import ApolloClient from '../ApolloClient';

describe('ApolloClient', () => {
  it('should show error if no AppSync settings are set', async () => {
    const { findByText } = render(
      <TestProvider>
        <ApolloClient>
          <div data-testid="content" />
        </ApolloClient>
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
          <ApolloClient>
            <div data-testid="content" />
          </ApolloClient>
        </TestProvider>,
      );
      const loader = container.querySelector('circle');

      expect(loader).toBeInTheDocument();
    });

    it('should show error if user is not authenticated', async () => {
      const { findByText } = render(
        <TestProvider isAuthenticated={false}>
          <ApolloClient>
            <div data-testid="content" />
          </ApolloClient>
        </TestProvider>,
      );

      await expect(
        findByText('unauthorised.title'),
      ).resolves.toBeInTheDocument();
    });

    it('should render child', async () => {
      const { findByTestId } = render(
        <TestProvider>
          <ApolloClient>
            <div data-testid="content" />
          </ApolloClient>
        </TestProvider>,
      );

      await expect(findByTestId('content')).resolves.toBeInTheDocument();
    });
  });
});
