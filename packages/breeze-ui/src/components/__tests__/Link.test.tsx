import { render } from '@testing-library/react';
import Link from '../Link';

describe('Link', () => {
  it('should correctly render the component', () => {
    const { container } = render(<Link href="/home">Link</Link>);

    expect(container.firstChild).toMatchSnapshot();
  });
});
