import {
  act,
  fireEvent,
  render,
  RenderResult,
  wait,
} from '@testing-library/react';
import axios from 'axios';
import React from 'react';
import TextProvider, { add } from '../../utils/TestProvider';
import Reset from '../Reset';

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
    beforeEach(() => {
      window.passwordReset = {
        csrfToken: 'token',
        email: 'text@example.com',
        passwordPolicy: 'good',
        ticket: 'ticket',
      };

      component = render(
        <TextProvider>
          <Reset />
        </TextProvider>,
      );
    });

    describe('when successful', () => {
      beforeEach(() => {
        axios.request = jest.fn().mockResolvedValue({
          data: 'success',
        });
      });

      it('should call the correct endpoint', async () => {
        const { findByLabelText, findByRole } = component;

        await act(async () => {
          const password = await findByLabelText('password.label');
          const confirmation = await findByLabelText('confirm-password.label');

          fireEvent.change(password, {
            target: {
              value: 'Test',
            },
          });

          fireEvent.change(confirmation, {
            target: {
              value: 'Test',
            },
          });

          await wait();

          const button = await findByRole('button');

          fireEvent.click(button);
        });

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
        });
      });

      it('should display the succes screen when password is reset', async () => {
        const { findByLabelText, findByRole, findByText } = component;

        await act(async () => {
          const password = await findByLabelText('password.label');
          const confirmation = await findByLabelText('confirm-password.label');

          fireEvent.change(password, {
            target: {
              value: 'Test',
            },
          });

          fireEvent.change(confirmation, {
            target: {
              value: 'Test',
            },
          });

          await wait();

          const button = await findByRole('button');

          fireEvent.click(button);
        });

        await wait(() =>
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
          response: {
            data: {
              message: 'Ooops',
            },
          },
        });

        const { findByLabelText, findByRole } = component;

        await act(async () => {
          const password = await findByLabelText('password.label');
          const confirmation = await findByLabelText('confirm-password.label');

          fireEvent.change(password, {
            target: {
              value: 'Test',
            },
          });

          fireEvent.change(confirmation, {
            target: {
              value: 'Test',
            },
          });

          await wait();

          const button = await findByRole('button');

          fireEvent.click(button);
        });

        await wait(() =>
          expect(add).toHaveBeenCalledWith({
            colour: 'danger',
            message: 'Ooops',
          }),
        );
      });

      it('should display an error toast with the supplied error message', async () => {
        (axios.request as jest.Mock).mockRejectedValueOnce(new Error());

        const { findByLabelText, findByRole } = component;

        await act(async () => {
          const password = await findByLabelText('password.label');
          const confirmation = await findByLabelText('confirm-password.label');

          fireEvent.change(password, {
            target: {
              value: 'Test',
            },
          });

          fireEvent.change(confirmation, {
            target: {
              value: 'Test',
            },
          });

          await wait();

          const button = await findByRole('button');

          fireEvent.click(button);
        });

        await wait(() =>
          expect(add).toHaveBeenCalledWith({
            colour: 'danger',
            message: 'error',
          }),
        );
      });
    });
  });
});
