import { screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders status content and native attributes', () => {
    const ref = createRef<HTMLSpanElement>();

    renderBreeze(
      <Badge ref={ref} title="Current state">
        Active
      </Badge>,
    );

    expect(screen.getByText('Active')).toHaveAttribute(
      'title',
      'Current state',
    );
    expect(ref.current).toHaveTextContent('Active');
  });
});
