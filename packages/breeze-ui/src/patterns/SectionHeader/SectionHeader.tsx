import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import { createElement } from 'react';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';

/** Props for a content-section heading and optional action. */
export interface SectionHeaderProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'style' | 'title'> {
  /** Optional section action. */
  action?: ReactNode;
  /** Optional concise supporting context. */
  description?: ReactNode;
  /** Stable id for heading relationships. */
  id?: string;
  /** Ref to the rendered header. */
  ref?: Ref<HTMLElement>;
  /** Section heading. */
  title: ReactNode;
}

/**
 * Aligns a section heading, supporting context, and one related action.
 *
 * @summary content-section heading with context and one related action
 */
export function SectionHeader({
  action,
  className,
  description,
  id,
  ref,
  title,
  ...props
}: SectionHeaderProps): ReactElement {
  useBreezeContext();

  return createElement(
    'header',
    {
      ...props,
      className: `flex items-start justify-between gap-3 border-b border-[var(--breeze-border)] px-5 py-4 ${className ?? ''}`,
      ref: useForwardedRef(ref),
    },
    <>
      <div className="grid min-w-0 gap-1">
        <h2
          className="m-0 font-[family-name:var(--breeze-font-display)] text-xl font-bold"
          id={id}
        >
          {title}
        </h2>
        {description === null || description === undefined ? null : (
          <p className="m-0 max-w-[65ch] text-base text-[var(--breeze-ink-soft)]">
            {description}
          </p>
        )}
      </div>
      {action === null || action === undefined ? null : (
        <div className="shrink-0">{action}</div>
      )}
    </>,
  );
}
