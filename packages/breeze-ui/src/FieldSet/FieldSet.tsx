import React, { FC, memo, ReactNode } from 'react';
import styled from 'styled-components';
import HelpText from '../HelpText/HelpText';
import InputAlert from '../InputAlert/InputAlert';
import Tooltip from '../Tooltip/Tooltip';
import ValidatorWrapper from '../ValidatorWrapper/ValidatorWrapper';

const fieldSetTheme = {
  lg: '20px',
  md: '10px',
  sm: '5px',
};

const BaseFieldSet = styled.fieldset`
  padding-right: 38px;
  position: relative;
`;

export interface IFieldSetProps {
  error: boolean;
  children: ReactNode;
  helpText?: string;
  message: string;
  name: string;
  spacing: keyof typeof fieldSetTheme;
}

const FieldSet: FC<IFieldSetProps> = ({
  error,
  children,
  helpText = null,
  message,
  name,
  spacing,
}) => {
  const describedBy = `${name}-error`;

  return (
    <>
      <BaseFieldSet>
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
      </BaseFieldSet>

      {helpText && (
        <HelpText error={error} spacing={spacing}>
          {helpText}
        </HelpText>
      )}
    </>
  );
};

export default memo(FieldSet);
