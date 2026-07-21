import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Popover } from './Popover';

describe('Popover', () => {
  it('opens a nonmodal labelled surface and dismisses outside', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <>
        <Popover.Root>
          <Popover.Trigger>Show filters</Popover.Trigger>
          <Popover.Content>
            <Popover.Title>Filters</Popover.Title>
            <Popover.Description>Choose optional filters.</Popover.Description>
            <Popover.Close>Done</Popover.Close>
          </Popover.Content>
        </Popover.Root>
        <button type="button">Outside</button>
      </>,
    );
    await user.click(screen.getByRole('button', { name: 'Show filters' }));
    const popover = screen.getByRole('dialog', { name: 'Filters' });

    expect(popover.closest('[data-breeze-portal-root]')).not.toHaveAttribute(
      'aria-hidden',
    );
    expect(popover).not.toHaveAttribute('aria-modal', 'true');
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(
      screen.queryByRole('dialog', { name: 'Filters' }),
    ).not.toBeInTheDocument();
  });
});
