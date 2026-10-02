import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { BreezeProvider } from '../../provider/BreezeProvider';
import {
  RowList,
  type RowListItemDescriptor,
  type RowListProps,
} from './RowList';

interface Entry {
  id: string;
  label: string;
  section?: { id: string; label: string };
}

const entries: Entry[] = [
  {
    id: 'coffee',
    label: 'Coffee',
    section: { id: 'september', label: 'September' },
  },
  {
    id: 'groceries',
    label: 'Groceries',
    section: { id: 'september', label: 'September' },
  },
];

function getEntryDescriptor(entry: Entry): RowListItemDescriptor {
  if (entry.id === 'coffee') {
    return {
      badge: { children: 'New', variant: 'brand' },
      description: 'Purchase near the station.',
      icon: 'document',
      id: entry.id,
      label: entry.label,
      metadata: { format: 'date', value: '2026-09-14' },
      section: entry.section,
      value: { currency: 'GBP', format: 'currency', value: 25 },
    };
  }

  return {
    id: entry.id,
    label: entry.label,
    metadata: { format: 'text', value: 'Market' },
    section: entry.section,
    value: { format: 'text', value: 'Complete' },
  };
}

expectTypeOf<RowListProps<Entry>['onAction']>().parameters.toEqualTypeOf<
  [Entry]
>();
expectTypeOf<RowListProps<Entry>>().not.toHaveProperty('children');
expectTypeOf<RowListProps<Entry>>().not.toHaveProperty('className');
expectTypeOf<RowListProps<Entry>>().not.toHaveProperty('onClick');
expectTypeOf<RowListProps<Entry>>().not.toHaveProperty('slot');
expectTypeOf<RowListProps<Entry>>().not.toHaveProperty('style');
expectTypeOf<RowListItemDescriptor>().not.toHaveProperty('children');
expectTypeOf<RowListItemDescriptor>().not.toHaveProperty('className');
expectTypeOf<RowListItemDescriptor>().not.toHaveProperty('slots');
expectTypeOf<RowListItemDescriptor>().not.toHaveProperty('style');

describe('RowList', () => {
  it('requires a BreezeProvider', () => {
    expect(() =>
      render(
        <RowList
          aria-label="Entries"
          getItem={getEntryDescriptor}
          items={[]}
          onAction={() => undefined}
        />,
      ),
    ).toThrow('Breeze components must be rendered within BreezeProvider.');
  });

  it('renders aligned descriptor regions within structural section rows', () => {
    renderBreeze(
      <RowList
        aria-label="Entries"
        getItem={getEntryDescriptor}
        items={entries}
        onAction={() => undefined}
      />,
    );

    const grid = screen.getByRole('grid', { name: 'Entries' });
    const group = within(grid).getByRole('rowgroup');

    expect(
      within(group).getByRole('rowheader', { name: 'September' }),
    ).toBeInTheDocument();
    expect(within(group).getAllByRole('row')).toHaveLength(3);
    expect(within(grid).getByText('Coffee')).toBeInTheDocument();
    expect(
      within(grid).getByText('Purchase near the station.'),
    ).toBeInTheDocument();
    expect(within(grid).getByText('New')).toBeInTheDocument();
    expect(within(grid).getByText('14 Sept 2026')).toBeInTheDocument();
    expect(within(grid).getByText('£25.00')).toBeInTheDocument();
    expect(within(grid).getByText('Market')).toBeInTheDocument();
    expect(within(grid).getByText('Complete')).toBeInTheDocument();
  });

  it('keeps an empty result as a named grid with a row and cell', () => {
    renderBreeze(
      <RowList
        aria-label="Entries"
        getItem={getEntryDescriptor}
        items={[]}
        onAction={() => undefined}
      />,
    );

    const grid = screen.getByRole('grid', { name: 'Entries' });

    expect(within(grid).getByRole('row')).toBeInTheDocument();
    expect(within(grid).getByRole('gridcell')).toBeInTheDocument();
    expect(within(grid).getByText('No items to display.')).toBeInTheDocument();
  });

  it('keeps row ids separate from section ids', () => {
    const descriptor = {
      id: 'shared-id',
      label: 'Shared row',
      section: { id: 'shared-id', label: 'Shared section' },
    } satisfies RowListItemDescriptor;

    renderBreeze(
      <RowList
        aria-label="Entries"
        getItem={() => descriptor}
        items={[descriptor]}
        onAction={() => undefined}
      />,
    );

    const grid = screen.getByRole('grid', { name: 'Entries' });

    expect(
      within(grid).getByRole('rowheader', { name: 'Shared section' }),
    ).toBeInTheDocument();
    expect(
      within(grid).getByRole('row', { name: 'Shared row' }),
    ).toBeInTheDocument();
  });

  it('reports the application item for an activated row', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    renderBreeze(
      <RowList
        aria-label="Entries"
        getItem={getEntryDescriptor}
        items={entries}
        onAction={onAction}
      />,
    );

    const coffeeRow = screen
      .getByText('Coffee')
      .closest<HTMLElement>('[role="row"]')!;
    coffeeRow.focus();
    await user.keyboard('{Enter}');

    expect(onAction).toHaveBeenCalledExactlyOnceWith(entries[0]);
    expect(onAction.mock.calls[0]?.[0]).toBe(entries[0]);
  });

  it('does not activate a disabled row', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const item = { id: 'unavailable', label: 'Unavailable' };

    renderBreeze(
      <RowList
        aria-label="Entries"
        getItem={() => ({ disabled: true, ...item })}
        items={[item]}
        onAction={onAction}
      />,
    );

    const row = screen.getByRole('row', { name: 'Unavailable' });

    expect(row).toHaveAttribute('aria-disabled', 'true');
    await user.click(row);

    expect(onAction).not.toHaveBeenCalled();
  });

  it('renders unsectioned rows with absent regions', () => {
    const item = { id: 'quick', label: 'Quick entry' };

    renderBreeze(
      <RowList
        aria-label="Entries"
        getItem={({ id, label }) => ({ id, label })}
        items={[item]}
        onAction={() => undefined}
      />,
    );

    expect(
      screen.getByRole('row', { name: 'Quick entry' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('rowheader')).toBeNull();
  });

  it('keeps per-row loading placeholders quiet', () => {
    const descriptor = {
      ...getEntryDescriptor(entries[0]),
      loading: true,
    };

    renderBreeze(
      <RowList
        aria-label="Entries"
        getItem={() => descriptor}
        items={[entries[0]]}
        onAction={() => undefined}
      />,
    );

    const row = screen.getByRole('row', { name: 'Coffee' });
    const placeholders = within(row).getAllByRole('progressbar', {
      hidden: true,
    });

    expect(row).toHaveAccessibleName('Coffee');
    expect(placeholders).toHaveLength(2);
    expect(
      placeholders.every((placeholder) =>
        placeholder.hasAttribute('aria-hidden'),
      ),
    ).toBe(true);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('keeps the named load-more action busy outside the retained grid', () => {
    renderBreeze(
      <RowList
        aria-label="Entries"
        getItem={getEntryDescriptor}
        items={entries}
        loadMore={{
          label: 'Load more entries',
          loading: true,
          onAction: () => undefined,
        }}
        onAction={() => undefined}
      />,
    );

    const grid = screen.getByRole('grid', { name: 'Entries' });
    const loadMore = screen.getByRole('button', {
      name: /Load more entries/,
    });
    const status = screen.getByRole('status');

    expect(loadMore).toHaveAttribute('aria-busy', 'true');
    expect(loadMore).toHaveAccessibleName(/Load more entries/);
    expect(status).toHaveTextContent('Loading');
    expect(grid.contains(status)).toBe(false);
    expect(grid).not.toHaveAttribute('aria-live');
    expect(grid.closest('[aria-live]')).toBeNull();
  });

  it('reports the load-more action when it is ready', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    renderBreeze(
      <RowList
        aria-label="Entries"
        getItem={getEntryDescriptor}
        items={[]}
        loadMore={{ label: 'Load more entries', onAction }}
        onAction={() => undefined}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Load more entries' }));

    expect(onAction).toHaveBeenCalledOnce();
  });

  it('retains a focused descriptor row when groups merge and precede it', () => {
    const { rerender } = render(
      <BreezeProvider defaultAppearance="light" locale="en-GB">
        <RowList
          aria-label="Entries"
          getItem={getEntryDescriptor}
          items={entries}
          onAction={() => undefined}
        />
      </BreezeProvider>,
    );
    const coffeeRow = screen
      .getByText('Coffee')
      .closest<HTMLElement>('[role="row"]')!;

    coffeeRow.focus();
    rerender(
      <BreezeProvider defaultAppearance="light" locale="en-GB">
        <RowList
          aria-label="Entries"
          getItem={getEntryDescriptor}
          items={[
            {
              id: 'october-first',
              label: 'October entry',
              section: { id: 'october', label: 'October' },
            },
            ...entries,
            {
              id: 'october-second',
              label: 'October follow-up',
              section: { id: 'october', label: 'October' },
            },
          ]}
          onAction={() => undefined}
        />
      </BreezeProvider>,
    );

    expect(screen.getByText('Coffee').closest('[role="row"]')).toBe(coffeeRow);
    expect(document.activeElement).toBe(coffeeRow);
  });
});
