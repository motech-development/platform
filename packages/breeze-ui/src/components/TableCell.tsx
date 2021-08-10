import { FC, HTMLProps } from 'react';

export interface ITableCellProps extends HTMLProps<HTMLTableDataCellElement> {
  as?: 'td' | 'th';
  noWrap?: boolean;
}

// {
//   as = 'td',
//   noWrap = true,
//   ...rest
// }
const TableCell: FC<ITableCellProps> = () => <div />;

export default TableCell;
