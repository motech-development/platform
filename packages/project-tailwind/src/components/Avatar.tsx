import { ComponentPropsWithRef } from 'react';

/** Avatar component properties */
export interface IAvatarProps extends ComponentPropsWithRef<'img'> {
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
export function Avatar(props: IAvatarProps) {
  const { alt, className = 'h-8 w-8', src, ...rest } = props;

  return <img {...{ alt, className, src }} {...rest} />;
}
