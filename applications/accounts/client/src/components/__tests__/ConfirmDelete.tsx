import {
  act,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';
import TestProvider from '../../utils/TestProvider';
import ConfirmDelete from '../ConfirmDelete';

describe('ConfirmDelete', () => {
  let component: RenderResult;
  let onCancel: jest.Mock;
  let onDelete: jest.Mock;

  beforeEach(async () => {
    onCancel = jest.fn();
    onDelete = jest.fn();

    await act(async () => {
      component = render(
        <TestProvider>
          <ConfirmDelete
            loading={false}
            name="Test"
            onCancel={onCancel}
            onDelete={onDelete}
          />
        </TestProvider>,
      );

      await Promise.resolve();
    });
  });

  it('should call cancel event when cancel button is clicked', async () => {
    const { findAllByRole } = component;
    const [button] = await findAllByRole('button');

    fireEvent.click(button);

    expect(onCancel).toHaveBeenCalled();
  });

  it('should call onDelete when name is confirmed and submit button clicked', async () => {
    const { findAllByRole, findByLabelText } = component;

    await act(async () => {
      const input = await findByLabelText('confirm-delete');

      fireEvent.change(input, { target: { focus: () => {}, value: 'Test' } });

      const [, button] = await findAllByRole('button');

      await waitFor(() => expect(button).not.toBeDisabled());

      fireEvent.click(button);
    });

    expect(onDelete).toHaveBeenCalled();
  });
});
