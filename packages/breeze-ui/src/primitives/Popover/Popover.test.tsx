import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { Button } from '../Button/Button';
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

  it('toggles from its trigger with pointer and keyboard activation', async () => {
    renderBreeze(
      <Popover title="Details" trigger="Open details">
        Delivery information
      </Popover>,
    );
    const trigger = screen.getByRole('button', { name: 'Open details' });

    await userEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Details' })).toBeInTheDocument();
    await userEvent.click(trigger);
    await waitFor(() =>
      expect(
        screen.queryByRole('dialog', { name: 'Details' }),
      ).not.toBeInTheDocument(),
    );

    trigger.focus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('dialog', { name: 'Details' })).toBeInTheDocument();
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() =>
      expect(
        screen.queryByRole('dialog', { name: 'Details' }),
      ).not.toBeInTheDocument(),
    );
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

  it('reports one outside dismissal per controlled pointer interaction', async () => {
    const onOpenChange = vi.fn();
    renderBreeze(
      <>
        <Popover
          onOpenChange={onOpenChange}
          open
          title="Details"
          trigger="Open details"
        >
          Delivery information
        </Popover>
        <Button>Outside action</Button>
      </>,
    );
    const surface = await screen.findByRole('dialog', { name: 'Details' });
    const outside = screen.getByRole('button', { name: 'Outside action' });
    await waitFor(() => expect(surface).toHaveFocus());

    await userEvent.click(outside);
    expect(onOpenChange).toHaveBeenCalledTimes(1);

    await userEvent.click(outside);
    expect(onOpenChange).toHaveBeenCalledTimes(2);
  });

  it('returns focus to the surface when loading removes the focused content', async () => {
    function Example() {
      const [loading, setLoading] = useState(false);
      return (
        <Popover
          defaultOpen
          loading={loading}
          title="Details"
          trigger="Open details"
        >
          <Button onAction={() => setLoading(true)}>Load details</Button>
        </Popover>
      );
    }

    renderBreeze(<Example />);
    const surface = await screen.findByRole('dialog', { name: 'Details' });
    await waitFor(() => expect(surface).toHaveFocus());
    await new Promise((resolve) => {
      setTimeout(resolve, 550);
    });
    await userEvent.click(
      within(surface).getByRole('button', { name: 'Load details' }),
    );
    await waitFor(() => expect(surface).toHaveFocus());

    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(
        screen.queryByRole('dialog', { name: 'Details' }),
      ).not.toBeInTheDocument(),
    );
  });

  it('tracks focus when its portal belongs to another document', async () => {
    const iframe = document.createElement('iframe');
    document.body.append(iframe);
    const secondaryDocument = iframe.contentDocument;
    if (!secondaryDocument) {
      iframe.remove();
      throw new Error('Expected the iframe to have a document');
    }
    const portalContainer = secondaryDocument.createElement('section');
    secondaryDocument.body.append(portalContainer);

    function Example() {
      const [loading, setLoading] = useState(false);
      return (
        <Popover
          defaultOpen
          loading={loading}
          title="Details"
          trigger="Open details"
        >
          <Button onAction={() => setLoading(true)}>Load details</Button>
        </Popover>
      );
    }

    render(
      <BreezeProvider locale="en-GB" portalContainer={portalContainer}>
        <Example />
      </BreezeProvider>,
    );
    const surface = await waitFor(() => {
      const element = within(portalContainer).queryByRole('dialog', {
        name: 'Details',
      });
      expect(element).toBeTruthy();
      return element as HTMLElement;
    });
    await waitFor(() => expect(secondaryDocument.activeElement).toBe(surface));

    await new Promise((resolve) => {
      setTimeout(resolve, 550);
    });
    const loadButton = within(surface).getByRole('button', {
      name: 'Load details',
    });
    loadButton.focus();
    expect(secondaryDocument.activeElement).toBe(loadButton);
    await userEvent.setup({ document: secondaryDocument }).click(loadButton);
    await waitFor(() => expect(secondaryDocument.activeElement).toBe(surface));
    iframe.remove();
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
  it('leaves the sheet interactive and accessible while the non-modal popover is open', async () => {
    const onAction = vi.fn();
    renderBreeze(
      <Drawer defaultOpen title="Sheet" trigger="Open sheet">
        <Button onAction={onAction}>Sheet action</Button>
        <Popover title="Dates" trigger="Open dates">
          Choose a date.
        </Popover>
      </Drawer>,
    );
    const sheet = screen.getByRole('dialog', { name: 'Sheet' });
    await userEvent.click(screen.getByRole('button', { name: 'Open dates' }));
    const popover = screen.getByRole('dialog', { name: 'Dates' });
    expect(popover).not.toHaveAttribute('aria-modal', 'true');
    expect(sheet.closest('[data-breeze-overlay]')).not.toHaveAttribute('inert');
    expect(screen.getByRole('dialog', { name: 'Sheet' })).toBe(sheet);
    await userEvent.click(screen.getByRole('button', { name: 'Sheet action' }));
    expect(onAction).toHaveBeenCalledOnce();
    expect(sheet).toBeInTheDocument();
  });

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
