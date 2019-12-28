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
import ResetPassword from '../ResetPassword';

describe('ResetPassword', () => {
  let component: RenderResult;

  beforeEach(() => {
    component = render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>,
    );
  });

  it('should display the registration form', async () => {
    const { findByRole } = component;

    await expect(findByRole('form')).resolves.toBeDefined();
  });

  it('should display the success form when reset request sent', async () => {
    httpClient.post = jest.fn().mockResolvedValue({
      message: "We've just sent you an email to reset your password.",
    });

    const { findByLabelText, findByRole } = component;
    const email = await findByLabelText('Email address');
    const button = await findByRole('button');

    await wait(() => {
      fireEvent.change(email, {
        target: {
          value: 'info@motechdevelopment.co.uk',
        },
      });
    });

    await wait(() => {
      fireEvent.click(button);
    });

    const alert = await waitForElement(() => findByRole('alert'));

    expect(alert).toHaveTextContent(
      "We've just sent you an email to reset your password.",
    );
  });

  it('should call the API with the correct body', async () => {
    httpClient.post = jest.fn().mockResolvedValue({
      message: "We've just sent you an email to reset your password.",
    });

    const { findByLabelText, findByRole } = component;
    const email = await findByLabelText('Email address');
    const button = await findByRole('button');

    await wait(() => {
      fireEvent.change(email, {
        target: {
          value: 'info@motechdevelopment.co.uk',
        },
      });
    });

    await wait(() => {
      fireEvent.click(button);
    });

    expect(httpClient.post).toHaveBeenCalledWith('api/v1/forgotten-password', {
      email: 'info@motechdevelopment.co.uk',
    });
  });
});
