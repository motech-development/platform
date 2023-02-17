import { render } from '@testing-library/react';
import { Logo } from '../Logo';

describe('Logo', () => {
  it('should render the logo', () => {
    const { asFragment } = render(<Logo alt="Motech Development" />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should apply native svg attributes', () => {
    const { asFragment } = render(
      <Logo className="h-40 w-40 text-blue-600" alt="Motech Development" />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
