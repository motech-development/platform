import { memo } from 'react';
import styled from 'styled-components';

const helpTextSpacing = {
  lg: '20px',
  md: '10px',
  sm: '5px',
};

export interface IHelpTextProps {
  error: boolean;
  spacing: keyof typeof helpTextSpacing;
}

const HelpText = styled('p').withConfig({
  shouldForwardProp: prop => !['error', 'spacing'].includes(prop),
})<IHelpTextProps>`
  ${({ error, spacing }) => `
    color: ${error ? 'rgb(199,56,79)' : '#727272'};
    font-size: 0.75rem;
    margin-bottom: ${helpTextSpacing[spacing]};
  `}
`;

export default memo(HelpText);
