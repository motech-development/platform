import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import type { CollectionSelection } from '../../internal/types/collection';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';
import { Typography } from '../Typography/Typography';
import { GridList, Header, Item, LoadMore, Root, Section } from './GridList';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(GridList.Header, { displayName: 'GridList.Header' });
      Object.assign(GridList.Item, { displayName: 'GridList.Item' });
      Object.assign(GridList.LoadMore, { displayName: 'GridList.LoadMore' });
      Object.assign(GridList.Root, { displayName: 'GridList.Root' });
      Object.assign(GridList.Section, { displayName: 'GridList.Section' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Header,
    Item,
    LoadMore,
    Section,
  },
  title: 'Collections/GridList',
} satisfies Meta<typeof Root>;

export default meta;

type Story = StoryObj<typeof meta>;

function ControlledGridList() {
  const [selection, setSelection] = useState<CollectionSelection>([1]);

  return (
    <GridList.Root
      aria-label="Controlled items"
      onSelectionChange={setSelection}
      selection={selection}
    >
      <GridList.Item id={1} textValue="Alpha">
        <Stack className="min-w-0 flex-1" gap="xs">
          <Typography as="strong">Alpha</Typography>
          <Typography as="span">Short supporting content</Typography>
        </Stack>
        <Button appearance="ghost" size="sm">
          Inspect
        </Button>
      </GridList.Item>
      <GridList.Item id={2} textValue="Beta">
        <Stack className="min-w-0 flex-1" gap="xs">
          <Typography as="strong">Beta</Typography>
          <Typography as="span">
            Longer supporting content that demonstrates variable row measurement
          </Typography>
        </Stack>
        <Button appearance="ghost" size="sm">
          Inspect
        </Button>
      </GridList.Item>
      <GridList.Item id={3} textValue="Gamma">
        <Stack className="min-w-0 flex-1" gap="xs">
          <Typography as="strong">Gamma</Typography>
          <Typography as="span">Short supporting content</Typography>
        </Stack>
        <Button appearance="ghost" size="sm">
          Inspect
        </Button>
      </GridList.Item>
    </GridList.Root>
  );
}

/**
 * Keeps application-owned single selection synchronized while ArrowDown moves
 * row focus and each row retains an independently focusable action.
 *
 * @summary controlled selection with embedded row actions
 */
export const EmbeddedControlsAndSelection: Story = {
  args: { 'aria-label': 'Items', children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const grid = canvas.getByRole('grid', { name: 'Controlled items' });

    grid.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('row', { name: /Beta/ })).toHaveFocus();
    await expect(
      canvas.getAllByRole('button', { name: 'Inspect' }),
    ).toHaveLength(3);
  },
  render: ControlledGridList,
};

/**
 * Groups static keyed rows under visible section headings and compares a
 * disabled item with an immutable read-only selected row.
 *
 * @summary static sections disabled rows and read-only selection
 */
export const SectionsAndStates: Story = {
  args: { 'aria-label': 'Grouped items', children: null },
  render: () => (
    <Stack gap="md">
      <GridList.Root aria-label="Grouped items">
        <GridList.Section id="current">
          <GridList.Header>Current</GridList.Header>
          <GridList.Item id="active" textValue="Active">
            Active
          </GridList.Item>
        </GridList.Section>
        <GridList.Section id="archived">
          <GridList.Header>Archived</GridList.Header>
          <GridList.Item disabled id="retired" textValue="Retired">
            Retired
          </GridList.Item>
        </GridList.Section>
      </GridList.Root>
      <GridList.Root
        aria-label="Read-only items"
        readOnly
        selection={['locked']}
      >
        <GridList.Item id="locked" textValue="Locked selection">
          Locked selection
        </GridList.Item>
      </GridList.Root>
    </Stack>
  ),
};

/**
 * Arranges explicitly authored keyed items in an auto-fitting responsive grid while
 * retaining grid-list focus, typeahead, and selection semantics.
 *
 * @summary responsive grid layout for authored items
 */
export const ResponsiveGrid: Story = {
  args: { 'aria-label': 'Responsive items', children: null },
  render: () => (
    <GridList.Root aria-label="Responsive items" layout="grid">
      <GridList.Item id={1} textValue="Alpha">
        <Stack gap="xs">
          <Typography as="strong">Alpha</Typography>
          <Typography as="span">Short supporting content</Typography>
        </Stack>
      </GridList.Item>
      <GridList.Item id={2} textValue="Beta">
        <Stack gap="xs">
          <Typography as="strong">Beta</Typography>
          <Typography as="span">
            Longer supporting content that demonstrates responsive layout
          </Typography>
        </Stack>
      </GridList.Item>
      <GridList.Item id={3} textValue="Gamma">
        <Stack gap="xs">
          <Typography as="strong">Gamma</Typography>
          <Typography as="span">Short supporting content</Typography>
        </Stack>
      </GridList.Item>
    </GridList.Root>
  ),
};

/**
 * Enables variable-height collection windowing with an explicit viewport,
 * estimated row height, and overscan for application-supplied items.
 *
 * @summary variable-height virtualized grid-list viewport
 */
export const VariableVirtualizationAndLoading: Story = {
  args: { 'aria-label': 'Virtual items', children: null },
  render: () => (
    <GridList.Root
      aria-label="Virtual items"
      virtualization={{
        estimatedRowHeight: 52,
        mode: 'variable',
        overscan: 80,
        viewportHeight: 156,
      }}
    >
      <GridList.Item id={1} textValue="Alpha">
        <Stack gap="xs">
          <Typography as="strong">Alpha</Typography>
          <Typography as="span">Short supporting content</Typography>
        </Stack>
      </GridList.Item>
      <GridList.Item id={2} textValue="Beta">
        <Stack gap="xs">
          <Typography as="strong">Beta</Typography>
          <Typography as="span">
            Longer supporting content that demonstrates variable row measurement
          </Typography>
        </Stack>
      </GridList.Item>
      <GridList.Item id={3} textValue="Gamma">
        <Stack gap="xs">
          <Typography as="strong">Gamma</Typography>
          <Typography as="span">Short supporting content</Typography>
        </Stack>
      </GridList.Item>
    </GridList.Root>
  ),
};
