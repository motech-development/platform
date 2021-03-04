/* eslint-disable react/jsx-props-no-spreading */
import React, { FC, memo, TdHTMLAttributes } from 'react';
import styled from 'styled-components';

const baseStyles = (noWrap: boolean, align = 'inherit') => `
  padding: 10px;
  text-align: ${align};
  vertical-align: middle;
  ${noWrap ? 'white-space: nowrap;' : ''}
`;

interface ITableCell {
  $noWrap: boolean;
}

const TableDataCell = styled.td<ITableCell>`
  ${({ align, $noWrap }) => `
    ${baseStyles($noWrap, align)}
    font-weight: 300;
  `}
`;

const TableHeadCell = styled.th<ITableCell>`
  ${({ align, $noWrap }) => `
    ${baseStyles($noWrap, align)}
    font-family: 'Cabin', sans-serif;
    font-weight: 600;
  `}
`;

export interface ITableCellProps
  extends TdHTMLAttributes<HTMLTableDataCellElement> {
  as?: 'td' | 'th';
  noWrap?: boolean;
}

const TableCell: FC<ITableCellProps> = ({
  as = 'td',
  noWrap = true,
  ...rest
}) =>
  as === 'td' ? (
    <TableDataCell $noWrap={noWrap} {...rest} />
  ) : (
    <TableHeadCell $noWrap={noWrap} {...rest} />
  );

export default memo(TableCell);
