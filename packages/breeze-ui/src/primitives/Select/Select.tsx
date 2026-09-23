import type { ReactNode, RefObject } from 'react';
import { useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { mergeProps } from 'react-aria/mergeProps';
import { useButton } from 'react-aria/useButton';
import { useFocusRing } from 'react-aria/useFocusRing';
import { useHover } from 'react-aria/useHover';
import { useListBox, useOption } from 'react-aria/useListBox';
import { useSelect } from 'react-aria/useSelect';
import { useVisuallyHidden } from 'react-aria/VisuallyHidden';
import { flushSync } from 'react-dom';
// The low-level Select state is required to avoid RAC's native HiddenSelect.
import { type SelectState, useSelectState } from 'react-stately/useSelectState';
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

interface SelectCollectionNode<T> {
  key: string | number;
  value: SelectItem<T> | null;
}

interface SelectCollectionElementProps {
  children: ReactNode;
  id: string;
  item: unknown;
  isDisabled?: boolean;
  textValue: string;
}

interface SelectCollectionElementType {
  (props: SelectCollectionElementProps): null;
  getCollectionNode: (props: SelectCollectionElementProps) => Generator<{
    key: string;
    props: SelectCollectionElementProps;
    rendered: ReactNode;
    textValue: string;
    type: 'item';
    value: unknown;
  }>;
}

const SelectCollectionElement = (() =>
  null) as unknown as SelectCollectionElementType;

SelectCollectionElement.getCollectionNode = function* getCollectionNode({
  id,
  item,
  ...props
}) {
  yield {
    key: id,
    props: { ...props, id, item },
    rendered: props.children,
    textValue: props.textValue,
    type: 'item',
    value: item,
  };
};

function findItem<T>(
  items: SelectItem<T>[],
  value: T | null,
  getItem: (item: T) => ItemDescriptor,
) {
  if (value === null) return undefined;

  const valueId = getItem(value).id;

  return items.find(
    ({ descriptor, item }) => item === value || descriptor.id === valueId,
  );
}

function findUniqueAutofillItem<T>(items: SelectItem<T>[], value: string) {
  const matches = items.filter(
    ({ descriptor }) =>
      !descriptor.disabled &&
      (descriptor.id === value || descriptor.label === value),
  );

  return matches.length === 1 ? matches[0] : undefined;
}

function resolveControlledResetItem<T>(
  initialControlledItem: SelectItem<T> | null | undefined,
  items: SelectItem<T>[],
  loading: boolean,
) {
  if (initialControlledItem === undefined || initialControlledItem === null) {
    return initialControlledItem;
  }

  return (
    items.find(
      ({ descriptor }) => descriptor.id === initialControlledItem.descriptor.id,
    ) ?? (loading ? initialControlledItem : null)
  );
}

function getInitialControlledItem<T>(
  value: T | null | undefined,
  getItem: (item: T) => ItemDescriptor,
) {
  if (value === undefined) return undefined;
  if (value === null) return null;

  return {
    descriptor: getItem(value),
    item: value,
  };
}

function getControlledResetValueKey<T>(
  value: T | null | undefined,
  getItem: (item: T) => ItemDescriptor,
) {
  if (value === undefined) return undefined;
  if (value === null) return null;

  return getItem(value).id;
}

function getTriggerLabelledBy(
  loading: boolean,
  buttonLabelledBy: string | undefined,
  valueId: string | undefined,
) {
  if (loading) return undefined;

  const labelledBy = Array.from(
    new Set(
      [buttonLabelledBy, valueId]
        .filter((value): value is string => Boolean(value))
        .flatMap((value) => value.split(' ')),
    ),
  ).join(' ');

  return labelledBy || undefined;
}

function handleSelectAutofill<T>(
  nextValue: string,
  readOnly: boolean,
  items: SelectItem<T>[],
  currentValue: string | number | null,
  setValue: (value: string) => void,
  autofillRef: RefObject<HTMLInputElement | null>,
) {
  const inputRef = autofillRef;

  if (readOnly) {
    if (inputRef.current) {
      inputRef.current.value = String(currentValue ?? '');
    }

    return;
  }

  const nextItem = findUniqueAutofillItem(items, nextValue);

  if (!nextItem) {
    if (inputRef.current) {
      inputRef.current.value = String(currentValue ?? '');
    }

    return;
  }

  const nextKey = nextItem.descriptor.id;

  if (currentValue !== nextKey) {
    setValue(nextKey);
  }
}

interface SelectCollectionEffectsOptions<T> {
  decoratedItems: SelectItem<T>[];
  initialDefaultValueRef: RefObject<string | null>;
  isControlled: boolean;
  loading: boolean;
  pendingDefaultValueRef: RefObject<string | null>;
  state: SelectState<SelectItem<T>>;
  suppressOnChangeRef: RefObject<boolean>;
}

function useSelectCollectionEffects<T>({
  decoratedItems,
  initialDefaultValueRef,
  isControlled,
  loading,
  pendingDefaultValueRef,
  state,
  suppressOnChangeRef,
}: Readonly<SelectCollectionEffectsOptions<T>>) {
  const pendingDefaultRef = pendingDefaultValueRef;
  const initialDefaultRef = initialDefaultValueRef;
  const suppressRef = suppressOnChangeRef;

  useLayoutEffect(() => {
    const pendingDefaultValue = pendingDefaultRef.current;
    const hasPendingDefault = decoratedItems.some(
      ({ descriptor }) => descriptor.id === pendingDefaultValue,
    );

    if (!loading && pendingDefaultValue !== null && !hasPendingDefault) {
      pendingDefaultRef.current = null;
      if (initialDefaultRef.current === pendingDefaultValue) {
        initialDefaultRef.current = null;
      }
      return;
    }

    if (
      isControlled ||
      state.value !== null ||
      pendingDefaultValue === null ||
      !hasPendingDefault
    ) {
      return;
    }

    pendingDefaultRef.current = null;
    suppressRef.current = true;
    try {
      state.setValue(pendingDefaultValue);
    } finally {
      suppressRef.current = false;
    }
  }, [
    decoratedItems,
    initialDefaultRef,
    isControlled,
    loading,
    pendingDefaultRef,
    state,
    suppressRef,
  ]);

  useLayoutEffect(() => {
    if (
      !isControlled &&
      !loading &&
      state.value !== null &&
      !decoratedItems.some(({ descriptor }) => descriptor.id === state.value)
    ) {
      state.setValue(null);
    }
  }, [decoratedItems, isControlled, loading, state]);
}

interface SelectFormResetOptions<T> {
  controlledResetItemRef: RefObject<SelectItem<T> | null | undefined>;
  controlledResetValueKeyRef: RefObject<string | null | undefined>;
  form: string | undefined;
  initialControlledItem: SelectItem<T> | null | undefined;
  isControlled: boolean;
  onChangeRef: RefObject<((value: T | null) => void) | undefined>;
  resetValueRef: RefObject<string | null>;
  setStateValueRef: RefObject<(nextValue: string | null) => void>;
  suppressOnChangeRef: RefObject<boolean>;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

function useSelectFormReset<T>({
  controlledResetItemRef,
  controlledResetValueKeyRef,
  form,
  initialControlledItem,
  isControlled,
  onChangeRef,
  resetValueRef,
  setStateValueRef,
  suppressOnChangeRef,
  triggerRef,
}: Readonly<SelectFormResetOptions<T>>) {
  const suppressRef = suppressOnChangeRef;

  useLayoutEffect(() => {
    let active = true;
    let pendingResetEvent: Event | null = null;

    const applyReset = () => {
      if (isControlled) {
        const resetItem = controlledResetItemRef.current;
        if (
          resetItem !== undefined &&
          controlledResetValueKeyRef.current !==
            (resetItem === null ? null : resetItem.descriptor.id)
        ) {
          onChangeRef.current?.(resetItem?.item ?? null);
        }

        return;
      }

      suppressRef.current = true;
      try {
        setStateValueRef.current(resetValueRef.current);
      } finally {
        suppressRef.current = false;
      }
    };

    const captureReset = (event: Event) => {
      const associatedForm = form
        ? document.getElementById(form)
        : triggerRef.current?.form;

      if (
        !(associatedForm instanceof HTMLFormElement) ||
        event.target !== associatedForm
      ) {
        return;
      }

      pendingResetEvent = event;
      setTimeout(() => {
        if (!active || pendingResetEvent !== event || event.defaultPrevented) {
          return;
        }

        pendingResetEvent = null;
        flushSync(applyReset);
      });
    };

    const finalizeReset = (event: Event) => {
      if (pendingResetEvent !== event) return;

      flushSync(() => undefined);
      pendingResetEvent = null;
      if (!active || event.defaultPrevented) return;

      flushSync(applyReset);
    };

    document.addEventListener('reset', captureReset, true);
    document.addEventListener('reset', finalizeReset);

    return () => {
      active = false;
      pendingResetEvent = null;
      document.removeEventListener('reset', captureReset, true);
      document.removeEventListener('reset', finalizeReset);
    };
  }, [
    controlledResetItemRef,
    controlledResetValueKeyRef,
    form,
    initialControlledItem,
    isControlled,
    onChangeRef,
    resetValueRef,
    setStateValueRef,
    suppressRef,
    triggerRef,
  ]);
}

function SelectOption<T>({
  node,
  state,
}: Readonly<{
  node: SelectCollectionNode<T>;
  state: Parameters<typeof useListBox>[1];
}>) {
  const optionRef = useRef<HTMLDivElement>(null);
  const { value } = node;
  const { optionProps, isDisabled, isFocused, isFocusVisible, isSelected } =
    useOption(
      {
        isDisabled: value?.descriptor.disabled,
        key: node.key,
      },
      state,
      optionRef,
    );
  const { hoverProps, isHovered } = useHover({ isDisabled });

  if (!value) return null;

  return (
    <div
      // React Aria supplies the complete keyboard and accessibility contract.
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...mergeProps(optionProps, hoverProps)}
      ref={optionRef}
      className={collectionVariants.base.item}
      data-disabled={isDisabled || undefined}
      data-focused={isFocused || undefined}
      data-focus-visible={isFocusVisible || undefined}
      data-hovered={isHovered || undefined}
      data-selected={isSelected || undefined}
    >
      <DescriptorContent
        descriptor={value.descriptor}
        isSelected={isSelected}
      />
    </div>
  );
}

function SelectListBox<T>({
  menuProps,
  state,
}: Readonly<{
  menuProps: Parameters<typeof useListBox>[0];
  state: Parameters<typeof useListBox>[1];
}>) {
  const listBoxRef = useRef<HTMLDivElement>(null);
  const { listBoxProps } = useListBox(menuProps, state, listBoxRef);
  const keys = Array.from(state.collection.getKeys());

  return (
    <div
      // React Aria supplies the complete keyboard and accessibility contract.
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...listBoxProps}
      className={collectionVariants.base.listBox}
      ref={listBoxRef}
    >
      {keys.map((key) => {
        const node = state.collection.getItem(
          key,
        ) as SelectCollectionNode<T> | null;

        return node ? (
          <SelectOption key={String(key)} node={node} state={state} />
        ) : null;
      })}
    </div>
  );
}

/**
 * Renders a fixed-choice popover listbox without a native select element.
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
  const { visuallyHiddenProps } = useVisuallyHidden({
    style: {
      left: 0,
      position: 'fixed',
      top: 0,
    },
  });
  const visibleDescription = description?.trim() || undefined;
  const visibleError = error?.trim() || undefined;
  const interactionDisabled = disabled || loading;
  const stateDisabled = interactionDisabled || readOnly;
  const fieldId = useId();
  const controlId = id ?? `${fieldId}-control`;
  const labelId = `${fieldId}-label`;
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;
  const supportingIds =
    [visibleDescription && descriptionId, visibleError && errorId]
      .filter(Boolean)
      .join(' ') || undefined;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const autofillRef = useRef<HTMLInputElement>(null);
  const decoratedItems = useMemo<SelectItem<T>[]>(
    () =>
      items.map((item) => ({
        descriptor: getItem(item),
        item,
      })),
    [getItem, items],
  );
  const isControlled = value !== undefined;
  const [initialControlledItem] = useState<SelectItem<T> | null | undefined>(
    () => getInitialControlledItem(value, getItem),
  );
  const selectedValueItem = findItem(decoratedItems, value ?? null, getItem);
  const defaultSelectedItem = findItem(
    decoratedItems,
    defaultValue ?? null,
    getItem,
  );
  const pendingDefaultValueRef = useRef(
    loading &&
      defaultValue !== undefined &&
      defaultValue !== null &&
      defaultSelectedItem === undefined
      ? getItem(defaultValue).id
      : null,
  );
  const controlledValueKey = isControlled
    ? selectedValueItem?.descriptor.id ?? null
    : undefined;
  const defaultValueKey = defaultSelectedItem?.descriptor.id ?? null;
  const initialDefaultValueRef = useRef(
    defaultValueKey ?? pendingDefaultValueRef.current,
  );
  const hasInitialDefault = decoratedItems.some(
    ({ descriptor }) => descriptor.id === initialDefaultValueRef.current,
  );
  const resetValue =
    loading || hasInitialDefault ? initialDefaultValueRef.current : null;
  const resetValueRef = useRef(resetValue);
  const controlledResetValueKey = getControlledResetValueKey(value, getItem);
  const controlledResetItem = resolveControlledResetItem(
    initialControlledItem,
    decoratedItems,
    loading,
  );
  const controlledResetValueKeyRef = useRef(controlledResetValueKey);
  const controlledResetItemRef = useRef(controlledResetItem);
  const onChangeRef = useRef(onChange);
  const suppressOnChangeRef = useRef(false);
  const collectionChildren = useMemo(
    () =>
      decoratedItems.map(({ descriptor, item }) => (
        <SelectCollectionElement
          id={descriptor.id}
          item={{ descriptor, item }}
          isDisabled={descriptor.disabled}
          key={descriptor.id}
          textValue={descriptor.label}
        >
          {descriptor.label}
        </SelectCollectionElement>
      )),
    [decoratedItems],
  );
  const state = useSelectState<SelectItem<T>>({
    children: collectionChildren,
    defaultValue: defaultValueKey,
    isDisabled: stateDisabled,
    isInvalid: !loading && visibleError !== undefined,
    isRequired: required,
    items: decoratedItems,
    onChange: (key) => {
      if (suppressOnChangeRef.current) return;

      // A real user selection supersedes a default that was waiting for a
      // loading collection to arrive.
      pendingDefaultValueRef.current = null;

      if (key === null) {
        onChange?.(null);
        return;
      }

      const nextItem = decoratedItems.find(
        (item) => item.descriptor.id === key,
      );
      onChange?.(nextItem?.item ?? null);
    },
    shouldCloseOnSelect: true,
    validationBehavior: 'aria',
    value: controlledValueKey,
  });
  const setStateValueRef = useRef((nextValue: string | null) =>
    state.setValue(nextValue),
  );
  const { menuProps, triggerProps, valueProps } = useSelect(
    {
      'aria-describedby': supportingIds,
      'aria-label': loading ? label : undefined,
      'aria-labelledby': labelId,
      autoComplete,
      form,
      isDisabled: stateDisabled,
      isInvalid: !loading && visibleError !== undefined,
      isRequired: required,
      name,
      validationBehavior: 'aria',
      value: state.value,
    },
    state,
    triggerRef,
  );
  const { buttonProps } = useButton(triggerProps, triggerRef);
  const { focusProps, isFocusVisible } = useFocusRing();
  const { hoverProps, isHovered } = useHover({
    isDisabled: interactionDisabled,
  });
  const isInvalid = !loading && visibleError !== undefined;
  const handleAutofill = (nextValue: string) =>
    handleSelectAutofill(
      nextValue,
      readOnly,
      decoratedItems,
      state.value,
      (nextKey) => state.setValue(nextKey),
      autofillRef,
    );
  const triggerLabelledBy = getTriggerLabelledBy(
    loading,
    buttonProps['aria-labelledby'],
    valueProps.id,
  );

  useLayoutEffect(() => {
    resetValueRef.current = resetValue;
    setStateValueRef.current = (nextValue) => state.setValue(nextValue);
    controlledResetValueKeyRef.current = controlledResetValueKey;
    controlledResetItemRef.current = controlledResetItem;
    onChangeRef.current = onChange;
  }, [
    controlledResetItem,
    controlledResetValueKey,
    onChange,
    resetValue,
    state,
  ]);

  useLayoutEffect(() => {
    if ((decoratedItems.length === 0 || stateDisabled) && state.isOpen) {
      state.setOpen(false);
    }
  }, [decoratedItems.length, state, stateDisabled]);

  useSelectCollectionEffects({
    decoratedItems,
    initialDefaultValueRef,
    isControlled,
    loading,
    pendingDefaultValueRef,
    state,
    suppressOnChangeRef,
  });

  useSelectFormReset({
    controlledResetItemRef,
    controlledResetValueKeyRef,
    form,
    initialControlledItem,
    isControlled,
    onChangeRef,
    resetValueRef,
    setStateValueRef,
    suppressOnChangeRef,
    triggerRef,
  });

  return (
    <div className={fieldVariants.base.root}>
      <FieldLabel
        htmlFor={controlId}
        id={labelId}
        label={label}
        loading={loading}
      />
      <div className={fieldVariants.base.control}>
        {/* React Aria supplies the complete keyboard and accessibility contract. */}
        <button
          type="button"
          // React Aria supplies the complete keyboard and accessibility contract.
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...mergeProps(buttonProps, focusProps, hoverProps)}
          aria-controls={buttonProps['aria-controls']}
          aria-busy={loading || undefined}
          aria-expanded={buttonProps['aria-expanded']}
          aria-labelledby={triggerLabelledBy}
          aria-readonly={readOnly || undefined}
          aria-required={required || undefined}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
          className={joinClassNames(
            selectVariants.base.trigger,
            readOnly && selectVariants.state.readOnlyTrigger,
            loading && 'breeze:!opacity-0',
          )}
          data-focus-visible={isFocusVisible || undefined}
          data-hovered={isHovered || undefined}
          data-invalid={isInvalid || undefined}
          disabled={interactionDisabled}
          form={form}
          id={controlId}
          role="combobox"
          ref={triggerRef}
        >
          <span
            // React Aria supplies the selected-value semantics.
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...valueProps}
            className={joinClassNames(
              collectionVariants.base.content,
              'breeze:text-start',
            )}
          >
            {state.selectedItems[0]?.textValue ?? placeholder}
          </span>
          <Icon name="expand" size="sm" />
        </button>
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
      {(name !== undefined || autoComplete !== undefined) &&
        !interactionDisabled && (
          <div
            // React Aria's hidden-control pattern keeps autofill and form
            // submission while preventing an aria-hidden control from focus.
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...visuallyHiddenProps}
            aria-hidden="true"
            data-a11y-ignore="aria-hidden-focus"
            data-react-aria-prevent-focus
          >
            <label htmlFor={`${controlId}-autofill`}>
              {label}
              <input
                autoComplete={autoComplete}
                form={form}
                id={`${controlId}-autofill`}
                name={name}
                onChange={(event) => handleAutofill(event.currentTarget.value)}
                onInput={(event) => handleAutofill(event.currentTarget.value)}
                readOnly={readOnly || undefined}
                ref={autofillRef}
                tabIndex={-1}
                type="text"
                value={state.value ?? ''}
              />
            </label>
          </div>
        )}
      <CollectionPopover
        className={collectionVariants.base.popover}
        isOpen={state.isOpen && !stateDisabled}
        onOpenChange={(isOpen) => state.setOpen(isOpen)}
        triggerRef={triggerRef}
      >
        <SelectListBox menuProps={menuProps} state={state} />
      </CollectionPopover>
      <FieldSupportingContent
        description={visibleDescription}
        descriptionId={descriptionId}
        error={loading ? visibleError : undefined}
        errorId={errorId}
        loading={loading}
      />
      {visibleError && !loading && (
        <span className={fieldVariants.base.error} id={errorId}>
          {visibleError}
        </span>
      )}
    </div>
  );
}
