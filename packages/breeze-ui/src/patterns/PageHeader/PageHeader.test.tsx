import { render, screen } from '@testing-library/react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { PageHeader, type PageHeaderProps } from './PageHeader';

expectTypeOf<PageHeaderProps>().not.toHaveProperty('className');
expectTypeOf<PageHeaderProps>().not.toHaveProperty('style');

describe('PageHeader', () => {
  it('renders a level-one title with optional description and actions', () => {
    render(
      <BreezeProvider locale="en-GB">
        <PageHeader
          actions={<button type="button">Export</button>}
          description="Review recent account activity."
          title="Activity"
        />
      </BreezeProvider>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Activity' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Review recent account activity.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument();
  });

  it('renders without optional content', () => {
    render(
      <BreezeProvider locale="en-GB">
        <PageHeader title="Activity" />
      </BreezeProvider>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Activity' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
