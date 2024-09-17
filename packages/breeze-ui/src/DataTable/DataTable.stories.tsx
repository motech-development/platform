import { withKnobs } from '@storybook/addon-knobs';
import BaseStyles from '../BaseStyles/BaseStyles';
import TableCell from '../TableCell/TableCell';
import DataTable from './DataTable';

export default {
  component: DataTable,
  decorators: [withKnobs],
};

const data = [
  {
    name: 'Item 1',
    price: '£220.00',
  },
  {
    name: 'Item 2',
    price: '£250.50',
  },
  {
    name: 'Item 3',
    price: '£291.36',
  },
];

export const BasicDataTable = {
  name: 'Basic data table',
  render: () => (
    <>
      <BaseStyles />

      <DataTable
        items={data}
        header={
          <>
            <TableCell as="th">Name</TableCell>
            <TableCell as="th">Price</TableCell>
          </>
        }
        row={({ name, price }) => (
          <>
            <TableCell>{name}</TableCell>
            <TableCell>{price}</TableCell>
          </>
        )}
        noResults={<p>No data found</p>}
      />
    </>
  ),
};
