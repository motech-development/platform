import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ElementType, FC, memo, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';

type AlertSpacing = 'sm' | 'md' | 'lg';

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
  colour: keyof typeof alertTheme;
  spacing: AlertSpacing;
}

const BaseAlert = styled.div<IBaseAlert>`
  ${({ colour, spacing, theme }) => `
    background-color: ${theme[colour].background};
    color: ${theme[colour].colour};
    margin-bottom: ${(() => {
      switch (spacing) {
        case 'lg':
          return '20px';
        case 'md':
          return '10px';
        default:
          return '5px';
      }
    })()};
    padding: 12px 56px 12px 20px;
    position: relative;
  `}
`;

const AlertIconWrapper = styled.div`
  display: inline-block;
  margin-right: 20px;
`;

interface IAlertDismissButton {
  colour: keyof typeof alertTheme;
}

const AlertDismissButton = styled.button<IAlertDismissButton>`
  ${({ colour, theme }) => `
    appearance: none;
    background-color: ${theme[colour].background};
    border: 0;
    color: ${theme[colour].colour};
    cursor: pointer;
    font-size: inherit;
    margin: 0;
    padding: 0;
    position: absolute;
    right: 20px;
    top: 12px;
  `}
`;

export interface IAlertProps {
  colour?: keyof typeof alertTheme;
  dismissable?: boolean;
  icon?: ElementType;
  message: string;
  spacing?: AlertSpacing;
}

const Alert: FC<IAlertProps> = ({
  colour = 'primary',
  dismissable = false,
  icon: Icon = null,
  message,
  spacing = 'md',
}) => {
  const [visible, setVisiblity] = useState(true);
  const dismiss = () => {
    setVisiblity(false);
  };

  return (
    <ThemeProvider theme={alertTheme}>
      {visible && (
        <BaseAlert role="alert" colour={colour} spacing={spacing}>
          {Icon && (
            <AlertIconWrapper>
              <Icon />
            </AlertIconWrapper>
          )}

          {message}

          {dismissable && (
            <AlertDismissButton
              type="button"
              aria-label="Dismiss"
              colour={colour}
              onClick={dismiss}
            >
              <FontAwesomeIcon icon={faTimesCircle} />
            </AlertDismissButton>
          )}
        </BaseAlert>
      )}
    </ThemeProvider>
  );
};

export default memo(Alert);
