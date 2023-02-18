import { render } from '@testing-library/react';
import { themes } from '../../utilities/jest';
import { Toolbar } from '../Toolbar';

describe('Toolbar', () => {
  describe.each(themes)('when theme is "$theme"', ({ theme }) => {
    it('should correctly render componenet', () => {
      const { asFragment } = render(
        <Toolbar theme={theme}>
          <p>Hello, world</p>
        </Toolbar>,
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it('should correctly render componenet when border is set', () => {
      const { asFragment } = render(
        <Toolbar border theme={theme}>
          <p>Hello, world</p>
        </Toolbar>,
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it('should correctly render componenet when position is fixed', () => {
      const { asFragment } = render(
        <Toolbar fixed theme={theme}>
          <p>Hello, world</p>
        </Toolbar>,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
