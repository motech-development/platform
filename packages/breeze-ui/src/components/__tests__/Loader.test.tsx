import { render } from '@testing-library/react';
import Loader from '../Loader';

describe('Loader', () => {
  it('should render component with default classes', () => {
    const { container } = render(<Loader />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render component with custom css classes', () => {
    const { container } = render(<Loader className="w-10 h-10" />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
