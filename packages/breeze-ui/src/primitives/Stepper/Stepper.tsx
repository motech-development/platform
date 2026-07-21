import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import { createElement } from 'react';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';

const stepperRoot = tv({
  base: 'm-0 flex list-none gap-4 p-0',
  defaultVariants: { orientation: 'horizontal' },
  variants: {
    orientation: {
      horizontal: 'flex-row flex-wrap',
      vertical: 'flex-col',
    },
  },
});

const stepperItem = tv({
  base: 'group flex min-w-0 flex-1 items-start gap-3 text-[var(--breeze-ink-soft)]',
  variants: {
    status: {
      complete: 'text-[var(--breeze-success)]',
      current: 'text-[var(--breeze-primary)]',
      upcoming: '',
    },
  },
});

const stepperIndicator = tv({
  base: 'grid size-8 shrink-0 place-items-center rounded-full border-2 border-current font-[family-name:var(--breeze-font-display)] text-sm font-bold',
  variants: {
    status: {
      complete: 'bg-[var(--breeze-success)] text-white',
      current: 'bg-[var(--breeze-primary)] text-white',
      upcoming: 'bg-[var(--breeze-surface)]',
    },
  },
});

/** Semantic state of one progression step. */
export type StepperStatus = 'complete' | 'current' | 'upcoming';

/** Props for an accessible ordered progression list. */
export interface StepperRootProps
  extends Omit<HTMLAttributes<HTMLOListElement>, 'style'> {
  /** Ordered Stepper.Item children. */
  children: ReactNode;
  /** Visual layout direction. Defaults to `horizontal`. */
  orientation?: 'horizontal' | 'vertical';
  /** Ref to the rendered ordered list. */
  ref?: Ref<HTMLOListElement>;
}

/** Props for one step in a progression. */
export interface StepperItemProps
  extends Omit<HTMLAttributes<HTMLLIElement>, 'style' | 'title'> {
  /** Optional supporting step description. */
  description?: ReactNode;
  /** Position or compact marker rendered in the indicator. */
  indicator: ReactNode;
  /** Ref to the rendered list item. */
  ref?: Ref<HTMLLIElement>;
  /** Completion state. */
  status: StepperStatus;
  /** Persistent visible step title. */
  title: ReactNode;
}

/** Renders a semantic ordered list describing multi-stage progress. */
export function Root({
  className,
  orientation = 'horizontal',
  ref,
  ...props
}: StepperRootProps): ReactElement {
  useBreezeContext();

  return createElement('ol', {
    ...props,
    className: stepperRoot({ class: className, orientation }),
    ref: useForwardedRef(ref),
    role: 'list',
  });
}

/** Renders one completed, current, or upcoming progression step. */
export function Item({
  className,
  description,
  indicator,
  ref,
  status,
  title,
  ...props
}: StepperItemProps): ReactElement {
  return createElement(
    'li',
    {
      ...props,
      'aria-current': status === 'current' ? 'step' : undefined,
      className: stepperItem({ class: className, status }),
      ref: useForwardedRef(ref),
    },
    <>
      <span aria-hidden="true" className={stepperIndicator({ status })}>
        {indicator}
      </span>
      <span className="grid min-w-0 gap-1 pt-1">
        <strong className="font-[family-name:var(--breeze-font-display)] text-base text-current">
          {title}
        </strong>
        {description === undefined ? null : (
          <span className="text-base text-[var(--breeze-ink-soft)]">
            {description}
          </span>
        )}
      </span>
    </>,
  );
}

/**
 * Describes application-owned multi-stage progress as an accessible ordered
 * list without owning navigation, validation, or persistence.
 *
 * @summary ordered progression with current-step semantics
 */
export const Stepper = {
  /** One completed, current, or upcoming stage. */
  Item,
  /** Ordered progression-list root. */
  Root,
};
