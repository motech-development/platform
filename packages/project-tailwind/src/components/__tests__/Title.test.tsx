import { render } from '@testing-library/react';
import { themes } from '../../utilities/jest';
import { Title } from '../Title';

describe('Title', () => {
  describe.each(themes)('when theme is "$theme"', ({ theme }) => {
    it('should should render the correct output', () => {
      const { asFragment } = render(
        <Title theme={theme} title="Hello, world" />,
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it('should should render the correct output when a subtitle is set', () => {
      const { asFragment } = render(
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
