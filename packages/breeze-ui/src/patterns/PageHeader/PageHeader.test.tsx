import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Button } from '../../primitives/Button/Button';
import { Link } from '../../primitives/Link/Link';
import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  it('establishes one page heading with context and actions', () => {
    renderBreeze(
      <PageHeader
        actions={<Button>Create record</Button>}
        description="Review and manage records."
        title="Records"
      />,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Records' }),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Create record' })).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Create record' }).parentElement,
    ).toHaveClass('items-stretch', 'sm:items-start', 'lg:items-end');
    expect(screen.getByRole('banner')).toHaveClass(
      'gap-5',
      'sm:gap-8',
      'pb-6',
      'sm:pb-8',
      'lg:items-end',
    );
    expect(screen.getByText('Review and manage records.')).toHaveClass(
      'leading-[1.4]',
    );
    expect(
      screen.getByRole('heading', { name: 'Records' }).parentElement
        ?.parentElement,
    ).toHaveClass('gap-6');
  });

  it('shrink-wraps back navigation without replacing its focus target', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <PageHeader
        back={<Link href="/records">Back to records</Link>}
        title="Record details"
      />,
    );

    const back = screen.getByRole('link', { name: 'Back to records' });
    const backSlot = back.parentElement;

    expect(backSlot).toHaveAttribute('data-page-header-back');
    expect(backSlot).toHaveClass('justify-self-start');
    expect(backSlot).not.toHaveAttribute('tabindex');
    expect(back).toHaveAttribute('href', '/records');

    await user.tab();

    expect(back).toHaveFocus();
  });
});
