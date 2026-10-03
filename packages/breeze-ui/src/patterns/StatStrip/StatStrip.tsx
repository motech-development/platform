import type { ItemDescriptorBadge } from '../../collections/item.types';
import { Badge } from '../../primitives/Badge/Badge';
import { Card } from '../../primitives/Card/Card';
import { Skeleton } from '../../primitives/Skeleton/Skeleton';
import { Typography } from '../../primitives/Typography/Typography';
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

/** The closed content contract for one labelled currency figure. */
export interface StatStripItemDescriptor {
  /** Optional compact badge after the label, such as the scope of the figure. */
  badge?: ItemDescriptorBadge;
  /** ISO 4217 currency code used for locale-aware formatting. */
  currency: string;
  /** Stable identity for the figure. */
  id: string;
  /** Visible term naming the figure. */
  label: string;
  /** Amount formatted as locale-aware currency; negatives are signed. */
  value: number;
}

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

/**
 * Presents a few headline currency figures side by side in one panel.
 *
 * @summary A labelled strip of currency figures with an owned loading shape.
 */
export function StatStrip<T>(props: Readonly<StatStripProps<T>>) {
  const { messages } = useBreezeContext();
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
                  <Typography
                    align="start"
                    currency={descriptor.currency}
                    format="currency"
                    value={descriptor.value}
                    variant="money"
                  />
                </dd>
              </div>
            ))}
        </dl>
      )}
    </Card>
  );
}
