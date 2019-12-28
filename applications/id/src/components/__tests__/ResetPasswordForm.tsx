import { render, RenderResult } from '@testing-library/react';
import React from 'react';
import ResetPasswordForm from '../ResetPasswordForm';

describe('ResetPasswordForm', () => {
  let component: RenderResult;
  let onSubmit: jest.Mock;

  beforeEach(() => {
    onSubmit = jest.fn();
    component = render(<ResetPasswordForm onSubmit={onSubmit} />);
  });

  it('should have a "Reset password" button', async () => {
    const { findByRole } = component;

    await expect(findByRole('button')).resolves.toHaveTextContent(
      'Reset password',
    );
  });

  it('should have the correct fields', async () => {
    const { findByLabelText } = component;

    await expect(findByLabelText('Email address')).resolves.toBeDefined();
  });
});
