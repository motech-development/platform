import { FC, HTMLProps, ReactNode } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  border-bottom: 2px solid #007fa8;
  display: block;
  overflow-x: auto;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;
`;

interface IBaseTable {
  $fixed: boolean;
}

const BaseTable = styled.table<IBaseTable>`
  ${({ $fixed }) => `
    background-color: #fff;
    max-width: 100%;
    table-layout: ${$fixed ? 'fixed' : 'auto'};
    width: 100%;
  `}
`;

export interface ITableProps extends HTMLProps<HTMLTableElement> {
  children: ReactNode;
  fixed?: boolean;
}

const Table: FC<ITableProps> = ({ children, fixed = false, ...rest }) => (
  <Wrapper>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <BaseTable $fixed={fixed} {...rest}>
      {children}
    </BaseTable>
  </Wrapper>
);

export default Table;
