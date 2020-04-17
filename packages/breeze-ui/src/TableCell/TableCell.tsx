import { memo } from 'react';
import styled from 'styled-components';

export interface ITableCellProps {
  as?: 'td' | 'th';
}

const TableCell = styled.td<ITableCellProps>`
  ${({ as = 'td' }) => `
    font-weight: ${as === 'td' ? '400' : '600'};
    padding: 10px;
    text-align: inherit;
    vertical-align: top;
  `}
`;

export default memo(TableCell);
