import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { TagGroup } from '../TagGroup/TagGroup';
import { Tag } from './Tag';

describe('Tag', () => {
  it('forwards its ref and reports actions with its stable key', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const ref = createRef<HTMLDivElement>();

    renderBreeze(
      <TagGroup.Root>
        <TagGroup.Label>Filters</TagGroup.Label>
        <TagGroup.List>
          <Tag id={42} onAction={onAction} ref={ref} textValue="Open">
            Open
          </Tag>
        </TagGroup.List>
      </TagGroup.Root>,
    );

    const tag = screen.getByRole('row', { name: 'Open' });

    expect(ref.current).toBe(tag);
    await user.dblClick(tag);
    expect(onAction).toHaveBeenCalledWith(42);
  });

  it('prevents actions for disabled tags', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    renderBreeze(
      <TagGroup.Root>
        <TagGroup.Label>Filters</TagGroup.Label>
        <TagGroup.List>
          <Tag disabled id="locked" onAction={onAction} textValue="Locked">
            Locked
          </Tag>
        </TagGroup.List>
      </TagGroup.Root>,
    );

    const tag = screen.getByRole('row', { name: 'Locked' });

    expect(tag).toHaveAttribute('aria-disabled', 'true');
    await user.dblClick(tag);
    expect(onAction).not.toHaveBeenCalled();
  });
});
