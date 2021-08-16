import { render } from '@testing-library/react';
import Avatar from '../Avatar';

describe('Avatar', () => {
  it('should correctly render component when no styles are set', () => {
    const { container } = render(
      <Avatar
        alt="Alt text"
        src="https://www.gravatar.com/avatar/8801091e665fdac669daa63d32167b7b"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should correctly render component when custom styles are set', () => {
    const { container } = render(
      <Avatar
        className="w-auto h-auto"
        alt="Alt text"
        src="https://www.gravatar.com/avatar/8801091e665fdac669daa63d32167b7b"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
