import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC, memo, ReactNode, useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';

type AlertSpacing = 'sm' | 'md' | 'lg';

const alertTheme = {
  danger: {
    background: 'rgb(199,56,79)',
    colour: '#fff',
  },
  primary: {
    background: '#007fa8',
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

export type AlertTheme = keyof typeof alertTheme;

interface IBaseAlert {
  $colour: AlertTheme;
  $icon: boolean;
  $spacing: AlertSpacing;
}

const BaseAlert = styled.div<IBaseAlert>`
  ${({ $colour, $icon, $spacing, theme }) => `
    background-color: ${theme[$colour].background};
    color: ${theme[$colour].colour};
    margin-bottom: ${(() => {
      switch ($spacing) {
        case 'lg':
          return '20px';
        case 'md':
          return '10px';
        default:
          return '5px';
      }
    })()};
    padding: 12px 56px 12px ${$icon ? '56px' : '20px'};
    position: relative;
  `}
`;

const AlertIconWrapper = styled.div`
  left: 20px;
  position: absolute;
  top: 12px;
`;

interface IAlertDismissButton {
  $colour: AlertTheme;
}

const AlertDismissButton = styled.button<IAlertDismissButton>`
  ${({ $colour, theme }) => `
    appearance: none;
    background-color: ${theme[$colour].background};
    border: 0;
    color: ${theme[$colour].colour};
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
  colour?: AlertTheme;
  dismissable?: boolean | number;
  icon?: ReactNode;
  message: string;
  spacing?: AlertSpacing;
  onDismiss?(): void;
}

const Alert: FC<IAlertProps> = ({
  colour = 'primary',
  dismissable = false,
  icon = null,
  message,
  spacing = 'md',
  onDismiss = null,
}) => {
  const [visible, setVisiblity] = useState(true);
  const dismiss = () => {
    setVisiblity(false);

    if (onDismiss) {
      onDismiss();
    }
  };

  useEffect(
    () => () => {
      setVisiblity(false);
    },
    [],
  );

  useEffect(() => {
    let timeout: number;

    if (typeof dismissable === 'number') {
      timeout = setTimeout(dismiss, dismissable);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (visible) {
    return (
      <ThemeProvider theme={alertTheme}>
        <BaseAlert
          role="alert"
          $colour={colour}
          $icon={!!icon}
          $spacing={spacing}
        >
          {icon && <AlertIconWrapper>{icon}</AlertIconWrapper>}

          {message}

          {dismissable && (
            <AlertDismissButton
              type="button"
              aria-label="Dismiss"
              $colour={colour}
              onClick={dismiss}
            >
              <FontAwesomeIcon icon={faTimes} />
            </AlertDismissButton>
          )}
        </BaseAlert>
      </ThemeProvider>
    );
  }

  return null;
};

export default memo(Alert);
