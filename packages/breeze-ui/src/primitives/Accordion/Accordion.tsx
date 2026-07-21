import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import { createElement } from 'react';
import {
  Disclosure as AriaDisclosure,
  DisclosureGroup as AriaDisclosureGroup,
} from 'react-aria-components/DisclosureGroup';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import {
  SharedDisclosurePanel,
  type SharedDisclosurePanelProps,
  SharedDisclosureTrigger,
  type SharedDisclosureTriggerProps,
} from '../../internal/react-aria/DisclosureParts';
import type { CollectionKey } from '../../internal/types/collection';
import { useBreezeContext } from '../../provider/BreezeContext';

const accordionRoot = tv({
  base: 'divide-y divide-[var(--breeze-border)] border border-[var(--breeze-border)] bg-[var(--breeze-surface)]',
});
const accordionItem = tv({
  base: 'group',
});

type AccordionRootNativeProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'defaultValue' | 'onChange' | 'style'
>;

interface AccordionRootSharedProps extends AccordionRootNativeProps {
  /** Accordion items. */
  children: ReactNode;
  /** Disables every item. Defaults to `false`. */
  disabled?: boolean;
  /** Allows more than one expanded item. Defaults to `false`. */
  multiple?: boolean;
  /** Ref to the rendered accordion root. */
  ref?: Ref<HTMLDivElement>;
}

interface ControlledAccordionRootProps {
  /** Current expanded item keys. */
  value: CollectionKey[];
  /** Called with the next expanded item keys. */
  onChange: (value: CollectionKey[]) => void;
  defaultValue?: never;
  readOnly?: false;
}

interface ReadOnlyAccordionRootProps {
  /** Current immutable expanded item keys. */
  value: CollectionKey[];
  /** Marks controlled state as intentionally immutable. */
  readOnly: true;
  defaultValue?: never;
  onChange?: never;
}

interface UncontrolledAccordionRootProps {
  /** Initially expanded item keys. */
  defaultValue?: CollectionKey[];
  /** Called with the next expanded item keys. */
  onChange?: (value: CollectionKey[]) => void;
  readOnly?: false;
  value?: never;
}

/** Props for controlled, read-only, or uncontrolled accordion expansion. */
export type AccordionRootProps = AccordionRootSharedProps &
  (
    | ControlledAccordionRootProps
    | ReadOnlyAccordionRootProps
    | UncontrolledAccordionRootProps
  );

/** Props for one keyed accordion item. */
export interface AccordionItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'id' | 'style'> {
  /** Item trigger and panel parts. */
  children: ReactNode;
  /** Prevents this item from changing state. Defaults to `false`. */
  disabled?: boolean;
  /** Stable string or number item key. */
  id: CollectionKey;
  /** Ref to the rendered item root. */
  ref?: Ref<HTMLDivElement>;
}

/** Props for an accordion item heading button. */
export type AccordionTriggerProps = SharedDisclosureTriggerProps;

/** Props for collapsible accordion item content. */
export type AccordionPanelProps = SharedDisclosurePanelProps;

/** Coordinates single or multiple item expansion. */
export function Root({
  className,
  defaultValue,
  disabled = false,
  multiple = false,
  onChange,
  readOnly: _readOnly,
  ref,
  value,
  ...props
}: Readonly<AccordionRootProps>): ReactElement {
  useBreezeContext();

  return createElement(AriaDisclosureGroup, {
    ...props,
    allowsMultipleExpanded: multiple,
    className: accordionRoot({ class: className }),
    defaultExpandedKeys: defaultValue,
    expandedKeys: value,
    isDisabled: disabled,
    onExpandedChange: (keys: Set<CollectionKey>) => onChange?.([...keys]),
    ref: useForwardedRef(ref),
  });
}

/** Renders one keyed disclosure inside the accordion group. */
export function Item({
  className,
  disabled = false,
  id,
  ref,
  ...props
}: Readonly<AccordionItemProps>): ReactElement {
  return createElement(AriaDisclosure, {
    ...props,
    className: accordionItem({ class: className }),
    id,
    isDisabled: disabled,
    ref: useForwardedRef(ref),
  });
}

/**
 * Groups coordinated disclosures with single or multiple expansion state.
 *
 * @summary coordinated expandable disclosure group
 */
export const Accordion = {
  /** One keyed expandable item. */
  Item,
  /** Collapsible item content. */
  Panel: SharedDisclosurePanel,
  /** Expansion policy and state root. */
  Root,
  /** Item heading button. */
  Trigger: SharedDisclosureTrigger,
};
