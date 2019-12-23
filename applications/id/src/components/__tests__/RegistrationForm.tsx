import { fireEvent, render, waitForElement } from '@testing-library/react';
import React from 'react';
import RegistrationForm from '../RegistrationForm';

describe('RegistrationForm', () => {
  let onSubmit: jest.Mock;

  beforeEach(() => {
    onSubmit = jest.fn();
  });

  it('should have a "Register" button', async () => {
    const { findByRole } = render(
      <RegistrationForm alert="" onSubmit={onSubmit} />,
    );

    await expect(findByRole('button')).resolves.toHaveTextContent('Register');
  });

  it('should have the correct fields', async () => {
    const { findByLabelText } = render(
      <RegistrationForm alert="" onSubmit={onSubmit} />,
    );

    await expect(findByLabelText('Full name')).resolves.toBeDefined();
    await expect(findByLabelText('Email address')).resolves.toBeDefined();
    await expect(findByLabelText('Password')).resolves.toBeDefined();
  });

  it('the register button should enabled if the form is valid', async () => {
    const { findByLabelText, findByRole } = render(
      <RegistrationForm alert="" onSubmit={onSubmit} />,
    );

    const name = await findByLabelText('Full name');
    const email = await findByLabelText('Email address');
    const password = await findByLabelText('Password');

    fireEvent.change(name, { target: { value: 'Mo Gusbi' } });
    fireEvent.change(email, {
      target: {
        value: 'info@motechdevelopment.co.uk',
      },
    });
    fireEvent.change(password, { target: { value: 'SecurePassword123' } });

    await expect(findByRole('button')).resolves.not.toHaveAttribute('disabled');
  });

  it('should not have an alert visible', async () => {
    const { findByRole, queryByRole } = render(
      <RegistrationForm alert="" onSubmit={onSubmit} />,
    );

    const alert = queryByRole('alert');

    await waitForElement(() => findByRole('button'));

    expect(alert).toBeNull();
  });

  it('should have an alert visible', async () => {
    const { findByRole } = render(
      <RegistrationForm alert="This is an alert" onSubmit={onSubmit} />,
    );

    await expect(findByRole('alert')).resolves.toHaveTextContent(
      'This is an alert',
    );
  });
});
