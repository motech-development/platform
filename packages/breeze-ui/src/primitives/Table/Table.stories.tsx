import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import type { CollectionSelection } from '../../internal/types/collection';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';
import { TextField } from '../TextField/TextField';
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
    const nameHeading = canvas.getByRole('columnheader', { name: 'Name' });
    const activeSection = canvas.getByRole('rowheader', { name: 'Active' });
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
    await expect(activeSection).toHaveAttribute('colspan', '2');
    await expect(activeSection.getBoundingClientRect().left).toBeCloseTo(
      nameHeading.getBoundingClientRect().left,
      1,
    );
    await expect(activeSection.getBoundingClientRect().right).toBeCloseTo(
      stateHeading.getBoundingClientRect().right,
      1,
    );
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
        <Table.Row
          id="active-section"
          presentation="section"
          textValue="Active"
        >
          <Table.Cell colSpan={2} column="name">
            Active
          </Table.Cell>
        </Table.Row>
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
        <Table.Row
          id="archived-section"
          presentation="section"
          textValue="Archived"
        >
          <Table.Cell colSpan={2} column="name">
            Archived
          </Table.Cell>
        </Table.Row>
        <Table.Row id="gamma" textValue="Gamma Draft">
          <Table.Cell column="name">Gamma</Table.Cell>
          <Table.Cell column="state">Draft</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  ),
};

/**
 * Uses a named five-column desktop arrangement while retaining compact card
 * rows below the Breeze small breakpoint.
 *
 * @summary typed media, details, and action desktop grid columns
 */
export const ResponsiveGridColumnVariant: Story = {
  args: { 'aria-label': 'Responsive company records', children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const mediaHeading = canvas.getByRole('columnheader', { name: 'Media' });
    const primaryHeading = canvas.getByRole('columnheader', { name: 'Name' });
    const secondaryHeading = canvas.getByRole('columnheader', {
      name: 'Number',
    });
    const tertiaryHeading = canvas.getByRole('columnheader', {
      name: 'Contact',
    });
    const actionHeading = canvas.getByRole('columnheader', { name: 'Action' });
    const mediaCell = canvas.getByRole('gridcell', { name: 'AC' });
    const primaryCell = canvas.getByRole('rowheader', { name: 'Acme' });

    await expect(mediaHeading.getBoundingClientRect().width).toBeCloseTo(36, 1);
    await expect(actionHeading.getBoundingClientRect().width).toBeCloseTo(
      20,
      1,
    );
    await expect(primaryHeading.getBoundingClientRect().width).toBeGreaterThan(
      tertiaryHeading.getBoundingClientRect().width,
    );
    await expect(tertiaryHeading.getBoundingClientRect().width).toBeGreaterThan(
      secondaryHeading.getBoundingClientRect().width,
    );
    await expect(mediaCell.getBoundingClientRect().left).toBeCloseTo(
      mediaHeading.getBoundingClientRect().left,
      1,
    );
    await expect(primaryCell.getBoundingClientRect().left).toBeCloseTo(
      primaryHeading.getBoundingClientRect().left,
      1,
    );
    await expect(mediaCell).toHaveAttribute('data-breeze-compact-hidden', '');
  },
  render: () => (
    <Table.Root
      aria-label="Responsive company records"
      compactHiddenColumns={['media']}
      desktopColumns="mediaDetailsAction"
      layout="responsiveGrid"
    >
      <Table.Header>
        <Table.Column compactLabel={false} id="media">
          Media
        </Table.Column>
        <Table.Column id="name" rowHeader>
          Name
        </Table.Column>
        <Table.Column id="number">Number</Table.Column>
        <Table.Column id="contact">Contact</Table.Column>
        <Table.Column compactLabel={false} id="action">
          Action
        </Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row id="acme" textValue="Acme 123 contact@example.test">
          <Table.Cell column="media">AC</Table.Cell>
          <Table.Cell column="name">Acme</Table.Cell>
          <Table.Cell column="number">123</Table.Cell>
          <Table.Cell column="contact">contact@example.test</Table.Cell>
          <Table.Cell column="action">View</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  ),
};

function GridColumnSpanTable() {
  return (
    <Table.Root
      aria-label="Compact scheduled records"
      compactHiddenColumns={['marker', 'date', 'actions']}
      layout="grid"
    >
      <Table.Header>
        <Table.Column id="marker" width="max-content">
          Marker
        </Table.Column>
        <Table.Column id="name" rowHeader>
          Name
        </Table.Column>
        <Table.Column id="date" width="max-content">
          Date
        </Table.Column>
        <Table.Column align="end" id="amount" width="max-content">
          Amount
        </Table.Column>
        <Table.Column id="actions" width="max-content">
          Actions
        </Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row id="subscription" textValue="Subscription 12 August £20">
          <Table.Cell column="marker">Marker</Table.Cell>
          <Table.Cell column="name">Subscription</Table.Cell>
          <Table.Cell column="date">12 August</Table.Cell>
          <Table.Cell align="end" column="amount">
            £20
          </Table.Cell>
          <Table.Cell column="actions">Actions</Table.Cell>
        </Table.Row>
        <Table.Row id="summary" textValue="Summary £40">
          <Table.Cell column="marker">Summary marker</Table.Cell>
          <Table.Cell colSpan={2} column="name">
            Summary
          </Table.Cell>
          <Table.Cell align="end" column="amount">
            £40
          </Table.Cell>
          <Table.Cell column="actions">Summary actions</Table.Cell>
        </Table.Row>
        <Table.Row id="editable" textValue="Editable reference">
          <Table.Cell column="marker">Editable marker</Table.Cell>
          <Table.Cell column="name">
            <TextField.Root aria-label="Reference" defaultValue="AB">
              <TextField.Input />
            </TextField.Root>
          </Table.Cell>
          <Table.Cell column="date">Editable date</Table.Cell>
          <Table.Cell column="amount">Editable amount</Table.Cell>
          <Table.Cell column="actions">Editable actions</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}

/**
 * Removes supporting desktop-only columns and their grid tracks at the compact
 * breakpoint while preserving spanning and keyboard geometry.
 *
 * @summary compact grid omits hidden tracks
 */
export const CompactGridColumns: Story = {
  args: { 'aria-label': 'Compact scheduled records', children: null },
  globals: { viewport: { value: 'compactBoundary' } },
  parameters: {
    viewport: {
      options: {
        compactBoundary: {
          name: 'Compact boundary',
          styles: { height: '800px', width: '680px' },
        },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole('grid', {
      name: 'Compact scheduled records',
    });
    const row = canvas.getByRole('row', { name: 'Subscription' });
    const name = canvas.getByRole('rowheader', { name: 'Subscription' });
    const date = canvas.getByText('12 August');
    const amount = canvas.getByRole('gridcell', { name: '£20' });
    const summaryRow = canvas.getByRole('row', { name: 'Summary' });
    const summary = canvas.getByRole('rowheader', { name: 'Summary' });
    const summaryAmount = within(summaryRow).getByRole('gridcell', {
      name: '£40',
    });
    const tracks = getComputedStyle(table).gridTemplateColumns.split(' ');

    await expect(tracks).toHaveLength(2);
    await expect(date.getBoundingClientRect().width).toBe(0);
    await expect(name.getBoundingClientRect().right).toBeLessThanOrEqual(
      amount.getBoundingClientRect().left,
    );
    await expect(row.getBoundingClientRect().width).toBeGreaterThan(0);
    await expect(summary.getBoundingClientRect().right).toBeLessThanOrEqual(
      summaryAmount.getBoundingClientRect().left,
    );

    await userEvent.click(name);
    await expect(name).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(amount).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(name).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(amount).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(name).toHaveFocus();

    const reference = canvas.getByRole<HTMLInputElement>('textbox', {
      name: 'Reference',
    });

    await userEvent.click(reference);
    await userEvent.keyboard('{ArrowRight}');
    await expect(reference).toHaveFocus();
  },
  render: GridColumnSpanTable,
};

/**
 * Restores the native multi-column span when compact-only columns are visible
 * above the small breakpoint.
 *
 * @summary desktop grid preserves full spans
 */
export const DesktopGridColumnSpan: Story = {
  args: { 'aria-label': 'Compact scheduled records', children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole('grid', {
      name: 'Compact scheduled records',
    });
    const summaryRow = canvas.getByRole('row', { name: 'Summary' });
    const summary = canvas.getByRole('rowheader', { name: 'Summary' });
    const summaryAmount = within(summaryRow).getByRole('gridcell', {
      name: '£40',
    });
    const nameHeading = canvas.getByRole('columnheader', { name: 'Name' });
    const tracks = getComputedStyle(table).gridTemplateColumns.split(' ');

    await expect(tracks).toHaveLength(5);
    await expect(getComputedStyle(summary).gridColumn).toBe('span 2 / span 2');
    await expect(summary.getBoundingClientRect().left).toBe(
      nameHeading.getBoundingClientRect().left,
    );
    await expect(summary.getBoundingClientRect().right).toBe(
      summaryAmount.getBoundingClientRect().left,
    );
  },
  render: GridColumnSpanTable,
};

/**
 * Applies intrinsic and icon widths from the generic column API while the
 * remaining columns share the available desktop width.
 *
 * @summary responsive grid driven by column widths
 */
export const ResponsiveGridColumnWidths: Story = {
  args: { 'aria-label': 'Responsive records', children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const row = canvas.getByRole('row', { name: 'Example record' });
    const columns = getComputedStyle(row).gridTemplateColumns.split(' ');
    const amountHeading = canvas.getByText('Amount');
    const amount = canvas.getByText('£10.00');

    await expect(columns[0]).toBe('36px');
    await expect(columns.at(-1)).toBe('20px');
    await expect(amount.getBoundingClientRect().right).toBeCloseTo(
      amountHeading.getBoundingClientRect().right,
      1,
    );
  },
  render: () => (
    <Table.Root aria-label="Responsive records" layout="responsiveGrid">
      <Table.Header>
        <Table.Column
          compactLabel={false}
          id="marker"
          textValue="Marker"
          width={36}
        >
          <span className="sr-only">Marker</span>
        </Table.Column>
        <Table.Column id="name" rowHeader>
          Name
        </Table.Column>
        <Table.Column align="end" id="amount" width="max-content">
          <span>Amount</span>
        </Table.Column>
        <Table.Column
          compactLabel={false}
          id="action"
          textValue="Action"
          width="1.25rem"
        >
          <span className="sr-only">Action</span>
        </Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row id="record" textValue="Example record">
          <Table.Cell column="marker">
            <span className="flex size-9 items-center justify-center">A</span>
          </Table.Cell>
          <Table.Cell column="name">Example record</Table.Cell>
          <Table.Cell align="end" column="amount">
            <span>£10.00</span>
          </Table.Cell>
          <Table.Disclosure column="action" position="flow" />
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

function VirtualizedTable({
  compactHiddenState = false,
  expandedState = false,
}: Readonly<{
  compactHiddenState?: boolean;
  expandedState?: boolean;
}>) {
  const firstState = expandedState
    ? 'Ready with a detailed status that wraps onto several lines'
    : 'Ready';

  return (
    <Table.Root
      aria-label="Virtual data"
      compactHiddenColumns={compactHiddenState ? ['state'] : undefined}
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
        <Table.Row id={1} textValue={`Alpha ${firstState}`}>
          <Table.Cell column="name">Alpha</Table.Cell>
          <Table.Cell column="state">{firstState}</Table.Cell>
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

const virtualizedBoundaryRows = Array.from({ length: 20 }, (_, index) => ({
  amount: `£${index + 1}`,
  id: index + 1,
  name: `Record ${index + 1}`,
}));

function VirtualizedBoundaryTable() {
  return (
    <Table.Root
      aria-label="Virtual boundary records"
      compactHiddenColumns={['marker', 'actions']}
      layout="grid"
      virtualization={{
        estimatedRowHeight: 52,
        mode: 'variable',
        overscan: 0,
        viewportHeight: 156,
      }}
    >
      <Table.Header>
        <Table.Column id="marker">Marker</Table.Column>
        <Table.Column id="name" rowHeader>
          Name
        </Table.Column>
        <Table.Column id="amount">Amount</Table.Column>
        <Table.Column id="actions">Actions</Table.Column>
      </Table.Header>
      <Table.Body items={virtualizedBoundaryRows}>
        {(row) => (
          <Table.Row id={row.id} textValue={`${row.name} ${row.amount}`}>
            <Table.Cell column="marker">Marker {row.id}</Table.Cell>
            <Table.Cell column="name">{row.name}</Table.Cell>
            <Table.Cell column="amount">{row.amount}</Table.Cell>
            <Table.Cell column="actions">Actions {row.id}</Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table.Root>
  );
}

async function expectVirtualizedTableGeometry(
  canvasElement: HTMLElement,
  compactHiddenState = false,
) {
  const canvas = within(canvasElement);
  const table = canvas.getByRole('grid', { name: 'Virtual data' });
  const firstRow = canvas.getByRole('row', { name: 'Alpha' });
  const secondRow = canvas.getByRole('row', { name: 'Beta' });
  const firstCell = canvas.getByRole('rowheader', { name: 'Alpha' });
  const secondCell = compactHiddenState
    ? canvas.getByText(/Ready/)
    : canvas.getByRole('gridcell', { name: 'Ready' });
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

    if (compactHiddenState) {
      await expect(secondCellRectangle.width).toBe(0);
      await expect(firstRowRectangle.bottom).toBeGreaterThanOrEqual(
        secondRowRectangle.y,
      );
    } else {
      await expect(firstCellRectangle.width).toBe(secondCellRectangle.width);
      await expect(firstCellRectangle.x).toBe(secondCellRectangle.x);
      await expect(secondCellRectangle.y).toBeGreaterThan(firstCellRectangle.y);
      await expect(firstRowRectangle.bottom).toBeLessThanOrEqual(
        secondRowRectangle.y,
      );
    }
    await expect(table.scrollWidth).toBe(table.clientWidth);

    return;
  }

  const firstHeading = canvas.getByRole('columnheader', { name: 'Name' });
  const secondHeading = canvas.getByRole('columnheader', { name: 'State' });
  const firstHeadingRectangle = firstHeading.getBoundingClientRect();
  const secondHeadingRectangle = secondHeading.getBoundingClientRect();
  const secondRowRectangle = secondRow.getBoundingClientRect();

  await expect(firstCellRectangle.width).toBe(firstHeadingRectangle.width);
  await expect(secondCellRectangle.width).toBe(secondHeadingRectangle.width);
  await expect(firstCellRectangle.right).toBe(secondCellRectangle.left);
  await expect(firstRowRectangle.bottom).toBeLessThanOrEqual(
    secondRowRectangle.y,
  );
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
  render: () => <VirtualizedTable />,
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
    expectVirtualizedTableGeometry(canvasElement, true),
  render: () => <VirtualizedTable compactHiddenState />,
};

/**
 * Keeps desktop row measurement aligned with viewport-driven responsive CSS
 * when the virtualized table itself is narrower than the small breakpoint.
 *
 * @summary narrow desktop virtualization keeps visible cells in measurement
 */
export const VariableVirtualizationNarrowDesktop: Story = {
  args: { 'aria-label': 'Virtual data', children: null },
  play: async ({ canvasElement }) =>
    expectVirtualizedTableGeometry(canvasElement, true),
  render: () => (
    <div style={{ width: 320 }}>
      <VirtualizedTable compactHiddenState expandedState />
    </div>
  ),
};

/**
 * Preserves collection-wide modified Home and End navigation while compact
 * boundary columns are hidden and rows are windowed.
 *
 * @summary virtualized compact navigation reaches collection boundaries
 */
export const VariableVirtualizationCompactBoundaries: Story = {
  args: { 'aria-label': 'Virtual boundary records', children: null },
  globals: { viewport: { value: 'mobile1' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstName = canvas.getByRole('rowheader', { name: 'Record 1' });

    await userEvent.click(firstName);
    await fireEvent.keyDown(firstName, {
      ctrlKey: true,
      key: 'End',
      metaKey: true,
    });
    await waitFor(() =>
      expect(canvas.getByRole('gridcell', { name: '£20' })).toHaveFocus(),
    );
    const lastAmount = canvas.getByRole('gridcell', { name: '£20' });

    await fireEvent.keyDown(lastAmount, {
      ctrlKey: true,
      key: 'Home',
      metaKey: true,
    });
    await waitFor(() =>
      expect(canvas.getByRole('rowheader', { name: 'Record 1' })).toHaveFocus(),
    );
  },
  render: VirtualizedBoundaryTable,
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
