import React, { ElementType, FC, memo } from 'react';
import styled, { ThemeProvider } from 'styled-components';

interface IAlertTheme {
  [name: string]: {
    background: string;
    colour: string;
  };
}

const alertTheme: IAlertTheme = {
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

interface IBaseAlert {
  colour: keyof IAlertTheme;
}

const BaseAlert = styled.div<IBaseAlert>`
  ${({ colour, theme }) => `
    background-color: ${theme[colour].background};
    color: ${theme[colour].colour};
    margin-bottom: 16px;
    padding: 12px 20px;
    position: relative;
  `}
`;

const AlertIconWrapper = styled.div`
  display: inline-block;
  margin-right: 20px;
`;

export interface IAlertProps {
  colour?: keyof IAlertTheme;
  icon?: ElementType;
  message: string;
}

const Alert: FC<IAlertProps> = ({
  colour = 'primary',
  icon: Icon = null,
  message,
}) => (
  <ThemeProvider theme={alertTheme}>
    <BaseAlert role="alert" colour={colour}>
      {Icon && (
        <AlertIconWrapper>
          <Icon />
        </AlertIconWrapper>
      )}

      {message}
    </BaseAlert>
  </ThemeProvider>
);

export default memo(Alert);
