import { ReactNode } from 'react';
import TTheme from '../utils/theme';
import Table from './Table';
import TableBody from './TableBody';
import TableHead from './TableHead';
import TableRow from './TableRow';

export interface IDataTableProps<T> {
  header?: ReactNode;
  items: T[];
  noResults: ReactNode;
  theme?: TTheme;
  row: (item: T) => ReactNode;
}

function DataTable<T>({
  header = null,
  items,
  noResults,
  row,
  theme = 'primary',
}: IDataTableProps<T>) {
  if (items.length === 0) {
    return <>{noResults}</>;
  }

  return (
    <Table>
      {header && (
        <TableHead>
          <TableRow colour={theme}>{header}</TableRow>
        </TableHead>
      )}

      <TableBody>
        {items.map((item, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <TableRow key={i}>{row(item)}</TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default DataTable;
