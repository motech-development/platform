import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { RelativeTime } from './RelativeTime';

describe('RelativeTime', () => {
  it('formats an application-calculated duration using provider locale', () => {
    renderBreeze(
      <RelativeTime options={{ numeric: 'auto' }} unit="day" value={-1} />,
    );

    expect(screen.getByText('yesterday')).toBeVisible();
  });
});
