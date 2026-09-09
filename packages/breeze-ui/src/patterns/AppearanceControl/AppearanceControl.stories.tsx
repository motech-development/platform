import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import AppearanceControl from './AppearanceControl';

const meta = {
  component: AppearanceControl,
  title: 'Patterns/AppearanceControl',
} satisfies Meta<typeof AppearanceControl>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Light, automatic and dark choices backed by BreezeProvider. */
export const Default: Story = {};

/** The panel shadow follows the resolved appearance through its CSS variable. */
export const ThemeReactiveShadow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const shadow = canvas.getByTestId('theme-reactive-shadow');

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
      <div
        className="breeze-story-shadow-panel"
        data-testid="theme-reactive-shadow"
      >
        Theme-reactive panel shadow
      </div>
    </div>
  ),
};
