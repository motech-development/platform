import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrictMode, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import stubIntersectionObserver from '../../../test/stubIntersectionObserver';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { Button } from '../Button/Button';
import { Table } from './Table';

let toggleVisibleColumns: () => void = () => undefined;
let expandCompactSpan: () => void = () => undefined;
let changeCellColumn: () => void = () => undefined;
let removeSetBackedRoleColumn: () => void = () => undefined;

const tableRows = [{ id: 'ada', name: 'Ada', role: 'Engineer' }];
const tableColumns = [
  { id: 'role', label: 'Role', rowHeader: false },
  { id: 'name', label: 'Name', rowHeader: true },
];

function* generatedTableColumns(
  columns: readonly {
    id: string;
    label: string;
    rowHeader: boolean;
  }[],
) {
  yield* columns;
}

function oneShotTableColumns(
  columns: readonly {
    id: string;
    label: string;
    rowHeader: boolean;
  }[],
) {
  const iterator = generatedTableColumns(columns);

  return { [Symbol.iterator]: () => iterator };
}

function ReorderedColumnsHarness() {
  const [showRole, setShowRole] = useState(true);
  const columns = showRole ? tableColumns : tableColumns.slice(1);

  toggleVisibleColumns = () => setShowRole((value) => !value);

  return (
    <Table.Root aria-label="Reordered people">
      <Table.Header items={columns}>
        {(column) => (
          <Table.Column id={column.id} rowHeader={column.rowHeader}>
            {column.label}
          </Table.Column>
        )}
      </Table.Header>
      <Table.Body items={tableRows}>
        {(row) => (
          <Table.Row id={row.id} textValue={`${row.role} ${row.name}`}>
            {columns.map((column) => (
              <Table.Cell column={column.id} key={column.id}>
                {row[column.id as 'name' | 'role']}
              </Table.Cell>
            ))}
          </Table.Row>
        )}
      </Table.Body>
    </Table.Root>
  );
}

function SetBackedColumnsHarness() {
  const [columns] = useState(() => new Set(tableColumns));
  const [, setRevision] = useState(0);

  removeSetBackedRoleColumn = () => {
    columns.delete(tableColumns[0]);
    setRevision((value) => value + 1);
  };

  return (
    <Table.Root aria-label="Set-backed people">
      <Table.Header items={columns}>
        {(column) => (
          <Table.Column id={column.id} rowHeader={column.rowHeader}>
            {column.label}
          </Table.Column>
        )}
      </Table.Header>
      <Table.Body items={tableRows}>
        {(row) => (
          <Table.Row id={row.id} textValue={`${row.role} ${row.name}`}>
            {Array.from(columns, (column) => (
              <Table.Cell column={column.id} key={column.id}>
                {row[column.id as 'name' | 'role']}
              </Table.Cell>
            ))}
          </Table.Row>
        )}
      </Table.Body>
    </Table.Root>
  );
}

function StatefulCompactSpanRow() {
  const [colSpan, setColSpan] = useState(2);

  expandCompactSpan = () => setColSpan(3);

  return (
    <Table.Row id="total" textValue="Total">
      <Table.Cell colSpan={colSpan} column="column-0">
        Total
      </Table.Cell>
      {colSpan === 2 ? (
        <Table.Cell column="column-2">Remainder</Table.Cell>
      ) : null}
    </Table.Row>
  );
}

function StatefulColumnCell() {
  const [column, setColumn] = useState<'date' | 'name'>('name');

  changeCellColumn = () => setColumn('date');

  return <Table.Cell column={column}>Value</Table.Cell>;
}

describe('Table', () => {
  it('applies an optional strong lower boundary to the table root', () => {
    renderBreeze(
      <Table.Root aria-label="Bounded items" boundary="strong">
        <Table.Header>
          <Table.Column id="name" rowHeader>
            Name
          </Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row id="one" textValue="One">
            <Table.Cell column="name">One</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );

    const table = screen.getByRole('grid', { name: 'Bounded items' });

    expect(table.tagName).toBe('TABLE');
    expect(table).toHaveAttribute('data-boundary', 'strong');
    expect(table).toHaveClass(
      'min-w-0',
      'border-b-2',
      'border-[var(--breeze-border-strong)]',
      'bg-[var(--breeze-surface)]',
    );
  });

  it('leaves the table boundary unset by default', () => {
    renderBreeze(
      <Table.Root aria-label="Unbounded items">
        <Table.Header>
          <Table.Column id="name" rowHeader>
            Name
          </Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row id="aurora" textValue="Aurora">
            <Table.Cell column="name">Aurora</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );

    const table = screen.getByRole('grid', { name: 'Unbounded items' });

    expect(table).toHaveAttribute('data-boundary', 'none');
    expect(table).not.toHaveClass('border-b-2');
  });

  it('supports a grid layout without changing table semantics', async () => {
    renderBreeze(
      <Table.Root aria-label="Grid records" layout="grid">
        <Table.Header>
          <Table.Column id="name" rowHeader>
            Name
          </Table.Column>
          <Table.Column id="state">State</Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row
            aria-describedby="ada-description"
            id="ada"
            textValue="Ada Ready"
          >
            <Table.Cell column="name">Ada</Table.Cell>
            <Table.Cell column="state">Ready</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );

    const table = screen.getByRole('grid', { name: 'Grid records' });

    expect(table.tagName).toBe('TABLE');
    expect(table).toHaveAttribute('data-layout', 'grid');
    expect(table).toHaveClass(
      '!grid',
      '[&>tbody]:grid-cols-subgrid',
      'sm:[&>thead>tr]:grid',
      'sm:[&>thead>tr]:grid-cols-subgrid',
      'sm:[&>thead>tr>th]:block',
    );
    await waitFor(() => {
      expect(table).toHaveStyle(
        '--breeze-table-columns: minmax(0, 1fr) minmax(0, 1fr)',
      );
    });
    expect(table.className).not.toContain('md:');
    expect(screen.getByRole('columnheader', { name: 'State' })).toBeVisible();
    expect(screen.getByRole('rowheader', { name: 'Ada' })).toBeVisible();
    const row = screen.getByRole('row', { name: 'Ada' });

    expect(row).toHaveAttribute('aria-describedby', 'ada-description');
  });

  it('forwards native multi-column spans in grid layouts', () => {
    renderBreeze(
      <Table.Root aria-label="Transaction totals" layout="grid">
        <Table.Header>
          <Table.Column id="direction" rowHeader>
            Direction
          </Table.Column>
          <Table.Column id="transaction">Transaction</Table.Column>
          <Table.Column id="category">Category</Table.Column>
          <Table.Column id="amount">Amount</Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row id="total" textValue="24 December 2024 £1,300">
            <Table.Cell colSpan={3} column="direction">
              24 December 2024
            </Table.Cell>
            <Table.Cell column="amount">£1,300</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );

    const dateCell = screen.getByRole('rowheader', {
      name: '24 December 2024',
    });

    expect(dateCell).toHaveAttribute('colspan', '3');
  });

  it('recomputes compact spans after a mounted cell span changes', async () => {
    renderBreeze(
      <Table.Root
        aria-label="Changing spans"
        compactHiddenColumns={['column-1']}
        layout="grid"
      >
        <Table.Header>
          <Table.Column id="column-0" rowHeader>
            First
          </Table.Column>
          <Table.Column id="column-1">Second</Table.Column>
          <Table.Column id="column-2">Third</Table.Column>
        </Table.Header>
        <Table.Body>
          <StatefulCompactSpanRow />
        </Table.Body>
      </Table.Root>,
    );

    const cell = screen.getByRole('rowheader', { name: 'Total' });

    await waitFor(() => {
      expect(
        cell.style.getPropertyValue('--breeze-table-compact-column-span'),
      ).toBe('span 1 / span 1');
    });

    act(() => expandCompactSpan());

    await waitFor(() => {
      expect(cell).toHaveAttribute('colspan', '3');
      expect(
        cell.style.getPropertyValue('--breeze-table-compact-column-span'),
      ).toBe('span 2 / span 2');
    });
  });

  it('resynchronises metadata when a mounted cell changes columns', async () => {
    renderBreeze(
      <Table.Root
        aria-label="Changing cell columns"
        compactHiddenColumns="date"
        layout="grid"
      >
        <Table.Header>
          <Table.Column id="name" rowHeader>
            Name
          </Table.Column>
          <Table.Column id="date">Date</Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row id="entry" textValue="Value Date value">
            <StatefulColumnCell />
            <Table.Cell column="date">Date value</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );

    const cell = screen.getByText('Value').closest('td');

    expect(cell).not.toBeNull();

    await waitFor(() => {
      expect(cell).toHaveAttribute('data-label', 'Name:');
    });

    act(() => changeCellColumn());

    await waitFor(() => {
      expect(cell).toHaveAttribute(
        'data-breeze-cell-column-key',
        'string:date',
      );
      expect(cell).toHaveAttribute('data-label', 'Date:');
      expect(cell).toHaveAttribute('data-breeze-compact-hidden', '');
    });
  });

  it.each([
    {
      colSpan: 1.5,
      gridColumn: '',
      normalisedColSpan: 1,
      span: '',
    },
    {
      colSpan: 1001,
      gridColumn: '',
      normalisedColSpan: 1000,
      span: 'span 1000 / span 1000',
    },
  ])(
    'normalises a $colSpan column span for native and grid geometry',
    ({ colSpan, gridColumn, normalisedColSpan, span }) => {
      const columns = Array.from(
        { length: normalisedColSpan },
        (_, index) => `column-${index}`,
      );

      renderBreeze(
        <Table.Root aria-label="Normalised spans" layout="grid">
          <Table.Header>
            {columns.map((column, index) => (
              <Table.Column id={column} key={column} rowHeader={index === 0}>
                Column {index + 1}
              </Table.Column>
            ))}
          </Table.Header>
          <Table.Body>
            <Table.Row id="total" textValue="Total">
              <Table.Cell colSpan={colSpan} column="column-0">
                Total
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>,
      );

      const cell = screen.getByRole('rowheader', { name: 'Total' });

      expect(cell).toHaveAttribute('colspan', String(normalisedColSpan));
      expect(cell.style.gridColumn).toBe(gridColumn);
      expect(cell.style.getPropertyValue('--breeze-table-column-span')).toBe(
        span,
      );
      expect(
        cell.style.getPropertyValue('--breeze-table-compact-column-span'),
      ).toBe(span);
    },
  );

  it('uses explicit responsive grid widths with media-details-action defaults', async () => {
    renderBreeze(
      <Table.Root
        aria-label="Responsive grid records"
        desktopColumns="mediaDetailsAction"
        layout="responsiveGrid"
      >
        <Table.Header>
          <Table.Column compactLabel={false} id="media" width="3rem">
            Media
          </Table.Column>
          <Table.Column id="name" rowHeader>
            Name
          </Table.Column>
          <Table.Column id="state">State</Table.Column>
          <Table.Column id="detail">Detail</Table.Column>
          <Table.Column compactLabel={false} id="action" width={24}>
            Action
          </Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row id="ada" textValue="Ada Ready">
            <Table.Cell column="media">A</Table.Cell>
            <Table.Cell column="name">Ada</Table.Cell>
            <Table.Cell column="state">Ready</Table.Cell>
            <Table.Cell column="detail">Engineer</Table.Cell>
            <Table.Cell column="action">View</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );

    const table = screen.getByRole('grid', {
      name: 'Responsive grid records',
    });

    expect(table).toHaveAttribute('data-layout', 'responsiveGrid');
    await waitFor(() => {
      expect(table).toHaveStyle(
        '--breeze-table-columns: 3rem minmax(0, 1.3fr) minmax(0, 0.8fr) minmax(0, 1.2fr) 24px',
      );
    });
    expect(screen.getByRole('row', { name: 'Ada' })).toBeVisible();
    expect(screen.getAllByRole('columnheader')).toHaveLength(5);
  });

  it('derives equal responsive grid tracks from column widths', async () => {
    renderBreeze(
      <Table.Root aria-label="Responsive records" layout="responsiveGrid">
        <Table.Header>
          <Table.Column id="marker" width="2.25rem">
            Marker
          </Table.Column>
          <Table.Column id="name" rowHeader>
            Name
          </Table.Column>
          <Table.Column compactLabel={false} id="actions" width="1.25rem">
            Action
          </Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row id="ada" textValue="Ada">
            <Table.Cell column="marker">Ready</Table.Cell>
            <Table.Cell column="name">Ada</Table.Cell>
            <Table.Disclosure column="actions" position="flow" />
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );

    const table = screen.getByRole('grid', { name: 'Responsive records' });

    await waitFor(() => {
      expect(table).toHaveStyle(
        '--breeze-table-columns: 2.25rem minmax(0, 1fr) 1.25rem',
      );
    });
    expect(screen.getByRole('columnheader', { name: 'Marker' })).toHaveStyle(
      'width: 2.25rem',
    );
  });

  it('renders compact column visibility and removes its compact grid track', async () => {
    renderBreeze(
      <Table.Root
        aria-label="Scheduled records"
        compactHiddenColumns={['date']}
        layout="grid"
      >
        <Table.Header>
          <Table.Column id="name" rowHeader>
            Name
          </Table.Column>
          <Table.Column id="date">Date</Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row id="subscription" textValue="Subscription 12 August">
            <Table.Cell column="name">Subscription</Table.Cell>
            <Table.Cell column="date">12 August</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );

    const nameCell = screen.getByRole('rowheader', { name: 'Subscription' });
    const dateCell = screen.getByRole('gridcell', { name: '12 August' });
    const table = screen.getByRole('grid', { name: 'Scheduled records' });

    expect(dateCell).toHaveAttribute('data-breeze-compact-hidden', '');
    expect(nameCell).not.toHaveAttribute('data-breeze-compact-hidden');
    expect(dateCell).toHaveClass('max-sm:data-[breeze-compact-hidden]:!hidden');
    await waitFor(() => {
      expect(table).toHaveStyle(
        '--breeze-table-columns: minmax(0, 1fr) minmax(0, 1fr); --breeze-table-compact-columns: minmax(0, 1fr)',
      );
    });
  });

  it('scopes responsive metadata to the owning table', async () => {
    renderBreeze(
      <Table.Root aria-label="Outer records" layout="grid">
        <Table.Header>
          <Table.Column id="name" rowHeader>
            Outer name
          </Table.Column>
          <Table.Column id="details" width="2fr">
            Outer details
          </Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row id="outer" textValue="Outer Nested">
            <Table.Cell column="name">Outer</Table.Cell>
            <Table.Cell column="details">
              <Table.Root aria-label="Nested records" layout="grid">
                <Table.Header>
                  <Table.Column id="name" rowHeader width="10rem">
                    Nested name
                  </Table.Column>
                </Table.Header>
                <Table.Body>
                  <Table.Row id="nested" textValue="Nested">
                    <Table.Cell column="name">Nested</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table.Root>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );

    const outerTable = screen.getByRole('grid', { name: 'Outer records' });
    const outerName = screen.getByRole('rowheader', { name: 'Outer' });

    await waitFor(() => {
      expect(outerTable).toHaveStyle(
        '--breeze-table-columns: minmax(0, 1fr) 2fr',
      );
    });
    expect(outerName).toHaveAttribute('data-label', 'Outer name:');
  });

  it('includes compact-hidden cells in server-rendered markup', () => {
    const markup = renderToStaticMarkup(
      <BreezeProvider locale="en-GB" portalContainer={null}>
        <Table.Root
          aria-label="Server scheduled records"
          compactHiddenColumns={['date']}
          layout="grid"
        >
          <Table.Header>
            <Table.Column id="name" rowHeader>
              Name
            </Table.Column>
            <Table.Column id="date">Date</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row id="subscription" textValue="Subscription 12 August">
              <Table.Cell column="name">Subscription</Table.Cell>
              <Table.Cell column="date">12 August</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </BreezeProvider>,
    );

    expect(markup).toContain(
      'data-breeze-cell-column-key="string:date" data-breeze-compact-hidden=""',
    );
  });

  it('distinguishes fully hidden and mixed spans in server-rendered markup', () => {
    const markup = renderToStaticMarkup(
      <BreezeProvider locale="en-GB" portalContainer={null}>
        <Table.Root
          aria-label="Server spanning visibility"
          compactHiddenColumns={['hidden-a', 'hidden-c', 'hidden-d']}
          layout="grid"
        >
          <Table.Header>
            <Table.Column id="hidden-a" rowHeader>
              Hidden A
            </Table.Column>
            <Table.Column id="visible-b">Visible B</Table.Column>
            <Table.Column id="hidden-c">Hidden C</Table.Column>
            <Table.Column id="hidden-d">Hidden D</Table.Column>
            <Table.Column id="visible-e">Visible E</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row id="entry" textValue="Mixed Hidden Remainder">
              <Table.Cell colSpan={2} column="hidden-a">
                Mixed
              </Table.Cell>
              <Table.Cell colSpan={2} column="hidden-c">
                Hidden
              </Table.Cell>
              <Table.Cell column="visible-e">Remainder</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </BreezeProvider>,
    );
    const container = document.createElement('div');

    container.innerHTML = markup;

    const mixedCell = container.querySelector(
      '[data-breeze-cell-column-key="string:hidden-a"]',
    );
    const hiddenCell = container.querySelector(
      '[data-breeze-cell-column-key="string:hidden-c"]',
    );

    expect(mixedCell).not.toHaveAttribute('data-breeze-compact-hidden');
    expect(mixedCell).toHaveStyle(
      '--breeze-table-compact-column-span: span 1 / span 1',
    );
    expect(hiddenCell).toHaveAttribute('data-breeze-compact-hidden', '');
  });

  it('preserves generator-backed header items in server-rendered span metadata', () => {
    const columns = oneShotTableColumns([
      { id: 'hidden-a', label: 'Hidden A', rowHeader: true },
      { id: 'hidden-b', label: 'Hidden B', rowHeader: false },
    ]);
    const markup = renderToStaticMarkup(
      <BreezeProvider locale="en-GB" portalContainer={null}>
        <Table.Root
          aria-label="Server generator columns"
          compactHiddenColumns={['hidden-a', 'hidden-b']}
          layout="grid"
        >
          <Table.Header items={columns}>
            {(column) => (
              <Table.Column id={column.id} rowHeader={column.rowHeader}>
                {column.label}
              </Table.Column>
            )}
          </Table.Header>
          <Table.Body>
            <Table.Row id="entry" textValue="Hidden span">
              <Table.Cell colSpan={2} column="hidden-a">
                Hidden span
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </BreezeProvider>,
    );
    const container = document.createElement('div');

    container.innerHTML = markup;

    expect(container.querySelectorAll('th')).toHaveLength(2);
    expect(
      container.querySelector(
        '[data-breeze-cell-column-key="string:hidden-a"]',
      ),
    ).toHaveAttribute('data-breeze-compact-hidden', '');
  });

  it('replays generator-backed header items across Strict Mode renders', () => {
    const columns = oneShotTableColumns([
      { id: 'name', label: 'Name', rowHeader: true },
      { id: 'date', label: 'Date', rowHeader: false },
    ]);

    renderBreeze(
      <StrictMode>
        <Table.Root
          aria-label="Strict generator columns"
          compactHiddenColumns="date"
          layout="grid"
        >
          <Table.Header items={columns}>
            {(column) => (
              <Table.Column id={column.id} rowHeader={column.rowHeader}>
                {column.label}
              </Table.Column>
            )}
          </Table.Header>
          <Table.Body>
            <Table.Row id="entry" textValue="Value Date value">
              <Table.Cell column="name">Value</Table.Cell>
              <Table.Cell column="date">Date value</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </StrictMode>,
    );

    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
    expect(
      screen.getByRole('gridcell', { name: 'Date value' }),
    ).toHaveAttribute('data-breeze-compact-hidden', '');
  });

  it('refreshes stable reusable header iterables after mutation', () => {
    renderBreeze(<SetBackedColumnsHarness />);

    expect(screen.getByRole('columnheader', { name: 'Role' })).toBeVisible();
    expect(screen.getByRole('gridcell', { name: 'Engineer' })).toBeVisible();

    act(() => removeSetBackedRoleColumn());

    expect(
      screen.queryByRole('columnheader', { name: 'Role' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('gridcell', { name: 'Engineer' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeVisible();
    expect(screen.getByRole('rowheader', { name: 'Ada' })).toBeVisible();
  });

  it('preserves typed column key identity in compact visibility', async () => {
    renderBreeze(
      <Table.Root
        aria-label="Typed keys"
        compactHiddenColumns={[1]}
        layout="grid"
      >
        <Table.Header>
          <Table.Column id={1} rowHeader width="2rem">
            Numeric
          </Table.Column>
          <Table.Column id="1" width="3rem">
            String
          </Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row id="entry" textValue="Numeric value String value">
            <Table.Cell column={1}>Numeric value</Table.Cell>
            <Table.Cell column="1">String value</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );

    const numericCell = screen.getByRole('rowheader', {
      name: 'Numeric value',
    });
    const stringCell = screen.getByRole('gridcell', { name: 'String value' });
    const table = screen.getByRole('grid', { name: 'Typed keys' });

    expect(numericCell).toHaveAttribute('data-breeze-compact-hidden', '');
    expect(stringCell).not.toHaveAttribute('data-breeze-compact-hidden');
    expect(numericCell).toHaveAttribute('data-breeze-cell-column', '1');
    expect(stringCell).toHaveAttribute('data-breeze-cell-column', '1');
    expect(numericCell).toHaveAttribute(
      'data-breeze-cell-column-key',
      'number:1',
    );
    expect(stringCell).toHaveAttribute(
      'data-breeze-cell-column-key',
      'string:1',
    );
    await waitFor(() => {
      expect(table).toHaveStyle(
        '--breeze-table-columns: 2rem 3rem; --breeze-table-compact-columns: 3rem',
      );
    });
  });

  it('treats a bare string compact-hidden value as one column key', async () => {
    renderBreeze(
      <Table.Root
        aria-label="String hidden key"
        compactHiddenColumns="date"
        layout="grid"
      >
        <Table.Header>
          <Table.Column id="name" rowHeader>
            Name
          </Table.Column>
          <Table.Column id="date">Date</Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row id="entry" textValue="Entry 12 August">
            <Table.Cell column="name">Entry</Table.Cell>
            <Table.Cell column="date">12 August</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );

    const dateCell = screen.getByRole('gridcell', { name: '12 August' });
    const table = screen.getByRole('grid', { name: 'String hidden key' });

    expect(dateCell).toHaveAttribute('data-breeze-compact-hidden', '');
    await waitFor(() => {
      expect(table).toHaveStyle(
        '--breeze-table-compact-columns: minmax(0, 1fr)',
      );
    });
  });

  it('owns grid row dividers and constrained action-column widths', () => {
    renderBreeze(
      <Table.Root aria-label="Reports" layout="grid">
        <Table.Header>
          <Table.Column id="name" rowHeader>
            Name
          </Table.Column>
          <Table.Column compactLabel={false} id="actions" width="11rem">
            Actions
          </Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row id="report" textValue="Report">
            <Table.Cell column="name">Report</Table.Cell>
            <Table.Cell column="actions">
              <Button>Download</Button>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );

    const table = screen.getByRole('grid', { name: 'Reports' });
    const actionsHeading = screen.getByRole('columnheader', {
      name: 'Actions',
    });
    const actionsCell = screen.getByRole('gridcell', { name: 'Download' });

    expect(table).toHaveClass('sm:[&>tbody>tr>td]:!border-0');
    expect(actionsHeading).toHaveStyle('width: 11rem');
    expect(actionsHeading).not.toHaveClass('px-0');
    expect(actionsCell).toHaveClass(
      'before:hidden',
      'before:leading-[1.4]',
      'data-[label]:before:inline-block',
      'data-[label]:before:content-[attr(data-label)]',
      'sm:data-[label]:before:hidden',
    );
    expect(actionsCell).not.toHaveAttribute('data-breeze-column-width');
  });

  it('owns table interaction semantics and derives responsive cell labels from headings', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const onSelectionChange = vi.fn();
    const onSortChange = vi.fn();

    renderBreeze(
      <Table.Root
        aria-label="People"
        onSelectionChange={onSelectionChange}
        onSortChange={onSortChange}
      >
        <Table.Header>
          <Table.Column id="name" rowHeader sortable>
            Name
          </Table.Column>
          <Table.Column id="role">Role</Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row id="ada" onAction={onAction} textValue="Ada Engineer">
            <Table.Cell column="name">Ada</Table.Cell>
            <Table.Cell column="role">Engineer</Table.Cell>
          </Table.Row>
          <Table.Row id="grace" textValue="Grace Admiral">
            <Table.Cell column="name">Grace</Table.Cell>
            <Table.Cell column="role">Admiral</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );

    await waitFor(() => {
      expect(
        screen.getByRole('gridcell', { name: 'Engineer' }),
      ).toHaveAttribute('data-label', 'Role:');
    });

    await user.click(screen.getByRole('columnheader', { name: 'Name' }));
    expect(onSortChange).toHaveBeenCalledWith({
      column: 'name',
      direction: 'ascending',
    });

    const table = screen.getByRole('grid', { name: 'People' });

    table.focus();
    await user.keyboard('{ArrowDown} ');
    expect(onSelectionChange).toHaveBeenLastCalledWith(['ada']);

    await user.dblClick(screen.getByRole('row', { name: 'Ada' }));
    expect(onAction).toHaveBeenCalledWith('ada');
    expect(screen.getByRole('row', { name: 'Ada' })).toHaveClass(
      'cursor-pointer',
      'data-[hovered]:bg-[var(--breeze-table-row-hover)]',
    );
    expect(screen.getByRole('row', { name: 'Grace' })).not.toHaveClass(
      'cursor-pointer',
    );
  });

  it('applies semantic tones and grouped section presentation without changing row behavior', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    renderBreeze(
      <Table.Root aria-label="Transactions" layout="grid">
        <Table.Header>
          <Table.Column id="name" rowHeader>
            Name
          </Table.Column>
          <Table.Column id="amount">Amount</Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row id="date" presentation="section" textValue="11 July total">
            <Table.Cell column="name">11 July</Table.Cell>
            <Table.Cell column="amount">£20</Table.Cell>
          </Table.Row>
          <Table.Row
            id="pending"
            onAction={onAction}
            textValue="Pending £20"
            tone="muted"
          >
            <Table.Cell column="name">Pending</Table.Cell>
            <Table.Cell column="amount">£20</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );

    const sectionRow = screen.getByRole('row', { name: '11 July' });
    const mutedRow = screen.getByRole('row', { name: 'Pending' });

    expect(sectionRow).toHaveAttribute('data-presentation', 'section');
    expect(sectionRow).toHaveAttribute('data-tone', 'default');
    expect(sectionRow).toHaveClass(
      'min-h-11',
      'bg-[var(--breeze-table-section)]',
      '[&>td]:!border-0',
      '[&>td]:!p-0',
      '[&>td]:before:!hidden',
    );
    expect(mutedRow).toHaveAttribute('data-presentation', 'data');
    expect(mutedRow).toHaveAttribute('data-tone', 'muted');
    expect(mutedRow).toHaveClass(
      'bg-[var(--breeze-table-row-muted)]',
      'data-[hovered]:bg-[var(--breeze-table-row-muted-hover)]',
    );

    await user.dblClick(mutedRow);
    expect(onAction).toHaveBeenCalledWith('pending');
  });

  it('normalises bare disclosure geometry and direct activation for non-selectable rows', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    renderBreeze(
      <Table.Root aria-label="Clients">
        <Table.Header>
          <Table.Column id="name" rowHeader>
            Name
          </Table.Column>
          <Table.Column compactLabel={false} id="actions" width="1.25rem">
            Action
          </Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row
            id="northstar"
            onAction={onAction}
            textValue="Northstar Studio"
          >
            <Table.Cell column="name">Northstar Studio</Table.Cell>
            <Table.Disclosure column="actions" />
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );

    const disclosure = screen.getByRole('gridcell');

    expect(disclosure).toHaveClass(
      'absolute',
      'end-4',
      'top-6',
      'h-4',
      'w-4',
      'sm:static',
      'sm:h-auto',
      'sm:self-stretch',
      'sm:w-5',
      '[&>*]:ms-auto',
      '[&>svg]:size-4',
    );
    expect(disclosure.querySelector('svg')).toHaveClass('!block');
    expect(disclosure.querySelector('svg')).toHaveAttribute('width', '16');
    expect(disclosure.querySelector('svg')).toHaveAttribute('height', '16');
    expect(disclosure.querySelector('svg path')).toHaveAttribute(
      'd',
      'M5 12h14',
    );

    await user.click(screen.getByRole('row', { name: 'Northstar Studio' }));

    expect(onAction).toHaveBeenCalledWith('northstar');
  });

  it('keeps the canonical disclosure arrow in an explicit grid track', () => {
    renderBreeze(
      <Table.Root aria-label="Transactions" layout="grid">
        <Table.Header>
          <Table.Column id="name" rowHeader>
            Name
          </Table.Column>
          <Table.Column compactLabel={false} id="actions" width="1.25rem">
            Action
          </Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row id="northstar" textValue="Northstar Studio">
            <Table.Cell column="name">Northstar Studio</Table.Cell>
            <Table.Disclosure column="actions" position="flow" />
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );

    const disclosure = screen.getByRole('gridcell');

    expect(disclosure).not.toHaveClass('absolute');
    expect(disclosure.querySelector('svg')).toHaveAttribute('width', '16');
    expect(disclosure.querySelector('svg path')).toHaveAttribute(
      'd',
      'M5 12h14',
    );
  });

  it('keeps responsive labels aligned when ordered columns are reordered or conditional', () => {
    renderBreeze(<ReorderedColumnsHarness />);

    expect(screen.getByRole('rowheader', { name: 'Ada' })).toHaveAttribute(
      'data-label',
      'Name:',
    );
    expect(screen.getByRole('gridcell', { name: 'Engineer' })).toHaveAttribute(
      'data-label',
      'Role:',
    );

    act(() => toggleVisibleColumns());

    expect(
      screen.queryByRole('gridcell', { name: 'Engineer' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Ada' })).toHaveAttribute(
      'data-label',
      'Name:',
    );
  });

  it('uses column text values for compact labels and suppresses opted-out labels', () => {
    renderBreeze(
      <Table.Root aria-label="Compact label options">
        <Table.Header>
          <Table.Column id="status" rowHeader textValue="Status">
            Current status
          </Table.Column>
          <Table.Column compactLabel={false} id="actions">
            Actions
          </Table.Column>
          <Table.Column id="owner">
            <strong>Owner</strong>
          </Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row id="ready" textValue="Ready Inspect Morgan">
            <Table.Cell column="status">Ready</Table.Cell>
            <Table.Cell column="actions">Inspect</Table.Cell>
            <Table.Cell column="owner">Morgan</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );

    expect(screen.getByRole('rowheader', { name: 'Ready' })).toHaveAttribute(
      'data-label',
      'Status:',
    );
    expect(
      screen.getByRole('gridcell', { name: 'Inspect' }),
    ).not.toHaveAttribute('data-label');
    expect(
      screen.getByRole('gridcell', { name: 'Morgan' }),
    ).not.toHaveAttribute('data-label');
    expect(
      screen.getByRole('columnheader', { name: 'Current status' }),
    ).toBeVisible();
    expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeVisible();
  });

  it('virtualizes variable-height table rows behind the Breeze contract', () => {
    stubIntersectionObserver();
    renderBreeze(
      <Table.Root
        aria-label="Virtual table"
        virtualization={{
          estimatedRowHeight: 52,
          mode: 'variable',
          overscan: 72,
          viewportHeight: 156,
        }}
      >
        <Table.Header>
          <Table.Column id="name" rowHeader>
            Name
          </Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row id="ada" textValue="Ada">
            <Table.Cell column="name">Ada</Table.Cell>
          </Table.Row>
          <Table.LoadMore loading onLoadMore={() => undefined}>
            Loading more rows
          </Table.LoadMore>
        </Table.Body>
      </Table.Root>,
    );

    const table = screen.getByRole('grid', { name: 'Virtual table' });

    expect(table).toHaveAttribute('data-virtualized', 'true');
    expect(table).toHaveStyle({ height: '156px' });
    expect(screen.getByRole('rowheader', { name: 'Ada' })).toBeInTheDocument();
    expect(
      screen.getByRole('row', { name: 'Loading more rows' }),
    ).not.toHaveAttribute('aria-level');

    vi.unstubAllGlobals();
  });
});
