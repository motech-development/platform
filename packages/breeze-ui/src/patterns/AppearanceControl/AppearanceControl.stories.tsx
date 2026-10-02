import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Card } from '../../primitives/Card/Card';
import AppearanceControl from './AppearanceControl';

const meta = {
  component: AppearanceControl,
  title: 'Patterns/AppearanceControl',
} satisfies Meta<typeof AppearanceControl>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Light, automatic and dark choices backed by BreezeProvider. */
export const Default: Story = {};

/** The shipped panel shadow utility follows the resolved appearance. */
export const ThemeReactiveShadow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const shadow = canvas.getByRole('group', { name: 'Theme-reactive panel' });

    await userEvent.click(canvas.getByRole('radio', { name: 'Light' }));
    const lightShadow = getComputedStyle(shadow).boxShadow;

    await userEvent.click(canvas.getByRole('radio', { name: 'Dark' }));

    await expect(getComputedStyle(shadow).boxShadow).not.toBe(lightShadow);
    await expect(document.documentElement).toHaveAttribute(
      'data-theme',
      'dark',
    );
  },
  render: () => (
    <div className="breeze-story-stack">
      <AppearanceControl />
      <Card aria-label="Theme-reactive panel">Theme-reactive panel shadow</Card>
    </div>
  ),
};
