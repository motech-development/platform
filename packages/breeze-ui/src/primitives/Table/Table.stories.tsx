import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import type { CollectionSelection } from '../../internal/types/collection';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';
import {
  Body,
  Cell,
  Column,
  Disclosure,
  Footer,
  Header,
  LoadMore,
  Root,
  Row,
  Table,
  type TableSort,
} from './Table';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(Table.Body, { displayName: 'Table.Body' });
      Object.assign(Table.Cell, { displayName: 'Table.Cell' });
      Object.assign(Table.Column, { displayName: 'Table.Column' });
      Object.assign(Table.Disclosure, { displayName: 'Table.Disclosure' });
      Object.assign(Table.Footer, { displayName: 'Table.Footer' });
      Object.assign(Table.Header, { displayName: 'Table.Header' });
      Object.assign(Table.LoadMore, { displayName: 'Table.LoadMore' });
      Object.assign(Table.Root, { displayName: 'Table.Root' });
      Object.assign(Table.Row, { displayName: 'Table.Row' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Body,
    Cell,
    Column,
    Disclosure,
    Footer,
    Header,
    LoadMore,
    Row,
  },
  title: 'Collections/Table',
} satisfies Meta<typeof Root>;

export default meta;

type Story = StoryObj<typeof meta>;

function ControlledTable() {
  const [selection, setSelection] = useState<CollectionSelection>([1]);
  const [sort, setSort] = useState<TableSort>({
    column: 'name',
    direction: 'ascending',
  });

  return (
    <Table.Root
      aria-label="Controlled items"
      onSelectionChange={setSelection}
      onSortChange={setSort}
      selection={selection}
      sort={sort}
    >
      <Table.Header id="headings">
        <Table.Column id="name" rowHeader sortable>
          Name
        </Table.Column>
        <Table.Column id="state" sortable>
          State
        </Table.Column>
      </Table.Header>
      <Table.Body id="items">
        <Table.Row id={1} textValue="Alpha Ready">
          <Table.Cell column="name">Alpha</Table.Cell>
          <Table.Cell column="state">Ready</Table.Cell>
        </Table.Row>
        <Table.Row id={2} textValue="Beta In review">
          <Table.Cell column="name">Beta</Table.Cell>
          <Table.Cell column="state">In review</Table.Cell>
        </Table.Row>
        <Table.Row id={3} textValue="Gamma Draft">
          <Table.Cell column="name">Gamma</Table.Cell>
          <Table.Cell column="state">Draft</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}

/**
 * Authors columns and rows directly while the application controls selected
 * keys and the consumer-owned sort descriptor.
 *
 * @summary explicitly authored table with controlled sorting and selection
 */
export const ControlledSortingAndSelection: Story = {
  args: { 'aria-label': 'Items', children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('columnheader', { name: 'Name' }));
    await expect(
      canvas.getByRole('columnheader', { name: 'Name' }),
    ).toHaveAttribute('aria-sort', 'descending');
    await expect(
      canvas.getByRole('rowheader', { name: 'Alpha' }),
    ).toHaveAttribute('data-label', 'Name:');
  },
  render: ControlledTable,
};

/**
 * Composes keyed static header, body, and footer sections whose cells follow
 * the visible heading order and retain long-value wrapping.
 *
 * @summary static ordered header body and footer sections
 */
export const StaticOrderedSections: Story = {
  args: { 'aria-label': 'Static data', children: null },
  render: () => (
    <Table.Root aria-label="Static data">
      <Table.Header id="heading-section">
        <Table.Column id="label" rowHeader>
          Label
        </Table.Column>
        <Table.Column id="value">Value</Table.Column>
      </Table.Header>
      <Table.Body id="body-section">
        <Table.Row id="first" textValue="First Long value">
          <Table.Cell column="label">First</Table.Cell>
          <Table.Cell column="value">
            A long value that wraps in the responsive card presentation
          </Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Footer id="footer-section">
        <Table.Row id="summary" textValue="Summary One item">
          <Table.Cell column="label">Summary</Table.Cell>
          <Table.Cell column="value">One item</Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table.Root>
  ),
};

/**
 * Adds the canonical strong lower boundary without introducing top or side
 * borders, preserving the table's relationship to surrounding content.
 *
 * @summary table with a strong lower boundary
 */
export const StrongBoundary: Story = {
  args: { 'aria-label': 'Bounded items', boundary: 'strong', children: null },
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole('grid', {
      name: 'Bounded items',
    });
    const style = getComputedStyle(table);

    await expect(table).toHaveAttribute('data-boundary', 'strong');
    await expect(style.borderTopWidth).toBe('0px');
    await expect(style.borderRightWidth).toBe('0px');
    await expect(style.borderBottomWidth).toBe('2px');
    await expect(style.borderLeftWidth).toBe('0px');
  },
  render: ({ 'aria-label': ariaLabel, boundary }) => (
    <Table.Root aria-label={ariaLabel} boundary={boundary}>
      <Table.Header>
        <Table.Column id="name" rowHeader>
          Name
        </Table.Column>
        <Table.Column id="state">State</Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row id="aurora" textValue="Aurora Ready">
          <Table.Cell column="name">Aurora</Table.Cell>
          <Table.Cell column="state">Ready</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  ),
};

/**
 * Uses persistent CSS-grid rows across multiple keyed body sections so every
 * cell stays aligned with its corresponding heading track.
 *
 * @summary persistent grid layout with grouped body sections
 */
export const GridGroupedSections: Story = {
  args: { 'aria-label': 'Grouped grid items', children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole('grid', { name: 'Grouped grid items' });
    const headerRow = canvas.getByRole('row', { name: 'Name State' });
    const firstSectionLastRow = canvas.getByRole('row', { name: 'Beta' });
    const finalRow = canvas.getByRole('row', { name: 'Gamma' });
    const stateHeading = canvas.getByRole('columnheader', { name: 'State' });
    const cell = canvas.getByRole('gridcell', { name: 'Ready' });
    const reviewCell = canvas.getByRole('gridcell', { name: 'Review' });
    const draftCell = canvas.getByRole('gridcell', { name: 'Draft' });
    const view = canvasElement.ownerDocument.defaultView;

    await expect(view?.getComputedStyle(table).display).toBe('grid');
    await expect(
      view?.getComputedStyle(headerRow.parentElement as HTMLElement).display,
    ).toBe('grid');
    await expect(view?.getComputedStyle(headerRow).display).toBe('grid');
    await expect(
      view?.getComputedStyle(firstSectionLastRow.parentElement as HTMLElement)
        .display,
    ).toBe('grid');
    await expect(view?.getComputedStyle(firstSectionLastRow).display).toBe(
      'grid',
    );
    await expect(view?.getComputedStyle(cell).display).toBe('block');
    await expect(
      view?.getComputedStyle(firstSectionLastRow).borderBottomWidth,
    ).toBe('1px');
    await expect(view?.getComputedStyle(finalRow).borderBottomWidth).toBe(
      '0px',
    );
    await expect(cell.getBoundingClientRect().left).toBeCloseTo(
      stateHeading.getBoundingClientRect().left,
      1,
    );
    await expect(reviewCell.getBoundingClientRect().left).toBeCloseTo(
      stateHeading.getBoundingClientRect().left,
      1,
    );
    await expect(draftCell.getBoundingClientRect().left).toBeCloseTo(
      stateHeading.getBoundingClientRect().left,
      1,
    );
  },
  render: () => (
    <Table.Root
      aria-label="Grouped grid items"
      className="grid-cols-[minmax(0,1fr)_auto]"
      layout="grid"
    >
      <Table.Header>
        <Table.Column id="name" rowHeader>
          Name
        </Table.Column>
        <Table.Column id="state">State</Table.Column>
      </Table.Header>
      <Table.Body id="active">
        <Table.Row id="alpha" textValue="Alpha Ready">
          <Table.Cell column="name">Alpha</Table.Cell>
          <Table.Cell column="state">Ready</Table.Cell>
        </Table.Row>
        <Table.Row id="beta" textValue="Beta Review">
          <Table.Cell column="name">Beta</Table.Cell>
          <Table.Cell column="state">Review</Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Body id="archived">
        <Table.Row id="gamma" textValue="Gamma Draft">
          <Table.Cell column="name">Gamma</Table.Cell>
          <Table.Cell column="state">Draft</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  ),
};

/**
 * Keeps separate responsive body sections visually bounded while removing the
 * final table-row divider only at the end of the complete collection.
 *
 * @summary responsive table with grouped body sections
 */
export const ResponsiveGroupedSections: Story = {
  args: { 'aria-label': 'Grouped responsive items', children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstSectionFinalCell = canvas.getByRole('gridcell', {
      name: 'Review',
    });
    const tableFinalCell = canvas.getByRole('gridcell', { name: 'Draft' });
    const view = canvasElement.ownerDocument.defaultView;

    await expect(
      view?.getComputedStyle(firstSectionFinalCell).borderBottomWidth,
    ).toBe('1px');
    await expect(view?.getComputedStyle(tableFinalCell).borderBottomWidth).toBe(
      '0px',
    );
  },
  render: () => (
    <Table.Root aria-label="Grouped responsive items">
      <Table.Header>
        <Table.Column id="name" rowHeader>
          Name
        </Table.Column>
        <Table.Column id="state">State</Table.Column>
      </Table.Header>
      <Table.Body id="active">
        <Table.Row id="alpha" textValue="Alpha Ready">
          <Table.Cell column="name">Alpha</Table.Cell>
          <Table.Cell column="state">Ready</Table.Cell>
        </Table.Row>
        <Table.Row id="beta" textValue="Beta Review">
          <Table.Cell column="name">Beta</Table.Cell>
          <Table.Cell column="state">Review</Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Body id="archived">
        <Table.Row id="gamma" textValue="Gamma Draft">
          <Table.Cell column="name">Gamma</Table.Cell>
          <Table.Cell column="state">Draft</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  ),
};

function SemanticRowPresentations() {
  return (
    <Table.Root
      aria-label="Semantic row presentations"
      className="grid-cols-2"
      layout="grid"
    >
      <Table.Header>
        <Table.Column id="name" rowHeader>
          Name
        </Table.Column>
        <Table.Column align="end" id="score">
          Score
        </Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row id="group-a" presentation="section" textValue="Group A 20">
          <Table.Cell column="name">Group A</Table.Cell>
          <Table.Cell align="end" column="score">
            20
          </Table.Cell>
        </Table.Row>
        <Table.Row id="active" onAction={() => undefined} textValue="Active 30">
          <Table.Cell column="name">Active</Table.Cell>
          <Table.Cell align="end" column="score">
            30
          </Table.Cell>
        </Table.Row>
        <Table.Row
          id="paused"
          onAction={() => undefined}
          textValue="Paused 10"
          tone="muted"
        >
          <Table.Cell column="name">Paused</Table.Cell>
          <Table.Cell align="end" column="score">
            10
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}

async function expectSemanticRowPresentations(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const sectionRow = canvas.getByRole('row', { name: 'Group A' });
  const defaultRow = canvas.getByRole('row', { name: 'Active' });
  const mutedRow = canvas.getByRole('row', { name: 'Paused' });
  const view = canvasElement.ownerDocument.defaultView;

  await expect(sectionRow).toHaveAttribute('data-presentation', 'section');
  await expect(
    sectionRow.getBoundingClientRect().height,
  ).toBeGreaterThanOrEqual(44);
  await expect(view?.getComputedStyle(sectionRow).backgroundColor).toBe(
    'rgb(223, 228, 236)',
  );
  await expect(view?.getComputedStyle(defaultRow).backgroundColor).toBe(
    'rgb(255, 255, 255)',
  );
  await expect(mutedRow).toHaveAttribute('data-tone', 'muted');
  await expect(view?.getComputedStyle(mutedRow).backgroundColor).toBe(
    'rgb(241, 243, 246)',
  );
  await userEvent.hover(defaultRow);
  await expect(view?.getComputedStyle(defaultRow).backgroundColor).toBe(
    'rgb(248, 250, 255)',
  );
  await userEvent.unhover(defaultRow);
  await userEvent.hover(mutedRow);
  await expect(view?.getComputedStyle(mutedRow).backgroundColor).toBe(
    'rgb(233, 237, 242)',
  );
}

/**
 * Compares non-actionable section geometry with default and muted actionable
 * data-row treatments at the standard viewport width.
 *
 * @summary semantic section rows and actionable row tones
 */
export const RowTonesAndSections: Story = {
  args: { 'aria-label': 'Semantic row presentations', children: null },
  play: async ({ canvasElement }) =>
    expectSemanticRowPresentations(canvasElement),
  render: () => <SemanticRowPresentations />,
};

/**
 * Verifies that section geometry and default or muted actionable row emphasis
 * remain distinguishable in the canonical compact viewport.
 *
 * @summary compact semantic section rows and row tones
 */
export const RowTonesAndSectionsCompact: Story = {
  args: { 'aria-label': 'Semantic row presentations', children: null },
  globals: { viewport: { value: 'mobile1' } },
  play: async ({ canvasElement }) =>
    expectSemanticRowPresentations(canvasElement),
  render: () => <SemanticRowPresentations />,
};

function ResponsiveItemsExample() {
  return (
    <Table.Root aria-label="Responsive items">
      <Table.Header>
        <Table.Column compactLabel={false} id="name" rowHeader>
          Name
        </Table.Column>
        <Table.Column id="state">State</Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row id="alpha" textValue="Alpha Ready">
          <Table.Cell column="name">Alpha</Table.Cell>
          <Table.Cell column="state">Ready</Table.Cell>
        </Table.Row>
        <Table.Row id="beta" textValue="Beta Review">
          <Table.Cell column="name">Beta</Table.Cell>
          <Table.Cell column="state">Review</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}

/**
 * Shows ordinary columnar records at table width with header-derived compact
 * labels prepared but visually suppressed above the small breakpoint.
 *
 * @summary responsive records in columnar table layout
 */
export const ResponsiveItems: Story = {
  args: { 'aria-label': 'Responsive items', children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole('columnheader', { name: 'Name' });
    const firstRow = canvas.getByRole('row', { name: 'Alpha' });
    const firstCell = canvas.getByRole('rowheader', { name: 'Alpha' });
    const labelledCell = canvas.getByRole('gridcell', { name: 'Ready' });
    const finalCell = canvas.getByRole('gridcell', { name: 'Review' });
    const view = canvasElement.ownerDocument.defaultView;
    const headingStyle = view?.getComputedStyle(heading);
    const firstCellStyle = view?.getComputedStyle(firstCell);
    const compactLabelStyle = view?.getComputedStyle(labelledCell, '::before');

    await expect(heading.getBoundingClientRect().height).toBeGreaterThanOrEqual(
      44,
    );
    await expect(
      firstRow.getBoundingClientRect().height,
    ).toBeGreaterThanOrEqual(44);
    await expect(headingStyle?.paddingLeft).toBe(firstCellStyle?.paddingLeft);
    await expect(firstCellStyle?.verticalAlign).toBe('middle');
    await expect(firstCellStyle?.borderBottomWidth).toBe('1px');
    await expect(labelledCell).toHaveAttribute('data-label', 'State:');
    await expect(compactLabelStyle?.display).toBe('none');
    await expect(view?.getComputedStyle(finalCell).borderBottomWidth).toBe(
      '0px',
    );
  },
  render: () => <ResponsiveItemsExample />,
};

/**
 * Adapts the same records into stacked compact rows and derives visible cell
 * labels from headings without duplicating the row-header label.
 *
 * @summary compact records with heading-derived cell labels
 */
export const ResponsiveItemsCompact: Story = {
  args: { 'aria-label': 'Responsive items', children: null },
  globals: { viewport: { value: 'mobile1' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstRow = canvas.getByRole('row', { name: 'Alpha' });
    const finalRow = canvas.getByRole('row', { name: 'Beta' });
    const primaryCell = canvas.getByRole('rowheader', { name: 'Alpha' });
    const labelledCell = canvas.getByRole('gridcell', { name: 'Ready' });
    const view = canvasElement.ownerDocument.defaultView;
    const rowStyle = view?.getComputedStyle(firstRow);
    const cellStyle = view?.getComputedStyle(labelledCell);
    const compactLabelStyle = view?.getComputedStyle(labelledCell, '::before');

    await expect(rowStyle?.display).toBe('flex');
    await expect(rowStyle?.flexDirection).toBe('column');
    await expect(Number.parseFloat(rowStyle?.gap ?? '0')).toBeGreaterThan(0);
    await expect(rowStyle?.borderBottomWidth).toBe('1px');
    await expect(view?.getComputedStyle(finalRow).borderBottomWidth).toBe(
      '0px',
    );
    await expect(cellStyle?.display).toBe('block');
    await expect(compactLabelStyle?.display).toBe('inline-block');
    await expect(cellStyle?.paddingTop).toBe('0px');
    await expect(cellStyle?.borderBottomWidth).toBe('0px');
    await expect(labelledCell).toHaveAttribute('data-label', 'State:');
    await expect(primaryCell).not.toHaveAttribute('data-label');
  },
  render: () => <ResponsiveItemsExample />,
};

/**
 * Authors state before name in both the header and every row so the visible
 * cell order remains aligned with its headings.
 *
 * @summary reordered columns with matched cell order
 */
export const ConditionalOrderedColumns: Story = {
  args: { 'aria-label': 'Conditional columns', children: null },
  render: () => (
    <Table.Root aria-label="Conditional columns">
      <Table.Header>
        <Table.Column id="state">State</Table.Column>
        <Table.Column id="name" rowHeader>
          Name
        </Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row id={1} textValue="Ready Alpha">
          <Table.Cell column="state">Ready</Table.Cell>
          <Table.Cell column="name">Alpha</Table.Cell>
        </Table.Row>
        <Table.Row id={2} textValue="In review Beta">
          <Table.Cell column="state">In review</Table.Cell>
          <Table.Cell column="name">Beta</Table.Cell>
        </Table.Row>
        <Table.Row id={3} textValue="Draft Gamma">
          <Table.Cell column="state">Draft</Table.Cell>
          <Table.Cell column="name">Gamma</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  ),
};

/**
 * Compares an immutable selected row with application-authored empty content
 * for a body whose current item collection is empty.
 *
 * @summary read-only selection and empty table content
 */
export const ReadOnlyAndEmpty: Story = {
  args: { 'aria-label': 'States', children: null },
  render: () => (
    <Stack gap="xl">
      <Table.Root aria-label="Read-only" readOnly selection={[1]}>
        <Table.Header>
          <Table.Column id="name" rowHeader>
            Name
          </Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row id={1} textValue="Alpha">
            <Table.Cell column="name">Alpha</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
      <Table.Root aria-label="Empty">
        <Table.Header>
          <Table.Column id="name" rowHeader>
            Name
          </Table.Column>
        </Table.Header>
        <Table.Body emptyContent="No items">{null}</Table.Body>
      </Table.Root>
    </Stack>
  ),
};

function VirtualizedTable() {
  return (
    <Table.Root
      aria-label="Virtual data"
      virtualization={{
        estimatedRowHeight: 52,
        mode: 'variable',
        overscan: 80,
        viewportHeight: 156,
      }}
    >
      <Table.Header>
        <Table.Column id="name" rowHeader>
          Name
        </Table.Column>
        <Table.Column id="state">State</Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row id={1} textValue="Alpha Ready">
          <Table.Cell column="name">Alpha</Table.Cell>
          <Table.Cell column="state">Ready</Table.Cell>
        </Table.Row>
        <Table.Row id={2} textValue="Beta In review">
          <Table.Cell column="name">Beta</Table.Cell>
          <Table.Cell column="state">In review</Table.Cell>
        </Table.Row>
        <Table.Row id={3} textValue="Gamma Draft">
          <Table.Cell column="name">Gamma</Table.Cell>
          <Table.Cell column="state">Draft</Table.Cell>
        </Table.Row>
        <Table.LoadMore loading onLoadMore={() => undefined}>
          Loading more items
        </Table.LoadMore>
      </Table.Body>
    </Table.Root>
  );
}

async function expectVirtualizedTableGeometry(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const table = canvas.getByRole('grid', { name: 'Virtual data' });
  const firstRow = canvas.getByRole('row', { name: 'Alpha' });
  const secondRow = canvas.getByRole('row', { name: 'Beta' });
  const firstCell = canvas.getByRole('rowheader', { name: 'Alpha' });
  const secondCell = canvas.getByRole('gridcell', { name: 'Ready' });
  const firstRowRectangle = firstRow.getBoundingClientRect();
  const firstCellRectangle = firstCell.getBoundingClientRect();
  const secondCellRectangle = secondCell.getBoundingClientRect();
  const tableRectangle = table.getBoundingClientRect();
  const view = canvasElement.ownerDocument.defaultView;
  const compact = (view?.innerWidth ?? 0) < 681;

  await expect(firstRowRectangle.width).toBe(tableRectangle.width);
  await expect(view?.getComputedStyle(firstRow).borderBottomWidth).toBe(
    compact ? '1px' : '0px',
  );

  if (compact) {
    const secondRowRectangle = secondRow.getBoundingClientRect();

    await expect(firstCellRectangle.width).toBe(secondCellRectangle.width);
    await expect(firstCellRectangle.x).toBe(secondCellRectangle.x);
    await expect(secondCellRectangle.y).toBeGreaterThan(firstCellRectangle.y);
    await expect(firstRowRectangle.bottom).toBeLessThanOrEqual(
      secondRowRectangle.y,
    );
    await expect(table.scrollWidth).toBe(table.clientWidth);

    return;
  }

  const firstHeading = canvas.getByRole('columnheader', { name: 'Name' });
  const secondHeading = canvas.getByRole('columnheader', { name: 'State' });
  const firstHeadingRectangle = firstHeading.getBoundingClientRect();
  const secondHeadingRectangle = secondHeading.getBoundingClientRect();

  await expect(firstCellRectangle.width).toBe(firstHeadingRectangle.width);
  await expect(secondCellRectangle.width).toBe(secondHeadingRectangle.width);
  await expect(firstCellRectangle.right).toBe(secondCellRectangle.left);
  await expect(view?.getComputedStyle(firstCell).borderBottomWidth).toBe('1px');
  await expect(view?.getComputedStyle(secondCell).borderBottomWidth).toBe(
    '1px',
  );
}

/**
 * Windows variable-height rows inside a bounded viewport and renders a loading
 * sentinel while preserving desktop heading and cell geometry.
 *
 * @summary variable-height virtualized rows with loading sentinel
 */
export const VariableVirtualizationAndLoading: Story = {
  args: { 'aria-label': 'Virtual data', children: null },
  play: async ({ canvasElement }) =>
    expectVirtualizedTableGeometry(canvasElement),
  render: VirtualizedTable,
};

/**
 * Verifies variable-height row windowing and the loading sentinel against the
 * stacked compact record presentation without horizontal overflow.
 *
 * @summary compact variable-height virtualized table
 */
export const VariableVirtualizationAndLoadingCompact: Story = {
  args: { 'aria-label': 'Virtual data', children: null },
  globals: { viewport: { value: 'mobile1' } },
  play: async ({ canvasElement }) =>
    expectVirtualizedTableGeometry(canvasElement),
  render: () => <VirtualizedTable />,
};

/**
 * Places an application-owned action control in an ordinary keyed cell rather
 * than teaching Table application commands or business workflows.
 *
 * @summary application-owned action inside a table cell
 */
export const ActionsStayWithApplications: Story = {
  args: { 'aria-label': 'Action table', children: null },
  render: () => (
    <Table.Root aria-label="Action table">
      <Table.Header>
        <Table.Column id="name" rowHeader>
          Name
        </Table.Column>
        <Table.Column id="action">Action</Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row id="alpha" textValue="Alpha Inspect">
          <Table.Cell column="name">Alpha</Table.Cell>
          <Table.Cell column="action">
            <Button appearance="ghost" size="sm">
              Inspect
            </Button>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  ),
};
