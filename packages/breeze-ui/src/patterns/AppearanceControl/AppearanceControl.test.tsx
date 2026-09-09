import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { BreezeProvider } from '../../provider/BreezeProvider';
import AppearanceControl from './AppearanceControl';

describe('AppearanceControl', () => {
  it('reports a new appearance choice', async () => {
    const onAppearanceChange = vi.fn();
    const user = userEvent.setup();

    renderBreeze(<AppearanceControl />, 'en-GB', {
      defaultAppearance: 'automatic',
      onAppearanceChange,
    });

    expect(screen.getByRole('radio', { name: 'Auto' })).toHaveAttribute(
      'aria-checked',
      'true',
    );

    await user.click(screen.getByRole('radio', { name: 'Dark' }));

    expect(onAppearanceChange).toHaveBeenCalledWith('dark');
    expect(screen.getByRole('radio', { name: 'Dark' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('leaves a controlled choice unchanged until its owner updates it', async () => {
    const onAppearanceChange = vi.fn();
    const user = userEvent.setup();

    render(
      <BreezeProvider
        appearance="automatic"
        locale="en-GB"
        onAppearanceChange={onAppearanceChange}
      >
        <AppearanceControl />
      </BreezeProvider>,
    );

    await user.click(screen.getByRole('radio', { name: 'Dark' }));

    expect(onAppearanceChange).toHaveBeenCalledWith('dark');
    expect(screen.getByRole('radio', { name: 'Auto' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });
});
