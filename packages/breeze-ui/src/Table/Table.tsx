import React, { FC, memo, ReactNode } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  border-bottom: 2px solid #2e9dc8;
  display: block;
  overflow-x: auto;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;
`;

interface IBaseTable {
  fixed: boolean;
}

const BaseTable = styled.table<IBaseTable>`
  ${({ fixed }) => `
    background-color: #fff;
    max-width: 100%;
    table-layout: ${fixed ? 'fixed' : 'auto'};
    width: 100%;
  `}
`;

export interface ITableProps {
  children: ReactNode;
  fixed?: boolean;
}

const Table: FC<ITableProps> = ({ children, fixed = false }) => (
  <Wrapper>
    <BaseTable fixed={fixed}>{children}</BaseTable>
  </Wrapper>
);

export default memo(Table);
