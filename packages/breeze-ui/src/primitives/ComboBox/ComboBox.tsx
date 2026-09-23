import type { RefObject, SyntheticEvent } from 'react';
import {
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Button as AriaButton } from 'react-aria-components/Button';
import {
  ComboBox as AriaComboBox,
  ComboBoxStateContext as AriaComboBoxStateContext,
  useFilter,
} from 'react-aria-components/ComboBox';
import { Group as AriaGroup } from 'react-aria-components/Group';
import { Input as AriaInput } from 'react-aria-components/Input';
import { ListBox as AriaListBox } from 'react-aria-components/ListBox';
import { flushSync } from 'react-dom';
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

interface ControlledSelection {
  id: string | null;
  label: string;
}

type ComboBoxChangeKey = string | number | null;
type ComboBoxStateValue =
  | ComboBoxChangeKey
  | readonly ComboBoxChangeKey[]
  | undefined;

function isComboBoxKeyArray(
  value: ComboBoxStateValue,
): value is readonly ComboBoxChangeKey[] {
  return Array.isArray(value);
}

function getComboBoxKey(value: ComboBoxStateValue): ComboBoxChangeKey {
  if (isComboBoxKeyArray(value)) return value[0] ?? null;

  return value ?? null;
}

function sameComboBoxKey(left: ComboBoxChangeKey, right: ComboBoxChangeKey) {
  return (
    left === right ||
    (left !== null && right !== null && String(left) === String(right))
  );
}

function itemKey<T>(item: ComboBoxItem<T>) {
  return item.descriptor.id;
}

function resolveComboBoxItem<T>(
  key: ComboBoxChangeKey,
  decoratedItems: ComboBoxItem<T>[],
  initialControlledItem: ComboBoxItem<T> | undefined,
  defaultSelectedItem: ComboBoxItem<T> | undefined,
) {
  const stringKey = String(key);
  const decoratedItem = decoratedItems.find(
    (item) => itemKey(item) === stringKey,
  );

  if (decoratedItem) return decoratedItem;
  if (initialControlledItem?.descriptor.id === stringKey) {
    return initialControlledItem;
  }

  if (defaultSelectedItem?.descriptor.id === stringKey) {
    return defaultSelectedItem;
  }

  return undefined;
}

function getComboBoxValueForKey<T>(
  key: ComboBoxChangeKey,
  value: ComboBoxValue<T> | undefined,
  selectedKey: string | null,
  decoratedItems: ComboBoxItem<T>[],
  initialControlledItem: ComboBoxItem<T> | undefined,
  defaultSelectedItem: ComboBoxItem<T> | undefined,
  allowsCustomValue: boolean,
) {
  if (key === null) return null;

  if (
    value !== undefined &&
    sameComboBoxKey(key, selectedKey) &&
    !(typeof value === 'string' && allowsCustomValue)
  ) {
    return value as T;
  }

  const nextItem = resolveComboBoxItem(
    key,
    decoratedItems,
    initialControlledItem,
    defaultSelectedItem,
  );

  if (nextItem) return nextItem.item;

  return null;
}

function getSelectedKey<T>(
  value: ComboBoxValue<T> | undefined,
  selectedItem: ComboBoxItem<T> | undefined,
  getItem: (item: T) => ItemDescriptor,
  allowsCustomValue: boolean,
) {
  if (selectedItem) return itemKey(selectedItem);
  if (
    value === undefined ||
    value === null ||
    (typeof value === 'string' && allowsCustomValue)
  ) {
    return null;
  }

  return getItem(value as T).id;
}

function getControlledTextValue<T>(
  value: ComboBoxValue<T>,
  selectedItem: ComboBoxItem<T> | undefined,
  getItem: (item: T) => ItemDescriptor,
  allowsCustomValue: boolean,
) {
  if (value === null) return '';
  if (selectedItem) return selectedItem.descriptor.label;
  if (typeof value === 'string' && allowsCustomValue) return value;
  return getItem(value as T).label;
}

function findItem<T>(
  items: ComboBoxItem<T>[],
  value: ComboBoxValue<T>,
  getItem: (item: T) => ItemDescriptor,
  allowsCustomValue = false,
) {
  if (value === null) {
    return undefined;
  }

  const directItem = items.find(({ item }) => item === value);

  if (directItem) {
    return directItem;
  }

  if (typeof value === 'string' && allowsCustomValue) return undefined;

  const valueId = getItem(value as T).id;

  return items.find(({ descriptor }) => descriptor.id === valueId);
}

function getInitialControlledItem<T>(
  value: ComboBoxValue<T> | undefined,
  getItem: (item: T) => ItemDescriptor,
  allowsCustomValue: boolean,
) {
  if (
    value === undefined ||
    value === null ||
    (allowsCustomValue && typeof value === 'string')
  ) {
    return undefined;
  }

  return {
    descriptor: getItem(value as T),
    item: value as T,
  };
}

interface ComboBoxPopoverProps<T> {
  allowsCustomValue: boolean;
  getItem: (item: T) => ItemDescriptor;
  hasSuggestions: boolean;
  isDisabled: boolean;
  isReadOnly: boolean;
  items: T[];
  triggerRef: RefObject<Element | null>;
}

interface ComboBoxListBoxProps<T> {
  getItem: (item: T) => ItemDescriptor;
  items: T[];
}

function ComboBoxListBox<T>({
  getItem,
  items,
}: Readonly<ComboBoxListBoxProps<T>>) {
  return (
    <AriaListBox items={items}>
      {(item: T) => <DescriptorOption descriptor={getItem(item)} />}
    </AriaListBox>
  );
}

function ComboBoxPopover<T>({
  allowsCustomValue,
  getItem,
  hasSuggestions,
  isDisabled,
  isReadOnly,
  items,
  triggerRef,
}: Readonly<ComboBoxPopoverProps<T>>) {
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
      state?.setOpen(false);
    }
  }, [allowsCustomValue, hasSuggestions, isBlocked, state]);

  return (
    <CollectionPopover
      className={variants.base.popover}
      isOpen={isOpen}
      onOpenChange={(open) => state?.setOpen(open)}
      triggerRef={triggerRef}
    >
      <ComboBoxListBox getItem={getItem} items={items} />
    </CollectionPopover>
  );
}

function ComboBoxReadOnlyReset({
  allowsCustomValue,
  currentTextValue,
  isControlled,
  isReadOnly,
  resetTextValue,
}: Readonly<{
  allowsCustomValue: boolean;
  currentTextValue: string;
  isControlled: boolean;
  isReadOnly: boolean;
  resetTextValue: string;
}>) {
  const state = useContext(AriaComboBoxStateContext);
  const wasReadOnly = useRef(isReadOnly);
  const committedCustomValue = useRef(resetTextValue);
  const wasFocused = useRef(state?.isFocused ?? false);
  const wasOpen = useRef(state?.isOpen ?? false);

  useLayoutEffect(() => {
    const committedOnBlur =
      state !== null && wasFocused.current && !state.isFocused;

    if (
      !allowsCustomValue &&
      state &&
      !isControlled &&
      state.value !== null &&
      state.inputValue === '' &&
      state.inputValue !== currentTextValue
    ) {
      state.setInputValue(currentTextValue);
    }

    if (allowsCustomValue && state && !isReadOnly && state.value === null) {
      const committedOnClose = wasOpen.current && !state.isOpen;

      if (committedOnBlur || committedOnClose) {
        committedCustomValue.current = state.inputValue;
      }
    }

    if (
      !allowsCustomValue &&
      state &&
      !state.isFocused &&
      state.value !== null &&
      (committedOnBlur || state.inputValue === '') &&
      state.inputValue !== currentTextValue
    ) {
      state.setInputValue(currentTextValue);
    }

    wasFocused.current = state?.isFocused ?? false;
    wasOpen.current = state?.isOpen ?? false;
  }, [allowsCustomValue, currentTextValue, isControlled, isReadOnly, state]);

  useLayoutEffect(() => {
    if (isReadOnly && !wasReadOnly.current) {
      if (allowsCustomValue && state?.value === null) {
        let resetValue = committedCustomValue.current;
        if (isControlled) {
          resetValue = currentTextValue;
        } else if (state.isFocused && !state.isOpen) {
          resetValue = state.inputValue;
        }
        state.setInputValue(resetValue);
      } else {
        state?.revert();
      }
    }

    wasReadOnly.current = isReadOnly;
  }, [
    allowsCustomValue,
    currentTextValue,
    isControlled,
    isReadOnly,
    resetTextValue,
    state,
  ]);

  return null;
}

interface ComboBoxInputProps<T> {
  allowsCustomValue: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  'aria-describedby'?: string;
  className: string;
  disabled: boolean;
  form?: string;
  getItem: (item: T) => ItemDescriptor;
  clearFormReset: () => void;
  handleFormReset: (
    event: Event,
    state: ComboBoxResetState | null,
    phase: ComboBoxResetPhase,
  ) => void;
  isControlled: boolean;
  items: T[];
  loading: boolean;
  placeholder?: string;
  readOnly: boolean;
  resetName?: string;
}

interface PendingResetInput {
  hiddenDefaultValue?: string;
  hiddenInput?: HTMLInputElement;
  hiddenValue?: string;
  inputDefaultValue: string;
  inputValue: string;
  resetInputValue: string;
}

type ComboBoxResetPhase = 'capture' | 'bubble';

interface ComboBoxResetState {
  defaultInputValue: string;
  defaultValue: ComboBoxChangeKey;
  isActive: () => boolean;
  isOpen: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  setOpen: (isOpen: boolean) => void;
  setValue: (value: ComboBoxChangeKey) => void;
  value: ComboBoxChangeKey;
}

interface ComboBoxResetTransaction {
  event: Event;
  filterText: string;
  state: ComboBoxResetState;
  userInteracted: boolean;
  userChangeEmitted: boolean;
}

interface PendingResetInputHandling {
  clearPending: boolean;
  ignore: boolean;
}

function isResetEventDispatching(
  pendingReset: ComboBoxResetTransaction | null,
) {
  // Event.NONE marks the post-dispatch window where user input must not be
  // mistaken for React Aria's reset notification.
  return (pendingReset?.event.eventPhase ?? Event.NONE) !== Event.NONE;
}

function getPendingResetInputHandling(
  inputValue: string,
  pendingReset: ComboBoxResetTransaction | null,
  inputPending: boolean,
): PendingResetInputHandling {
  if (!inputPending) {
    return { clearPending: false, ignore: false };
  }

  if (inputValue === '' && isResetEventDispatching(pendingReset)) {
    return { clearPending: true, ignore: true };
  }

  if (
    inputValue === pendingReset?.state.defaultInputValue &&
    (inputValue !== '' || isResetEventDispatching(pendingReset))
  ) {
    return { clearPending: false, ignore: true };
  }

  return { clearPending: true, ignore: false };
}

function ComboBoxInput<T>({
  allowsCustomValue,
  autoComplete,
  autoFocus,
  'aria-describedby': ariaDescribedBy,
  className,
  disabled,
  form,
  getItem,
  clearFormReset,
  handleFormReset,
  isControlled,
  items,
  loading,
  placeholder,
  readOnly,
  resetName,
}: Readonly<ComboBoxInputProps<T>>) {
  const state = useContext(AriaComboBoxStateContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const clearFormResetRef = useRef(clearFormReset);
  const formResetHandlerRef = useRef(handleFormReset);
  const stateRef = useRef(state);
  const handledAutofillEvent = useRef<Event | null>(null);

  useLayoutEffect(() => {
    clearFormResetRef.current = clearFormReset;
    formResetHandlerRef.current = handleFormReset;
    stateRef.current = state;
  }, [clearFormReset, handleFormReset, state]);

  useLayoutEffect(() => {
    let active = true;
    let pendingResetEvent: Event | null = null;
    let pendingResetInput: PendingResetInput | null = null;

    const captureReset = (event: Event) => {
      const associatedForm = form
        ? document.getElementById(form)
        : inputRef.current?.form;
      const currentState = stateRef.current;
      const input = inputRef.current;

      if (
        !(associatedForm instanceof HTMLFormElement) ||
        event.target !== associatedForm ||
        !currentState ||
        !input
      ) {
        return;
      }

      // Native form reset runs after the event listeners. Keep the browser's
      // own reset targets aligned with React Aria's committed defaults without
      // exposing them before a consumer can cancel the reset.
      const hiddenInput = resetName
        ? associatedForm.elements.namedItem(resetName)
        : null;
      const pendingHiddenInput =
        hiddenInput instanceof HTMLInputElement && hiddenInput.type === 'hidden'
          ? hiddenInput
          : undefined;
      const inputDefaultValue = input.defaultValue;
      const inputValue = input.value;
      input.defaultValue = currentState.defaultInputValue;
      pendingResetEvent = event;
      pendingResetInput = {
        hiddenDefaultValue: pendingHiddenInput?.defaultValue,
        hiddenInput: pendingHiddenInput,
        hiddenValue: pendingHiddenInput?.value,
        inputDefaultValue,
        inputValue,
        resetInputValue: currentState.defaultInputValue,
      };
      formResetHandlerRef.current(
        event,
        {
          defaultInputValue: currentState.defaultInputValue,
          defaultValue: getComboBoxKey(currentState.defaultValue),
          inputValue: currentState.inputValue,
          isActive: () => active,
          isOpen: currentState.isOpen,
          setInputValue: (value) => currentState.setInputValue(value),
          setOpen: (isOpen) => currentState.setOpen(isOpen),
          setValue: (value) => currentState.setValue(value),
          value: getComboBoxKey(currentState.value),
        },
        'capture',
      );
    };
    const finalizeReset = (event: Event) => {
      if (pendingResetEvent !== event) return;

      flushSync(() => undefined);
      if (!active || pendingResetEvent !== event) return;

      pendingResetEvent = null;
      const resetInput = pendingResetInput;
      pendingResetInput = null;
      flushSync(() => {
        formResetHandlerRef.current(event, null, 'bubble');
      });
      if (event.defaultPrevented) {
        queueMicrotask(() => {
          if (!active) return;

          if (resetInput && inputRef.current) {
            inputRef.current.value = resetInput.inputValue;
            inputRef.current.defaultValue = resetInput.inputDefaultValue;
          }
          if (resetInput?.hiddenInput) {
            resetInput.hiddenInput.value = resetInput.hiddenValue ?? '';
            resetInput.hiddenInput.defaultValue =
              resetInput.hiddenDefaultValue ?? '';
          }
        });
      } else if (resetInput && inputRef.current) {
        inputRef.current.value = resetInput.resetInputValue;
        inputRef.current.defaultValue = resetInput.resetInputValue;
      }
    };

    document.addEventListener('reset', captureReset, true);
    window.addEventListener('reset', finalizeReset);

    return () => {
      active = false;
      clearFormResetRef.current();
      pendingResetEvent = null;
      pendingResetInput = null;
      document.removeEventListener('reset', captureReset, true);
      window.removeEventListener('reset', finalizeReset);
    };
  }, [form, isControlled, resetName]);

  const handleBlockedInput = (event: SyntheticEvent<HTMLInputElement>) => {
    if (!disabled && !readOnly) return;

    if (state) {
      const { currentTarget } = event;
      currentTarget.value = state.inputValue;
    }

    event.preventDefault();
    event.stopPropagation();
  };

  const handleAutofill = (event: SyntheticEvent<HTMLInputElement>) => {
    if (allowsCustomValue || disabled || readOnly || !state) return;

    const { nativeEvent } = event;
    if (handledAutofillEvent.current === nativeEvent) return;

    const { inputType } = nativeEvent as InputEvent;
    if (inputType && inputType !== 'insertReplacementText') return;

    handledAutofillEvent.current = nativeEvent;
    const input = event.currentTarget;

    const matchingItems = items
      .map((item) => ({ descriptor: getItem(item), item }))
      .filter(
        ({ descriptor }) =>
          (descriptor.id === input.value || descriptor.label === input.value) &&
          !descriptor.disabled,
      );

    if (matchingItems.length !== 1) return;

    const [nextItem] = matchingItems;
    if (state.value === nextItem.descriptor.id) {
      input.value = nextItem.descriptor.label;
      state.setInputValue(nextItem.descriptor.label);
      return;
    }

    state.setInputValue(nextItem.descriptor.label);
    state.setValue(nextItem.descriptor.id);
  };

  return (
    <AriaInput
      aria-busy={loading || undefined}
      aria-describedby={ariaDescribedBy}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      className={className}
      form={form}
      onChange={handleAutofill}
      onChangeCapture={handleBlockedInput}
      onInput={handleAutofill}
      onInputCapture={handleBlockedInput}
      placeholder={placeholder}
      readOnly={readOnly || undefined}
      ref={inputRef}
    />
  );
}

function getDefaultTextValue<T>(
  value: ComboBoxValue<T> | undefined,
  selectedItem: ComboBoxItem<T> | undefined,
  getItem: (item: T) => ItemDescriptor,
  allowsCustomValue: boolean,
) {
  if (value === null || value === undefined) return undefined;
  if (selectedItem) return selectedItem.descriptor.label;
  if (typeof value === 'string' && allowsCustomValue) return value;
  return getItem(value as T).label;
}

function getControlledSelectionDescriptor<T>(
  value: ComboBoxValue<T>,
  selectedItem: ComboBoxItem<T> | undefined,
  getItem: (item: T) => ItemDescriptor,
  allowsCustomValue: boolean,
) {
  if (
    selectedItem ||
    value === null ||
    (typeof value === 'string' && allowsCustomValue)
  ) {
    return selectedItem?.descriptor;
  }

  return getItem(value as T);
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
  allowsCustomValue: boolean,
) {
  return (
    value !== undefined &&
    (value === null
      ? !allowsCustomValue
      : selectedItem !== undefined ||
        !allowsCustomValue ||
        typeof value !== 'string')
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
  allowsCustomValue: boolean,
): ControlledSelectionUpdate {
  if (value === undefined) {
    return { selection: null };
  }

  const descriptor = getControlledSelectionDescriptor(
    value,
    selectedItem,
    getItem,
    allowsCustomValue,
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

function isSelectionResetInput<T>(
  inputValue: string,
  selectionResetLabel: string | null,
  value: ComboBoxValue<T> | undefined,
  selectedItem: ComboBoxItem<T> | undefined,
) {
  return (
    (selectionResetLabel !== null && inputValue === selectionResetLabel) ||
    (value !== undefined && selectedItem?.descriptor.label === inputValue)
  );
}

interface ComboBoxSelection<T> {
  baseControlledTextValue: string | undefined;
  selectedItem: ComboBoxItem<T> | undefined;
  selectedKey: string | null;
}

function getComboBoxSelection<T>(
  value: ComboBoxValue<T> | undefined,
  pendingCustomText: boolean,
  retainedUncontrolledSelectedItem: ComboBoxItem<T> | undefined,
  uncontrolledSelectedKey: string | null,
  decoratedItems: ComboBoxItem<T>[],
  getItem: (item: T) => ItemDescriptor,
  allowsCustomValue: boolean,
): ComboBoxSelection<T> {
  let selectedItem: ComboBoxItem<T> | undefined;
  if (value === undefined) {
    selectedItem = retainedUncontrolledSelectedItem;
  } else if (pendingCustomText) {
    selectedItem = undefined;
  } else {
    selectedItem = findItem(decoratedItems, value, getItem, allowsCustomValue);
  }

  return {
    baseControlledTextValue:
      value === undefined
        ? undefined
        : getControlledTextValue(
            value,
            selectedItem,
            getItem,
            allowsCustomValue,
          ),
    selectedItem,
    selectedKey:
      value === undefined
        ? uncontrolledSelectedKey
        : getSelectedKey(value, selectedItem, getItem, allowsCustomValue),
  };
}

interface ComboBoxModel<T> {
  collectionItems: T[];
  controlledTextValue: string | undefined;
  currentTextValue: string;
  defaultSelectedKey: string | undefined;
  defaultTextValue: string | undefined;
  clearFormReset: () => void;
  handleFormReset: (
    event: Event,
    state: ComboBoxResetState | null,
    phase: ComboBoxResetPhase,
  ) => void;
  handleInputChange: (inputValue: string) => void;
  handleOpenChange: (isOpen: boolean) => void;
  handleValueChange: (key: ComboBoxChangeKey) => void;
  matchesFilter: (textValue: string) => boolean;
  selectedKey: string | null;
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
    readOnly = false,
    value,
  } = props;
  const [filterText, setFilterText] = useState('');
  const [controlledInputDraft, setControlledInputDraft] = useState<
    string | undefined
  >();
  const [initialControlledItem] = useState<ComboBoxItem<T> | undefined>(() =>
    getInitialControlledItem(value, getItem, allowsCustomValue),
  );
  const [initialControlledValue] = useState<ComboBoxValue<T> | undefined>(
    () => value,
  );
  const [initiallyControlled] = useState(() => value !== undefined);
  const [initialDefaultValue] = useState<ComboBoxValue<T> | undefined>(
    () => defaultValue,
  );
  const controlledSelectionRef = useRef<ControlledSelection | null>(null);
  const controlledDraftSelectionRef = useRef<ControlledSelection | null>(null);
  const pendingCustomValueRef = useRef<string | null | undefined>(undefined);
  const selectionResetLabelRef = useRef<string | null>(null);
  const lastCustomChangeRef = useRef<ComboBoxValue<T> | undefined>(undefined);
  const autoClosedNoResultsRef = useRef(false);
  const formResetInputPendingRef = useRef(false);
  const formResetRef = useRef<ComboBoxResetTransaction | null>(null);
  const applyFormResetRef = useRef<(state: ComboBoxResetState) => void>(
    () => undefined,
  );
  const commitFormResetRef = useRef<
    (state: ComboBoxResetState, skipNotification: boolean) => void
  >(() => undefined);
  const suppressFormResetRef = useRef(false);
  const wasReadOnly = useRef(readOnly);

  const restoreFormReset = (
    resetState: ComboBoxResetState,
    restoreOpen = false,
    restoreFilterText?: string,
  ) => {
    if (!resetState.isActive()) return;

    suppressFormResetRef.current = true;
    try {
      resetState.setValue(resetState.value);
      resetState.setInputValue(resetState.inputValue);
      if (restoreFilterText !== undefined) setFilterText(restoreFilterText);
      if (restoreOpen) resetState.setOpen(resetState.isOpen);
    } finally {
      suppressFormResetRef.current = false;
    }

    formResetInputPendingRef.current = false;
  };

  const clearFormReset = () => {
    const pendingReset = formResetRef.current;
    formResetRef.current = null;
    formResetInputPendingRef.current = false;

    if (pendingReset) restoreFormReset(pendingReset.state);
  };

  const supersedeFormReset = () => {
    if (formResetRef.current) formResetRef.current.userInteracted = true;
    formResetInputPendingRef.current = false;
  };

  const markFormResetChange = () => {
    if (formResetRef.current && onChange) {
      formResetRef.current.userChangeEmitted = true;
    }
  };

  useLayoutEffect(() => {
    if (readOnly && !wasReadOnly.current) {
      setFilterText('');
      setControlledInputDraft(undefined);
      controlledDraftSelectionRef.current = null;
      pendingCustomValueRef.current = undefined;
      selectionResetLabelRef.current = null;
      lastCustomChangeRef.current = undefined;
    }

    wasReadOnly.current = readOnly;
  }, [readOnly]);
  const decoratedItems = useMemo<ComboBoxItem<T>[]>(
    () =>
      items.map((item) => ({
        descriptor: getItem(item),
        item,
      })),
    [getItem, items],
  );
  const suppliedDefaultSelectedItem = findItem(
    decoratedItems,
    initialDefaultValue ?? null,
    getItem,
    allowsCustomValue,
  );
  const initialDefaultSelectedItem =
    suppliedDefaultSelectedItem ??
    (value === undefined &&
    initialDefaultValue !== undefined &&
    initialDefaultValue !== null &&
    !(allowsCustomValue && typeof initialDefaultValue === 'string')
      ? {
          descriptor: getItem(initialDefaultValue as T),
          item: initialDefaultValue as T,
        }
      : undefined);
  const defaultSelectedKey =
    getSelectedKey(
      initialDefaultValue,
      initialDefaultSelectedItem,
      getItem,
      allowsCustomValue,
    ) ?? undefined;
  const uncontrolledSelectedKeyRef = useRef<string | null>(
    defaultSelectedKey ?? null,
  );
  const uncontrolledSelectedItemRef = useRef<ComboBoxItem<T> | undefined>(
    initialDefaultSelectedItem,
  );
  const currentUncontrolledSelectedItem = decoratedItems.find(
    ({ descriptor }) => descriptor.id === uncontrolledSelectedKeyRef.current,
  );
  const retainedUncontrolledSelectedItem =
    value === undefined && uncontrolledSelectedKeyRef.current !== null
      ? currentUncontrolledSelectedItem ?? uncontrolledSelectedItemRef.current
      : undefined;
  const defaultSelectedItem = initialDefaultSelectedItem;

  useLayoutEffect(() => {
    if (value === undefined && currentUncontrolledSelectedItem) {
      uncontrolledSelectedItemRef.current = currentUncontrolledSelectedItem;
    }
  }, [currentUncontrolledSelectedItem, value]);
  const pendingCustomText =
    value !== undefined &&
    allowsCustomValue &&
    typeof value === 'string' &&
    matchesControlledCustomValue(value, pendingCustomValueRef.current);
  const { baseControlledTextValue, selectedItem, selectedKey } =
    getComboBoxSelection(
      value,
      pendingCustomText,
      retainedUncontrolledSelectedItem,
      uncontrolledSelectedKeyRef.current,
      decoratedItems,
      getItem,
      allowsCustomValue,
    );
  const defaultTextValue = getDefaultTextValue(
    initialDefaultValue,
    defaultSelectedItem,
    getItem,
    allowsCustomValue,
  );
  const currentTextValue =
    baseControlledTextValue ??
    selectedItem?.descriptor.label ??
    defaultTextValue ??
    '';
  const controlledSelectionUpdate = getControlledSelectionUpdate(
    value,
    selectedItem,
    getItem,
    controlledSelectionRef.current,
    allowsCustomValue,
  );
  const controlledSelection = controlledSelectionUpdate.selection;
  const isControlledCustomEcho =
    controlledSelectionUpdate.resetLabel !== undefined &&
    allowsCustomValue &&
    matchesControlledCustomValue(value, pendingCustomValueRef.current);

  useLayoutEffect(() => {
    controlledSelectionRef.current = controlledSelection;
  }, [controlledSelection]);

  useLayoutEffect(() => {
    if (controlledSelectionUpdate.resetLabel === undefined) return;

    if (isControlledCustomEcho) {
      // Keep the echoed text marked as custom until an explicit option
      // selection or another controlled value replaces it.
      return;
    }

    selectionResetLabelRef.current = controlledSelectionUpdate.resetLabel;
    pendingCustomValueRef.current = undefined;
  }, [
    controlledSelection?.id,
    controlledSelection?.label,
    controlledSelectionUpdate.resetLabel,
    isControlledCustomEcho,
  ]);

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

  useLayoutEffect(() => {
    if (controlledInputDraft !== undefined && !hasControlledInputDraft) {
      controlledDraftSelectionRef.current = null;
    }
  }, [controlledInputDraft, hasControlledInputDraft]);

  const { contains } = useFilter({ sensitivity: 'base' });
  const effectiveFilterText = controlledSelectionChanged ? '' : filterText;
  const collectionItems = items;
  const collectionDecoratedItems = decoratedItems;
  let initialResetValue = initialDefaultValue;
  if (initiallyControlled) {
    initialResetValue = initialControlledValue;
    if (initialControlledItem) {
      const refreshedInitialControlledItem = collectionDecoratedItems.find(
        ({ descriptor }) =>
          descriptor.id === initialControlledItem.descriptor.id,
      );
      if (refreshedInitialControlledItem) {
        initialResetValue = refreshedInitialControlledItem.item;
      }
    }
  }
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

  const resetInputDraft = (preserveCustomValue = false) => {
    setFilterText('');
    setControlledInputDraft(undefined);
    controlledDraftSelectionRef.current = null;
    if (!preserveCustomValue) {
      pendingCustomValueRef.current = undefined;
    }
    autoClosedNoResultsRef.current = false;
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      autoClosedNoResultsRef.current = false;
      return;
    }

    if (!isOpen) {
      if (
        value !== undefined &&
        !allowsCustomValue &&
        autoClosedNoResultsRef.current &&
        controlledInputDraft !== undefined
      ) {
        autoClosedNoResultsRef.current = false;
        return;
      }

      resetInputDraft(true);
    }
  };

  const emitInputChange = (inputValue: string) => {
    if (props.allowsCustomValue !== true) {
      if (inputValue === '' && value !== undefined) {
        markFormResetChange();
        onChange?.(null);
      }

      return;
    }

    const nextValue = inputValue || null;
    if (value !== undefined) {
      pendingCustomValueRef.current = nextValue;
    }
    lastCustomChangeRef.current = nextValue;
    markFormResetChange();
    props.onChange?.(nextValue);
  };

  const handleNullValueChange = (shouldEmitChange: boolean) => {
    if (value === undefined) {
      uncontrolledSelectedKeyRef.current = null;
      uncontrolledSelectedItemRef.current = undefined;
    }

    if (allowsCustomValue && lastCustomChangeRef.current !== undefined) {
      return;
    }

    if (shouldEmitChange) {
      markFormResetChange();
      onChange?.(null);
    }
  };

  const handleInputChange = (inputValue: string) => {
    if (suppressFormResetRef.current) return;

    const pendingReset = formResetRef.current;
    const pendingResetInput = getPendingResetInputHandling(
      inputValue,
      pendingReset,
      formResetInputPendingRef.current,
    );
    if (pendingResetInput.clearPending) {
      formResetInputPendingRef.current = false;
    }
    if (pendingResetInput.ignore) return;
    supersedeFormReset();

    if (readOnly) {
      resetInputDraft();
      return;
    }

    if (
      isSelectionResetInput(
        inputValue,
        selectionResetLabelRef.current,
        value,
        selectedItem,
      )
    ) {
      selectionResetLabelRef.current = null;
      resetInputDraft();
      return;
    }

    selectionResetLabelRef.current = null;
    setFilterText(inputValue);

    if (canDraftControlledValue(value, selectedItem, allowsCustomValue)) {
      setControlledInputDraft(inputValue);
      controlledDraftSelectionRef.current = controlledSelection;
    }

    autoClosedNoResultsRef.current =
      value !== undefined &&
      !allowsCustomValue &&
      getVisibleItems(items, decoratedItems, inputValue, contains).length === 0;

    emitInputChange(inputValue);
  };

  const handleValueChange = (
    key: ComboBoxChangeKey,
    shouldEmitChange = true,
  ) => {
    if (suppressFormResetRef.current) return;
    const pendingReset = formResetRef.current;
    if (pendingReset && sameComboBoxKey(key, pendingReset.state.defaultValue)) {
      return;
    }
    supersedeFormReset();

    formResetInputPendingRef.current = false;

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
      handleNullValueChange(shouldEmitChange);
      return;
    }

    if (value === undefined) {
      uncontrolledSelectedKeyRef.current = String(key);
    }

    const nextItem = resolveComboBoxItem(
      key,
      collectionDecoratedItems,
      initialControlledItem,
      defaultSelectedItem,
    );
    if (value === undefined) {
      uncontrolledSelectedItemRef.current = nextItem;
    }
    const nextValue = getComboBoxValueForKey(
      key,
      value,
      selectedKey,
      collectionDecoratedItems,
      initialControlledItem,
      defaultSelectedItem,
      allowsCustomValue,
    );
    selectionResetLabelRef.current = nextItem?.descriptor.label ?? '';
    lastCustomChangeRef.current = undefined;
    resetInputDraft();
    if (shouldEmitChange) {
      markFormResetChange();
      onChange?.(nextValue);
    }
  };

  const setFormResetState = (
    resetState: ComboBoxResetState,
    markInputPending = true,
  ) => {
    const preservesOffListCustomDefault =
      allowsCustomValue &&
      resetState.defaultValue !== null &&
      defaultSelectedItem !== undefined &&
      !collectionDecoratedItems.some(
        ({ descriptor }) => descriptor.id === resetState.defaultValue,
      ) &&
      resetState.value === null;

    suppressFormResetRef.current = true;
    formResetInputPendingRef.current = markInputPending;
    try {
      if (!preservesOffListCustomDefault) {
        resetState.setValue(resetState.defaultValue);
      }
      resetState.setInputValue(resetState.defaultInputValue);
    } finally {
      suppressFormResetRef.current = false;
    }
  };

  useLayoutEffect(() => {
    applyFormResetRef.current = (resetState) => {
      const resetChanged =
        !sameComboBoxKey(resetState.value, resetState.defaultValue) ||
        (allowsCustomValue &&
          resetState.inputValue !== resetState.defaultInputValue);

      setFormResetState(resetState);

      lastCustomChangeRef.current = undefined;
      resetInputDraft();

      if (props.allowsCustomValue === true) {
        handleValueChange(resetState.defaultValue, false);
        if (resetChanged) {
          props.onChange?.(initialResetValue ?? null);
        }
      } else {
        handleValueChange(resetState.defaultValue, resetChanged);
      }
    };

    commitFormResetRef.current = (resetState, skipNotification) => {
      if (skipNotification) return;

      const resetChanged =
        !sameComboBoxKey(resetState.value, resetState.defaultValue) ||
        (allowsCustomValue &&
          resetState.inputValue !== resetState.defaultInputValue);
      if (!resetChanged) return;

      const nextValue =
        props.allowsCustomValue === true
          ? initialResetValue ?? null
          : getComboBoxValueForKey(
              resetState.defaultValue,
              undefined,
              selectedKey,
              collectionDecoratedItems,
              initialControlledItem,
              defaultSelectedItem,
              allowsCustomValue,
            );
      onChange?.(nextValue as T | null);
    };
  });

  const handleFormReset = (
    event: Event,
    state: ComboBoxResetState | null,
    phase: ComboBoxResetPhase,
  ) => {
    if (phase === 'capture') {
      if (!state) return;

      const resetFilterText = filterText;
      let captureResetApplied = false;
      const applyCaptureReset = () => {
        if (captureResetApplied) return;

        captureResetApplied = true;
        flushSync(() => {
          setFormResetState(state);
          state.setOpen(false);
        });
        queueMicrotask(() => {
          if (captureResetApplied && !event.defaultPrevented) {
            state.setOpen(false);
          }
        });
      };
      const restoreCaptureReset = () => {
        if (!captureResetApplied) return;

        captureResetApplied = false;
        restoreFormReset(state, true, resetFilterText);
      };
      const nativeStopPropagation = event.stopPropagation.bind(event);
      Object.defineProperty(event, 'stopPropagation', {
        configurable: true,
        value: () => {
          nativeStopPropagation();
          applyCaptureReset();
        },
      });
      const nativePreventDefault = event.preventDefault.bind(event);
      Object.defineProperty(event, 'preventDefault', {
        configurable: true,
        value: () => {
          nativePreventDefault();
          restoreCaptureReset();
        },
      });

      clearFormReset();
      formResetRef.current = {
        event,
        filterText: resetFilterText,
        state,
        userChangeEmitted: false,
        userInteracted: false,
      };
      const resetTransaction = formResetRef.current;
      formResetRef.current = null;
      if (resetTransaction.state.isActive()) {
        formResetRef.current = resetTransaction;
      }
      formResetInputPendingRef.current = true;

      queueMicrotask(() => {
        const pendingReset = formResetRef.current;

        if (pendingReset?.event !== event) return;

        formResetRef.current = null;
        if (!pendingReset.state.isActive()) return;

        if (event.defaultPrevented) {
          if (!pendingReset.userInteracted) {
            restoreFormReset(pendingReset.state, true, pendingReset.filterText);
          }
          return;
        }

        flushSync(() => {
          if (pendingReset.userInteracted) {
            commitFormResetRef.current(
              pendingReset.state,
              pendingReset.userChangeEmitted,
            );
          } else {
            applyFormResetRef.current(pendingReset.state);
          }
        });
        formResetInputPendingRef.current = false;
      });
      return;
    }

    const pendingReset = formResetRef.current;
    if (pendingReset?.event !== event) return;

    formResetRef.current = null;
    if (!pendingReset.state.isActive()) return;

    if (event.defaultPrevented) {
      if (!pendingReset.userInteracted) {
        restoreFormReset(pendingReset.state, true, pendingReset.filterText);
      }
      return;
    }

    if (pendingReset.userInteracted) {
      commitFormResetRef.current(
        pendingReset.state,
        pendingReset.userChangeEmitted,
      );
    } else {
      applyFormResetRef.current(pendingReset.state);
    }
    formResetInputPendingRef.current = false;
  };

  return {
    clearFormReset,
    collectionItems,
    controlledTextValue,
    currentTextValue,
    defaultSelectedKey,
    defaultTextValue,
    handleFormReset,
    handleInputChange,
    handleOpenChange,
    handleValueChange,
    matchesFilter: (textValue) =>
      contains(textValue, effectiveFilterText.trim()),
    selectedKey,
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
    items,
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
      defaultFilter={model.matchesFilter}
      defaultValue={model.defaultSelectedKey}
      form={form}
      id={id}
      inputValue={model.controlledTextValue}
      isDisabled={interactionDisabled}
      isInvalid={!loading && visibleError !== undefined}
      isReadOnly={readOnly}
      isRequired={required}
      defaultItems={model.collectionItems}
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
          readOnly && variants.state.readOnlyGroup,
        )}
        ref={groupRef}
      >
        <ComboBoxReadOnlyReset
          allowsCustomValue={allowsCustomValue}
          currentTextValue={model.currentTextValue}
          isControlled={value !== undefined}
          isReadOnly={readOnly}
          resetTextValue={model.defaultTextValue ?? ''}
        />
        <ComboBoxInput
          allowsCustomValue={allowsCustomValue}
          aria-describedby={supportingIds}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          className={joinClassNames(
            variants.base.input,
            loading && variants.state.loadingInput,
          )}
          disabled={interactionDisabled}
          form={form}
          getItem={getItem}
          clearFormReset={model.clearFormReset}
          handleFormReset={model.handleFormReset}
          isControlled={value !== undefined}
          items={items}
          loading={loading}
          placeholder={placeholder}
          readOnly={readOnly}
          resetName={submittedName}
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
        getItem={getItem}
        hasSuggestions={model.collectionItems.length > 0}
        isDisabled={interactionDisabled}
        isReadOnly={readOnly}
        items={model.collectionItems}
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
