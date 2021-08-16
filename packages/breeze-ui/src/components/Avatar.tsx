import { DetailedHTMLProps, FC, ImgHTMLAttributes } from 'react';
import { classNames } from '../utils/className';

export interface IAvatarProps
  extends DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  alt: string;
  src: string;
}

const Avatar: FC<IAvatarProps> = ({
  alt,
  className = 'h-8 w-8',
  src,
  ...rest
}) => (
  <img
    className={classNames('rounded-full', className)}
    src={src}
    alt={alt}
    {...rest}
  />
);

export default Avatar;
