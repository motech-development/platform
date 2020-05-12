import React, { FC, memo } from 'react';
import styled from 'styled-components';

interface IImageProps {
  $width: number;
}

const Image = styled.img<IImageProps>`
  ${({ $width }) => `
    display: block;
    width: ${$width ? `${$width}px` : 'auto'};
  `}
`;

interface IWrapperProps {
  $width: number;
}

const Wrapper = styled.div<IWrapperProps>`
  ${({ $width }) => `
    border-radius: 50%;
    display: inline-block;
    overflow: hidden;
    width: ${$width ? `${$width}px` : 'auto'};
  `}
`;

export interface IAvatarProps {
  alt: string;
  src: string;
  width?: number;
}

const Avatar: FC<IAvatarProps> = ({ alt, src, width = 0 }) => (
  <Wrapper $width={width}>
    <Image alt={alt} src={src} $width={width} />
  </Wrapper>
);

export default memo(Avatar);
