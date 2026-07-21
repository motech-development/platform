import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import stubIntersectionObserver from '../../../test/stubIntersectionObserver';
import { ListBox } from './ListBox';

interface LoadMoreHarnessProps {
  onLoadMore: () => void;
}

function LoadMoreHarness({ onLoadMore }: LoadMoreHarnessProps) {
  const [loading, setLoading] = useState(false);

  return (
    <ListBox.Root aria-label="Results">
      <ListBox.Item id="one" textValue="One">
        One
      </ListBox.Item>
      <ListBox.LoadMore
        loading={loading}
        onLoadMore={() => {
          setLoading(true);
          onLoadMore();
        }}
      >
        Loading more results
      </ListBox.LoadMore>
    </ListBox.Root>
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ListBox', () => {
  it('supports static options, typeahead, arrows, and semantic selection', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();

    renderBreeze(
      <ListBox.Root aria-label="People" onSelectionChange={onSelectionChange}>
        <ListBox.Item id="alice" textValue="Alice">
          Alice
        </ListBox.Item>
        <ListBox.Item id="bob" textValue="Bob">
          Bob
        </ListBox.Item>
      </ListBox.Root>,
    );

    const listbox = screen.getByRole('listbox', { name: 'People' });

    listbox.focus();
    await user.keyboard('b');

    const bob = screen.getByRole('option', { name: 'Bob' });

    expect(bob).toHaveFocus();
    await user.click(bob);
    expect(onSelectionChange).toHaveBeenLastCalledWith(['bob']);
  });

  it('infers generic items and supports multiple selection', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    const people = [
      { id: 1, name: 'Ada' },
      { id: 2, name: 'Grace' },
    ];

    renderBreeze(
      <ListBox.Root
        aria-label="Engineers"
        items={people}
        multiple
        onSelectionChange={onSelectionChange}
      >
        {(person) => (
          <ListBox.Item id={person.id} textValue={person.name}>
            {person.name}
          </ListBox.Item>
        )}
      </ListBox.Root>,
    );

    await user.click(screen.getByRole('option', { name: 'Ada' }));
    await user.click(screen.getByRole('option', { name: 'Grace' }));
    expect(onSelectionChange).toHaveBeenLastCalledWith([1, 2]);
  });

  it('renders empty content and preserves read-only selection', async () => {
    const user = userEvent.setup();
    const emptyItems: { id: string }[] = [];
    const { unmount } = renderBreeze(
      <ListBox.Root
        aria-label="Empty"
        emptyContent="Nothing available"
        items={emptyItems}
      >
        {(item) => (
          <ListBox.Item id={item.id} textValue="Item">
            Item
          </ListBox.Item>
        )}
      </ListBox.Root>,
    );

    expect(screen.getByText('Nothing available')).toBeInTheDocument();

    unmount();
    renderBreeze(
      <ListBox.Root aria-label="Locked" readOnly selection={['one']}>
        <ListBox.Item id="one" textValue="One">
          One
        </ListBox.Item>
        <ListBox.Item id="two" textValue="Two">
          Two
        </ListBox.Item>
      </ListBox.Root>,
    );
    await user.click(screen.getByRole('option', { name: 'Two' }));
    expect(screen.getByRole('option', { name: 'One' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('forwards refs and exposes required, invalid, and disabled states', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLDivElement>();
    const onSelectionChange = vi.fn();

    renderBreeze(
      <ListBox.Root
        aria-label="Required choices"
        disabledKeys={['locked']}
        invalid
        onSelectionChange={onSelectionChange}
        ref={ref}
        required
      >
        <ListBox.Item id="open" textValue="Open">
          Open
        </ListBox.Item>
        <ListBox.Item id="locked" textValue="Locked">
          Locked
        </ListBox.Item>
      </ListBox.Root>,
    );

    const listbox = screen.getByRole('listbox', { name: 'Required choices' });
    const locked = screen.getByRole('option', { name: 'Locked' });

    expect(ref.current).toBe(listbox);
    expect(listbox).toBeInvalid();
    expect(listbox).toHaveAttribute('aria-required', 'true');
    expect(locked).toHaveAttribute('aria-disabled', 'true');
    await user.click(locked);
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it('keeps its forwarded ref attached while React Aria updates semantic state', async () => {
    const user = userEvent.setup();
    const ref = vi.fn();

    function SemanticStateHarness() {
      const [semanticState, setSemanticState] = useState(false);

      return (
        <>
          <button
            onClick={() => setSemanticState((currentState) => !currentState)}
            type="button"
          >
            Expose semantic state
          </button>
          <ListBox.Root
            aria-label="Stateful choices"
            invalid={semanticState}
            ref={ref}
            required={semanticState}
          >
            <ListBox.Item id="one" textValue="One">
              One
            </ListBox.Item>
          </ListBox.Root>
        </>
      );
    }

    renderBreeze(<SemanticStateHarness />);

    const listbox = screen.getByRole('listbox', { name: 'Stateful choices' });

    expect(ref).toHaveBeenCalledOnce();
    expect(ref).toHaveBeenCalledWith(listbox);
    await user.click(
      screen.getByRole('button', { name: 'Expose semantic state' }),
    );
    expect(ref).toHaveBeenCalledOnce();
    expect(listbox).toHaveAttribute('aria-invalid', 'true');
    expect(listbox).toHaveAttribute('aria-required', 'true');
    await user.click(
      screen.getByRole('button', { name: 'Expose semantic state' }),
    );
    expect(ref).toHaveBeenCalledOnce();
    expect(listbox).not.toHaveAttribute('aria-invalid');
    expect(listbox).not.toHaveAttribute('aria-required');
  });

  it('deduplicates load-more requests while a loading row is active', () => {
    const onLoadMore = vi.fn();
    const notifyIntersection = stubIntersectionObserver();

    renderBreeze(<LoadMoreHarness onLoadMore={onLoadMore} />);

    act(() => {
      notifyIntersection([
        { isIntersecting: true },
        { isIntersecting: true },
      ] as IntersectionObserverEntry[]);
    });

    expect(onLoadMore).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole('option', { name: 'Loading more results' }),
    ).toBeInTheDocument();
  });

  it('enables Breeze variable-height virtualization without exposing its engine', () => {
    renderBreeze(
      <ListBox.Root
        aria-label="Virtual results"
        virtualization={{
          estimatedRowHeight: 44,
          mode: 'variable',
          overscan: 80,
          viewportHeight: 132,
        }}
      >
        <ListBox.Item id="one" textValue="One">
          One
        </ListBox.Item>
        <ListBox.Item id="two" textValue="Two with more content">
          Two with more content
        </ListBox.Item>
      </ListBox.Root>,
    );

    const listbox = screen.getByRole('listbox', { name: 'Virtual results' });

    expect(listbox).toHaveAttribute('data-virtualized', 'true');
    expect(listbox).toHaveStyle({ height: '132px' });
    expect(screen.getByRole('option', { name: 'One' })).toBeInTheDocument();
  });
});
