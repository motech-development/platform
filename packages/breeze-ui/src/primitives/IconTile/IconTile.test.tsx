import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { ArrowLeftIcon, CalendarIcon } from '../../icons';
import { IconTile } from './IconTile';

describe('IconTile', () => {
  it('keeps its visual icon out of the accessibility tree', () => {
    renderBreeze(
      <IconTile data-testid="tile">
        <CalendarIcon />
      </IconTile>,
    );

    expect(screen.getByTestId('tile')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('supports a circular borderless neutral marker', () => {
    renderBreeze(
      <IconTile
        bordered={false}
        data-testid="direction"
        shape="circle"
        size="sm"
        variant="neutral"
      >
        <ArrowLeftIcon />
      </IconTile>,
    );

    expect(screen.getByTestId('direction')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(screen.getByTestId('direction')).toHaveClass(
      'border-0',
      'rounded-full',
      'size-9',
    );
  });

  it('keeps meaningful marker content in the accessibility tree', () => {
    renderBreeze(
      <IconTile
        bordered={false}
        decorative={false}
        data-testid="status-code"
        size="lg"
      >
        404
      </IconTile>,
    );

    const statusCode = screen.getByTestId('status-code');

    expect(statusCode).not.toHaveAttribute('aria-hidden');
    expect(statusCode).toHaveTextContent('404');
  });
});
