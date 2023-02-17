import { render } from '@testing-library/react';
import { Avatar } from '../Avatar';

describe('Avatar', () => {
  it('should correctly render component when no styles are set', () => {
    const { asFragment } = render(
      <Avatar
        alt="Alt text"
        src="https://www.gravatar.com/avatar/8801091e665fdac669daa63d32167b7b"
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should correctly render component when custom styles are set', () => {
    const { asFragment } = render(
      <Avatar
        className="h-auto w-auto"
        alt="Alt text"
        src="https://www.gravatar.com/avatar/8801091e665fdac669daa63d32167b7b"
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
