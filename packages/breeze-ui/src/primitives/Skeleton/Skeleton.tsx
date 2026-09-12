import type { CSSProperties } from 'react';
import { useBreezeContext } from '../../provider/BreezeContext';

const variants = {
  base: {
    skeleton:
      'breeze:block breeze:animate-pulse breeze:appearance-none breeze:bg-breeze-ink-3 breeze:pointer-events-none breeze:forced-colors:outline breeze:forced-colors:outline-1 breeze:forced-colors:outline-[CanvasText]',
  },
  compound: {},
  size: {},
  state: {},
  variant: {
    circle: 'breeze:aspect-square breeze:rounded-breeze-full',
    rectangle: 'breeze:rounded-breeze-sm',
    text: 'breeze:block-size-breeze-3 breeze:inline-size-full breeze:rounded-breeze-xs',
  },
} as const;

export type SkeletonShape = keyof typeof variants.variant;

export interface SkeletonProps {
  /** Any CSS length; Skeleton is the deliberate exception to token-only dimensions. */
  blockSize?: number | string;
  /** Any CSS length; Skeleton is the deliberate exception to token-only dimensions. */
  inlineSize?: number | string;
  /** Announces the loading region. Omit when another component owns the announcement. */
  label?: string;
  /** Selects the placeholder geometry. Defaults to `text`. */
  shape?: SkeletonShape;
}

/**
 * Draws an arbitrary placeholder shaped like the content it will replace.
 *
 * @summary A flexible indeterminate content placeholder.
 */
export function Skeleton({
  blockSize,
  inlineSize,
  label,
  shape = 'text',
}: Readonly<SkeletonProps>) {
  const { getMessageLocale, messages } = useBreezeContext();
  const accessibleLabel = label?.trim() || undefined;
  const circleSize = blockSize ?? inlineSize ?? '0.75rem';

  const dimensions: CSSProperties = {
    blockSize: shape === 'circle' ? circleSize : blockSize,
    inlineSize: shape === 'circle' ? circleSize : inlineSize,
  };

  return (
    <progress
      aria-hidden={accessibleLabel === undefined ? true : undefined}
      aria-label={accessibleLabel}
      className={[variants.base.skeleton, variants.variant[shape]].join(' ')}
      lang={
        accessibleLabel === messages.loading.trim()
          ? getMessageLocale('loading')
          : undefined
      }
      style={dimensions}
    />
  );
}
