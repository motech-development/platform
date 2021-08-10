import { FC, ReactNode } from 'react';

export interface IRowProps {
  children: ReactNode;
  columns?: number;
  gutter?: string;
}

// { children, columns = 12, gutter = '1rem' }
const Row: FC<IRowProps> = () => <div />;

export default Row;
