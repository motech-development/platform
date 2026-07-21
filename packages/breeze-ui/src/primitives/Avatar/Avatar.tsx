import type { HTMLAttributes, Ref } from 'react';
import { createElement, useState } from 'react';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import { useBreezeContext } from '../../provider/BreezeContext';

const avatar = tv({
  base: 'inline-flex shrink-0 items-center justify-center overflow-hidden font-[family-name:var(--breeze-font-display)] font-bold',
  defaultVariants: {
    shape: 'circle',
    size: 'md',
    tone: 'primary',
  },
  variants: {
    shape: {
      circle: 'rounded-full',
      square: 'rounded-none',
    },
    size: {
      lg: 'size-14 text-lg',
      md: 'size-9 text-sm',
      sm: 'size-9 text-xs',
    },
    tone: {
      accent: 'bg-[var(--breeze-accent-soft)] text-[var(--breeze-accent)]',
      primary: 'bg-[var(--breeze-primary-soft)] text-[var(--breeze-primary)]',
    },
  },
});

/** Canonical entity-marker colour treatments. */
export type AvatarTone = 'accent' | 'primary';

/** Props for a person or entity representation. */
export interface AvatarProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'style'> {
  /** Accessible name for the represented person or entity. */
  name: string;
  /** Optional initials override for compact entity marks. */
  initials?: string;
  /** Ref to the rendered span. */
  ref?: Ref<HTMLSpanElement>;
  /** Circular person mark or square entity mark. Defaults to `circle`. */
  shape?: 'circle' | 'square';
  /** Canonical avatar size. Defaults to `md`. */
  size?: 'sm' | 'md' | 'lg';
  /** Optional image URL. Initials are shown when absent or unavailable. */
  src?: string;
  /** Canonical entity-marker colour. Defaults to `primary`. */
  tone?: AvatarTone;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/u)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => Array.from(part).at(0)?.toUpperCase())
    .join('');
}

/**
 * Renders a named image with a deterministic initials fallback.
 *
 * @summary named image with deterministic initials fallback
 */
export function Avatar({
  className,
  initials,
  name,
  ref,
  shape,
  size,
  src,
  tone = 'primary',
  ...props
}: AvatarProps) {
  useBreezeContext();

  const [failedSource, setFailedSource] = useState<string>();
  const forwardedRef = useForwardedRef(ref);
  const showImage = src !== undefined && failedSource !== src;

  return createElement(
    'span',
    {
      ...props,
      'aria-label': name,
      className: avatar({
        class: className,
        shape,
        size,
        tone,
      }),
      'data-tone': tone,
      ref: forwardedRef,
      role: 'img',
    },
    showImage ? (
      <img
        alt=""
        className="size-full object-cover"
        onError={() => setFailedSource(src)}
        src={src}
      />
    ) : (
      initials ?? getInitials(name)
    ),
  );
}
