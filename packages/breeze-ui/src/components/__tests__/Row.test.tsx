import { render } from '@testing-library/react';
import Row from '../Row';

describe('Row', () => {
  it('should render with the default styles', () => {
    const { container } = render(
      <Row>
        <div data-testid="col" />
      </Row>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should output the correct styles with custom sizes', () => {
    const { container } = render(
      <Row columns={10} gutter={5}>
        <div data-testid="col" />
      </Row>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render content', () => {
    const { container } = render(
      <Row columns={10} gutter={5}>
        <div data-testid="col" />
      </Row>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
