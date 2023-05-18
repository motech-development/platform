import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import TextProvider, { add } from '../../utils/TestProvider';
import Reset from '../Reset';

jest.mock('react-ga');

describe('Reset', () => {
  let component: RenderResult;

  describe('when config is not set', () => {
    beforeEach(() => {
      component = render(
        <TextProvider>
          <Reset />
        </TextProvider>,
      );
    });

    it('should render component', () => {
      const { container } = component;
      const loader = container.querySelector('circle');

      expect(loader).toBeInTheDocument();
    });
  });

  describe('when config is set', () => {
    beforeEach(async () => {
      window.passwordReset = {
        csrfToken: 'token',
        email: 'text@example.com',
        passwordPolicy: 'good',
        ticket: 'ticket',
      };

      await act(async () => {
        component = render(
          <TextProvider>
            <Reset />
          </TextProvider>,
        );

        await Promise.resolve();
      });
    });

    describe('when successful', () => {
      beforeEach(() => {
        axios.request = jest.fn().mockResolvedValue({
          data: 'success',
        });
      });

      it('should call the correct endpoint', async () => {
        const { findByLabelText, findByRole } = component;

        const password = await findByLabelText('password.label');
        const confirmation = await findByLabelText('confirm-password.label');

        await act(async () => {
          await userEvent.type(password, 'Test');

          await userEvent.type(confirmation, 'Test');

          fireEvent.blur(confirmation);
        });

        const button = await findByRole('button');

        await act(async () => {
          await userEvent.click(button);
        });

        await waitFor(() =>
          expect(axios.request).toHaveBeenCalledWith({
            data: {
              _csrf: 'token',
              confirmNewPassword: 'Test',
              newPassword: 'Test',
              'password-policy': 'good',
              ticket: 'ticket',
            },
            headers: {},
            method: 'POST',
            url: '/lo/reset',
          }),
        );
      });

      it('should display the succes screen when password is reset', async () => {
        const { findByLabelText, findByRole, findByText } = component;

        const password = await findByLabelText('password.label');
        const confirmation = await findByLabelText('confirm-password.label');

        await act(async () => {
          await userEvent.type(password, 'Test');

          await userEvent.type(confirmation, 'Test');

          fireEvent.blur(confirmation);
        });

        const button = await findByRole('button');

        await act(async () => {
          await userEvent.click(button);
        });

        await waitFor(() =>
          expect(findByText('success')).resolves.toBeInTheDocument(),
        );
      });
    });

    describe('when unsuccessful', () => {
      beforeEach(() => {
        axios.request = jest.fn();
      });

      it('should display an error toast with the supplied error message', async () => {
        (axios.request as jest.Mock).mockRejectedValueOnce({
          isAxiosError: true,
          response: {
            data: {
              message: 'Ooops',
            },
          },
        });

        const { findByLabelText, findByRole } = component;

        const password = await findByLabelText('password.label');
        const confirmation = await findByLabelText('confirm-password.label');

        await act(async () => {
          await userEvent.type(password, 'Test');

          await userEvent.type(confirmation, 'Test');
        });

        fireEvent.blur(confirmation);

        const button = await findByRole('button');

        await act(async () => {
          await userEvent.click(button);
        });

        await waitFor(() =>
          expect(add).toHaveBeenCalledWith({
            colour: 'danger',
            message: 'Ooops',
          }),
        );
      });

      it('should display an error toast when an error message is not supplied', async () => {
        (axios.request as jest.Mock).mockRejectedValueOnce({
          isAxiosError: true,
        });

        const { findByLabelText, findByRole } = component;

        const password = await findByLabelText('password.label');
        const confirmation = await findByLabelText('confirm-password.label');

        await act(async () => {
          await userEvent.type(password, 'Test');

          await userEvent.type(confirmation, 'Test');
        });

        fireEvent.blur(confirmation);

        const button = await findByRole('button');

        await act(async () => {
          await userEvent.click(button);
        });

        await waitFor(() =>
          expect(add).toHaveBeenCalledWith({
            colour: 'danger',
            message: 'error',
          }),
        );
      });
    });
  });
});
