import type { RefObject } from 'react';
import { useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
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
      'breeze:relative breeze:inline-flex breeze:min-block-breeze-md breeze:min-inline-size-0 breeze:inline-size-full breeze:items-stretch breeze:overflow-hidden breeze:rounded-breeze-ctl breeze:border breeze:border-solid breeze:border-breeze-line-strong breeze:bg-breeze-surface breeze:has-[input[data-focus-visible]]:outline-2 breeze:has-[input[data-focus-visible]]:outline-solid breeze:has-[input[data-focus-visible]]:outline-breeze-brand breeze:data-[disabled]:cursor-not-allowed breeze:data-[disabled]:bg-breeze-sunken breeze:data-[invalid]:border-breeze-danger',
    input:
      'breeze:min-block-breeze-md breeze:min-inline-size-0 breeze:flex-1 breeze:border-0 breeze:bg-transparent breeze:ps-breeze-3 breeze:pe-breeze-2 breeze:py-breeze-2 breeze:font-breeze-sans breeze:text-breeze-sm breeze:leading-breeze-snug breeze:text-breeze-ink breeze:outline-none breeze:placeholder:text-breeze-ink-3 breeze:data-[hovered]:border-transparent breeze:data-[focus-visible]:!outline-none breeze:data-[invalid]:border-transparent breeze:disabled:cursor-not-allowed breeze:read-only:cursor-default',
    popover:
      'breeze:min-inline-size-[var(--trigger-width)] breeze:max-inline-size-[calc(100vw-24px)] breeze:overflow-auto breeze:rounded-breeze-panel breeze:border breeze:border-solid breeze:border-breeze-line breeze:bg-breeze-surface breeze:p-breeze-1 breeze:shadow-breeze-overlay',
    skeleton:
      'breeze:pointer-events-none breeze:absolute breeze:[inset-block:0] breeze:[inset-inline:0]',
    trigger:
      'breeze:inline-grid breeze:block-size-full breeze:shrink-0 breeze:place-items-center breeze:border-0 breeze:bg-transparent breeze:pe-breeze-2 breeze:ps-breeze-2 breeze:text-breeze-ink-2 breeze:outline-none breeze:data-[focus-visible]:outline-2 breeze:data-[focus-visible]:outline-solid breeze:data-[focus-visible]:outline-breeze-brand breeze:disabled:cursor-not-allowed breeze:disabled:opacity-60 breeze:any-pointer-coarse:min-inline-breeze-tap',
  },
  compound: {},
  size: {},
  state: {
    loadingGroup:
      'breeze:!bg-transparent breeze:!border-transparent breeze:!opacity-100 breeze:!overflow-visible',
    loadingInput: 'breeze:!opacity-0',
    loadingTrigger: 'breeze:!opacity-0',
  },
  variant: {},
} as const;

interface ComboBoxCommonProps<T> {
  /** Hints at the browser's autocomplete behaviour for this field. */
  autoComplete?: string;
  /** Focuses the input when the component is mounted. */
  autoFocus?: boolean;
  /** Allows a value that is not one of the suggestions. */
  allowsCustomValue?: boolean;
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

interface ControlledComboBoxProps<T> {
  /** Current selected item or free-text value. */
  value: ComboBoxValue<T>;
  /** Reports the next selected item or free-text value without exposing a DOM event. */
  onChange: (value: ComboBoxValue<T>) => void;
  /** Controlled and uncontrolled value props are mutually exclusive. */
  defaultValue?: never;
}

interface UncontrolledComboBoxProps<T> {
  /** Initial selected item or free-text value. */
  defaultValue?: ComboBoxValue<T>;
  /** Reports the next selected item or free-text value without exposing a DOM event. */
  onChange?: (value: ComboBoxValue<T>) => void;
  /** Controlled and uncontrolled value props are mutually exclusive. */
  value?: never;
}

/** Props for controlled or uncontrolled suggestion entry. */
export type ComboBoxProps<T> = ComboBoxCommonProps<T> &
  (ControlledComboBoxProps<T> | UncontrolledComboBoxProps<T>);

/** The application value emitted by a ComboBox. */
type ComboBoxValue<T> = T | string | null;

interface ComboBoxItem<T> {
  descriptor: ItemDescriptor;
  item: T;
}

interface ControlledSelection {
  id: string | null;
  label: string;
}

type ComboBoxChangeKey = string | number | null;

function itemKey<T>(item: ComboBoxItem<T>) {
  return item.descriptor.id;
}

function getControlledTextValue<T>(
  value: ComboBoxValue<T>,
  selectedItem: ComboBoxItem<T> | undefined,
  getItem: (item: T) => ItemDescriptor,
) {
  if (value === null) return '';
  if (selectedItem) return selectedItem.descriptor.label;
  if (typeof value === 'string') return value;
  return getItem(value).label;
}

function findItem<T>(
  items: ComboBoxItem<T>[],
  value: ComboBoxValue<T>,
  getItem: (item: T) => ItemDescriptor,
) {
  if (value === null) {
    return undefined;
  }

  const directItem = items.find(({ item }) => item === value);

  if (directItem) {
    return directItem;
  }

  if (typeof value === 'string') return undefined;

  const valueId = getItem(value).id;

  return items.find(({ descriptor }) => descriptor.id === valueId);
}

interface ComboBoxPopoverProps<T> {
  getItem: (item: T) => ItemDescriptor;
  items: T[];
  triggerRef: RefObject<Element | null>;
}

function ComboBoxPopover<T>({
  getItem,
  items,
  triggerRef,
}: Readonly<ComboBoxPopoverProps<T>>) {
  const state = useContext(AriaComboBoxStateContext);

  return (
    <CollectionPopover
      className={variants.base.popover}
      isOpen={state?.isOpen ?? false}
      onOpenChange={(isOpen) => state?.setOpen(isOpen)}
      triggerRef={triggerRef}
    >
      <AriaListBox items={items}>
        {(item: T) => <DescriptorOption descriptor={getItem(item)} />}
      </AriaListBox>
    </CollectionPopover>
  );
}

function getDefaultTextValue<T>(
  value: ComboBoxValue<T> | undefined,
  selectedItem: ComboBoxItem<T> | undefined,
  getItem: (item: T) => ItemDescriptor,
) {
  if (value === null || value === undefined) return undefined;
  if (selectedItem) return selectedItem.descriptor.label;
  if (typeof value === 'string') return value;
  return getItem(value).label;
}

function getControlledSelectionDescriptor<T>(
  value: ComboBoxValue<T>,
  selectedItem: ComboBoxItem<T> | undefined,
  getItem: (item: T) => ItemDescriptor,
) {
  if (selectedItem || value === null || typeof value === 'string') {
    return selectedItem?.descriptor;
  }

  return getItem(value);
}

function matchesControlledSelection(
  current: ControlledSelection | null,
  next: ControlledSelection | null,
) {
  return (
    current !== null &&
    next !== null &&
    current.id === next.id &&
    current.label === next.label
  );
}

function canDraftControlledValue<T>(
  value: ComboBoxValue<T> | undefined,
  selectedItem: ComboBoxItem<T> | undefined,
) {
  return (
    value !== undefined &&
    value !== null &&
    (selectedItem !== undefined || typeof value !== 'string')
  );
}

function matchesControlledCustomValue<T>(
  value: ComboBoxValue<T> | undefined,
  pendingValue: string | null | undefined,
) {
  return pendingValue !== undefined && value === pendingValue;
}

interface ControlledSelectionUpdate {
  resetLabel?: string;
  selection: ControlledSelection | null;
}

function getControlledSelectionUpdate<T>(
  value: ComboBoxValue<T> | undefined,
  selectedItem: ComboBoxItem<T> | undefined,
  getItem: (item: T) => ItemDescriptor,
  previousSelection: ControlledSelection | null,
): ControlledSelectionUpdate {
  if (value === undefined) {
    return { selection: null };
  }

  const descriptor = getControlledSelectionDescriptor(
    value,
    selectedItem,
    getItem,
  );
  const nextSelection = {
    id: descriptor?.id ?? null,
    label: descriptor?.label ?? (typeof value === 'string' ? value : ''),
  };

  return {
    resetLabel:
      previousSelection !== null &&
      (previousSelection.id !== nextSelection.id ||
        previousSelection.label !== nextSelection.label)
        ? nextSelection.label
        : undefined,
    selection: nextSelection,
  };
}

function getVisibleItems<T>(
  items: T[],
  decoratedItems: ComboBoxItem<T>[],
  filterText: string,
  contains: (value: string, search: string) => boolean,
) {
  const query = filterText.trim();

  if (!query) return items;

  return decoratedItems
    .filter(({ descriptor }) => contains(descriptor.label, query))
    .map(({ item }) => item);
}

interface ComboBoxModel<T> {
  controlledTextValue: string | undefined;
  defaultSelectedKey: string | undefined;
  defaultTextValue: string | undefined;
  handleInputChange: (inputValue: string) => void;
  handleOpenChange: (isOpen: boolean) => void;
  handleValueChange: (key: ComboBoxChangeKey) => void;
  selectedKey: string | null;
  visibleItems: T[];
}

function useComboBoxModel<T>(
  props: Readonly<ComboBoxProps<T>>,
): ComboBoxModel<T> {
  const {
    allowsCustomValue = false,
    defaultValue,
    getItem,
    items,
    onChange,
    value,
  } = props;
  const [filterText, setFilterText] = useState('');
  const [controlledInputDraft, setControlledInputDraft] = useState<
    string | undefined
  >();
  const controlledSelectionRef = useRef<ControlledSelection | null>(null);
  const controlledDraftSelectionRef = useRef<ControlledSelection | null>(null);
  const pendingCustomValueRef = useRef<string | null | undefined>(undefined);
  const selectionResetLabelRef = useRef<string | null>(null);
  const lastCustomChangeRef = useRef<ComboBoxValue<T> | undefined>(undefined);
  const decoratedItems = useMemo<ComboBoxItem<T>[]>(
    () =>
      items.map((item) => ({
        descriptor: getItem(item),
        item,
      })),
    [getItem, items],
  );
  const selectedValue = value !== undefined ? value : defaultValue ?? null;
  const selectedItem = findItem(decoratedItems, selectedValue, getItem);
  const selectedKey = selectedItem ? itemKey(selectedItem) : null;
  const defaultSelectedItem = findItem(
    decoratedItems,
    defaultValue ?? null,
    getItem,
  );
  const defaultSelectedKey = defaultSelectedItem
    ? itemKey(defaultSelectedItem)
    : undefined;
  const baseControlledTextValue =
    value === undefined
      ? undefined
      : getControlledTextValue(value, selectedItem, getItem);
  const defaultTextValue = getDefaultTextValue(
    defaultValue,
    defaultSelectedItem,
    getItem,
  );
  const controlledSelectionUpdate = getControlledSelectionUpdate(
    value,
    selectedItem,
    getItem,
    controlledSelectionRef.current,
  );
  controlledSelectionRef.current = controlledSelectionUpdate.selection;
  const controlledSelection = controlledSelectionUpdate.selection;
  const isControlledCustomEcho =
    controlledSelectionUpdate.resetLabel !== undefined &&
    allowsCustomValue &&
    matchesControlledCustomValue(value, pendingCustomValueRef.current);
  if (controlledSelectionUpdate.resetLabel !== undefined) {
    if (isControlledCustomEcho) {
      pendingCustomValueRef.current = undefined;
    } else {
      selectionResetLabelRef.current = controlledSelectionUpdate.resetLabel;
      pendingCustomValueRef.current = undefined;
    }
  }
  const controlledSelectionChanged =
    controlledSelectionUpdate.resetLabel !== undefined &&
    !isControlledCustomEcho;
  const hasControlledInputDraft =
    value !== undefined &&
    controlledInputDraft !== undefined &&
    matchesControlledSelection(
      controlledDraftSelectionRef.current,
      controlledSelection,
    );

  if (controlledInputDraft !== undefined && !hasControlledInputDraft) {
    controlledDraftSelectionRef.current = null;
  }

  const { contains } = useFilter({ sensitivity: 'base' });
  const visibleItems = getVisibleItems(
    items,
    decoratedItems,
    controlledSelectionChanged ? '' : filterText,
    contains,
  );
  const controlledTextValue = hasControlledInputDraft
    ? controlledInputDraft
    : baseControlledTextValue;

  useEffect(() => {
    if (!controlledSelectionChanged) return;

    setFilterText('');
    setControlledInputDraft(undefined);
    controlledDraftSelectionRef.current = null;
  }, [
    controlledSelectionChanged,
    controlledSelection?.id,
    controlledSelection?.label,
  ]);

  const resetInputDraft = () => {
    setFilterText('');
    setControlledInputDraft(undefined);
    controlledDraftSelectionRef.current = null;
    pendingCustomValueRef.current = undefined;
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetInputDraft();
    }
  };

  const handleInputChange = (inputValue: string) => {
    if (
      selectionResetLabelRef.current !== null &&
      inputValue === selectionResetLabelRef.current
    ) {
      selectionResetLabelRef.current = null;
      resetInputDraft();
      return;
    }

    if (value !== undefined && selectedItem?.descriptor.label === inputValue) {
      selectionResetLabelRef.current = null;
      resetInputDraft();
      return;
    }

    selectionResetLabelRef.current = null;
    setFilterText(inputValue);

    if (canDraftControlledValue(value, selectedItem)) {
      setControlledInputDraft(inputValue);
      controlledDraftSelectionRef.current = controlledSelection;
    }

    if (!allowsCustomValue) {
      if (inputValue === '' && value !== undefined) {
        onChange?.(null);
      }

      return;
    }

    const nextValue = inputValue || null;
    if (value !== undefined) {
      pendingCustomValueRef.current = nextValue;
    }
    lastCustomChangeRef.current = nextValue;
    onChange?.(nextValue);
  };

  const handleValueChange = (key: ComboBoxChangeKey) => {
    const isDraftCommit =
      key !== null &&
      value !== undefined &&
      controlledInputDraft !== undefined &&
      key === selectedKey;

    if (isDraftCommit) {
      selectionResetLabelRef.current = selectedItem?.descriptor.label ?? '';
      resetInputDraft();
      return;
    }

    if (key === null) {
      if (allowsCustomValue && lastCustomChangeRef.current !== undefined) {
        return;
      }

      onChange?.(null);
      return;
    }

    const nextItem = decoratedItems.find(
      (item) => itemKey(item) === String(key),
    );
    selectionResetLabelRef.current = nextItem?.descriptor.label ?? '';
    lastCustomChangeRef.current = undefined;
    resetInputDraft();
    onChange?.(nextItem?.item ?? null);
  };

  return {
    controlledTextValue,
    defaultSelectedKey,
    defaultTextValue,
    handleInputChange,
    handleOpenChange,
    handleValueChange,
    selectedKey,
    visibleItems,
  };
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
    description,
    disabled = false,
    error,
    form,
    getItem,
    id,
    label,
    loading = false,
    name,
    placeholder,
    readOnly = false,
    required = false,
    value,
  } = props;
  const { messages } = useBreezeContext();
  const model = useComboBoxModel(props);
  const visibleDescription = description?.trim() || undefined;
  const visibleError = error?.trim() || undefined;
  const interactionDisabled = disabled || loading;
  const groupRef = useRef<HTMLDivElement>(null);
  const fieldId = useId();
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;
  const supportingIds =
    [visibleDescription && descriptionId, visibleError && errorId]
      .filter(Boolean)
      .join(' ') || undefined;
  const submittedName = interactionDisabled ? undefined : name;

  return (
    <AriaComboBox
      allowsCustomValue={allowsCustomValue}
      allowsEmptyCollection={allowsCustomValue}
      aria-label={loading ? label : undefined}
      className={fieldVariants.base.root}
      defaultInputValue={model.defaultTextValue}
      defaultValue={model.defaultSelectedKey}
      form={form}
      id={id}
      inputValue={model.controlledTextValue}
      isDisabled={interactionDisabled}
      isInvalid={!loading && visibleError !== undefined}
      isReadOnly={readOnly}
      isRequired={required}
      items={model.visibleItems}
      menuTrigger="input"
      name={submittedName}
      onChange={model.handleValueChange}
      onInputChange={model.handleInputChange}
      onOpenChange={model.handleOpenChange}
      value={value !== undefined ? model.selectedKey : undefined}
      validationBehavior="aria"
    >
      <FieldLabel label={label} loading={loading} />
      <AriaGroup
        className={joinClassNames(
          variants.base.group,
          loading && variants.state.loadingGroup,
        )}
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
        getItem={getItem}
        items={model.visibleItems}
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
