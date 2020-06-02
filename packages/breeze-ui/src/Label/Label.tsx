import { memo } from 'react';
import styled from 'styled-components';

export interface ILabelProps {
  active: boolean;
  error: boolean;
}

const Label = styled('label').withConfig({
  shouldForwardProp: prop => !['active', 'error'].includes(prop),
})<ILabelProps>`
  ${({ active, error }) => `
    color: ${(() => {
      if (error) {
        return 'rgb(199,56,79)';
      }

      if (active) {
        return '#007fa8';
      }

      return '#767676';
    })()};
    font-size: 16px;
    pointer-events: none;
    position: absolute;
    transform: ${
      active ? 'translate(0,4px) scale(.75)' : 'translate(0,16px) scale(1)'
    };
    transform-origin: top left;
    transition: all .1s ease-in-out;
  `}
`;

export default memo(Label);
