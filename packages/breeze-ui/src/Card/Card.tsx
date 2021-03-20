import { FC, ReactNode } from 'react';
import styled, { ThemeProvider } from 'styled-components';

const cardTheme = {
  lg: {
    padding: '20px',
  },
  md: {
    padding: '10px',
  },
  none: {
    padding: '0',
  },
  sm: {
    padding: '5px',
  },
};

type CardPadding = keyof typeof cardTheme;

interface IBaseCard {
  $padding: CardPadding;
}

const BaseCard = styled.div<IBaseCard>`
  ${({ $padding, theme }) => `
    background: #f8f8f8;
    color: #000;
    padding: ${theme[$padding].padding}
  `}
`;

export interface ICardProps {
  children: ReactNode;
  padding?: CardPadding;
}

const Card: FC<ICardProps> = ({ children, padding = 'md' }) => (
  <ThemeProvider theme={cardTheme}>
    <BaseCard $padding={padding}>{children}</BaseCard>
  </ThemeProvider>
);

export default Card;
