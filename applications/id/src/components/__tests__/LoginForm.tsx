import { render, waitForElement } from '@testing-library/react';
import React from 'react';
import LoginForm from '../LoginForm';

describe('LoginForm', () => {
  let onSubmit: jest.Mock;

  beforeEach(() => {
    onSubmit = jest.fn();
  });

  it('should have a "Log in" button', async () => {
    const { findByRole } = render(<LoginForm alert="" onSubmit={onSubmit} />);

    await expect(findByRole('button')).resolves.toHaveTextContent('Log in');
  });

  it('should have the correct fields', async () => {
    const { findByLabelText } = render(
      <LoginForm alert="" onSubmit={onSubmit} />,
    );

    await expect(findByLabelText('Email address')).resolves.toBeDefined();
    await expect(findByLabelText('Password')).resolves.toBeDefined();
  });

  it('should not have an alert visible', async () => {
    const { findByRole, queryByRole } = render(
      <LoginForm alert="" onSubmit={onSubmit} />,
    );

    const alert = queryByRole('alert');

    await waitForElement(() => findByRole('button'));

    expect(alert).toBeNull();
  });

  it('should have an alert visible', async () => {
    const { findByRole } = render(
      <LoginForm alert="This is an alert" onSubmit={onSubmit} />,
    );

    await expect(findByRole('alert')).resolves.toHaveTextContent(
      'This is an alert',
    );
  });
});
