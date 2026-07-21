import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { SearchField } from './SearchField';

function SearchControl({ size }: { size?: 'lg' | 'md' | 'sm' }) {
  return (
    <SearchField.Group size={size}>
      <SearchField.Input />
      <SearchField.ClearButton />
    </SearchField.Group>
  );
}

describe('SearchField', () => {
  it('submits and clears the semantic query with keyboard and pointer behavior', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onSubmit = vi.fn();
    const onClear = vi.fn();

    renderBreeze(
      <SearchField.Root
        defaultValue="quarterly"
        onChange={onChange}
        onClear={onClear}
        onSubmit={onSubmit}
      >
        <SearchField.Label>Search records</SearchField.Label>
        <SearchControl />
      </SearchField.Root>,
    );

    const input = screen.getByRole('searchbox', { name: 'Search records' });

    expect(input).toHaveAttribute('type', 'search');
    expect(input).toHaveClass('[&::-webkit-search-cancel-button]:hidden');
    expect(input.parentElement).toHaveAttribute(
      'data-breeze-search-field-group',
    );
    expect(input.parentElement).toHaveClass(
      'after:border',
      'data-[focus-visible]:outline-2',
      'data-[invalid]:after:!border-[var(--breeze-danger)]',
    );
    expect(input).toHaveClass(
      'min-w-0',
      'w-auto',
      'flex-1',
      'border-0',
      'bg-transparent',
    );
    expect(screen.getAllByRole('button', { name: 'Clear' })).toHaveLength(1);

    await user.type(input, '{Enter}');
    expect(onSubmit).toHaveBeenCalledWith('quarterly');

    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(input).toHaveValue('');
    expect(onChange).toHaveBeenLastCalledWith('');
    expect(onClear).toHaveBeenCalledOnce();
    expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
    expect(input.closest('[data-empty]')).toBeInTheDocument();

    await user.type(input, 'new query');
    expect(screen.getByRole('button', { name: 'Clear' })).toBeVisible();
  });

  it('supports Escape clearing and provider-localised clear labels', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();

    renderBreeze(
      <SearchField.Root defaultValue="archive" onClear={onClear}>
        <SearchField.Label>Find</SearchField.Label>
        <SearchControl />
      </SearchField.Root>,
      { messages: { clear: 'Remove query' } },
    );

    const input = screen.getByRole('searchbox', { name: 'Find' });

    input.focus();
    await user.keyboard('{Escape}');

    expect(input).toHaveValue('');
    expect(onClear).toHaveBeenCalledOnce();
    expect(screen.queryByRole('button', { name: 'Remove query' })).toBeNull();
  });

  it('hides clearing from layout and interaction for empty, disabled, and read-only fields', () => {
    renderBreeze(
      <div>
        <SearchField.Root>
          <SearchField.Label>Empty search</SearchField.Label>
          <SearchControl />
        </SearchField.Root>
        <SearchField.Root disabled defaultValue="disabled">
          <SearchField.Label>Disabled search</SearchField.Label>
          <SearchControl />
        </SearchField.Root>
        <SearchField.Root readOnly value="locked">
          <SearchField.Label>Locked search</SearchField.Label>
          <SearchControl />
        </SearchField.Root>
      </div>,
    );

    expect(screen.queryByRole('button')).toBeNull();
    expect(
      screen.getByRole('searchbox', { name: 'Disabled search' }).parentElement,
    ).toHaveAttribute('data-disabled');
    expect(
      screen.getByRole('searchbox', { name: 'Locked search' }).parentElement,
    ).toHaveAttribute('data-readonly');
  });

  it('uses the group size as the single source of truth for every control part', () => {
    renderBreeze(
      <SearchField.Root defaultValue="sized">
        <SearchField.Label>Sized search</SearchField.Label>
        <SearchField.Group size="lg">
          <SearchField.Input size="sm" />
          <SearchField.ClearButton size="sm" />
        </SearchField.Group>
      </SearchField.Root>,
    );

    const input = screen.getByRole('searchbox', { name: 'Sized search' });
    const clear = screen.getByRole('button', { name: 'Clear' });

    expect(input.parentElement).toHaveAttribute('data-size', 'lg');
    expect(input).toHaveClass('min-h-12', 'px-4');
    expect(input).not.toHaveClass('min-h-8', 'px-2.5');
    expect(clear).toHaveClass('size-12');
    expect(clear).not.toHaveClass('size-8');
  });

  it('preserves standalone input styling outside the visual group', () => {
    renderBreeze(
      <SearchField.Root defaultValue="standalone">
        <SearchField.Label>Standalone search</SearchField.Label>
        <SearchField.Input />
      </SearchField.Root>,
    );

    expect(
      screen.getByRole('searchbox', { name: 'Standalone search' }),
    ).toHaveClass(
      'w-full',
      'border',
      'bg-[var(--breeze-surface)]',
      'data-[focus-visible]:outline-2',
    );
  });

  it('prevents changes in explicit read-only mode', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <SearchField.Root readOnly value="locked">
        <SearchField.Label>Locked search</SearchField.Label>
        <SearchControl />
      </SearchField.Root>,
    );

    const input = screen.getByRole('searchbox', { name: 'Locked search' });

    await user.type(input, ' value');
    expect(input).toHaveValue('locked');
    expect(input).toHaveAttribute('readonly');
  });
});
