import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Button } from '../../primitives/Button/Button';
import { TextField } from '../../primitives/TextField/TextField';
import { FormSection } from './FormSection';

const meta = {
  component: FormSection,
  title: 'Patterns/Forms/FormSection',
} satisfies Meta<typeof FormSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Composes a persistent section heading and description with a related action
 * and an accessible field in the default responsive split arrangement.
 *
 * @summary split form section with introduction and related action
 */
export const WithAction: Story = {
  args: {
    action: <Button appearance="text">Add field</Button>,
    children: (
      <TextField.Root defaultValue="team@example.com">
        <TextField.Label>Email address</TextField.Label>
        <TextField.Input type="email" />
      </TextField.Root>
    ),
    description: 'Information used for workspace notifications.',
    title: 'Notification details',
  },
};

/**
 * Uses the stacked arrangement, nested heading level, and outer divider suited
 * to constrained overlay forms and vertically sequenced sections.
 *
 * @summary stacked divided form section with nested heading
 */
export const StackedAndDivided: Story = {
  args: {
    children: (
      <TextField.Root defaultValue="team@example.com">
        <TextField.Label>Email address</TextField.Label>
        <TextField.Input type="email" />
      </TextField.Root>
    ),
    description: 'Information used for workspace notifications.',
    divided: true,
    headingLevel: 3,
    layout: 'stacked',
    title: 'Notification details',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const section = canvas.getByRole('region', {
      name: 'Notification details',
    });
    const heading = canvas.getByRole('heading', {
      level: 3,
      name: 'Notification details',
    });
    const header = heading.parentElement;
    const description = canvas.getByText(
      'Information used for workspace notifications.',
    );

    await expect(header).not.toBeNull();
    await expect(getComputedStyle(header!).rowGap).toBe('4px');
    await expect(getComputedStyle(header!).paddingBottom).toBe('24px');
    await expect(getComputedStyle(heading).lineHeight).toBe('24px');
    await expect(getComputedStyle(description).lineHeight).toBe('22.4px');
    await expect(section).toBeVisible();
  },
};
