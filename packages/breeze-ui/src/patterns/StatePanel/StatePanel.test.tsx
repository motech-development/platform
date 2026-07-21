import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { WarningIcon } from '../../icons';
import { Button } from '../../primitives/Button/Button';
import { StatePanel } from './StatePanel';

describe('StatePanel', () => {
  it('names a contextual state and retains its recovery action', () => {
    renderBreeze(
      <StatePanel
        action={<Button>Try again</Button>}
        description="Check your connection, then try again."
        icon={<WarningIcon />}
        title="We could not load records"
        variant="danger"
      />,
    );

    expect(
      screen.getByRole('region', { name: 'We could not load records' }),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeVisible();
  });
});
