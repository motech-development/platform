import type { Meta, StoryObj } from '@storybook/react-vite';
import { Inline } from '../Inline/Inline';
import { Stack } from '../Stack/Stack';
import { Badge } from './Badge';

const meta = {
  component: Badge,
  title: 'Foundation/Badge',
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Crosses all semantic variants with solid, subtle, outline, and ghost
 * appearances so consumers can choose meaning and emphasis independently.
 *
 * @summary Complete semantic variant and appearance matrix.
 */
export const VariantsAndAppearances: Story = {
  args: { children: 'Status' },
  render: () => (
    <Stack gap="compact">
      <Inline align="stretch" gap="sm">
        <Badge appearance="solid" variant="primary">
          Primary
        </Badge>
        <Badge appearance="solid" variant="secondary">
          Secondary
        </Badge>
        <Badge appearance="solid" variant="success">
          Success
        </Badge>
        <Badge appearance="solid" variant="danger">
          Danger
        </Badge>
        <Badge appearance="solid" variant="warning">
          Warning
        </Badge>
        <Badge appearance="solid" variant="info">
          Information
        </Badge>
        <Badge appearance="solid" variant="light">
          Light
        </Badge>
        <Badge appearance="solid" variant="dark">
          Dark
        </Badge>
      </Inline>
      <Inline align="stretch" gap="sm">
        <Badge appearance="subtle" variant="primary">
          Primary
        </Badge>
        <Badge appearance="subtle" variant="secondary">
          Secondary
        </Badge>
        <Badge appearance="subtle" variant="success">
          Success
        </Badge>
        <Badge appearance="subtle" variant="danger">
          Danger
        </Badge>
        <Badge appearance="subtle" variant="warning">
          Warning
        </Badge>
        <Badge appearance="subtle" variant="info">
          Information
        </Badge>
        <Badge appearance="subtle" variant="light">
          Light
        </Badge>
        <Badge appearance="subtle" variant="dark">
          Dark
        </Badge>
      </Inline>
      <Inline align="stretch" gap="sm">
        <Badge appearance="outline" variant="primary">
          Primary
        </Badge>
        <Badge appearance="outline" variant="secondary">
          Secondary
        </Badge>
        <Badge appearance="outline" variant="success">
          Success
        </Badge>
        <Badge appearance="outline" variant="danger">
          Danger
        </Badge>
        <Badge appearance="outline" variant="warning">
          Warning
        </Badge>
        <Badge appearance="outline" variant="info">
          Information
        </Badge>
        <Badge appearance="outline" variant="light">
          Light
        </Badge>
        <Badge appearance="outline" variant="dark">
          Dark
        </Badge>
      </Inline>
      <Inline align="stretch" gap="sm">
        <Badge appearance="ghost" variant="primary">
          Primary
        </Badge>
        <Badge appearance="ghost" variant="secondary">
          Secondary
        </Badge>
        <Badge appearance="ghost" variant="success">
          Success
        </Badge>
        <Badge appearance="ghost" variant="danger">
          Danger
        </Badge>
        <Badge appearance="ghost" variant="warning">
          Warning
        </Badge>
        <Badge appearance="ghost" variant="info">
          Information
        </Badge>
        <Badge appearance="ghost" variant="light">
          Light
        </Badge>
        <Badge appearance="ghost" variant="dark">
          Dark
        </Badge>
      </Inline>
    </Stack>
  ),
};
/**
 * Uses an intentionally long warning label to demonstrate badge content
 * wrapping and the boundary where explanatory copy should move to ordinary
 * text.
 *
 * @summary Long warning-label content handling.
 */
export const ContentExtreme: Story = {
  args: { children: 'Awaiting independent verification', variant: 'warning' },
};
