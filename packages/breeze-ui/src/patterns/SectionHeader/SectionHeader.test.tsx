import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Button } from '../../primitives/Button/Button';
import { SectionHeader } from './SectionHeader';

describe('SectionHeader', () => {
  it('renders a section heading, context, and related action', () => {
    renderBreeze(
      <SectionHeader
        action={<Button appearance="ghost">View all records</Button>}
        description="Latest activity"
        title="Recent records"
      />,
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Recent records' }),
    ).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'View all records' }),
    ).toBeVisible();
  });
});
