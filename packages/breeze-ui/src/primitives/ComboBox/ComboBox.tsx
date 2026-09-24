import type { RefObject } from 'react';
import { useContext, useEffect, useId, useMemo, useRef } from 'react';
import { Button as AriaButton } from 'react-aria-components/Button';
import {
  ComboBox as AriaComboBox,
  ComboBoxStateContext as AriaComboBoxStateContext,
  useFilter,
} from 'react-aria-components/ComboBox';
import { Group as AriaGroup } from 'react-aria-components/Group';
import { Input as AriaInput } from 'react-aria-components/Input';
import { ListBox as AriaListBox } from 'react-aria-components/ListBox';
import { useBreezeContext } from '../../provider/BreezeContext';
import collectionVariants from '../Collection/collection.styles';
import CollectionPopover from '../Collection/CollectionPopover';
import DescriptorOption from '../Collection/DescriptorOption';
import type { ItemDescriptor } from '../Collection/item.types';
import {
  FieldLabel,
  FieldSupportingContent,
} from '../Field/field.presentation';
import { fieldVariants, joinClassNames } from '../Field/field.styles';
import { Icon } from '../Icon/Icon';
import { Skeleton } from '../Skeleton/Skeleton';

const variants = {
  base: {
    group:
      'breeze:relative breeze:inline-flex breeze:min-block-breeze-md breeze:any-pointer-coarse:min-block-breeze-tap breeze:min-inline-size-0 breeze:inline-size-full breeze:items-stretch breeze:overflow-hidden breeze:rounded-breeze-ctl breeze:border breeze:border-solid breeze:border-breeze-line-strong breeze:bg-breeze-surface breeze:has-[input[data-focus-visible]]:outline-2 breeze:has-[input[data-focus-visible]]:outline-solid breeze:has-[input[data-focus-visible]]:outline-breeze-brand breeze:data-[disabled]:cursor-not-allowed breeze:data-[disabled]:bg-breeze-sunken breeze:data-[invalid]:border-breeze-danger',
    input:
      'breeze:min-block-breeze-md breeze:min-inline-size-0 breeze:flex-1 breeze:border-0 breeze:bg-transparent breeze:ps-breeze-3 breeze:pe-breeze-2 breeze:py-breeze-2 breeze:font-breeze-sans breeze:text-breeze-sm breeze:leading-breeze-snug breeze:text-breeze-ink breeze:outline-none breeze:placeholder:text-breeze-ink-3 breeze:data-[hovered]:border-transparent breeze:data-[focus-visible]:!outline-none breeze:data-[invalid]:border-transparent breeze:disabled:cursor-not-allowed breeze:read-only:cursor-default',
    popover:
      'breeze:min-inline-size-[var(--trigger-width)] breeze:max-inline-size-[calc(100vw-24px)] breeze:overflow-auto breeze:rounded-breeze-panel breeze:border breeze:border-solid breeze:border-breeze-line breeze:bg-breeze-surface breeze:p-breeze-1 breeze:shadow-breeze-overlay',
    skeleton:
      'breeze:pointer-events-none breeze:absolute breeze:[inset-block:0] breeze:[inset-inline:0]',
    trigger:
      'breeze:inline-grid breeze:shrink-0 breeze:place-items-center breeze:border-0 breeze:bg-transparent breeze:pe-breeze-2 breeze:ps-breeze-2 breeze:text-breeze-ink-2 breeze:outline-none breeze:data-[focus-visible]:outline-2 breeze:data-[focus-visible]:outline-solid breeze:data-[focus-visible]:outline-breeze-brand breeze:disabled:cursor-not-allowed breeze:disabled:opacity-60 breeze:any-pointer-coarse:min-inline-breeze-tap',
  },
  compound: {},
  size: {},
  state: {
    loadingGroup:
      'breeze:!bg-transparent breeze:!border-transparent breeze:!opacity-100 breeze:!overflow-visible',
    loadingInput: 'breeze:!opacity-0',
    loadingTrigger: 'breeze:!opacity-0',
    readOnlyGroup: 'breeze:bg-breeze-sunken',
  },
  variant: {},
} as const;

interface ComboBoxCommonProps<T> {
  /** Hints at the browser's autocomplete behaviour for this field. */
  autoComplete?: string;
  /** Focuses the input when the component is mounted. */
  autoFocus?: boolean;
  /** Prevents editing and opening the suggestions. Defaults to `false`. */
  disabled?: boolean;
  /** Supporting guidance announced with the input. */
  description?: string;
  /** Visible validation message; any non-empty value marks the field invalid. */
  error?: string;
  /** Associates the input with a form outside its ancestor tree. */
  form?: string;
  /** Maps an item to the closed descriptor rendered by Breeze. */
  getItem: (item: T) => ItemDescriptor;
  /** Sets the native input id used by the field label. */
  id?: string;
  /** Accessible field label, shown as text outside loading state. */
  label: string;
  /** Replaces the field with a shape-preserving loading presentation. */
  loading?: boolean;
  /** Items displayed as suggestions. */
  items: T[];
  /** Sets the submitted name of the input. */
  name?: string;
  /** Temporary text shown while the input is empty. */
  placeholder?: string;
  /** Prevents editing while retaining focus and form participation. */
  readOnly?: boolean;
  /** Marks the input as required. Defaults to `false`. */
  required?: boolean;
}

/** The application value emitted by a ComboBox. */
type ComboBoxValue<T> = T | string | null;

interface ControlledComboBoxProps<Value> {
  /** Current selected item or free-text value. */
  value: Value;
  /** Reports the next selected item or free-text value without exposing a DOM event. */
  onChange: (value: Value) => void;
  /** Controlled and uncontrolled value props are mutually exclusive. */
  defaultValue?: never;
}

interface UncontrolledComboBoxProps<Value> {
  /** Initial selected item or free-text value. */
  defaultValue?: Value;
  /** Reports the next selected item or free-text value without exposing a DOM event. */
  onChange?: (value: Value) => void;
  /** Controlled and uncontrolled value props are mutually exclusive. */
  value?: never;
}

/** Props for controlled or uncontrolled suggestion entry. */
export type ComboBoxProps<T> =
  | (ComboBoxCommonProps<T> & {
      /** Allows a value that is not one of the suggestions. */
      allowsCustomValue: true;
    } & (
        | ControlledComboBoxProps<ComboBoxValue<NoInfer<T>>>
        | UncontrolledComboBoxProps<ComboBoxValue<NoInfer<T>>>
      ))
  | (ComboBoxCommonProps<T> & {
      /** Disallows values that are not one of the suggestions. */
      allowsCustomValue?: false;
    } & (
        | ControlledComboBoxProps<NoInfer<T> | null>
        | UncontrolledComboBoxProps<NoInfer<T> | null>
      ));

interface ComboBoxItem<T> {
  descriptor: ItemDescriptor;
  item: T;
}

function findItem<T>(
  value: T,
  decoratedItems: ComboBoxItem<T>[],
  getItem: (item: T) => ItemDescriptor,
  allowsCustomValue: boolean,
) {
  const directItem = decoratedItems.find(({ item }) => item === value);
  if (directItem) return directItem;

  if (allowsCustomValue && typeof value === 'string') return undefined;

  const { id } = getItem(value);
  return decoratedItems.find((item) => item.descriptor.id === id);
}

function ComboBoxListBox<T>({ items }: Readonly<{ items: ComboBoxItem<T>[] }>) {
  return (
    <AriaListBox className={collectionVariants.base.listBox} items={items}>
      {(item: ComboBoxItem<T>) => (
        <DescriptorOption descriptor={item.descriptor} />
      )}
    </AriaListBox>
  );
}

function ComboBoxPopover<T>({
  allowsCustomValue,
  hasSuggestions,
  isDisabled,
  isReadOnly,
  items,
  triggerRef,
}: Readonly<{
  allowsCustomValue: boolean;
  hasSuggestions: boolean;
  isDisabled: boolean;
  isReadOnly: boolean;
  items: ComboBoxItem<T>[];
  triggerRef: RefObject<Element | null>;
}>) {
  const state = useContext(AriaComboBoxStateContext);
  const isBlocked = isDisabled || isReadOnly;
  const isOpen =
    !isBlocked &&
    (hasSuggestions || allowsCustomValue) &&
    (state?.isOpen ?? false);

  useEffect(() => {
    if (
      (isBlocked || (!hasSuggestions && !allowsCustomValue)) &&
      state?.isOpen
    ) {
      state.setOpen(false);
    }
  }, [allowsCustomValue, hasSuggestions, isBlocked, state]);

  return (
    <CollectionPopover
      className={variants.base.popover}
      isOpen={isOpen}
      onOpenChange={(open) => state?.setOpen(open)}
      triggerRef={triggerRef}
    >
      <ComboBoxListBox items={items} />
    </CollectionPopover>
  );
}

/**
 * Renders a filtered suggestion field with closed descriptor content and
 * optional application-owned free text.
 *
 * @summary Flat suggestion entry with semantic item or text changes.
 */
function ComboBoxBase<T>({ props }: Readonly<{ props: ComboBoxProps<T> }>) {
  const {
    allowsCustomValue = false,
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
  } = props;
  const { messages } = useBreezeContext();
  const { contains } = useFilter({ sensitivity: 'base' });
  const visibleDescription = description?.trim() || undefined;
  const visibleError = error?.trim() || undefined;
  const interactionDisabled = disabled || loading;
  const fieldId = useId();
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;
  const supportingIds =
    [visibleDescription && descriptionId, visibleError && errorId]
      .filter(Boolean)
      .join(' ') || undefined;
  const groupRef = useRef<HTMLDivElement>(null);
  const decoratedItems = useMemo<ComboBoxItem<T>[]>(
    () =>
      items.map((item) => ({
        descriptor: getItem(item),
        item,
      })),
    [getItem, items],
  );

  const selectedItem =
    value !== undefined && value !== null
      ? findItem(value as T, decoratedItems, getItem, allowsCustomValue)
      : undefined;
  let selectedKey: string | null | undefined;
  if (value === undefined) {
    selectedKey = undefined;
  } else if (value === null || (typeof value === 'string' && !selectedItem)) {
    selectedKey = null;
  } else {
    selectedKey = selectedItem?.descriptor.id ?? getItem(value as T).id;
  }
  const defaultItem =
    defaultValue !== undefined && defaultValue !== null
      ? findItem(defaultValue as T, decoratedItems, getItem, allowsCustomValue)
      : undefined;
  let defaultSelectedKey: string | null | undefined;
  if (defaultValue === undefined) {
    defaultSelectedKey = undefined;
  } else if (
    defaultValue === null ||
    (typeof defaultValue === 'string' && !defaultItem)
  ) {
    defaultSelectedKey = null;
  } else {
    defaultSelectedKey =
      defaultItem?.descriptor.id ?? getItem(defaultValue as T).id;
  }
  const controlledInputValue =
    value !== undefined && allowsCustomValue
      ? selectedItem?.descriptor.label ??
        (typeof value === 'string' ? value : '')
      : undefined;
  const defaultCustomValue =
    defaultValue !== undefined &&
    allowsCustomValue &&
    typeof defaultValue === 'string' &&
    !defaultItem
      ? defaultValue
      : undefined;
  const lastSelectedKeyRef = useRef<string | null>(
    selectedKey == null ? null : String(selectedKey),
  );
  const emitChange = onChange as
    | ((nextValue: ComboBoxValue<T>) => void)
    | undefined;

  useEffect(() => {
    lastSelectedKeyRef.current =
      selectedKey == null ? null : String(selectedKey);
  }, [selectedKey]);

  const handleSelectionChange = (key: string | number | null) => {
    lastSelectedKeyRef.current = key == null ? null : String(key);
    const nextItem = decoratedItems.find(
      (item) => item.descriptor.id === String(key),
    );
    emitChange?.(nextItem?.item ?? null);
  };

  const handleInputChange = (inputValue: string) => {
    if (!allowsCustomValue) return;

    const selected = decoratedItems.find(
      (item) => item.descriptor.id === lastSelectedKeyRef.current,
    );
    if (selected?.descriptor.label === inputValue) return;

    emitChange?.(inputValue || null);
  };

  const isInvalid = !loading && visibleError !== undefined;
  const submittedName = interactionDisabled ? undefined : name;

  return (
    <AriaComboBox<ComboBoxItem<T>>
      allowsCustomValue={allowsCustomValue}
      allowsEmptyCollection={allowsCustomValue}
      aria-label={loading ? label : undefined}
      className={fieldVariants.base.root}
      defaultFilter={contains}
      defaultInputValue={defaultCustomValue}
      defaultItems={decoratedItems}
      defaultValue={defaultSelectedKey}
      form={form}
      id={id}
      inputValue={controlledInputValue}
      isDisabled={interactionDisabled}
      isInvalid={isInvalid}
      isReadOnly={readOnly}
      isRequired={required}
      menuTrigger="input"
      name={submittedName}
      onInputChange={handleInputChange}
      onSelectionChange={handleSelectionChange}
      value={selectedKey}
      validationBehavior="aria"
    >
      <FieldLabel label={label} loading={loading} />
      <AriaGroup
        className={joinClassNames(
          variants.base.group,
          loading && variants.state.loadingGroup,
          readOnly && variants.state.readOnlyGroup,
        )}
        isDisabled={interactionDisabled}
        isInvalid={isInvalid}
        isReadOnly={readOnly}
        ref={groupRef}
      >
        <AriaInput
          aria-busy={loading || undefined}
          aria-describedby={supportingIds}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          className={joinClassNames(
            variants.base.input,
            loading && variants.state.loadingInput,
          )}
          form={form}
          placeholder={placeholder}
          readOnly={readOnly || undefined}
        />
        <AriaButton
          aria-describedby={supportingIds}
          className={joinClassNames(
            variants.base.trigger,
            loading && variants.state.loadingTrigger,
          )}
        >
          <Icon name="expand" size="sm" />
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
      <ComboBoxPopover
        allowsCustomValue={allowsCustomValue}
        hasSuggestions={decoratedItems.length > 0}
        isDisabled={interactionDisabled}
        isReadOnly={readOnly}
        items={decoratedItems}
        triggerRef={groupRef}
      />
      <FieldSupportingContent
        description={visibleDescription}
        descriptionId={descriptionId}
        error={visibleError}
        errorId={errorId}
        loading={loading}
      />
    </AriaComboBox>
  );
}

export function ComboBox<T>(props: Readonly<ComboBoxProps<T>>) {
  return <ComboBoxBase props={props} />;
}
