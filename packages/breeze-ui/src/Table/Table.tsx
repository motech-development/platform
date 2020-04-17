import React, { FC, memo, ReactNode } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: block;
  overflow-x: auto;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;
`;

const BaseTable = styled.table`
  max-width: 100%;
  width: 100%;
`;

export interface ITableProps {
  children: ReactNode;
}

const Table: FC<ITableProps> = ({ children }) => (
  <Wrapper>
    <BaseTable>{children}</BaseTable>
  </Wrapper>
);

export default memo(Table);
