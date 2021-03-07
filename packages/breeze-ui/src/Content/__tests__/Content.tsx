import { render, RenderResult } from '@testing-library/react';
import Content from '../Content';

describe('Content', () => {
  let component: RenderResult;

  beforeEach(() => {
    component = render(
      <Content>
        <h1 data-testid="heading">Hello world</h1>
      </Content>,
    );
  });

  it('should render with the correct styles', () => {
    const { container } = component;

    expect(container.firstChild).toHaveStyle(`
      background-color: #f8f8f8;
      color: #000;
      display: block;
      padding: 1rem;
    `);
  });

  it('should output content', async () => {
    const { findByTestId } = component;

    await expect(findByTestId('heading')).resolves.toBeInTheDocument();
  });
});
