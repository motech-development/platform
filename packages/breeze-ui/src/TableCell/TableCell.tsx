import { memo } from 'react';
import styled from 'styled-components';

export interface ITableCellProps {
  as?: 'td' | 'th';
}

const TableCell = styled.td<ITableCellProps>`
  ${({ as = 'td' }) => `
    padding: 10px;
    text-align: inherit;
    vertical-align: top;

    ${
      as === 'td'
        ? `
      font-weight: 300;
    `
        : `
      font-family: 'Cabin', sans-serif;
      font-weight: 600;
    `
    }
  `}
`;

export default memo(TableCell);
