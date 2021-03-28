import { render } from '@testing-library/react';
import { GraphQLError } from 'graphql';
import TestProvider from '../../utils/TestProvider';
import Connected from '../Connected';

describe('Connected', () => {
  it('should show loading spinner when loading', () => {
    const { container } = render(
      <TestProvider>
        <Connected loading>
          <div data-testid="content">Hello world</div>
        </Connected>
      </TestProvider>,
    );
    const loader = container.querySelector('circle');

    expect(loader).toBeInTheDocument();
  });

  it('should show ErrorCard when an error has occurred', async () => {
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

    await expect(findByText(error.name)).resolves.toBeInTheDocument();
  });

  it('should show content when there are no errors and not loading', async () => {
    const { findByTestId } = render(
      <TestProvider>
        <Connected loading={false}>
          <div data-testid="content">Hello world</div>
        </Connected>
      </TestProvider>,
    );

    await expect(findByTestId('content')).resolves.toBeInTheDocument();
  });

  it('should show extended errors', async () => {
    const error = {
      extraInfo: null,
      graphQLErrors: [
        new GraphQLError('This is a more meaningful error message'),
      ],
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

    await expect(
      findByText(error.graphQLErrors[0].message),
    ).resolves.toBeInTheDocument();
  });
});
