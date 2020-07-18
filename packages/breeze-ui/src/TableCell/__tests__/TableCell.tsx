import { render } from '@testing-library/react';
import React from 'react';
import TableCell from '../TableCell';

describe('TableCell', () => {
  describe('as a cell', () => {
    it('should have the word wrap style applied by default', async () => {
      const { findByTestId } = render(
        <table>
          <tbody>
            <tr>
              <TableCell data-testid="cell">Test</TableCell>
            </tr>
          </tbody>
        </table>,
      );

      await expect(findByTestId('cell')).resolves.toHaveStyle(
        'white-space: nowrap;',
      );
    });

    it('should have the word wrap style applied', async () => {
      const { findByTestId } = render(
        <table>
          <tbody>
            <tr>
              <TableCell noWrap data-testid="cell">
                Test
              </TableCell>
            </tr>
          </tbody>
        </table>,
      );

      await expect(findByTestId('cell')).resolves.toHaveStyle(
        'white-space: nowrap;',
      );
    });

    it('should not have the word wrap style applied', async () => {
      const { findByTestId } = render(
        <table>
          <tbody>
            <tr>
              <TableCell noWrap={false} data-testid="cell">
                Test
              </TableCell>
            </tr>
          </tbody>
        </table>,
      );

      await expect(findByTestId('cell')).resolves.not.toHaveStyle(
        'white-space: nowrap;',
      );
    });
  });

  describe('as a header', () => {
    it('should have the word wrap style applied by default', async () => {
      const { findByTestId } = render(
        <table>
          <thead>
            <tr>
              <TableCell as="th" data-testid="cell">
                Test
              </TableCell>
            </tr>
          </thead>
        </table>,
      );

      await expect(findByTestId('cell')).resolves.toHaveStyle(
        'white-space: nowrap;',
      );
    });

    it('should have the word wrap style applied', async () => {
      const { findByTestId } = render(
        <table>
          <thead>
            <tr>
              <TableCell noWrap as="th" data-testid="cell">
                Test
              </TableCell>
            </tr>
          </thead>
        </table>,
      );

      await expect(findByTestId('cell')).resolves.toHaveStyle(
        'white-space: nowrap;',
      );
    });

    it('should not have the word wrap style applied', async () => {
      const { findByTestId } = render(
        <table>
          <thead>
            <tr>
              <TableCell noWrap={false} as="th" data-testid="cell">
                Test
              </TableCell>
            </tr>
          </thead>
        </table>,
      );

      await expect(findByTestId('cell')).resolves.not.toHaveStyle(
        'white-space: nowrap;',
      );
    });
  });
});
