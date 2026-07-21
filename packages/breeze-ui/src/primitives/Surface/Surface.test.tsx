import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { Surface } from './Surface';

describe('Surface', () => {
  it('uses a constrained semantic element when content needs a landmark', () => {
    render(
      <BreezeProvider locale="en-GB">
        <Surface aria-label="Summary" as="section">
          Summary content
        </Surface>
      </BreezeProvider>,
    );

    expect(screen.getByRole('region', { name: 'Summary' }).tagName).toBe(
      'SECTION',
    );
  });

  it('renders a neutral container by default', () => {
    const ref = createRef<HTMLElement>();

    render(
      <BreezeProvider locale="en-GB">
        <Surface data-testid="surface" ref={ref}>
          Content
        </Surface>
      </BreezeProvider>,
    );

    expect(screen.getByTestId('surface').tagName).toBe('DIV');
    expect(ref.current).toBe(screen.getByTestId('surface'));
  });

  it('forwards callback refs to a semantic surface', () => {
    const ref = vi.fn();

    render(
      <BreezeProvider locale="en-GB">
        <Surface as="article" ref={ref}>
          Article
        </Surface>
      </BreezeProvider>,
    );

    expect(ref).toHaveBeenCalledWith(screen.getByRole('article'));
  });

  it('keeps a callback ref attached across rerenders', () => {
    const ref = vi.fn();
    const { rerender } = render(
      <BreezeProvider locale="en-GB">
        <Surface ref={ref}>Initial content</Surface>
      </BreezeProvider>,
    );

    rerender(
      <BreezeProvider locale="en-GB">
        <Surface ref={ref}>Updated content</Surface>
      </BreezeProvider>,
    );

    expect(ref).toHaveBeenCalledTimes(1);
  });
});
