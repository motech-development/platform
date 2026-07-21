import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { Container } from './Container';

describe('Container', () => {
  it('provides a bounded landmark-ready workspace with native attributes', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <BreezeProvider locale="en-GB">
        <Container
          aria-label="Workspace"
          className="application-placement"
          ref={ref}
        >
          Content
        </Container>
      </BreezeProvider>,
    );

    const container = screen.getByLabelText('Workspace');

    expect(container).toHaveTextContent('Content');
    expect(container).toHaveClass('application-placement');
    expect(ref.current).toBe(container);
  });

  it('requires the shared Breeze environment', () => {
    expect(() => render(<Container>Content</Container>)).toThrow(
      'Breeze components must be rendered within BreezeProvider.',
    );
  });
});
