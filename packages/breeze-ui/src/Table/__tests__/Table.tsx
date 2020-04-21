import { render, RenderResult } from '@testing-library/react';
import React from 'react';
import TableBody from '../../TableBody/TableBody';
import TableCell from '../../TableCell/TableCell';
import TableHead from '../../TableHead/TableHead';
import TableRow from '../../TableRow/TableRow';
import Table from '../Table';

describe('Table', () => {
  let component: RenderResult;

  describe('when not fixed', () => {
    beforeEach(() => {
      component = render(
        <Table>
          <TableHead data-testid="table-head">
            <TableRow colour="primary">
              <TableCell as="th" colSpan={2}>
                My table
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody data-testid="table-body">
            <TableRow colour="primary" data-testid="primary-row">
              <TableCell as="th" colSpan={2}>
                16th April 2019
              </TableCell>
            </TableRow>

            <TableRow colour="secondary" data-testid="secondary-row">
              <TableCell as="th" data-testid="table-cell-header">
                Transaction
              </TableCell>
              <TableCell as="th">Value</TableCell>
            </TableRow>

            <TableRow data-testid="default-row">
              <TableCell>Payment from Joe Bloggs</TableCell>
              <TableCell data-testid="table-cell" align="left">
                £150
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Lunch</TableCell>
              <TableCell>-£5.25</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
    });

    it('should have responsive wrapper', () => {
      const { container } = component;
      const div = container.querySelector('div');

      expect(div).toHaveStyle(`
        border-bottom: 2px solid #2e9dc8;
        display: block;
        overflow-x: auto;
        width: 100%;
      `);
    });

    it('should have the correct table style', async () => {
      const { findByRole } = component;

      await expect(findByRole('table')).resolves.toHaveStyle(`
        max-width: 100%;
        table-layout: auto;
        width: 100%;
      `);
    });

    it('should have a table header with the correct styles', async () => {
      const { findByTestId } = component;

      await expect(findByTestId('table-head')).resolves.toHaveStyle(`
        font-weight: 600;
      `);
    });

    it('should have a table body with the correct styles', async () => {
      const { findByTestId } = component;

      await expect(findByTestId('table-body')).resolves.toHaveStyle(`
        background-color: #fff;
        color: #000;
      `);
    });

    it('should have the correct cell styles', async () => {
      const { findByTestId } = component;

      await expect(findByTestId('table-cell')).resolves.toHaveStyle(`
        font-weight: 300;
        padding: 10px;
        text-align: left;
        vertical-align: middle;
        white-space: nowrap;
      `);
    });

    it('should have the correct header cell styles', async () => {
      const { findByTestId } = component;

      await expect(findByTestId('table-cell-header')).resolves.toHaveStyle(`
        font-family: 'Cabin',sans-serif;
        font-weight: 600;
        padding: 10px;
        text-align: inherit;
        vertical-align: middle;
        white-space: nowrap;
      `);
    });

    it('should have the correct default row styles', async () => {
      const { findByTestId } = component;

      await expect(findByTestId('default-row')).resolves.toHaveStyle(`
        background-color: #fff;
        border-bottom: 2px solid #eee;
        color: #000;
      `);
    });

    it('should have the correct primary row styles', async () => {
      const { findByTestId } = component;

      await expect(findByTestId('primary-row')).resolves.toHaveStyle(`
        background-color: #2e9dc8;
        border-bottom: 2px solid 2px solid #2c96c0;
        color: #fff;
      `);
    });

    it('should have the correct secondary row styles', async () => {
      const { findByTestId } = component;

      await expect(findByTestId('secondary-row')).resolves.toHaveStyle(`
        background-color: #f6f9fc;
        border-bottom: 2px solid #eee;
        color: #333;
      `);
    });
  });

  describe('when fixed', () => {
    beforeEach(() => {
      component = render(
        <Table fixed>
          <TableHead data-testid="table-head">
            <TableRow colour="primary">
              <TableCell as="th" colSpan={2}>
                My table
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody data-testid="table-body">
            <TableRow colour="primary" data-testid="primary-row">
              <TableCell as="th" colSpan={2}>
                16th April 2019
              </TableCell>
            </TableRow>

            <TableRow colour="secondary" data-testid="secondary-row">
              <TableCell as="th" data-testid="table-cell-header">
                Transaction
              </TableCell>
              <TableCell as="th">Value</TableCell>
            </TableRow>

            <TableRow data-testid="default-row">
              <TableCell>Payment from Joe Bloggs</TableCell>
              <TableCell data-testid="table-cell" align="left">
                £150
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Lunch</TableCell>
              <TableCell>-£5.25</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
    });

    it('should have the correct table style', async () => {
      const { findByRole } = component;

      await expect(findByRole('table')).resolves.toHaveStyle(`
        max-width: 100%;
        table-layout: fixed;
        width: 100%;
      `);
    });
  });
});
