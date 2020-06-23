import { act, fireEvent, render, RenderResult } from '@testing-library/react';
import React, { FC } from 'react';
import { AlertTheme } from '../../Alert/Alert';
import ToastProvider, { useToast } from '../ToastProvider';

const onDismiss = jest.fn();
const TestComponent: FC = () => {
  const { add } = useToast();
  const addAlert = (colour: AlertTheme, dismiss = false) => {
    add({
      colour,
      message: colour,
      ...(dismiss
        ? {
            onDismiss,
          }
        : {}),
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
      <button
        type="button"
        data-testid="onDismiss"
        onClick={() => addAlert('success', true)}
      >
        On dismiss
      </button>
    </>
  );
};

describe('ToastProvider', () => {
  let component: RenderResult;

  beforeEach(() => {
    component = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );
  });

  it('should display a danger toast', async () => {
    const { findByRole, findByTestId } = component;

    const button = await findByTestId('danger');

    fireEvent.click(button);

    const alert = await findByRole('alert');

    expect(alert).toHaveTextContent('danger');
  });

  it('should display a primary toast', async () => {
    const { findByRole, findByTestId } = component;

    const button = await findByTestId('primary');

    fireEvent.click(button);

    const alert = await findByRole('alert');

    expect(alert).toHaveTextContent('primary');
  });

  it('should display a secondary toast', async () => {
    const { findByRole, findByTestId } = component;

    const button = await findByTestId('secondary');

    fireEvent.click(button);

    const alert = await findByRole('alert');

    expect(alert).toHaveTextContent('secondary');
  });

  it('should display a success toast', async () => {
    const { findByRole, findByTestId } = component;

    const button = await findByTestId('success');

    fireEvent.click(button);

    const alert = await findByRole('alert');

    expect(alert).toHaveTextContent('success');
  });

  it('should dismiss toast', async () => {
    jest.useFakeTimers();

    const { findByTestId, queryByRole } = component;

    const button = await findByTestId('success');

    fireEvent.click(button);

    act(() => {
      jest.runAllTimers();
    });

    const alert = queryByRole('alert');

    expect(alert).not.toBeInTheDocument();
  });

  it('should call the onDismiss callback', async () => {
    jest.useFakeTimers();

    const { findByTestId } = component;

    const button = await findByTestId('onDismiss');

    fireEvent.click(button);

    act(() => {
      jest.runAllTimers();
    });

    expect(onDismiss).toHaveBeenCalled();
  });
});
