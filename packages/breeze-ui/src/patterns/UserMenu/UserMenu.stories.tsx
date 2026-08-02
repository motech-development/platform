import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import { SignOutIcon } from '../../icons';
import { Stack } from '../../primitives/Stack/Stack';
import { Surface } from '../../primitives/Surface/Surface';
import { Typography } from '../../primitives/Typography/Typography';
import { UserMenu, type UserMenuProps } from './UserMenu';

type UserMenuStoryProps = Extract<UserMenuProps, { open?: never }>;

/**
 * Presents represented-user identity, optional notification content, and
 * application-owned account actions in a keyboard-complete menu.
 *
 * @summary user identity menu with notifications and account actions
 */
const meta = {
  component: UserMenu,
  decorators: [
    (Story) => (
      <StoryConstraint size="application-rail">
        <Surface border="none" padding="compact" tone="inverse">
          <Story />
        </Surface>
      </StoryConstraint>
    ),
  ],
  title: 'Patterns/Application Shell/UserMenu',
} satisfies Meta<UserMenuStoryProps>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Opens from a shell-compatible identity trigger, exposes unread state in its
 * accessible name, and presents notification content before a danger action.
 *
 * @summary unread notification content and keyboard-complete account action
 */
export const NotificationsAndActions: Story = {
  args: {
    actions: [
      {
        icon: <SignOutIcon />,
        id: 'sign-out',
        label: 'Sign out',
        onAction: fn(),
        variant: 'danger',
      },
    ],
    'aria-label': 'User menu',
    hasUnread: true,
    notificationHeading: 'Notifications',
    notificationState: '1 new',
    notifications: (
      <Stack gap="xs">
        <Typography as="strong">Background task complete</Typography>
        <Typography as="span">Completed 4 minutes ago</Typography>
      </Stack>
    ),
    userName: 'Taylor Reed',
  },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'User menu, Unread notifications',
    });
    const avatar = within(trigger).getByRole('img', { name: 'Taylor Reed' });

    await expect(avatar.getBoundingClientRect().width).toBe(
      avatar.getBoundingClientRect().height,
    );
    await expect(avatar.getBoundingClientRect().width).toBeGreaterThan(0);
    await userEvent.click(trigger);
    await expect(
      within(document.body).getByText('Background task complete'),
    ).toBeVisible();
    const signOut = within(document.body).getByRole('menuitem', {
      name: 'Sign out',
    });

    await userEvent.hover(signOut);
    await expect(signOut).toHaveAttribute('data-hovered', 'true');
    await userEvent.unhover(signOut);
    await expect(signOut).not.toHaveAttribute('data-hovered');
  },
};

function ControlledNotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const hasUnread = unreadCount > 0;

  return (
    <UserMenu
      aria-label={`Notifications (${unreadCount} unread)`}
      actions={NotificationsAndActions.args.actions}
      hasUnread={hasUnread}
      notificationHeading="Notifications"
      notificationState={`${unreadCount} unread`}
      notifications="Your background task is complete."
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (!nextOpen) {
          setUnreadCount(0);
        }
      }}
      open={open}
      unreadLabel={`Notifications (${unreadCount} unread)`}
      userName="Taylor Reed"
    />
  );
}

/**
 * Reports dismissal to application state, which marks the displayed unread
 * content read and updates the complete localized trigger name.
 *
 * @summary controlled dismissal with count-aware unread state
 */
export const ControlledDismissal: Story = {
  ...NotificationsAndActions,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', {
      name: 'Notifications (3 unread)',
    });

    await userEvent.click(trigger);
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(
        canvas.getByRole('button', { name: 'Notifications (0 unread)' }),
      ).toHaveFocus(),
    );
  },
  render: ControlledNotificationsMenu,
};
