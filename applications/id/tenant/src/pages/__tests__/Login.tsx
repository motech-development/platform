import {
  act,
  fireEvent,
  render,
  RenderResult,
  wait,
} from '@testing-library/react';
import { WebAuth } from 'auth0-js';
import React from 'react';
import TestProvider, { add } from '../../utils/TestProvider';
import Login from '../Login';

describe('Login', () => {
  let component: RenderResult;

  beforeEach(async () => {
    window.config = {
      auth0Domain: 'https://auth0.com',
      callbackURL: 'https://my-app.com',
      clientID: 'client-id',
      internalOptions: {},
    };

    await act(async () => {
      component = render(
        <TestProvider>
          <Login />
        </TestProvider>,
      );
    });
  });

  describe('when authenticating', () => {
    it('should display a toast when request is unsuccessful', async () => {
      const { findAllByRole, findByLabelText } = component;

      (WebAuth.prototype.login as jest.Mock).mockImplementation((_, cb) =>
        cb({
          error: 'invalid_signup',
        }),
      );

      await act(async () => {
        const email = await findByLabelText('username.label');
        const password = await findByLabelText('password.label');

        fireEvent.change(email, {
          target: {
            value: 'test@example.com',
          },
        });

        fireEvent.change(password, {
          target: {
            value: 'Password',
          },
        });

        await wait();

        const [, button] = await findAllByRole('button');

        fireEvent.click(button);
      });

      await wait(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'danger',
          message: 'log-in.fallback',
        }),
      );
    });

    it('should call login with the correct params', async () => {
      const { findAllByRole, findByLabelText } = component;

      await act(async () => {
        const email = await findByLabelText('username.label');
        const password = await findByLabelText('password.label');

        fireEvent.change(email, {
          target: {
            value: 'test@example.com',
          },
        });

        fireEvent.change(password, {
          target: {
            value: 'Password',
          },
        });

        await wait();

        const [, button] = await findAllByRole('button');

        fireEvent.click(button);
      });

      expect(WebAuth.prototype.login).toHaveBeenCalledWith(
        {
          password: 'Password',
          realm: 'Username-Password-Authentication',
          username: 'test@example.com',
        },
        expect.any(Function),
      );
    });
  });

  describe('when signing up', () => {
    it('should display a toast when request is unsuccessful', async () => {
      (WebAuth.prototype.redirect
        .signupAndLogin as jest.Mock).mockImplementationOnce((_, cb) =>
        cb({
          error: 'invalid_signup',
        }),
      );

      const { findAllByRole, findByLabelText } = component;

      await act(async () => {
        const [, , signUp] = await findAllByRole('button');

        fireEvent.click(signUp);

        const email = await findByLabelText('username.label');
        const password = await findByLabelText('password.label');

        fireEvent.change(email, {
          target: {
            value: 'test@example.com',
          },
        });

        fireEvent.change(password, {
          target: {
            value: 'Password',
          },
        });

        await wait();

        const [button] = await findAllByRole('button');

        fireEvent.click(button);
      });

      await wait(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'danger',
          message: 'sign-up.fallback',
        }),
      );
    });

    it('should call signupAndLogin with the correct params', async () => {
      const { findAllByRole, findByLabelText } = component;

      (WebAuth.prototype.redirect
        .signupAndLogin as jest.Mock).mockImplementation((_, cb) =>
        cb({
          error: 'invalid_signup',
        }),
      );

      await act(async () => {
        const [, , signUp] = await findAllByRole('button');

        fireEvent.click(signUp);

        const email = await findByLabelText('username.label');
        const password = await findByLabelText('password.label');

        fireEvent.change(email, {
          target: {
            value: 'test@example.com',
          },
        });

        fireEvent.change(password, {
          target: {
            value: 'Password',
          },
        });

        await wait();

        const [button] = await findAllByRole('button');

        fireEvent.click(button);
      });

      expect(WebAuth.prototype.redirect.signupAndLogin).toHaveBeenCalledWith(
        {
          connection: 'Username-Password-Authentication',
          email: 'test@example.com',
          password: 'Password',
        },
        expect.any(Function),
      );
    });
  });

  describe('when resetting password', () => {
    it('should redirect you back to the log in screen', async () => {
      const { findAllByRole, findByLabelText, findByText } = component;

      await act(async () => {
        const [forgottenPassword] = await findAllByRole('button');

        fireEvent.click(forgottenPassword);

        const email = await findByLabelText('username.label');

        fireEvent.change(email, {
          target: {
            value: 'test@example.com',
          },
        });

        await wait();

        const [button] = await findAllByRole('button');

        fireEvent.click(button);
      });

      await expect(
        findByText('forgotten-password'),
      ).resolves.toBeInTheDocument();
    });

    it('should display a toast when request is successful', async () => {
      const { findAllByRole, findByLabelText } = component;

      await act(async () => {
        const [forgottenPassword] = await findAllByRole('button');

        fireEvent.click(forgottenPassword);

        const email = await findByLabelText('username.label');

        fireEvent.change(email, {
          target: {
            value: 'test@example.com',
          },
        });

        await wait();

        const [button] = await findAllByRole('button');

        fireEvent.click(button);
      });

      await wait(() =>
        expect(add).toHaveBeenCalledWith({
          colour: 'success',
          message: 'success',
        }),
      );
    });

    it('should call changePassword with the correct params', async () => {
      const { findAllByRole, findByLabelText } = component;

      await act(async () => {
        const [forgottenPassword] = await findAllByRole('button');

        fireEvent.click(forgottenPassword);

        const email = await findByLabelText('username.label');

        fireEvent.change(email, {
          target: {
            value: 'test@example.com',
          },
        });

        await wait();

        const [button] = await findAllByRole('button');

        fireEvent.click(button);
      });

      expect(WebAuth.prototype.changePassword).toHaveBeenCalledWith(
        {
          connection: 'Username-Password-Authentication',
          email: 'test@example.com',
        },
        expect.any(Function),
      );
    });
  });
});
