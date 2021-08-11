import { render } from '@testing-library/react';
import Logo from '../Logo';

describe('Logo', () => {
  it('should correctly render the logo', () => {
    const { container } = render(<Logo alt="Logo" />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should add additional props', () => {
    const { container } = render(<Logo alt="Logo" className="test-class" />);

    expect(container.firstChild).toHaveClass('test-class');
  });
});
