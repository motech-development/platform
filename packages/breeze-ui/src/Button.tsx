import React, { FC } from 'react';
import styled from 'styled-components';

const BaseButton = styled.button`
  appearance: none;
  vertical-align: middle;
  user-select: none;
  white-space: nowrap;
`;

export interface IButtonProps {
  type?: 'submit' | 'reset' | 'button';
}

const Button: FC<IButtonProps> = ({ children, type = 'button' }) => {
  return <BaseButton type={type}>{children}</BaseButton>;
};

export default Button;
