import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import { AddIcon } from '../../icons';
import { Avatar } from '../../primitives/Avatar/Avatar';
import { IconTile } from '../../primitives/IconTile/IconTile';
import { Surface } from '../../primitives/Surface/Surface';
import { ContextSwitcher } from './ContextSwitcher';

const meta = {
  component: ContextSwitcher,
  decorators: [
    (Story) => (
      <StoryConstraint size="application-rail">
        <Surface border="none" padding="compact" tone="inverse">
          <Story />
        </Surface>
      </StoryConstraint>
    ),
  ],
  title: 'Patterns/Application Shell/ContextSwitcher',
} satisfies Meta<typeof ContextSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

function EmptyMarker(): null {
  return null;
}

/**
 * Opens a menu of application-owned contexts, preserves each visual marker and
 * supporting description, and reports the alternate stable id when selected.
 *
 * @summary current context display and alternate selection
 */
export const Selection: Story = {
  args: {
    'aria-label': 'Switch context',
    currentId: 'design',
    items: [
      {
        description: 'Primary workspace',
        icon: (
          <Avatar initials="D" name="Design Team" shape="square" size="md" />
        ),
        id: 'design',
        name: 'Design Team',
      },
      {
        description: 'Secondary workspace',
        icon: (
          <Avatar
            initials="R"
            name="Research Team"
            shape="square"
            size="md"
            tone="accent"
          />
        ),
        id: 'research',
        name: 'Research Team',
      },
    ],
    manageLabel: 'Manage contexts',
    onChange: fn(),
    onManage: fn(),
    triggerLabel: 'Current context',
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Switch context' });
    const currentMarker = within(trigger).getByText('D');

    await expect(currentMarker.getBoundingClientRect().width).toBe(36);
    await expect(getComputedStyle(currentMarker).borderRadius).toBe('0px');
    await userEvent.click(trigger);
    const alternateMarker = within(document.body).getByText('R');

    await expect(alternateMarker.getBoundingClientRect().width).toBe(36);
    await expect(getComputedStyle(alternateMarker).backgroundColor).toBe(
      'rgb(242, 233, 255)',
    );
    await userEvent.click(
      within(document.body).getByRole('menuitemradio', {
        name: /Research Team/u,
      }),
    );
    await expect(args.onChange).toHaveBeenCalledWith('research');
  },
};

/**
 * Keeps text aligned to the content edge when contexts do not provide visual
 * markers.
 *
 * @summary context selection without optional markers
 */
export const WithoutMarkers: Story = {
  args: {
    ...Selection.args,
    items: [
      {
        description: 'Primary workspace',
        icon: <EmptyMarker />,
        id: 'design',
        name: 'Design Team',
      },
      {
        description: 'Secondary workspace',
        icon: [],
        id: 'research',
        name: 'Research Team',
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Switch context' });
    const currentName = within(trigger).getByText('Design Team');
    const triggerStyle = getComputedStyle(trigger);

    await expect(currentName.getBoundingClientRect().left).toBeCloseTo(
      trigger.getBoundingClientRect().left +
        Number.parseFloat(triggerStyle.paddingLeft),
      1,
    );

    await userEvent.click(trigger);

    const alternateItem = within(document.body).getByRole('menuitemradio', {
      name: /Research Team/u,
    });
    const alternateName = within(alternateItem).getByText('Research Team');
    const alternateStyle = getComputedStyle(alternateItem);

    await expect(alternateName.getBoundingClientRect().left).toBeCloseTo(
      alternateItem.getBoundingClientRect().left +
        Number.parseFloat(alternateStyle.paddingLeft),
      1,
    );
  },
};

/**
 * Represents the required-selection state with application-authored prompt
 * copy and marker when no current context id is available.
 *
 * @summary prompt state before a context is selected
 */
export const SelectionRequired: Story = {
  args: {
    ...Selection.args,
    currentId: null,
    emptyIcon: (
      <IconTile bordered={false} size="sm">
        <AddIcon />
      </IconTile>
    ),
    emptyName: 'Select context',
    triggerLabel: 'Context',
  },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Switch context',
    });

    await expect(trigger).toHaveTextContent('Context');
    await expect(trigger).toHaveTextContent('Select context');

    const emptyMarker = trigger.querySelector('svg')?.parentElement;

    await expect(emptyMarker).not.toBeNull();
    await expect(emptyMarker?.getBoundingClientRect().width).toBe(36);
    await expect(emptyMarker).toHaveStyle({ borderWidth: '0px' });
  },
};
