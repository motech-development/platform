import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import { createElement, useId } from 'react';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';

const formSection = tv({
  base: 'grid min-w-0',
  compoundVariants: [
    {
      class:
        'border-t border-[var(--breeze-border)] pt-6 first:border-t-0 first:pt-0',
      divided: true,
      layout: 'split',
    },
    {
      class: 'border-b border-[var(--breeze-border)] pb-6',
      divided: true,
      layout: 'stacked',
    },
  ],
  defaultVariants: {
    divided: false,
    layout: 'split',
  },
  variants: {
    divided: {
      false: '',
      true: '',
    },
    layout: {
      split:
        'gap-4 py-6 first:pt-0 md:grid-cols-[minmax(12.5rem,15rem)_minmax(0,1fr)] md:gap-12 md:py-7',
      stacked: 'gap-6',
    },
  },
});

const formSectionHeader = tv({
  base: 'grid content-start',
  defaultVariants: {
    layout: 'split',
  },
  variants: {
    layout: {
      split: 'gap-1',
      stacked: 'gap-1 border-b border-[var(--breeze-border)] pb-5 sm:pb-6',
    },
  },
});

/** Canonical section arrangements for page and overlay forms. */
export type FormSectionLayout = 'split' | 'stacked';

/** Semantic heading levels supported by a form section. */
export type FormSectionHeadingLevel = 2 | 3 | 4 | 5 | 6;

/** Props for one titled region of a longer form. */
export interface FormSectionProps
  extends Omit<HTMLAttributes<HTMLElement>, 'style' | 'title'> {
  /** Optional action aligned with the section introduction. */
  action?: ReactNode;
  /** Form fields or other related controls. */
  children: ReactNode;
  /** Supporting explanation. */
  description?: ReactNode;
  /** Adds the canonical outer divider for the selected layout. Defaults to `false`. */
  divided?: boolean;
  /** Semantic level for the persistent section heading. Defaults to `2`. */
  headingLevel?: FormSectionHeadingLevel;
  /** Page split or overlay stacked arrangement. Defaults to `split`. */
  layout?: FormSectionLayout;
  /** Ref to the rendered section. */
  ref?: Ref<HTMLElement>;
  /** Persistent section heading. */
  title: ReactNode;
}

/**
 * Groups related form controls with a consistent heading and divider rhythm.
 *
 * @summary titled form region with responsive field and action layout
 */
export function FormSection({
  action,
  children,
  className,
  description,
  divided = false,
  headingLevel = 2,
  layout = 'split',
  ref,
  title,
  ...props
}: FormSectionProps): ReactElement {
  useBreezeContext();

  const titleId = useId();

  return createElement(
    'section',
    {
      ...props,
      'aria-labelledby': titleId,
      className: formSection({
        class: className,
        divided,
        layout,
      }),
      ref: useForwardedRef(ref),
    },
    <>
      <header className={formSectionHeader({ layout })}>
        {createElement(
          `h${headingLevel}`,
          {
            className:
              'm-0 font-[family-name:var(--breeze-font-display)] text-xl leading-[1.2] font-bold',
            id: titleId,
          },
          title,
        )}
        {description === null || description === undefined ? null : (
          <p className="m-0 max-w-[65ch] text-base leading-[1.4] text-[var(--breeze-ink-soft)]">
            {description}
          </p>
        )}
      </header>
      <div
        className={
          action === undefined
            ? 'grid min-w-0 content-start gap-5'
            : 'flex min-w-0 flex-col-reverse gap-3 md:flex-col md:gap-5'
        }
      >
        {action === undefined ? null : (
          <div
            className="flex min-h-11 items-center justify-start md:justify-end"
            data-breeze-form-section-action=""
          >
            {action}
          </div>
        )}
        <div
          className="grid min-w-0 content-start gap-5"
          data-breeze-form-section-fields=""
        >
          {children}
        </div>
      </div>
    </>,
  );
}
