import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { BreezeProvider } from '../../provider/BreezeProvider';
import type { ItemDescriptor } from '../Collection/item.types';
import { Drawer } from '../Drawer/Drawer';
import { Menu, type MenuProps } from './Menu';

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

  it('uses keyboard navigation and reports the selected descriptor', async () => {
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

    expect(onAction).toHaveBeenCalledWith(actions[2].descriptor);
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
    );
    expect(trigger).toHaveFocus();
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
    expect(trigger).toHaveFocus();
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
    expect(menuTrigger).toHaveFocus();

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

    expect(onAction).toHaveBeenCalledWith(actions[0].descriptor);
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
    );
  });
});
