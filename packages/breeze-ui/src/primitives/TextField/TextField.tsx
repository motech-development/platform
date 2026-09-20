import type { Ref } from 'react';
import { FieldError as AriaFieldError } from 'react-aria-components/FieldError';
import { Input as AriaInput } from 'react-aria-components/Input';
import { Label as AriaLabel } from 'react-aria-components/Label';
import { Text as AriaText } from 'react-aria-components/Text';
import { TextField as AriaTextField } from 'react-aria-components/TextField';
import { useBreezeContext } from '../../provider/BreezeContext';
import { fieldVariants, joinClassNames } from '../Field/field.styles';
import { Skeleton } from '../Skeleton/Skeleton';

type TextInputType = 'email' | 'password' | 'search' | 'tel' | 'text' | 'url';

interface TextFieldCommonProps {
  /** Hints at the browser's autocomplete behaviour for this field. */
  autoComplete?: string;
  /** Focuses the input when the component is mounted. */
  autoFocus?: boolean;
  /** Prevents editing and focus. Defaults to `false`. */
  disabled?: boolean;
  /** Supporting guidance announced with the input. */
  description?: string;
  /** Visible validation message; any non-empty value marks the field invalid. */
  error?: string;
  /** Associates the input with a form outside its ancestor tree. */
  form?: string;
  /** Sets the native input id used by the field label. */
  id?: string;
  /** Accessible field label, shown as text outside loading state. */
  label: string;
  /** Replaces the input with a shape-preserving loading presentation. */
  loading?: boolean;
  /** Sets the submitted name of the input. */
  name?: string;
  /** Temporary text shown while the input is empty. */
  placeholder?: string;
  /** Prevents editing while retaining focus and form participation. */
  readOnly?: boolean;
  /** Ref to the native text input. */
  ref?: Ref<HTMLInputElement>;
  /** Marks the input as required. Defaults to `false`. */
  required?: boolean;
  /** Selects the browser input purpose. Defaults to `text`. */
  type?: TextInputType;
}

interface ControlledTextFieldProps {
  /** Current text value. */
  value: string;
  /** Reports the next text value without exposing a DOM event. */
  onChange: (value: string) => void;
  /** Controlled and uncontrolled value props are mutually exclusive. */
  defaultValue?: never;
}

interface UncontrolledTextFieldProps {
  /** Initial text value. Defaults to an empty string. */
  defaultValue?: string;
  /** Reports the next text value without exposing a DOM event. */
  onChange?: (value: string) => void;
  /** Controlled and uncontrolled value props are mutually exclusive. */
  value?: never;
}

/** Props for controlled or uncontrolled text entry. */
export type TextFieldProps = TextFieldCommonProps &
  (ControlledTextFieldProps | UncontrolledTextFieldProps);

/**
 * Renders a labelled, accessible single-line text input with validation and a
 * closed loading presentation.
 *
 * @summary Flat text entry with semantic value changes.
 */
export function TextField({
  autoComplete,
  autoFocus,
  defaultValue,
  description,
  disabled = false,
  error,
  form,
  id,
  label,
  loading = false,
  name,
  onChange,
  placeholder,
  readOnly = false,
  ref,
  required = false,
  type = 'text',
  value,
}: Readonly<TextFieldProps>) {
  const { messages } = useBreezeContext();
  const visibleDescription = description?.trim() || undefined;
  const visibleError = error?.trim() || undefined;
  const interactionDisabled = disabled || loading;

  return (
    <AriaTextField
      className={fieldVariants.base.root}
      defaultValue={defaultValue}
      aria-label={loading ? label : undefined}
      id={id}
      isDisabled={interactionDisabled}
      isInvalid={!loading && visibleError !== undefined}
      isReadOnly={readOnly}
      isRequired={required}
      name={name}
      onChange={onChange}
      type={type}
      validationBehavior="aria"
      value={value}
    >
      <AriaLabel className={fieldVariants.base.label}>
        {loading ? (
          <Skeleton blockSize="1lh" inlineSize="12em" shape="rectangle" />
        ) : (
          label
        )}
      </AriaLabel>
      <span className={fieldVariants.base.control}>
        <AriaInput
          aria-busy={loading || undefined}
          className={joinClassNames(
            fieldVariants.base.input,
            loading && fieldVariants.state.loadingInput,
          )}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          form={form}
          placeholder={placeholder}
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
      {visibleDescription && (
        <AriaText className={fieldVariants.base.description} slot="description">
          {loading ? (
            <Skeleton blockSize="1lh" inlineSize="12em" shape="rectangle" />
          ) : (
            visibleDescription
          )}
        </AriaText>
      )}
      {visibleError &&
        (loading ? (
          <span aria-hidden="true" className={fieldVariants.base.error}>
            <Skeleton blockSize="1lh" inlineSize="12em" shape="rectangle" />
          </span>
        ) : (
          <AriaFieldError className={fieldVariants.base.error}>
            {visibleError}
          </AriaFieldError>
        ))}
    </AriaTextField>
  );
}
