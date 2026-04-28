import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextProvider, {
  add,
  createFetchResponse,
} from '../../utils/TestProvider';
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
        global.fetch = jest.fn().mockResolvedValue(
          createFetchResponse({
            body: 'success',
          }),
        );
      });

      it('should call the correct endpoint', async () => {
        const { findByLabelText, findByRole } = component;

        const password = await findByLabelText('password.label');
        const confirmation = await findByLabelText('confirm-password.label');

        await userEvent.type(password, 'Test');

        await userEvent.type(confirmation, 'Test');

        fireEvent.blur(confirmation);

        const button = await findByRole('button');

        await userEvent.click(button);

        await waitFor(() =>
          expect(fetch).toHaveBeenCalledWith('/lo/reset', {
            body: JSON.stringify({
              _csrf: 'token',
              confirmNewPassword: 'Test',
              newPassword: 'Test',
              'password-policy': 'good',
              ticket: 'ticket',
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          }),
        );
      });

      it('should display the succes screen when password is reset', async () => {
        const { findByLabelText, findByRole, findByText } = component;

        const password = await findByLabelText('password.label');
        const confirmation = await findByLabelText('confirm-password.label');

        await userEvent.type(password, 'Test');

        await userEvent.type(confirmation, 'Test');

        fireEvent.blur(confirmation);

        const button = await findByRole('button');

        await userEvent.click(button);

        await waitFor(() =>
          expect(findByText('success')).resolves.toBeInTheDocument(),
        );
      });
    });

    describe('when unsuccessful', () => {
      beforeEach(() => {
        global.fetch = jest.fn();
      });

      it('should display an error toast with the supplied error message', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce(
          createFetchResponse({
            body: JSON.stringify({
              message: 'Ooops',
            }),
            contentType: 'application/json',
            ok: false,
            status: 400,
          }),
        );

        const { findByLabelText, findByRole } = component;

        const password = await findByLabelText('password.label');
        const confirmation = await findByLabelText('confirm-password.label');

        await userEvent.type(password, 'Test');

        await userEvent.type(confirmation, 'Test');

        fireEvent.blur(confirmation);

        const button = await findByRole('button');

        await userEvent.click(button);

        await waitFor(() =>
          expect(add).toHaveBeenCalledWith({
            colour: 'danger',
            message: 'Ooops',
          }),
        );
      });

      it('should display an error toast when an error message is not supplied', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce(
          createFetchResponse({
            body: null,
            ok: false,
            status: 400,
          }),
        );

        const { findByLabelText, findByRole } = component;

        const password = await findByLabelText('password.label');
        const confirmation = await findByLabelText('confirm-password.label');

        await userEvent.type(password, 'Test');

        await userEvent.type(confirmation, 'Test');

        fireEvent.blur(confirmation);

        const button = await findByRole('button');

        await userEvent.click(button);

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
