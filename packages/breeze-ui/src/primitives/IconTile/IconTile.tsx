import { useBreezeContext } from '../../provider/BreezeContext';
import { Icon, type IconName } from '../Icon/Icon';
import { Skeleton } from '../Skeleton/Skeleton';

const variants = {
  base: {
    tile: 'breeze:inline-flex breeze:shrink-0 breeze:items-center breeze:justify-center',
  },
  compound: {},
  size: {
    lg: 'breeze:block-size-breeze-tap breeze:inline-size-breeze-tap',
    sm: 'breeze:block-size-breeze-7 breeze:inline-size-breeze-7',
  },
  state: {},
  variant: {
    shape: {
      circle: 'breeze:rounded-breeze-full',
      square: 'breeze:rounded-breeze-sm',
    },
    tone: {
      brand: 'breeze:bg-breeze-brand-soft breeze:text-breeze-brand-text',
      danger: 'breeze:bg-breeze-danger/10 breeze:text-breeze-danger',
      neutral: 'breeze:bg-breeze-sunken breeze:text-breeze-ink-2',
      positive: 'breeze:bg-breeze-pos-soft breeze:text-breeze-pos',
      warning: 'breeze:bg-breeze-warn-soft breeze:text-breeze-warn',
    },
  },
} as const;

export type IconTileShape = keyof typeof variants.variant.shape;
export type IconTileSize = keyof typeof variants.size;
export type IconTileTone = keyof typeof variants.variant.tone;

export interface IconTileProps {
  /** Names meaningful artwork; omit when nearby text already describes it. */
  label?: string;
  /** Replaces the artwork with an accessible placeholder while preserving the tile. */
  loading?: boolean;
  /** Selects artwork from the curated Breeze icon set. */
  name: IconName;
  /** Selects a circular or rounded-square tile. Defaults to `rounded`. */
  shape?: IconTileShape;
  /** Selects the tile dimensions. Defaults to `md`. */
  size?: IconTileSize;
  /** Selects the semantic colour treatment. Defaults to `neutral`. */
  tone?: IconTileTone;
}

/**
 * Places curated artwork on a semantic colour wash.
 *
 * @summary A compact icon decoration for rows and content states.
 */
export function IconTile({
  label,
  loading = false,
  name,
  shape = 'square',
  size = 'lg',
  tone = 'brand',
}: Readonly<IconTileProps>) {
  const { messages } = useBreezeContext();

  return (
    <span
      className={[
        variants.base.tile,
        variants.variant.tone[tone],
        variants.variant.shape[shape],
        variants.size[size],
      ].join(' ')}
    >
      {loading ? (
        <Skeleton
          blockSize="100%"
          inlineSize="100%"
          label={messages.loading}
          shape={shape === 'circle' ? 'circle' : 'rectangle'}
        />
      ) : (
        <Icon label={label} name={name} size={size === 'lg' ? 'md' : 'sm'} />
      )}
    </span>
  );
}
