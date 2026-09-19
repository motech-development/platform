import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { Toast, type ToastEnqueue, type ToastProps, useToast } from './Toast';

function ToastTrigger() {
  const enqueue = useToast();
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={() => enqueue('Changes saved')}
    >
      Save
    </button>
  );
}

function ToastButtons({ messages }: Readonly<{ messages: string[] }>) {
  const enqueue = useToast();

  return (
    <div>
      {messages.map((message) => (
        <button key={message} type="button" onClick={() => enqueue(message)}>
          {message}
        </button>
      ))}
    </div>
  );
}

function AdjustableToastExample() {
  const [limit, setLimit] = useState(3);

  return (
    <BreezeProvider locale="en-GB" toastLimit={limit}>
      <button type="button" onClick={() => setLimit(1)}>
        Show one toast
      </button>
      <button type="button" onClick={() => setLimit(3)}>
        Show all toasts
      </button>
      <ToastButtons messages={['One', 'Two', 'Three']} />
    </BreezeProvider>
  );
}

expectTypeOf<ToastEnqueue>().toEqualTypeOf<(message: string) => void>();
expectTypeOf<ToastProps>().not.toHaveProperty('className');
expectTypeOf<ToastProps>().not.toHaveProperty('style');
expectTypeOf<ToastProps>().not.toHaveProperty('slot');
expectTypeOf<ToastProps>().not.toHaveProperty('loading');

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('Toast', () => {
  it('requires BreezeProvider for the component and enqueue hook', () => {
    expect(() => render(<Toast>Changes saved</Toast>)).toThrow(
      'Breeze components must be rendered within BreezeProvider.',
    );
    expect(() => render(<ToastTrigger />)).toThrow(
      'Toast components must be rendered within BreezeProvider.',
    );
  });

  it('rejects a non-positive visible limit', () => {
    expect(() =>
      render(
        <BreezeProvider locale="en-GB" toastLimit={0}>
          <ToastTrigger />
        </BreezeProvider>,
      ),
    ).toThrow('BreezeProvider toastLimit must be a positive integer.');
  });

  it('updates a pre-mounted direct status after mount', async () => {
    render(
      <BreezeProvider locale="en-GB">
        <Toast>Changes saved</Toast>
      </BreezeProvider>,
    );

    const status = screen.getByRole('status');
    expect(status).not.toHaveAttribute('aria-label');
    expect(status.textContent).toBe('');
    expect(
      await screen.findByRole('status', { name: 'Changes saved' }),
    ).toBeInTheDocument();
  });

  it('announces an enqueued confirmation without moving focus', async () => {
    render(
      <BreezeProvider locale="en-GB">
        <ToastTrigger />
      </BreezeProvider>,
    );

    const region = document.querySelector('[data-breeze-toast-region]');
    expect(region).not.toHaveAttribute('aria-live');
    expect(region).toHaveAttribute('data-live-announcer');
    expect(region).toHaveAttribute('data-react-aria-top-layer');
    expect(region).toBeEmptyDOMElement();

    const trigger = screen.getByRole('button', { name: 'Save' });
    trigger.focus();

    act(() => {
      trigger.click();
    });

    const toast = await screen.findByRole('status', {
      name: 'Changes saved',
    });
    expect(toast).toHaveTextContent('Changes saved');
    expect(toast).toHaveAttribute('aria-live', 'polite');
    expect(document.querySelectorAll('[aria-live="polite"]')).toHaveLength(1);
    expect(toast).not.toHaveAttribute('tabindex');
    expect(document.activeElement).toBe(trigger);
  });

  it('defers the initial status update until the document is visible', () => {
    vi.useFakeTimers();
    const hidden = vi.spyOn(document, 'hidden', 'get');
    hidden.mockReturnValue(true);

    render(
      <BreezeProvider locale="en-GB">
        <ToastTrigger />
      </BreezeProvider>,
    );

    const trigger = screen.getByRole('button', { name: 'Save' });
    trigger.focus();
    act(() => {
      trigger.click();
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    const status = screen.getByRole('status');
    expect(status).not.toHaveAttribute('aria-label');
    expect(status.textContent).toBe('');
    expect(document.activeElement).toBe(trigger);

    act(() => {
      hidden.mockReturnValue(false);
      document.dispatchEvent(new Event('visibilitychange'));
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(
      screen.getByRole('status', { name: 'Changes saved' }),
    ).toBeInTheDocument();
    expect(document.activeElement).toBe(trigger);
  });

  it('defers a hidden demoted card until it becomes visible', () => {
    vi.useFakeTimers();
    const hidden = vi.spyOn(document, 'hidden', 'get');
    hidden.mockReturnValue(true);

    render(<AdjustableToastExample />);

    act(() => {
      screen.getByRole('button', { name: 'One' }).click();
      screen.getByRole('button', { name: 'Two' }).click();
    });

    const [firstToast, secondToast] = screen.getAllByRole('status');
    expect(firstToast.textContent).toBe('');
    expect(secondToast.textContent).toBe('');

    act(() => {
      screen.getByRole('button', { name: 'Show one toast' }).click();
    });
    expect(secondToast.closest('[data-breeze-toast-id]')).toHaveAttribute(
      'hidden',
    );

    act(() => {
      hidden.mockReturnValue(false);
      document.dispatchEvent(new Event('visibilitychange'));
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(firstToast).toHaveAttribute('aria-label', 'One');
    expect(secondToast).not.toHaveAttribute('aria-label');
    expect(secondToast.textContent).toBe('');

    act(() => {
      screen.getByRole('button', { name: 'Show all toasts' }).click();
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(screen.getByRole('status', { name: 'Two' })).toBe(secondToast);
  });

  it('does not add a focus stop or dismiss from keyboard input', async () => {
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <button type="button">Before</button>
        <ToastTrigger />
        <button type="button">After</button>
      </BreezeProvider>,
    );

    const trigger = screen.getByRole('button', { name: 'Save' });
    trigger.focus();
    await user.click(trigger);
    await user.tab();

    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'After' }),
    );

    await user.tab({ shift: true });
    await user.keyboard('{Escape}');

    expect(document.activeElement).toBe(trigger);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('keeps the default three visible messages and queues the rest in order', () => {
    vi.useFakeTimers();

    render(
      <BreezeProvider locale="en-GB">
        <ToastButtons messages={['One', 'Two', 'Three', 'Four', 'Five']} />
      </BreezeProvider>,
    );

    ['One', 'Two', 'Three', 'Four', 'Five'].forEach((message) => {
      act(() => {
        screen.getByRole('button', { name: message }).click();
      });
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(screen.getAllByRole('status')).toHaveLength(3);
    expect(screen.getByRole('status', { name: 'One' })).toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Two' })).toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Three' })).toBeInTheDocument();
    expect(
      screen.queryByRole('status', { name: 'Four' }),
    ).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2600);
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(screen.getAllByRole('status')).toHaveLength(2);
    expect(screen.getByRole('status', { name: 'Four' })).toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Five' })).toBeInTheDocument();
  });

  it('starts a queued message lifetime when it becomes visible', () => {
    vi.useFakeTimers();

    render(
      <BreezeProvider locale="en-GB" toastLimit={1}>
        <ToastButtons messages={['First', 'Second']} />
      </BreezeProvider>,
    );

    act(() => {
      screen.getByRole('button', { name: 'First' }).click();
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    act(() => {
      vi.advanceTimersByTime(2000);
      screen.getByRole('button', { name: 'Second' }).click();
    });

    expect(screen.getByRole('status', { name: 'First' })).toBeInTheDocument();
    expect(
      screen.queryByRole('status', { name: 'Second' }),
    ).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(600);
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(screen.getByRole('status', { name: 'Second' })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2599);
    });

    expect(screen.getByRole('status', { name: 'Second' })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(
      screen.queryByRole('status', { name: 'Second' }),
    ).not.toBeInTheDocument();
  });

  it('pauses visible lifetimes while the document is hidden', () => {
    vi.useFakeTimers();
    const hidden = vi.spyOn(document, 'hidden', 'get');
    hidden.mockReturnValue(false);

    render(
      <BreezeProvider locale="en-GB" toastLimit={1}>
        <button type="button">Keep focus</button>
        <ToastButtons messages={['First', 'Second']} />
      </BreezeProvider>,
    );

    act(() => {
      screen.getByRole('button', { name: 'First' }).click();
      screen.getByRole('button', { name: 'Second' }).click();
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    const firstToast = screen.getByRole('status', { name: 'First' });
    const focusTarget = screen.getByRole('button', { name: 'Keep focus' });
    focusTarget.focus();
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    act(() => {
      hidden.mockReturnValue(true);
      document.dispatchEvent(new Event('visibilitychange'));
      vi.advanceTimersByTime(3000);
    });

    expect(firstToast).toBeInTheDocument();
    expect(
      screen.queryByRole('status', { name: 'Second' }),
    ).not.toBeInTheDocument();
    expect(document.activeElement).toBe(focusTarget);

    act(() => {
      hidden.mockReturnValue(false);
      document.dispatchEvent(new Event('visibilitychange'));
    });
    act(() => {
      vi.advanceTimersByTime(1599);
    });
    expect(firstToast).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(firstToast).not.toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Second' })).toBeInTheDocument();
    expect(document.activeElement).toBe(focusTarget);
  });

  it('preserves the remaining lifetime while a card is clipped', () => {
    vi.useFakeTimers();

    const observers: TestIntersectionObserver[] = [];
    class TestIntersectionObserver {
      callback: IntersectionObserverCallback;

      disconnected = false;

      observed: Element[] = [];

      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
        observers.push(this);
      }

      observe(element: Element) {
        this.observed.push(element);
      }

      disconnect() {
        this.disconnected = true;
      }

      emit(isVisible: boolean) {
        const [target] = this.observed;
        if (!target) return;

        this.callback(
          [
            {
              intersectionRatio: isVisible ? 1 : 0,
              isIntersecting: isVisible,
              target,
            } as IntersectionObserverEntry,
          ],
          this as unknown as IntersectionObserver,
        );
      }
    }
    vi.stubGlobal('IntersectionObserver', TestIntersectionObserver);

    render(
      <BreezeProvider locale="en-GB" toastLimit={1}>
        <ToastButtons messages={['First', 'Second']} />
      </BreezeProvider>,
    );

    act(() => {
      screen.getByRole('button', { name: 'First' }).click();
      screen.getByRole('button', { name: 'Second' }).click();
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    const firstToast = screen.getByRole('status', { name: 'First' });
    const observer = observers.find(({ observed }) => observed.length > 0);
    expect(observer).toBeDefined();

    observer!.emit(true);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    observer!.emit(false);
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(firstToast).toBeInTheDocument();

    observer!.emit(true);
    act(() => {
      vi.advanceTimersByTime(1599);
    });
    expect(firstToast).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(firstToast).not.toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Second' })).toBeInTheDocument();
  });

  it('preserves a demoted card identity and remaining lifetime', () => {
    vi.useFakeTimers();

    render(<AdjustableToastExample />);

    ['One', 'Two', 'Three'].forEach((message) => {
      act(() => {
        screen.getByRole('button', { name: message }).click();
      });
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    const firstToast = screen.getByRole('status', { name: 'One' });
    const secondToast = screen.getByRole('status', { name: 'Two' });
    expect(screen.getAllByRole('status')).toHaveLength(3);

    act(() => {
      vi.advanceTimersByTime(1000);
      screen.getByRole('button', { name: 'Show one toast' }).click();
    });

    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(secondToast).toBeInTheDocument();
    expect(secondToast.closest('[data-breeze-toast-id]')).toHaveAttribute(
      'hidden',
    );

    act(() => {
      vi.advanceTimersByTime(1000);
      screen.getByRole('button', { name: 'Show all toasts' }).click();
    });

    expect(screen.getByRole('status', { name: 'Two' })).toBe(secondToast);
    expect(secondToast.closest('[data-breeze-toast-id]')).not.toHaveAttribute(
      'hidden',
    );

    act(() => {
      vi.advanceTimersByTime(599);
    });
    expect(firstToast).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(firstToast).not.toBeInTheDocument();
    expect(secondToast).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(secondToast).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(secondToast).not.toBeInTheDocument();
  });

  it('honours a configured visible limit', () => {
    vi.useFakeTimers();

    render(
      <BreezeProvider locale="en-GB" toastLimit={2}>
        <ToastButtons messages={['One', 'Two', 'Three']} />
      </BreezeProvider>,
    );

    ['One', 'Two', 'Three'].forEach((message) => {
      act(() => {
        screen.getByRole('button', { name: message }).click();
      });
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(screen.getAllByRole('status')).toHaveLength(2);
    expect(
      screen.queryByRole('status', { name: 'Three' }),
    ).not.toBeInTheDocument();
  });

  it('renders each provider queue in its own portal and clears it on unmount', () => {
    vi.useFakeTimers();
    const portalContainer = document.createElement('section');
    document.body.append(portalContainer);

    const { unmount } = render(
      <BreezeProvider locale="en-GB" portalContainer={portalContainer}>
        <ToastButtons messages={['Saved']} />
      </BreezeProvider>,
    );

    act(() => {
      screen.getByRole('button', { name: 'Saved' }).click();
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    const toast = screen.getByRole('status', { name: 'Saved' });
    expect(toast.closest('[data-breeze-portal]')).toBeInTheDocument();
    expect(portalContainer).toContainElement(toast);

    unmount();

    expect(portalContainer).toBeEmptyDOMElement();
    portalContainer.remove();
  });
});
