import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WebAuth } from 'auth0-js';
import TestProvider, { add } from '../../utils/TestProvider';
import Login from '../Login';

jest.mock('react-ga');

describe('Login', () => {
  let component: RenderResult;

  describe('when config is not set', () => {
    beforeEach(async () => {
      await act(async () => {
        component = render(
          <TestProvider>
            <Login />
          </TestProvider>,
        );
      });
    });

    it('should render component', () => {
      const { container } = component;
      const loader = container.querySelector('circle');

      expect(loader).toBeInTheDocument();
    });
  });

  describe('when config is set', () => {
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

        (WebAuth.prototype.login as jest.Mock).mockImplementationOnce((_, cb) =>
          cb({
            code: 'invalid_signup',
          }),
        );

        await act(async () => {
          const email = await findByLabelText('username.label');
          const password = await findByLabelText('password.label');

          userEvent.type(email, 'test@example.com');

          userEvent.type(password, 'Password');
        });

        await act(async () => {
          const [, button] = await findAllByRole('button');

          userEvent.click(button);
        });

        await waitFor(() =>
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

          userEvent.type(email, 'test@example.com');

          userEvent.type(password, 'Password');
        });

        await act(async () => {
          const [, button] = await findAllByRole('button');

          userEvent.click(button);
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
        (WebAuth.prototype.signup as jest.Mock).mockImplementationOnce(
          (_, cb) =>
            cb({
              code: 'invalid_user_password',
              description: 'test',
            }),
        );

        const { findAllByRole, findByLabelText } = component;

        await act(async () => {
          const [, , signUp] = await findAllByRole('button');

          userEvent.click(signUp);
        });

        await act(async () => {
          const givenName = await findByLabelText('given-name.label');
          const familyName = await findByLabelText('family-name.label');
          const email = await findByLabelText('username.label');
          const password = await findByLabelText('password.label');

          userEvent.type(givenName, 'Test');

          userEvent.type(familyName, 'User');

          userEvent.type(email, 'test@example.com');

          userEvent.type(password, 'Password');
        });

        await act(async () => {
          const [button] = await findAllByRole('button');

          userEvent.click(button);
        });

        await waitFor(() =>
          expect(add).toHaveBeenCalledWith({
            colour: 'danger',
            message: 'test',
          }),
        );
      });

      it('should call signupAndLogin with the correct params', async () => {
        const { findAllByRole, findByLabelText } = component;

        (WebAuth.prototype.signup as jest.Mock).mockImplementationOnce(
          (_, cb) =>
            cb({
              code: 'invalid_signup',
            }),
        );

        await act(async () => {
          const [, , signUp] = await findAllByRole('button');

          userEvent.click(signUp);
        });

        await act(async () => {
          const givenName = await findByLabelText('given-name.label');
          const familyName = await findByLabelText('family-name.label');
          const email = await findByLabelText('username.label');
          const password = await findByLabelText('password.label');

          userEvent.type(givenName, 'Test');

          userEvent.type(familyName, 'User');

          userEvent.type(email, 'test@example.com');

          userEvent.type(password, 'Password');
        });

        await act(async () => {
          const [button] = await findAllByRole('button');

          userEvent.click(button);
        });

        expect(WebAuth.prototype.signup).toHaveBeenCalledWith(
          {
            connection: 'Username-Password-Authentication',
            email: 'test@example.com',
            password: 'Password',
            userMetadata: {
              family_name: 'User',
              given_name: 'Test',
            },
          },
          expect.any(Function),
        );
      });

      it.only('should display a toast when sign up is successful and go to the log in view', async () => {
        const { findAllByRole, findByLabelText, findByText } = component;

        await act(async () => {
          const [, , signUp] = await findAllByRole('button');

          userEvent.click(signUp);
        });

        await act(async () => {
          const givenName = await findByLabelText('given-name.label');
          const familyName = await findByLabelText('family-name.label');
          const email = await findByLabelText('username.label');
          const password = await findByLabelText('password.label');

          userEvent.type(givenName, 'Test');

          userEvent.type(familyName, 'User');

          userEvent.type(email, 'test@example.com');

          userEvent.type(password, 'Password');

          fireEvent.blur(password);
        });

        await act(async () => {
          const [button] = await findAllByRole('button');

          userEvent.click(button);
        });

        expect(add).toHaveBeenCalledWith({
          colour: 'success',
          message: 'success',
        });

        // await waitFor(() =>
        //   ,
        // );

        await expect(
          findByText('forgotten-password'),
        ).resolves.toBeInTheDocument();
      });

      it('should go back to log in page', async () => {
        const { findAllByRole, findByText, findByLabelText } = component;

        await act(async () => {
          const [, , signUp] = await findAllByRole('button');

          userEvent.click(signUp);
        });

        await act(async () => {
          await waitFor(() => findByLabelText('username.label'));

          const [, goBack] = await findAllByRole('button');

          userEvent.click(goBack);
        });

        await expect(
          findByText('forgotten-password'),
        ).resolves.toBeInTheDocument();
      });
    });

    describe('when resetting password', () => {
      it('should redirect you back to the log in screen', async () => {
        const { findAllByRole, findByLabelText, findByText } = component;

        await act(async () => {
          const [forgottenPassword] = await findAllByRole('button');

          userEvent.click(forgottenPassword);
        });

        await act(async () => {
          const email = await findByLabelText('username.label');

          userEvent.type(email, 'test@example.com');
        });

        await act(async () => {
          const [button] = await findAllByRole('button');

          userEvent.click(button);
        });

        await expect(
          findByText('forgotten-password'),
        ).resolves.toBeInTheDocument();
      });

      it('should display a toast when request is successful', async () => {
        const { findAllByRole, findByLabelText } = component;

        await act(async () => {
          const [forgottenPassword] = await findAllByRole('button');

          userEvent.click(forgottenPassword);
        });

        await act(async () => {
          const email = await findByLabelText('username.label');

          userEvent.type(email, 'test@example.com');
        });

        await act(async () => {
          const [button] = await findAllByRole('button');

          userEvent.click(button);
        });

        await waitFor(() =>
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

          userEvent.click(forgottenPassword);
        });

        await act(async () => {
          const email = await findByLabelText('username.label');

          userEvent.type(email, 'test@example.com');
        });

        await act(async () => {
          const [button] = await findAllByRole('button');

          userEvent.click(button);
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

    it('should go back to log in page', async () => {
      const { findAllByRole, findByText, findByLabelText } = component;

      await act(async () => {
        const [forgottenPassword] = await findAllByRole('button');

        userEvent.click(forgottenPassword);
      });

      await act(async () => {
        await waitFor(() => findByLabelText('username.label'));

        const [, goBack] = await findAllByRole('button');

        userEvent.click(goBack);
      });

      await expect(
        findByText('forgotten-password'),
      ).resolves.toBeInTheDocument();
    });
  });
});
