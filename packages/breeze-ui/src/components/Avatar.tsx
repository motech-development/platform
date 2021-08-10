import { FC } from 'react';

export interface IAvatarProps {
  alt: string;
  src: string;
  width?: number;
}

// { alt, src, width = 0 }
const Avatar: FC<IAvatarProps> = () => <div />;

export default Avatar;
