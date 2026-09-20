import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { TextField, type TextFieldProps } from './TextField';

expectTypeOf<TextFieldProps>().not.toHaveProperty('className');
expectTypeOf<TextFieldProps>().not.toHaveProperty('style');
expectTypeOf<TextFieldProps>().not.toHaveProperty('slot');
expectTypeOf<TextFieldProps>().not.toHaveProperty('render');
expectTypeOf<TextFieldProps['onChange']>().toEqualTypeOf<
  ((value: string) => void) | undefined
>();

const controlledTextField = (
  <TextField label="Name" onChange={() => undefined} value="Ada" />
);
const uncontrolledTextField = <TextField defaultValue="Ada" label="Name" />;
const compatibleTypeTextField = <TextField label="Email" type="email" />;

const incompatibleTypeTextField = (
  // @ts-expect-error TextField only accepts single-line text-compatible types.
  <TextField label="Quantity" type="number" />
);

const mixedTextField = (
  // @ts-expect-error Controlled and uncontrolled value props are exclusive.
  <TextField
    label="Name"
    onChange={() => undefined}
    value="Ada"
    defaultValue="Grace"
  />
);

expectTypeOf(controlledTextField).toBeObject();
expectTypeOf(mixedTextField).toBeObject();
expectTypeOf(uncontrolledTextField).toBeObject();
expectTypeOf(compatibleTypeTextField).toBeObject();
expectTypeOf(incompatibleTypeTextField).toBeObject();

describe('TextField', () => {
  it('associates its label and description and reports semantic strings', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: string) => void>();

    renderBreeze(
      <TextField
        autoComplete="email"
        defaultValue=""
        description="Used for account notices."
        label="Email address"
        name="email"
        onChange={onChange}
        placeholder="name@example.com"
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Email address' });

    expect(input).toHaveAttribute('autocomplete', 'email');
    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveAttribute('placeholder', 'name@example.com');
    expect(input).toHaveAccessibleDescription('Used for account notices.');

    await user.type(input, 'Ada');

    expect(onChange).toHaveBeenLastCalledWith('Ada');
  });

  it('derives invalid semantics from a visible error and required state', () => {
    const { rerender } = renderBreeze(
      <TextField
        description="A reference is assigned by the application."
        error="A reference is required."
        label="Reference"
        required
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Reference' });

    expect(input).toBeInvalid();
    expect(input).toBeRequired();
    expect(input).toHaveAccessibleDescription(
      'A reference is assigned by the application. A reference is required.',
    );

    rerender(
      <BreezeProvider locale="en-GB">
        <TextField error="   " label="Reference" required />
      </BreezeProvider>,
    );

    expect(input).not.toBeInvalid();
  });

  it('keeps controlled values application-owned', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(value: string) => void>();

    renderBreeze(<TextField label="Name" onChange={onChange} value="Ada" />);

    const input = screen.getByRole('textbox', { name: 'Name' });

    await user.type(input, ' Lovelace');

    expect(onChange).toHaveBeenCalled();
    expect(input).toHaveValue('Ada');
  });

  it('forwards the native input ref and disables the field while loading', async () => {
    const user = userEvent.setup();
    const inputRef = createRef<HTMLInputElement>();
    const onChange = vi.fn<(value: string) => void>();

    renderBreeze(
      <TextField
        defaultValue="Draft"
        description="Shown beneath the title."
        error="The title could not be loaded."
        label="Title"
        loading
        onChange={onChange}
        ref={inputRef}
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Title' });

    expect(inputRef.current).toBe(input);
    expect(input).toHaveAccessibleName('Title');
    expect(input).toBeDisabled();
    expect(screen.queryByText('Title')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Shown beneath the title.'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('The title could not be loaded.'),
    ).not.toBeInTheDocument();
    expect(input).toHaveClass('breeze:!opacity-0');
    expect(input).not.toHaveClass('breeze:invisible');
    expect(input).toHaveAttribute('aria-busy', 'true');
    const loadingPlaceholder = screen.getByRole('progressbar', {
      name: 'Loading',
    });

    expect(loadingPlaceholder).toHaveClass('breeze:rounded-breeze-sm');
    expect(loadingPlaceholder.parentElement).not.toHaveClass(
      'breeze:rounded-breeze-ctl',
    );
    const allSkeletons = screen.getAllByRole('progressbar', { hidden: true });

    expect(allSkeletons).toHaveLength(4);
    expect(
      allSkeletons.filter(
        (element) => element.getAttribute('aria-hidden') === 'true',
      ),
    ).toHaveLength(3);
    allSkeletons.forEach((skeleton) => {
      expect(skeleton).toHaveClass('breeze:rounded-breeze-sm');
    });

    await user.type(input, ' changed');

    expect(onChange).not.toHaveBeenCalled();

    await waitFor(() => expect(loadingPlaceholder).toBeVisible());
  });
});
