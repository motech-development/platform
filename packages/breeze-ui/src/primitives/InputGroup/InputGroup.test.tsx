import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { TextField } from '../TextField/TextField';
import { InputGroup } from './InputGroup';

describe('InputGroup', () => {
  it('composes adornments with an accessible native field without taking value ownership', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <TextField.Root defaultValue="100">
        <TextField.Label>Budget</TextField.Label>
        <InputGroup.Root>
          <InputGroup.Addon aria-hidden="true">£</InputGroup.Addon>
          <TextField.Input name="budget" inputMode="decimal" />
          <InputGroup.Addon>GBP</InputGroup.Addon>
        </InputGroup.Root>
      </TextField.Root>,
    );

    const input = screen.getByRole('textbox', { name: 'Budget' });
    const group = input.parentElement;

    await user.clear(input);
    await user.type(input, '250');

    expect(input).toHaveValue('250');
    expect(input).toHaveAttribute('name', 'budget');
    expect(group).toHaveAttribute('data-breeze-input-group');
    expect(group).toHaveClass(
      'after:border',
      'data-[focus-within]:after:border-[var(--breeze-primary)]',
      'data-[hovered]:after:border-[var(--breeze-primary)]',
      'data-[invalid]:after:!border-[var(--breeze-danger)]',
      'breeze-input-group',
      '[&>*]:!border-0',
      '[&>*:not([data-breeze-input-group-addon])+*:not([data-breeze-input-group-addon])]:!border-s',
      '[&>[data-breeze-input-group-addon]:not(:first-child)]:ps-0',
      '[&>[data-breeze-input-group-addon]:not(:last-child)]:pe-0',
    );
    expect(screen.getByText('GBP')).toHaveAttribute(
      'data-breeze-input-group-addon',
    );
    expect(screen.getByText('GBP')).toHaveClass('bg-transparent');
    expect(screen.getByText('GBP')).toHaveClass('px-3');
  });

  it('forwards group and addon refs with optional grouping semantics', () => {
    const groupRef = createRef<HTMLDivElement>();
    const addonRef = createRef<HTMLSpanElement>();

    renderBreeze(
      <InputGroup.Root aria-label="Web address" ref={groupRef} role="group">
        <InputGroup.Addon ref={addonRef} size="lg">
          https://
        </InputGroup.Addon>
        <TextField.Root>
          <TextField.Input aria-label="Host" />
        </TextField.Root>
      </InputGroup.Root>,
    );

    expect(groupRef.current).toBe(
      screen.getByRole('group', { name: 'Web address' }),
    );
    expect(addonRef.current).toHaveTextContent('https://');
  });
});
