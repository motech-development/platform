import { darken } from 'polished';
import { memo } from 'react';
import styled from 'styled-components';

export const buttonTheme = {
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

export interface IBaseButtonProps {
  block?: boolean;
  colour?: keyof typeof buttonTheme;
  size?: 'sm' | 'md' | 'lg';
}

const BaseButton = styled.button<IBaseButtonProps>`
  ${({ block = false, colour = 'primary', size = 'md', theme }) => `
    appearance: none;
    background-color: ${theme[colour].background};
    border: 0;
    color: ${theme[colour].colour};
    cursor: pointer;
    font-family: 'Cabin', sans-serif;
    font-weight: 600;
    position: relative;
    vertical-align: middle;
    text-align: center;
    text-decoration: none;
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
            line-height: 32px;
            padding: ${block ? '0' : '0 16px'};
          `;
        case 'lg':
          return `
            font-size: 18px;
            height: 46px;
            line-height: 46px;
            padding: ${block ? '0' : '0 32px'};
          `;
        default:
          return `
            font-size: 16px;
            height: 40px;
            line-height: 40px;
            padding: ${block ? '0' : '0 24px'};
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

export default memo(BaseButton);
