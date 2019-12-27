import {
  fireEvent,
  render,
  RenderResult,
  wait,
  waitForElement,
} from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import httpClient from '../../services/httpClient';
import Home from '../Home';

describe('Home', () => {
  let component: RenderResult;

  beforeEach(() => {
    component = render(
      <MemoryRouter>
        <Home redirectUri="https://localhost:9000/callback" />
      </MemoryRouter>,
    );
  });

  it('should display the log in form', async () => {
    const { findByRole } = component;

    await expect(findByRole('form')).resolves.toBeDefined();
  });

  it('should display an alert if log in is unsuccessful', async () => {
    httpClient.post = jest.fn().mockRejectedValueOnce({
      message: 'Something went wrong',
    });

    const { findByLabelText, findByRole, getByRole } = component;

    const email = await findByLabelText('Email address');
    const password = await findByLabelText('Password');
    const button = await findByRole('button');

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
      fireEvent.click(button);
    });

    const alert = await waitForElement(() => getByRole('alert'));

    expect(alert).toHaveTextContent('Something went wrong');
  });

  it('should redirect to the correct location if log in is successful', async () => {
    window.location.assign = jest.fn();

    httpClient.post = jest.fn().mockResolvedValueOnce({
      access_token: 'gQRYBsrsd0c9iJpPaKhhY5_7s7GahxrE',
      expires_in: 86400,
      id_token: 'fdkjfhskjdfh',
      scope: 'openid profile email address phone',
      token_type: 'Bearer',
    });

    const { findByLabelText, findByRole } = component;

    const email = await findByLabelText('Email address');
    const password = await findByLabelText('Password');
    const button = await findByRole('button');

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
      fireEvent.click(button);
    });

    expect(window.location.assign).toHaveBeenLastCalledWith(
      'https://localhost:9000/callback#access_token=gQRYBsrsd0c9iJpPaKhhY5_7s7GahxrE&expires_in=86400&scope=openid%20profile%20email%20address%20phone&token_type=Bearer',
    );
  });

  it('should call the API with the correct body', async () => {
    httpClient.post = jest.fn();

    const { findByLabelText, findByRole } = component;

    const email = await findByLabelText('Email address');
    const password = await findByLabelText('Password');
    const button = await findByRole('button');

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
      fireEvent.click(button);
    });

    expect(httpClient.post).toHaveBeenCalledWith('api/v1/auth', {
      password: 'SecurePassword123',
      username: 'info@motechdevelopment.co.uk',
    });
  });
});
