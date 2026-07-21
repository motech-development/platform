import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { BreezeProvider } from '../../provider/BreezeProvider';
import {
  Toast,
  type ToastController,
  type ToastOptions,
  useToast,
} from './Toast';

interface ToastTriggerProps {
  label: string;
  options: ToastOptions;
  toastId?: (id: string) => void;
}

function ToastTrigger({
  label,
  options,
  toastId,
}: ToastTriggerProps): ReactNode {
  const toast = useToast();

  return (
    <button
      onClick={() => {
        const id = toast.show(options);

        toastId?.(id);
      }}
      type="button"
    >
      {label}
    </button>
  );
}

interface ToastControllerCaptureProps {
  capture: (controller: ToastController) => void;
}

function ToastControllerCapture({
  capture,
}: ToastControllerCaptureProps): null {
  capture(useToast());

  return null;
}

afterEach(() => {
  vi.useRealTimers();
});

describe('Toast', () => {
  it('uses one live interactive owner for a standalone toast', async () => {
    const onAction = vi.fn();
    const onDismiss = vi.fn();
    const user = userEvent.setup();

    renderBreeze(
      <Toast
        action={{ label: 'Resolve', onAction }}
        description="Supporting content"
        onDismiss={onDismiss}
        title="Standalone toast"
      />,
    );

    const toast = screen.getByRole('alertdialog', {
      name: 'Standalone toast',
    });

    expect(toast).toHaveAttribute('aria-live', 'polite');
    expect(toast).toHaveAttribute('aria-atomic', 'true');
    expect(within(toast).queryByRole('alert')).not.toBeInTheDocument();

    await user.click(within(toast).getByRole('button', { name: 'Resolve' }));

    expect(onAction).toHaveBeenCalledOnce();
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('renders translated ReactNode content and dismisses after its action', async () => {
    const onAction = vi.fn();
    const user = userEvent.setup();

    renderBreeze(
      <ToastTrigger
        label="Notify"
        options={{
          action: {
            label: <span>Undo upload</span>,
            onAction,
          },
          description: <span>The translated description</span>,
          lifetime: null,
          title: <span>Upload complete</span>,
          variant: 'success',
        }}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Notify' }));

    const toast = await screen.findByRole('alertdialog', {
      name: 'Upload complete',
    });

    expect(toast).toHaveAttribute('data-variant', 'success');
    expect(screen.getByText('The translated description')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Undo upload' }));

    expect(onAction).toHaveBeenCalledOnce();
    expect(toast).not.toBeInTheDocument();
  });

  it('limits the visible stack and promotes pending toasts after dismissal', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <>
        <ToastTrigger
          label="First"
          options={{ lifetime: null, title: 'First toast' }}
        />
        <ToastTrigger
          label="Second"
          options={{ lifetime: null, title: 'Second toast' }}
        />
        <ToastTrigger
          label="Third"
          options={{ lifetime: null, title: 'Third toast' }}
        />
      </>,
      { toastLimit: 2 },
    );

    await user.click(screen.getByRole('button', { name: 'First' }));
    await user.click(screen.getByRole('button', { name: 'Second' }));
    await user.click(screen.getByRole('button', { name: 'Third' }));

    expect(screen.queryByText('First toast')).not.toBeInTheDocument();
    expect(screen.getByText('Second toast')).toBeInTheDocument();
    expect(screen.getByText('Third toast')).toBeInTheDocument();

    const newestToast = screen.getByRole('alertdialog', {
      name: 'Third toast',
    });

    await user.click(
      within(newestToast).getByRole('button', { name: 'Close' }),
    );

    expect(screen.getByText('First toast')).toBeInTheDocument();
    expect(screen.queryByText('Third toast')).not.toBeInTheDocument();
  });

  it('rejects invalid lifetimes and dismisses a zero-lifetime toast immediately', () => {
    let controller: ToastController | undefined;
    const onDismiss = vi.fn();

    renderBreeze(
      <ToastControllerCapture
        capture={(value) => {
          controller = value;
        }}
      />,
    );

    if (controller === undefined) {
      throw new Error('Toast controller was not captured.');
    }

    const capturedController = controller;

    [-1, Number.NaN, Number.POSITIVE_INFINITY].forEach((lifetime) => {
      expect(() =>
        capturedController.show({ lifetime, title: 'Invalid' }),
      ).toThrow(RangeError);
    });

    act(() => {
      controller?.show({ lifetime: 0, onDismiss, title: 'Immediate' });
    });

    expect(onDismiss).toHaveBeenCalledOnce();
    expect(screen.queryByText('Immediate')).not.toBeInTheDocument();
  });

  it('supports persistent and timed toast lifetimes', () => {
    vi.useFakeTimers();

    renderBreeze(
      <>
        <ToastTrigger
          label="Persistent"
          options={{ lifetime: null, title: 'Persistent toast' }}
        />
        <ToastTrigger
          label="Timed"
          options={{ lifetime: 500, title: 'Timed toast' }}
        />
      </>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Persistent' }));
    fireEvent.click(screen.getByRole('button', { name: 'Timed' }));

    expect(screen.getByText('Persistent toast')).toBeInTheDocument();
    expect(screen.getByText('Timed toast')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.getByText('Persistent toast')).toBeInTheDocument();
    expect(screen.queryByText('Timed toast')).not.toBeInTheDocument();
  });

  it('pauses and resumes timed dismissal while hovered or focused', () => {
    vi.useFakeTimers();

    renderBreeze(
      <ToastTrigger
        label="Notify"
        options={{ lifetime: 500, title: 'Pausing toast' }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Notify' }));

    const region = screen.getByRole('region', { name: 'Notifications' });
    const toast = screen.getByRole('alertdialog', { name: 'Pausing toast' });

    fireEvent.pointerEnter(region);
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(toast).toBeInTheDocument();

    fireEvent.pointerLeave(region);
    act(() => {
      toast.focus();
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(toast).toBeInTheDocument();

    act(() => {
      toast.blur();
    });
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(toast).not.toBeInTheDocument();
  });

  it('isolates queues between provider instances', async () => {
    const user = userEvent.setup();

    render(
      <>
        <BreezeProvider locale="en-GB">
          <ToastTrigger
            label="Notify first provider"
            options={{ lifetime: null, title: 'First provider toast' }}
          />
        </BreezeProvider>
        <BreezeProvider locale="en-GB">
          <ToastTrigger
            label="Notify second provider"
            options={{ lifetime: null, title: 'Second provider toast' }}
          />
        </BreezeProvider>
      </>,
    );

    await user.click(
      screen.getByRole('button', { name: 'Notify first provider' }),
    );

    expect(screen.getByText('First provider toast')).toBeInTheDocument();
    expect(screen.queryByText('Second provider toast')).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Notify second provider' }),
    );

    const firstToast = screen.getByRole('alertdialog', {
      name: 'First provider toast',
    });

    await user.click(within(firstToast).getByRole('button', { name: 'Close' }));

    expect(screen.queryByText('First provider toast')).not.toBeInTheDocument();
    expect(screen.getByText('Second provider toast')).toBeInTheDocument();
  });

  it('cancels active timers without dismissal callbacks on provider unmount', () => {
    vi.useFakeTimers();

    const onDismiss = vi.fn();
    const { unmount } = renderBreeze(
      <ToastTrigger
        label="Notify"
        options={{ lifetime: 500, onDismiss, title: 'Unmounting toast' }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Notify' }));

    expect(vi.getTimerCount()).toBeGreaterThan(0);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('uses provider-owned translated region and dismiss labels', () => {
    renderBreeze(
      <ToastTrigger
        label="Notify"
        options={{ lifetime: null, title: 'Translated controls' }}
      />,
      {
        messages: {
          close: 'Dismiss notification',
          notifications: 'Application updates',
        },
      },
    );

    fireEvent.click(screen.getByRole('button', { name: 'Notify' }));

    expect(
      screen.getByRole('region', { name: 'Application updates' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Dismiss notification' }),
    ).toBeInTheDocument();
  });
});
