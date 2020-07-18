import { TableCell, useBreakpoint } from '@motech-development/breeze-ui';
import React, { FC, memo, ReactNode } from 'react';
import styled from 'styled-components';

interface ICell {
  breakpoint: string;
}

const Cell = styled(TableCell)<ICell>`
  ${({ breakpoint }) => {
    if (['xs', 'sm'].includes(breakpoint)) {
      return `
        max-width: 400px;
        min-width: 400px;
        width: 400px;
      `;
    }

    return '';
  }}
`;

export interface ITransactionDetailsCell {
  children: ReactNode;
}

const TransactionDetailsCell: FC<ITransactionDetailsCell> = ({ children }) => {
  const breakpoint = useBreakpoint();

  return <Cell breakpoint={breakpoint}>{children}</Cell>;
};

export default memo(TransactionDetailsCell);
