import type { HTMLAttributes } from 'react';
import { useState } from 'react';
import type { ItemDescriptor } from '../../collections/item.types';
import { useBreezeContext } from '../../provider/BreezeContext';
import SelectionControl from '../../selection-controls/SelectionControl';
import { Badge } from '../Badge/Badge';
import type { ControlSize } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Skeleton } from '../Skeleton/Skeleton';

const variants = {
  base: {
    description:
      'breeze:text-breeze-2xs breeze:font-normal breeze:leading-breeze-snug breeze:text-breeze-ink-3',
    group:
      'breeze:m-0 breeze:inline-flex breeze:min-inline-0 breeze:gap-[2px] breeze:rounded-breeze-ctl breeze:border breeze:border-solid breeze:border-breeze-line breeze:bg-breeze-surface breeze:p-[2px] breeze:font-breeze-sans',
    item: 'breeze:inline-grid breeze:items-center breeze:justify-center breeze:rounded-breeze-sm breeze:py-breeze-1 breeze:font-medium breeze:text-breeze-ink-3 breeze:cursor-pointer breeze:select-none breeze:outline-offset-[-2px] breeze:data-[focus-visible]:outline-2 breeze:data-[focus-visible]:outline-solid breeze:data-[focus-visible]:outline-breeze-brand breeze:data-[disabled]:cursor-not-allowed breeze:data-[disabled]:opacity-60 breeze:any-pointer-coarse:min-inline-breeze-tap',
    optionContent: 'breeze:flex breeze:min-inline-0 breeze:flex-col',
    optionDetails: 'breeze:inline-flex breeze:items-center breeze:gap-[6px]',
  },
  compound: {},
  size: {
    // Options carry the height because flex items inside a fieldset do not stretch to its min-block size.
    lg: 'breeze:min-block-[46px] breeze:ps-breeze-4 breeze:pe-breeze-4 breeze:text-breeze-sm',
    md: 'breeze:min-block-breeze-8 breeze:ps-breeze-3 breeze:pe-breeze-3 breeze:text-breeze-xs breeze:any-pointer-coarse:min-block-[42px]',
    sm: 'breeze:min-block-breeze-7 breeze:ps-breeze-3 breeze:pe-breeze-3 breeze:text-breeze-xs breeze:any-pointer-coarse:min-block-[42px]',
  },
  state: {
    fullWidth: {
      group: 'breeze:inline-full',
      item: 'breeze:flex-1',
    },
    selected:
      'breeze:data-[selected]:bg-breeze-sunken breeze:data-[selected]:font-semibold breeze:data-[selected]:text-breeze-ink breeze:forced-colors:data-[selected]:outline-2 breeze:forced-colors:data-[selected]:outline-offset-2',
  },
  variant: {},
} as const;

interface ToggleGroupCommonProps<T> {
  /** Names the group when it has no visible heading. */
  'aria-label': HTMLAttributes<HTMLFieldSetElement>['aria-label'];
  /** Identifies elements that provide additional information about the group. */
  'aria-describedby'?: HTMLAttributes<HTMLFieldSetElement>['aria-describedby'];
  /** Prevents every option in the group from being activated. */
  disabled?: boolean;
  /** Stretches the group to its container and shares the width between options. Defaults to `false`. */
  fullWidth?: boolean;
  /** Supplies the display details for an option. */
  getItem: (item: T) => ItemDescriptor;
  /** Sets the rendered group's HTML `id`. */
  id?: HTMLAttributes<HTMLFieldSetElement>['id'];
  /** The available options. */
  items: T[];
  /** Shows placeholders while a selection change is being saved. */
  loading?: boolean;
  /** Selects the group's height. Defaults to `sm`. */
  size?: ControlSize;
}

interface ControlledToggleGroupProps<T> {
  /** Current selected option, or `null` when none is pressed. */
  selected: T | null;
  /** Reports the selected option or `null` when cleared. */
  onChange: (selected: T | null) => void;
  /** Controlled and uncontrolled state props are mutually exclusive. */
  defaultSelected?: never;
}

interface UncontrolledToggleGroupProps<T> {
  /** Initial selected option. Defaults to no selection. */
  defaultSelected?: T | null;
  /** Reports the selected option or `null` when cleared. */
  onChange?: (selected: T | null) => void;
  /** Controlled and uncontrolled state props are mutually exclusive. */
  selected?: never;
}

/** Props for controlled or uncontrolled single-choice segmented selection. */
export type ToggleGroupProps<T> = ToggleGroupCommonProps<T> &
  (ControlledToggleGroupProps<T> | UncontrolledToggleGroupProps<T>);

interface DecoratedItem<T> {
  descriptor: ItemDescriptor;
  item: T;
}

/**
 * Renders a set of connected options with a single selection.
 *
 * @summary A single selection from connected options.
 */
export function ToggleGroup<T>({
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  defaultSelected,
  disabled = false,
  fullWidth = false,
  getItem,
  id,
  items,
  loading = false,
  onChange,
  selected,
  size = 'sm',
}: Readonly<ToggleGroupProps<T>>) {
  const { getMessageLocale, messages } = useBreezeContext();

  const [uncontrolledSelectedKey, setUncontrolledSelectedKey] = useState<
    string | null
  >(() =>
    defaultSelected === undefined || defaultSelected === null
      ? null
      : getItem(defaultSelected).id,
  );
  const decoratedItems: DecoratedItem<T>[] = items.map((item) => ({
    descriptor: getItem(item),
    item,
  }));
  let selectedKey = uncontrolledSelectedKey;
  if (selected !== undefined) {
    selectedKey = selected === null ? null : getItem(selected).id;
  }

  return (
    <>
      <fieldset
        aria-describedby={ariaDescribedBy}
        aria-busy={loading || undefined}
        className={[
          variants.base.group,
          fullWidth && variants.state.fullWidth.group,
        ]
          .filter(Boolean)
          .join(' ')}
        disabled={disabled}
        id={id}
      >
        <legend className="breeze:sr-only">{ariaLabel}</legend>
        {decoratedItems.map(({ descriptor, item }) => (
          <SelectionControl
            key={descriptor.id}
            announceLoading={false}
            className={[
              variants.base.item,
              variants.size[size],
              variants.state.selected,
              fullWidth && variants.state.fullWidth.item,
            ]
              .filter(Boolean)
              .join(' ')}
            disabled={disabled || descriptor.disabled === true}
            loading={loading}
            onChange={(pressed) => {
              if (selected === undefined) {
                setUncontrolledSelectedKey(pressed ? descriptor.id : null);
              }

              onChange?.(pressed ? item : null);
            }}
            pressed={selectedKey === descriptor.id}
          >
            <span className={variants.base.optionDetails}>
              {descriptor.icon && <Icon name={descriptor.icon} size="sm" />}
              <span className={variants.base.optionContent}>
                <span>{descriptor.label}</span>
                {descriptor.description && (
                  <span className={variants.base.description}>
                    {descriptor.description}
                  </span>
                )}
              </span>
              {descriptor.badge && (
                <Badge
                  aria-label={descriptor.badge['aria-label']}
                  variant={descriptor.badge.variant}
                >
                  {descriptor.badge.children}
                </Badge>
              )}
            </span>
          </SelectionControl>
        ))}
      </fieldset>
      {loading && (
        <span className="breeze:sr-only">
          <Skeleton label={messages.loading} />
        </span>
      )}
      <output
        aria-live="polite"
        className="breeze:sr-only"
        lang={getMessageLocale('loading')}
      >
        {loading ? messages.loading : ''}
      </output>
    </>
  );
}
