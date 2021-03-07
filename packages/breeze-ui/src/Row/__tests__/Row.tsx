import { render } from '@testing-library/react';
import Row from '../Row';

describe('Row', () => {
  it('should render with the default styles', () => {
    const { container } = render(
      <Row>
        <div data-testid="col" />
      </Row>,
    );

    expect(container.firstChild).toHaveStyle(`
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(12,1fr);
    `);
  });

  it('should output the correct styles with custom sizes', () => {
    const { container } = render(
      <Row columns={10} gutter="12px">
        <div data-testid="col" />
      </Row>,
    );

    expect(container.firstChild).toHaveStyle(`
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(10,1fr);
    `);
  });

  it('should render content', async () => {
    const { findByTestId } = render(
      <Row columns={10} gutter="12px">
        <div data-testid="col" />
      </Row>,
    );

    await expect(findByTestId('col')).resolves.toBeDefined();
  });
});
