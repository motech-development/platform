import { ComponentPropsWithoutRef, forwardRef } from 'react';

/** Avatar component properties */
export interface IAvatarProps extends ComponentPropsWithoutRef<'img'> {
  /** Alternative information text */
  alt: string;

  /** Image path */
  src: string;
}

/**
 * Display user avatar photo
 *
 * @param props - Component props
 *
 * @returns Avatar component
 */
export const Avatar = forwardRef<HTMLImageElement, IAvatarProps>(
  ({ alt, className = 'h-8 w-8', src, ...rest }, ref) => (
    <img {...{ alt, className, ref, src }} {...rest} />
  ),
);
