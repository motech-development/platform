import { render, RenderResult } from '@testing-library/react';
import TableBody from '../TableBody';
import TableCell from '../TableCell';
import TableHead from '../TableHead';
import TableRow from '../TableRow';
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

    it('should render the table correctly', () => {
      const { container } = component;

      expect(container.firstChild).toMatchSnapshot();
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

    it('should render the table correctly', () => {
      const { container } = component;

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
