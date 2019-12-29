import React, { FC, memo, ReactNode } from 'react';
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
    padding: '5px',
  },
};

interface IBaseCard {
  padding: CardPadding;
}

const BaseCard = styled.div<IBaseCard>`
  ${({ theme, padding }) => `
    background: #f8f8f8;
    padding: ${theme[padding].padding}
  `}
`;

export interface ICardProps {
  children: ReactNode;
  padding?: CardPadding;
}

const Card: FC<ICardProps> = ({ children, padding = 'md' }) => {
  return (
    <ThemeProvider theme={cardTheme}>
      <BaseCard padding={padding}>{children}</BaseCard>
    </ThemeProvider>
  );
};

export default memo(Card);
