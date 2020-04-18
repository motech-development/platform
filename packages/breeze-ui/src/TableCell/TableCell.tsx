/* eslint-disable react/jsx-props-no-spreading */
import React, { FC, memo, TdHTMLAttributes } from 'react';
import styled from 'styled-components';

const baseStyles = (align = 'inherit') => `
  padding: 10px;
  text-align: ${align};
  vertical-align: middle;
`;

const TableDataCell = styled.td`
  ${({ align }) => `
    ${baseStyles(align)}
    font-weight: 300;
  `}
`;

const TableHeadCell = styled.th`
  ${({ align }) => `
    ${baseStyles(align)}
    font-family: 'Cabin', sans-serif;
    font-weight: 600;
  `}
`;

export interface ITableCellProps
  extends TdHTMLAttributes<HTMLTableDataCellElement> {
  as?: 'td' | 'th';
}

const TableCell: FC<ITableCellProps> = ({ as = 'td', ...rest }) =>
  as === 'td' ? <TableDataCell {...rest} /> : <TableHeadCell {...rest} />;

export default memo(TableCell);
