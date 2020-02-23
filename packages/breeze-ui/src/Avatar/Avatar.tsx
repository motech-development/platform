import React, { FC, memo } from 'react';
import styled from 'styled-components';

interface IImageProps {
  internalWidth: number;
}

const Image = styled.img<IImageProps>`
  ${({ internalWidth }) => `
    display: block;
    width: ${internalWidth ? `${internalWidth}px` : 'auto'};
  `}
`;

interface IWrapperProps {
  internalWidth: number;
}

const Wrapper = styled.div<IWrapperProps>`
  ${({ internalWidth }) => `
    border-radius: 50%;
    display: inline-block;
    overflow: hidden;
    width: ${internalWidth ? `${internalWidth}px` : 'auto'};
  `}
`;

export interface IAvatarProps {
  alt: string;
  src: string;
  width?: number;
}

const Avatar: FC<IAvatarProps> = ({ alt, src, width = 0 }) => (
  <Wrapper internalWidth={width}>
    <Image alt={alt} src={src} internalWidth={width} />
  </Wrapper>
);

export default memo(Avatar);
