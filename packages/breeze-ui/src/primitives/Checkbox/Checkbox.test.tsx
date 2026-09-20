import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { Checkbox, type CheckboxProps } from './Checkbox';

expectTypeOf<CheckboxProps>().not.toHaveProperty('className');
expectTypeOf<CheckboxProps>().not.toHaveProperty('style');
expectTypeOf<CheckboxProps>().not.toHaveProperty('slot');
expectTypeOf<CheckboxProps>().not.toHaveProperty('render');
expectTypeOf<CheckboxProps>().not.toHaveProperty('indeterminate');
expectTypeOf<CheckboxProps['onChange']>().toEqualTypeOf<
  ((selected: boolean) => void) | undefined
>();

const controlledCheckbox = (
  <Checkbox label="Accept terms" onChange={() => undefined} selected />
);
const uncontrolledCheckbox = <Checkbox defaultSelected label="Accept terms" />;

const mixedCheckbox = (
  // @ts-expect-error Controlled and uncontrolled selection props are exclusive.
  <Checkbox
    label="Accept terms"
    onChange={() => undefined}
    selected
    defaultSelected={false}
  />
);

expectTypeOf(controlledCheckbox).toBeObject();
expectTypeOf(mixedCheckbox).toBeObject();
expectTypeOf(uncontrolledCheckbox).toBeObject();

describe('Checkbox', () => {
  it('reports semantic checked state through pointer and keyboard activation', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(selected: boolean) => void>();

    renderBreeze(<Checkbox label="Accept terms" onChange={onChange} />);

    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });

    await user.click(checkbox);

    expect(onChange).toHaveBeenLastCalledWith(true);
    expect(checkbox).toBeChecked();

    checkbox.focus();
    await user.keyboard(' ');

    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it('shows a visible focus state when reached by keyboard', async () => {
    const user = userEvent.setup();

    renderBreeze(<Checkbox label="Accept terms" />);

    await user.tab();

    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
    const indicator = checkbox
      .closest('label')
      ?.querySelector('span[data-focus-visible]');

    expect(checkbox).toHaveFocus();
    expect(indicator).toHaveAttribute('data-focus-visible', 'true');
    expect(indicator).toHaveClass(
      'breeze:data-[focus-visible]:outline-2',
      'breeze:data-[focus-visible]:outline-solid',
      'breeze:data-[focus-visible]:outline-breeze-brand',
    );
  });

  it('associates descriptions and errors with required invalid state', () => {
    renderBreeze(
      <Checkbox
        description="Confirm the details before continuing."
        error="Confirmation is required."
        label="Confirm accuracy"
        required
      />,
    );

    const checkbox = screen.getByRole('checkbox', {
      name: 'Confirm accuracy',
    });

    expect(checkbox).toBeInvalid();
    expect(checkbox).toBeRequired();
    expect(checkbox).toHaveAccessibleDescription(
      'Confirm the details before continuing. Confirmation is required.',
    );
  });

  it('forwards the native input ref and prevents interaction while loading', async () => {
    const user = userEvent.setup();
    const inputRef = createRef<HTMLInputElement>();
    const onChange = vi.fn<(selected: boolean) => void>();

    renderBreeze(
      <Checkbox
        defaultSelected
        description="Choose whether email alerts are enabled."
        error="Email alert preference is unavailable."
        label="Email alerts"
        loading
        name="alerts"
        onChange={onChange}
        ref={inputRef}
        value="email"
      />,
    );

    const checkbox = screen.getByRole('checkbox', {
      name: 'Email alerts',
    });

    expect(inputRef.current).toBe(checkbox);
    expect(checkbox).toHaveAccessibleName('Email alerts');
    expect(checkbox).toBeDisabled();
    expect(checkbox).not.toBeInvalid();
    expect(screen.queryByText('Email alerts')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Choose whether email alerts are enabled.'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Email alert preference is unavailable.'),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('progressbar', { name: 'Loading' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('progressbar')).toHaveLength(1);
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

    const placeholders = Array.from(
      checkbox.closest('label')?.querySelectorAll('span') ?? [],
    ).filter((element) =>
      String(element.className).includes('breeze:pointer-events-none'),
    );
    const indicatorPlaceholder = placeholders.find((element) =>
      String(element.className).includes('breeze:[grid-area:1/1]'),
    );
    const labelPlaceholder = placeholders.find((element) =>
      String(element.className).includes('breeze:[grid-area:1/2]'),
    );

    expect(indicatorPlaceholder).toHaveAttribute('aria-hidden', 'true');
    expect(indicatorPlaceholder).toHaveClass(
      'breeze:block-size-breeze-5',
      'breeze:inline-size-breeze-5',
    );
    expect(indicatorPlaceholder).not.toHaveClass(
      'breeze:overflow-hidden',
      'breeze:rounded-breeze-chip',
    );
    expect(indicatorPlaceholder?.querySelector('progress')).toHaveClass(
      'breeze:rounded-breeze-sm',
    );
    expect(labelPlaceholder).toHaveClass('breeze:[grid-area:1/2]');
    expect(labelPlaceholder).not.toHaveClass('breeze:rounded-breeze-chip');
    expect(labelPlaceholder?.querySelector('progress')).toHaveClass(
      'breeze:rounded-breeze-sm',
    );
    expect(placeholders).toHaveLength(2);
    expect(checkbox).toHaveAttribute('name', 'alerts');
    expect(checkbox).toHaveAttribute('value', 'email');

    await user.click(checkbox);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('keeps the visual checkmark decorative', () => {
    renderBreeze(<Checkbox defaultSelected label="Accept terms" />);

    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
    const indicator = checkbox
      .closest('label')
      ?.querySelector('span[data-selected]');

    expect(indicator).toHaveAttribute('aria-hidden', 'true');
  });

  it('keeps controlled selection application-owned', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(selected: boolean) => void>();

    renderBreeze(
      <Checkbox label="Marketing" onChange={onChange} selected={false} />,
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Marketing' });

    await user.click(checkbox);

    expect(onChange).toHaveBeenCalledWith(true);
    expect(checkbox).not.toBeChecked();
  });
});
