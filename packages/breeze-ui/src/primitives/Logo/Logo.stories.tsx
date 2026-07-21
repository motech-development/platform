import type { Meta, StoryObj } from '@storybook/react-vite';
import { Inline } from '../Inline/Inline';
import { Surface } from '../Surface/Surface';
import { Logo } from './Logo';

const meta = {
  component: Logo,
  title: 'Foundation/Logo',
} satisfies Meta<typeof Logo>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Compares the small, medium, and large canonical logo scales while retaining
 * one accessible Motech Development image name.
 *
 * @summary canonical logo scales on the default surface
 */
export const Sizes: Story = {
  args: {},
  render: () => (
    <Inline gap="xxl" wrap={false}>
      <Logo size="sm" />
      <Logo />
      <Logo size="lg" />
    </Inline>
  ),
};
/**
 * Places the canonical mark on the shell surface to verify the brand token
 * remains legible when applications compose it into dark navigation chrome.
 *
 * @summary canonical logo treatment on a dark shell surface
 */
export const OnDarkSurface: Story = {
  args: {},
  decorators: [
    (Story) => (
      <Surface border="none" padding="xl" tone="inverse">
        <Story />
      </Surface>
    ),
  ],
};
