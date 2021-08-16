import { render } from '@testing-library/react';
import TableRow from '../TableRow';

describe('TableRow', () => {
  it('should have the correct theme by default', () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow>
            <td>Test</td>
          </TableRow>
        </tbody>
      </table>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should have the correct primary theme styles', () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow colour="primary">
            <td>Test</td>
          </TableRow>
        </tbody>
      </table>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should have the correct secondary theme styles', () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow colour="secondary">
            <td>Test</td>
          </TableRow>
        </tbody>
      </table>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should have the correct success theme styles', () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow colour="success">
            <td>Test</td>
          </TableRow>
        </tbody>
      </table>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should have the correct warning theme styles', () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow colour="warning">
            <td>Test</td>
          </TableRow>
        </tbody>
      </table>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should have the correct danger theme styles', () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow colour="danger">
            <td>Test</td>
          </TableRow>
        </tbody>
      </table>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
