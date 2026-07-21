import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { WarningIcon } from '../../icons';
import { Button as Trigger } from '../Button/Button';
import { Content, IconTrigger, Root, Tooltip } from './Tooltip';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(Tooltip.Content, { displayName: 'Tooltip.Content' });
      Object.assign(Tooltip.IconTrigger, {
        displayName: 'Tooltip.IconTrigger',
      });
      Object.assign(Tooltip.Root, { displayName: 'Tooltip.Root' });
      Object.assign(Tooltip.Trigger, { displayName: 'Tooltip.Trigger' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Content,
    IconTrigger,
    Trigger,
  },
  title: 'Primitives/Overlays/Tooltip',
} satisfies Meta<typeof Root>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Attaches concise non-essential context to a visible action so the standard
 * focus, hover, touch, Escape, and dismissal behavior can be exercised.
 *
 * @summary zero-delay tooltip for a visible action trigger
 */
export const KeyboardHoverAndTouch: Story = {
  args: {
    children: (
      <>
        <Tooltip.Trigger appearance="outline">Focus or hover</Tooltip.Trigger>
        <Tooltip.Content>
          Additional context without essential information
        </Tooltip.Content>
      </>
    ),
    delay: 0,
  },
};
/**
 * Requests right-edge placement for descriptive content while retaining React
 * Aria collision handling and direction-aware positioning.
 *
 * @summary direction-aware tooltip with preferred right placement
 */
export const Placements: Story = {
  args: {
    children: (
      <>
        <Tooltip.Trigger>Inline-end placement</Tooltip.Trigger>
        <Tooltip.Content placement="right">
          Placement follows React Aria direction and collision handling
        </Tooltip.Content>
      </>
    ),
    delay: 0,
  },
};
/**
 * Holds the tooltip immutably open to document its trigger relationship and
 * descriptive content without allowing interaction to change open state.
 *
 * @summary persistently open read-only tooltip state
 */
export const ReadOnlyOpen: Story = {
  args: {
    children: (
      <>
        <Tooltip.Trigger>Persistent tooltip</Tooltip.Trigger>
        <Tooltip.Content>A controlled read-only tooltip</Tooltip.Content>
      </>
    ),
    open: true,
    readOnly: true,
  },
};
/**
 * Gives a focusable warning icon its own accessible name, opens matching danger
 * content from the keyboard, and verifies the compact visual treatment.
 *
 * @summary named semantic icon trigger with danger tooltip
 */
export const SemanticIconTrigger: Story = {
  args: {
    children: (
      <>
        <Tooltip.IconTrigger aria-label="Warning information" variant="danger">
          <WarningIcon />
        </Tooltip.IconTrigger>
        <Tooltip.Content variant="danger">
          This item requires attention
        </Tooltip.Content>
      </>
    ),
    delay: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const documentScope = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('img', {
      name: 'Warning information',
    });

    const triggerBounds = trigger.getBoundingClientRect();

    await expect(triggerBounds.width).toBe(triggerBounds.height);
    await expect(triggerBounds.width).toBeGreaterThan(0);
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    const tooltip = await documentScope.findByRole('tooltip');

    await waitFor(() => expect(tooltip).toBeVisible());
    const style = tooltip.ownerDocument.defaultView?.getComputedStyle(tooltip);

    await expect(style?.fontSize).toBe('14px');
    await expect(style?.fontWeight).toBe('400');
    await expect(style?.paddingTop).toBe('6px');
    await expect(style?.paddingBottom).toBe(style?.paddingTop);
  },
};
