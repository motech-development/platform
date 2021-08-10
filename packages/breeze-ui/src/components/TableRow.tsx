import { FC, HTMLProps } from 'react';
import TTheme from '../utils/theme';

export interface ITableRowProps extends HTMLProps<HTMLTableRowElement> {
  colour?: TTheme;
}

// { colour = 'default', ...rest }
const TableRow: FC<ITableRowProps> = () => <div />;

export default TableRow;
