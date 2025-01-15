import { FC, ReactNode } from 'react';
import styled from 'styled-components';
import HelpText from '../HelpText/HelpText';
import InputAlert from '../InputAlert/InputAlert';
import Tooltip from '../Tooltip/Tooltip';
import ValidatorWrapper from '../ValidatorWrapper/ValidatorWrapper';

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
  spacing: 'lg' | 'md' | 'sm';
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

export default FieldSet;
