import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import type { ItemDescriptor } from '../../collections/item.types';
import { Button } from '../Button/Button';
import { Menu, type MenuItemDescriptor } from './Menu';

const actions = [
  {
    badge: {
      children: 'New',
      variant: 'brand',
    },
    icon: 'settings',
    id: 'settings',
    label: 'Settings',
  },
  {
    description: 'End the current session.',
    icon: 'signOut',
    id: 'sign-out',
    label: 'Sign out',
  },
  {
    disabled: true,
    id: 'unavailable',
    label: 'Unavailable action',
  },
] satisfies ItemDescriptor[];

const meta = {
  args: {
    defaultOpen: true,
    getItem: (item: unknown) => item as ItemDescriptor,
    items: actions,
    trigger: 'Account actions',
    triggerIcon: 'people',
  },
  component: Menu,
  title: 'Overlays/Menu',
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A compact set of account actions. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Account actions',
    });
    const menu = await within(document.body).findByRole('menu', {
      name: 'Account actions',
    });
    const popover = menu.closest<HTMLElement>('.breeze-popover');

    if (!popover) throw new Error('The menu popover was not rendered.');

    // Layout widths ignore the entry animation's scale.
    await expect(popover.offsetWidth).toBeGreaterThanOrEqual(
      Math.max(256, trigger.offsetWidth),
    );
  },
};

const companies = [
  { id: 'harbour', initials: 'HP', name: 'Harbour & Pine Ltd' },
  { id: 'wold', initials: 'WF', name: 'Wold Farm Joinery Ltd' },
];
const companyMenuItems = [...companies, null];

function getCompanyMenuItem(
  company: (typeof companies)[number] | null,
): MenuItemDescriptor {
  if (!company) {
    return { icon: 'settings', id: 'manage', label: 'Manage companies' };
  }

  return {
    ...(company.id === 'harbour' && {
      badge: { children: 'Selected', variant: 'brand' },
    }),
    id: company.id,
    initials: company.initials,
    label: company.name,
    section: { id: 'companies', label: 'Companies' },
  };
}

/** A labelled section of companies shown by initials, divided from a trailing action. */
export const Sections: Story = {
  play: async () => {
    await document.fonts.ready;

    const menu = await within(document.body).findByRole('menu', {
      name: 'Harbour & Pine Ltd',
    });
    const popover = menu.closest('.breeze-popover');

    if (!popover) throw new Error('The menu popover was not rendered.');

    // Measure after the entry animation's scale settles.
    await Promise.all(popover.getAnimations().map(({ finished }) => finished));

    const section = within(menu).getByRole('group', { name: 'Companies' });
    const [selected, other] = within(section).getAllByRole('menuitem');
    const manage = within(menu).getByRole('menuitem', {
      name: 'Manage companies',
    });

    await expect(selected).toHaveAccessibleName('Harbour & Pine Ltd, Selected');
    await expect(within(menu).getAllByRole('separator')).toHaveLength(1);
    // Initials rows match the prototype's 44px; icon rows its 38.57px.
    await expect(selected.getBoundingClientRect().height).toBeCloseTo(44, 0);
    await expect(other.getBoundingClientRect().height).toBeCloseTo(44, 0);
    await expect(manage.getBoundingClientRect().height).toBeCloseTo(38.57, 1);
  },
  render: () => (
    <Menu
      defaultOpen
      getItem={getCompanyMenuItem}
      items={companyMenuItems}
      trigger="Harbour & Pine Ltd"
      triggerIcon="building"
    />
  ),
};

const fileActions = [
  { icon: 'document', id: 'open', label: 'Open full screen' },
  { icon: 'download', id: 'download', label: 'Download' },
  { icon: 'upload', id: 'replace', label: 'Replace' },
  { icon: 'delete', id: 'remove', label: 'Remove' },
] satisfies ItemDescriptor[];

/** A short list of file actions opened at the narrower `sm` width. */
export const NarrowWidth: Story = {
  args: {
    items: fileActions,
    trigger: undefined,
    triggerAriaLabel: 'More actions',
    triggerIcon: 'more',
    width: 'sm',
  },
  play: async () => {
    const menu = await within(document.body).findByRole('menu', {
      name: 'More actions',
    });
    const popover = menu.closest<HTMLElement>('.breeze-popover');

    if (!popover) throw new Error('The menu popover was not rendered.');

    // Layout widths ignore the entry animation's scale.
    await expect(popover.offsetWidth).toBe(208);
  },
};

/** An icon-only trigger, named by `triggerAriaLabel`. */
export const IconOnlyTrigger: Story = {
  args: {
    defaultOpen: false,
    trigger: undefined,
    triggerAriaLabel: 'More actions',
    triggerIcon: 'more',
  },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'More actions',
    });

    await expect(trigger).toHaveTextContent('');
    await userEvent.click(trigger);

    const menu = await within(document.body).findByRole('menu', {
      name: 'More actions',
    });

    // Wait out the popover's fade-in from opacity 0.
    await waitFor(async () => {
      await expect(menu).toBeVisible();
    });
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(
      within(menu).getByRole('menuitem', { name: 'Settings, New' }),
    ).toBeVisible();
  },
};

function ControlledExample() {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState('none');

  return (
    <div className="breeze-story-action">
      <Menu
        getItem={(item) => item}
        items={actions}
        onAction={(item) => setAction(item.label)}
        onOpenChange={setOpen}
        open={open}
        trigger="Account actions"
        triggerIcon="people"
      />
      <output>
        Menu is {open ? 'open' : 'closed'}. Last action: {action}.
      </output>
    </div>
  );
}

/** Control visibility and receive the selected application item. */
export const Controlled: Story = {
  render: () => <ControlledExample />,
};

function LoadingExample() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="breeze-story-action">
      <Menu
        getItem={(item) => item}
        items={actions}
        loading={loading}
        trigger="Account actions"
        triggerIcon="people"
      />
      <Button onAction={() => setLoading((current) => !current)}>
        {loading ? 'Finish loading menu' : 'Start loading menu'}
      </Button>
    </div>
  );
}

/** The trigger shows a loading bar while keeping its size and accessible name. */
export const Loading: Story = {
  play: async ({ canvasElement }) => {
    await document.fonts.ready;

    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Account actions' });
    const initialLoadingBounds = trigger.getBoundingClientRect();

    await expect(trigger).toHaveAttribute('aria-busy', 'true');
    await expect(trigger).toHaveAttribute('aria-disabled', 'true');
    await expect(trigger).toHaveAccessibleName('Account actions');
    await expect(canvas.getByRole('status')).toHaveTextContent('Loading');
    await expect(
      canvas.getByRole('progressbar', { name: 'Loading' }),
    ).toBeInTheDocument();
    await expect(trigger.querySelector('[data-breeze-skeleton]')).toBeTruthy();

    await userEvent.click(
      canvas.getByRole('button', { name: 'Finish loading menu' }),
    );

    await expect(trigger).not.toHaveAttribute('aria-busy');
    await expect(canvas.getByRole('status')).toBeEmptyDOMElement();
    const readyBounds = trigger.getBoundingClientRect();
    await expect([readyBounds.width, readyBounds.height]).toEqual([
      initialLoadingBounds.width,
      initialLoadingBounds.height,
    ]);

    await userEvent.click(
      canvas.getByRole('button', { name: 'Start loading menu' }),
    );

    await expect(trigger).toHaveAttribute('aria-busy', 'true');
    await expect(trigger).toHaveAttribute('aria-disabled', 'true');
    await expect(canvas.getByRole('status')).toHaveTextContent('Loading');
    const finalLoadingBounds = trigger.getBoundingClientRect();
    await expect([finalLoadingBounds.width, finalLoadingBounds.height]).toEqual(
      [readyBounds.width, readyBounds.height],
    );

    trigger.focus();
    await userEvent.click(trigger);
    await userEvent.keyboard('{Enter}{Space}{ArrowDown}');
    await expect(
      within(document.body).queryByRole('menu'),
    ).not.toBeInTheDocument();
  },
  render: () => <LoadingExample />,
};
