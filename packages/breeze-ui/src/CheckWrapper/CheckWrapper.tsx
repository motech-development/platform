import React, { FC, memo, ReactNode } from 'react';
import { darken } from 'polished';
import styled from 'styled-components';

interface ICheckWrapper {
  selected: boolean;
}

const BaseCheckWrapper = styled.div<ICheckWrapper>`
  ${({ selected }) => `
    background: ${selected ? '#2e9dc8' : '#fff'};
    border-bottom: 2px solid ${selected ? darken(0.02, '#2e9dc8') : '#eee'};
    color: ${selected ? '#fff' : '#000'};
    margin-bottom: 10px;
    padding: 0 8px;
    position: relative;
  `}
`;

export interface ICheckWrapperProps {
  children: ReactNode;
  selected: boolean;
}

const CheckWrapper: FC<ICheckWrapperProps> = ({ children, selected }) => (
  <BaseCheckWrapper selected={selected}>{children}</BaseCheckWrapper>
);

export default memo(CheckWrapper);
