import { memo } from 'react';
import styled from 'styled-components';

const CheckableInput = styled.input`
  cursor: pointer;
  height: 100%;
  left: 0;
  margin: 0;
  padding: 0;
  position: absolute;
  opacity: 0;
  top: 0;
  width: 100%;
  z-index: 1;
`;

export default (memo(CheckableInput) as unknown) as typeof CheckableInput;
