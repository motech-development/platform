import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { SignOutIcon } from '../../icons';
import { UserMenu } from './UserMenu';

describe('UserMenu', () => {
  it('presents notification content and reports application actions', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    renderBreeze(
      <UserMenu
        aria-label="Account menu"
        actions={[
          {
            icon: <SignOutIcon />,
            id: 'sign-out',
            label: 'Sign out',
            onAction,
            variant: 'danger',
          },
        ]}
        hasUnread
        notificationHeading="Notifications"
        notificationState="1 new"
        notifications={<p>Your export is ready</p>}
        userName="Morgan Green"
      />,
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Account menu, Unread notifications',
      }),
    );
    expect(screen.getByText('Your export is ready')).toBeVisible();
    expect(screen.getByText('Notifications')).toBeVisible();
    expect(screen.getByText('1 new')).toBeVisible();
    const signOut = screen.getByRole('menuitem', { name: 'Sign out' });

    await user.click(signOut);
    expect(onAction).toHaveBeenCalledWith('sign-out');
  });

  it('preserves the account label when notifications are read', () => {
    renderBreeze(
      <UserMenu
        aria-label="Account menu"
        actions={[]}
        userName="Morgan Green"
      />,
    );

    expect(screen.getByRole('button', { name: 'Account menu' })).toBeVisible();
  });

  it('uses a complete localized unread label without appending fallback copy', () => {
    renderBreeze(
      <UserMenu
        aria-label="Notifications"
        actions={[]}
        hasUnread
        unreadLabel="Notifications (3 unread)"
        userName="Morgan Green"
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Notifications (3 unread)' }),
    ).toBeVisible();
  });

  it('reports each menu dismissal path exactly once', async () => {
    const user = userEvent.setup();
    const onOutsideAction = vi.fn();
    const onOpenChange = vi.fn();

    renderBreeze(
      <>
        <button onClick={onOutsideAction} type="button">
          Outside action
        </button>
        <UserMenu
          aria-label="Account menu"
          actions={[{ id: 'sign-out', label: 'Sign out' }]}
          onOpenChange={onOpenChange}
          userName="Morgan Green"
        />
      </>,
    );
    const outsideAction = screen.getByRole('button', {
      name: 'Outside action',
    });
    const trigger = screen.getByRole('button', { name: 'Account menu' });
    const openMenu = async () => {
      await user.click(trigger);
      expect(screen.getByRole('menu')).toBeVisible();
      onOpenChange.mockClear();
    };

    await openMenu();
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
    await waitFor(() => expect(trigger).toHaveFocus());

    await openMenu();
    await user.click(outsideAction);
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
    expect(onOutsideAction).toHaveBeenCalledOnce();

    await openMenu();
    await user.click(trigger);
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);

    await openMenu();
    await user.click(screen.getByRole('menuitem', { name: 'Sign out' }));
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  });

  it('lets a controlled consumer update count-aware state when the menu closes', async () => {
    const user = userEvent.setup();

    function ControlledNotifications() {
      const [open, setOpen] = useState(true);
      const [unreadCount, setUnreadCount] = useState(3);
      const hasUnread = unreadCount > 0;

      return (
        <UserMenu
          aria-label={`Notifications (${unreadCount} unread)`}
          actions={[]}
          hasUnread={hasUnread}
          notificationHeading="Notifications"
          notificationState={`${unreadCount} unread`}
          notifications="Your export is ready"
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen);

            if (!nextOpen) {
              setUnreadCount(0);
            }
          }}
          open={open}
          unreadLabel={`Notifications (${unreadCount} unread)`}
          userName="Morgan Green"
        />
      );
    }

    renderBreeze(<ControlledNotifications />);

    expect(screen.getByText('3 unread')).toBeVisible();
    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
    );
    const trigger = screen.getByRole('button', {
      name: 'Notifications (0 unread)',
    });

    await user.click(trigger);
    expect(screen.getByText('0 unread')).toBeVisible();
  });
});
