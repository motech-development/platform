import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef } from 'react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import type { ItemDescriptor } from '../../collections/item.types';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { Drawer } from '../Drawer/Drawer';
import { Menu, type MenuItemDescriptor, type MenuProps } from './Menu';

interface Action {
  descriptor: ItemDescriptor;
  id: string;
}

const actions: Action[] = [
  {
    descriptor: {
      description: 'Review company details.',
      icon: 'building',
      id: 'company',
      label: 'Company details',
    },
    id: 'company-action',
  },
  {
    descriptor: {
      disabled: true,
      id: 'unavailable',
      label: 'Unavailable action',
    },
    id: 'unavailable-action',
  },
  {
    descriptor: {
      icon: 'signOut',
      id: 'sign-out',
      label: 'Sign out',
    },
    id: 'sign-out-action',
  },
];

const badgeFallbackAction: ItemDescriptor = {
  badge: {
    'aria-label': '  ',
    children: 'New',
    variant: 'brand',
  },
  id: 'reports',
  label: 'Reports',
};

interface Company {
  id: string;
  initials: string;
  name: string;
  selected: boolean;
}

const companies: Company[] = [
  { id: 'harbour', initials: 'HP', name: 'Harbour & Pine Ltd', selected: true },
  {
    id: 'wold',
    initials: 'WF',
    name: 'Wold Farm Joinery Ltd',
    selected: false,
  },
];

const companyMenuItems: (Company | 'manage')[] = [...companies, 'manage'];

function getCompanyMenuItem(item: Company | 'manage'): MenuItemDescriptor {
  if (item === 'manage') {
    return { icon: 'settings', id: 'manage', label: 'Manage companies' };
  }

  return {
    ...(item.selected && { badge: { children: 'Selected', variant: 'brand' } }),
    id: item.id,
    initials: item.initials,
    label: item.name,
    section: { id: 'companies', label: 'Companies' },
  };
}

function MenuWithFocusDestination() {
  const destinationRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Menu
        getItem={(item) => item.descriptor}
        items={actions}
        onAction={() => destinationRef.current?.focus()}
        trigger="Account actions"
      />
      <button ref={destinationRef} type="button">
        Continue
      </button>
    </>
  );
}

expectTypeOf<{
  icon: 'settings';
  id: string;
  initials: string;
  label: string;
}>().not.toExtend<MenuItemDescriptor>();
expectTypeOf<{
  id: string;
  initials: string;
  label: string;
  section: { id: string };
}>().toExtend<MenuItemDescriptor>();
expectTypeOf<MenuProps<Action>>().not.toHaveProperty('className');
expectTypeOf<MenuProps<Action>>().not.toHaveProperty('style');
expectTypeOf<MenuProps<Action>>().not.toHaveProperty('slot');
expectTypeOf<MenuProps<Action>>().not.toHaveProperty('children');
expectTypeOf<{
  getItem: (item: Action) => ItemDescriptor;
  items: Action[];
  trigger: string;
  defaultOpen: boolean;
}>().toExtend<MenuProps<Action>>();
expectTypeOf<{
  getItem: (item: Action) => ItemDescriptor;
  items: Action[];
  onOpenChange: (open: boolean) => void;
  open: boolean;
  trigger: string;
}>().toExtend<MenuProps<Action>>();
expectTypeOf<{
  getItem: (item: Action) => ItemDescriptor;
  items: Action[];
  onOpenChange: (open: boolean) => void;
  open: boolean;
  defaultOpen: boolean;
  trigger: string;
}>().not.toExtend<MenuProps<Action>>();
expectTypeOf<
  NonNullable<MenuProps<Action>['onAction']>
>().parameters.toEqualTypeOf<[Action]>();
expectTypeOf<{
  getItem: (item: Action) => ItemDescriptor;
  items: Action[];
  triggerAriaLabel: string;
  triggerIcon: 'more';
}>().toExtend<MenuProps<Action>>();
expectTypeOf<{
  getItem: (item: Action) => ItemDescriptor;
  items: Action[];
  triggerIcon: 'more';
}>().not.toExtend<MenuProps<Action>>();
expectTypeOf<{
  getItem: (item: Action) => ItemDescriptor;
  items: Action[];
  triggerAriaLabel: string;
}>().not.toExtend<MenuProps<Action>>();

describe('Menu', () => {
  it('requires a BreezeProvider', () => {
    expect(() =>
      render(
        <Menu
          getItem={(item) => item.descriptor}
          items={actions}
          trigger="Account actions"
        />,
      ),
    ).toThrow('Breeze components must be rendered within BreezeProvider.');
  });

  it('allows an accessible trigger name that differs from its visible label', () => {
    renderBreeze(
      <Menu
        getItem={(item) => item.descriptor}
        items={actions}
        trigger="More actions"
        triggerAriaLabel="More actions: invoice.pdf"
      />,
    );

    const trigger = screen.getByRole('button', {
      name: 'More actions: invoice.pdf',
    });

    expect(trigger).toHaveTextContent('More actions');
  });

  it('opens from an icon-only trigger named by its accessible label', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    renderBreeze(
      <Menu
        getItem={(item) => item.descriptor}
        items={actions}
        onAction={onAction}
        triggerAriaLabel="More actions: invoice.pdf"
        triggerIcon="more"
      />,
    );

    const trigger = screen.getByRole('button', {
      name: 'More actions: invoice.pdf',
    });

    expect(trigger).toHaveTextContent('');
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');

    await user.click(trigger);

    const menu = screen.getByRole('menu', {
      name: 'More actions: invoice.pdf',
    });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await user.click(
      within(menu).getByRole('menuitem', { name: 'Company details' }),
    );

    expect(onAction).toHaveBeenCalledExactlyOnceWith(actions[0]);
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('gives a loading icon-only trigger one progress indicator and blocks opening', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    renderBreeze(
      <Menu
        getItem={(item) => item.descriptor}
        items={actions}
        loading
        onOpenChange={onOpenChange}
        triggerAriaLabel="More actions"
        triggerIcon="more"
      />,
    );

    // As with Button, the pending progress joins the retained label.
    const trigger = screen.getByRole('button', {
      name: 'More actions Loading',
    });

    expect(trigger).toHaveAttribute('aria-busy', 'true');
    expect(trigger).toHaveAttribute('aria-disabled', 'true');
    expect(
      screen.getAllByRole('progressbar', { name: 'Loading' }),
    ).toHaveLength(1);
    expect(screen.getByRole('status')).toHaveTextContent('Loading');

    await user.click(trigger);

    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('renders the descriptor content in the provider portal', () => {
    renderBreeze(
      <Menu
        defaultOpen
        getItem={(item) => item.descriptor}
        items={actions}
        trigger="Account actions"
        triggerIcon="people"
      />,
    );

    const trigger = screen.getByRole('button', { name: 'Account actions' });
    const menu = screen.getByRole('menu', { name: 'Account actions' });
    const companyAction = within(menu).getByRole('menuitem', {
      name: 'Company details',
    });
    const unavailableAction = within(menu).getByRole('menuitem', {
      name: 'Unavailable action',
    });

    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(companyAction).toHaveAccessibleDescription(
      'Review company details.',
    );
    expect(unavailableAction.firstElementChild).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(unavailableAction.firstElementChild?.className).toBe(
      companyAction.firstElementChild?.className,
    );
    expect(menu.closest('[data-breeze-portal]')).toHaveAttribute(
      'data-breeze-root',
    );
  });

  it.each([
    { minimum: '256px', width: undefined },
    { minimum: '256px', width: 'md' },
    { minimum: '208px', width: 'sm' },
  ] as const)(
    'sets a $minimum minimum width for width $width, never narrower than the trigger',
    ({ minimum, width }) => {
      renderBreeze(
        <Menu
          defaultOpen
          getItem={(item) => item.descriptor}
          items={actions}
          trigger="Account actions"
          width={width}
        />,
      );

      const popover = screen.getByRole('menu').closest('.breeze-popover');

      expect(popover?.className).toContain(
        `breeze:min-inline-[max(${minimum},var(--trigger-width))]`,
      );
    },
  );

  it('names sections by their header and divides neighbouring groups', () => {
    renderBreeze(
      <Menu
        defaultOpen
        getItem={getCompanyMenuItem}
        items={companyMenuItems}
        trigger="Harbour & Pine Ltd"
      />,
    );

    const menu = screen.getByRole('menu', { name: 'Harbour & Pine Ltd' });
    const section = within(menu).getByRole('group', { name: 'Companies' });

    expect(
      within(section)
        .getAllByRole('menuitem')
        .map((item) => item.textContent),
    ).toEqual(['HPHarbour & Pine LtdSelected', 'WFWold Farm Joinery Ltd']);
    expect(
      within(section).queryByRole('menuitem', { name: 'Manage companies' }),
    ).not.toBeInTheDocument();
    expect(within(menu).getAllByRole('separator')).toHaveLength(1);
    expect(
      within(menu).getByRole('menuitem', { name: 'Manage companies' }),
    ).toBeInTheDocument();
  });

  it('divides unlabelled sections without naming them', () => {
    renderBreeze(
      <Menu
        defaultOpen
        getItem={(item) => ({
          ...item.descriptor,
          section: { id: item.id === 'sign-out-action' ? 'session' : 'main' },
        })}
        items={actions}
        trigger="Account actions"
      />,
    );

    const menu = screen.getByRole('menu', { name: 'Account actions' });
    const groups = within(menu).getAllByRole('group');

    expect(groups).toHaveLength(2);
    groups.forEach((group) => expect(group).not.toHaveAccessibleName());
    expect(within(groups[1]).getByRole('menuitem')).toHaveAccessibleName(
      'Sign out',
    );
    expect(within(menu).getAllByRole('separator')).toHaveLength(1);
  });

  it('shows initials as decorative content and reports the application item', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    renderBreeze(
      <Menu
        getItem={getCompanyMenuItem}
        items={companyMenuItems}
        onAction={onAction}
        trigger="Harbour & Pine Ltd"
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'Harbour & Pine Ltd' }),
    );

    const company = screen.getByRole('menuitem', {
      name: 'Wold Farm Joinery Ltd',
    });
    const initials = within(company).getByText('WF');

    expect(initials).toHaveAttribute('aria-hidden', 'true');
    expect(
      screen.getByRole('menuitem', { name: 'Harbour & Pine Ltd, Selected' }),
    ).toBeInTheDocument();

    await user.click(company);

    expect(onAction).toHaveBeenCalledExactlyOnceWith(companies[1]);
  });

  it('falls back to visible badge text when its accessible label is blank', () => {
    renderBreeze(
      <Menu
        defaultOpen
        getItem={(item) => item}
        items={[badgeFallbackAction]}
        trigger="Reports"
      />,
    );

    expect(
      screen.getByRole('menuitem', { name: 'Reports, New' }),
    ).toHaveAccessibleName('Reports, New');
  });

  it('uses keyboard navigation and reports the selected application item', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const onOpenChange = vi.fn();

    renderBreeze(
      <Menu
        getItem={(item) => item.descriptor}
        items={actions}
        onAction={onAction}
        onOpenChange={onOpenChange}
        trigger="Account actions"
      />,
    );

    const trigger = screen.getByRole('button', { name: 'Account actions' });
    trigger.focus();
    await user.keyboard('{ArrowDown}');

    const menu = screen.getByRole('menu', { name: 'Account actions' });
    const companyAction = within(menu).getByRole('menuitem', {
      name: 'Company details',
    });
    expect(companyAction).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(
      within(menu).getByRole('menuitem', { name: 'Sign out' }),
    ).toHaveFocus();
    expect(
      within(menu).queryByRole('menuitem', { name: 'Unavailable action' }),
    ).toHaveAttribute('aria-disabled', 'true');

    await user.keyboard('{Enter}');

    expect(onAction).toHaveBeenCalledExactlyOnceWith(actions[2]);
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('closes on Escape and restores focus to the trigger', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    renderBreeze(
      <Menu
        defaultOpen
        getItem={(item) => item.descriptor}
        items={actions}
        onOpenChange={onOpenChange}
        trigger="Account actions"
      />,
    );

    const trigger = screen.getByRole('button', { name: 'Account actions' });
    await user.keyboard('{Escape}');

    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
    );
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('leaves controlled visibility to the caller', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <BreezeProvider locale="en-GB">
        <Menu
          getItem={(item) => item.descriptor}
          items={actions}
          onOpenChange={onOpenChange}
          open={false}
          trigger="Account actions"
        />
      </BreezeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Account actions' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    rerender(
      <BreezeProvider locale="en-GB">
        <Menu
          getItem={(item) => item.descriptor}
          items={actions}
          onOpenChange={onOpenChange}
          open
          trigger="Account actions"
        />
      </BreezeProvider>,
    );

    expect(screen.getByRole('menu', { name: 'Account actions' })).toBeVisible();
  });

  it('closes before its containing drawer and then restores focus', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <Drawer title="Details" trigger="Open details">
        <Menu
          getItem={(item) => item.descriptor}
          items={actions}
          trigger="Account actions"
        />
      </Drawer>,
    );

    const drawerTrigger = screen.getByRole('button', { name: 'Open details' });
    await user.click(drawerTrigger);
    expect(
      await screen.findByRole('dialog', { name: 'Details' }),
    ).toBeInTheDocument();

    const menuTrigger = screen.getByRole('button', { name: 'Account actions' });
    menuTrigger.focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
    );
    expect(screen.getByRole('dialog', { name: 'Details' })).toBeInTheDocument();
    await waitFor(() => expect(menuTrigger).toHaveFocus());

    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(
        screen.queryByRole('dialog', { name: 'Details' }),
      ).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(drawerTrigger).toHaveFocus());
  });

  it('opens from pointer activation and closes after selecting an item', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    renderBreeze(
      <Menu
        getItem={(item) => item.descriptor}
        items={actions}
        onAction={onAction}
        trigger="Account actions"
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Account actions' }));
    await user.click(screen.getByRole('menuitem', { name: 'Company details' }));

    expect(onAction).toHaveBeenCalledExactlyOnceWith(actions[0]);
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
    );
  });

  it('preserves focus moved by an action to another target', async () => {
    const user = userEvent.setup();

    renderBreeze(<MenuWithFocusDestination />);

    const trigger = screen.getByRole('button', { name: 'Account actions' });
    const destination = screen.getByRole('button', { name: 'Continue' });

    trigger.focus();
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
    );
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
    expect(destination).toHaveFocus();
    expect(trigger).not.toHaveFocus();
  });

  it('keeps its name and focus while loading and blocks opening until ready', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const menu = (loading: boolean) => (
      <BreezeProvider locale="fr-FR" messages={{ loading: 'Chargement' }}>
        <Menu
          getItem={(item) => item.descriptor}
          items={actions}
          loading={loading}
          onOpenChange={onOpenChange}
          trigger="Account actions"
          triggerIcon="people"
        />
      </BreezeProvider>
    );
    const { rerender } = render(menu(false));
    const trigger = screen.getByRole('button', { name: 'Account actions' });
    trigger.focus();

    rerender(menu(true));

    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAccessibleName('Account actions');
    expect(trigger).toHaveAttribute('aria-busy', 'true');
    expect(trigger).toHaveAttribute('aria-disabled', 'true');
    expect(
      screen.getByRole('progressbar', { name: 'Chargement' }),
    ).toHaveAttribute('lang', 'fr-FR');
    expect(screen.getByRole('status')).toHaveTextContent('Chargement');

    await user.click(trigger);
    await user.keyboard('{Enter}{Space}{ArrowDown}');

    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    rerender(menu(false));

    expect(trigger).toHaveFocus();
    expect(trigger).not.toHaveAttribute('aria-busy');
    expect(trigger).not.toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('status')).toBeEmptyDOMElement();

    await user.click(trigger);

    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
    expect(screen.getByRole('menu')).toBeVisible();
  });

  it('keeps a controlled open menu actionable while its trigger is loading', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const onOpenChange = vi.fn();
    const menu = (open: boolean) => (
      <BreezeProvider locale="en-GB">
        <Menu
          getItem={(item) => item.descriptor}
          items={actions}
          loading
          onAction={onAction}
          onOpenChange={onOpenChange}
          open={open}
          trigger="Account actions"
        />
      </BreezeProvider>
    );
    const { rerender } = render(menu(true));
    const trigger = screen.getByRole('button', { name: 'Account actions' });
    const menuElement = screen.getByRole('menu', { name: 'Account actions' });

    expect(trigger).toHaveAttribute('aria-busy', 'true');
    expect(trigger).toHaveAttribute('aria-disabled', 'true');
    expect(
      within(menuElement).getByRole('menuitem', { name: 'Sign out' }),
    ).not.toHaveAttribute('aria-disabled', 'true');

    await user.click(
      within(menuElement).getByRole('menuitem', { name: 'Sign out' }),
    );

    expect(onAction).toHaveBeenCalledExactlyOnceWith(actions[2]);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    rerender(menu(false));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
