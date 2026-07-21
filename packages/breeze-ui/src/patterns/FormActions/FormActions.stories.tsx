import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import { Button } from '../../primitives/Button/Button';
import { Stack } from '../../primitives/Stack/Stack';
import { Typography } from '../../primitives/Typography/Typography';
import { FormActions } from './FormActions';

const meta = {
  component: FormActions,
  title: 'Patterns/Forms/FormActions',
} satisfies Meta<typeof FormActions>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Separates destructive and supporting actions from the primary action while
 * retaining a named group and canonical minimum target geometry.
 *
 * @summary complete named form action set with canonical ordering
 */
export const CompleteSet: Story = {
  args: {
    'aria-label': 'Form actions',
    back: <Button appearance="outline">Back</Button>,
    cancel: <Button appearance="outline">Cancel</Button>,
    danger: <Button variant="danger">Delete item</Button>,
    primary: <Button>Save changes</Button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const actions = canvas.getByRole('group', { name: 'Form actions' });
    const style = getComputedStyle(actions);

    await expect(actions.getBoundingClientRect().height).toBeGreaterThanOrEqual(
      44,
    );
    await expect(style.gap).toBe('10px');
    await expect(style.paddingTop).toBe('2px');
  },
};

/**
 * Adds the canonical separator and page-form spacing when the action region
 * needs a stronger boundary from the preceding fields.
 *
 * @summary divided form actions with cancel and primary controls
 */
export const Divided: Story = {
  args: {
    cancel: <Button appearance="outline">Cancel</Button>,
    divided: true,
    primary: <Button>Save changes</Button>,
  },
};

/**
 * Uses the pattern's automatic top margin to anchor the primary action at the
 * bottom of a full-height form without application-owned positioning CSS.
 *
 * @summary primary action anchored in a full-height form
 */
export const AnchoredInFullHeightForm: Story = {
  args: {
    primary: <Button>Save changes</Button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const form = canvas.getByTestId('full-height-form');
    const actions = form.lastElementChild as HTMLElement;

    await expect(
      Math.abs(
        form.getBoundingClientRect().bottom -
          actions.getBoundingClientRect().bottom,
      ),
    ).toBeLessThan(1);
  },
  render: ({ primary }) => (
    <StoryConstraint size="full-height">
      <Stack data-testid="full-height-form" gap="lg">
        <Typography>Form content</Typography>
        <FormActions primary={primary} />
      </Stack>
    </StoryConstraint>
  ),
};
