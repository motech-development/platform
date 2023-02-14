import { TableCell, useBreakpoint } from '@motech-development/breeze-ui';
import { ReactNode } from 'react';
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

function TransactionDetailsCell({ children }: ITransactionDetailsCell) {
  const breakpoint = useBreakpoint();

  return <Cell breakpoint={breakpoint}>{children}</Cell>;
}

export default TransactionDetailsCell;
