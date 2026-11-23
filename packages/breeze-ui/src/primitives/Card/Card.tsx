import type { ReactNode } from 'react';
import { createElement, useId } from 'react';
import getLayoutAccessibility from '../../layout/layout.accessibility';
import type { LayoutGap } from '../../layout/layout.types';
import { useBreezeContext } from '../../provider/BreezeContext';
import { Badge } from '../Badge/Badge';

const variants = {
  base: {
    card: 'breeze:min-inline-0 breeze:rounded-breeze-panel breeze:border breeze:border-solid breeze:border-breeze-line breeze:shadow-breeze-panel',
    description:
      'breeze:m-0 breeze:text-breeze-xs breeze:font-normal breeze:text-breeze-ink-3',
    header:
      'breeze:flex breeze:items-center breeze:gap-breeze-2 breeze:border-be breeze:border-breeze-line breeze:px-breeze-4 breeze:py-breeze-3 breeze:max-breeze-md:flex-wrap',
    heading: 'breeze:flex breeze:min-inline-0 breeze:flex-col',
    spacer: 'breeze:grow',
    title:
      'breeze:m-0 breeze:text-breeze-sm breeze:font-semibold breeze:text-breeze-ink',
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
  /** Short muted text under the title, which also describes the card. */
  description?: string;
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
  /** Unavailable without a `title`. */
  description?: never;
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
  description,
  element = 'div',
  padding = 4,
  title,
  variant = 'surface',
}: Readonly<CardProps>) {
  useBreezeContext();

  const titleId = useId();
  const descriptionId = useId();
  const { accessibleLabel, role } = getLayoutAccessibility(
    ariaLabel ?? title,
    element,
  );
  const titled = title !== undefined;

  return createElement(
    element,
    {
      'aria-describedby': description === undefined ? undefined : descriptionId,
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
          {description === undefined ? (
            <h2 className={variants.base.title} id={titleId}>
              {title}
            </h2>
          ) : (
            <div className={variants.base.heading}>
              <h2 className={variants.base.title} id={titleId}>
                {title}
              </h2>
              <p className={variants.base.description} id={descriptionId}>
                {description}
              </p>
            </div>
          )}
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
