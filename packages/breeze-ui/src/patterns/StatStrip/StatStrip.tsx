import type { ItemDescriptorBadge } from '../../collections/item.types';
import { Badge } from '../../primitives/Badge/Badge';
import { Card } from '../../primitives/Card/Card';
import { Skeleton } from '../../primitives/Skeleton/Skeleton';
import {
  type IsoCalendarDate,
  Typography,
} from '../../primitives/Typography/Typography';
import { useBreezeContext } from '../../provider/BreezeContext';

const variants = {
  base: {
    cell: 'breeze:flex breeze:min-inline-0 breeze:flex-col breeze:gap-[6px] breeze:px-breeze-5 breeze:py-breeze-4',
    figure: 'breeze:m-0 breeze:min-inline-0',
    label:
      'breeze:m-0 breeze:text-breeze-xs breeze:font-medium breeze:text-breeze-ink-3',
    // The prototype keeps a 12px gap before each divider; cells stack below `md`.
    list: 'breeze:m-0 breeze:grid breeze:auto-cols-[minmax(0,1fr)] breeze:grid-flow-col breeze:gap-breeze-3 breeze:max-breeze-md:grid-flow-row',
    loading:
      'breeze:grid breeze:grid-cols-3 breeze:gap-breeze-5 breeze:px-breeze-5 breeze:py-breeze-4 breeze:max-breeze-md:grid-cols-1',
    loadingCell:
      'breeze:flex breeze:min-inline-0 breeze:flex-col breeze:items-start breeze:gap-breeze-2',
  },
  compound: {},
  size: {},
  state: {
    divided:
      'breeze:border-s breeze:border-breeze-line breeze:max-breeze-md:border-s-0 breeze:max-breeze-md:border-bs',
  },
  variant: {},
} as const;

// Label and figure widths follow the prototype's three loading cells.
const loadingCells = [
  {
    figure: 160,
    id: 'first',
    label: 88,
  },
  {
    figure: 152,
    id: 'second',
    label: 112,
  },
  {
    figure: 128,
    id: 'third',
    label: 72,
  },
] as const;

interface StatStripItemBase {
  /** Optional compact badge after the label, such as the scope of the figure. */
  badge?: ItemDescriptorBadge;
  /** Stable identity for the figure. */
  id: string;
  /** Visible term naming the figure. */
  label: string;
}

interface StatStripCurrencyFigure {
  /** ISO 4217 currency code used for locale-aware formatting. */
  currency: string;
  /** Formats `value` as currency, the default. */
  format?: 'currency';
  /** Amount formatted as locale-aware currency; negatives are signed. */
  value: number;
}

interface StatStripDateFigure {
  currency?: never;
  /** Formats `value` as a long locale-aware calendar date. */
  format: 'date';
  value: IsoCalendarDate;
}

interface StatStripNumberFigure {
  currency?: never;
  /** Formats `value` as a locale-aware number, such as a count of days. */
  format: 'number';
  value: number;
}

interface StatStripTextFigure {
  currency?: never;
  /** Shows `value` as short text, such as a scheme name. */
  format: 'text';
  value: string;
}

/** The closed content contract for one labelled figure. */
export type StatStripItemDescriptor = StatStripItemBase &
  (
    | StatStripCurrencyFigure
    | StatStripDateFigure
    | StatStripNumberFigure
    | StatStripTextFigure
  );

interface StatStripBaseProps {
  /** Names the group of figures for assistive technology. */
  'aria-label': string;
}

/** Props for a panel of labelled currency figures. */
export type StatStripProps<T> = StatStripBaseProps &
  (
    | {
        /** Returns the closed display descriptor for an application value; optional while loading. */
        getItem?: (item: T) => StatStripItemDescriptor;
        /** Application values displayed as figures; optional while loading. */
        items?: T[];
        /** Replaces the figures with a three-cell loading placeholder. */
        loading: true;
      }
    | {
        /** Returns the closed display descriptor for an application value. */
        getItem: (item: T) => StatStripItemDescriptor;
        /** Application values displayed as figures, in order. */
        items: T[];
        /** Displays the figures instead of a loading placeholder. */
        loading?: false;
      }
  );

function LoadingState({ loadingLabel }: Readonly<{ loadingLabel: string }>) {
  return (
    <div aria-busy="true" className={variants.base.loading}>
      {loadingCells.map(({ figure, id, label }, index) => (
        <div className={variants.base.loadingCell} key={id}>
          <Skeleton
            blockSize={12}
            inlineSize={`min(100%, ${label}px)`}
            label={index === 0 ? loadingLabel : undefined}
            shape="rectangle"
          />
          <Skeleton
            blockSize={32}
            inlineSize={`min(100%, ${figure}px)`}
            shape="rectangle"
          />
        </div>
      ))}
    </div>
  );
}

function Figure({
  descriptor,
  locale,
}: Readonly<{ descriptor: StatStripItemDescriptor; locale: string }>) {
  if (descriptor.format === 'date') {
    return (
      <Typography
        element="span"
        format="date"
        value={descriptor.value}
        variant="heading"
      />
    );
  }

  if (descriptor.format === 'number') {
    return (
      <Typography element="span" numeric variant="heading">
        {new Intl.NumberFormat(locale).format(descriptor.value)}
      </Typography>
    );
  }

  if (descriptor.format === 'text') {
    return (
      <Typography element="span" variant="heading">
        {descriptor.value}
      </Typography>
    );
  }

  return (
    <Typography
      align="start"
      currency={descriptor.currency}
      format="currency"
      value={descriptor.value}
      variant="money"
    />
  );
}

/**
 * Presents a few headline figures side by side in one panel.
 *
 * @summary A labelled strip of currency, date, number or text figures with an owned loading shape.
 */
export function StatStrip<T>(props: Readonly<StatStripProps<T>>) {
  const { locale, messages } = useBreezeContext();
  const { 'aria-label': ariaLabel, getItem, items, loading } = props;

  return (
    <Card aria-label={ariaLabel} padding={0}>
      {loading ? (
        <LoadingState loadingLabel={messages.loading} />
      ) : (
        <dl className={variants.base.list}>
          {items
            .map((item) => getItem(item))
            .map((descriptor, index) => (
              <div
                className={[
                  variants.base.cell,
                  index > 0 && variants.state.divided,
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={descriptor.id}
              >
                <dt className={variants.base.label}>
                  {descriptor.label}
                  {descriptor.badge && (
                    <>
                      {' '}
                      <Badge
                        aria-label={descriptor.badge['aria-label']}
                        variant={descriptor.badge.variant}
                      >
                        {descriptor.badge.children}
                      </Badge>
                    </>
                  )}
                </dt>
                <dd className={variants.base.figure}>
                  <Figure descriptor={descriptor} locale={locale} />
                </dd>
              </div>
            ))}
        </dl>
      )}
    </Card>
  );
}
