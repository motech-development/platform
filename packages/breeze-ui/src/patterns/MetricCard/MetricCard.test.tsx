import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { FormattedNumber } from '../../formatting/FormattedNumber/FormattedNumber';
import { MetricCard } from './MetricCard';

describe('MetricCard', () => {
  it('presents an application-formatted metric with its label and context', () => {
    renderBreeze(
      <MetricCard
        description="Updated today"
        label="Current total"
        value={
          <FormattedNumber
            options={{ currency: 'GBP', style: 'currency' }}
            value={24862.4}
          />
        }
      />,
    );

    const metric = screen.getByRole('article', { name: 'Current total' });

    expect(metric).toHaveTextContent('Current total£24,862.40Updated today');
  });

  it('labels the article when supporting context is omitted', () => {
    renderBreeze(<MetricCard label="Open projects" value="12" />);

    const metric = screen.getByRole('article', { name: 'Open projects' });

    expect(metric).toHaveTextContent('Open projects12');
    expect(metric).not.toHaveTextContent('Updated');
  });

  it('accepts composed loading placeholders for its label and value', () => {
    renderBreeze(
      <MetricCard
        aria-hidden="true"
        density="spacious"
        label={<span data-testid="loading-label" />}
        tone="inverse"
        value={<span data-testid="loading-value" />}
      />,
    );

    expect(screen.getByTestId('loading-label')).toBeInTheDocument();
    expect(screen.getByTestId('loading-value')).toBeInTheDocument();
    expect(
      screen.getByTestId('loading-label').closest('article'),
    ).toHaveAttribute('aria-hidden', 'true');
  });
});
