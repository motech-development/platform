import type { ReactElement, ReactNode } from 'react';
import { useState } from 'react';
import { tv } from 'tailwind-variants';
import { EyeIcon, EyeOffIcon } from '../../icons';
import type { ControlSize } from '../../internal/styling/visual';
import { IconButton } from '../../primitives/IconButton/IconButton';
import { InputGroup } from '../../primitives/InputGroup/InputGroup';
import { TextField } from '../../primitives/TextField/TextField';
import { useBreezeContext } from '../../provider/BreezeContext';

const passwordFieldGroup = tv({
  base: '[&>*:not([data-breeze-input-group-addon])+*:not([data-breeze-input-group-addon])]:!border-s-0 [&>.breeze-action:focus-visible]:!outline-0 [&>.breeze-action[data-focus-visible]]:!outline-0 data-[disabled]:opacity-70 data-[focus-within]:outline-2 data-[focus-within]:outline-offset-[-2px] data-[focus-within]:outline-solid data-[focus-within]:outline-[var(--breeze-focus)] has-[input:read-only]:bg-[var(--breeze-surface-subtle)] has-[input:read-only]:opacity-70',
});

const passwordFieldInput = tv({
  base: 'min-w-0 w-auto flex-1 bg-transparent disabled:!bg-transparent disabled:!opacity-100 read-only:!bg-transparent read-only:!opacity-100',
});

const passwordVisibilityButton = tv({
  base: '!border-0 !bg-transparent !outline-none text-[var(--breeze-ink-soft)] disabled:!opacity-100 data-[disabled]:!opacity-100 data-[hovered]:!bg-transparent data-[hovered]:text-[var(--breeze-primary)] data-[pressed]:!translate-y-0',
});

interface PasswordFieldSharedProps {
  /** Native autocomplete purpose. */
  autoComplete?: 'current-password' | 'new-password' | 'off';
  /** Supporting guidance associated with the input. */
  description?: ReactNode;
  /** Prevents editing and focus. Defaults to `false`. */
  disabled?: boolean;
  /** Validation message shown when invalid. */
  error?: ReactNode;
  /** Exposes invalid state. Defaults to `false`. */
  invalid?: boolean;
  /** Persistent visible input label. */
  label: ReactNode;
  /** Native form field name. */
  name?: string;
  /** Placeholder shown while empty. */
  placeholder?: string;
  /** Marks the input as required. Defaults to `false`. */
  required?: boolean;
  /** Canonical input and action size. Defaults to `md`. */
  size?: ControlSize;
}

interface ControlledPasswordFieldProps {
  /** Current password value. */
  value: string;
  /** Called with the next password value. */
  onChange: (value: string) => void;
  defaultValue?: never;
  readOnly?: false;
}

interface ReadOnlyPasswordFieldProps {
  /** Current immutable password value. */
  value: string;
  /** Marks the controlled value as intentionally immutable. */
  readOnly: true;
  defaultValue?: never;
  onChange?: never;
}

interface UncontrolledPasswordFieldProps {
  /** Initial password value. Defaults to an empty string. */
  defaultValue?: string;
  /** Called with the next password value. */
  onChange?: (value: string) => void;
  value?: never;
  readOnly?: false;
}

/** Props for controlled, read-only, or uncontrolled password entry. */
export type PasswordFieldProps = PasswordFieldSharedProps &
  (
    | ControlledPasswordFieldProps
    | ReadOnlyPasswordFieldProps
    | UncontrolledPasswordFieldProps
  );

/**
 * Provides accessible password entry with a keyboard-operable visibility toggle.
 *
 * @summary labelled password entry with a visibility action
 */
export function PasswordField({
  autoComplete,
  defaultValue,
  description,
  disabled = false,
  error,
  invalid = false,
  label,
  name,
  onChange,
  placeholder,
  readOnly = false,
  required = false,
  size = 'md',
  value,
}: PasswordFieldProps): ReactElement {
  const { messages } = useBreezeContext();
  const [visible, setVisible] = useState(false);

  const content = (
    <>
      <TextField.Label>{label}</TextField.Label>
      <InputGroup.Root className={passwordFieldGroup()}>
        <TextField.Input
          autoComplete={autoComplete}
          className={passwordFieldInput()}
          name={name}
          placeholder={placeholder}
          size={size}
          type={visible ? 'text' : 'password'}
        />
        <IconButton
          aria-label={visible ? messages.hidePassword : messages.showPassword}
          className={passwordVisibilityButton()}
          disabled={disabled}
          onAction={() => setVisible((current) => !current)}
          size={size}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </IconButton>
      </InputGroup.Root>
      {description === undefined ? null : (
        <TextField.Description>{description}</TextField.Description>
      )}
      {error === undefined ? null : <TextField.Error>{error}</TextField.Error>}
    </>
  );

  if (value === undefined) {
    return (
      <TextField.Root
        defaultValue={defaultValue}
        disabled={disabled}
        invalid={invalid}
        onChange={onChange}
        required={required}
      >
        {content}
      </TextField.Root>
    );
  }

  if (readOnly) {
    return (
      <TextField.Root
        disabled={disabled}
        invalid={invalid}
        readOnly
        required={required}
        value={value}
      >
        {content}
      </TextField.Root>
    );
  }

  if (onChange === undefined) {
    throw new Error('Controlled PasswordField requires onChange.');
  }

  return (
    <TextField.Root
      disabled={disabled}
      invalid={invalid}
      onChange={onChange}
      required={required}
      value={value}
    >
      {content}
    </TextField.Root>
  );
}
