import { parseDate } from '@internationalized/date';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import { useBreezeContext } from '../../provider/BreezeContext';
import { Skeleton } from '../Skeleton/Skeleton';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';

const variants = {
  base: {
    text: 'breeze:m-0 breeze:font-breeze-sans',
  },
  compound: {},
  size: {},
  state: {
    aligned: 'breeze:block breeze:inline-full',
    inlineLoading: 'breeze:inline-block',
    numeric: 'breeze:tabular-nums breeze:tracking-breeze-tighter',
    truncate:
      'breeze:block breeze:min-inline-0 breeze:inline-full breeze:overflow-hidden breeze:text-ellipsis breeze:whitespace-nowrap',
  },
  variant: {
    align: {
      center: 'breeze:text-center',
      end: 'breeze:text-end',
      start: 'breeze:text-start',
    },
    role: {
      body: 'breeze:text-breeze-sm breeze:font-normal breeze:leading-breeze-snug',
      caption:
        'breeze:text-breeze-xs breeze:font-medium breeze:leading-breeze-snug',
      heading:
        'breeze:text-breeze-2xl breeze:font-semibold breeze:leading-breeze-tight',
      label:
        'breeze:text-breeze-xs breeze:font-medium breeze:leading-breeze-snug',
      micro:
        'breeze:text-breeze-2xs breeze:font-bold breeze:uppercase breeze:leading-breeze-snug breeze:tracking-breeze-caps',
      money:
        'breeze:text-breeze-4xl breeze:font-semibold breeze:leading-breeze-tight breeze:tracking-breeze-tightest breeze:tabular-nums',
      title:
        'breeze:text-breeze-md breeze:font-semibold breeze:leading-breeze-snug',
    },
    tone: {
      brand: 'breeze:text-breeze-brand-text',
      danger: 'breeze:text-breeze-danger',
      default: 'breeze:text-breeze-ink',
      muted: 'breeze:text-breeze-ink-3',
      positive: 'breeze:text-breeze-pos',
      secondary: 'breeze:text-breeze-ink-2',
      warning: 'breeze:text-breeze-warn',
    },
  },
} as const;

export type TypographyAlign = keyof typeof variants.variant.align;
export type TypographyElement =
  | 'div'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'p'
  | 'span';
/** An ISO 8601 calendar date without a time or time zone. */
export type IsoCalendarDate = `${number}-${number}-${number}`;
export type TypographyVariant = keyof typeof variants.variant.role;
export type TypographyTone = keyof typeof variants.variant.tone;

interface TypographyBaseProps {
  /** Provides expanded screen-reader text or names rich content. */
  'aria-label'?: string;
  /** Aligns text along the inline axis. Numeric content defaults to `end`. */
  align?: TypographyAlign;
  /** Overrides the semantic HTML element selected by the text role. */
  element?: TypographyElement;
  /** Sets the rendered element's HTML `id`. */
  id?: string;
  /** Applies tabular numerals, logical end alignment and figure tracking. */
  numeric?: boolean;
  /** Selects the semantic text colour. Defaults to `default`. */
  tone?: TypographyTone;
  /** Truncates a single line with an ellipsis when space is constrained. */
  truncate?: boolean;
}

interface CurrencyTypographyContent extends TypographyBaseProps {
  /** Unavailable when displaying a formatted currency value. */
  children?: never;
  /** ISO 4217 currency code used for locale-aware formatting. */
  currency: string;
  /** Unavailable when formatting currency. */
  dateStyle?: never;
  /** Formats `value` as locale-aware currency. */
  format: 'currency';
  /** Controls the sign: `auto` signs negatives, `always` positives too; zero never. Defaults to `auto`. */
  sign?: 'always' | 'auto' | 'never';
  /** Uses the dedicated money text role required for currency formatting. */
  variant: 'money';
}

interface DateTypographyContent extends TypographyBaseProps {
  /** Unavailable when displaying a formatted date value. */
  children?: never;
  /** Unavailable when formatting a date. */
  currency?: never;
  /** Selects the locale-aware date verbosity. Defaults to `long`. */
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  /** Formats `value` as a locale-aware calendar date. */
  format: 'date';
  /** Unavailable when formatting a date. */
  sign?: never;
  /** Selects the visual and typographic text role. Defaults to `body`. */
  variant?: Exclude<TypographyVariant, 'money'>;
}

interface TextTypographyContent extends TypographyBaseProps {
  /** Unavailable when displaying text content. */
  currency?: never;
  /** Unavailable when displaying text content. */
  dateStyle?: never;
  /** Omit to display `children` without value formatting. */
  format?: never;
  /** Unavailable when displaying text content. */
  sign?: never;
  /** Unavailable when displaying text content. */
  value?: never;
  /** Selects the visual and typographic text role. Defaults to `body`. */
  variant?: Exclude<TypographyVariant, 'money'>;
}

export type TypographyProps =
  | (CurrencyTypographyContent &
      (
        | {
            /** Replaces the formatted value with a loading placeholder. */
            loading: true;
            /** Numeric amount to format; optional while loading. */
            value?: number;
          }
        | {
            /** Displays the formatted value instead of a loading placeholder. */
            loading?: false;
            /** Numeric amount to format as currency. */
            value: number;
          }
      ))
  | (DateTypographyContent &
      (
        | {
            /** Replaces the formatted value with a loading placeholder. */
            loading: true;
            /** ISO calendar date to format; optional while loading. */
            value?: IsoCalendarDate;
          }
        | {
            /** Displays the formatted value instead of a loading placeholder. */
            loading?: false;
            /** ISO calendar date to format for the provider locale. */
            value: IsoCalendarDate;
          }
      ))
  | (TextTypographyContent &
      (
        | {
            /** Text or inline content; optional while loading. */
            children?: ReactNode;
            /** Replaces the content with a loading placeholder. */
            loading: true;
          }
        | {
            /** Text or inline content to display. */
            children: ReactNode;
            /** Displays the content instead of a loading placeholder. */
            loading?: false;
          }
      ));

function getDefaultElement(variant: TypographyVariant): TypographyElement {
  if (variant === 'heading') {
    return 'h2';
  }

  if (variant === 'title') {
    return 'h3';
  }

  if (variant === 'body') {
    return 'p';
  }

  return 'span';
}

// Zero, negative zero and amounts that round to zero are never signed.
const signDisplay = {
  always: 'exceptZero',
  auto: 'negative',
  never: 'never',
} as const satisfies Record<
  NonNullable<CurrencyTypographyContent['sign']>,
  Intl.NumberFormatOptions['signDisplay']
>;

let supportedCurrencies: Set<string> | undefined;

function getSupportedCurrencies(): Set<string> {
  supportedCurrencies ??= new Set(
    Intl.supportedValuesOf('currency').map((currency) =>
      currency.toUpperCase(),
    ),
  );

  return supportedCurrencies;
}

function formatCurrency(
  value: number,
  currency: string,
  locale: string,
  sign: NonNullable<CurrencyTypographyContent['sign']>,
): string {
  if (!Number.isFinite(value)) {
    throw new RangeError(
      `Typography currency value must be a finite number; received ${String(value)}.`,
    );
  }

  if (
    !/^[A-Z]{3}$/i.test(currency) ||
    !getSupportedCurrencies().has(currency.toUpperCase())
  ) {
    throw new RangeError(
      `Typography currency must be a three-letter ISO 4217 code; received "${currency}".`,
    );
  }

  // BreezeProvider has already validated the locale.
  return new Intl.NumberFormat(locale, {
    currency,
    signDisplay: signDisplay[sign],
    style: 'currency',
  })
    .formatToParts(value)
    .map((part) => (part.type === 'minusSign' ? '−' : part.value))
    .join('');
}

function formatDate(
  value: string,
  locale: string,
  dateStyle: DateTypographyContent['dateStyle'],
): string {
  let date: Date;

  // Calendar dates have no zone: UTC midnight formatted in UTC keeps the day fixed.
  try {
    date = parseDate(value).toDate('UTC');
  } catch {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: dateStyle ?? 'long',
    timeZone: 'UTC',
  }).format(date);
}

function getTypographyContent(
  props: Readonly<TypographyProps>,
  locale: string,
  loadingMessage: string,
): ReactNode {
  if (props.loading) {
    return <Skeleton blockSize="1lh" inlineSize="8em" label={loadingMessage} />;
  }

  if (props.format === 'currency') {
    return formatCurrency(
      props.value,
      props.currency,
      locale,
      props.sign ?? 'auto',
    );
  }

  if (props.format === 'date') {
    return formatDate(props.value, locale, props.dateStyle);
  }

  return props.children;
}

/**
 * Applies Breeze text roles and locale-aware money or calendar-date formatting.
 *
 * @summary Semantic interface text with typography and formatting kept together.
 */
export function Typography(props: Readonly<TypographyProps>) {
  const { locale, messages } = useBreezeContext();
  const {
    'aria-label': ariaLabel,
    align,
    children,
    element: requestedElement,
    format,
    id,
    loading = false,
    numeric = false,
    tone = 'default',
    truncate = false,
    variant = 'body',
  } = props;
  const element = requestedElement ?? getDefaultElement(variant);
  const accessibleLabel = ariaLabel?.trim() || undefined;
  const resolvedAlign =
    align ?? (variant === 'money' || numeric ? 'end' : 'start');
  const needsAlignmentBox =
    align !== undefined || variant === 'money' || numeric;
  let content = getTypographyContent(props, locale, messages.loading);

  const canReplaceWithAccessibleLabel =
    format !== undefined ||
    typeof children === 'string' ||
    typeof children === 'number';
  const usesNativeLabel =
    !loading &&
    accessibleLabel !== undefined &&
    !canReplaceWithAccessibleLabel &&
    ['h1', 'h2', 'h3', 'h4'].includes(element);
  const usesLabelledGroup =
    !loading &&
    accessibleLabel !== undefined &&
    !canReplaceWithAccessibleLabel &&
    !usesNativeLabel;

  if (
    !loading &&
    accessibleLabel !== undefined &&
    canReplaceWithAccessibleLabel
  ) {
    content = (
      <>
        <span aria-hidden="true">{content}</span>
        <VisuallyHidden>{accessibleLabel}</VisuallyHidden>
      </>
    );
  }

  return createElement(
    element,
    {
      'aria-busy': loading || undefined,
      'aria-label':
        usesLabelledGroup || usesNativeLabel ? accessibleLabel : undefined,
      className: [
        variants.base.text,
        variants.variant.role[variant],
        variants.variant.tone[tone],
        variants.variant.align[resolvedAlign],
        needsAlignmentBox && variants.state.aligned,
        loading &&
          element === 'span' &&
          !needsAlignmentBox &&
          variants.state.inlineLoading,
        numeric && variant !== 'money' && variants.state.numeric,
        truncate && variants.state.truncate,
      ]
        .filter(Boolean)
        .join(' '),
      id,
      lang: locale,
      role: usesLabelledGroup ? 'group' : undefined,
    },
    content,
  );
}
