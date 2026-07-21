import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { Separator } from './Separator';

describe('Separator', () => {
  it('announces the orientation of a meaningful vertical separator', () => {
    const ref = createRef<HTMLElement>();

    render(
      <BreezeProvider locale="en-GB">
        <Separator orientation="vertical" ref={ref} />
      </BreezeProvider>,
    );

    expect(screen.getByRole('separator')).toHaveAttribute(
      'aria-orientation',
      'vertical',
    );
    expect(ref.current).toBe(screen.getByRole('separator'));
  });

  it('removes decorative dividers from the accessibility tree', () => {
    render(
      <BreezeProvider locale="en-GB">
        <Separator decorative />
      </BreezeProvider>,
    );

    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
  });

  it('forwards callback refs for horizontal separators', () => {
    const ref = vi.fn();

    render(
      <BreezeProvider locale="en-GB">
        <Separator ref={ref} />
      </BreezeProvider>,
    );

    expect(ref).toHaveBeenCalledWith(screen.getByRole('separator'));
  });

  it('keeps a callback ref attached across rerenders', () => {
    const ref = vi.fn();
    const { rerender } = render(
      <BreezeProvider locale="en-GB">
        <Separator ref={ref} tone="default" />
      </BreezeProvider>,
    );

    rerender(
      <BreezeProvider locale="en-GB">
        <Separator ref={ref} tone="strong" />
      </BreezeProvider>,
    );

    expect(ref).toHaveBeenCalledTimes(1);
  });
});
