import type { RefObject } from 'react';
import {
  createElement,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
} from 'react';
import { Button as AriaButton } from 'react-aria-components/Button';
import {
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
} from 'react-aria-components/ListBox';
import {
  Select as AriaSelect,
  SelectStateContext as AriaSelectStateContext,
  SelectValue as AriaSelectValue,
} from 'react-aria-components/Select';
import { useBreezeContext } from '../../provider/BreezeContext';
import collectionVariants from '../Collection/collection.styles';
import CollectionPopover from '../Collection/CollectionPopover';
import DescriptorContent from '../Collection/DescriptorContent';
import type { ItemDescriptor } from '../Collection/item.types';
import {
  FieldLabel,
  FieldSupportingContent,
} from '../Field/field.presentation';
import { fieldVariants, joinClassNames } from '../Field/field.styles';
import { Icon } from '../Icon/Icon';
import { Skeleton } from '../Skeleton/Skeleton';

const selectVariants = {
  base: {
    trigger:
      'breeze:flex breeze:min-block-breeze-md breeze:any-pointer-coarse:min-block-breeze-tap breeze:min-inline-size-0 breeze:inline-size-full breeze:items-center breeze:justify-between breeze:rounded-breeze-ctl breeze:border breeze:border-solid breeze:border-breeze-line-strong breeze:bg-breeze-surface breeze:ps-breeze-3 breeze:pe-breeze-3 breeze:py-breeze-2 breeze:font-breeze-sans breeze:text-breeze-sm breeze:text-breeze-ink breeze:outline-offset-2 breeze:data-[hovered]:border-breeze-brand breeze:data-[focus-visible]:outline-2 breeze:data-[focus-visible]:outline-solid breeze:data-[focus-visible]:outline-breeze-brand breeze:data-[invalid]:border-breeze-danger breeze:disabled:cursor-not-allowed breeze:disabled:bg-breeze-sunken breeze:disabled:opacity-60',
  },
  compound: {},
  size: {},
  state: {
    readOnlyTrigger: 'breeze:cursor-default breeze:bg-breeze-sunken',
  },
  variant: {},
} as const;

interface SelectCommonProps<T> {
  /** Hints at the browser's autocomplete behaviour for this field. */
  autoComplete?: string;
  /** Focuses the control when the component is mounted. */
  autoFocus?: boolean;
  /** Prevents opening and selecting. Defaults to `false`. */
  disabled?: boolean;
  /** Supporting guidance announced with the control. */
  description?: string;
  /** Visible validation message; any non-empty value marks the field invalid. */
  error?: string;
  /** Associates the control with a form outside its ancestor tree. */
  form?: string;
  /** Maps an item to the closed descriptor rendered by Breeze. */
  getItem: (item: T) => ItemDescriptor;
  /** Sets the control id used by the field label. */
  id?: string;
  /** Accessible field label, shown as text outside loading state. */
  label: string;
  /** Replaces the control with a shape-preserving loading presentation. */
  loading?: boolean;
  /** Fixed choices displayed in the popover listbox. */
  items: T[];
  /** Sets the submitted name of the control. */
  name?: string;
  /** Temporary text shown when no choice is selected. */
  placeholder?: string;
  /** Prevents changing the choice while retaining focus and form participation. */
  readOnly?: boolean;
  /** Marks the control as required. Defaults to `false`. */
  required?: boolean;
}

interface ControlledSelectProps<T> {
  /** Current selected item. */
  value: T | null;
  /** Reports the next selected item without exposing a DOM event. */
  onChange: (value: T | null) => void;
  /** Controlled and uncontrolled value props are mutually exclusive. */
  defaultValue?: never;
}

interface UncontrolledSelectProps<T> {
  /** Initial selected item. */
  defaultValue?: T | null;
  /** Reports the next selected item without exposing a DOM event. */
  onChange?: (value: T | null) => void;
  /** Controlled and uncontrolled value props are mutually exclusive. */
  value?: never;
}

/** Props for controlled or uncontrolled fixed-choice selection. */
export type SelectProps<T> = SelectCommonProps<T> &
  (ControlledSelectProps<T> | UncontrolledSelectProps<T>);

interface SelectItem<T> {
  descriptor: ItemDescriptor;
  item: T;
}

function SelectListBox<T>({ items }: Readonly<{ items: SelectItem<T>[] }>) {
  return (
    <AriaListBox className={collectionVariants.base.listBox} items={items}>
      {(item: SelectItem<T>) => (
        <AriaListBoxItem
          className={collectionVariants.base.item}
          id={item.descriptor.id}
          isDisabled={item.descriptor.disabled}
          textValue={item.descriptor.label}
          value={item}
        >
          {({ isSelected }) => (
            <DescriptorContent
              descriptor={item.descriptor}
              isSelected={isSelected}
            />
          )}
        </AriaListBoxItem>
      )}
    </AriaListBox>
  );
}

function SelectReadOnlyFormValue({
  form,
  interactionDisabled,
  name,
  readOnly,
}: Readonly<{
  form?: string;
  interactionDisabled: boolean;
  name?: string;
  readOnly: boolean;
}>) {
  const state = useContext(AriaSelectStateContext);

  if (!readOnly || interactionDisabled || !name || state === null) return null;

  return (
    <input
      form={form}
      name={name}
      type="hidden"
      value={state.value === null ? '' : String(state.value)}
    />
  );
}

function SelectPopover<T>({
  disabled,
  items,
  readOnly,
  triggerRef,
}: Readonly<{
  disabled: boolean;
  items: SelectItem<T>[];
  readOnly: boolean;
  triggerRef: RefObject<HTMLButtonElement | null>;
}>) {
  const state = useContext(AriaSelectStateContext);
  const blocked = disabled || readOnly || items.length === 0;
  const isOpen = !blocked && (state?.isOpen ?? false);

  useEffect(() => {
    if (blocked && state?.isOpen) {
      state.setOpen(false);
    }
  }, [blocked, state]);

  return (
    <CollectionPopover
      className={collectionVariants.base.popover}
      isOpen={isOpen}
      onOpenChange={(open) => state?.setOpen(open)}
      triggerRef={triggerRef}
    >
      <SelectListBox items={items} />
    </CollectionPopover>
  );
}

/**
 * Renders a fixed-choice popover listbox backed by React Aria Components.
 *
 * @summary Flat fixed-choice selection with semantic item changes.
 */
export function Select<T>({
  autoComplete,
  autoFocus,
  defaultValue,
  description,
  disabled = false,
  error,
  form,
  getItem,
  id,
  items,
  label,
  loading = false,
  name,
  onChange,
  placeholder,
  readOnly = false,
  required = false,
  value,
}: Readonly<SelectProps<T>>) {
  const { messages } = useBreezeContext();
  const visibleDescription = description?.trim() || undefined;
  const visibleError = error?.trim() || undefined;
  const interactionDisabled = disabled || loading;
  const isInvalid = !loading && visibleError !== undefined;
  const fieldId = useId();
  const controlId = id ?? `${fieldId}-control`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const decoratedItems = useMemo<SelectItem<T>[]>(
    () =>
      items.map((item) => ({
        descriptor: getItem(item),
        item,
      })),
    [getItem, items],
  );
  let selectedKey: string | null | undefined;
  if (value === undefined) {
    selectedKey = undefined;
  } else if (value === null) {
    selectedKey = null;
  } else {
    selectedKey = getItem(value).id;
  }
  const defaultSelectedKey =
    defaultValue === undefined || defaultValue === null
      ? null
      : getItem(defaultValue).id;

  return (
    <AriaSelect<SelectItem<T>>
      aria-label={loading ? label : undefined}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      className={fieldVariants.base.root}
      defaultValue={defaultSelectedKey}
      form={form}
      id={controlId}
      isDisabled={interactionDisabled || readOnly}
      isInvalid={isInvalid}
      isRequired={required}
      name={name}
      onChange={(key) => {
        if (readOnly) return;

        const nextItem =
          key === null
            ? undefined
            : decoratedItems.find(
                ({ descriptor }) => descriptor.id === String(key),
              );
        onChange?.(nextItem?.item ?? null);
      }}
      placeholder={placeholder}
      validationBehavior="aria"
      value={selectedKey}
    >
      <FieldLabel
        htmlFor={controlId}
        label={label}
        loading={loading}
        onClick={() => triggerRef.current?.focus()}
      />
      <div className={fieldVariants.base.control}>
        <AriaButton
          className={joinClassNames(
            selectVariants.base.trigger,
            readOnly && selectVariants.state.readOnlyTrigger,
            loading && 'breeze:!opacity-0',
          )}
          isDisabled={interactionDisabled}
          ref={triggerRef}
          render={(buttonProps) =>
            createElement('button', {
              ...buttonProps,
              'aria-busy': loading || undefined,
              'aria-disabled': readOnly || undefined,
              'aria-invalid': isInvalid || undefined,
              'data-invalid': isInvalid || undefined,
              type: 'button',
            })
          }
        >
          <AriaSelectValue
            className={joinClassNames(
              collectionVariants.base.content,
              'breeze:text-start',
            )}
          >
            {({ isPlaceholder, selectedText }) =>
              isPlaceholder ? placeholder ?? '' : selectedText
            }
          </AriaSelectValue>
          <Icon name="expand" size="sm" />
        </AriaButton>
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
      </div>
      <SelectPopover
        disabled={interactionDisabled}
        items={decoratedItems}
        readOnly={readOnly}
        triggerRef={triggerRef}
      />
      <SelectReadOnlyFormValue
        form={form}
        interactionDisabled={interactionDisabled}
        name={name}
        readOnly={readOnly}
      />
      <FieldSupportingContent
        description={visibleDescription}
        error={visibleError}
        loading={loading}
      />
    </AriaSelect>
  );
}
