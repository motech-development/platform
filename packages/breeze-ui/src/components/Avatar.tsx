import { FC, forwardRef, ImgHTMLAttributes } from 'react';
import { classNames } from '../utils/className';

export interface IAvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  alt: string;
  src: string;
}

const Avatar: FC<IAvatarProps> = forwardRef<HTMLImageElement, IAvatarProps>(
  ({ alt, className = 'h-8 w-8', src, ...rest }, ref) => (
    <img
      className={classNames('rounded-full', className)}
      src={src}
      alt={alt}
      ref={ref}
      {...rest}
    />
  ),
);

export default Avatar;
