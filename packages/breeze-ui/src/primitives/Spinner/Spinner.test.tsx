import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('announces an application-owned translated label when provided', () => {
    renderBreeze(<Spinner label="Saving changes" variant="success" />);

    const spinner = screen.getByRole('status', { name: 'Saving changes' });

    expect(spinner).toHaveAttribute('data-variant', 'success');
  });

  it('hides a decorative spinner from accessibility APIs', () => {
    const { container } = renderBreeze(<Spinner />);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });
});
