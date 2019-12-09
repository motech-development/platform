import { memo } from 'react';
import styled from 'styled-components';

export interface ILabelProps {
  active: boolean;
}

export const Label = styled.label<ILabelProps>`
  ${({ active }) => `
    color: #aaa;
    font-size: 16px;
    position: absolute;
    transform-origin: top left;
    transform: translate(0, 16px) scale(1);
    transition: all .1s ease-in-out;

    ${
      active
        ? `
      color: #2e9dc8;
      transform: translate(0, 4px) scale(.75);
    `
        : ``
    }
  `}
`;

export default memo(Label);
