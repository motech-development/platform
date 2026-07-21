import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { InfoIcon } from '../../icons';
import { Stack } from '../Stack/Stack';
import { Alert } from './Alert';

const meta = {
  component: Alert,
  title: 'Feedback/Alert',
} satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Uses the default assertive announcement with danger styling for an urgent
 * failure that must be announced as soon as it is inserted.
 *
 * @summary Urgent assertive failure feedback.
 */
export const Assertive: Story = {
  args: {
    children: 'Request could not be completed.',
    variant: 'danger',
  },
};
/**
 * Sets `announcement="polite"` for a successful save update that should wait
 * for the screen reader’s current speech rather than interrupting it.
 *
 * @summary Non-interrupting polite success feedback.
 */
export const Polite: Story = {
  args: {
    announcement: 'polite',
    children: 'Your changes were saved.',
    variant: 'success',
  },
};
async function expectInformationNotice(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const notice = canvas.getByTestId('information-notice');
  const icon = notice.querySelector('svg');
  const noticeBounds = notice.getBoundingClientRect();
  const style =
    canvasElement.ownerDocument.defaultView?.getComputedStyle(notice);

  await expect(notice).not.toHaveAttribute('role');
  await expect(notice).toHaveAttribute('aria-live', 'off');
  await expect(noticeBounds.height).toBeGreaterThan(0);
  await expect(notice.scrollHeight).toBeLessThanOrEqual(notice.clientHeight);
  await expect(notice.scrollWidth).toBeLessThanOrEqual(notice.clientWidth);
  await expect(style?.alignItems).toBe('center');
  await expect(style?.backgroundColor).toBe('rgb(227, 243, 250)');
  await expect(style?.borderTopColor).toBe('rgb(77, 145, 176)');
  await expect(style?.borderTopWidth).toBe('1px');
  await expect(style?.borderRightWidth).toBe('1px');
  await expect(style?.borderBottomWidth).toBe('1px');
  await expect(style?.borderLeftWidth).toBe('1px');
  await expect(style?.color).toBe('rgb(0, 73, 102)');
  await expect(style?.display).toBe('flex');
  await expect(style?.fontSize).toBe('16px');
  await expect(icon?.getBoundingClientRect().height).toBe(16);
  await expect(icon?.getBoundingClientRect().width).toBe(16);
}

/**
 * Combines an informational icon with `announcement="off"` for guidance
 * already present on page load, while testing the canonical bordered notice
 * treatment and single-line icon alignment.
 *
 * @summary Persistent informational guidance without a live-region announcement.
 */
export const InformationNotice: Story = {
  args: {
    announcement: 'off',
    children: 'Reports are automatically deleted after 24 hours.',
    variant: 'info',
  },
  play: async ({ canvasElement }) => expectInformationNotice(canvasElement),
  render: ({ announcement, children, variant }) => (
    <Alert
      announcement={announcement}
      data-testid="information-notice"
      variant={variant}
    >
      <InfoIcon />
      {children}
    </Alert>
  ),
};
/**
 * Renders the same non-live informational notice at the standard compact
 * viewport to verify the icon, text, border, and overflow behaviour remain
 * intact on a narrow screen.
 *
 * @summary Compact viewport treatment for an informational notice.
 */
export const InformationNoticeCompact: Story = {
  ...InformationNotice,
  globals: { viewport: { value: 'mobile1' } },
  play: async ({ canvasElement }) => expectInformationNotice(canvasElement),
};
/**
 * Displays every semantic alert variant with announcements disabled, making
 * this the visual reference for choosing meaning-driven colour without
 * producing eight duplicate live-region messages.
 *
 * @summary Visual comparison of all semantic alert variants.
 */
export const Variants: Story = {
  args: { children: 'Alert' },
  render: () => (
    <Stack gap="compact">
      <Alert announcement="off" variant="primary">
        Primary application feedback
      </Alert>
      <Alert announcement="off" variant="secondary">
        Secondary application feedback
      </Alert>
      <Alert announcement="off" variant="success">
        Success application feedback
      </Alert>
      <Alert announcement="off" variant="danger">
        Danger application feedback
      </Alert>
      <Alert announcement="off" variant="warning">
        Warning application feedback
      </Alert>
      <Alert announcement="off" variant="info">
        Information application feedback
      </Alert>
      <Alert announcement="off" variant="light">
        Light application feedback
      </Alert>
      <Alert announcement="off" variant="dark">
        Dark application feedback
      </Alert>
    </Stack>
  ),
};
/**
 * Places an informational alert in an explicit right-to-left container while
 * keeping English copy, verifying direction-aware alignment without coupling
 * direction to translated example content.
 *
 * @summary Right-to-left alert layout with English content.
 */
export const RightToLeft: Story = {
  args: { children: 'Alert' },
  render: () => (
    <div dir="rtl">
      <Alert announcement="off" variant="info">
        Your changes were saved.
      </Alert>
    </div>
  ),
};
