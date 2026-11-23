import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { Button } from '../Button/Button';
import { Skeleton } from '../Skeleton/Skeleton';
import { Drawer, type DrawerProps } from './Drawer';

expectTypeOf<DrawerProps>().not.toHaveProperty('className');
expectTypeOf<DrawerProps>().not.toHaveProperty('style');
expectTypeOf<DrawerProps>().not.toHaveProperty('slot');
expectTypeOf<DrawerProps>().not.toHaveProperty('loading');
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
expectTypeOf<{
  children: string;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>().toExtend<DrawerProps>();
expectTypeOf<{
  children: string;
  title: string;
}>().not.toExtend<DrawerProps>();
expectTypeOf<{
  children: string;
  title: string;
  defaultOpen: boolean;
}>().not.toExtend<DrawerProps>();
expectTypeOf<{
  children: string;
  title: string;
  open: boolean;
}>().not.toExtend<DrawerProps>();

function StateOpenedDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onAction={() => setOpen(true)}>Record transaction</Button>
      <Drawer onOpenChange={setOpen} open={open} title="New transaction">
        Transaction fields
      </Drawer>
    </>
  );
}

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

  it('opens from application state without rendering a trigger and returns focus to the opener', async () => {
    const { container } = renderBreeze(<StateOpenedDrawer />);
    const opener = screen.getByRole('button', { name: 'Record transaction' });

    await userEvent.click(opener);

    const surface = screen.getByRole('dialog', { name: 'New transaction' });
    await waitFor(() =>
      expect(surface.contains(document.activeElement)).toBe(true),
    );
    expect(within(container).getAllByRole('button', { hidden: true })).toEqual([
      opener,
    ]);

    await userEvent.click(
      within(surface).getByRole('button', { name: 'Close' }),
    );

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(opener).toHaveFocus());
  });

  it.each([
    [
      'Escape',
      async () => {
        await userEvent.keyboard('{Escape}');
      },
    ],
    [
      'a backdrop press',
      async (surface: HTMLElement) => {
        const backdrop = surface.closest('[data-breeze-overlay]');
        if (!backdrop) throw new Error('Missing drawer backdrop.');
        await userEvent.click(backdrop);
      },
    ],
    [
      'the close button',
      async (surface: HTMLElement) => {
        await userEvent.click(
          within(surface).getByRole('button', { name: 'Close' }),
        );
      },
    ],
  ])(
    'asks the application to close on %s and stays open while it refuses',
    async (_, dismiss) => {
      const onOpenChange = vi.fn();
      renderBreeze(
        <Drawer onOpenChange={onOpenChange} open title="New transaction">
          Transaction fields
        </Drawer>,
      );
      const surface = screen.getByRole('dialog', { name: 'New transaction' });

      await dismiss(surface);

      expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
      expect(
        screen.getByRole('dialog', { name: 'New transaction' }),
      ).toBeInTheDocument();
    },
  );

  it('returns focus to the main landmark when the opener has gone', async () => {
    function RemovedOpener() {
      const [open, setOpen] = useState(false);
      const [deleted, setDeleted] = useState(false);

      return (
        <main tabIndex={-1}>
          {deleted ? null : (
            <Button onAction={() => setOpen(true)}>Northwind Supplies</Button>
          )}
          <Drawer onOpenChange={setOpen} open={open} title="Transaction">
            <Button
              onAction={() => {
                setDeleted(true);
                setOpen(false);
              }}
            >
              Delete
            </Button>
          </Drawer>
        </main>
      );
    }

    renderBreeze(<RemovedOpener />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Northwind Supplies' }),
    );
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(screen.getByRole('main')).toHaveFocus());
  });

  it('returns focus to the main landmark when it opened with nothing focused', async () => {
    function DeepLinkedDrawer() {
      const [open, setOpen] = useState(true);

      return (
        <main tabIndex={-1}>
          <Drawer onOpenChange={setOpen} open={open} title="Transaction">
            Transaction fields
          </Drawer>
        </main>
      );
    }

    renderBreeze(<DeepLinkedDrawer />);
    await screen.findByRole('dialog', { name: 'Transaction' });

    await userEvent.keyboard('{Escape}');

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(screen.getByRole('main')).toHaveFocus());
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

  it('renders the footer start action, summary and actions in order after the content', async () => {
    const onCancel = vi.fn();
    renderBreeze(
      <Drawer
        defaultOpen
        footerActions={
          <Button onAction={onCancel} variant="secondary">
            Cancel
          </Button>
        }
        footerStart={<Button variant="danger">Delete</Button>}
        footerSummary="Takes £139.00 off the balance now"
        title="Transaction"
        trigger="Edit"
      >
        Transaction fields
      </Drawer>,
    );
    const surface = screen.getByRole('dialog', { name: 'Transaction' });
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
    const sequence = [
      within(surface).getByText('Transaction fields'),
      within(surface).getByRole('button', { name: 'Delete' }),
      within(surface).getByText('Takes £139.00 off the balance now'),
      within(surface).getByRole('button', { name: 'Cancel' }),
    ];
    sequence.slice(1).forEach((element, index) => {
      expect(sequence[index].compareDocumentPosition(element)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });
    await userEvent.click(
      within(surface).getByRole('button', { name: 'Cancel' }),
    );
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('omits the footer when no footer content is given', () => {
    renderBreeze(
      <Drawer defaultOpen title="Details" trigger="Open details">
        Delivery information
      </Drawer>,
    );
    expect(
      screen.getByRole('dialog', { name: 'Details' }).lastElementChild,
    ).toBe(screen.getByText('Delivery information'));
  });

  it('renders caller-owned loading content and localizes the close action', () => {
    render(
      <BreezeProvider
        locale="fr-FR"
        messages={{ close: 'Fermer', loading: 'Chargement' }}
      >
        <Drawer defaultOpen title="Livraison" trigger="Ouvrir">
          <Skeleton blockSize="6rem" label="Chargement" shape="rectangle" />
        </Drawer>
      </BreezeProvider>,
    );
    expect(
      screen.getByRole('heading', { name: 'Livraison' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('progressbar', { name: 'Chargement' }),
    ).toHaveAttribute('lang', 'fr-FR');
    const close = screen.getByRole('button', { name: 'Fermer' });
    expect(close.closest('[lang]')).toHaveAttribute('lang', 'fr-FR');
    expect(close).toHaveTextContent('');
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
