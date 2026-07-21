import type {
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createElement } from 'react';
import { Group as AriaGroup } from 'react-aria-components/Group';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import type { ControlSize } from '../../internal/styling/visual';
import { useBreezeContext } from '../../provider/BreezeContext';

const inputGroupRoot = tv({
  base: "breeze-input-group relative flex min-w-0 items-stretch bg-[var(--breeze-surface)] outline-none after:pointer-events-none after:absolute after:inset-0 after:z-10 after:border after:border-[var(--breeze-border-strong)] after:transition-colors after:duration-[var(--breeze-duration-fast)] after:content-[''] data-[disabled]:bg-[var(--breeze-surface-subtle)] data-[focus-within]:after:border-[var(--breeze-primary)] data-[hovered]:after:border-[var(--breeze-primary)] data-[invalid]:after:!border-[var(--breeze-danger)] [&>*]:!border-0 [&>*:not([data-breeze-input-group-addon])+*:not([data-breeze-input-group-addon])]:!border-s [&>*:not([data-breeze-input-group-addon])+*:not([data-breeze-input-group-addon])]:!border-s-[var(--breeze-border-strong)] [&>[data-breeze-input-group-addon]:not(:first-child)]:ps-0 [&>[data-breeze-input-group-addon]:not(:last-child)]:pe-0 [&>[data-focus-visible]]:!outline-none",
});

const inputGroupAddon = tv({
  base: 'inline-flex shrink-0 items-center justify-center bg-transparent font-[family-name:var(--breeze-font-display)] font-bold text-[var(--breeze-ink-soft)]',
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      lg: 'min-h-12 px-4 text-base',
      md: 'min-h-10 px-3 text-sm',
      sm: 'min-h-8 px-2.5 text-xs',
    },
  },
});

/** Props for visually grouping a field control with related adornments or actions. */
export interface InputGroupRootProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'role' | 'style'> {
  /** Field control, addons, and related actions in visual order. */
  children: ReactNode;
  /** Ref to the rendered group. */
  ref?: Ref<HTMLDivElement>;
  /** Accessible grouping role. Defaults to `presentation` for visual-only composition. */
  role?: 'group' | 'presentation' | 'region';
}

/** Props for a non-interactive input prefix or suffix. */
export interface InputGroupAddonProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  /** Prefix or suffix content such as a unit or protocol. */
  children: ReactNode;
  /** Ref to the rendered addon. */
  ref?: Ref<HTMLSpanElement>;
  /** Canonical addon size. Defaults to `md`. */
  size?: ControlSize;
}

/** Visually composes a field control with ordered addons or related actions. */
export function Root({
  className,
  ref,
  role = 'presentation',
  ...props
}: InputGroupRootProps): ReactElement {
  useBreezeContext();

  const forwardedRef = useForwardedRef(ref);

  return createElement(AriaGroup, {
    ...props,
    className: inputGroupRoot({ class: className }),
    'data-breeze-input-group': '',
    ref: forwardedRef,
    role,
  } as ComponentProps<typeof AriaGroup>);
}

/** Renders a non-interactive prefix or suffix within an InputGroup. */
export function Addon({
  className,
  ref,
  size,
  ...props
}: InputGroupAddonProps): ReactElement {
  const forwardedRef = useForwardedRef(ref);

  return createElement('span', {
    ...props,
    className: inputGroupAddon({ class: className, size }),
    'data-breeze-input-group-addon': '',
    ref: forwardedRef,
  });
}

/**
 * Compound visual composition primitive for field controls and addons.
 *
 * @summary visually unified field controls, addons, and related actions
 */
export const InputGroup = {
  /** Non-interactive prefix or suffix. */
  Addon,
  /** Visual grouping root. */
  Root,
};
