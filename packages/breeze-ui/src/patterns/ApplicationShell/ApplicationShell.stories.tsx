import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ArrowRightIcon, InfoIcon, SignOutIcon } from '../../icons';
import { Avatar } from '../../primitives/Avatar/Avatar';
import { Inline } from '../../primitives/Inline/Inline';
import { Logo } from '../../primitives/Logo/Logo';
import { NavigationList } from '../../primitives/NavigationList/NavigationList';
import { Typography } from '../../primitives/Typography/Typography';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { ContextSwitcher } from '../ContextSwitcher/ContextSwitcher';
import { UserMenu } from '../UserMenu/UserMenu';
import {
  ApplicationShell,
  type ApplicationShellProps,
} from './ApplicationShell';

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
} satisfies Meta<ApplicationShellProps>;

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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const contextTrigger = canvas.getByRole('button', {
      name: 'Switch workspace',
    });

    await userEvent.click(contextTrigger);
    await expect(contextTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(
      body.getByRole('menu', { name: 'Switch workspace' }),
    ).toBeVisible();
    await userEvent.click(contextTrigger);
    await expect(contextTrigger).toHaveAttribute('aria-expanded', 'false');
    const accountTrigger = canvas.getByRole('button', {
      name: 'User menu, Unread notifications',
    });

    await userEvent.click(accountTrigger);
    await expect(accountTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(
      body.getByText('Your background task is complete.'),
    ).toBeVisible();
    await userEvent.click(accountTrigger);
    await expect(accountTrigger).toHaveAttribute('aria-expanded', 'false');
  },
};

const longUserName = 'averylongaccountname@example.test';
const longContextName =
  'A company name that is substantially longer than the application rail';

/**
 * Keeps application-owned context and account labels inside the fixed rail
 * when real data is substantially longer than the available space.
 *
 * @summary long shell labels remain contained
 */
export const LongShellLabels: Story = {
  args: {
    ...CompleteFrame.args,
    account: (
      <UserMenu aria-label="User menu" actions={[]} userName={longUserName} />
    ),
    context: (
      <ContextSwitcher
        aria-label="Switch company"
        currentId="long-company"
        items={[
          {
            id: 'long-company',
            name: longContextName,
          },
        ]}
        onChange={() => undefined}
        triggerLabel="Company"
      />
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const rail = canvas.getByRole('complementary');
    const railRight = rail.getBoundingClientRect().right;
    const contextTrigger = canvas.getByRole('button', {
      name: 'Switch company',
    });
    const accountTrigger = canvas.getByRole('button', {
      name: 'User menu',
    });

    await expect(
      contextTrigger.getBoundingClientRect().right,
    ).toBeLessThanOrEqual(railRight);
    await expect(
      accountTrigger.getBoundingClientRect().right,
    ).toBeLessThanOrEqual(railRight);
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
    const header = canvas.getByRole('banner');
    const accountMenu = within(header).getByRole('button', {
      name: 'User menu, Unread notifications',
    });
    const avatar = within(accountMenu).getByRole('img', {
      name: 'Taylor Reed',
    });

    const headerStyle = getComputedStyle(header);

    await expect(within(document.body).queryByRole('dialog')).toBeNull();
    await expect(headerStyle.position).toBe('sticky');
    await expect(headerStyle.top).toBe('0px');
    await expect(avatar.getBoundingClientRect().right).toBeLessThanOrEqual(
      window.innerWidth,
    );
  },
};

function ControlledCompactNavigationFrame() {
  const [compactNavigationOpen, setCompactNavigationOpen] = useState(false);

  return (
    <BreezeProvider
      locale="en-GB"
      router={{ navigate: () => setCompactNavigationOpen(false) }}
    >
      <ApplicationShell
        account={userMenu}
        brand={brand}
        compactBrand={compactBrand}
        compactNavigationOpen={compactNavigationOpen}
        context={context}
        navigation={navigation}
        navigationLabel="Open navigation"
        onCompactNavigationOpenChange={setCompactNavigationOpen}
        skipLinkLabel="Skip to content"
      >
        <Typography as="h1">Overview</Typography>
      </ApplicationShell>
    </BreezeProvider>
  );
}

/**
 * Lets application route state control compact navigation while destinations
 * remain native anchors and the wide rail retains the same navigation.
 *
 * @summary controlled compact navigation closed after route activation
 */
export const ControlledCompactNavigation: Story = {
  ...CompactNavigation,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole('button', { name: 'Open navigation' }),
    );
    const dialog = within(document.body).getByRole('dialog');
    const destination = within(dialog).getByRole('link', { name: 'Projects' });

    await expect(
      within(dialog).getByRole('button', { name: 'Switch workspace' }),
    ).toBeInTheDocument();
    await expect(
      within(dialog).queryByRole('button', {
        name: 'User menu, Unread notifications',
      }),
    ).toBeNull();
    await expect(destination).toHaveAttribute('href', '/projects');
    await userEvent.click(destination);
    await waitFor(() =>
      expect(within(document.body).queryByRole('dialog')).toBeNull(),
    );
  },
  render: ControlledCompactNavigationFrame,
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
