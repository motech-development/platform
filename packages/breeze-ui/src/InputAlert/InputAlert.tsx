import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC, memo, ReactNode } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  background-color: rgb(199, 56, 79);
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  display: block;
  height: 22px;
  line-height: 22px;
  text-align: center;
  width: 22px;
`;

export interface IInputAlertProps {
  message: ReactNode;
}

const InputAlert: FC<IInputAlertProps> = () => (
  <Wrapper role="alert">
    <FontAwesomeIcon icon={faExclamation} />
  </Wrapper>
);

export default memo(InputAlert);
