import { render } from '@testing-library/react';
import BaseStyles from '../BaseStyles';

describe('BaseStyles', () => {
  it('should render', () => {
    const { container } = render(<BaseStyles />);

    expect(container).toBeInTheDocument();
  });
});
