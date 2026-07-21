import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { Inline } from './Inline';

describe('Inline', () => {
  it('groups related inline content and forwards native attributes', () => {
    render(
      <BreezeProvider locale="en-GB">
        <Inline aria-label="Actions" data-testid="actions">
          <button type="button">Cancel</button>
          <button type="button">Save</button>
        </Inline>
      </BreezeProvider>,
    );

    const actions = screen.getByTestId('actions');

    expect(actions).toHaveAccessibleName('Actions');
    expect(actions).toContainElement(
      screen.getByRole('button', { name: 'Save' }),
    );
  });
});
