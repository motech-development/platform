import { fireEvent, render } from '@testing-library/react';
import React, { FC } from 'react';
import { AlertTheme } from '../../Alert/Alert';
import ToastProvider, { useToast } from '../ToastProvider';

const TestComponent: FC = () => {
  const { add } = useToast();
  const addAlert = (colour: AlertTheme) => {
    add({
      colour,
      message: colour,
    });
  };

  return (
    <>
      <button
        type="button"
        data-testid="danger"
        onClick={() => addAlert('danger')}
      >
        Danger
      </button>
      <button
        type="button"
        data-testid="primary"
        onClick={() => addAlert('primary')}
      >
        Primary
      </button>
      <button
        type="button"
        data-testid="secondary"
        onClick={() => addAlert('secondary')}
      >
        Secondary
      </button>
      <button
        type="button"
        data-testid="success"
        onClick={() => addAlert('success')}
      >
        Success
      </button>
    </>
  );
};

describe('ToastProvider', () => {
  it('should display a danger toast', async () => {
    const { findByRole, findByTestId } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    const button = await findByTestId('danger');

    fireEvent.click(button);

    const alert = await findByRole('alert');

    expect(alert).toHaveTextContent('danger');
  });

  it('should display a primary toast', async () => {
    const { findByRole, findByTestId } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    const button = await findByTestId('primary');

    fireEvent.click(button);

    const alert = await findByRole('alert');

    expect(alert).toHaveTextContent('primary');
  });

  it('should display a secondary toast', async () => {
    const { findByRole, findByTestId } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    const button = await findByTestId('secondary');

    fireEvent.click(button);

    const alert = await findByRole('alert');

    expect(alert).toHaveTextContent('secondary');
  });

  it('should display a success toast', async () => {
    const { findByRole, findByTestId } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    const button = await findByTestId('success');

    fireEvent.click(button);

    const alert = await findByRole('alert');

    expect(alert).toHaveTextContent('success');
  });
});
