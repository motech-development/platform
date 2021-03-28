import { render, RenderResult } from '@testing-library/react';
import InputAlert from '../InputAlert';

describe('InputAlert', () => {
  let component: RenderResult;

  beforeEach(() => {
    component = render(<InputAlert message="This is a message" />);
  });

  it('should render with the correct background and colour', () => {
    const { container } = component;

    expect(container.firstChild).toHaveStyle(`
      background-color: rgb(199,56,79);
      color: #fff;
    `);
  });
});
