import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef } from 'react';
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

expectTypeOf<ToastEnqueue>().toEqualTypeOf<(message: string) => void>();
expectTypeOf<ToastProps>().not.toHaveProperty('className');
expectTypeOf<ToastProps>().not.toHaveProperty('style');
expectTypeOf<ToastProps>().not.toHaveProperty('slot');
expectTypeOf<ToastProps>().not.toHaveProperty('loading');

afterEach(() => {
  vi.useRealTimers();
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

  it('announces an enqueued confirmation without moving focus', () => {
    render(
      <BreezeProvider locale="en-GB">
        <ToastTrigger />
      </BreezeProvider>,
    );

    const region = document.querySelector('[data-breeze-toast-region]');
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toHaveAttribute('data-live-announcer');
    expect(region).toHaveAttribute('data-react-aria-top-layer');
    expect(region).toBeEmptyDOMElement();

    const trigger = screen.getByRole('button', { name: 'Save' });
    trigger.focus();

    act(() => {
      trigger.click();
    });

    const toast = screen.getByRole('status');
    expect(toast).toHaveTextContent('Changes saved');
    expect(toast).toHaveAttribute('aria-live', 'polite');
    expect(toast).not.toHaveAttribute('tabindex');
    expect(document.activeElement).toBe(trigger);
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

    const toast = screen.getByRole('status', { name: 'Saved' });
    expect(toast.closest('[data-breeze-portal]')).toBeInTheDocument();
    expect(portalContainer).toContainElement(toast);

    unmount();

    expect(portalContainer).toBeEmptyDOMElement();
    portalContainer.remove();
  });

  it('keeps nested provider queues isolated', () => {
    function NestedProviders() {
      const enqueue = useToast();

      return (
        <>
          <button type="button" onClick={() => enqueue('Outer')}>
            Outer
          </button>
          <BreezeProvider locale="en-GB">
            <ToastButtons messages={['Inner']} />
          </BreezeProvider>
        </>
      );
    }

    render(
      <BreezeProvider locale="en-GB">
        <NestedProviders />
      </BreezeProvider>,
    );

    act(() => {
      screen.getByRole('button', { name: 'Outer' }).click();
      screen.getByRole('button', { name: 'Inner' }).click();
    });

    const outerToast = screen.getByRole('status', { name: 'Outer' });
    const innerToast = screen.getByRole('status', { name: 'Inner' });

    expect(outerToast.closest('[data-breeze-portal]')).not.toBe(
      innerToast.closest('[data-breeze-portal]'),
    );
  });
});
