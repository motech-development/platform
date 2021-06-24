import { FC } from 'react';

const Avatar: FC<{
  alt: string;
  src: string;
  width?: number | 'auto';
}> = ({ alt, src, width = 'auto' }) => (
  <img className={`h-${width} w-${width} rounded-full`} src={src} alt={alt} />
);

export default Avatar;
