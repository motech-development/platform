import React, { FC, ReactNode } from 'react';
import styled, { ThemeProvider } from 'styled-components';

type CardPadding = 'sm' | 'md' | 'lg';

interface ICardTheme {
  [name: string]: {
    padding: string;
  };
}

const cardTheme: ICardTheme = {
  lg: {
    padding: '20px',
  },
  md: {
    padding: '10px',
  },
  sm: {
    padding: '0',
  },
};

interface IBaseCard {
  padding: CardPadding;
}

const BaseCard = styled.div<IBaseCard>`
  ${({ theme, padding }) => `
    background: #fff;
    padding: ${theme[padding].padding}
  `}
`;

export interface ICardProps {
  children: ReactNode;
  padding?: CardPadding;
}

const Card: FC<ICardProps> = ({ children, padding = 'sm' }) => {
  return (
    <ThemeProvider theme={cardTheme}>
      <BaseCard padding={padding}>{children}</BaseCard>
    </ThemeProvider>
  );
};

export default Card;
