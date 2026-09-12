import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../test/render';
import { Button } from '../primitives/Button/Button';
import { Drawer } from '../primitives/Drawer/Drawer';
import { Popover } from '../primitives/Popover/Popover';
import { ParentOverlayContext } from './OverlayStack';
import OverlaySurface from './OverlaySurface';

describe('Overlay stack', () => {
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

  it('keeps the sheet mounted and its scrim owned while fullscreen is active', async () => {
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
    expect(sheet.closest('[data-breeze-overlay]')).toHaveAttribute('inert');
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
