import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { Disclosure } from './Disclosure';

describe('Disclosure', () => {
  it('opens uncontrolled content and reports semantic state', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    renderBreeze(
      <Disclosure.Root onOpenChange={onOpenChange}>
        <Disclosure.Trigger>Details</Disclosure.Trigger>
        <Disclosure.Panel>More information</Disclosure.Panel>
      </Disclosure.Root>,
    );
    await user.click(screen.getByRole('button', { name: 'Details' }));

    expect(screen.getByText('More information')).toBeVisible();
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('exposes controlled read-only state without mutating it', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <Disclosure.Root open readOnly>
        <Disclosure.Trigger>Details</Disclosure.Trigger>
        <Disclosure.Panel>More information</Disclosure.Panel>
      </Disclosure.Root>,
    );
    await user.click(screen.getByRole('button', { name: 'Details' }));

    expect(screen.getByText('More information')).toBeVisible();
  });
});
