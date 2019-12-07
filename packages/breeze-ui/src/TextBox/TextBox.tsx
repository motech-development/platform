import React, { FC } from 'react';
import styled from 'styled-components';

const BaseTextBox = styled.input``;

export interface IButtonProps {
  type?: 'email' | 'password' | 'text';
}

const TextBox: FC<IButtonProps> = ({ type = 'text' }) => {
  return <BaseTextBox type={type} />;
};

export default TextBox;
