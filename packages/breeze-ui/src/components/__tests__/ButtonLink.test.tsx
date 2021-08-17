import { render } from '@testing-library/react';
import ButtonLink from '../ButtonLink';

describe('ButtonLink', () => {
  it('should correctly render the component', () => {
    const { container } = render(<ButtonLink type="submit">Button</ButtonLink>);

    expect(container.firstChild).toMatchSnapshot();
  });
});
