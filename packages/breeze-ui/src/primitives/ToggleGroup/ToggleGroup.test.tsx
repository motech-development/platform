import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { BreezeProvider } from '../../provider/BreezeProvider';
import type { ItemDescriptor } from '../Collection/item.types';
import { ToggleGroup, type ToggleGroupProps } from './ToggleGroup';

const options = [
  {
    id: 'confirmed',
    label: 'Confirmed',
  },
  {
    disabled: true,
    id: 'pending',
    label: 'Pending',
  },
] satisfies ItemDescriptor[];

type Option = (typeof options)[number];

const getItem = (item: Option) => item;

expectTypeOf<ToggleGroupProps<Option>>().not.toHaveProperty('className');
expectTypeOf<ToggleGroupProps<Option>>().not.toHaveProperty('style');
expectTypeOf<ToggleGroupProps<Option>>().not.toHaveProperty('slot');
expectTypeOf<ToggleGroupProps<Option>>().not.toHaveProperty('onClick');
expectTypeOf<ToggleGroupProps<Option>>().not.toHaveProperty('render');
expectTypeOf<ToggleGroupProps<Option>['onChange']>().toEqualTypeOf<
  ((selected: Option | null) => void) | undefined
>();

const mixedToggleGroup = (
  // @ts-expect-error Controlled and uncontrolled selection are exclusive.
  <ToggleGroup
    aria-label="Transaction status"
    defaultSelected={options[0]}
    getItem={getItem}
    items={options}
    onChange={() => undefined}
    selected={options[0]}
  />
);

expectTypeOf(mixedToggleGroup).toBeObject();

describe('ToggleGroup', () => {
  it('renders a named segmented group and reports item or cleared selection', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(selected: Option | null) => void>();

    renderBreeze(
      <ToggleGroup
        aria-label="Transaction status"
        getItem={getItem}
        items={options}
        onChange={onChange}
      />,
    );

    const group = screen.getByRole('group', { name: 'Transaction status' });
    const confirmed = screen.getByRole('button', { name: 'Confirmed' });
    const pending = screen.getByRole('button', { name: 'Pending' });

    expect(group).toHaveClass('breeze:bg-breeze-sunken');
    expect(confirmed).toHaveAttribute('aria-pressed', 'false');
    expect(pending).toHaveAttribute('aria-pressed', 'false');
    expect(pending).toBeDisabled();

    await user.click(confirmed);

    expect(onChange).toHaveBeenLastCalledWith(options[0]);
    expect(confirmed).toHaveAttribute('aria-pressed', 'true');

    await user.click(confirmed);

    expect(onChange).toHaveBeenLastCalledWith(null);
    expect(confirmed).toHaveAttribute('aria-pressed', 'false');
  });

  it('leaves controlled selection with its owner', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(selected: Option | null) => void>();
    const { rerender } = renderBreeze(
      <ToggleGroup
        aria-label="Transaction status"
        getItem={getItem}
        items={options}
        onChange={onChange}
        selected={options[0]}
      />,
    );
    const confirmed = screen.getByRole('button', { name: 'Confirmed' });
    const pending = screen.getByRole('button', { name: 'Pending' });

    await user.click(confirmed);

    expect(onChange).toHaveBeenCalledWith(null);
    expect(confirmed).toHaveAttribute('aria-pressed', 'true');

    rerender(
      <BreezeProvider locale="en-GB">
        <ToggleGroup
          aria-label="Transaction status"
          getItem={getItem}
          items={options}
          onChange={onChange}
          selected={options[1]}
        />
      </BreezeProvider>,
    );

    expect(confirmed).toHaveAttribute('aria-pressed', 'false');
    expect(pending).toHaveAttribute('aria-pressed', 'true');
  });
});
