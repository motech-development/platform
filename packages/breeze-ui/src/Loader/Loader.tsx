import React, { FC, memo } from 'react';
import styled from 'styled-components';

interface ICircle {
  $colour: 'default' | 'secondary';
}

const Circle = styled.circle<ICircle>`
  ${({ $colour }) => `
    animation: dash 1.5s ease-in-out infinite;
    stroke: ${$colour === 'default' ? '#2e9dc8' : '#fff'};;
    stroke-linecap: round;

    @keyframes dash {
      0% {
        stroke-dasharray: 1, 150;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -35;
      }
      100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -124;
      }
    }
  `}
`;

const BaseLoader = styled.svg`
  animation: rotate 2s linear infinite;
  height: 50px;
  left: 50%;
  margin: -25px 0 0 -25px;
  position: absolute;
  top: 50%;
  width: 50px;

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
`;

export interface ILoaderProps {
  className?: string;
  colour?: 'default' | 'secondary';
}

const Loader: FC<ILoaderProps> = ({ colour = 'default', className = '' }) => (
  <BaseLoader className={className} viewBox="0 0 50 50">
    <Circle
      $colour={colour}
      cx="25"
      cy="25"
      r="20"
      fill="none"
      strokeWidth="4"
    />
  </BaseLoader>
);

export default memo(Loader);
