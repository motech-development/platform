import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { Tag } from '../Tag/Tag';
import { TagGroup } from './TagGroup';

describe('TagGroup', () => {
  it('navigates and reports selection and removal keys', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const onSelectionChange = vi.fn();
    renderBreeze(
      <TagGroup.Root onRemove={onRemove} onSelectionChange={onSelectionChange}>
        <TagGroup.Label>Filters</TagGroup.Label>
        <TagGroup.List>
          <Tag id="open" textValue="Open">
            Open
          </Tag>
          <Tag id="paid" textValue="Paid">
            Paid
          </Tag>
        </TagGroup.List>
      </TagGroup.Root>,
    );
    const open = screen.getByRole('row', { name: 'Open' });
    await user.click(open);
    expect(onSelectionChange).toHaveBeenCalledWith(['open']);
    open.focus();
    await user.keyboard('{Delete}');
    expect(onRemove).toHaveBeenCalledWith(['open']);
  });

  it('renders generic numeric tags and preserves controlled read-only state', async () => {
    const user = userEvent.setup();
    const items = [
      { id: 1, label: 'Open' },
      { id: 2, label: 'Paid' },
    ];

    renderBreeze(
      <TagGroup.Root readOnly selection={[1]}>
        <TagGroup.Label>States</TagGroup.Label>
        <TagGroup.List items={items}>
          {(item) => (
            <Tag id={item.id} textValue={item.label}>
              {item.label}
            </Tag>
          )}
        </TagGroup.List>
      </TagGroup.Root>,
    );

    expect(screen.getByRole('row', { name: 'Open' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await user.click(screen.getByRole('row', { name: 'Paid' }));
    expect(screen.getByRole('row', { name: 'Open' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('renders empty content and forwards group and list refs', () => {
    const rootRef = createRef<HTMLDivElement>();
    const listRef = createRef<HTMLDivElement>();
    const items: { id: string; label: string }[] = [];

    renderBreeze(
      <TagGroup.Root ref={rootRef}>
        <TagGroup.Label>Empty</TagGroup.Label>
        <TagGroup.List emptyContent="No filters" items={items} ref={listRef}>
          {(item) => (
            <Tag id={item.id} textValue={item.label}>
              {item.label}
            </Tag>
          )}
        </TagGroup.List>
      </TagGroup.Root>,
    );

    expect(screen.getByText('No filters')).toBeInTheDocument();
    expect(rootRef.current).toBeInTheDocument();
    expect(listRef.current).toBe(screen.getByText('No filters'));
  });

  it('does not select disabled keys', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();

    renderBreeze(
      <TagGroup.Root
        disabledKeys={['locked']}
        onSelectionChange={onSelectionChange}
      >
        <TagGroup.Label>Filters</TagGroup.Label>
        <TagGroup.List>
          <Tag id="locked" textValue="Locked">
            Locked
          </Tag>
        </TagGroup.List>
      </TagGroup.Root>,
    );

    const tag = screen.getByRole('row', { name: 'Locked' });

    expect(tag).toHaveAttribute('aria-disabled', 'true');
    await user.click(tag);
    expect(onSelectionChange).not.toHaveBeenCalled();
  });
});
