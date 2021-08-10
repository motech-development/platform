import { FC, HTMLProps, ReactNode } from 'react';

export interface ITableProps extends HTMLProps<HTMLTableElement> {
  children: ReactNode;
  fixed?: boolean;
}

// { children, fixed = false, ...rest }
const Table: FC<ITableProps> = () => <div />;

export default Table;
