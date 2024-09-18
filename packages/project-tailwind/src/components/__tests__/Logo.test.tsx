import { setup } from '../../utilities/jest';
import { Logo } from '../Logo';

describe('Logo', () => {
  it('should render the logo', () => {
    const { asFragment } = setup(<Logo alt="Motech Development" />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should apply native svg attributes', () => {
    const { asFragment } = setup(
      <Logo className="h-40 w-40 text-blue-600" alt="Motech Development" />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
