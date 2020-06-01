import { memo } from 'react';
import styled from 'styled-components';

export interface ILegendProps {
  error: boolean;
}

const Legend = styled('legend').withConfig({
  shouldForwardProp: prop => !['error'].includes(prop),
})<ILegendProps>`
  ${({ error }) => `
    color: ${error ? 'rgb(199,56,79)' : '#007aa3'};
    font-size: 16px;
    margin-bottom: 10px;
  `}
`;

export default memo(Legend);
