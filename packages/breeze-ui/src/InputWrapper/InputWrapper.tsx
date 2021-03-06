import { FC, ReactNode } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import HelpText from '../HelpText/HelpText';
import InputAlert from '../InputAlert/InputAlert';
import Tooltip from '../Tooltip/Tooltip';
import ValidatorWrapper from '../ValidatorWrapper/ValidatorWrapper';

const inputWrapperTheme = {
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
  $error: boolean;
  $spacing: keyof typeof inputWrapperTheme;
}

const BaseInputWrapper = styled.div<IBaseInputWrapper>`
  ${({ theme, $error, $spacing }) => `
    background: #fff;
    border-bottom: 2px solid ${$error ? 'rgb(199,56,79)' : '#eee'};
    margin-bottom: ${theme[$spacing].spacing};
    padding: 0 38px 0 8px;
    position: relative;
  `}
`;

export interface IInputWrapperProps {
  children: ReactNode;
  error: boolean;
  helpText?: string;
  message: string;
  name: string;
  spacing: keyof typeof inputWrapperTheme;
}

const InputWrapper: FC<IInputWrapperProps> = ({
  children,
  error,
  helpText = null,
  message,
  name,
  spacing,
}) => {
  const describedBy = `${name}-error`;

  return (
    <ThemeProvider theme={inputWrapperTheme}>
      <BaseInputWrapper $error={error} $spacing={helpText ? 'md' : spacing}>
        {children}

        <ValidatorWrapper>
          {error && (
            <Tooltip
              id={describedBy}
              parent={<InputAlert message={message} />}
              colour="danger"
              placement="left"
              message={message}
            />
          )}
        </ValidatorWrapper>
      </BaseInputWrapper>

      {helpText && (
        <HelpText error={error} spacing={spacing}>
          {helpText}
        </HelpText>
      )}
    </ThemeProvider>
  );
};

export default InputWrapper;
