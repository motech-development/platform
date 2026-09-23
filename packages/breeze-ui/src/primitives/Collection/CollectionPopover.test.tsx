import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { BreezeProvider } from '../../provider/BreezeProvider';
import CollectionPopover from './CollectionPopover';

describe('CollectionPopover', () => {
  it('rejects triggers outside the current document light DOM', () => {
    const foreignDocument =
      document.implementation.createHTMLDocument('foreign');
    const foreignTrigger = foreignDocument.createElement('button');

    function Example() {
      const triggerRef = useRef<Element | null>(foreignTrigger);

      return (
        <CollectionPopover
          className="popover"
          isOpen={false}
          onOpenChange={vi.fn()}
          triggerRef={triggerRef}
        >
          Options
        </CollectionPopover>
      );
    }

    expect(() => renderBreeze(<Example />)).toThrowError(
      'Breeze overlay triggers and portal containers must belong to the current document and light DOM.',
    );
  });

  it('revalidates a stable trigger ref when its element is replaced', () => {
    const foreignDocument =
      document.implementation.createHTMLDocument('foreign');
    const foreignTrigger = foreignDocument.createElement('button');

    function Example({ useForeignTrigger }: { useForeignTrigger: boolean }) {
      const triggerRef = useRef<Element | null>(null);
      triggerRef.current = useForeignTrigger ? foreignTrigger : null;

      return (
        <CollectionPopover
          className="popover"
          isOpen={false}
          onOpenChange={vi.fn()}
          triggerRef={triggerRef}
        >
          Options
        </CollectionPopover>
      );
    }

    const { rerender } = renderBreeze(
      <BreezeProvider locale="en-GB">
        <Example useForeignTrigger={false} />
      </BreezeProvider>,
    );

    expect(() =>
      rerender(
        <BreezeProvider locale="en-GB">
          <Example useForeignTrigger />
        </BreezeProvider>,
      ),
    ).toThrowError(
      'Breeze overlay triggers and portal containers must belong to the current document and light DOM.',
    );
  });

  it('keeps an open collection popover in the provider portal', () => {
    function Example() {
      const triggerRef = useRef<HTMLButtonElement | null>(null);

      return (
        <>
          <button ref={triggerRef} type="button">
            Trigger
          </button>
          <CollectionPopover
            className="popover"
            isOpen
            onOpenChange={vi.fn()}
            triggerRef={triggerRef}
          >
            Options
          </CollectionPopover>
        </>
      );
    }

    renderBreeze(<Example />);

    expect(document.querySelector('.popover')).toHaveAttribute(
      'data-breeze-overlay',
      'popover',
    );
    expect(
      document.querySelector('.popover')?.closest('[data-breeze-portal]'),
    ).toBeInTheDocument();
  });

  it('dismisses when a primary pointer click lands on background content', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    function Example() {
      const triggerRef = useRef<HTMLButtonElement | null>(null);

      return (
        <>
          <button ref={triggerRef} type="button">
            Trigger
          </button>
          <div data-testid="background">Background content</div>
          <CollectionPopover
            className="popover"
            isOpen
            onOpenChange={onOpenChange}
            triggerRef={triggerRef}
          >
            Options
          </CollectionPopover>
        </>
      );
    }

    renderBreeze(<Example />);

    await user.click(screen.getByTestId('background'));

    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not dismiss for pointer activity on the trigger or surface', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    function Example() {
      const triggerRef = useRef<HTMLButtonElement | null>(null);

      return (
        <>
          <button ref={triggerRef} type="button">
            Trigger
          </button>
          <CollectionPopover
            className="popover"
            isOpen
            onOpenChange={onOpenChange}
            triggerRef={triggerRef}
          >
            Options
          </CollectionPopover>
        </>
      );
    }

    renderBreeze(<Example />);

    await user.click(screen.getByRole('button', { name: 'Trigger' }));
    await user.click(screen.getByText('Options'));

    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });

  it('does not dismiss when a pointer starts on the surface and ends outside', () => {
    const onOpenChange = vi.fn();

    function Example() {
      const triggerRef = useRef<HTMLButtonElement | null>(null);
      const [open, setOpen] = useState(true);

      return (
        <>
          <button ref={triggerRef} type="button">
            Trigger
          </button>
          <div data-testid="background">Background content</div>
          <CollectionPopover
            className="popover"
            isOpen={open}
            onOpenChange={(nextOpen) => {
              onOpenChange(nextOpen);
              setOpen(nextOpen);
            }}
            triggerRef={triggerRef}
          >
            <button type="button">Option</button>
          </CollectionPopover>
        </>
      );
    }

    renderBreeze(<Example />);

    const option = screen.getByRole('button', { name: 'Option' });
    const background = screen.getByTestId('background');
    fireEvent.pointerDown(option, { button: 0 });
    fireEvent.pointerUp(background, { button: 0 });
    fireEvent.click(background);

    expect(screen.getByRole('button', { name: 'Option' })).toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });

  it('expires pointer drag suppression before a later outside click', () => {
    vi.useFakeTimers();

    try {
      const onOpenChange = vi.fn();

      function Example() {
        const triggerRef = useRef<HTMLButtonElement | null>(null);
        const [open, setOpen] = useState(true);

        return (
          <>
            <button ref={triggerRef} type="button">
              Trigger
            </button>
            <div data-testid="background">Background content</div>
            <CollectionPopover
              className="popover"
              isOpen={open}
              onOpenChange={(nextOpen) => {
                onOpenChange(nextOpen);
                setOpen(nextOpen);
              }}
              triggerRef={triggerRef}
            >
              <button type="button">Option</button>
            </CollectionPopover>
          </>
        );
      }

      renderBreeze(<Example />);

      const option = screen.getByRole('button', { name: 'Option' });
      const background = screen.getByTestId('background');
      fireEvent.pointerDown(option, { button: 0 });
      fireEvent.pointerUp(background, { button: 0 });
      vi.runAllTimers();
      fireEvent.click(background);

      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(
        screen.queryByRole('button', { name: 'Option' }),
      ).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('dismisses on a later focus move after a drag-out without a click', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    function Example() {
      const triggerRef = useRef<HTMLButtonElement | null>(null);
      const [open, setOpen] = useState(true);

      return (
        <>
          <button type="button">Outside</button>
          <button ref={triggerRef} tabIndex={-1} type="button">
            Trigger
          </button>
          <CollectionPopover
            className="popover"
            isOpen={open}
            onOpenChange={(nextOpen) => {
              onOpenChange(nextOpen);
              setOpen(nextOpen);
            }}
            triggerRef={triggerRef}
          >
            <button type="button">Inside</button>
          </CollectionPopover>
        </>
      );
    }

    renderBreeze(<Example />);

    const outside = screen.getByRole('button', { name: 'Outside' });
    const inside = screen.getByRole('button', { name: 'Inside' });
    inside.focus();
    fireEvent.pointerDown(inside, { button: 0 });
    fireEvent.pointerUp(outside, { button: 0 });
    await user.tab({ shift: true });

    expect(outside).toHaveFocus();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('dismisses once when keyboard focus tabs from the surface outside', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    function Example() {
      const triggerRef = useRef<HTMLButtonElement | null>(null);
      const [open, setOpen] = useState(true);

      return (
        <>
          <button type="button">Outside</button>
          <button ref={triggerRef} tabIndex={-1} type="button">
            Trigger
          </button>
          <CollectionPopover
            className="popover"
            isOpen={open}
            onOpenChange={(nextOpen) => {
              onOpenChange(nextOpen);
              setOpen(nextOpen);
            }}
            triggerRef={triggerRef}
          >
            <button type="button">Inside</button>
          </CollectionPopover>
        </>
      );
    }

    renderBreeze(<Example />);

    const inside = screen.getByRole('button', { name: 'Inside' });
    inside.focus();
    await user.tab({ shift: true });

    expect(screen.getByRole('button', { name: 'Outside' })).toHaveFocus();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('clears pointer state before reopening for keyboard dismissal', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    function Example() {
      const triggerRef = useRef<HTMLButtonElement | null>(null);
      const [open, setOpen] = useState(true);

      return (
        <>
          <button type="button">Outside</button>
          <button
            ref={triggerRef}
            tabIndex={-1}
            type="button"
            onClick={() => setOpen(true)}
          >
            Trigger
          </button>
          <CollectionPopover
            className="popover"
            isOpen={open}
            onOpenChange={(nextOpen) => {
              onOpenChange(nextOpen);
              setOpen(nextOpen);
            }}
            triggerRef={triggerRef}
          >
            <button type="button" onPointerUp={() => setOpen(false)}>
              Inside
            </button>
          </CollectionPopover>
        </>
      );
    }

    renderBreeze(<Example />);

    await user.click(screen.getByRole('button', { name: 'Inside' }));
    expect(
      screen.queryByRole('button', { name: 'Inside' }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Trigger' }));
    const reopenedInside = await screen.findByRole('button', {
      name: 'Inside',
    });
    reopenedInside.focus();
    await user.tab({ shift: true });

    expect(screen.getByRole('button', { name: 'Outside' })).toHaveFocus();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
