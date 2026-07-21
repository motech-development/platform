import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Button } from '../Button/Button';
import { Toolbar } from './Toolbar';

describe('Toolbar', () => {
  it('provides toolbar semantics and arrow-key navigation', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <Toolbar aria-label="Editor actions">
        <Button>Undo</Button>
        <Button>Redo</Button>
      </Toolbar>,
    );
    const undo = screen.getByRole('button', { name: 'Undo' });
    const redo = screen.getByRole('button', { name: 'Redo' });

    expect(
      screen.getByRole('toolbar', { name: 'Editor actions' }),
    ).toBeInTheDocument();
    undo.focus();
    await user.keyboard('{ArrowRight}');
    expect(redo).toHaveFocus();
  });
});
