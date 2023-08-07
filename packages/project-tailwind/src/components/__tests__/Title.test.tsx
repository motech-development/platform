import { setup, themes } from '../../utilities/jest';
import { Title } from '../Title';

describe('Title', () => {
  describe.each(themes)('when theme is "$theme"', ({ theme }) => {
    it('should render the correct output', () => {
      const { asFragment } = setup(
        <Title theme={theme} title="Hello, world" />,
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it('should render the correct output when a subtitle is set', () => {
      const { asFragment } = setup(
        <Title
          theme={theme}
          title="Hello, world"
          subtitle="It's nice to see you"
        />,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
