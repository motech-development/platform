import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { ConfirmationDialog } from './ConfirmationDialog';

const meta = {
  component: ConfirmationDialog,
  title: 'Patterns/Actions/ConfirmationDialog',
} satisfies Meta<typeof ConfirmationDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Opens an uncontrolled destructive confirmation, activates the explicit
 * confirming action, and verifies the application-owned callback is invoked
 * once.
 *
 * @summary uncontrolled destructive decision and confirmation
 */
export const Destructive: Story = {
  args: {
    cancelLabel: 'Cancel',
    closeLabel: 'Close confirmation',
    confirmLabel: 'Delete item',
    description: 'The item and its linked files will be permanently removed.',
    onConfirm: fn(),
    title: 'Delete this item?',
    trigger: 'Delete item',
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Delete item' }));
    const dialog = within(document.body).getByRole('alertdialog');

    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Delete item' }),
    );
    await expect(args.onConfirm).toHaveBeenCalledOnce();
  },
};

/**
 * Presents an application-controlled warning decision already open, with the
 * parent responsible for accepting every subsequent open-state request.
 *
 * @summary controlled open warning confirmation
 */
export const ControlledOpen: Story = {
  args: {
    cancelLabel: 'Keep item',
    closeLabel: 'Close confirmation',
    confirmLabel: 'Archive item',
    description: 'The item can be restored later.',
    onConfirm: fn(),
    onOpenChange: fn(),
    open: true,
    title: 'Archive this item?',
    trigger: 'Archive item',
    variant: 'warning',
  },
};

/**
 * Keeps a destructive confirmation immutably open to document its complete
 * alert-dialog anatomy, initial cancel focus, typography, icon, and action
 * styling.
 *
 * @summary read-only open destructive confirmation anatomy
 */
export const DestructiveOpen: Story = {
  args: {
    cancelLabel: 'Cancel',
    closeLabel: 'Close confirmation',
    confirmLabel: 'Delete configuration',
    description:
      'The legacy configuration and its linked file will be permanently removed.',
    onConfirm: fn(),
    open: true,
    readOnly: true,
    title: 'Delete configuration?',
    trigger: 'Delete configuration',
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const dialog = body.getByRole('alertdialog', {
      name: 'Delete configuration?',
    });
    const heading = body.getByRole('heading', {
      name: 'Delete configuration?',
    });
    const header = heading.parentElement?.parentElement;
    const icon = dialog.querySelector<HTMLElement>('[data-confirmation-icon]');
    const description = body.getByText(
      'The legacy configuration and its linked file will be permanently removed.',
    );
    const actions = body.getByRole('group');
    const cancel = body.getByRole('button', { name: 'Cancel' });
    const close = body.getByRole('button', { name: 'Close confirmation' });
    const warningIcon = icon?.querySelector('.lucide-triangle-alert');
    const view = canvasElement.ownerDocument.defaultView;
    const cancelStyle = view?.getComputedStyle(cancel);
    const dialogStyle = view?.getComputedStyle(dialog);
    const closeStyle = view?.getComputedStyle(close);
    const titleStyle = view?.getComputedStyle(heading);

    await expect(dialog.getBoundingClientRect().width).toBeLessThanOrEqual(
      canvasElement.getBoundingClientRect().width,
    );
    await expect(dialogStyle?.borderTopWidth).toBe('0px');
    await expect(dialogStyle?.borderRightWidth).toBe('0px');
    await expect(dialogStyle?.borderBottomWidth).toBe('2px');
    await expect(dialogStyle?.borderLeftWidth).toBe('0px');
    await expect(dialogStyle?.padding).toBe('0px');
    await expect(dialogStyle?.boxShadow).toContain(
      'rgba(6, 12, 24, 0.22) 0px 8px 0px 0px',
    );
    await expect(header?.getBoundingClientRect().height).toBeGreaterThan(0);
    await expect(icon?.getBoundingClientRect().width).toBe(
      icon?.getBoundingClientRect().height,
    );
    await expect(
      view?.getComputedStyle(icon as HTMLElement).borderTopWidth,
    ).toBe('0px');
    await expect(warningIcon).toBeInTheDocument();
    await expect(titleStyle?.fontFamily).toContain('Cabin');
    await expect(titleStyle?.fontSize).toBe('24px');
    await expect(Number.parseFloat(titleStyle?.lineHeight ?? '0')).toBeCloseTo(
      28.8,
      4,
    );
    await expect(view?.getComputedStyle(description).fontSize).toBe('16px');
    await expect(view?.getComputedStyle(actions).gap).toBe('10px');
    await expect(closeStyle?.borderTopWidth).toBe('0px');
    await expect(closeStyle?.borderRightWidth).toBe('0px');
    await expect(closeStyle?.borderBottomWidth).toBe('0px');
    await expect(closeStyle?.borderLeftWidth).toBe('0px');
    await expect(cancelStyle?.color).toBe('rgb(24, 32, 51)');
    await expect(cancelStyle?.borderColor).toBe('rgb(189, 197, 210)');
    await expect(cancel).toHaveFocus();
  },
};

/**
 * Exercises the destructive confirmation at the canonical compact viewport,
 * where actions stack in a safe visual order and remain within the modal
 * surface.
 *
 * @summary compact stacked destructive confirmation actions
 */
export const DestructiveCompact: Story = {
  ...DestructiveOpen,
  globals: { viewport: { value: 'mobile1' } },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const dialog = body.getByRole('alertdialog', {
      name: 'Delete configuration?',
    });
    const heading = body.getByRole('heading', {
      name: 'Delete configuration?',
    });
    const header = heading.parentElement?.parentElement;
    const actions = body.getByRole('group');
    const actionButtons = within(actions).getAllByRole('button');
    const view = canvasElement.ownerDocument.defaultView;

    await expect(dialog.getBoundingClientRect().width).toBeLessThanOrEqual(
      canvasElement.getBoundingClientRect().width,
    );
    await expect(header?.getBoundingClientRect().height).toBeGreaterThan(0);
    await expect(view?.getComputedStyle(actions).flexDirection).toBe(
      'column-reverse',
    );
    await expect(actionButtons[1].getBoundingClientRect().top).toBeLessThan(
      actionButtons[0].getBoundingClientRect().top,
    );
    await Promise.all(
      actionButtons.map((button) =>
        expect(button.getBoundingClientRect().width).toBeLessThanOrEqual(
          dialog.getBoundingClientRect().width,
        ),
      ),
    );
    await expect(body.getByRole('button', { name: 'Cancel' })).toHaveFocus();
  },
};
