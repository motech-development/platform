import { setup, sizing, themes } from '../../utilities/jest';
import { Card } from '../Card';

describe('Card', () => {
  describe.each(themes)('when theme is "$theme"', ({ theme }) => {
    it('should render the correct output', () => {
      const { asFragment } = setup(
        <Card theme={theme}>
          <p>Hello, world</p>
        </Card>,
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it('should render the correct output when flex is set', () => {
      const { asFragment } = setup(
        <Card flex theme={theme}>
          <p>Hello, world</p>
        </Card>,
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it.each(sizing)(
      'should render the correct output when padding is "$size"',
      ({ size }) => {
        const { asFragment } = setup(
          <Card theme={theme} padding={size}>
            <p>Hello, world</p>
          </Card>,
        );

        expect(asFragment()).toMatchSnapshot();
      },
    );
  });
});
