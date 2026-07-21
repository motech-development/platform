import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ArrowRightIcon, InfoIcon, SignOutIcon } from '../../icons';
import { Avatar } from '../../primitives/Avatar/Avatar';
import { Inline } from '../../primitives/Inline/Inline';
import { Logo } from '../../primitives/Logo/Logo';
import { NavigationList } from '../../primitives/NavigationList/NavigationList';
import { Typography } from '../../primitives/Typography/Typography';
import { ContextSwitcher } from '../ContextSwitcher/ContextSwitcher';
import { UserMenu } from '../UserMenu/UserMenu';
import { ApplicationShell } from './ApplicationShell';

const navigation = (
  <NavigationList.Root aria-label="Primary navigation">
    <NavigationList.Item current href="/overview" id="overview">
      <InfoIcon /> Overview
    </NavigationList.Item>
    <NavigationList.Item href="/projects" id="projects">
      <ArrowRightIcon /> Projects
    </NavigationList.Item>
  </NavigationList.Root>
);

const userMenu = (
  <UserMenu
    aria-label="User menu"
    actions={[
      {
        icon: <SignOutIcon />,
        id: 'sign-out',
        label: 'Sign out',
        variant: 'danger',
      },
    ]}
    hasUnread
    notificationHeading="Notifications"
    notificationState="1 new"
    notifications="Your background task is complete."
    userName="Taylor Reed"
  />
);
const brand = (
  <Inline gap="compact" wrap={false}>
    <Logo size="lg" />
    <Typography as="strong" colour="inverse" level="h3">
      Workspace
    </Typography>
  </Inline>
);
const compactBrand = (
  <Typography as="strong" colour="inverse">
    Workspace
  </Typography>
);
const context = (
  <ContextSwitcher
    aria-label="Switch workspace"
    currentId="design"
    items={[
      {
        description: 'Primary workspace',
        icon: (
          <Avatar initials="D" name="Design Team" shape="square" size="md" />
        ),
        id: 'design',
        name: 'Design Team',
      },
      {
        description: 'Secondary workspace',
        id: 'research',
        name: 'Research Team',
      },
    ]}
    manageLabel="Manage workspaces"
    onChange={() => undefined}
    onManage={() => undefined}
    triggerLabel="Current workspace"
  />
);

const meta = {
  component: ApplicationShell,
  parameters: {
    layout: 'fullscreen',
  },
  title: 'Patterns/Application Shell/ApplicationShell',
} satisfies Meta<typeof ApplicationShell>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Composes every public shell slot into the persistent wide-screen rail and
 * main workspace, including skip navigation and application-owned controls.
 *
 * @summary complete application shell with every public slot
 */
export const CompleteFrame: Story = {
  args: {
    account: userMenu,
    brand,
    children: <Typography as="h1">Overview</Typography>,
    compactBrand,
    context,
    navigation,
    navigationLabel: 'Open navigation',
    skipLinkLabel: 'Skip to content',
  },
};

/**
 * Uses the canonical compact viewport to verify the rail becomes a header and
 * drawer entry point while the account avatar stays inside the visible screen.
 *
 * @summary compact shell header with unclipped account control
 */
export const CompactNavigation: Story = {
  ...CompleteFrame,
  globals: { viewport: { value: 'mobile1' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const accountMenu = within(canvas.getByRole('banner')).getByRole('button', {
      name: 'User menu, Unread notifications',
    });
    const avatar = within(accountMenu).getByRole('img', {
      name: 'Taylor Reed',
    });

    await expect(within(document.body).queryByRole('dialog')).toBeNull();
    await expect(avatar.getBoundingClientRect().right).toBeLessThanOrEqual(
      window.innerWidth,
    );
  },
};

/**
 * Hovers an inactive destination in the desktop rail to demonstrate the
 * available navigation treatment without assigning current-page semantics.
 *
 * @summary inactive shell destination hover treatment
 */
export const NavigationHover: Story = {
  ...CompleteFrame,
  play: async ({ canvasElement }) => {
    const projects = within(canvasElement).getByRole('link', {
      name: 'Projects',
    });

    await userEvent.hover(projects);
    await expect(projects).toHaveAttribute('data-hovered', 'true');
  },
};

/**
 * Hovers the current desktop destination to verify hover feedback coexists
 * with, and does not replace, its stronger active-item presentation.
 *
 * @summary hover treatment preserving the current shell destination
 */
export const ActiveNavigationHover: Story = {
  ...CompleteFrame,
  play: async ({ canvasElement }) => {
    const overview = within(canvasElement).getByRole('link', {
      name: 'Overview',
    });

    await userEvent.hover(overview);
    await expect(overview).toHaveAttribute('data-current', 'true');
    await expect(overview).toHaveAttribute('data-hovered', 'true');
  },
};
