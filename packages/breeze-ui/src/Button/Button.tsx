import { darken } from 'polished';
import React, { FC, HTMLAttributes, memo } from 'react';
import styled, { ThemeProvider } from 'styled-components';

interface IButtonTheme {
  [name: string]: {
    background: string;
    colour: string;
  };
}

const buttonTheme: IButtonTheme = {
  danger: {
    background: 'rgb(199,56,79)',
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
    background: 'rgb(0,128,93)',
    colour: '#fff',
  },
};

interface IBaseButton {
  block?: boolean;
  colour?: keyof IButtonTheme;
  size?: 'sm' | 'md' | 'lg';
}

const BaseButton = styled.button<IBaseButton>`
  ${({ block, colour = 'primary', size = 'md', theme }) => `
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

    ${
      block
        ? `
          display: block;
          width: 100%;
        `
        : `
          display: inline-block;
        `
    }

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

    :disabled {
      background-color: ${theme[colour].background};
      opacity: .6;
    }
  `}
`;

export interface IButtonProps
  extends IBaseButton,
    HTMLAttributes<HTMLButtonElement> {
  block?: boolean;
  disabled?: boolean;
  type?: 'submit' | 'reset' | 'button';
}

const Button: FC<IButtonProps> = ({
  block = false,
  children,
  colour,
  disabled = false,
  size,
  type = 'button',
  ...rest
}) => (
  <ThemeProvider theme={buttonTheme}>
    <BaseButton
      block={block}
      colour={colour}
      type={type}
      size={size}
      disabled={disabled}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    >
      {children}
    </BaseButton>
  </ThemeProvider>
);

export default memo(Button);
