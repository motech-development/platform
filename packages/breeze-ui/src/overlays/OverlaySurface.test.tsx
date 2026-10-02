import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect, useLayoutEffect, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../test/render';
import { Button } from '../primitives/Button/Button';
import { Drawer } from '../primitives/Drawer/Drawer';
import { Popover } from '../primitives/Popover/Popover';
import { ParentOverlayContext } from './OverlayStack';
import OverlaySurface from './OverlaySurface';

describe('Overlay stack', () => {
  it('mounts a top-level open surface before passive effects', async () => {
    let mountedDuringLayout = false;
    function Example() {
      const [open, setOpen] = useState(false);
      useEffect(() => setOpen(true), []);
      useLayoutEffect(() => {
        if (open) {
          mountedDuringLayout =
            document.querySelector('[data-breeze-overlay="drawer"]') !== null;
        }
      }, [open]);
      return (
        <Drawer
          key={open ? 'open' : 'closed'}
          onOpenChange={() => {}}
          open={open}
          title="Sheet"
          trigger="Open sheet"
        >
          Sheet content
        </Drawer>
      );
    }

    renderBreeze(<Example />);

    await waitFor(() => expect(mountedDuringLayout).toBe(true));
  });

  it('updates layer kind metadata without changing its stack position', async () => {
    let changeKind: (kind: 'popover' | 'dialog') => void = () => {};
    function Example() {
      const [kind, setKind] = useState<'popover' | 'dialog'>('popover');
      changeKind = (nextKind) => setKind(nextKind);
      return (
        <Drawer defaultOpen title="Sheet" trigger="Open sheet">
          <OverlaySurface
            defaultOpen
            kind={kind}
            title="Upper surface"
            trigger="Open upper"
          >
            Upper content
          </OverlaySurface>
        </Drawer>
      );
    }

    renderBreeze(<Example />);
    const sheet = screen.getByRole('dialog', { name: 'Sheet' });
    const sheetLayer = sheet.closest('[data-breeze-overlay]');
    expect(
      screen.getByRole('dialog', { name: 'Upper surface' }),
    ).toBeInTheDocument();
    expect(sheetLayer).not.toHaveAttribute('inert');

    act(() => changeKind('dialog'));
    await waitFor(() => {
      expect(
        screen.getByRole('dialog', { name: 'Upper surface' }),
      ).toBeInTheDocument();
      expect(sheetLayer).toHaveAttribute('inert');
    });
    const upperLayer = screen
      .getByRole('dialog', { name: 'Upper surface' })
      .closest('[data-breeze-overlay]');
    expect(upperLayer).toHaveAttribute('data-breeze-overlay', 'dialog');
    expect(upperLayer).toHaveAttribute('data-breeze-scrim', 'true');
  });

  it('leaves the sheet mounted, reachable and owning its scrim under fullscreen', async () => {
    renderBreeze(
      <Drawer title="Sheet" trigger="Open sheet">
        <OverlaySurface kind="fullscreen" title="Viewer" trigger="Open viewer">
          Fullscreen content
        </OverlaySurface>
      </Drawer>,
    );
    const pageTrigger = screen.getByRole('button', { name: 'Open sheet' });
    await userEvent.click(pageTrigger);
    const sheet = screen.getByRole('dialog', { name: 'Sheet' });
    const trigger = within(sheet).getByRole('button', { name: 'Open viewer' });
    await userEvent.click(trigger);
    const viewer = screen.getByRole('dialog', { name: 'Viewer' });
    expect(viewer).not.toHaveAttribute('aria-modal', 'true');
    expect(sheet).toBeInTheDocument();
    fireEvent.scroll(sheet);
    expect(screen.getByRole('dialog', { name: 'Viewer' })).toBe(viewer);
    // The non-modal trade-off recorded in ADR 0002: the covered sheet stays
    // reachable by keyboard and assistive technology.
    expect(sheet.closest('[data-breeze-overlay]')).not.toHaveAttribute('inert');
    expect(screen.getByRole('dialog', { name: 'Sheet' })).toBe(sheet);
    expect(sheet.closest('[data-breeze-overlay]')).toHaveAttribute(
      'data-breeze-scrim',
      'true',
    );
    expect(viewer.closest('[data-breeze-overlay]')).not.toHaveAttribute(
      'data-breeze-scrim',
      'true',
    );
    expect(
      document.querySelectorAll('[data-breeze-scrim="true"]'),
    ).toHaveLength(1);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(
      screen.queryByRole('dialog', { name: 'Viewer' }),
    ).not.toBeInTheDocument();
    expect(sheet.closest('[data-breeze-overlay]')).not.toHaveAttribute('inert');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(pageTrigger).toHaveFocus());
  });

  it('focuses an initially nested fullscreen surface and returns into the sheet', async () => {
    renderBreeze(
      <Drawer defaultOpen title="Sheet" trigger="Open sheet">
        <OverlaySurface
          defaultOpen
          kind="fullscreen"
          title="Viewer"
          trigger="Open viewer"
        >
          Fullscreen content
        </OverlaySurface>
      </Drawer>,
    );
    const viewer = await screen.findByRole('dialog', { name: 'Viewer' });
    await waitFor(() => expect(viewer).toHaveFocus());
    const sheet = screen.getByRole('dialog', { name: 'Sheet' });
    expect(sheet.closest('[data-breeze-overlay]')).not.toHaveAttribute('inert');

    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(
        screen.queryByRole('dialog', { name: 'Viewer' }),
      ).not.toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(sheet.contains(document.activeElement)).toBe(true),
    );
  });

  it('returns a trigger-less controlled fullscreen surface to its opener in the sheet', async () => {
    function Example() {
      const [viewerOpen, setViewerOpen] = useState(false);
      return (
        <Drawer defaultOpen title="Sheet" trigger="Open sheet">
          <Button onAction={() => setViewerOpen(true)}>View receipt</Button>
          <OverlaySurface
            kind="fullscreen"
            onOpenChange={setViewerOpen}
            open={viewerOpen}
            showHeader={false}
            title="Receipt"
          >
            Receipt content
          </OverlaySurface>
        </Drawer>
      );
    }

    renderBreeze(<Example />);
    const sheet = screen.getByRole('dialog', { name: 'Sheet' });
    const sheetLayer = sheet.closest('[data-breeze-overlay]');
    const opener = within(sheet).getByRole('button', { name: 'View receipt' });
    await userEvent.click(opener);
    const viewer = screen.getByRole('dialog', { name: 'Receipt' });
    await waitFor(() => expect(viewer).toHaveFocus());
    expect(sheetLayer).not.toHaveAttribute('inert');
    expect(sheetLayer).toHaveAttribute('data-breeze-scrim', 'true');
    expect(sheetLayer).toHaveAttribute('data-breeze-topmost', 'false');

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(opener).toHaveFocus());
    expect(
      screen.queryByRole('dialog', { name: 'Receipt' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Sheet' })).toBe(sheet);
    expect(sheetLayer).toHaveAttribute('data-breeze-scrim', 'true');
    expect(sheetLayer).toHaveAttribute('data-breeze-topmost', 'true');
  });

  it.each(['popover', 'fullscreen'] as const)(
    'closes a %s descendant when the sheet closes first',
    async (kind) => {
      const innerChange = vi.fn();
      function Example() {
        const [open, setOpen] = useState(false);
        const [innerOpen, setInnerOpen] = useState(false);
        return (
          <Drawer
            open={open}
            onOpenChange={setOpen}
            title="Sheet"
            trigger="Open sheet"
          >
            <OverlaySurface
              kind={kind}
              open={innerOpen}
              onOpenChange={(nextOpen) => {
                innerChange(nextOpen);
                setInnerOpen(nextOpen);
              }}
              title="Upper surface"
              trigger="Open upper"
            >
              <Button onAction={() => setOpen(false)}>Close sheet first</Button>
            </OverlaySurface>
          </Drawer>
        );
      }
      renderBreeze(<Example />);
      const trigger = screen.getByRole('button', { name: 'Open sheet' });
      await userEvent.click(trigger);
      await userEvent.click(screen.getByRole('button', { name: 'Open upper' }));
      await userEvent.click(
        screen.getByRole('button', { name: 'Close sheet first' }),
      );
      await waitFor(() =>
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
      );
      await waitFor(() => expect(trigger).toHaveFocus());
      expect(innerChange).toHaveBeenLastCalledWith(false);
      expect(
        document.querySelector('[data-breeze-scrim="true"]'),
      ).not.toBeInTheDocument();
      await userEvent.click(trigger);
      expect(screen.getByRole('dialog', { name: 'Sheet' })).toBeInTheDocument();
      expect(
        screen.queryByRole('dialog', { name: 'Upper surface' }),
      ).not.toBeInTheDocument();
    },
  );

  it('reports one forced close when a controlled parent closes', async () => {
    let closeParent = () => {};
    let reopenParent = () => {};
    function Example() {
      const [open, setOpen] = useState(true);
      const [closeRequests, setCloseRequests] = useState(0);
      closeParent = () => setOpen(false);
      reopenParent = () => setOpen(true);
      return (
        <>
          <Drawer
            open={open}
            onOpenChange={setOpen}
            title="Sheet"
            trigger="Open sheet"
          >
            <OverlaySurface
              kind="popover"
              onOpenChange={(nextOpen) => {
                if (!nextOpen) setCloseRequests((count) => count + 1);
              }}
              open
              title="Upper surface"
              trigger="Open upper"
            >
              Upper content
            </OverlaySurface>
          </Drawer>
          <output data-testid="close-requests">{closeRequests}</output>
        </>
      );
    }

    renderBreeze(<Example />);
    expect(
      screen.getByRole('dialog', { name: 'Upper surface' }),
    ).toBeInTheDocument();
    act(closeParent);
    await waitFor(() =>
      expect(screen.getByTestId('close-requests')).toHaveTextContent('1'),
    );
    act(reopenParent);
    await waitFor(() =>
      expect(
        screen.getByRole('dialog', { name: 'Upper surface' }),
      ).toBeInTheDocument(),
    );
    act(closeParent);
    await waitFor(() =>
      expect(screen.getByTestId('close-requests')).toHaveTextContent('2'),
    );
  });

  it('reports an initially requested close once when the parent is closed', async () => {
    function Example() {
      const [closeRequests, setCloseRequests] = useState(0);
      return (
        <>
          <ParentOverlayContext
            value={{ id: 'closed-parent', open: false, restoreFocus: () => {} }}
          >
            <OverlaySurface
              kind="popover"
              onOpenChange={() => setCloseRequests((count) => count + 1)}
              open
              title="Upper surface"
              trigger="Open upper"
            >
              Upper content
            </OverlaySurface>
          </ParentOverlayContext>
          <output data-testid="initial-close-requests">{closeRequests}</output>
        </>
      );
    }

    renderBreeze(<Example />);
    await waitFor(() =>
      expect(screen.getByTestId('initial-close-requests')).toHaveTextContent(
        '1',
      ),
    );
  });

  describe('page scroll lock', () => {
    const pageOverflow = () => document.documentElement.style.overflow;
    let setSheetOpen: (open: boolean) => void = () => {};
    let setViewerOpen: (open: boolean) => void = () => {};
    function Example({ inSheet }: Readonly<{ inSheet: boolean }>) {
      const [sheetOpen, changeSheetOpen] = useState(false);
      const [viewerOpen, changeViewerOpen] = useState(false);
      setSheetOpen = changeSheetOpen;
      setViewerOpen = changeViewerOpen;
      const viewer = (
        <OverlaySurface
          kind="fullscreen"
          onOpenChange={changeViewerOpen}
          open={viewerOpen}
          title="Viewer"
        >
          Fullscreen content
        </OverlaySurface>
      );
      return inSheet ? (
        <Drawer
          onOpenChange={changeSheetOpen}
          open={sheetOpen}
          title="Sheet"
          trigger="Open sheet"
        >
          {viewer}
        </Drawer>
      ) : (
        viewer
      );
    }

    it('locks a plain page while the viewer is open and releases it on close', async () => {
      renderBreeze(<Example inSheet={false} />);
      expect(pageOverflow()).toBe('');

      act(() => setViewerOpen(true));
      await screen.findByRole('dialog', { name: 'Viewer' });
      expect(pageOverflow()).toBe('hidden');

      act(() => setViewerOpen(false));
      await waitFor(() =>
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
      );
      expect(pageOverflow()).toBe('');
    });

    async function openSheetAndViewer() {
      renderBreeze(<Example inSheet />);
      act(() => setSheetOpen(true));
      await screen.findByRole('dialog', { name: 'Sheet' });
      expect(pageOverflow()).toBe('hidden');
      act(() => setViewerOpen(true));
      await screen.findByRole('dialog', { name: 'Viewer' });
      expect(pageOverflow()).toBe('hidden');
    }

    async function closeSheet() {
      act(() => setSheetOpen(false));
      await waitFor(() =>
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
      );
    }

    it('keeps the sheet lock after the viewer closes and releases both after the sheet', async () => {
      await openSheetAndViewer();

      act(() => setViewerOpen(false));
      await waitFor(() =>
        expect(
          screen.queryByRole('dialog', { name: 'Viewer' }),
        ).not.toBeInTheDocument(),
      );
      expect(screen.getByRole('dialog', { name: 'Sheet' })).toBeVisible();
      expect(pageOverflow()).toBe('hidden');

      await closeSheet();
      expect(pageOverflow()).toBe('');
    });

    it('releases both locks when the sheet closes before the viewer', async () => {
      await openSheetAndViewer();

      await closeSheet();
      expect(pageOverflow()).toBe('');
    });
  });

  it('unwinds sheet, fullscreen and popover in reverse order', async () => {
    renderBreeze(
      <Drawer title="Sheet" trigger="Open sheet">
        <OverlaySurface kind="fullscreen" title="Viewer" trigger="Open viewer">
          <Popover title="Actions" trigger="Open actions">
            Choose an action.
          </Popover>
        </OverlaySurface>
      </Drawer>,
    );
    const sheetTrigger = screen.getByRole('button', { name: 'Open sheet' });
    await userEvent.click(sheetTrigger);
    const viewerTrigger = screen.getByRole('button', { name: 'Open viewer' });
    await userEvent.click(viewerTrigger);
    const actionTrigger = screen.getByRole('button', { name: 'Open actions' });
    await userEvent.click(actionTrigger);
    expect(
      screen
        .getByRole('dialog', { name: 'Viewer' })
        .closest('[data-breeze-overlay]'),
    ).not.toHaveAttribute('inert');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(actionTrigger).toHaveFocus());
    expect(
      screen.queryByRole('dialog', { name: 'Actions' }),
    ).not.toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(viewerTrigger).toHaveFocus());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(sheetTrigger).toHaveFocus());
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
