import { FC } from 'react';

type TWidth = '8' | '10' | '12' | 'auto';

const styles = (width: TWidth) => {
  switch (width) {
    case '8':
      return 'w-8 h-8';
    case '10':
      return 'w-10 h-10';
    case '12':
      return 'w-12 h-12';
    default:
      return 'w-auto h-auto';
  }
};

const Avatar: FC<{
  alt: string;
  src: string;
  width?: TWidth;
}> = ({ alt, src, width = 'auto' }) => (
  <img className={`rounded-full ${styles(width)}`} src={src} alt={alt} />
);

export default Avatar;
