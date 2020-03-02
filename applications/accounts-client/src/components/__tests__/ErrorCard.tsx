import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import history from '../../history';
import TestProvider from '../../utils/TestProvider';
import ErrorCard from '../ErrorCard';

describe('ErrorCard', () => {
  beforeEach(() => {
    history.goBack = jest.fn();
  });

  it('should display title', async () => {
    const { findByText } = render(
      <TestProvider>
        <ErrorCard title="Ooops" description="Something has gone Pete Tong" />
      </TestProvider>,
    );

    await expect(findByText('Ooops')).resolves.toBeInTheDocument();
  });

  it('should display description', async () => {
    const { findByText } = render(
      <TestProvider>
        <ErrorCard title="Ooops" description="Something has gone Pete Tong" />
      </TestProvider>,
    );

    await expect(
      findByText('Something has gone Pete Tong'),
    ).resolves.toBeInTheDocument();
  });

  it('should display error messages when they exist', async () => {
    const errors = ['This is an error'];
    const { findByText } = render(
      <TestProvider>
        <ErrorCard
          title="Ooops"
          description="Something has gone Pete Tong"
          errors={errors}
        />
      </TestProvider>,
    );

    await expect(findByText('This is an error')).resolves.toBeInTheDocument();
  });

  it('should go back to previous page', async () => {
    const { findByRole } = render(
      <TestProvider>
        <ErrorCard title="Ooops" description="Something has gone Pete Tong" />
      </TestProvider>,
    );
    const button = await findByRole('button');

    fireEvent.click(button);

    expect(history.goBack).toHaveBeenCalled();
  });
});
