import { memo, ReactNode } from 'react';
import Table from '../Table/Table';
import TableBody from '../TableBody/TableBody';
import TableHead from '../TableHead/TableHead';
import TableRow from '../TableRow/TableRow';

type DataTableTheme = 'default' | 'primary' | 'secondary';

export interface IDataTableProps<T> {
  header?: ReactNode;
  items: T[];
  noResults: ReactNode;
  theme?: DataTableTheme;
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

export default memo(DataTable) as typeof DataTable;
