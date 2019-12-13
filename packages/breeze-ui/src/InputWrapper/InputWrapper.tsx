import { memo } from 'react';
import styled from 'styled-components';

export interface IInputWrapper {
  error: boolean;
}

export const InputWrapper = styled.div<IInputWrapper>`
  ${({ error }) => `
    background: #fff;
    border-bottom: 2px solid ${error ? 'rgb(199, 56, 79)' : '#ccc'};
    margin-bottom: 8px;
    padding: 0 38px 0 8px;
    position: relative;
  `}
`;

export default memo(InputWrapper);
