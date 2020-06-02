import { memo } from 'react';
import styled from 'styled-components';

export interface ILikeInputProps {
  $disabled: boolean;
}

const LikeInput = styled.div<ILikeInputProps>`
  ${({ $disabled }) => `
    background: #fff;
    border: none;
    color: ${$disabled ? '#767676' : '#333'};
    font-size: 16px;
    line-height: 18px;
    outline: 0;
    padding: 16px 0 10px;
    width: 100%;
  `}
`;

export default memo(LikeInput);
