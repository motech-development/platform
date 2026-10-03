import { type Ref, useId } from 'react';
import { useObjectRef } from 'react-aria/useObjectRef';
import {
  CheckboxButton as AriaCheckboxButton,
  CheckboxField as AriaCheckboxField,
} from 'react-aria-components/Checkbox';
import { FieldSupportingContent } from '../../fields/field.presentation';
import { useBreezeContext } from '../../provider/BreezeContext';
import { Skeleton } from '../Skeleton/Skeleton';

const variants = {
  base: {
    control:
      'breeze:flex breeze:any-pointer-coarse:min-block-breeze-tap breeze:items-center breeze:gap-[10px] breeze:cursor-pointer breeze:select-none breeze:font-breeze-sans breeze:text-breeze-sm breeze:font-medium breeze:leading-[calc(1.25/0.875)] breeze:text-breeze-ink breeze:data-[disabled]:cursor-not-allowed',
    indicator:
      'breeze:grid breeze:block-breeze-4 breeze:inline-breeze-4 breeze:shrink-0 breeze:place-items-center breeze:rounded-breeze-chip breeze:border breeze:border-solid breeze:border-breeze-ink-3 breeze:bg-breeze-surface breeze:text-breeze-xs breeze:font-bold breeze:leading-none breeze:text-breeze-on-brand breeze:transition-colors breeze:data-[selected]:border-breeze-brand breeze:data-[selected]:bg-breeze-brand breeze:data-[focus-visible]:outline-2 breeze:data-[focus-visible]:outline-offset-2 breeze:data-[focus-visible]:outline-solid breeze:data-[focus-visible]:outline-breeze-brand breeze:data-[disabled]:border-breeze-line-strong breeze:data-[disabled]:bg-breeze-sunken breeze:data-[disabled]:text-breeze-surface breeze:data-[disabled]:data-[selected]:border-breeze-line-strong breeze:data-[disabled]:data-[selected]:bg-breeze-line-strong',
    root: 'breeze:min-inline-0',
    skeletonIndicator:
      'breeze:pointer-events-none breeze:block-breeze-4 breeze:inline-breeze-4 breeze:shrink-0',
    text: 'breeze:flex breeze:min-inline-0 breeze:grow breeze:flex-col breeze:gap-breeze-px',
  },
  compound: {},
  size: {},
  state: {},
  variant: {},
} as const;

interface CheckboxCommonProps {
  /** Prevents selection and focus. Defaults to `false`. */
  disabled?: boolean;
  /** Associates the checkbox with a form outside its ancestor tree. */
  form?: string;
  /** Sets the native input id. */
  id?: string;
  /** Accessible checkbox label, shown as text outside loading state. */
  label: string;
  /** Replaces the checkbox content with a shape-preserving loading presentation. */
  loading?: boolean;
  /** Sets the submitted name of the checkbox. */
  name?: string;
  /** Supporting guidance announced with the checkbox. */
  description?: string;
  /** Prevents editing while retaining focus and form participation. */
  readOnly?: boolean;
  /** Ref to the native checkbox input. */
  ref?: Ref<HTMLInputElement>;
  /** Marks the checkbox as required. Defaults to `false`. */
  required?: boolean;
  /** Visible validation message; any non-empty value marks the checkbox invalid. */
  error?: string;
  /** Native value submitted when the checkbox is selected. */
  value?: string;
}

interface ControlledCheckboxProps {
  /** Current selected state. */
  selected: boolean;
  /** Reports the next selected state without exposing a DOM event. */
  onChange: (selected: boolean) => void;
  /** Controlled and uncontrolled selection props are mutually exclusive. */
  defaultSelected?: never;
}

interface UncontrolledCheckboxProps {
  /** Initial selected state. Defaults to `false`. */
  defaultSelected?: boolean;
  /** Reports the next selected state without exposing a DOM event. */
  onChange?: (selected: boolean) => void;
  /** Controlled and uncontrolled selection props are mutually exclusive. */
  selected?: never;
}

/** Props for controlled or uncontrolled boolean selection. */
export type CheckboxProps = CheckboxCommonProps &
  (ControlledCheckboxProps | UncontrolledCheckboxProps);

/**
 * Renders an accessible checkbox with a visible label, validation messages,
 * semantic boolean changes, and a closed loading presentation.
 *
 * @summary Flat boolean selection with semantic value changes.
 */
export function Checkbox({
  defaultSelected,
  description,
  disabled = false,
  error,
  form,
  id,
  label,
  loading = false,
  name,
  onChange,
  readOnly = false,
  ref,
  required = false,
  selected,
  value,
}: Readonly<CheckboxProps>) {
  const { messages } = useBreezeContext();
  const inputRef = useObjectRef(ref);
  const labelId = useId();
  const visibleDescription = description?.trim() || undefined;
  const visibleError = error?.trim() || undefined;
  const interactionDisabled = disabled || loading;

  return (
    <AriaCheckboxField
      className={variants.base.root}
      defaultSelected={defaultSelected}
      form={form}
      id={id}
      inputRef={inputRef}
      aria-label={loading ? label : undefined}
      // Supporting text shares the native label, so the name points at the label text alone.
      aria-labelledby={loading ? undefined : labelId}
      isDisabled={interactionDisabled}
      isInvalid={!loading && visibleError !== undefined}
      isReadOnly={readOnly}
      isRequired={required}
      isSelected={selected}
      name={name}
      onChange={onChange}
      value={value}
      validationBehavior="aria"
    >
      <AriaCheckboxButton className={variants.base.control}>
        {({ isDisabled, isFocusVisible, isSelected }) => (
          <>
            {loading ? (
              <span
                aria-hidden="true"
                className={variants.base.skeletonIndicator}
              >
                <Skeleton
                  blockSize="100%"
                  inlineSize="100%"
                  shape="rectangle"
                />
              </span>
            ) : (
              <span
                aria-hidden="true"
                className={variants.base.indicator}
                data-disabled={isDisabled || undefined}
                data-focus-visible={isFocusVisible || undefined}
                data-selected={isSelected || undefined}
              >
                {isSelected ? '✓' : ''}
              </span>
            )}
            <span className={variants.base.text}>
              {loading ? (
                <Skeleton
                  blockSize="1lh"
                  inlineSize="12em"
                  label={messages.loading}
                  shape="rectangle"
                />
              ) : (
                <span id={labelId}>{label}</span>
              )}
              <FieldSupportingContent
                choice
                description={visibleDescription}
                error={visibleError}
                loading={loading}
              />
            </span>
          </>
        )}
      </AriaCheckboxButton>
    </AriaCheckboxField>
  );
}
