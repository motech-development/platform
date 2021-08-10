import { FC, ReactNode } from 'react';

export interface ITableBodyProps {
  children: ReactNode;
}

const TableBody: FC<ITableBodyProps> = ({ children }) => (
  <tbody>{children}</tbody>
);

export default TableBody;
