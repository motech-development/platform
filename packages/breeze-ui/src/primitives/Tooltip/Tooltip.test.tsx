import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { WarningIcon } from '../../icons';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('appears on keyboard focus and dismisses with Escape', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <Tooltip.Root delay={0}>
        <Tooltip.Trigger>More information</Tooltip.Trigger>
        <Tooltip.Content>Additional context</Tooltip.Content>
      </Tooltip.Root>,
    );
    await user.tab();
    const tooltip = await screen.findByRole('tooltip');

    expect(tooltip.closest('[data-breeze-portal-root]')).not.toHaveAttribute(
      'aria-hidden',
    );
    expect(tooltip).toHaveTextContent('Additional context');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('supports an accessible icon trigger and semantic content colour', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <Tooltip.Root delay={0}>
        <Tooltip.IconTrigger aria-label="Warning information" variant="danger">
          <WarningIcon />
        </Tooltip.IconTrigger>
        <Tooltip.Content variant="danger">
          This item requires attention
        </Tooltip.Content>
      </Tooltip.Root>,
    );
    await user.tab();

    const trigger = screen.getByRole('img', { name: 'Warning information' });

    expect(trigger).toHaveFocus();
    expect(trigger).toHaveClass('size-5', 'cursor-help');
    expect(await screen.findByRole('tooltip')).toHaveClass(
      'bg-[var(--breeze-danger)]',
      'border-[var(--breeze-danger)]',
    );
  });

  it('associates an explicitly open icon tooltip with its trigger', () => {
    renderBreeze(
      <Tooltip.Root open readOnly>
        <Tooltip.IconTrigger aria-label="Warning information" variant="danger">
          <WarningIcon />
        </Tooltip.IconTrigger>
        <Tooltip.Content variant="danger">
          This item requires attention
        </Tooltip.Content>
      </Tooltip.Root>,
    );

    const trigger = screen.getByRole('img', { name: 'Warning information' });
    const tooltip = screen.getByRole('tooltip');

    expect(tooltip).toHaveTextContent('This item requires attention');
    expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
  });

  it('does not expose a parallel icon tooltip implementation', () => {
    expect(Object.keys(Tooltip).sort()).toEqual([
      'Content',
      'IconTrigger',
      'Root',
      'Trigger',
    ]);
  });
});
