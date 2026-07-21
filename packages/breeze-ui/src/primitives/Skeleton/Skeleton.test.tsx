import { screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders a non-announcing visual placeholder', () => {
    const { container } = renderBreeze(
      <Skeleton data-testid="skeleton" shape="circle" />,
    );

    const skeleton = screen.getByTestId('skeleton');

    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    expect(skeleton).toHaveAttribute('data-shape', 'circle');
    expect(skeleton).toHaveAttribute('data-tone', 'default');
    expect(container).not.toHaveAccessibleName();
  });

  it('owns default, inverse, and danger loading tones', () => {
    renderBreeze(
      <>
        <Skeleton data-testid="default" />
        <Skeleton data-testid="inverse" tone="inverse" />
        <Skeleton data-testid="danger" tone="danger" />
      </>,
    );

    expect(screen.getByTestId('default')).toHaveClass(
      'bg-[var(--breeze-skeleton)]',
    );
    expect(screen.getByTestId('inverse')).toHaveClass(
      'bg-[var(--breeze-skeleton-inverse)]',
    );
    expect(screen.getByTestId('danger')).toHaveClass(
      'bg-[var(--breeze-skeleton-danger)]',
    );
  });

  it('uses the canonical text height while allowing explicit geometry', () => {
    renderBreeze(
      <>
        <Skeleton data-testid="canonical" />
        <Skeleton className="h-5 w-24" data-testid="explicit" />
      </>,
    );

    expect(screen.getByTestId('canonical')).toHaveClass('h-3.5', 'w-full');
    expect(screen.getByTestId('explicit')).toHaveClass('h-5', 'w-24');
    expect(screen.getByTestId('explicit')).not.toHaveClass('h-3.5');
  });

  it('renders rectangular geometry', () => {
    renderBreeze(<Skeleton data-testid="rectangle" shape="rectangle" />);

    expect(screen.getByTestId('rectangle')).toHaveClass('min-h-16');
    expect(screen.getByTestId('rectangle')).toHaveAttribute(
      'data-shape',
      'rectangle',
    );
  });

  it('renders inline with a typed span ref', () => {
    const ref = createRef<HTMLSpanElement>();

    renderBreeze(
      <h2>
        Loading
        <Skeleton
          as="span"
          className="block h-5 w-40"
          data-testid="inline"
          ref={ref}
        />
      </h2>,
    );

    const skeleton = screen.getByTestId('inline');

    expect(skeleton).toBeInstanceOf(HTMLSpanElement);
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    expect(skeleton).not.toHaveAttribute('as');
    expect(skeleton).toHaveClass(
      'animate-pulse',
      'bg-[var(--breeze-skeleton)]',
      'block',
      'h-5',
      'motion-reduce:animate-none',
      'w-40',
    );
    expect(ref.current).toBe(skeleton);
    expect(screen.getByRole('heading')).toHaveAccessibleName('Loading');
  });
});
