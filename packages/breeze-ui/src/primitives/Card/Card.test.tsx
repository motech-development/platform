import { render, screen, within } from '@testing-library/react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Link } from '../Link/Link';
import { Card, type CardProps } from './Card';

expectTypeOf<CardProps>().not.toHaveProperty('className');
expectTypeOf<CardProps>().not.toHaveProperty('loading');
expectTypeOf<CardProps>().not.toHaveProperty('style');
expectTypeOf<CardProps['padding']>().toEqualTypeOf<
  0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | undefined
>();
expectTypeOf<{
  children: string;
  count: number;
}>().not.toMatchTypeOf<CardProps>();
expectTypeOf<{
  'aria-label': string;
  children: string;
  title: string;
}>().not.toMatchTypeOf<CardProps>();

describe('Card', () => {
  it('requires a BreezeProvider', () => {
    expect(() => render(<Card>Balance</Card>)).toThrow(
      'Breeze components must be rendered within BreezeProvider.',
    );
  });

  it('creates a labelled article when requested', () => {
    renderBreeze(
      <Card element="article" aria-label="Current balance">
        £24,180.50
      </Card>,
    );

    expect(
      screen.getByRole('article', { name: 'Current balance' }),
    ).toHaveTextContent('£24,180.50');
  });

  it('gives a labelled default card nameable group semantics', () => {
    renderBreeze(<Card aria-label="Current balance">£24,180.50</Card>);

    expect(
      screen.getByRole('group', { name: 'Current balance' }),
    ).toBeInTheDocument();
  });

  it('names a titled section by its second-level heading', () => {
    renderBreeze(
      <Card element="section" title="Needs you">
        Nothing needs you right now
      </Card>,
    );

    const region = screen.getByRole('region', { name: 'Needs you' });

    expect(
      within(region).getByRole('heading', { level: 2, name: 'Needs you' }),
    ).toBeInTheDocument();
    expect(region).toHaveTextContent('Nothing needs you right now');
  });

  it('gives a titled default card group semantics', () => {
    renderBreeze(<Card title="Needs you">Content</Card>);

    expect(
      screen.getByRole('group', { name: 'Needs you' }),
    ).toBeInTheDocument();
  });

  it('shows the count beside the title without changing its name', () => {
    renderBreeze(
      <Card count={2} element="section" title="Needs you">
        Content
      </Card>,
    );

    const heading = screen.getByRole('heading', { name: 'Needs you' });

    expect(heading.nextElementSibling).toHaveTextContent('2');
    expect(
      screen.getByRole('region', { name: 'Needs you' }),
    ).toBeInTheDocument();
  });

  it('renders a trailing action in the header', () => {
    renderBreeze(
      <Card
        action={<Link href="/money">View all money</Link>}
        element="section"
        title="Recent activity"
      >
        Content
      </Card>,
    );

    const heading = screen.getByRole('heading', { name: 'Recent activity' });

    expect(
      within(heading.parentElement as HTMLElement).getByRole('link', {
        name: 'View all money',
      }),
    ).toHaveAttribute('href', '/money');
  });

  it('applies padding to the content below a title', () => {
    renderBreeze(
      <Card element="section" padding={0} title="Recent activity">
        <span>Rows</span>
      </Card>,
    );

    const region = screen.getByRole('region', { name: 'Recent activity' });

    expect(screen.getByText('Rows').parentElement).toHaveClass('breeze:p-0');
    expect(region).not.toHaveClass('breeze:p-breeze-4');
  });

  it('applies padding to the card when untitled', () => {
    renderBreeze(<Card aria-label="Balance">Content</Card>);

    expect(screen.getByRole('group', { name: 'Balance' })).toHaveClass(
      'breeze:p-breeze-4',
    );
  });
});
