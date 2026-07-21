import type {
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createElement } from 'react';
import { Button as AriaButton } from 'react-aria-components/Button';
import { DisclosurePanel as AriaDisclosurePanel } from 'react-aria-components/Disclosure';
import { Heading as AriaHeading } from 'react-aria-components/Heading';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../hooks/useForwardedRef';
import type { NativeButtonProps } from '../types/native';

const disclosureTrigger = tv({
  base: 'flex min-h-11 w-full items-center justify-between gap-3 px-3 py-2 text-start font-semibold text-[var(--breeze-ink)] outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45 data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-[var(--breeze-focus)]',
});
const disclosurePanel = tv({
  base: 'px-3 pb-4 text-[var(--breeze-ink)]',
});

/** Shared Breeze props for a disclosure or accordion trigger. */
export interface SharedDisclosureTriggerProps extends NativeButtonProps {
  /** Trigger label. */
  children: ReactNode;
  /** Placement and composition classes. */
  className?: string;
  /** Heading level around the trigger. Defaults to `3`. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Ref to the rendered trigger button. */
  ref?: Ref<HTMLButtonElement>;
}

/** Shared Breeze props for a disclosure or accordion panel. */
export interface SharedDisclosurePanelProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Collapsible panel content. */
  children: ReactNode;
  /** Announces the panel as a region instead of a group. */
  role?: 'group' | 'region';
  /** Ref to the rendered panel. */
  ref?: Ref<HTMLDivElement>;
}

/** Internal React Aria-backed trigger shared by disclosures and accordions. */
export function SharedDisclosureTrigger({
  children,
  className,
  headingLevel = 3,
  ref,
  ...props
}: Readonly<SharedDisclosureTriggerProps>): ReactElement {
  return (
    <AriaHeading level={headingLevel}>
      {createElement(
        AriaButton,
        {
          ...props,
          className: disclosureTrigger({ class: className }),
          ref: useForwardedRef(ref),
          slot: 'trigger',
        } as ComponentProps<typeof AriaButton>,
        children,
      )}
    </AriaHeading>
  );
}

/** Internal React Aria-backed panel shared by disclosures and accordions. */
export function SharedDisclosurePanel({
  className,
  ref,
  ...props
}: SharedDisclosurePanelProps): ReactElement {
  return createElement(AriaDisclosurePanel, {
    ...props,
    className: disclosurePanel({ class: className }),
    ref: useForwardedRef(ref),
  });
}
