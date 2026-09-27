import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { Toggle, type ToggleProps } from './Toggle';

expectTypeOf<ToggleProps>().not.toHaveProperty('className');
expectTypeOf<ToggleProps>().not.toHaveProperty('style');
expectTypeOf<ToggleProps>().not.toHaveProperty('slot');
expectTypeOf<ToggleProps>().not.toHaveProperty('onClick');
expectTypeOf<ToggleProps>().not.toHaveProperty('render');
expectTypeOf<ToggleProps['onChange']>().toEqualTypeOf<
  ((pressed: boolean) => void) | undefined
>();

const mixedToggle = (
  // @ts-expect-error Controlled and uncontrolled pressed state are exclusive.
  <Toggle defaultPressed pressed onChange={() => undefined}>
    Pin to top
  </Toggle>
);

expectTypeOf(mixedToggle).toBeObject();

describe('Toggle', () => {
  it('reports the next pressed state through pointer and keyboard activation', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(pressed: boolean) => void>();

    renderBreeze(<Toggle onChange={onChange}>Pin to top</Toggle>);

    const toggle = screen.getByRole('button', { name: 'Pin to top' });

    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await user.click(toggle);

    expect(onChange).toHaveBeenLastCalledWith(true);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');

    await user.keyboard(' ');

    expect(onChange).toHaveBeenLastCalledWith(false);
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  it('leaves controlled pressed state with its owner', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(pressed: boolean) => void>();
    const { rerender } = renderBreeze(
      <Toggle onChange={onChange} pressed={false}>
        Pin to top
      </Toggle>,
    );
    const toggle = screen.getByRole('button', { name: 'Pin to top' });

    await user.click(toggle);

    expect(onChange).toHaveBeenCalledWith(true);
    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    rerender(
      <BreezeProvider locale="en-GB">
        <Toggle onChange={onChange} pressed>
          Pin to top
        </Toggle>
      </BreezeProvider>,
    );

    expect(toggle).toHaveAttribute('aria-pressed', 'true');
  });

  it('prevents activation while disabled', async () => {
    const onChange = vi.fn();

    renderBreeze(
      <Toggle disabled onChange={onChange}>
        Pin to top
      </Toggle>,
    );

    const toggle = screen.getByRole('button', { name: 'Pin to top' });

    expect(toggle).toBeDisabled();
    await userEvent.click(toggle);

    expect(onChange).not.toHaveBeenCalled();
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  it('preserves its pressed state and focus while loading, then restores activation', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(pressed: boolean) => void>();
    const renderToggle = (loading: boolean) => (
      <BreezeProvider locale="fr-FR" messages={{ loading: 'Chargement' }}>
        <Toggle defaultPressed loading={loading} onChange={onChange}>
          Remember this device
        </Toggle>
      </BreezeProvider>
    );
    const { rerender } = render(renderToggle(false));
    const toggle = screen.getByRole('button', {
      name: 'Remember this device',
    });

    toggle.focus();
    rerender(renderToggle(true));

    expect(toggle).toHaveFocus();
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(toggle).toHaveAttribute('aria-busy', 'true');
    expect(toggle).toHaveAttribute('aria-disabled', 'true');
    expect(toggle).toHaveAccessibleName('Remember this device');
    expect(
      screen.getByRole('progressbar', { name: 'Chargement' }),
    ).toHaveAttribute('lang', 'fr-FR');
    expect(toggle.querySelector('[data-breeze-skeleton]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );

    await user.click(toggle);
    await user.keyboard(' ');

    expect(onChange).not.toHaveBeenCalled();
    expect(toggle).toHaveAttribute('aria-pressed', 'true');

    rerender(renderToggle(false));
    await user.click(toggle);

    expect(onChange).toHaveBeenCalledExactlyOnceWith(false);
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  it('keeps controlled state with its owner while loading', async () => {
    const onChange = vi.fn<(pressed: boolean) => void>();
    const renderToggle = (loading: boolean, pressed: boolean) => (
      <BreezeProvider locale="en-GB">
        <Toggle loading={loading} onChange={onChange} pressed={pressed}>
          Remember this device
        </Toggle>
      </BreezeProvider>
    );
    const { rerender } = render(renderToggle(false, true));
    const toggle = screen.getByRole('button', {
      name: 'Remember this device',
    });

    rerender(renderToggle(true, true));
    await userEvent.click(toggle);

    expect(onChange).not.toHaveBeenCalled();
    expect(toggle).toHaveAttribute('aria-pressed', 'true');

    rerender(renderToggle(false, false));

    expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });
});
