import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { Chip, type ChipProps } from './Chip';

expectTypeOf<ChipProps>().not.toHaveProperty('className');
expectTypeOf<ChipProps>().not.toHaveProperty('style');
expectTypeOf<ChipProps>().not.toHaveProperty('slot');
expectTypeOf<ChipProps>().not.toHaveProperty('onClick');
expectTypeOf<ChipProps>().not.toHaveProperty('render');
expectTypeOf<ChipProps['onChange']>().toEqualTypeOf<
  ((pressed: boolean) => void) | undefined
>();

const mixedChip = (
  // @ts-expect-error Controlled and uncontrolled pressed state are exclusive.
  <Chip defaultPressed pressed onChange={() => undefined}>
    Needs receipt
  </Chip>
);

expectTypeOf(mixedChip).toBeObject();

describe('Chip', () => {
  it('renders a pill-shaped button with an accessible pressed state', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(pressed: boolean) => void>();

    renderBreeze(<Chip onChange={onChange}>Needs receipt</Chip>);

    const chip = screen.getByRole('button', { name: 'Needs receipt' });

    expect(chip).toHaveClass('breeze:rounded-breeze-full');
    expect(chip).toHaveAttribute('aria-pressed', 'false');

    await user.click(chip);

    expect(onChange).toHaveBeenCalledWith(true);
    expect(chip).toHaveAttribute('aria-pressed', 'true');
  });

  it('leaves controlled pressed state with its owner', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(pressed: boolean) => void>();
    const { rerender } = renderBreeze(
      <Chip onChange={onChange} pressed={false}>
        Needs receipt
      </Chip>,
    );
    const chip = screen.getByRole('button', { name: 'Needs receipt' });

    await user.click(chip);

    expect(onChange).toHaveBeenCalledWith(true);
    expect(chip).toHaveAttribute('aria-pressed', 'false');

    rerender(
      <BreezeProvider locale="en-GB">
        <Chip onChange={onChange} pressed>
          Needs receipt
        </Chip>
      </BreezeProvider>,
    );

    expect(chip).toHaveAttribute('aria-pressed', 'true');
  });

  it('prevents activation while disabled', async () => {
    const onChange = vi.fn();

    renderBreeze(
      <Chip disabled onChange={onChange}>
        Needs receipt
      </Chip>,
    );

    const chip = screen.getByRole('button', { name: 'Needs receipt' });

    expect(chip).toBeDisabled();
    await userEvent.click(chip);

    expect(onChange).not.toHaveBeenCalled();
    expect(chip).toHaveAttribute('aria-pressed', 'false');
  });
});
