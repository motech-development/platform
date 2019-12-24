import {
  fireEvent,
  render,
  wait,
  waitForElement,
} from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import httpClient from '../../services/httpClient';
import Register from '../Register';

describe('Register', () => {
  it('should display the registration form', async () => {
    const { findByRole } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );

    await expect(findByRole('form')).resolves.toBeDefined();
  });

  it('should display an alert if registration fails', async () => {
    httpClient.post = jest.fn().mockRejectedValueOnce({
      message: 'Something went wrong',
    });

    const { findByLabelText, findByRole, getByRole } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );

    const forename = await findByLabelText('Forename');
    const surname = await findByLabelText('Surname');
    const email = await findByLabelText('Email address');
    const password = await findByLabelText('Password');
    const confirmPassword = await findByLabelText('Confirm your password');
    const button = await findByRole('button');

    await wait(() => {
      fireEvent.change(forename, { target: { value: 'Mo' } });
    });

    await wait(() => {
      fireEvent.change(surname, { target: { value: 'Gusbi' } });
    });

    await wait(() => {
      fireEvent.change(email, {
        target: {
          value: 'info@motechdevelopment.co.uk',
        },
      });
    });

    await wait(() => {
      fireEvent.change(password, { target: { value: 'SecurePassword123' } });
    });

    await wait(() => {
      fireEvent.change(confirmPassword, {
        target: {
          value: 'SecurePassword123',
        },
      });
    });

    await wait(() => {
      fireEvent.click(button);
    });

    const alert = await waitForElement(() => getByRole('alert'));

    expect(alert).toHaveTextContent('Something went wrong');
  });

  it('should display the next step screen if registration is successful', async () => {
    httpClient.post = jest.fn().mockResolvedValueOnce({
      data: {
        email: 'info@motechdevelopment.co.uk',
        name: 'Mo Gusbi',
      },
    });

    const { findByLabelText, findByRole, getByRole } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );

    const forename = await findByLabelText('Forename');
    const surname = await findByLabelText('Surname');
    const email = await findByLabelText('Email address');
    const password = await findByLabelText('Password');
    const confirmPassword = await findByLabelText('Confirm your password');
    const button = await findByRole('button');

    await wait(() => {
      fireEvent.change(forename, { target: { value: 'Mo' } });
    });

    await wait(() => {
      fireEvent.change(surname, { target: { value: 'Gusbi' } });
    });

    await wait(() => {
      fireEvent.change(email, {
        target: {
          value: 'info@motechdevelopment.co.uk',
        },
      });
    });

    await wait(() => {
      fireEvent.change(password, { target: { value: 'SecurePassword123' } });
    });

    await wait(() => {
      fireEvent.change(confirmPassword, {
        target: {
          value: 'SecurePassword123',
        },
      });
    });

    await wait(() => {
      fireEvent.click(button);
    });

    const alert = await waitForElement(() => getByRole('alert'));

    expect(alert).toHaveTextContent('Your registration is nearly complete!');
  });

  it('should call the API with the correct body', async () => {
    httpClient.post = jest.fn();

    const { findByLabelText, findByRole } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );

    const forename = await findByLabelText('Forename');
    const surname = await findByLabelText('Surname');
    const email = await findByLabelText('Email address');
    const password = await findByLabelText('Password');
    const confirmPassword = await findByLabelText('Confirm your password');
    const button = await findByRole('button');

    await wait(() => {
      fireEvent.change(forename, { target: { value: 'Mo' } });
    });

    await wait(() => {
      fireEvent.change(surname, { target: { value: 'Gusbi' } });
    });

    await wait(() => {
      fireEvent.change(email, {
        target: {
          value: 'info@motechdevelopment.co.uk',
        },
      });
    });

    await wait(() => {
      fireEvent.change(password, { target: { value: 'SecurePassword123' } });
    });

    await wait(() => {
      fireEvent.change(confirmPassword, {
        target: {
          value: 'SecurePassword123',
        },
      });
    });

    await wait(() => {
      fireEvent.click(button);
    });

    expect(httpClient.post).toHaveBeenCalledWith('api/v1/register', {
      confirmPassword: 'SecurePassword123',
      email: 'info@motechdevelopment.co.uk',
      family_name: 'Gusbi',
      given_name: 'Mo',
      password: 'SecurePassword123',
    });
  });
});
