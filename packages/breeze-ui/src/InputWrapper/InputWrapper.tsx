import React, { ElementType, FC, memo, ReactNode } from 'react';
import styled, { ThemeProvider } from 'styled-components';

type InputSpacing = 'sm' | 'md' | 'lg';

interface IInputWrapperTheme {
  [name: string]: {
    spacing: string;
  };
}

const inputWrapperTheme: IInputWrapperTheme = {
  lg: {
    spacing: '20px',
  },
  md: {
    spacing: '10px',
  },
  sm: {
    spacing: '5px',
  },
};

interface IBaseInputWrapper {
  error: boolean;
  spacing: InputSpacing;
}

const BaseInputWrapper = styled.div<IBaseInputWrapper>`
  ${({ error, theme, spacing }) => `
    background: #fff;
    border-bottom: 2px solid ${error ? 'rgb(199,56,79)' : '#eee'};
    margin-bottom: ${theme[spacing].spacing};
    padding: 0 38px 0 8px;
    position: relative;
  `}
`;

const ValidatorWrapper = styled.div`
  margin-top: -11px;
  position: absolute;
  right: 8px;
  top: 50%;
  z-index: 1;
`;

export interface IInputWrapperProps extends IBaseInputWrapper {
  children: ReactNode;
  tooltip: ElementType;
}

const InputWrapper: FC<IInputWrapperProps> = ({
  children,
  error,
  spacing,
  tooltip: Tooltip,
}) => (
  <ThemeProvider theme={inputWrapperTheme}>
    <BaseInputWrapper error={error} spacing={spacing}>
      {children}

      {error && (
        <ValidatorWrapper>
          <Tooltip />
        </ValidatorWrapper>
      )}
    </BaseInputWrapper>
  </ThemeProvider>
);

export default memo(InputWrapper);
