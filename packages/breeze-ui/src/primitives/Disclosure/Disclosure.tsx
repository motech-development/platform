import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import { createElement } from 'react';
import { Disclosure as AriaDisclosure } from 'react-aria-components/Disclosure';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import {
  SharedDisclosurePanel,
  type SharedDisclosurePanelProps,
  SharedDisclosureTrigger,
  type SharedDisclosureTriggerProps,
} from '../../internal/react-aria/DisclosureParts';
import { useBreezeContext } from '../../provider/BreezeContext';

const disclosureRoot = tv({
  base: 'border border-[var(--breeze-border)] bg-[var(--breeze-surface)]',
});

type DisclosureRootNativeProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'onChange' | 'style'
>;

interface DisclosureRootSharedProps extends DisclosureRootNativeProps {
  /** Trigger and panel parts. */
  children: ReactNode;
  /** Prevents the trigger from changing state. Defaults to `false`. */
  disabled?: boolean;
  /** Ref to the rendered disclosure root. */
  ref?: Ref<HTMLDivElement>;
}

interface ControlledDisclosureRootProps {
  /** Current expanded state. */
  open: boolean;
  /** Called with the next expanded state. */
  onOpenChange: (open: boolean) => void;
  defaultOpen?: never;
  readOnly?: false;
}

interface ReadOnlyDisclosureRootProps {
  /** Current immutable expanded state. */
  open: boolean;
  /** Marks controlled state as intentionally immutable. */
  readOnly: true;
  defaultOpen?: never;
  onOpenChange?: never;
}

interface UncontrolledDisclosureRootProps {
  /** Initial expanded state. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called with the next expanded state. */
  onOpenChange?: (open: boolean) => void;
  open?: never;
  readOnly?: false;
}

/** Props for controlled, read-only, or uncontrolled disclosure state. */
export type DisclosureRootProps = DisclosureRootSharedProps &
  (
    | ControlledDisclosureRootProps
    | ReadOnlyDisclosureRootProps
    | UncontrolledDisclosureRootProps
  );

/** Props for the disclosure heading button. */
export type DisclosureTriggerProps = SharedDisclosureTriggerProps;

/** Props for the collapsible disclosure content. */
export type DisclosurePanelProps = SharedDisclosurePanelProps;

/** Coordinates the trigger and collapsible panel state. */
export function Root({
  className,
  defaultOpen,
  disabled = false,
  onOpenChange,
  open,
  readOnly: _readOnly,
  ref,
  ...props
}: Readonly<DisclosureRootProps>): ReactElement {
  useBreezeContext();

  return createElement(AriaDisclosure, {
    ...props,
    className: disclosureRoot({ class: className }),
    defaultExpanded: defaultOpen,
    isDisabled: disabled,
    isExpanded: open,
    onExpandedChange: onOpenChange,
    ref: useForwardedRef(ref),
  });
}

/**
 * Reveals supporting content from a labelled trigger while preserving controlled,
 * read-only, and uncontrolled state ownership.
 *
 * @summary collapsible supporting content with accessible trigger semantics
 */
export const Disclosure = {
  /** Collapsible panel content. */
  Panel: SharedDisclosurePanel,
  /** State and semantic root. */
  Root,
  /** Heading button that toggles the panel. */
  Trigger: SharedDisclosureTrigger,
};
