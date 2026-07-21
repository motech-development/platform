import type {
  ComponentPropsWithRef,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createElement } from 'react';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import type { VisualVariant } from '../../internal/styling/visual';
import { useBreezeContext } from '../../provider/BreezeContext';

const alert = tv({
  base: 'flex min-w-0 items-center gap-3 border px-4 py-3 font-[family-name:var(--breeze-font-body)] text-base leading-[1.4] forced-colors:border-[CanvasText]',
  defaultVariants: {
    variant: 'info',
  },
  variants: {
    variant: {
      danger:
        'border-[var(--breeze-danger)] bg-[var(--breeze-danger-soft)] text-[var(--breeze-ink)]',
      dark: 'border-[var(--breeze-shell)] bg-[var(--breeze-shell)] text-white',
      info: 'border-[var(--breeze-info-border)] bg-[var(--breeze-info-soft)] text-[var(--breeze-info-ink)]',
      light:
        'border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)] text-[var(--breeze-ink)]',
      primary:
        'border-[var(--breeze-primary)] bg-[var(--breeze-primary-soft)] text-[var(--breeze-ink)]',
      secondary:
        'border-[var(--breeze-border-strong)] bg-[var(--breeze-surface-subtle)] text-[var(--breeze-ink)]',
      success:
        'border-[var(--breeze-success)] bg-[var(--breeze-success-soft)] text-[var(--breeze-ink)]',
      warning:
        'border-[var(--breeze-warning)] bg-[var(--breeze-warning-soft)] text-[var(--breeze-ink)]',
    },
  },
});

/** Announcement urgency supported by persistent alerts. */
export type AlertAnnouncement = 'assertive' | 'polite' | 'off';

/** Props for a persistent live-region alert. */
export interface AlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'role' | 'style'> {
  /** Announcement urgency. Defaults to `assertive`; use `off` for content already present when the page loads. */
  announcement?: AlertAnnouncement;
  /** Application-owned translated alert content. */
  children: ReactNode;
  /** Ref to the rendered alert element. */
  ref?: Ref<HTMLDivElement>;
  /** Breeze semantic colour. Defaults to `info`. */
  variant?: VisualVariant;
}

function getAlertRole(
  announcement: AlertAnnouncement,
): 'alert' | 'status' | undefined {
  if (announcement === 'assertive') {
    return 'alert';
  }

  if (announcement === 'polite') {
    return 'status';
  }

  return undefined;
}

/**
 * Displays persistent inline application feedback with explicit announcement
 * urgency.
 *
 * @summary persistent inline feedback with explicit announcement urgency
 */
export function Alert({
  announcement = 'assertive',
  className,
  ref,
  variant = 'info',
  ...props
}: Readonly<AlertProps>): ReactElement {
  useBreezeContext();

  const alertProps: ComponentPropsWithRef<'div'> & {
    'data-variant': VisualVariant;
  } = {
    ...props,
    'aria-atomic': announcement === 'off' ? undefined : 'true',
    'aria-live': announcement,
    className: alert({ class: className, variant }),
    'data-variant': variant,
    ref: useForwardedRef(ref),
    role: getAlertRole(announcement),
  };

  return createElement('div', alertProps);
}
