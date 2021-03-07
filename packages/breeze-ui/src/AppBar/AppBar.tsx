import { FC, memo, ReactNode } from 'react';
import styled, { ThemeProvider } from 'styled-components';

const AppBarInner = styled.div`
  align-items: center;
  display: flex;
  min-height: 64px;
  padding: 0 1rem;
`;

interface IAppBarToolbarBase {
  $colour: keyof typeof appBarTheme;
}

const AppBarToolbar = styled.header<IAppBarToolbarBase>`
  ${({ $colour, theme }) => `
    background-color: ${theme[$colour].background};
    border-bottom: 1px solid ${theme[$colour].border};
    box-sizing: border-box;
    color: ${theme[$colour].colour};
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
    border: string;
    colour: string;
  };
}

const appBarTheme: IAppBarTheme = {
  primary: {
    background: '#161616',
    border: '#222',
    colour: '#fff',
  },
  secondary: {
    background: '#f6f9fc',
    border: '#ccc',
    colour: '#333',
  },
};

interface IAppBarBase {
  $fixed: boolean;
}

const AppBarBase = styled.div<IAppBarBase>`
  ${({ $fixed }) => `
    box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 5px 8px 0 rgba(0, 0, 0, 0.14),
      0 1px 14px 0 rgba(0, 0, 0, 0.12);
    flex-grow: 1;
    left: 0;
    position: ${$fixed ? 'fixed' : 'relative'};
    top: 0;
    width: 100%;
    z-index: 10;
  `}
`;

export interface IAppBarProps {
  children: ReactNode;
  colour?: keyof typeof appBarTheme;
  element?: 'header' | 'div';
  fixed?: boolean;
}

const AppBar: FC<IAppBarProps> = ({
  children,
  colour = 'primary',
  element = 'header',
  fixed = false,
}) => (
  <ThemeProvider theme={appBarTheme}>
    <AppBarBase $fixed={fixed}>
      <AppBarToolbar as={element} $colour={colour}>
        <AppBarInner>{children}</AppBarInner>
      </AppBarToolbar>
    </AppBarBase>
  </ThemeProvider>
);

export default memo(AppBar);
