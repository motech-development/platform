import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import { createElement, useId } from 'react';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import type { VisualVariant } from '../../internal/styling/visual';
import { IconTile } from '../../primitives/IconTile/IconTile';
import { useBreezeContext } from '../../provider/BreezeContext';

/** Props for a complete contextual state message. */
export interface StatePanelProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'style' | 'title'> {
  /** Optional recovery or next-step action. */
  action?: ReactNode;
  /** Concise supporting guidance. */
  description: ReactNode;
  /** Decorative state icon. */
  icon: ReactNode;
  /** Ref to the rendered section. */
  ref?: Ref<HTMLElement>;
  /** Contextual state heading. */
  title: ReactNode;
  /** Semantic state colour. Defaults to `info`. */
  variant?: Extract<
    VisualVariant,
    'danger' | 'info' | 'primary' | 'success' | 'warning'
  >;
}

/**
 * Communicates empty, error, success, warning, or informational state and
 * recovery.
 *
 * @summary complete contextual state with guidance and optional recovery
 */
export function StatePanel({
  action,
  className,
  description,
  icon,
  ref,
  title,
  variant = 'info',
  ...props
}: Readonly<StatePanelProps>): ReactElement {
  useBreezeContext();

  const titleId = useId();

  return createElement(
    'section',
    {
      ...props,
      'aria-labelledby': titleId,
      className: `grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-4 border-b-2 border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)] p-5 sm:gap-x-5 sm:p-8 ${className ?? ''}`,
      ref: useForwardedRef(ref),
    },
    <>
      <IconTile size="lg" variant={variant}>
        {icon}
      </IconTile>
      <div className="grid min-w-0 content-center gap-2">
        <h2
          className="m-0 font-[family-name:var(--breeze-font-display)] text-2xl font-bold"
          id={titleId}
        >
          {title}
        </h2>
        <div className="col-span-2 m-0 max-w-[65ch] text-base text-[var(--breeze-ink-soft)] sm:col-span-1">
          {description}
        </div>
        {action === null || action === undefined ? null : (
          <div className="col-span-2 mt-3 flex flex-col items-stretch sm:col-span-1 sm:items-start">
            {action}
          </div>
        )}
      </div>
    </>,
  );
}
