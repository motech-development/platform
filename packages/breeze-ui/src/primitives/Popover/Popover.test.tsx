import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { Drawer } from '../Drawer/Drawer';
import { Popover, type PopoverProps } from './Popover';

expectTypeOf<PopoverProps>().not.toHaveProperty('className');
expectTypeOf<PopoverProps>().not.toHaveProperty('style');
expectTypeOf<PopoverProps>().not.toHaveProperty('slot');
expectTypeOf<{
  children: string;
  title: string;
  trigger: string;
  open: boolean;
}>().not.toExtend<PopoverProps>();
expectTypeOf<{
  children: string;
  title: string;
  trigger: string;
  open: boolean;
  defaultOpen: boolean;
  onOpenChange: (open: boolean) => void;
}>().not.toExtend<PopoverProps>();
expectTypeOf<{
  children: string;
  title: string;
  trigger: string;
  defaultOpen: boolean;
}>().toExtend<PopoverProps>();
expectTypeOf<{
  children: string;
  title: string;
  trigger: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>().toExtend<PopoverProps>();

describe('Popover', () => {
  it('opens from its trigger and restores focus after closing', async () => {
    renderBreeze(
      <Popover title="Details" trigger="Open details">
        Delivery information
      </Popover>,
    );
    const trigger = screen.getByRole('button', { name: 'Open details' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(trigger);
    const surface = screen.getByRole('dialog', { name: 'Details' });
    expect(surface).toHaveTextContent('Delivery information');
    expect(surface.closest('[data-breeze-portal]')).toHaveAttribute(
      'data-breeze-root',
    );
    await userEvent.click(
      within(surface).getByRole('button', { name: 'Close' }),
    );
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('reports changes while respecting application-controlled state', async () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <BreezeProvider locale="en-GB">
        <Popover
          onOpenChange={onOpenChange}
          open
          title="Details"
          trigger="Open details"
        >
          Delivery information
        </Popover>
      </BreezeProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('dialog', { name: 'Details' })).toBeInTheDocument();
    rerender(
      <BreezeProvider locale="en-GB">
        <Popover
          onOpenChange={onOpenChange}
          open={false}
          title="Details"
          trigger="Open details"
        >
          Delivery information
        </Popover>
      </BreezeProvider>,
    );
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  it('keeps a non-dismissible surface open on Escape and outside presses but allows closing', async () => {
    renderBreeze(
      <Popover
        defaultOpen
        dismissible={false}
        title="Details"
        trigger="Open details"
      >
        Delivery information
      </Popover>,
    );
    const surface = screen.getByRole('dialog', { name: 'Details' });
    await userEvent.keyboard('{Escape}');
    await userEvent.click(document.body);
    expect(surface).toBeInTheDocument();
    await userEvent.click(
      within(surface).getByRole('button', { name: 'Close' }),
    );
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  it('localizes loading and the close action while preserving its heading', () => {
    render(
      <BreezeProvider
        locale="fr-FR"
        messages={{ close: 'Fermer', loading: 'Chargement' }}
      >
        <Popover defaultOpen loading title="Livraison" trigger="Ouvrir">
          Delivery information
        </Popover>
      </BreezeProvider>,
    );
    expect(
      screen.getByRole('heading', { name: 'Livraison' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('progressbar', { name: 'Chargement' }),
    ).toHaveAttribute('lang', 'fr-FR');
    expect(
      screen.getByRole('button', { name: 'Fermer' }).closest('[lang]'),
    ).toHaveAttribute('lang', 'fr-FR');
    expect(screen.queryByText('Delivery information')).not.toBeInTheDocument();
  });

  it('requires a BreezeProvider', () => {
    expect(() =>
      render(
        <Popover title="Details" trigger="Open details">
          Delivery information
        </Popover>,
      ),
    ).toThrow(/BreezeProvider/);
  });
});

describe('Popover inside Drawer', () => {
  it('keeps the drawer scrim while the popover is topmost and restores focus', async () => {
    renderBreeze(
      <Drawer title="Delivery" trigger="Open delivery">
        <Popover title="Date help" trigger="Explain dates">
          Dates use your local time zone.
        </Popover>
      </Drawer>,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Open delivery' }),
    );
    const drawer = screen.getByRole('dialog', { name: 'Delivery' });
    const trigger = within(drawer).getByRole('button', {
      name: 'Explain dates',
    });
    await userEvent.click(trigger);
    const popover = screen.getByRole('dialog', { name: 'Date help' });
    expect(popover.closest('[data-breeze-overlay]')).toHaveAttribute(
      'data-breeze-topmost',
      'true',
    );
    expect(drawer.closest('[data-breeze-overlay]')).toHaveAttribute(
      'data-breeze-scrim',
      'true',
    );
    expect(
      document.querySelectorAll('[data-breeze-scrim="true"]'),
    ).toHaveLength(1);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(
      screen.queryByRole('dialog', { name: 'Date help' }),
    ).not.toBeInTheDocument();
    expect(drawer.closest('[data-breeze-overlay]')).toHaveAttribute(
      'data-breeze-topmost',
      'true',
    );
    expect(drawer.closest('[data-breeze-overlay]')).toHaveAttribute(
      'data-breeze-scrim',
      'true',
    );
  });
});
