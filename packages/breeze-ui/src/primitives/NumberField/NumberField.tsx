import type { Ref } from 'react';
import { createElement } from 'react';
import { Button as AriaButton } from 'react-aria-components/Button';
import { FieldError as AriaFieldError } from 'react-aria-components/FieldError';
import { Group as AriaGroup } from 'react-aria-components/Group';
import { Input as AriaInput } from 'react-aria-components/Input';
import { Label as AriaLabel } from 'react-aria-components/Label';
import { NumberField as AriaNumberField } from 'react-aria-components/NumberField';
import { Text as AriaText } from 'react-aria-components/Text';
import { useBreezeContext } from '../../provider/BreezeContext';
import { fieldVariants, joinClassNames } from '../Field/field.styles';
import { Skeleton } from '../Skeleton/Skeleton';

const variants = {
  base: {
    group:
      'breeze:relative breeze:inline-flex breeze:min-block-breeze-md breeze:min-inline-size-0 breeze:inline-size-full breeze:items-stretch breeze:overflow-hidden breeze:rounded-breeze-ctl breeze:border breeze:border-solid breeze:border-breeze-line-strong breeze:bg-breeze-surface breeze:has-[input[data-focus-visible]]:outline-2 breeze:has-[input[data-focus-visible]]:outline-solid breeze:has-[input[data-focus-visible]]:outline-breeze-brand breeze:has-[input[data-invalid]]:border-breeze-danger breeze:data-[disabled]:cursor-not-allowed breeze:data-[disabled]:bg-breeze-sunken breeze:data-[disabled]:opacity-60',
    input:
      'breeze:min-block-breeze-md breeze:min-inline-size-0 breeze:flex-1 breeze:border-0 breeze:rounded-none breeze:bg-transparent breeze:tabular-nums breeze:outline-none breeze:placeholder:text-breeze-ink-3 breeze:data-[hovered]:border-transparent breeze:data-[focus-visible]:outline-none breeze:data-[invalid]:border-transparent breeze:disabled:cursor-not-allowed breeze:read-only:cursor-default',
    skeleton:
      'breeze:pointer-events-none breeze:absolute breeze:[inset-block:0] breeze:[inset-inline:0] breeze:rounded-breeze-ctl',
    stepButton:
      'breeze:min-inline-breeze-md breeze:border-0 breeze:bg-transparent breeze:ps-breeze-2 breeze:pe-breeze-2 breeze:font-breeze-sans breeze:text-breeze-md breeze:font-semibold breeze:leading-none breeze:text-breeze-ink breeze:disabled:cursor-not-allowed breeze:disabled:opacity-50 breeze:any-pointer-coarse:min-block-breeze-tap breeze:any-pointer-coarse:min-inline-breeze-tap breeze:hover:text-breeze-brand breeze:focus-visible:outline-2 breeze:focus-visible:outline-solid breeze:focus-visible:outline-breeze-brand breeze:outline-offset-[-2px]',
  },
  compound: {},
  size: {},
  state: {
    loadingInput: 'breeze:!opacity-0',
    loadingStepButton: 'breeze:!opacity-0',
  },
  variant: {},
} as const;

interface NumberFieldCommonProps {
  /** Hints at the browser's autocomplete behaviour for this field. */
  autoComplete?: string;
  /** Focuses the input when the component is mounted. */
  autoFocus?: boolean;
  /** Supporting guidance announced with the input. */
  description?: string;
  /** Prevents editing, stepping, and focus. Defaults to `false`. */
  disabled?: boolean;
  /** Visible validation message; any non-empty value marks the field invalid. */
  error?: string;
  /** Associates the field with a form outside its ancestor tree. */
  form?: string;
  /** Locale-aware formatting options used by React Aria. */
  formatOptions?: Intl.NumberFormatOptions;
  /** Sets the native input id used by the visible label. */
  id?: string;
  /** Persistent accessible and visible field label. */
  label: string;
  /** Replaces the input with a shape-preserving loading presentation. */
  loading?: boolean;
  /** Largest permitted value. */
  maxValue?: number;
  /** Smallest permitted value. */
  minValue?: number;
  /** Sets the submitted name of the field's hidden native input. */
  name?: string;
  /** Temporary text shown while the input is empty. */
  placeholder?: string;
  /** Prevents editing while retaining focus and form participation. */
  readOnly?: boolean;
  /** Ref to the native numeric input. */
  ref?: Ref<HTMLInputElement>;
  /** Marks the input as required. Defaults to `false`. */
  required?: boolean;
  /** Amount applied by arrow keys and stepper buttons. Defaults to `1`. */
  step?: number;
}

interface ControlledNumberFieldProps {
  /** Current number. React Aria reports `NaN` while the input is empty. */
  value: number;
  /** Reports the next number without exposing a DOM event. */
  onChange: (value: number) => void;
  /** Controlled and uncontrolled value props are mutually exclusive. */
  defaultValue?: never;
}

interface UncontrolledNumberFieldProps {
  /** Initial number. Defaults to an empty numeric input. */
  defaultValue?: number;
  /** Reports the next number without exposing a DOM event. */
  onChange?: (value: number) => void;
  /** Controlled and uncontrolled value props are mutually exclusive. */
  value?: never;
}

/** Props for controlled or uncontrolled locale-aware numeric entry. */
export type NumberFieldProps = NumberFieldCommonProps &
  (ControlledNumberFieldProps | UncontrolledNumberFieldProps);

/**
 * Renders locale-aware numeric entry with React Aria stepper controls,
 * validation, tabular figures, and a closed loading presentation.
 *
 * @summary Flat numeric entry with semantic number changes.
 */
export function NumberField({
  autoComplete,
  autoFocus,
  defaultValue,
  description,
  disabled = false,
  error,
  form,
  formatOptions,
  id,
  label,
  loading = false,
  maxValue,
  minValue,
  name,
  onChange,
  placeholder,
  readOnly = false,
  ref,
  required = false,
  step,
  value,
}: Readonly<NumberFieldProps>) {
  const { messages } = useBreezeContext();
  const visibleDescription = description?.trim() || undefined;
  const visibleError = error?.trim() || undefined;
  const interactionDisabled = disabled || loading;

  return (
    <AriaNumberField
      autoFocus={autoFocus}
      className={fieldVariants.base.root}
      defaultValue={defaultValue}
      form={form}
      formatOptions={formatOptions}
      id={id}
      isDisabled={interactionDisabled}
      isInvalid={visibleError !== undefined}
      isReadOnly={readOnly}
      isRequired={required}
      maxValue={maxValue}
      minValue={minValue}
      name={name}
      onChange={onChange}
      step={step}
      validationBehavior="aria"
      value={value}
    >
      <AriaLabel className={fieldVariants.base.label}>{label}</AriaLabel>
      <AriaGroup className={variants.base.group}>
        <AriaInput
          aria-busy={loading || undefined}
          className={joinClassNames(
            fieldVariants.base.input,
            variants.base.input,
            loading && variants.state.loadingInput,
          )}
          autoComplete={autoComplete}
          placeholder={placeholder}
          form={form}
          ref={ref}
        />
        <AriaButton
          className={joinClassNames(
            variants.base.stepButton,
            loading && variants.state.loadingStepButton,
          )}
          render={(buttonProps) =>
            createElement('button', {
              ...buttonProps,
              'aria-hidden': loading || undefined,
              type: 'button',
            })
          }
          slot="decrement"
          type="button"
        >
          −
        </AriaButton>
        <AriaButton
          className={joinClassNames(
            variants.base.stepButton,
            loading && variants.state.loadingStepButton,
          )}
          render={(buttonProps) =>
            createElement('button', {
              ...buttonProps,
              'aria-hidden': loading || undefined,
              type: 'button',
            })
          }
          slot="increment"
          type="button"
        >
          +
        </AriaButton>
        {loading && (
          <span className={variants.base.skeleton}>
            <Skeleton
              blockSize="100%"
              inlineSize="100%"
              label={messages.loading}
              shape="rectangle"
            />
          </span>
        )}
      </AriaGroup>
      {visibleDescription && (
        <AriaText className={fieldVariants.base.description} slot="description">
          {visibleDescription}
        </AriaText>
      )}
      {visibleError && (
        <AriaFieldError className={fieldVariants.base.error}>
          {visibleError}
        </AriaFieldError>
      )}
    </AriaNumberField>
  );
}
