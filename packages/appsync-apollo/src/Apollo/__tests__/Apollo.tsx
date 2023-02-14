import { render } from '@testing-library/react';
import Apollo from '../Apollo';

function Error() {
  return <p data-testid="error">Error</p>;
}

function Loading() {
  return <div data-testid="loading" />;
}

function Unauthorised() {
  return <p data-testid="unauthorised">Unauthorised</p>;
}

describe('Apollo', () => {
  let getTokenSilently: jest.Mock;

  beforeEach(() => {
    getTokenSilently = jest.fn();
  });

  it('should show error if no AppSync settings are set', async () => {
    const { findByTestId } = render(
      <Apollo
        error={<Error />}
        fallback={<Loading />}
        getTokenSilently={getTokenSilently}
        isAuthenticated
        isLoading={false}
        unauthorised={<Unauthorised />}
      >
        <div data-testid="content" />
      </Apollo>,
    );

    await expect(findByTestId('error')).resolves.toBeInTheDocument();
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

    it('should show spinner if loading', async () => {
      const { findByTestId } = render(
        <Apollo
          error={<Error />}
          fallback={<Loading />}
          getTokenSilently={getTokenSilently}
          isAuthenticated={false}
          isLoading
          unauthorised={<Unauthorised />}
        >
          <div data-testid="content" />
        </Apollo>,
      );

      await expect(findByTestId('loading')).resolves.toBeInTheDocument();
    });

    it('should show error if user is not authenticated', async () => {
      const { findByTestId } = render(
        <Apollo
          error={<Error />}
          fallback={<Loading />}
          getTokenSilently={getTokenSilently}
          isAuthenticated={false}
          isLoading={false}
          unauthorised={<Unauthorised />}
        >
          <div data-testid="content" />
        </Apollo>,
      );

      await expect(findByTestId('unauthorised')).resolves.toBeInTheDocument();
    });

    it('should render child', async () => {
      const { findByTestId } = render(
        <Apollo
          error={<Error />}
          fallback={<Loading />}
          getTokenSilently={getTokenSilently}
          isAuthenticated
          isLoading={false}
          unauthorised={<Unauthorised />}
        >
          <div data-testid="content" />
        </Apollo>,
      );

      await expect(findByTestId('content')).resolves.toBeInTheDocument();
    });
  });
});
