import React, { FC, memo, ReactNode } from 'react';
import styled, { ThemeProvider } from 'styled-components';

const AppBarInner = styled.div`
  align-items: center;
  display: flex;
  min-height: 64px;
  padding: 0 1rem;
  position: relative;
`;

interface IAppBarToolbarBase {
  colour: keyof IAppBarTheme;
}

const AppBarToolbar = styled.header<IAppBarToolbarBase>`
  ${({ colour, theme }) => `
    background-color: ${theme[colour].background};
    box-sizing: border-box;
    color: ${theme[colour].colour};
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    user-select: none;
    width: 100%;
    z-index: 1100;
  `}
`;

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

const AppBarBase = styled.div`
  flex-grow: 1;
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
    <AppBarBase>
      <AppBarToolbar as={element} colour={colour}>
        <AppBarInner>{children}</AppBarInner>
      </AppBarToolbar>
    </AppBarBase>
  </ThemeProvider>
);

export default memo(AppBar);
