import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import { createElement } from 'react';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';

const formActions = tv({
  base: 'mt-auto flex flex-col gap-3 pt-0.5 sm:flex-row sm:items-center sm:gap-2.5 [&>*]:w-full sm:[&>*]:w-auto [&>*>*]:w-full sm:[&>*>*]:w-auto',
  defaultVariants: {
    divided: false,
  },
  variants: {
    divided: {
      false: '',
      true: 'border-t border-[var(--breeze-border)] pt-6',
    },
  },
});

const secondaryAction =
  '[&_button]:border-[var(--breeze-border-strong)] [&_button]:bg-[var(--breeze-surface)] [&_button]:text-[var(--breeze-ink)]';

/** Props for a canonical form action region. */
export interface FormActionsProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'style'> {
  /** Optional back action placed at the leading edge on wide layouts and after primary on compact layouts. */
  back?: ReactNode;
  /** Optional cancellation action displayed after the back action. */
  cancel?: ReactNode;
  /** Optional destructive action placed at the leading edge on wide layouts and last on compact layouts. */
  danger?: ReactNode;
  /** Replaces the compact action spacing with the canonical separated-page spacing. Defaults to `false`. */
  divided?: boolean;
  /** Primary submit or continuation action, first on compact layouts and in the trailing group on wide layouts. */
  primary: ReactNode;
  /** Ref to the rendered action container. */
  ref?: Ref<HTMLElement>;
  /** Additional non-primary action displayed after cancellation. */
  secondary?: ReactNode;
}

/**
 * Orders form actions consistently across compact and wide layouts.
 *
 * @summary responsive ordering for primary and supporting form actions
 */
export function FormActions({
  back,
  cancel,
  className,
  danger,
  divided = false,
  primary,
  ref,
  secondary,
  ...props
}: FormActionsProps): ReactElement {
  useBreezeContext();

  const hasAccessibleName =
    props['aria-label'] !== undefined || props['aria-labelledby'] !== undefined;
  let trailingStart = 'primary';

  if (cancel !== null && cancel !== undefined) {
    trailingStart = 'cancel';
  } else if (secondary !== null && secondary !== undefined) {
    trailingStart = 'secondary';
  }

  return createElement(
    'div',
    {
      ...props,
      className: formActions({ class: className, divided }),
      ref: useForwardedRef(ref),
      role: hasAccessibleName ? 'group' : undefined,
    },
    <>
      {danger === null || danger === undefined ? null : (
        <div className="order-5 sm:order-none" data-action-position="leading">
          {danger}
        </div>
      )}
      {back === null || back === undefined ? null : (
        <div
          className={`order-2 sm:order-none ${secondaryAction}`}
          data-action-position="leading"
        >
          {back}
        </div>
      )}
      {cancel === null || cancel === undefined ? null : (
        <div
          className={`order-3 sm:order-none ${secondaryAction} ${trailingStart === 'cancel' ? 'sm:ms-auto' : ''}`}
          data-action-position="trailing"
        >
          {cancel}
        </div>
      )}
      {secondary === null || secondary === undefined ? null : (
        <div
          className={`order-4 sm:order-none ${secondaryAction} ${trailingStart === 'secondary' ? 'sm:ms-auto' : ''}`}
          data-action-position="trailing"
        >
          {secondary}
        </div>
      )}
      <div
        className={`order-1 sm:order-none ${trailingStart === 'primary' ? 'sm:ms-auto' : ''}`}
        data-action-position="trailing"
      >
        {primary}
      </div>
    </>,
  );
}
