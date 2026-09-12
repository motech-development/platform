import { useBreezeContext } from '../../provider/BreezeContext';
import { Skeleton } from '../Skeleton/Skeleton';

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
  loading?: boolean;
  orientation?: SeparatorOrientation;
}

/**
 * Separates adjacent regions along a horizontal or vertical axis.
 *
 * @summary A semantic one-token divider.
 */
export function Separator({
  loading = false,
  orientation = 'horizontal',
}: Readonly<SeparatorProps>) {
  const { messages } = useBreezeContext();

  if (loading) {
    return (
      <Skeleton
        blockSize={orientation === 'horizontal' ? 1 : '100%'}
        inlineSize={orientation === 'horizontal' ? '100%' : 1}
        label={messages.loading}
        shape="rectangle"
      />
    );
  }

  return (
    <hr
      aria-orientation={orientation}
      className={[variants.base.separator, variants.variant[orientation]].join(
        ' ',
      )}
    />
  );
}
