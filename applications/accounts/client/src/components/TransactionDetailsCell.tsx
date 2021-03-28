import { TableCell, useBreakpoint } from '@motech-development/breeze-ui';
import { FC, memo, ReactNode } from 'react';
import styled from 'styled-components';

interface ICell {
  breakpoint: string;
}

const Cell = styled(TableCell)<ICell>`
  ${({ breakpoint }) => {
    if (['xs', 'sm'].includes(breakpoint)) {
      return `
        max-width: 300px;
        min-width: 300px;
        width: 300px;
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
