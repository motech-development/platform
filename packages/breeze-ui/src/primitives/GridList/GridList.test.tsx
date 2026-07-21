import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { GridList } from './GridList';

let toggleVirtualRowHeight: () => void = () => undefined;

function VirtualGridListHarness() {
  const [expanded, setExpanded] = useState(false);

  toggleVirtualRowHeight = () => setExpanded((value) => !value);

  return (
    <GridList.Root
      aria-label="Virtual records"
      virtualization={{
        estimatedRowHeight: 48,
        mode: 'variable',
        overscan: 64,
        viewportHeight: 120,
      }}
    >
      <GridList.Item id="one" textValue="One">
        One
      </GridList.Item>
      <GridList.Item id="two" textValue="Two">
        {expanded ? 'Two with remeasured content on two lines' : 'Two'}
      </GridList.Item>
      <GridList.Item id="three" textValue="Three">
        Three
      </GridList.Item>
    </GridList.Root>
  );
}

describe('GridList', () => {
  it('supports keyboard navigation, semantic selection, and item actions', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const onSelectionChange = vi.fn();

    renderBreeze(
      <GridList.Root aria-label="People" onSelectionChange={onSelectionChange}>
        <GridList.Item id="ada" textValue="Ada">
          Ada
        </GridList.Item>
        <GridList.Item id="grace" onAction={onAction} textValue="Grace">
          Grace
        </GridList.Item>
      </GridList.Root>,
    );

    const grid = screen.getByRole('grid', { name: 'People' });

    grid.focus();
    await user.keyboard('{ArrowDown} ');

    expect(screen.getByRole('row', { name: 'Grace' })).toHaveFocus();
    expect(onSelectionChange).toHaveBeenLastCalledWith(['grace']);

    await user.dblClick(screen.getByRole('row', { name: 'Grace' }));
    expect(onAction).toHaveBeenCalledWith('grace');
  });

  it('retains focus across virtual-window changes and variable-height remeasurement', () => {
    renderBreeze(<VirtualGridListHarness />);

    const grid = screen.getByRole('grid', { name: 'Virtual records' });
    const focusedRow = screen.getByRole('row', { name: 'Two' });

    focusedRow.focus();
    act(() => {
      grid.scrollTop = 48;
      fireEvent.scroll(grid);
      toggleVirtualRowHeight();
      window.dispatchEvent(new Event('resize'));
    });

    expect(grid).toHaveAttribute('data-virtualized', 'true');
    expect(grid).toHaveStyle({ height: '120px' });
    expect(focusedRow).toHaveFocus();
    expect(focusedRow).toHaveTextContent('remeasured content');
  });
});
