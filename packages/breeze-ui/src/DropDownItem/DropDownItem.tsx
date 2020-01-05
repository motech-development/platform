import React, { FC, memo, ReactNode } from 'react';
import styled from 'styled-components';

const Item = styled.div`
  border-bottom: 1px solid #ccc;
  margin: 0 0 5px;
  padding: 5px 0 10px;
`;

export interface IDropDownItemProps {
  children: ReactNode;
}

const DropDownItem: FC<IDropDownItemProps> = ({ children }) => (
  <Item>{children}</Item>
);

export default memo(DropDownItem);
