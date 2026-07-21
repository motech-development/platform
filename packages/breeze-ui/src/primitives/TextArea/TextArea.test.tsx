import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { TextArea } from './TextArea';

describe('TextArea', () => {
  it('reports multiline value changes through labelled compound anatomy', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderBreeze(
      <TextArea.Root onChange={onChange}>
        <TextArea.Label>Notes</TextArea.Label>
        <TextArea.Control name="notes" rows={4} />
        <TextArea.Description>Include relevant context.</TextArea.Description>
      </TextArea.Root>,
    );

    const control = screen.getByRole('textbox', { name: 'Notes' });

    await user.type(control, 'First line{enter}Second line');

    expect(onChange).toHaveBeenLastCalledWith('First line\nSecond line');
    expect(control).toHaveAccessibleDescription('Include relevant context.');
    expect(control).toHaveAttribute('name', 'notes');
    expect(control).toHaveAttribute('rows', '4');
  });

  it('forwards its ref and exposes read-only invalid state', () => {
    const ref = createRef<HTMLTextAreaElement>();

    renderBreeze(
      <TextArea.Root invalid readOnly value="Archived note">
        <TextArea.Label>Archived notes</TextArea.Label>
        <TextArea.Control maxLength={200} ref={ref} />
        <TextArea.Error>This note cannot be edited.</TextArea.Error>
      </TextArea.Root>,
    );

    expect(ref.current).toBe(
      screen.getByRole('textbox', { name: 'Archived notes' }),
    );
    expect(ref.current).toHaveAttribute('readonly');
    expect(ref.current).toHaveAttribute('maxlength', '200');
    expect(ref.current).toHaveAccessibleDescription(
      'This note cannot be edited.',
    );
  });
});
