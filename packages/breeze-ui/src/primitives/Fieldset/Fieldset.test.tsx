import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { TextField } from '../TextField/TextField';
import { Fieldset } from './Fieldset';

describe('Fieldset', () => {
  it('names and describes a native disabled control group', () => {
    renderBreeze(
      <Fieldset.Root disabled name="contact-options">
        <Fieldset.Legend>Contact details</Fieldset.Legend>
        <Fieldset.Description>
          Provide at least one method.
        </Fieldset.Description>
        <TextField.Root>
          <TextField.Label>Email</TextField.Label>
          <TextField.Input />
        </TextField.Root>
      </Fieldset.Root>,
    );

    const fieldset = screen.getByRole('group', { name: 'Contact details' });

    expect(fieldset).toBeDisabled();
    expect(fieldset).toHaveAttribute('name', 'contact-options');
    expect(fieldset).toHaveAccessibleDescription(
      'Provide at least one method.',
    );
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeDisabled();
  });

  it('associates invalid group errors and forwards part attributes', () => {
    renderBreeze(
      <Fieldset.Root aria-label="Preferences" invalid>
        <Fieldset.Legend className="legend">Options</Fieldset.Legend>
        <Fieldset.Description className="description">
          Select one.
        </Fieldset.Description>
        <Fieldset.Error className="error">
          A selection is required.
        </Fieldset.Error>
      </Fieldset.Root>,
    );

    const fieldset = screen.getByRole('group', { name: 'Preferences' });

    expect(fieldset).toBeInvalid();
    expect(fieldset).toHaveAccessibleDescription(
      'Select one. A selection is required.',
    );
    expect(screen.getByText('Options')).toHaveClass('legend');
    expect(screen.getByText('Select one.')).toHaveClass('description');
    expect(screen.getByText('A selection is required.')).toHaveClass('error');
  });
});
