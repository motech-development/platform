import React, { FC, memo, ReactNode } from 'react';
import styled, { ThemeProvider } from 'styled-components';

interface IAppBarTheme {
  [name: string]: {
    background: string;
    colour: string;
  };
}

const appBarTheme: IAppBarTheme = {
  primary: {
    background: '#161616',
    colour: '#fff',
  },
  secondary: {
    background: '#f6f9fc',
    colour: '#333',
  },
};

interface IAppBarBase {
  colour: keyof IAppBarTheme;
}

const AppBarBase = styled.header<IAppBarBase>`
  ${({ colour, theme }) => `
    align-items: center;
    background-color: ${theme[colour].background};
    color: ${theme[colour].colour};
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    position: relative;
    user-select: none;
  `}
`;

export interface IAppBarProps {
  children: ReactNode;
  colour?: keyof IAppBarTheme;
  element?: 'header' | 'div';
}

const AppBar: FC<IAppBarProps> = ({
  children,
  colour = 'primary',
  element = 'header',
}) => (
  <ThemeProvider theme={appBarTheme}>
    <AppBarBase as={element} colour={colour}>
      {children}
    </AppBarBase>
  </ThemeProvider>
);

export default memo(AppBar);
