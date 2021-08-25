import { render } from '@testing-library/react';
import Content from '../Content';

describe('Content', () => {
  it('should render correctly as a div by default', () => {
    const { container } = render(
      <Content>
        <h1>Hello world</h1>
      </Content>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render correctly as another element', () => {
    const { container } = render(
      <Content as="section" className="test-class">
        <h1>Hello world</h1>
      </Content>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
