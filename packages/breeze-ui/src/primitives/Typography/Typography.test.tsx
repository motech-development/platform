import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Typography } from './Typography';

describe('Typography', () => {
  it('renders body copy as a paragraph by default', () => {
    renderBreeze(<Typography>Body copy</Typography>);

    expect(screen.getByText('Body copy').tagName).toBe('P');
  });

  it('renders constrained semantics with native attributes and a ref', () => {
    const ref = createRef<HTMLElement>();

    renderBreeze(
      <Typography as="h3" id="title" ref={ref}>
        Heading
      </Typography>,
    );

    const heading = screen.getByRole('heading', { level: 3 });

    expect(heading).toHaveAttribute('id', 'title');
    expect(ref.current).toBe(heading);
  });

  it('applies semantic primary and muted inverse colours', () => {
    renderBreeze(
      <div>
        <Typography colour="primary">Primary</Typography>
        <Typography colour="inverse-muted">Muted inverse</Typography>
      </div>,
    );

    expect(screen.getByText('Primary')).toHaveClass(
      'text-[var(--breeze-primary)]',
    );
    expect(screen.getByText('Muted inverse')).toHaveClass(
      'text-[var(--breeze-ink-inverse-muted)]',
    );
  });

  it('provides a responsive summary-value level', () => {
    renderBreeze(
      <Typography level="summary" tabularNumbers>
        £1,042.16
      </Typography>,
    );

    expect(screen.getByText('£1,042.16')).toHaveClass(
      'font-[family-name:var(--breeze-font-display)]',
      'text-xl',
      'sm:text-2xl',
      'font-bold',
      'tabular-nums',
    );
  });

  it('inherits container alignment unless explicitly overridden', () => {
    renderBreeze(
      <div className="text-end">
        <Typography>Inherited alignment</Typography>
        <Typography align="start">Explicit alignment</Typography>
      </div>,
    );

    expect(screen.getByText('Inherited alignment')).not.toHaveClass(
      'text-start',
    );
    expect(screen.getByText('Inherited alignment')).not.toHaveClass(
      'text-center',
    );
    expect(screen.getByText('Inherited alignment')).not.toHaveClass('text-end');
    expect(screen.getByText('Explicit alignment')).toHaveClass('text-start');
  });

  it('requires BreezeProvider', () => {
    expect(() => render(<Typography>Text</Typography>)).toThrow(
      'Breeze components must be rendered within BreezeProvider.',
    );
  });
});
