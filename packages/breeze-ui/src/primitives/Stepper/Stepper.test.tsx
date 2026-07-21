import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Stepper } from './Stepper';

describe('Stepper', () => {
  it('announces ordered progress and the current step', () => {
    renderBreeze(
      <Stepper.Root aria-label="Company setup">
        <Stepper.Item indicator="1" status="complete" title="Details" />
        <Stepper.Item
          description="Configure tax and opening values."
          indicator="2"
          status="current"
          title="Settings"
        />
        <Stepper.Item indicator="3" status="upcoming" title="Review" />
      </Stepper.Root>,
    );

    expect(screen.getByRole('list', { name: 'Company setup' })).toHaveAttribute(
      'role',
      'list',
    );
    expect(screen.getByText('Settings').closest('li')).toHaveAttribute(
      'aria-current',
      'step',
    );

    const completeItem = screen.getByText('Details').closest('li');
    const currentItem = screen.getByText('Settings').closest('li');
    const upcomingItem = screen.getByText('Review').closest('li');

    expect(completeItem).not.toHaveAttribute('aria-current');
    expect(upcomingItem).not.toHaveAttribute('aria-current');
    expect(completeItem?.querySelector('[aria-hidden="true"]')).not.toBeNull();
    expect(currentItem?.querySelector('[aria-hidden="true"]')).not.toBeNull();
    expect(upcomingItem?.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });
});
