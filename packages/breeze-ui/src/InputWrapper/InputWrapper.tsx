import React, { ElementType, FC, memo, ReactNode } from 'react';
import styled from 'styled-components';

interface IBaseInputWrapper {
  error: boolean;
}

const BaseInputWrapper = styled.div<IBaseInputWrapper>`
  ${({ error }) => `
    background: #fff;
    border-bottom: 2px solid ${error ? 'rgb(199, 56, 79)' : '#ccc'};
    margin-bottom: 8px;
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

export interface IInputWrapper extends IBaseInputWrapper {
  children?: ReactNode;
  error: boolean;
  tooltip: ElementType;
}

const InputWrapper: FC<IInputWrapper> = ({
  children,
  error,
  tooltip: Tooltip,
}) => (
  <BaseInputWrapper error={error}>
    {children}

    {error && (
      <ValidatorWrapper>
        <Tooltip />
      </ValidatorWrapper>
    )}
  </BaseInputWrapper>
);

export default memo(InputWrapper);
