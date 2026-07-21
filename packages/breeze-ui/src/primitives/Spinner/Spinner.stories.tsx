import type { Meta, StoryObj } from '@storybook/react-vite';
import { Inline } from '../Inline/Inline';
import { Typography } from '../Typography/Typography';
import { Spinner } from './Spinner';

const meta = {
  component: Spinner,
  title: 'Feedback/Spinner',
} satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Announces translated application-owned activity when the spinner is the
 * only status presented for an ongoing operation.
 *
 * @summary labelled standalone activity status
 */
export const Labelled: Story = {
  args: { label: 'Saving changes' },
};
/**
 * Hides the animated mark from assistive technology because adjacent visible
 * text already communicates the current activity.
 *
 * @summary decorative spinner beside visible status text
 */
export const Decorative: Story = {
  args: {},
  render: () => (
    <Inline gap="sm" wrap={false}>
      <Spinner />
      <Typography as="span">Saving changes</Typography>
    </Inline>
  ),
};
/**
 * Compares every semantic colour across the supported spinner sizes, including
 * light and dark treatments intended for contrasting surfaces.
 *
 * @summary spinner size and semantic colour matrix
 */
export const SizesAndVariants: Story = {
  args: {},
  render: () => (
    <Inline gap="lg">
      <Spinner label="Primary activity" size="sm" variant="primary" />
      <Spinner label="Secondary activity" size="sm" variant="secondary" />
      <Spinner label="Success activity" size="sm" variant="success" />
      <Spinner label="Danger activity" size="md" variant="danger" />
      <Spinner label="Warning activity" size="md" variant="warning" />
      <Spinner label="Information activity" size="md" variant="info" />
      <Spinner label="Light activity" size="lg" variant="light" />
      <Spinner label="Dark activity" size="lg" variant="dark" />
    </Inline>
  ),
};
