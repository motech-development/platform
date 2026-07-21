import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { ToggleButton } from '../ToggleButton/ToggleButton';
import { ToggleGroup } from './ToggleGroup';

describe('ToggleGroup', () => {
  it('reports semantic selections and applies single selection', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();

    renderBreeze(
      <ToggleGroup onSelectionChange={onSelectionChange}>
        <ToggleButton value="grid">Grid</ToggleButton>
        <ToggleButton value="list">List</ToggleButton>
      </ToggleGroup>,
    );
    await user.click(screen.getByRole('radio', { name: 'List' }));

    expect(onSelectionChange).toHaveBeenCalledWith(['list']);
    expect(screen.getByRole('radio', { name: 'List' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('supports multiple selection and vertical arrow navigation', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <ToggleGroup defaultSelection={['bold']} multiple orientation="vertical">
        <ToggleButton value="bold">Bold</ToggleButton>
        <ToggleButton value="italic">Italic</ToggleButton>
      </ToggleGroup>,
    );
    const bold = screen.getByRole('button', { name: 'Bold' });
    const italic = screen.getByRole('button', { name: 'Italic' });

    bold.focus();
    await user.keyboard('{ArrowDown}{Enter}');

    expect(italic).toHaveFocus();
    expect(bold).toHaveAttribute('aria-pressed', 'true');
    expect(italic).toHaveAttribute('aria-pressed', 'true');
  });
});
