import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import AppearanceControl from '../../patterns/AppearanceControl/AppearanceControl';
import { Button } from '../Button/Button';
import { Inline } from '../Inline/Inline';
import { Link } from '../Link/Link';
import { Stack } from '../Stack/Stack';
import { Typography } from '../Typography/Typography';
import { Popover } from './Popover';

const meta = {
  args: {
    children: <Typography>Your delivery arrives on Monday.</Typography>,
    defaultOpen: true,
    title: 'Delivery details',
    trigger: 'View delivery details',
  },
  component: Popover,
  title: 'Overlays/Popover',
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

/** An open surface that can be closed and reopened from its trigger. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const surface = await page.findByRole('dialog', {
      name: 'Delivery details',
    });

    await userEvent.click(
      within(surface).getByRole('button', { name: 'Close' }),
    );
    await waitFor(async () => {
      await expect(
        page.queryByRole('dialog', { name: 'Delivery details' }),
      ).not.toBeInTheDocument();
    });
    const trigger = page.getByRole('button', { name: 'View delivery details' });
    await userEvent.click(trigger);
    await waitFor(async () => {
      await expect(
        page.getByRole('dialog', { name: 'Delivery details' }),
      ).toBeVisible();
    });
  },
};

const notifications = [
  {
    download: true,
    id: 'report',
    message: 'Your report is ready to download',
    unread: true,
    when: 'Today, 14:32',
  },
  {
    download: false,
    id: 'published',
    message: 'A scheduled transaction has been published',
    unread: true,
    when: 'Yesterday, 06:00',
  },
  {
    download: false,
    id: 'virus',
    message:
      'A file you have uploaded is infected with a virus and it has been removed',
    unread: false,
    when: '30 July 2026',
  },
];

// Story-only row layout: Breeze has no notification or panel row parts yet.
const row: CSSProperties = {
  borderBlockEnd: '1px solid var(--breeze-color-breeze-line)',
  paddingBlock: 10,
  paddingInline: 14,
};
const notificationRow: CSSProperties = {
  ...row,
  alignItems: 'flex-start',
  borderBlockEndColor: 'var(--breeze-color-breeze-sunken)',
  display: 'flex',
  gap: 8,
};
const unreadDot: CSSProperties = {
  blockSize: 8,
  borderRadius: '50%',
  flexShrink: 0,
  inlineSize: 8,
  marginBlockStart: 6,
};

function AccountPanelExample() {
  return (
    <div
      style={{ display: 'flex', justifyContent: 'end', paddingInlineEnd: 20 }}
    >
      <Popover
        defaultOpen
        placement="bottom end"
        title="Account and notifications"
        trigger="Account and notifications, 2 unread"
        triggerIndicator
        triggerInitials="MG"
        variant="panel"
      >
        <div style={row}>
          <Inline gap={2} verticalAlign="center">
            <div style={{ flexGrow: 1 }}>
              <Typography tone="muted" variant="micro">
                Notifications
              </Typography>
            </div>
            <Button variant="quiet">Mark all as read</Button>
          </Inline>
        </div>
        {notifications.map((notification) => (
          <div key={notification.id} style={notificationRow}>
            <span
              aria-hidden="true"
              style={{
                ...unreadDot,
                background: notification.unread
                  ? 'var(--breeze-color-breeze-brand)'
                  : 'transparent',
              }}
            />
            <div style={{ flexGrow: 1, minInlineSize: 0 }}>
              <Stack gap={0}>
                <Typography>{notification.message}</Typography>
                <Typography tone="muted" variant="caption">
                  {notification.when}
                </Typography>
              </Stack>
            </div>
            {notification.download ? (
              <Button size="sm" variant="secondary">
                Download
              </Button>
            ) : null}
          </div>
        ))}
        <div style={{ ...row, borderBlockEnd: 0 }}>
          <AppearanceControl />
        </div>
        <div
          style={{
            ...row,
            borderBlock: '1px solid var(--breeze-color-breeze-line)',
          }}
        >
          <Stack gap={3}>
            <Link href="#company" variant="subtle">
              Company details
            </Link>
            <Link href="#settings" variant="subtle">
              Settings
            </Link>
          </Stack>
        </div>
        <div style={{ ...row, borderBlockEnd: 0 }}>
          <Link href="#login" variant="subtle">
            Log out
          </Link>
        </div>
      </Popover>
    </div>
  );
}

/** The prototype's account panel: an initials trigger opening an untitled panel aligned to its end edge. */
export const AccountPanel: Story = {
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const trigger = page.getByRole('button', {
      name: 'Account and notifications, 2 unread',
    });
    const surface = await page.findByRole('dialog', {
      name: 'Account and notifications',
    });
    const popover = surface.closest<HTMLElement>('.breeze-popover');

    if (!popover) throw new Error('The popover was not rendered.');

    await expect(trigger).toHaveTextContent('MG');
    await expect(within(surface).queryByRole('heading')).toBeNull();
    await expect(
      within(surface).queryByRole('button', { name: 'Close' }),
    ).toBeNull();
    // Layout widths ignore the entry animation's scale.
    await expect(popover.offsetWidth).toBeGreaterThanOrEqual(336);
    await waitFor(async () => {
      await expect(popover.getBoundingClientRect().right).toBeCloseTo(
        trigger.getBoundingClientRect().right,
        0,
      );
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(async () => {
      await expect(
        page.queryByRole('dialog', { name: 'Account and notifications' }),
      ).not.toBeInTheDocument();
    });
    await expect(trigger).toHaveFocus();
  },
  render: () => <AccountPanelExample />,
};
