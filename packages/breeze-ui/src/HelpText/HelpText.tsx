import { memo } from 'react';
import styled from 'styled-components';

const helpTextSpacing = {
  lg: '20px',
  md: '10px',
  sm: '5px',
};

interface IHelpText {
  error: boolean;
  spacing: keyof typeof helpTextSpacing;
}

const HelpText = styled.p<IHelpText>`
  ${({ error, spacing }) => `
    color: ${error ? 'rgb(199,56,79)' : '#999'};
    font-size: 0.75rem;
    margin-bottom: ${helpTextSpacing[spacing]};
  `}
`;

export default memo(HelpText);
