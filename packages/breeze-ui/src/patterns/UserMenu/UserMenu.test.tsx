import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
});
