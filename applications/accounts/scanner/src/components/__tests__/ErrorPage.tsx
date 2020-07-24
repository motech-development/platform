import { render } from '@testing-library/react';
import React from 'react';
import TestProvider from '../../utils/TestProvider';
import ErrorPage from '../ErrorPage';

describe('ErrorPage', () => {
  it('should render error page with the correct namespace keys', async () => {
    const { findAllByText, findByText } = render(
      <TestProvider>
        <ErrorPage namespace="test" />
      </TestProvider>,
    );

    await expect(findAllByText('test.title')).resolves.toHaveLength(2);

    await expect(findByText('test.description')).resolves.toBeInTheDocument();
  });
});
