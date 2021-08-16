import { render } from '@testing-library/react';
import TableCell from '../TableCell';

describe('TableCell', () => {
  describe('as a cell', () => {
    it('should have the word wrap style applied by default', () => {
      const { container } = render(
        <table>
          <tbody>
            <tr>
              <TableCell data-testid="cell">Test</TableCell>
            </tr>
          </tbody>
        </table>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the word wrap style applied', () => {
      const { container } = render(
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

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should not have the word wrap style applied', () => {
      const { container } = render(
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

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('as a header', () => {
    it('should have the word wrap style applied by default', () => {
      const { container } = render(
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

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the word wrap style applied', () => {
      const { container } = render(
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

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should not have the word wrap style applied', () => {
      const { container } = render(
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

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
