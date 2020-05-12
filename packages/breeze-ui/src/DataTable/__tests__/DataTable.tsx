import { render, RenderResult } from '@testing-library/react';
import React from 'react';
import TableCell from '../../TableCell/TableCell';
import DataTable from '../DataTable';

interface IData {
  name: string;
  price: string;
}

describe('DataTable', () => {
  let component: RenderResult;
  let data: IData[];

  beforeEach(() => {
    data = [
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
  });

  describe('with table header', () => {
    beforeEach(() => {
      component = render(
        <DataTable
          items={data}
          header={
            <>
              <TableCell as="th" data-testid="header">
                Name
              </TableCell>
              <TableCell as="th">Price</TableCell>
            </>
          }
          row={({ name, price }) => (
            <>
              <TableCell data-testid="name">{name}</TableCell>
              <TableCell>{price}</TableCell>
            </>
          )}
          noResults={<p data-testid="no-data">No data found</p>}
        />,
      );
    });

    it('should display data', async () => {
      const { findAllByTestId } = component;

      await expect(findAllByTestId('name')).resolves.toHaveLength(3);
    });

    it('should display table header', async () => {
      const { findByTestId } = component;

      await expect(findByTestId('header')).resolves.toBeInTheDocument();
    });
  });

  describe('without a table header', () => {
    beforeEach(() => {
      component = render(
        <DataTable
          items={data}
          row={({ name, price }) => (
            <>
              <TableCell data-testid="name">{name}</TableCell>
              <TableCell>{price}</TableCell>
            </>
          )}
          noResults={<p data-testid="no-data">No data found</p>}
        />,
      );
    });

    it('should not display table header', () => {
      const { container } = component;
      const header = container.querySelectorAll('thead');

      expect(header).toHaveLength(0);
    });
  });

  describe('with no data', () => {
    beforeEach(() => {
      component = render(
        <DataTable
          items={[]}
          header={
            <>
              <TableCell as="th" data-testid="header">
                Name
              </TableCell>
              <TableCell as="th">Price</TableCell>
            </>
          }
          row={({ name, price }) => (
            <>
              <TableCell data-testid="name">{name}</TableCell>
              <TableCell>{price}</TableCell>
            </>
          )}
          noResults={<p data-testid="no-data">No data found</p>}
        />,
      );
    });

    it('should display no result view', async () => {
      const { findByTestId } = component;

      await expect(findByTestId('no-data')).resolves.toBeInTheDocument();
    });
  });
});
