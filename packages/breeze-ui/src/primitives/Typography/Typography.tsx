import { parseDate } from '@internationalized/date';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import { useBreezeContext } from '../../provider/BreezeContext';
import { Skeleton } from '../Skeleton/Skeleton';

const variants = {
  base: {
    text: 'breeze:m-0 breeze:font-breeze-sans',
  },
  compound: {},
  size: {},
  state: {
    numeric: 'breeze:tabular-nums breeze:tracking-breeze-tighter',
    truncate:
      'breeze:block breeze:min-inline-size-0 breeze:inline-size-full breeze:overflow-hidden breeze:text-ellipsis breeze:whitespace-nowrap',
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
  'aria-label'?: string;
  align?: TypographyAlign;
  element?: TypographyElement;
  id?: string;
  /** Applies tabular numerals, logical end alignment and figure tracking. */
  numeric?: boolean;
  tone?: TypographyTone;
  truncate?: boolean;
}

interface CurrencyTypographyContent extends TypographyBaseProps {
  children?: never;
  currency: string;
  dateStyle?: never;
  format: 'currency';
  sign?: 'always' | 'auto' | 'never';
  variant: 'money';
}

interface DateTypographyContent extends TypographyBaseProps {
  children?: never;
  currency?: never;
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  format: 'date';
  sign?: never;
  variant?: Exclude<TypographyVariant, 'money'>;
}

interface TextTypographyContent extends TypographyBaseProps {
  currency?: never;
  dateStyle?: never;
  format?: never;
  sign?: never;
  value?: never;
  variant?: Exclude<TypographyVariant, 'money'>;
}

export type TypographyProps =
  | (CurrencyTypographyContent &
      ({ loading: true; value?: number } | { loading?: false; value: number }))
  | (DateTypographyContent &
      (
        | { loading: true; value?: IsoCalendarDate }
        | { loading?: false; value: IsoCalendarDate }
      ))
  | (TextTypographyContent &
      (
        | { children?: ReactNode; loading: true }
        | { children: ReactNode; loading?: false }
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

function formatCurrency(
  value: number,
  currency: string,
  locale: string,
  sign: CurrencyTypographyContent['sign'],
): string {
  const parts = new Intl.NumberFormat(locale, {
    currency,
    signDisplay: sign ?? 'auto',
    style: 'currency',
  }).formatToParts(value);

  return parts
    .map((part) => (part.type === 'minusSign' ? '−' : part.value))
    .join('');
}

function formatDate(
  value: string,
  locale: string,
  dateStyle: DateTypographyContent['dateStyle'],
): string {
  let date: Date;

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
    currency,
    dateStyle,
    element: requestedElement,
    format,
    id,
    loading = false,
    numeric = false,
    sign,
    tone = 'default',
    truncate = false,
    value,
    variant = 'body',
  } = props;
  const element = requestedElement ?? getDefaultElement(variant);
  const resolvedAlign =
    align ?? (variant === 'money' || numeric ? 'end' : 'start');
  let content: ReactNode;

  if (loading) {
    content = <Skeleton inlineSize="8em" label={messages.loading} />;
  } else if (format === 'currency' && value !== undefined) {
    content = formatCurrency(value, currency, locale, sign ?? 'auto');
  } else if (format === 'date' && value !== undefined) {
    content = formatDate(value, locale, dateStyle);
  } else {
    content = children;
  }

  return createElement(
    element,
    {
      'aria-busy': loading || undefined,
      'aria-label': ariaLabel,
      className: [
        variants.base.text,
        variants.variant.role[variant],
        variants.variant.tone[tone],
        variants.variant.align[resolvedAlign],
        numeric && variant !== 'money' && variants.state.numeric,
        truncate && variants.state.truncate,
      ]
        .filter(Boolean)
        .join(' '),
      id,
      lang: locale,
    },
    content,
  );
}
