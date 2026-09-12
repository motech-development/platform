import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { Button } from '../Button/Button';
import { Drawer, type DrawerProps } from './Drawer';

expectTypeOf<DrawerProps>().not.toHaveProperty('className');
expectTypeOf<DrawerProps>().not.toHaveProperty('style');
expectTypeOf<DrawerProps>().not.toHaveProperty('slot');
expectTypeOf<{
  children: string;
  title: string;
  trigger: string;
  open: boolean;
}>().not.toExtend<DrawerProps>();
expectTypeOf<{
  children: string;
  title: string;
  trigger: string;
  open: boolean;
  defaultOpen: boolean;
  onOpenChange: (open: boolean) => void;
}>().not.toExtend<DrawerProps>();
expectTypeOf<{
  children: string;
  title: string;
  trigger: string;
  defaultOpen: boolean;
}>().toExtend<DrawerProps>();
expectTypeOf<{
  children: string;
  title: string;
  trigger: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>().toExtend<DrawerProps>();

describe('Drawer', () => {
  it('opens from its trigger and restores focus after closing', async () => {
    renderBreeze(
      <Drawer title="Details" trigger="Open details">
        Delivery information
      </Drawer>,
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
        <Drawer
          onOpenChange={onOpenChange}
          open
          title="Details"
          trigger="Open details"
        >
          Delivery information
        </Drawer>
      </BreezeProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('dialog', { name: 'Details' })).toBeInTheDocument();
    rerender(
      <BreezeProvider locale="en-GB">
        <Drawer
          onOpenChange={onOpenChange}
          open={false}
          title="Details"
          trigger="Open details"
        >
          Delivery information
        </Drawer>
      </BreezeProvider>,
    );
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  it('keeps a non-dismissible surface open on Escape and outside presses but allows closing', async () => {
    renderBreeze(
      <Drawer
        defaultOpen
        dismissible={false}
        title="Details"
        trigger="Open details"
      >
        Delivery information
      </Drawer>,
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
        <Drawer defaultOpen loading title="Livraison" trigger="Ouvrir">
          Delivery information
        </Drawer>
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

  it('keeps focus in the drawer when loading removes the focused content', async () => {
    let startLoading = () => {};
    function Example() {
      const [loading, setLoading] = useState(false);
      startLoading = () => setLoading(true);
      return (
        <Drawer
          defaultOpen
          loading={loading}
          title="Details"
          trigger="Open details"
        >
          <Button onAction={() => setLoading(true)}>Load details</Button>
        </Drawer>
      );
    }

    renderBreeze(<Example />);
    const drawer = screen.getByRole('dialog', { name: 'Details' });
    within(drawer).getByRole('button', { name: 'Load details' }).focus();
    act(startLoading);
    expect(drawer).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  it('requires a BreezeProvider', () => {
    expect(() =>
      render(
        <Drawer title="Details" trigger="Open details">
          Delivery information
        </Drawer>,
      ),
    ).toThrow(/BreezeProvider/);
  });
});
