import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FormEvent } from 'react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { Button } from '../../primitives/Button/Button';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { FormActions, type FormActionsProps } from './FormActions';

expectTypeOf<FormActionsProps>().not.toHaveProperty('className');
expectTypeOf<FormActionsProps>().not.toHaveProperty('style');
expectTypeOf<FormActionsProps>().not.toHaveProperty('loading');

describe('FormActions', () => {
  it('keeps secondary actions keyboard-accessible and preserves form submission', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());

    render(
      <BreezeProvider locale="en-GB">
        <form onSubmit={onSubmit}>
          <FormActions>
            <Button onAction={onCancel} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" value="save">
              Save
            </Button>
          </FormActions>
        </form>
      </BreezeProvider>,
    );

    await user.tab();
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await user.keyboard('{Enter}');

    expect(onCancel).toHaveBeenCalledExactlyOnceWith();
    expect(onSubmit).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSubmit).toHaveBeenCalledExactlyOnceWith(expect.any(Object));
  });

  it('requires the Breeze provider even when empty', () => {
    expect(() => render(<FormActions>{null}</FormActions>)).toThrow(
      'Breeze components must be rendered within BreezeProvider.',
    );
  });
});
