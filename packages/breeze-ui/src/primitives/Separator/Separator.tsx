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
    // A percentage block size cannot resolve in an auto-height row, so a vertical
    // divider stretches to its flex or grid line instead.
    vertical: 'breeze:self-stretch breeze:inline-breeze-px',
  },
} as const;

export type SeparatorOrientation = keyof typeof variants.variant;

export interface SeparatorProps {
  /**
   * Sets the divider axis. Defaults to `horizontal`. A vertical divider stretches
   * to the height of its `Inline` or `Grid` row.
   */
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
