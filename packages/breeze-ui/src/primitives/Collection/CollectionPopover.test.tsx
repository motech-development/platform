import { useRef } from 'react';
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
});
