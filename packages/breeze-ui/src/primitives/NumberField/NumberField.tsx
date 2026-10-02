import type { Ref } from 'react';
import { Input as AriaInput } from 'react-aria-components/Input';
import { NumberField as AriaNumberField } from 'react-aria-components/NumberField';
import {
  FieldLabel,
  FieldSupportingContent,
} from '../../fields/field.presentation';
import { fieldVariants, joinClassNames } from '../../fields/field.styles';
import { useBreezeContext } from '../../provider/BreezeContext';
import type { ControlSize } from '../Button/Button';
import { Skeleton } from '../Skeleton/Skeleton';

const variants = {
  base: {
    input: 'breeze:tabular-nums',
  },
  compound: {},
  size: {
    lg: 'breeze:min-block-breeze-lg breeze:text-breeze-xl breeze:font-semibold',
    md: fieldVariants.size.md,
  },
  state: {},
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
  /** Sets the native input id used by the field label. */
  id?: string;
  /** Accessible field label, shown as text outside loading state. */
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
  /** Control height and figure size; `lg` suits a form's primary amount. Defaults to `md`. */
  size?: Exclude<ControlSize, 'sm'>;
  /** Amount applied by the arrow keys. Defaults to `1`. */
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
 * Renders locale-aware numeric entry with arrow-key stepping, validation,
 * tabular figures, and a closed loading presentation.
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
  size = 'md',
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
      aria-label={loading ? label : undefined}
      className={fieldVariants.base.root}
      defaultValue={defaultValue}
      form={form}
      formatOptions={formatOptions}
      id={id}
      isDisabled={interactionDisabled}
      isInvalid={!loading && visibleError !== undefined}
      isReadOnly={readOnly}
      isRequired={required}
      // Amount fields sit in scrolling drawers, where wheel stepping would silently change values.
      isWheelDisabled
      maxValue={maxValue}
      minValue={minValue}
      name={name}
      onChange={onChange}
      step={step}
      validationBehavior="aria"
      value={value}
    >
      <FieldLabel label={label} loading={loading} />
      <span className={fieldVariants.base.control}>
        <AriaInput
          aria-busy={loading || undefined}
          className={joinClassNames(
            fieldVariants.base.input,
            variants.base.input,
            variants.size[size],
            loading && fieldVariants.state.loadingInput,
          )}
          autoComplete={autoComplete}
          placeholder={placeholder}
          form={form}
          ref={ref}
        />
        {loading && (
          <span className={fieldVariants.base.skeleton}>
            <Skeleton
              blockSize="100%"
              inlineSize="100%"
              label={messages.loading}
              shape="rectangle"
            />
          </span>
        )}
      </span>
      <FieldSupportingContent
        description={visibleDescription}
        error={visibleError}
        loading={loading}
      />
    </AriaNumberField>
  );
}
