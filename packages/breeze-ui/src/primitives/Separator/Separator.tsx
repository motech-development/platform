import { useBreezeContext } from '../../provider/BreezeContext';

const variants = {
  base: {
    separator:
      'breeze:m-0 breeze:shrink-0 breeze:border-0 breeze:bg-breeze-line breeze:forced-colors:bg-[CanvasText]',
  },
  compound: {},
  size: {},
  state: {},
  variant: {
    horizontal: 'breeze:block-breeze-px breeze:inline-full',
    // A percentage block size cannot resolve in an auto-height row.
    vertical: 'breeze:self-stretch breeze:inline-breeze-px',
  },
} as const;

export type SeparatorOrientation = keyof typeof variants.variant;

export interface SeparatorProps {
  /** Sets the divider axis; vertical stretches to its `Inline` or `Grid` row. Defaults to `horizontal`. */
  orientation?: SeparatorOrientation;
}

/**
 * Separates adjacent regions along a horizontal or vertical axis.
 *
 * @summary A semantic one-token divider.
 */
export function Separator({
  orientation = 'horizontal',
}: Readonly<SeparatorProps>) {
  useBreezeContext();

  return (
    <hr
      aria-orientation={orientation}
      className={[variants.base.separator, variants.variant[orientation]].join(
        ' ',
      )}
    />
  );
}
