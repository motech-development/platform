import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { Menu } from './Menu';

describe('Menu', () => {
  it('opens from keyboard, skips disabled items, acts, and dismisses', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const onOpenChange = vi.fn();

    renderBreeze(
      <Menu.Root onOpenChange={onOpenChange}>
        <Menu.Trigger>Actions</Menu.Trigger>
        <Menu.Popover>
          <Menu.List aria-label="Actions">
            <Menu.Item disabled id={1} onAction={onAction} textValue="Archive">
              Archive
            </Menu.Item>
            <Menu.Item id="edit" onAction={onAction} textValue="Edit">
              Edit
            </Menu.Item>
          </Menu.List>
        </Menu.Popover>
      </Menu.Root>,
    );
    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');

    expect(onAction).toHaveBeenCalledWith('edit');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('renders generic items and reports controlled selection keys', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    const items = [
      { id: 1, name: 'Compact' },
      { id: 'comfortable', name: 'Comfortable' },
    ];

    renderBreeze(
      <Menu.Root defaultOpen>
        <Menu.Trigger>Density</Menu.Trigger>
        <Menu.Popover>
          <Menu.List
            aria-label="Density"
            items={items}
            multiple
            onSelectionChange={onSelectionChange}
            selection={[1]}
          >
            {(item) => (
              <Menu.Item id={item.id} textValue={item.name}>
                {item.name}
              </Menu.Item>
            )}
          </Menu.List>
        </Menu.Popover>
      </Menu.Root>,
    );
    await user.click(
      screen.getByRole('menuitemcheckbox', { name: 'Comfortable' }),
    );

    expect(onSelectionChange).toHaveBeenCalledWith([1, 'comfortable']);
  });

  it('opens a nested submenu and restores focus when it dismisses', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <Menu.Root defaultOpen>
        <Menu.Trigger>Actions</Menu.Trigger>
        <Menu.Popover>
          <Menu.List aria-label="Actions">
            <Menu.Submenu>
              <Menu.Item id="share" textValue="Share">
                Share
              </Menu.Item>
              <Menu.Popover>
                <Menu.List aria-label="Share">
                  <Menu.Item id="email" textValue="Email">
                    Email
                  </Menu.Item>
                </Menu.List>
              </Menu.Popover>
            </Menu.Submenu>
          </Menu.List>
        </Menu.Popover>
      </Menu.Root>,
    );
    const share = screen.getByRole('menuitem', { name: 'Share' });
    share.focus();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('menu', { name: 'Share' })).toBeVisible();
    await user.keyboard('{Escape}');

    expect(
      screen.queryByRole('menu', { name: 'Share' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('menu', { name: 'Actions' })).toBeVisible();
    await waitFor(() => expect(share).toHaveFocus());
  });
});
