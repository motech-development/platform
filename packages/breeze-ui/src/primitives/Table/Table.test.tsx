import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import stubIntersectionObserver from '../../../test/stubIntersectionObserver';
import { Button } from '../Button/Button';
import { Table } from './Table';

let toggleVisibleColumns: () => void = () => undefined;

const tableRows = [{ id: 'ada', name: 'Ada', role: 'Engineer' }];
const tableColumns = [
  { id: 'role', label: 'Role', rowHeader: false },
  { id: 'name', label: 'Name', rowHeader: true },
];

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

  it('supports a grid layout without changing table semantics', () => {
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
    expect(table.style.getPropertyValue('--breeze-table-column-count')).toBe(
      '2',
    );
    expect(table.className).not.toContain('md:');
    expect(screen.getByRole('columnheader', { name: 'State' })).toBeVisible();
    expect(screen.getByRole('rowheader', { name: 'Ada' })).toBeVisible();
    const row = screen.getByRole('row', { name: 'Ada' });

    expect(row).toHaveAttribute('aria-describedby', 'ada-description');
  });

  it('supports desktop grid tracks while retaining responsive card rows', () => {
    renderBreeze(
      <Table.Root aria-label="Responsive grid records" layout="responsiveGrid">
        <Table.Header>
          <Table.Column id="name" rowHeader>
            Name
          </Table.Column>
          <Table.Column id="state">State</Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row id="ada" textValue="Ada Ready">
            <Table.Cell column="name">Ada</Table.Cell>
            <Table.Cell column="state">Ready</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );

    const table = screen.getByRole('grid', {
      name: 'Responsive grid records',
    });

    expect(table).toHaveAttribute('data-layout', 'responsiveGrid');
    expect(table).toHaveClass(
      '[&>tbody>tr]:flex',
      '[&>tbody>tr]:flex-col',
      'sm:!block',
      'sm:[&>thead>tr]:!grid',
      'sm:[&>tbody>tr]:!grid',
      'sm:[&>tbody>tr]:gap-x-4',
      'sm:[&>tbody>tr]:px-6',
    );
  });

  it('owns grid row dividers and constrained action-column widths', async () => {
    renderBreeze(
      <Table.Root aria-label="Reports" layout="grid">
        <Table.Header>
          <Table.Column id="name" rowHeader>
            Name
          </Table.Column>
          <Table.Column compactLabel={false} id="actions" width="control">
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
    expect(actionsHeading).toHaveClass('w-44');
    expect(actionsHeading).not.toHaveClass('px-0');
    expect(actionsCell).toHaveClass(
      'before:hidden',
      'before:leading-[1.4]',
      'data-[label]:before:inline-block',
      'data-[label]:before:content-[attr(data-label)]',
      'sm:data-[label]:before:hidden',
      'sm:data-[breeze-column-width=control]:w-44',
      'sm:data-[breeze-column-width=control]:[&>a]:whitespace-nowrap',
      'sm:data-[breeze-column-width=control]:[&>button]:whitespace-nowrap',
    );
    await waitFor(() => {
      expect(actionsCell).toHaveAttribute(
        'data-breeze-column-width',
        'control',
      );
    });
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
          <Table.Column compactLabel={false} id="actions" width="icon">
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
          <Table.Column compactLabel={false} id="actions" width="icon">
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
