import { render } from '@testing-library/react';
import TestProvider from '../../utils/TestProvider';
import NotFound from '../NotFound';

describe('NotFound', () => {
  it('should display the correct title', async () => {
    const { findByText } = render(
      <TestProvider>
        <NotFound />
      </TestProvider>,
    );

    await expect(findByText('not-found')).resolves.toBeInTheDocument();
  });

  it('should display the correct description', async () => {
    const { findByText } = render(
      <TestProvider>
        <NotFound />
      </TestProvider>,
    );

    await expect(findByText('description')).resolves.toBeInTheDocument();
  });
});
