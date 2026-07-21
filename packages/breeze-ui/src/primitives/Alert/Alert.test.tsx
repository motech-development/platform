import { screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Alert } from './Alert';

describe('Alert', () => {
  it('announces translated content with consumer-selected urgency and semantic variant', () => {
    const ref = createRef<HTMLDivElement>();

    renderBreeze(
      <Alert announcement="polite" ref={ref} variant="warning">
        <strong>Review needed</strong>
        <span>Translated supporting content</span>
      </Alert>,
    );

    const alert = screen.getByRole('status');

    expect(ref.current).toBe(alert);
    expect(alert).toHaveAttribute('aria-live', 'polite');
    expect(alert).toHaveAttribute('data-variant', 'warning');
    expect(alert).toHaveTextContent(
      'Review neededTranslated supporting content',
    );
  });

  it('uses assertive announcement semantics by default', () => {
    renderBreeze(<Alert>Connection failed</Alert>);

    const alert = screen.getByRole('alert');

    expect(alert).toHaveAttribute('aria-live', 'assertive');
    expect(alert).toHaveAttribute('aria-atomic', 'true');
  });

  it('renders already-present feedback without live-region semantics', () => {
    renderBreeze(<Alert announcement="off">Account information</Alert>);

    const content = screen.getByText('Account information');

    expect(content).not.toHaveAttribute('role');
    expect(content).toHaveAttribute('aria-live', 'off');
    expect(content).not.toHaveAttribute('aria-atomic');
  });

  it('keeps hidden loading placeholders out of the accessibility tree', () => {
    renderBreeze(
      <Alert announcement="off" aria-hidden="true" data-testid="loading-alert">
        Loading account information
      </Alert>,
    );

    const alert = screen.getByTestId('loading-alert');

    expect(alert).toHaveAttribute('aria-hidden', 'true');
    expect(alert).toHaveAttribute('aria-live', 'off');
    expect(alert).not.toHaveAttribute('role');
    expect(alert).not.toHaveAccessibleName();
  });
});
