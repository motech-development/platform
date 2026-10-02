import type { ReactNode } from 'react';
import { createElement, useId } from 'react';
import getLayoutAccessibility from '../../layout/layout.accessibility';
import type { LayoutGap } from '../../layout/layout.types';
import { useBreezeContext } from '../../provider/BreezeContext';
import { Badge } from '../Badge/Badge';

const variants = {
  base: {
    card: 'breeze:min-inline-0 breeze:rounded-breeze-panel breeze:border breeze:border-solid breeze:border-breeze-line breeze:shadow-breeze-panel',
    header:
      'breeze:flex breeze:items-center breeze:gap-breeze-2 breeze:border-be breeze:border-breeze-line breeze:px-breeze-4 breeze:py-breeze-3 breeze:max-breeze-md:flex-wrap',
    spacer: 'breeze:grow',
    // Line height mirrors the prototype's Tailwind text-sm default.
    title:
      'breeze:m-0 breeze:text-breeze-sm breeze:font-semibold breeze:leading-[calc(1.25/0.875)] breeze:text-breeze-ink',
  },
  compound: {},
  size: {
    0: 'breeze:p-0',
    1: 'breeze:p-breeze-1',
    2: 'breeze:p-breeze-2',
    3: 'breeze:p-breeze-3',
    4: 'breeze:p-breeze-4',
    5: 'breeze:p-breeze-5',
    6: 'breeze:p-breeze-6',
    7: 'breeze:p-breeze-7',
    8: 'breeze:p-breeze-8',
  },
  state: {
    clipped: 'breeze:overflow-hidden',
  },
  variant: {
    raised: 'breeze:bg-breeze-raised',
    surface: 'breeze:bg-breeze-surface',
  },
} as const;

export type CardVariant = keyof typeof variants.variant;
export type CardElement = 'article' | 'aside' | 'div' | 'section';

interface CardBaseProps {
  /** Content displayed inside the card. */
  children: ReactNode;
  /** Clips content to the rounded card boundary. Defaults to `true`. */
  clipped?: boolean;
  /** Selects the semantic HTML element. Defaults to `div`. */
  element?: CardElement;
  /** Applies padding from the Breeze spacing scale to the content. Defaults to `4`. */
  padding?: LayoutGap;
  /** Selects the card surface treatment. Defaults to `surface`. */
  variant?: CardVariant;
}

interface TitledCardProps extends CardBaseProps {
  /** Unavailable when `title` names the card. */
  'aria-label'?: never;
  /** Trailing header content, such as a link to the full list. */
  action?: ReactNode;
  /** Count displayed beside the title. */
  count?: number;
  /** Heading displayed in the card header, which also names the card. */
  title: string;
}

interface UntitledCardProps extends CardBaseProps {
  /** Names the card region when its visible content does not provide a suitable label. */
  'aria-label'?: string;
  /** Unavailable without a `title`. */
  action?: never;
  /** Unavailable without a `title`. */
  count?: never;
  /** Omit to render the content without a header. */
  title?: never;
}

export type CardProps = TitledCardProps | UntitledCardProps;

/**
 * Decorates related content as a bordered Breeze panel.
 *
 * @summary A closed surface or raised content card.
 */
export function Card({
  'aria-label': ariaLabel,
  action,
  children,
  clipped = true,
  count,
  element = 'div',
  padding = 4,
  title,
  variant = 'surface',
}: Readonly<CardProps>) {
  useBreezeContext();

  const titleId = useId();
  const { accessibleLabel, role } = getLayoutAccessibility(
    ariaLabel ?? title,
    element,
  );
  const titled = title !== undefined;

  return createElement(
    element,
    {
      'aria-label': titled ? undefined : accessibleLabel,
      'aria-labelledby': titled ? titleId : undefined,
      className: [
        variants.base.card,
        variants.variant[variant],
        !titled && variants.size[padding],
        clipped && variants.state.clipped,
      ]
        .filter(Boolean)
        .join(' '),
      role,
    },
    titled ? (
      <>
        <div className={variants.base.header}>
          <h2 className={variants.base.title} id={titleId}>
            {title}
          </h2>
          {count === undefined ? null : <Badge>{count}</Badge>}
          {action === undefined ? null : (
            <>
              <span className={variants.base.spacer} />
              {action}
            </>
          )}
        </div>
        <div className={variants.size[padding]}>{children}</div>
      </>
    ) : (
      children
    ),
  );
}
