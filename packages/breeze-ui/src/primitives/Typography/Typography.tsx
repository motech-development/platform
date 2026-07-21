import type { HTMLAttributes, Ref } from 'react';
import { createElement } from 'react';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';

const typography = tv({
  base: 'm-0 min-w-0',
  compoundVariants: [
    {
      class: 'mb-4',
      gutterBottom: true,
      level: ['body', 'label'],
    },
    {
      class: 'mb-6',
      gutterBottom: true,
      level: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'metric', 'summary'],
    },
  ],
  defaultVariants: {
    colour: 'default',
    level: 'body',
    weight: 'default',
  },
  variants: {
    align: {
      center: 'text-center',
      end: 'text-end',
      start: 'text-start',
    },
    colour: {
      danger: 'text-[var(--breeze-danger)]',
      default: 'text-[var(--breeze-ink)]',
      info: 'text-[var(--breeze-info)]',
      inverse: 'text-[var(--breeze-ink-inverse)]',
      'inverse-muted': 'text-[var(--breeze-ink-inverse-muted)]',
      muted: 'text-[var(--breeze-ink-muted)]',
      primary: 'text-[var(--breeze-primary)]',
      success: 'text-[var(--breeze-success)]',
      warning: 'text-[var(--breeze-warning)]',
    },
    gutterBottom: {
      false: '',
      true: '',
    },
    level: {
      body: 'font-[family-name:var(--breeze-font-body)] text-base leading-[1.4]',
      h1: 'font-[family-name:var(--breeze-font-display)] text-[2.5rem] font-bold leading-[1.12]',
      h2: 'font-[family-name:var(--breeze-font-display)] text-[2rem] font-bold leading-[1.15]',
      h3: 'font-[family-name:var(--breeze-font-display)] text-2xl font-bold leading-[1.2]',
      h4: 'font-[family-name:var(--breeze-font-display)] text-xl font-bold leading-[1.2]',
      h5: 'font-[family-name:var(--breeze-font-display)] text-lg font-bold leading-[1.25]',
      h6: 'font-[family-name:var(--breeze-font-display)] text-base font-bold leading-[1.25]',
      label:
        'font-[family-name:var(--breeze-font-display)] text-base font-bold leading-[1.25]',
      metric:
        'font-[family-name:var(--breeze-font-display)] text-[2rem] font-bold leading-[1.2] tabular-nums',
      summary:
        'font-[family-name:var(--breeze-font-display)] text-xl font-bold leading-[1.2] sm:text-2xl',
    },
    lineClamp: {
      2: 'line-clamp-2',
      3: 'line-clamp-3',
      4: 'line-clamp-4',
      none: '',
    },
    tabularNumbers: {
      false: '',
      true: 'tabular-nums',
    },
    truncate: {
      false: '',
      true: 'truncate',
    },
    weight: {
      bold: 'font-bold',
      default: '',
      medium: 'font-medium',
      regular: 'font-normal',
      semibold: 'font-semibold',
    },
  },
});

/** Semantic elements supported by the non-interactive text primitive. */
export type TypographyElement =
  | 'span'
  | 'p'
  | 'div'
  | 'strong'
  | 'em'
  | 'small'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'dt'
  | 'dd';

/** Visual typography levels independent from rendered semantics. */
export type TypographyLevel =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'metric'
  | 'summary'
  | 'label'
  | 'body';

/** Semantic text colours backed by Breeze theme tokens. */
export type TypographyColour =
  | 'default'
  | 'muted'
  | 'primary'
  | 'inverse'
  | 'inverse-muted'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info';

/** Props for Breeze non-interactive text. */
export interface TypographyProps
  extends Omit<HTMLAttributes<HTMLElement>, 'align' | 'color' | 'style'> {
  /** Text alignment. Inherits from the containing layout by default. */
  align?: 'start' | 'center' | 'end';
  /** Constrained semantic element. Defaults to `p`. */
  as?: TypographyElement;
  /** Semantic text colour. Defaults to `default`. */
  colour?: TypographyColour;
  /** Adds canonical bottom rhythm to block elements. Defaults to `false`. */
  gutterBottom?: boolean;
  /** Visual level. Defaults from `as`, otherwise `body`. */
  level?: TypographyLevel;
  /** Bounds text to a supported number of lines. Defaults to no clamp. */
  lineClamp?: 2 | 3 | 4;
  /** Ref to the rendered element. */
  ref?: Ref<HTMLElement>;
  /** Uses tabular numeral glyphs. Defaults to `false`. */
  tabularNumbers?: boolean;
  /** Truncates one line with an ellipsis. Defaults to `false`. */
  truncate?: boolean;
  /** Font weight override. Defaults to the selected level. */
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
}

const headingLevels: Partial<Record<TypographyElement, TypographyLevel>> = {
  dt: 'label',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  strong: 'label',
};

const inlineElements = new Set<TypographyElement>([
  'em',
  'small',
  'span',
  'strong',
]);

/**
 * Renders non-interactive text with independent semantic and visual choices.
 *
 * @summary semantic non-interactive text with a separate visual level
 */
export function Typography({
  align,
  as = 'p',
  className,
  colour,
  gutterBottom = false,
  level,
  lineClamp,
  ref,
  tabularNumbers = false,
  truncate = false,
  weight,
  ...props
}: TypographyProps) {
  useBreezeContext();

  const resolvedLevel = level ?? headingLevels[as] ?? 'body';
  const forwardedRef = useForwardedRef(ref);

  return createElement(as, {
    ...props,
    className: typography({
      align,
      class: className,
      colour,
      gutterBottom: gutterBottom && !inlineElements.has(as),
      level: resolvedLevel,
      lineClamp: lineClamp ?? 'none',
      tabularNumbers,
      truncate,
      weight: weight ?? 'default',
    }),
    ref: forwardedRef,
  });
}
