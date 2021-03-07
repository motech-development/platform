import { FC, memo, ReactNode } from 'react';
import styled from 'styled-components';

interface IRowContainer {
  $columns: number;
  $gutter: string;
}

const RowContainer = styled.div<IRowContainer>`
  ${({ $columns, $gutter }) => `
    display: grid;
    gap: ${$gutter};
    grid-template-columns: repeat(${$columns},1fr);
  `}
`;

export interface IRowProps {
  children: ReactNode;
  columns?: number;
  gutter?: string;
}

const Row: FC<IRowProps> = ({ children, columns = 12, gutter = '1rem' }) => (
  <RowContainer $columns={columns} $gutter={gutter}>
    {children}
  </RowContainer>
);

export default memo(Row);
