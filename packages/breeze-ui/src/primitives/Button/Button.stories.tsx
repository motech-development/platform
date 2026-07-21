import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { AddIcon } from '../../icons';
import { Inline } from '../Inline/Inline';
import { Stack } from '../Stack/Stack';
import { TextField } from '../TextField/TextField';
import { Button } from './Button';

const meta = {
  component: Button,
  title: 'Actions/Button',
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Activates a labelled button through the pointer and verifies `onAction` is
 * called exactly once, documenting the component’s semantic callback contract.
 *
 * @summary Single semantic action callback on activation.
 */
export const Activation: Story = {
  args: { children: 'Save changes', onAction: fn() },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Save changes' }),
    );
    await expect(args.onAction).toHaveBeenCalledOnce();
  },
};
/**
 * Crosses the solid, subtle, outline, and ghost appearances with every
 * semantic colour so meaning and visual emphasis can be evaluated
 * independently.
 *
 * @summary Complete button appearance and semantic-variant matrix.
 */
export const Variants: Story = {
  args: { children: 'Action' },
  render: () => (
    <Stack gap="compact">
      <Inline align="stretch" gap="sm">
        <Button appearance="solid" variant="primary">
          Primary
        </Button>
        <Button appearance="solid" variant="secondary">
          Secondary
        </Button>
        <Button appearance="solid" variant="success">
          Success
        </Button>
        <Button appearance="solid" variant="danger">
          Danger
        </Button>
        <Button appearance="solid" variant="warning">
          Warning
        </Button>
        <Button appearance="solid" variant="info">
          Information
        </Button>
        <Button appearance="solid" variant="light">
          Light
        </Button>
        <Button appearance="solid" variant="dark">
          Dark
        </Button>
      </Inline>
      <Inline align="stretch" gap="sm">
        <Button appearance="subtle" variant="primary">
          Primary
        </Button>
        <Button appearance="subtle" variant="secondary">
          Secondary
        </Button>
        <Button appearance="subtle" variant="success">
          Success
        </Button>
        <Button appearance="subtle" variant="danger">
          Danger
        </Button>
        <Button appearance="subtle" variant="warning">
          Warning
        </Button>
        <Button appearance="subtle" variant="info">
          Information
        </Button>
        <Button appearance="subtle" variant="light">
          Light
        </Button>
        <Button appearance="subtle" variant="dark">
          Dark
        </Button>
      </Inline>
      <Inline align="stretch" gap="sm">
        <Button appearance="outline" variant="primary">
          Primary
        </Button>
        <Button appearance="outline" variant="secondary">
          Secondary
        </Button>
        <Button appearance="outline" variant="success">
          Success
        </Button>
        <Button appearance="outline" variant="danger">
          Danger
        </Button>
        <Button appearance="outline" variant="warning">
          Warning
        </Button>
        <Button appearance="outline" variant="info">
          Information
        </Button>
        <Button appearance="outline" variant="light">
          Light
        </Button>
        <Button appearance="outline" variant="dark">
          Dark
        </Button>
      </Inline>
      <Inline align="stretch" gap="sm">
        <Button appearance="ghost" variant="primary">
          Primary
        </Button>
        <Button appearance="ghost" variant="secondary">
          Secondary
        </Button>
        <Button appearance="ghost" variant="success">
          Success
        </Button>
        <Button appearance="ghost" variant="danger">
          Danger
        </Button>
        <Button appearance="ghost" variant="warning">
          Warning
        </Button>
        <Button appearance="ghost" variant="info">
          Information
        </Button>
        <Button appearance="ghost" variant="light">
          Light
        </Button>
        <Button appearance="ghost" variant="dark">
          Dark
        </Button>
      </Inline>
    </Stack>
  ),
};
/**
 * Places the decorative Add icon beside visible Create text at `sm`, `md`, and
 * `lg`, showing canonical control sizing without making the icon the
 * accessible name.
 *
 * @summary Button sizes with a decorative leading icon.
 */
export const SizesAndIcon: Story = {
  args: { children: 'Create' },
  render: () => (
    <Inline gap="compact" wrap={false}>
      <Button size="sm">
        <AddIcon />
        Create
      </Button>
      <Button>
        <AddIcon />
        Create
      </Button>
      <Button size="lg">
        <AddIcon />
        Create
      </Button>
    </Inline>
  ),
};
/**
 * Uses the text appearance for a low-emphasis Add category action that must
 * remain a button rather than being mistaken for navigation.
 *
 * @summary Low-emphasis text action with visible icon and label.
 */
export const TextAction: Story = {
  args: {
    appearance: 'text',
    children: (
      <>
        <AddIcon /> Add category
      </>
    ),
  },
};
/**
 * Compares disabled and loading buttons, documenting that both prevent
 * activation while loading additionally exposes an announced busy state and
 * progress indicator.
 *
 * @summary Disabled and in-progress button states.
 */
export const States: Story = {
  args: { children: 'Save' },
  render: () => (
    <Inline align="stretch" gap="compact" wrap={false}>
      <Button disabled>Disabled</Button>
      <Button loading>Saving</Button>
    </Inline>
  ),
};
/**
 * Breeze deliberately supports only safe `button` and `submit` form behavior.
 *
 * @summary Constrained native button and submit form behaviours.
 */
export const NativeFormBehaviors: Story = {
  args: { children: 'Button' },
  render: () => (
    <form onSubmit={(event) => event.preventDefault()}>
      <Stack gap="compact">
        <TextField.Root defaultValue="Initial value">
          <TextField.Label>Example value</TextField.Label>
          <TextField.Input />
        </TextField.Root>
        <Inline gap="compact">
          <Button type="button">Button</Button>
          <Button type="submit">Submit</Button>
        </Inline>
      </Stack>
    </form>
  ),
};
