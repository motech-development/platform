import { withA11y } from '@storybook/addon-a11y';
import { storiesOf } from '@storybook/react';
import BaseStyles from '../BaseStyles/BaseStyles';
import DataTable from './DataTable';
import TableCell from '../TableCell/TableCell';

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

stories.addDecorator(withA11y);

stories.add('Basic data table', () => (
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
));
