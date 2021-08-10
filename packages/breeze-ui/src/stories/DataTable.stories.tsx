import { storiesOf } from '@storybook/react';
import DataTable from '../components/DataTable';
import TableCell from '../components/TableCell';

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

const stories = storiesOf('DataTable', module);

stories.add('Basic data table', () => (
  <>
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
));
