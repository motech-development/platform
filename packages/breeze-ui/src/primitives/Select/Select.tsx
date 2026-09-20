import type { ReactNode } from 'react';
import { useId, useMemo, useRef } from 'react';
import { useButton } from 'react-aria/useButton';
import { useListBox, useOption } from 'react-aria/useListBox';
import { useSelect } from 'react-aria/useSelect';
// The low-level Select state is required to avoid RAC's native HiddenSelect.
import { useSelectState } from 'react-stately/useSelectState';
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

function SelectOption<T>({
  node,
  state,
}: Readonly<{
  node: SelectCollectionNode<T>;
  state: Parameters<typeof useListBox>[1];
}>) {
  const optionRef = useRef<HTMLDivElement>(null);
  const { value } = node;
  const { optionProps, isSelected } = useOption(
    {
      isDisabled: value?.descriptor.disabled,
      key: node.key,
    },
    state,
    optionRef,
  );

  if (!value) return null;

  return (
    <div
      // React Aria supplies the complete keyboard and accessibility contract.
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...optionProps}
      className={collectionVariants.base.item}
      ref={optionRef}
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
  const decoratedItems = useMemo<SelectItem<T>[]>(
    () =>
      items.map((item) => ({
        descriptor: getItem(item),
        item,
      })),
    [getItem, items],
  );
  const isControlled = value !== undefined;
  const selectedItem = findItem(decoratedItems, value ?? null, getItem);
  const defaultSelectedItem = findItem(
    decoratedItems,
    defaultValue ?? null,
    getItem,
  );
  const selectedKey = isControlled
    ? selectedItem?.descriptor.id ?? null
    : undefined;
  const defaultSelectedKey = defaultSelectedItem?.descriptor.id;
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
    allowsEmptyCollection: true,
    children: collectionChildren,
    defaultSelectedKey,
    isDisabled: stateDisabled,
    isInvalid: !loading && visibleError !== undefined,
    isRequired: required,
    items: decoratedItems,
    onSelectionChange: (key) => {
      if (typeof key !== 'string') return;

      const nextItem = decoratedItems.find(
        (item) => item.descriptor.id === key,
      );
      onChange?.(nextItem?.item ?? null);
    },
    selectedKey,
    shouldCloseOnSelect: true,
    validationBehavior: 'aria',
  });
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
      selectedKey,
      validationBehavior: 'aria',
    },
    state,
    triggerRef,
  );
  const { buttonProps } = useButton(triggerProps, triggerRef);

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
        {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props */}
        <button
          type="button"
          // React Aria supplies the complete keyboard and accessibility contract.
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...buttonProps}
          aria-label={loading ? label : undefined}
          aria-labelledby={loading ? undefined : labelId}
          aria-required={required || undefined}
          aria-readonly={readOnly || undefined}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
          className={joinClassNames(
            fieldVariants.base.input,
            loading && 'breeze:!opacity-0',
          )}
          disabled={interactionDisabled}
          id={controlId}
          ref={triggerRef}
        >
          <span
            // React Aria supplies the selected-value semantics.
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...valueProps}
            className={collectionVariants.base.content}
          >
            {state.selectedItem?.textValue ?? placeholder}
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
      {name && (
        <input
          autoComplete={autoComplete}
          form={form}
          name={name}
          type="hidden"
          value={state.selectedKey ?? ''}
        />
      )}
      <CollectionPopover
        className={collectionVariants.base.popover}
        isOpen={state.isOpen}
        onOpenChange={(isOpen) => state.setOpen(isOpen)}
        triggerRef={triggerRef}
      >
        <SelectListBox menuProps={menuProps} state={state} />
      </CollectionPopover>
      <FieldSupportingContent
        description={visibleDescription}
        descriptionId={descriptionId}
        error={visibleError}
        errorId={errorId}
        loading={loading}
      />
    </div>
  );
}
