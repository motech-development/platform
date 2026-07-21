import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Button } from '../../primitives/Button/Button';
import { ButtonGroup } from './ButtonGroup';

describe('ButtonGroup', () => {
  it('groups related actions without changing their semantics', () => {
    renderBreeze(
      <ButtonGroup aria-label="Record actions">
        <Button>Cancel</Button>
        <Button>Save record</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole('group', { name: 'Record actions' })).toBeVisible();
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('can place the primary action first only in compact visual flow', () => {
    renderBreeze(
      <ButtonGroup
        aria-label="Responsive record actions"
        orientation={{ base: 'verticalReverse', sm: 'horizontal' }}
      >
        <Button appearance="outline">View pending</Button>
        <Button>Record transaction</Button>
      </ButtonGroup>,
    );

    expect(
      screen.getByRole('group', { name: 'Responsive record actions' }),
    ).toHaveClass('flex-col-reverse', 'sm:flex-row');
    expect(
      screen.getAllByRole('button').map(({ textContent }) => textContent),
    ).toEqual(['View pending', 'Record transaction']);
  });
});
