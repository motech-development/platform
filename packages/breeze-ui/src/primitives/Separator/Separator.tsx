const variants = {
  base: {
    separator:
      'breeze:m-0 breeze:shrink-0 breeze:border-0 breeze:bg-breeze-line breeze:forced-colors:bg-[CanvasText]',
  },
  compound: {},
  size: {},
  state: {},
  variant: {
    horizontal: 'breeze:block-size-breeze-px breeze:inline-size-full',
    vertical: 'breeze:block-size-full breeze:inline-size-breeze-px',
  },
} as const;

export type SeparatorOrientation = keyof typeof variants.variant;

export interface SeparatorProps {
  /** Sets the divider axis. Defaults to `horizontal`. */
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
  return (
    <hr
      aria-orientation={orientation}
      className={[variants.base.separator, variants.variant[orientation]].join(
        ' ',
      )}
    />
  );
}
