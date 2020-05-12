import React, { FC, memo, ReactNode } from 'react';
import { darken } from 'polished';
import styled from 'styled-components';

interface IBaseOptionLabel {
  $disabled: boolean;
  $selected: boolean;
}

const BaseOptionLabel = styled.label<IBaseOptionLabel>`
  ${({ $disabled, $selected }) => `
    cursor: pointer;
    display: inline-flex;
    margin: 0 10px 10px 0;
    padding: 0 8px;
    position: relative;

    ${
      $disabled
        ? `
      background: #fff;
      border-bottom: 2px solid #eee;
      color: #aaa;
    `
        : `
      background: ${$selected ? '#2e9dc8' : '#fff'};
      border-bottom: 2px solid ${$selected ? darken(0.02, '#2e9dc8') : '#eee'};
      color: ${$selected ? '#fff' : '#000'};
    `
    }
  `}
`;

interface IOptionLabel {
  children: ReactNode;
  disabled: boolean;
  selected: boolean;
}

const OptionLabel: FC<IOptionLabel> = ({ children, disabled, selected }) => (
  <BaseOptionLabel $disabled={disabled} $selected={selected}>
    {children}
  </BaseOptionLabel>
);

export default memo(OptionLabel);
