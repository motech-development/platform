import { darken } from 'polished';
import React, { FC, memo, ReactChild } from 'react';
import styled, { ThemeProvider } from 'styled-components';

export interface IButtonTheme {
  [name: string]: {
    background: string;
    colour: string;
  };
}

export const buttonTheme: IButtonTheme = {
  danger: {
    background: 'rgb(199, 56, 79)',
    colour: '#fff',
  },
  primary: {
    background: '#2e9dc8',
    colour: '#fff',
  },
  secondary: {
    background: '#f6f9fc',
    colour: '#333',
  },
  success: {
    background: 'rgb(0, 128, 93)',
    colour: '#fff',
  },
};

export interface IBaseButton {
  colour?: keyof IButtonTheme;
  size?: 'sm' | 'md' | 'lg';
}

export const BaseButton = styled.button<IBaseButton>`
  ${({ colour = 'primary', size = 'md', theme }) => `
    appearance: none;
    background-color: ${theme[colour].background};
    border: 0;
    color: ${theme[colour].colour};
    cursor: pointer;
    font-family: 'Cabin', sans-serif;
    font-weight: 600;
    vertical-align: middle;
    user-select: none;
    white-space: nowrap;

    ${(() => {
      switch (size) {
        case 'sm':
          return `
            font-size: 16px;
            height: 32px;
            padding: 1px 16px;
          `;
        case 'lg':
          return `
            font-size: 18px;
            height: 48px;
            padding: 1px 32px;
          `;
        default:
          return `
            font-size: 16px;
            height: 40px;
            padding: 1px 24px;
          `;
      }
    })()}

    :hover {
      background-color: ${darken(0.1, theme[colour].background)};
    }
  `}
`;

export interface IButtonProps extends IBaseButton {
  children: ReactChild;
  type?: 'submit' | 'reset' | 'button';
}

const Button: FC<IButtonProps> = ({
  children,
  colour,
  size,
  type = 'button',
}) => (
  <ThemeProvider theme={buttonTheme}>
    <BaseButton colour={colour} type={type} size={size}>
      {children}
    </BaseButton>
  </ThemeProvider>
);

export default memo(Button);
