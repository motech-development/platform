import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import { createElement, useId } from 'react';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';

/** Props for a page title, context, back destination, and actions. */
export interface PageHeaderProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'style' | 'title'> {
  /** Page-level actions that stack below the title on compact layouts. */
  actions?: ReactNode;
  /** Optional back navigation displayed before the page heading. */
  back?: ReactNode;
  /** Concise page purpose or status. */
  description?: ReactNode;
  /** Ref to the rendered header. */
  ref?: Ref<HTMLElement>;
  /** Unique page heading. */
  title: ReactNode;
}

/**
 * Establishes page hierarchy and responsive page-level actions.
 *
 * @summary responsive page heading with context, back link, and actions
 */
export function PageHeader({
  actions,
  back,
  className,
  description,
  ref,
  title,
  ...props
}: PageHeaderProps): ReactElement {
  useBreezeContext();

  const titleId = useId();

  return createElement(
    'header',
    {
      ...props,
      'aria-labelledby': titleId,
      className: `grid gap-5 pb-6 sm:gap-8 sm:pb-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end ${className ?? ''}`,
      ref: useForwardedRef(ref),
    },
    <>
      <div className="grid min-w-0 gap-6">
        {back === null || back === undefined ? null : (
          <div className="justify-self-start" data-page-header-back>
            {back}
          </div>
        )}
        <div className="grid gap-2">
          <h1
            className="m-0 font-[family-name:var(--breeze-font-display)] text-[2rem] leading-[1.12] font-bold tracking-[-0.025em] sm:text-[2.5rem]"
            id={titleId}
          >
            {title}
          </h1>
          {description === null || description === undefined ? null : (
            <div className="m-0 max-w-[65ch] text-base leading-[1.4] text-[var(--breeze-ink-soft)]">
              {description}
            </div>
          )}
        </div>
      </div>
      {actions === null || actions === undefined ? null : (
        <div className="flex flex-col items-stretch sm:items-start lg:items-end">
          {actions}
        </div>
      )}
    </>,
  );
}
